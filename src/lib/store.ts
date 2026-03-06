import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LemeoneEngine, SimulatorState, FounderAttrs, CompanyState } from './engine/simulator';

interface LemeoneStore extends SimulatorState {
    logs: string[];
    addLog: (log: string) => void;
    initGame: () => void;
    sprint: () => string; // returns log to display
}

export const useLemeoneStore = create<LemeoneStore>()(
    persist(
        (set, get) => ({
            founder: null,
            company: null,
            logs: [],

            addLog: (log: string) => set((state) => ({ logs: [...state.logs, log] })),

            initGame: () => {
                const founderStats = LemeoneEngine.initFounder();
                set({
                    founder: founderStats,
                    company: { cash: 100000, progress: 0 },
                    logs: ['[SYSTEM] Founder attributes initialized. Compay founded with $100,000 cash.']
                });
            },

            sprint: () => {
                const state = get();
                const { newState, log, success } = LemeoneEngine.processSprint({
                    founder: state.founder,
                    company: state.company
                });

                if (success) {
                    set({ founder: newState.founder, company: newState.company });
                }

                get().addLog(log);
                return log;
            }
        }),
        {
            name: 'lemeone-storage',
        }
    )
);
