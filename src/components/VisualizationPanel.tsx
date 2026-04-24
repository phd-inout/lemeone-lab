"use client";

import React, { useState } from 'react';
import ParticleManifold from './ParticleManifold';
import GrowthChart from './GrowthChart';
import { useLemeoneStore } from '@/lib/store';
import { Layers, Activity, Share2 } from 'lucide-react';

type Tab = 'SPATIAL' | 'TEMPORAL' | 'DNA';

// Helper component for DNA Bar
const DNABar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col gap-1 group">
        <div className="flex justify-between items-center text-[9px] font-bold tracking-tighter">
            <span className="text-gray-500 group-hover:text-gray-300 transition-colors uppercase">{label}</span>
            <span className={color}>{(value * 100).toFixed(0)}%</span>
        </div>
        <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
            <div 
                className={`h-full transition-all duration-700 ease-out ${color.replace('text-', 'bg-')}`} 
                style={{ width: `${value * 100}%`, boxShadow: `0 0 8px ${color.includes('green') ? 'rgba(34,197,94,0.3)' : 'rgba(6,182,212,0.3)'}` }} 
            />
        </div>
    </div>
);

export default function VisualizationPanel() {
    const [activeTab, setActiveTab] = useState<Tab>('SPATIAL');
    const sandboxState = useLemeoneStore(s => s.sandboxState);

    return (
        <div className="flex flex-col h-full bg-[#050505] rounded overflow-hidden border border-gray-900 shadow-2xl relative">
            {/* Tab Header */}
            <div className="flex bg-black border-b border-gray-900 h-9 shrink-0">
                <button 
                    onClick={() => setActiveTab('SPATIAL')}
                    className={`flex-1 flex items-center justify-center gap-2 text-[9px] font-mono tracking-widest transition-all duration-200 border-r border-gray-900 ${
                        activeTab === 'SPATIAL' 
                        ? 'bg-[#111] text-[#00f2ff] shadow-[inset_0_-2px_0_#00f2ff]' 
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                >
                    <Share2 className="w-3 h-3" />
                    [SPATIAL_DNA]
                </button>
                <button 
                    onClick={() => setActiveTab('TEMPORAL')}
                    className={`flex-1 flex items-center justify-center gap-2 text-[9px] font-mono tracking-widest transition-all duration-200 border-r border-gray-900 ${
                        activeTab === 'TEMPORAL' 
                        ? 'bg-[#111] text-[#00f2ff] shadow-[inset_0_-2px_0_#00f2ff]' 
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                >
                    <Activity className="w-3 h-3" />
                    [MOMENTUM]
                </button>
                <button 
                    onClick={() => setActiveTab('DNA')}
                    className={`flex-1 flex items-center justify-center gap-2 text-[9px] font-mono tracking-widest transition-all duration-200 ${
                        activeTab === 'DNA' 
                        ? 'bg-[#111] text-[#00f2ff] shadow-[inset_0_-2px_0_#00f2ff]' 
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                >
                    <Layers className="w-3 h-3" />
                    [14D_MODEL]
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden p-3">
                {activeTab === 'SPATIAL' && (
                    <div className="h-full flex flex-col animate-in fade-in duration-500">
                        <div className="text-[9px] text-gray-700 uppercase mb-2 px-1 tracking-widest">Gravity_Field_Manifold</div>
                        <ParticleManifold />
                    </div>
                )}
                
                {activeTab === 'TEMPORAL' && (
                    <div className="h-full flex flex-col animate-in fade-in duration-500">
                        <div className="text-[9px] text-gray-700 uppercase mb-2 px-1 tracking-widest">Momentum_Growth_Curve</div>
                        <GrowthChart />
                    </div>
                )}

                {activeTab === 'DNA' && (
                    <div className="h-full flex flex-col overflow-y-auto pr-2 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                        <div className="text-[9px] text-gray-700 uppercase mb-4 px-1 tracking-widest border-b border-gray-900 pb-1">Dimensional_Identity_Audit</div>
                        
                        <div className="flex flex-col gap-6">
                            <div className="space-y-3">
                                <h3 className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Core DNA (D1-D4)</h3>
                                <DNABar label="Performance" value={sandboxState?.productVector[0] || 0} color="text-cyan-400" />
                                <DNABar label="Depth" value={sandboxState?.productVector[1] || 0} color="text-cyan-400" />
                                <DNABar label="Interact" value={sandboxState?.productVector[2] || 0} color="text-cyan-400" />
                                <DNABar label="Stability" value={sandboxState?.productVector[3] || 0} color="text-cyan-400" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Gateways (D5-D6)</h3>
                                <DNABar label="Entry Ease" value={sandboxState?.productVector[4] || 0} color="text-pink-500" />
                                <DNABar label="Monetize" value={sandboxState?.productVector[5] || 0} color="text-pink-500" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Market (D7-D9)</h3>
                                <DNABar label="Unique" value={sandboxState?.productVector[6] || 0} color="text-green-400" />
                                <DNABar label="Social" value={sandboxState?.productVector[7] || 0} color="text-green-400" />
                                <DNABar label="Consistency" value={sandboxState?.productVector[8] || 0} color="text-green-400" />
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">GTM (D14)</h3>
                                <DNABar label="Awareness" value={sandboxState?.productVector[13] || 0} color="text-yellow-400" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Status */}
            <div className="h-5 bg-black border-t border-gray-900 flex items-center px-3 text-[8px] text-gray-800 font-mono justify-between tracking-tighter">
                <div className="flex gap-3">
                    <span>MODE: {activeTab}</span>
                    <span>RESOLUTION: {sandboxState?.tier || 'FREE'}</span>
                </div>
                <span className="animate-pulse text-green-900">● SYSTEM_ACTIVE</span>
            </div>
        </div>
    );
}
