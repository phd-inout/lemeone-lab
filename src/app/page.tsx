"use client";

import { useLemeoneStore } from '@/lib/store';
import dynamic from 'next/dynamic';

// Next.js needs dynamic import for xterm as it requires the window object
const TerminalUI = dynamic(() => import('@/components/TerminalUI'), { ssr: false });

export default function Home() {
  const { founder, company } = useLemeoneStore();

  return (
    <main className="flex h-screen w-screen bg-[#0a0f14] text-gray-200 overflow-hidden font-mono">
      {/* Sidebar: Stats */}
      <aside className="w-80 border-r border-gray-800 flex flex-col p-6 space-y-8 bg-[#0d131a]">
        <div>
          <h1 className="text-xl font-bold text-blue-400 mb-2">lemeone-lab</h1>
          <p className="text-xs text-gray-500">v0.1.0 // Day 1 MVP</p>
        </div>

        {founder ? (
          <>
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-gray-400">Founder Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col"><span className="text-gray-500">Logic</span><span className="font-semibold text-green-400">{founder.logic}</span></div>
                <div className="flex flex-col"><span className="text-gray-500">Charisma</span><span className="font-semibold text-purple-400">{founder.charisma}</span></div>
                <div className="flex flex-col"><span className="text-gray-500">Focus</span><span className="font-semibold text-yellow-400">{founder.focus}</span></div>
                <div className="flex flex-col"><span className="text-gray-500">Stamina</span><span className="font-semibold text-red-400">{founder.stamina}</span></div>
                <div className="flex flex-col"><span className="text-gray-500">Vision</span><span className="font-semibold text-blue-400">{founder.vision}</span></div>
                <div className="flex flex-col"><span className="text-gray-500">Luck</span><span className="font-semibold text-pink-400">{founder.luck}</span></div>
              </div>
            </div>

            {company && (
              <div className="space-y-4 pt-6 border-t border-gray-800">
                <h2 className="text-sm uppercase tracking-wider text-gray-400">Company Status</h2>
                <div className="flex flex-col space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cash</span>
                    <span className="font-semibold text-emerald-400">${company.cash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-indigo-400">{company.progress}%</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm italic">
            Awaiting initialization...<br />
            Type 'init' in the terminal.
          </div>
        )}
      </aside>

      {/* Main content: Terminal */}
      <section className="flex-1 h-full">
        <TerminalUI />
      </section>
    </main>
  );
}
