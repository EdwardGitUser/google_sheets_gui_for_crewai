export interface Agent {
  id: string;
  crewId: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  verbose: boolean; //default false
  tool: string;
}
