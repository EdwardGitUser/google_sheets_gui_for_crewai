import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
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
