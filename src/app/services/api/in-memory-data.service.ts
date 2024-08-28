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
    console.log('Request received:', reqInfo);

    if (reqInfo.collectionName === 'submitCrewData') {
      const responseBody = {
        message:
          'Crew data has been successfully processed. We appreciate your effort in providing the required information. ' +
          'Our system has carefully reviewed the data, ensuring that all necessary details have been captured accurately. ' +
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n' +
          'Furthermore, we would like to take this opportunity to acknowledge your contribution. ' +
          'The data you have provided will be instrumental in driving our future decisions and improving our processes. ' +
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      };
      const options: ResponseOptions = {
        body: responseBody,
        status: 200,
      };
      return reqInfo.utils.createResponse$(() => options);
    }

    return undefined;
  }
}
