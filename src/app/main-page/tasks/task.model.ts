export interface Task {
  id: number;
  crewId: number;
  agentId: number;
  title: string;
  description: string;
  expected_output: string;
}
