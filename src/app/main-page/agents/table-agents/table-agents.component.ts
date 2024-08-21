import { Component, OnInit } from '@angular/core';
import { Agent } from '../agents.model';

import { AgentsService } from '../agents.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ValidatorFn, FormControl } from '@angular/forms';
import {
  lettersOnlyValidator,
  lettersRequiredValidator,
  minLengthValidator,
  requiredValidator,
} from '../validators';

@Component({
  selector: 'app-table-agents',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './table-agents.component.html',
  styleUrls: ['./table-agents.component.css'],
})
export class TableAgentsComponent implements OnInit {
  agents: Agent[] = [];
  tempAgents: Agent[] = [];
  crewId: number | null = null;
  validationErrors: string[] = [];

  constructor(
    private agentsService: AgentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.crewId = +params['id'];
      this.loadAgents();

      if (this.agents.length > 0) {
        this.validateAgents();
        if (this.validationErrors.length > 0) {
          console.log('Validation Errors on Load:', this.validationErrors);
        }
      } else {
        this.validationErrors.length = 0;
      }
    });
  }

  loadAgents() {
    if (this.crewId !== null) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
      this.tempAgents = JSON.parse(JSON.stringify(this.agents));
    }
  }

  validateAgents(): boolean {
    this.validationErrors = [];
    let isValid = true;

    this.tempAgents.forEach((agent, rowIndex) => {
      // Validate Name
      if (
        !this.runValidation(requiredValidator(), agent.name) ||
        !this.runValidation(minLengthValidator(3), agent.name)
      ) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Name: Name is required and must be at least 3 characters long.`
        );
        isValid = false;
      }

      // Validate Role
      if (!this.runValidation(lettersOnlyValidator(), agent.role)) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Role: Role must contain only letters.`
        );
        isValid = false;
      }

      // Validate Goal
      if (
        !this.runValidation(lettersRequiredValidator(), agent.goal) ||
        !this.runValidation(minLengthValidator(5), agent.goal)
      ) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Goal: Goal is required, must contain letters, and must be at least 5 characters long.`
        );
        isValid = false;
      }

      // Validate Backstory
      if (
        !this.runValidation(requiredValidator(), agent.backstory) ||
        !this.runValidation(minLengthValidator(10), agent.backstory)
      ) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Backstory: Backstory is required and must be at least 10 characters long.`
        );
        isValid = false;
      }
    });

    return isValid;
  }

  runValidation(validator: ValidatorFn, value: any): boolean {
    const control = new FormControl(value);
    return validator(control) === null;
  }

  saveAgents() {
    if (this.validateAgents()) {
      const confirmSave = window.confirm('Do you want to save the changes?');
      if (confirmSave) {
        this.agents = JSON.parse(JSON.stringify(this.tempAgents));
        this.agentsService.updateAgentsByCrewId(this.crewId!, this.agents);
        console.log('Agents saved:', this.agents);
      }
    } else {
      console.log('Validation Errors:', this.validationErrors);
    }
  }
  deleteAgent(agentId: number) {
    if (
      window.confirm(
        'Are you sure you want to delete this agent? This action cannot be undone.'
      )
    ) {
      this.tempAgents = this.tempAgents.filter((agent) => agent.id !== agentId);

      if (this.validateAgents()) {
        this.agents = JSON.parse(JSON.stringify(this.tempAgents));
        this.agentsService.updateAgentsByCrewId(this.crewId!, this.agents);
        console.log('Agents updated after deletion:', this.agents);
      } else {
        console.log('Validation Errors:', this.validationErrors);
      }
    }
  }

  navigateToAddAgent() {
    if (this.crewId) {
      this.router.navigate([`/crew/${this.crewId}/agents/add`]);
    }
  }
}
