import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AgentsService } from './agents.service';
import { Agent } from './agents.model';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { TableAgentsComponent } from './table-agents/table-agents.component';
import {
  lettersOnlyValidator,
  lettersRequiredValidator,
  minLengthValidator,
  requiredValidator,
} from './validators';
@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [NgIf, NgFor, RouterModule, TableAgentsComponent],
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css'],
})
export class AgentsComponent implements OnInit {
  agents: Agent[] = [];
  crewId: number | null = null;

  constructor(
    private agentsService: AgentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    //   this.route.params.subscribe((params) => {
    //     this.crewId = +params['id'];
    //     this.loadAgents();
    //   });
  }

  // loadAgents() {
  //   if (this.crewId !== null) {
  //     this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
  //   }
  // }

  // navigateToCreateAgent() {
  //   // Navigate to the create-agent route, passing crewId as a query parameter
  //   this.router.navigate(['/create-agent'], {
  //     queryParams: { crewId: this.crewId },
  //   });
  // }
}
