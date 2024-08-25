import { Injectable, signal } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [];

  private loggedInUser = signal<User | null>(null);

  constructor() {
    this.loadUsersFromLocalStorage();
    this.loadLoggedInUserFromLocalStorage();
  }

  //GET
  get currentUser() {
    return this.loggedInUser();
  }

  private loadUsersFromLocalStorage(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = [];
    }
  }

  private loadLoggedInUserFromLocalStorage(): void {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      const { user, loginTime } = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const expirationTime = 24 * 60 * 60 * 1000; // 1 day

      if (currentTime - loginTime < expirationTime) {
        this.loggedInUser.set(user);
      } else {
        this.logout(); // if expired
      }
    }
  }

  //SAVE
  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  //LOGIN
  login(username: string, password: string): boolean {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      const loginTime = new Date().getTime(); //expiration
      localStorage.setItem('loggedInUser', JSON.stringify({ user, loginTime }));
      this.loggedInUser.set(user);
      return true;
    }
    return false;
  }

  //SIGN UP
  signUp(username: string, password: string): boolean {
    const userExists = this.users.some((user) => user.username === username);
    if (!userExists) {
      const newUser: User = {
        id: Math.floor(Math.random() * 10000).toString(),
        username,
        password,
      };
      this.users.push(newUser);
      this.saveUsersToLocalStorage();

      const loginTime = new Date().getTime();
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ user: newUser, loginTime })
      );
      this.loggedInUser.set(newUser);

      return true;
    }
    return false;
  }

  //LOGOUT
  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUser.set(null);
  }
}
