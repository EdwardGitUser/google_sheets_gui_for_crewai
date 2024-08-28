import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crew } from '../../shared/models/crew.model';
import { Agent } from '../../shared/models/agents.model';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class SubmitService {
  private apiUrl = '/api/submitCrewData'; // URL - in-memory API

  constructor(private http: HttpClient) {}

  submitCrewData(
    crew: Crew,
    agents: Agent[],
    tasks: Task[]
  ): Observable<{ message: string }> {
    const body = {
      crew,
      agents,
      tasks,
    };

    return this.http.post<{ message: string }>(this.apiUrl, body);
  }
}
