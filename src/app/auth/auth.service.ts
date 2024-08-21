import { Injectable, signal } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [];

  private loggedInUser = signal<User | null>(null);

  constructor() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser.set(JSON.parse(storedUser));
    }
  }

  get currentUser() {
    return this.loggedInUser();
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      this.loggedInUser.set(user);
      return true;
    }
    return false;
  }

  signUp(username: string, password: string): boolean {
    const userExists = this.users.some((user) => user.username === username);
    if (!userExists) {
      const newUser: User = {
        id: Math.floor(Math.random() * 1000000),
        username,
        password,
      };
      this.users.push(newUser);
      this.saveUsersToLocalStorage();

      localStorage.setItem('loggedInUser', JSON.stringify(newUser));
      this.loggedInUser.set(newUser);

      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser.set(null);
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
