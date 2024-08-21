import { Component, OnInit } from '@angular/core';
import { Agent } from '../agents.model';
import { NgFor, NgIf } from '@angular/common';
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
  imports: [NgFor, NgIf, RouterModule, FormsModule],
  templateUrl: './table-agents.component.html',
  styleUrls: ['./table-agents.component.css'],
})
export class TableAgentsComponent implements OnInit {
  agents: Agent[] = [];
  tempAgents: Agent[] = []; // Temporary array to hold editable agents
  crewId: number | null = null;
  validationErrors: string[] = []; // To store validation errors

  constructor(
    private agentsService: AgentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.crewId = +params['id'];
      this.loadAgents();

      // Run validation on component load
      if (this.agents.length > 0) {
        this.validateAgents();
        if (this.validationErrors.length > 0) {
          console.log('Validation Errors on Load:', this.validationErrors);
          // Optionally, display the validation errors immediately
        }
      } else {
        this.validationErrors.length = 0;
      }
    });
  }

  loadAgents() {
    if (this.crewId !== null) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
      this.tempAgents = JSON.parse(JSON.stringify(this.agents)); // Create a deep copy of the agents array
    }
  }

  onInputChange() {
    // Changes only update tempAgents, not the original agents array
    console.log('Temporary Agents Updated:', this.tempAgents);
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
        this.agents = JSON.parse(JSON.stringify(this.tempAgents)); // Copy tempAgents back to the original agents array
        this.agentsService.updateAgentsByCrewId(this.crewId!, this.agents);
        console.log('Agents saved:', this.agents);
      }
    } else {
      console.log('Validation Errors:', this.validationErrors);
      // Display validation errors below the table
    }
  }

  deleteAgent(agentId: number) {
    // Remove the agent from the tempAgents list
    this.tempAgents = this.tempAgents.filter((agent) => agent.id !== agentId);
  }

  navigateToCreateAgent() {
    const confirmNavigate = window.confirm(
      'Do you want to create a new agent? Unsaved changes will be lost.'
    );
    if (confirmNavigate) {
      this.router.navigate(['/create-agent'], {
        queryParams: { crewId: this.crewId },
      });
    }
  }
}
