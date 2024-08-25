export interface Task {
  id: string;
  crewId: string;
  agentId: string | null;
  title: string;
  description: string;
  expected_output: string;
}
