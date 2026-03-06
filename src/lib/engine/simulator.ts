export type FounderAttrs = {
  logic: number;
  charisma: number;
  focus: number;
  stamina: number;
  vision: number;
  luck: number;
};

export type CompanyState = {
  cash: number;
  progress: number;
};

export type SimulatorState = {
  founder: FounderAttrs | null;
  company: CompanyState | null;
};

export class LemeoneEngine {
  // Pure function to generate initial founder stats
  static initFounder(): FounderAttrs {
    const roll = () => Math.floor(Math.random() * 60) + 20; // 20-80 range for day 1 MVP
    return {
      logic: roll(),
      charisma: roll(),
      focus: roll(),
      stamina: roll(),
      vision: roll(),
      luck: roll(),
    };
  }

  // Pure function to process a "sprint"
  static processSprint(state: SimulatorState): {
     newState: SimulatorState;
     log: string;
     success: boolean;
  } {
    if (!state.founder || !state.company) {
      return { newState: state, log: "[ERROR] System not initialized. Please 'init' first.", success: false };
    }
    
    // Day 1 formula: -1000 cash, + (Logic/10 + Focus/10) progress
    const cost = 1000;
    const progressGain = Math.floor(state.founder.logic / 10) + Math.floor(state.founder.focus / 10);
    
    if (state.company.cash < cost) {
      return { 
        newState: state, 
        log: "[WARNING] Not enough cash to sprint! Startup is bankrupt.",
        success: false 
      };
    }

    const newCompanyState = {
      cash: state.company.cash - cost,
      progress: state.company.progress + progressGain,
    };

    return {
      newState: {
        ...state,
        company: newCompanyState
      },
      log: `[AI] Sprint completed. Burned $${cost}. Progress increased by +${progressGain}%.`,
      success: true,
    };
  }
}
