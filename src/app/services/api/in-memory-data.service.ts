import { Injectable } from '@angular/core';
import {
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
  RequestInfoUtilities,
} from 'angular-in-memory-web-api';

import { Crew } from '../../shared/models/crew.model';
import { Agent } from '../../shared/models/agents.model';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const crews: Crew[] = [];

    const agents: Agent[] = [];

    const tasks: Task[] = [];

    return { crews, agents, tasks };
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.collectionName === 'submitCrewData') {
      return reqInfo.utils.createResponse$(() => {
        const responseBody = {
          message:
            'Crew data processed successfully. Here is your lorem ipsum: Lorem ipsum dolor sit amet...',
        };
        return {
          status: 200,
          headers: reqInfo.headers,
          body: responseBody,
        };
      });
    }
    return undefined;
  }
}
