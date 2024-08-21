import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentsService } from './agents.service';
import { Agent } from './agents.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css'],
})
export class AgentsComponent implements OnInit {
  agents: Agent[] = [];

  constructor(
    private agentsService: AgentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const crewId = +params['id']; // Get the crew ID from the route
      console.log(crewId);
      this.agents = this.agentsService.getAgentsByCrewId(crewId);
    });
  }
}
