//task-table-validators

import { Agent } from '../agents/agents.model';

export function isAgentValid(agentId: number | null, agents: Agent[]): boolean {
  if (agentId === null) {
    return false;
  }

  return agents.some((agent) => agent.id === agentId);
}

//.....to be done(hopefully :))
