export interface Agent {
  id: number;
  crewId: number;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  verbose: boolean; //default false
  tool: string;
}
