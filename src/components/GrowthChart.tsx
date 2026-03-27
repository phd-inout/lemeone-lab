"use client";

import React, { useMemo } from 'react';
import { useLemeoneStore } from '@/lib/store';

export default function GrowthChart() {
    const sandboxState = useLemeoneStore(s => s.sandboxState);
    const history = sandboxState?.history || [];

    const padding = 40;
    const width = 600;
    const height = 300;

    const chartData = useMemo(() => {
        if (history.length === 0) return null;

        const maxEpoch = Math.max(...history.map(h => h.epoch), 1);
        const maxUsers = Math.max(...history.map(h => h.users), 10);
        const maxConv = Math.max(...history.map(h => h.conversion || 0), 0.1);
        
        const getX = (epoch: number) => padding + (epoch / maxEpoch) * (width - 2 * padding);
        const getYUsers = (users: number) => height - padding - (users / maxUsers) * (height - 2 * padding);
        const getYSurvival = (survival: number) => height - padding - (survival * (height - 2 * padding));
        const getYConv = (conv: number) => height - padding - (conv / maxConv) * (height - 2 * padding);

        const userPath = history.map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(h.epoch)} ${getYUsers(h.users)}`).join(' ');
        const survivalPath = history.map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(h.epoch)} ${getYSurvival(h.survival)}`).join(' ');
        const convPath = history.map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(h.epoch)} ${getYConv(h.conversion || 0)}`).join(' ');

        return { userPath, survivalPath, convPath, getX, getYUsers, getYSurvival, getYConv, maxUsers, maxConv };
    }, [history]);

    if (!sandboxState || history.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 font-mono text-xs">
                <p>[WAITING_FOR_DATA_POINTS]</p>
                <p className="mt-2 opacity-50">Advance at least 2 epochs to generate momentum curves.</p>
            </div>
        );
    }

    const agentCount = sandboxState.agents.length;

    return (
        <div className="relative w-full h-full flex flex-col p-4 bg-black border border-gray-800 rounded">
            <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-cyan-400" />
                        <span className="text-[10px] text-cyan-400 font-mono uppercase">Users (Max: {chartData?.maxUsers.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-[#ffaa00]" />
                        <span className="text-[10px] text-[#ffaa00] font-mono uppercase">Conv (Max: {((chartData?.maxConv || 0) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-green-400" />
                        <span className="text-[10px] text-green-400 font-mono uppercase">Survival</span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] text-gray-400 font-mono bg-gray-900 px-2 py-1 rounded">
                        TIER: {sandboxState.tier} ({agentCount.toLocaleString()} AGENTS)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">T+{sandboxState.epoch} EPOCHS</span>
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(p => (
                    <line 
                        key={p}
                        x1={padding} y1={padding + p * (height - 2 * padding)} 
                        x2={width - padding} y2={padding + p * (height - 2 * padding)} 
                        stroke="#222" strokeDasharray="2,2" 
                    />
                ))}

                {/* Data Paths */}
                {chartData && (
                    <>
                        <path d={chartData.userPath} fill="none" stroke="#00f2ff" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" />
                        <path d={chartData.survivalPath} fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="4,2" />
                        <path d={chartData.convPath} fill="none" stroke="#ffaa00" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(255,170,0,0.5)]" />
                        
                        {/* Data Points */}
                        {history.map((h, i) => (
                            <g key={h.epoch} className="group cursor-crosshair">
                                <circle cx={chartData.getX(h.epoch)} cy={chartData.getYUsers(h.users)} r="3" fill="#00f2ff" />
                                <circle cx={chartData.getX(h.epoch)} cy={chartData.getYConv(h.conversion || 0)} r="2" fill="#ffaa00" />
                                <rect 
                                    x={chartData.getX(h.epoch) - 10} y={0} width="20" height={height} 
                                    fill="transparent" 
                                    className="hover:fill-white/5"
                                />
                            </g>
                        ))}
                    </>
                )}

                {/* Axis Labels */}
                <text x={padding} y={height - 10} fill="#555" fontSize="10" fontFamily="monospace">T+0</text>
                <text x={width - padding} y={height - 10} fill="#555" fontSize="10" fontFamily="monospace" textAnchor="end">T+{sandboxState.epoch}</text>
            </svg>
        </div>
    );
}
