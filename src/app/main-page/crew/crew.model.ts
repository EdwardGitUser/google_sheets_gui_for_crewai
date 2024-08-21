export interface Crew {
  id: number;
  name: string;
  userId: number;
  process: 'sequential' | 'hierarchical'; // Default is 'sequential'
}
