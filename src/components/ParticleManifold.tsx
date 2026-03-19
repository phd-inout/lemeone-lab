"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLemeoneStore } from '@/lib/store';
import { DIM } from '@/lib/engine/types';

/**
 * Pseudo Random generator for stable agent properties
 */
function sfc32(a: number, b: number, c: number, d: number) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

/**
 * 13D Particle Manifold (T-SNE approximation) with Physics Engine
 */
const ParticleManifold: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sandboxState = useLemeoneStore((s) => s.sandboxState);
  const agents = sandboxState?.agents || [];
  const productVector = sandboxState?.productVector;
  const pushLine = useLemeoneStore((s) => s.pushLine);

  // Camera State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredAgent, setHoveredAgent] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  // Cache for stable agent coordinates and physics state
  const agentCache = useRef<Array<{ x: number, y: number, vx: number, vy: number, tx: number, ty: number, isAware: boolean, isViral: boolean }>>([]);
  const requestRef = useRef<number>(0);
  // Spatial grid for fast hover detection
  const gridRef = useRef<Map<string, number[]>>(new Map());

  const CANVAS_SIZE = 800;
  const GRID_CELL = 20; // Grid cell size for spatial hashing

  // --- Spatial hashing helpers ---
  const cellKey = (x: number, y: number) => `${Math.floor(x / GRID_CELL)},${Math.floor(y / GRID_CELL)}`;

  const rebuildGrid = useCallback(() => {
    const grid = new Map<string, number[]>();
    agentCache.current.forEach((cache, i) => {
      const key = cellKey(cache.x, cache.y);
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key)!.push(i);
    });
    gridRef.current = grid;
  }, []);

  // --- Canvas sizing (match container) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      // Use a fixed render resolution for perf, CSS auto-scales
      canvas.width = Math.min(rect.width * 2, 1200);
      canvas.height = Math.min(rect.height * 2, 1200);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    const delta = -e.deltaY;
    const newScale = Math.max(0.1, Math.min(20, transform.scale + delta * zoomSpeed * transform.scale));
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    } else {
      // Fast hover using spatial hash grid (only check ~9 cells instead of 10000 agents)
      const canvas = canvasRef.current;
      if (!canvas || !productVector) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert screen coords to world coords
      const worldX = (mouseX - transform.x) / transform.scale;
      const worldY = (mouseY - transform.y) / transform.scale;

      let found = null;
      const cx = Math.floor(worldX / GRID_CELL);
      const cy = Math.floor(worldY / GRID_CELL);

      // Search 3x3 grid neighborhood
      outer:
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${cx + dx},${cy + dy}`;
          const cell = gridRef.current.get(key);
          if (!cell) continue;
          for (const i of cell) {
            const cache = agentCache.current[i];
            if (!cache) continue;
            const distSq = (cache.x - worldX) ** 2 + (cache.y - worldY) ** 2;
            if (distSq < (6) ** 2) {
              found = { agent: agents[i], cache, i };
              break outer;
            }
          }
        }
      }
      setHoveredAgent(found);
      setTooltipPos({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseClick = () => {
      if (hoveredAgent && hoveredAgent.agent.resonance > 0.6 && !hoveredAgent.cache.isAware) {
          pushLine(`[SYSTEM] ⚠ Agent #${hoveredAgent.i} — High match (R:${(hoveredAgent.agent.resonance).toFixed(2)}) but D13_AWARENESS below threshold. Increase marketing spend or channel reach.`);
      } else if (hoveredAgent && hoveredAgent.cache.isAware) {
          pushLine(`[SYSTEM] ✓ Agent #${hoveredAgent.i} — Active customer (R:${(hoveredAgent.agent.resonance).toFixed(2)}). Channel pipeline confirmed. ${hoveredAgent.cache.isViral ? '[VIRAL_VECTOR]' : ''}`);
      }
  };

  const autoFocus = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 0.8 });
  }, []);

  // --- RENDERING ENGINE (PHYSICS LOOP) ---

  // 1. REBUILD CACHE WHEN AGENTS OR PRODUCT VECTOR CHANGES
  useEffect(() => {
    if (!productVector || agents.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const awarenessThreshold = productVector[DIM.AWARENESS];
    const socialLeverage = productVector[DIM.SOCIAL]; // D7
    
    const needsInit = agentCache.current.length !== agents.length;

    if (needsInit) {
       agentCache.current = agents.map((agent, i) => {
           // Initial position: scatter from center based on DNA, not all at the same point!
           let dx = 0; let dy = 0;
           for(let d=0; d<12; d++) {
               const angle = (d / 12) * Math.PI * 2;
               const mag = agent.vector[d] - 0.5;
               dx += Math.cos(angle) * mag;
               dy += Math.sin(angle) * mag;
           }
           const getRnd = sfc32(i, i*2, i*3, i*4);
           const tx = (width / 2) + dx * (width / 3) + (getRnd() - 0.5) * 50;
           const ty = (height / 2) + dy * (height / 3) + (getRnd() - 0.5) * 50;
           return { 
               x: tx + (Math.random() - 0.5) * 30, // Start near target, not at center
               y: ty + (Math.random() - 0.5) * 30,
               vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, 
               tx, ty, 
               isAware: false, isViral: false 
           };
       });
    }

    agentCache.current.forEach((cache, i) => {
        const agent = agents[i];
        if (!needsInit) {
          // Recalculate target positions (agent DNA may have changed after collision)
          let dx = 0; let dy = 0;
          for(let d=0; d<12; d++) {
              const angle = (d / 12) * Math.PI * 2;
              const mag = agent.vector[d] - 0.5;
              dx += Math.cos(angle) * mag;
              dy += Math.sin(angle) * mag;
          }
          const getRnd = sfc32(i, i*2, i*3, i*4);
          cache.tx = (width / 2) + dx * (width / 3) + (getRnd() - 0.5) * 50;
          cache.ty = (height / 2) + dy * (height / 3) + (getRnd() - 0.5) * 50;
        }
        
        // Update dynamic state (D13 Awareness & D7 Social Virality)
        const getRnd2 = sfc32(i*5, i*6, i*7, 1);
        const randSeed = getRnd2();
        cache.isAware = randSeed < awarenessThreshold;
        if (!cache.isAware && randSeed < awarenessThreshold + (socialLeverage * 0.5) && agent.resonance > 0.5) {
            cache.isViral = true; 
            cache.isAware = true;
        } else {
            cache.isViral = false;
        }
    });

    rebuildGrid();
  }, [agents, productVector, rebuildGrid]);

  // 2. RENDER LOOP (ANIMATION)
  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;

    // Clean clear (no ghosting)
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    if (!productVector || agents.length === 0) {
       requestRef.current = requestAnimationFrame(drawLoop);
       return;
    }

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // --- PRODUCT CENTER GRAVITY WELL (subtle visual) ---
    const cx = width / 2;
    const cy = height / 2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 / transform.scale);
    gradient.addColorStop(0, 'rgba(0, 242, 255, 0.06)');
    gradient.addColorStop(1, 'rgba(0, 242, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 120 / transform.scale, 0, Math.PI * 2);
    ctx.fill();

    // DRAW EDGES (D7 VIRALITY)
    ctx.lineWidth = 0.5 / transform.scale;
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.12)';
    for (let i = 0; i < agents.length; i+=10) { 
        const cache = agentCache.current[i];
        if (cache && cache.isViral) {
            for(let j=Math.max(0, i-50); j<Math.min(agents.length, i+50); j++) {
                if(agentCache.current[j] && agentCache.current[j].isAware && !agentCache.current[j].isViral) {
                    ctx.beginPath();
                    ctx.moveTo(cache.x, cache.y);
                    ctx.lineTo(agentCache.current[j].x, agentCache.current[j].y);
                    ctx.stroke();
                    break;
                }
            }
        }
    }

    // DRAW PARTICLES & PHYSICS
    let gridDirty = false;
    agents.forEach((agent, i) => {
      const cache = agentCache.current[i];
      if (!cache) return;
      const res = agent.resonance;
      
      // Brownian motion (subtle shimmer)
      cache.vx += (Math.random() - 0.5) * 0.15;
      cache.vy += (Math.random() - 0.5) * 0.15;
      
      // Gravity towards target based on resonance
      const pull = 0.01 + res * 0.03; 
      cache.vx += (cache.tx - cache.x) * pull;
      cache.vy += (cache.ty - cache.y) * pull;

      // Soft boundary repulsion (keep particles inside canvas)
      if (cache.x < 20) cache.vx += 0.5;
      if (cache.x > width - 20) cache.vx -= 0.5;
      if (cache.y < 20) cache.vy += 0.5;
      if (cache.y > height - 20) cache.vy -= 0.5;
      
      // Friction / dampening
      cache.vx *= 0.88;
      cache.vy *= 0.88;
      
      const prevX = cache.x;
      const prevY = cache.y;
      cache.x += cache.vx;
      cache.y += cache.vy;

      // Check if grid cell changed
      if (Math.floor(prevX / GRID_CELL) !== Math.floor(cache.x / GRID_CELL) || 
          Math.floor(prevY / GRID_CELL) !== Math.floor(cache.y / GRID_CELL)) {
          gridDirty = true;
      }

      let fillStyle = '';
      let radius = 1.5;
      if (cache.isAware) {
         // Bright Particles (Reached by awareness channel)
         let r = Math.floor(255 * Math.max(0, 1 - res * 1.5));
         let g = Math.floor(255 * Math.min(1, res * 1.5));
         
         // Gentle pulse
         const pulse = Math.sin(Date.now() / 500 + i * 0.7) * 0.15 + 0.85;
         r = Math.floor(r * pulse);
         g = Math.floor(g * pulse);
         
         fillStyle = `rgba(${r}, ${g}, 250, ${0.7 + res * 0.3})`; 
         radius = 2.0 + res * 1.5; // High resonance = bigger dot

         // Glow halo for high-resonance aware particles
         if (res > 0.7) {
           ctx.fillStyle = `rgba(${r}, ${g}, 250, 0.1)`;
           ctx.beginPath();
           ctx.arc(cache.x, cache.y, (radius * 3) / transform.scale, 0, Math.PI * 2);
           ctx.fill();
         }
      } else {
         // Dark Particles 
         if (res > 0.7) {
             fillStyle = 'rgba(120, 80, 40, 0.4)'; // High match but unaware → warm amber hint
             radius = 1.8;
         } else {
             fillStyle = 'rgba(25, 25, 30, 0.35)'; // Low match, unaware
         }
      }

      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(cache.x, cache.y, radius / transform.scale, 0, Math.PI * 2); 
      ctx.fill();
    });

    // Periodically rebuild spatial grid (every ~10 frames via dirty flag)
    if (gridDirty) rebuildGrid();

    ctx.restore();

    // 3. UI Overlays (outside camera transform)
    ctx.fillStyle = 'rgba(0, 242, 255, 0.7)';
    ctx.font = '10px monospace';
    ctx.fillText(`N=${agents.length.toLocaleString()} | ZOOM:${transform.scale.toFixed(1)}x`, 10, 20);

    const awareCount = agentCache.current.filter(c => c.isAware).length;
    ctx.fillText(`AWARE: ${awareCount.toLocaleString()} (${(awareCount / agents.length * 100).toFixed(1)}%) | D7_VIRAL`, 10, height - 10);

    requestRef.current = requestAnimationFrame(drawLoop);
  }, [agents, productVector, transform, rebuildGrid]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(drawLoop);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [drawLoop]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square bg-black border border-border-dark rounded overflow-hidden shadow-2xl group">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setHoveredAgent(null); }}
        onClick={handleMouseClick}
        onDoubleClick={autoFocus}
      />
      
      {/* HUD Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={autoFocus}
          className="bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary text-[9px] px-2 py-1 rounded font-mono uppercase"
        >
          [ Reset_Origin ]
        </button>
      </div>

      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 border border-primary/30 rounded text-[9px] text-primary font-mono uppercase tracking-widest pointer-events-none">
        13D T-SNE Manifold
      </div>

      {hoveredAgent && (
          <div 
             className="absolute pointer-events-none bg-black/90 border border-primary/50 p-2 text-[10px] font-mono whitespace-pre text-primary z-50 rounded shadow-lg shadow-primary/10"
             style={{ 
                 left: Math.min(tooltipPos.x + 12, (containerRef.current?.clientWidth || 300) - 180), 
                 top: Math.min(tooltipPos.y + 12, (containerRef.current?.clientHeight || 300) - 80)
             }}
          >
              <span className="text-gray-500">ID:</span> #{hoveredAgent.i}{'  '}
              <span className="text-gray-500">R:</span> {hoveredAgent.agent.resonance.toFixed(3)}{'  '}
              {hoveredAgent.cache.isAware ? (
                <span className="text-green-400">● AWARE</span>
              ) : (
                <span className="text-gray-600">○ DARK</span>
              )}
              {hoveredAgent.cache.isViral && <span className="text-cyan-400"> [VIRAL]</span>}
              {'\n'}
              {hoveredAgent.agent.resonance > 0.6 && !hoveredAgent.cache.isAware && (
                  <span className="text-orange-400">▸ Click: Why isn't this user converting?</span>
              )}
              {hoveredAgent.cache.isAware && hoveredAgent.agent.resonance > 0.8 && (
                  <span className="text-green-300">▸ High-value customer confirmed</span>
              )}
          </div>
      )}
    </div>
  );
};

export default ParticleManifold;
