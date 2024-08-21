import { Component } from '@angular/core';

import { TableAgentsComponent } from './table-agents/table-agents.component';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [TableAgentsComponent],
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css'],
})
export class AgentsComponent {
  constructor() {}
}
