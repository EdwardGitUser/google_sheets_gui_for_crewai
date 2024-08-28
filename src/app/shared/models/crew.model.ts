import { Agent } from './agents.model';
import { Task } from './task.model';

export interface Crew {
  id: string;
  name: string;
  userId: string;
  process: 'sequential' | 'hierarchical';
  llm: 'gpt-4mini' | 'gpt-4' | 'gpt-4o';
  agents: Agent[];
  tasks: Task[];
}
