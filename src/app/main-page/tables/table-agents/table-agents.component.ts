import { Component, OnInit, signal } from '@angular/core';
import { Agent } from '../../../shared/models/agents.model';

import { AgentsService } from '../../../services/agents.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CreateAgentComponent } from '../../create-forms/create-agent/create-agent.component';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-table-agents',
  standalone: true,
  imports: [RouterModule, FormsModule, CreateAgentComponent],
  templateUrl: './table-agents.component.html',
  styleUrls: ['./table-agents.component.css'],
})
export class TableAgentsComponent implements OnInit {
  crewId = signal<string | null>(null);

  private initialAgents: Agent[] = [];
  tableAgents: Agent[] = [];

  validationErrors: string[] = [];

  showModal = signal<boolean>(false);

  constructor(
    private agentsService: AgentsService,
    private tasksService: TasksService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.crewId.set(params['id']);
      this.loadAgents();
    });
  }

  //LOAD
  loadAgents() {
    const currentCrewId = this.crewId();
    this.tableAgents = this.agentsService.getAgentsByCrewId(currentCrewId!);
    this.initialAgents = JSON.parse(JSON.stringify(this.tableAgents));
  }

  reloadAgents() {
    this.tableAgents = JSON.parse(JSON.stringify(this.initialAgents));
    console.log('Agents reloaded to initial state:', this.tableAgents);
  }

  //VALIDATE
  validateAgents(): boolean {
    this.validationErrors = [];
    let isValid = true;

    this.tableAgents.forEach((agent, rowIndex) => {
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
          this.tableAgents
        );
        console.log('Agents saved:', this.tableAgents);
        this.initialAgents = JSON.parse(JSON.stringify(this.tableAgents));
      }
    } else {
      console.log('Validation Errors:', this.validationErrors);
    }
  }

  //DELETE
  deleteAgent(agentId: string) {
    const confirmSave = window.confirm('Do you want to save the changes?');
    const currentCrewId = this.crewId();
    if (confirmSave) {
      this.tasksService.updateTasksForDeletedAgent(currentCrewId!, agentId);

      this.agentsService.deleteAgentById(currentCrewId!, agentId);

      this.loadAgents();
      console.log('Temp agents after deletion:', this.tableAgents);
    }
  }

  //MODAL
  openCreateAgentModal() {
    this.showModal.set(true);
  }

  closeCreateAgentModal() {
    this.showModal.set(false);
  }

  onAgentCreated() {
    this.loadAgents();
    this.closeCreateAgentModal();
  }
}
