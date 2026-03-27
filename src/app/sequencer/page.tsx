"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLemeoneStore } from '@/lib/store';
import { UserTier } from '@/lib/engine/types';

export default function SequencerPage() {
    const router = useRouter();
    const initSimulation = useLemeoneStore(s => s.initSimulation);
    const upgradeTier = useLemeoneStore(s => s.upgradeTier);
    const currentTier = useLemeoneStore(s => s.userTier);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        vision: '',
        core: '',
        entry: '',
        monetize: '',
        market: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const combinedSeed = \`
# Vision
\${form.vision}

# Core Features (D1-D4)
\${form.core}

# Entry Ease / Onboarding (D5)
\${form.entry}

# Monetization Pressure (D6)
\${form.monetize}

# Market & Social (D7-D14)
\${form.market}
        \`.trim();

        await initSimulation(combinedSeed);
        router.push('/sandbox');
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono p-8 selection:bg-primary selection:text-black">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex justify-between items-end border-b border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">DNA SEQUENCER</h1>
                        <p className="text-sm text-gray-500">Structured Requirement Harvesting for 14D DRTA Alignment</p>
                    </div>
                    
                    {/* TIER SELECTOR */}
                    <div className="flex gap-2">
                        {(['FREE', 'PRO', 'ENTERPRISE'] as UserTier[]).map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => upgradeTier(t)}
                                className={\`px-3 py-1 text-xs font-bold border rounded \${
                                    currentTier === t 
                                    ? 'bg-primary text-black border-primary' 
                                    : 'bg-black text-gray-500 border-gray-800 hover:border-gray-500'
                                }\`}
                            >
                                {t} ({t === 'FREE' ? '100' : t === 'PRO' ? '10K' : '100K'})
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* SECTION 1: VISION */}
                    <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                        <label className="block text-cyan-500 font-bold mb-2 tracking-widest text-sm">1. PRODUCT VISION</label>
                        <p className="text-xs text-gray-500 mb-4">What is the ultimate goal of this product? Who is it for?</p>
                        <textarea 
                            required
                            className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none h-24"
                            placeholder="e.g. A communication tool to replace internal email for engineering teams..."
                            value={form.vision}
                            onChange={e => setForm({...form, vision: e.target.value})}
                        />
                    </div>

                    {/* SECTION 2: CORE */}
                    <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <label className="block text-blue-500 font-bold mb-2 tracking-widest text-sm">2. CORE TECHNICAL EDGE (D1-D4)</label>
                        <p className="text-xs text-gray-500 mb-4">Describe performance, feature depth, and stability.</p>
                        <textarea 
                            required
                            className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                            placeholder="e.g. Real-time search across millions of messages, deep GitHub integrations..."
                            value={form.core}
                            onChange={e => setForm({...form, core: e.target.value})}
                        />
                    </div>

                    {/* SECTION 3: ENTRY & MONETIZATION (THE GATES) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                            <label className="block text-green-500 font-bold mb-2 tracking-widest text-sm">3. ENTRY EASE (D5)</label>
                            <p className="text-xs text-gray-500 mb-4">How hard is it to start? (Downloads, credit cards, blank canvas?)</p>
                            <textarea 
                                required
                                className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-green-500 outline-none transition-all resize-none h-24"
                                placeholder="e.g. Browser based, instant signup, invite via link."
                                value={form.entry}
                                onChange={e => setForm({...form, entry: e.target.value})}
                            />
                        </div>

                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#ffaa00]"></div>
                            <label className="block text-[#ffaa00] font-bold mb-2 tracking-widest text-sm">4. MONETIZE PRESSURE (D6)</label>
                            <p className="text-xs text-gray-500 mb-4">How do you force payment? (Hard limits, cosmetic only?)</p>
                            <textarea 
                                required
                                className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-[#ffaa00] outline-none transition-all resize-none h-24"
                                placeholder="e.g. 10,000 message history limit causes high pressure to upgrade."
                                value={form.monetize}
                                onChange={e => setForm({...form, monetize: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* SECTION 4: MARKET */}
                    <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                        <label className="block text-purple-500 font-bold mb-2 tracking-widest text-sm">5. MARKET & VIRALITY</label>
                        <p className="text-xs text-gray-500 mb-4">Who are the competitors? Does it have built-in sharing loops?</p>
                        <textarea 
                            required
                            className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none h-24"
                            placeholder="e.g. Competes with Skype. High internal team virality."
                            value={form.market}
                            onChange={e => setForm({...form, market: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold py-4 rounded tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'INITIATING CORTEX AI SCAN...' : 'EXTRACT DNA & BOOT SANDBOX'}
                    </button>
                </form>
            </div>
        </div>
    );
}
