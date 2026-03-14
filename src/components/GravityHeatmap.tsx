"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLemeoneStore } from '@/lib/store';
import { DIM } from '@/lib/engine/types';

/**
 * GravityHeatmap 2.0: Professional Interactive Camera System
 * Supports: Drag to Pan, Scroll to Zoom, Auto-Focus, Dimension Selection.
 */
const GravityHeatmap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sandboxState = useLemeoneStore((s) => s.sandboxState);
  const agents = sandboxState?.agents || [];
  const productVector = sandboxState?.productVector;

  // Camera State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Dimensions to display (Current Axis)
  const [xAxis, setXAxis] = useState<number>(DIM.PRICE);
  const [yAxis, setYAxis] = useState<number>(DIM.TECH);

  // --- INTERACTION HANDLERS ---

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
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const autoFocus = useCallback(() => {
    if (agents.length === 0) return;
    // Calculate Centroid
    let sumX = 0, sumY = 0;
    agents.forEach(a => {
      sumX += a.vector[xAxis];
      sumY += (1 - a.vector[yAxis]);
    });
    const avgX = sumX / agents.length;
    const avgY = sumY / agents.length;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Target: Move avg to center
    setTransform({
      x: (canvas.width / 2) - (avgX * canvas.width * 2), // Roughly center
      y: (canvas.height / 2) - (avgY * canvas.height * 2),
      scale: 2.0 // Zoom in on the cluster
    });
  }, [agents, xAxis, yAxis]);

  // --- RENDERING ENGINE ---

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Background & Static Grid (Non-transformed)
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // 2. Transformed Space
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Draw Dynamic Grid
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1 / transform.scale;
    for (let i = -5; i <= 15; i++) {
      const pos = (i / 10) * width;
      ctx.beginPath(); ctx.moveTo(pos, -height * 5); ctx.lineTo(pos, height * 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-width * 5, pos); ctx.lineTo(width * 5, pos); ctx.stroke();
    }

    // Draw Agents
    agents.forEach((agent) => {
      const x = agent.vector[xAxis] * width;
      const y = (1 - agent.vector[yAxis]) * height; 
      const res = agent.resonance;

      const r = Math.floor(255 * Math.max(0, 1 - res * 1.5));
      const g = Math.floor(255 * Math.min(1, res * 1.5));
      const alpha = 0.4 + res * 0.6;

      ctx.fillStyle = `rgba(${r}, ${g}, 50, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 2 / transform.scale, 0, Math.PI * 2); 
      ctx.fill();
    });

    // Draw Product Vector
    if (productVector) {
      const px = productVector[xAxis] * width;
      const py = (1 - productVector[yAxis]) * height;

      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 3 / transform.scale;
      ctx.beginPath(); ctx.arc(px, py, 12 / transform.scale, 0, Math.PI * 2); ctx.stroke();
      
      // Crosshair
      ctx.setLineDash([4 / transform.scale, 4 / transform.scale]);
      ctx.beginPath();
      ctx.moveTo(px - 30 / transform.scale, py); ctx.lineTo(px + 30 / transform.scale, py);
      ctx.moveTo(px, py - 30 / transform.scale); ctx.lineTo(px, py + 30 / transform.scale);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();

    // 3. UI Overlays (Fixed position)
    ctx.fillStyle = 'rgba(0, 242, 255, 0.8)';
    ctx.font = '10px monospace';
    ctx.fillText(`N=${agents.length.toLocaleString()} | ZOOM:${transform.scale.toFixed(1)}x`, 10, 20);
    ctx.fillText(`X:${Object.keys(DIM)[xAxis]} | Y:${Object.keys(DIM)[yAxis]}`, 10, height - 10);

  }, [agents, productVector, transform, xAxis, yAxis]);

  // Dimensions for Switcher
  const dimKeys = Object.keys(DIM).filter(k => isNaN(Number(k)));

  return (
    <div className="relative w-full aspect-square bg-black border border-border-dark rounded overflow-hidden shadow-2xl group">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={() => setTransform({ x: 0, y: 0, scale: 0.8 })}
      />
      
      {/* HUD Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={autoFocus}
          className="bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary text-[9px] px-2 py-1 rounded font-mono uppercase"
        >
          [ Auto_Focus ]
        </button>
        <div className="flex gap-1">
            <select 
                className="bg-black/80 border border-border-dark text-[8px] text-gray-400 font-mono p-1 rounded outline-none"
                value={xAxis}
                onChange={(e) => setXAxis(Number(e.target.value))}
            >
                {dimKeys.map((k, i) => <option key={k} value={i}>X:{k}</option>)}
            </select>
            <select 
                className="bg-black/80 border border-border-dark text-[8px] text-gray-400 font-mono p-1 rounded outline-none"
                value={yAxis}
                onChange={(e) => setYAxis(Number(e.target.value))}
            >
                {dimKeys.map((k, i) => <option key={k} value={i}>Y:{k}</option>)}
            </select>
        </div>
      </div>

      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 border border-primary/30 rounded text-[9px] text-primary font-mono uppercase tracking-widest pointer-events-none">
        Dynamic Gravity Field
      </div>
    </div>
  );
};

export default GravityHeatmap;
