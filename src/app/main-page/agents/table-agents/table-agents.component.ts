import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Agent } from '../agents.model';

import { AgentsService } from '../agents.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ValidatorFn, FormControl } from '@angular/forms';

import { CreateAgentComponent } from '../create-agent/create-agent.component';
import {
  minLengthValidator,
  requiredValidator,
} from '../agents-table-validators';

@Component({
  selector: 'app-table-agents',
  standalone: true,
  imports: [RouterModule, FormsModule, CreateAgentComponent],
  templateUrl: './table-agents.component.html',
  styleUrls: ['./table-agents.component.css'],
})
export class TableAgentsComponent implements OnInit {
  crewId = signal<number | null>(null);
  showModal = signal<boolean>(false);

  private initialAgents: Agent[] = [];
  tempAgents = signal<Agent[]>([]);

  validationErrors: string[] = [];

  constructor(
    private agentsService: AgentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.crewId.set(+params['id']);
      // this.loadTempAgents();
      // this.loadInitialAgents();
      this.loadAgents();
    });
  }
  loadAgents() {
    const currentCrewId = this.crewId();
    const agents = this.agentsService.getAgentsByCrewId(currentCrewId!);
    this.tempAgents.set(agents);
    this.initialAgents = JSON.parse(JSON.stringify(this.tempAgents()));
  }
  //LOAD
  loadTempAgents() {
    const currentCrewId = this.crewId();
    const agents = this.agentsService.getAgentsByCrewId(currentCrewId!);
    this.tempAgents.set(agents);
  }

  loadInitialAgents() {
    this.initialAgents = JSON.parse(JSON.stringify(this.tempAgents()));
  }

  reloadAgents() {
    this.tempAgents.set(JSON.parse(JSON.stringify(this.initialAgents)));
    console.log('Agents reloaded to initial state:', this.tempAgents());
  }

  //VALIDATE
  validateAgents(): boolean {
    this.validationErrors = [];
    let isValid = true;

    this.tempAgents().forEach((agent, rowIndex) => {
      const columns = [
        { name: 'Name', value: agent.name },
        { name: 'Role', value: agent.role },
        { name: 'Goal', value: agent.goal },
        { name: 'Backstory', value: agent.backstory },
      ];

      columns.forEach((field) => {
        if (!field.value || field.value.length < 3) {
          this.validationErrors.push(
            `Error in row ${rowIndex + 1}, column ${field.name}: ${
              field.name
            } is required and must be at least 3 characters long.`
          );
          isValid = false;
        }
      });
    });

    return isValid;
  }
  //SAVE
  saveAgents() {
    if (this.validateAgents()) {
      const confirmSave = window.confirm('Do you want to save the changes?');
      const currentCrewId = this.crewId();
      if (confirmSave) {
        this.agentsService.updateAgentsByCrewId(
          currentCrewId!,
          this.tempAgents()
        );
        console.log('Agents saved:', this.tempAgents());
        this.initialAgents = JSON.parse(JSON.stringify(this.tempAgents()));
      }
    } else {
      console.log('Validation Errors:', this.validationErrors);
    }
  }

  //DELETE
  deleteAgent(agentId: number) {
    const confirmSave = window.confirm('Do you want to save the changes?');
    const currentCrewId = this.crewId();
    if (confirmSave) {
      this.agentsService.deleteAgentById(currentCrewId!, agentId);

      // this.loadTempAgents();
      // this.initialAgents = JSON.parse(JSON.stringify(this.tempAgents()));
      this.loadAgents();
      console.log('Temp agents after deletion:', this.tempAgents());
    }
  }

  //MODAL
  openCreateAgentModal() {
    this.showModal.set(true);
  }

  closeCreateAgentModal() {
    this.showModal.set(false);
  }

  onAgentCreated(newAgent: Agent) {
    // this.loadTempAgents();
    // this.loadInitialAgents();
    this.loadAgents();
    this.closeCreateAgentModal();
  }
}
