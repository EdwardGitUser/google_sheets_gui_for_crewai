export interface Task {
  id: number;
  crewId: number;
  agentId: number | null;
  title: string;
  description: string;
  expected_output: string;
}
