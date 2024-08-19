import { Injectable } from '@angular/core';
import { User } from './user.model'; // Adjust the import path based on your project structure

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [];

  constructor() {
    // Load users from localStorage if they exist
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }

  getUsers(): User[] {
    return this.users;
  }

  getLoggedInUsername(): string | null {
    return localStorage.getItem('loggedInUser');
  }

  private userExists(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }

  signUp(username: string, password: string): User | null {
    if (this.userExists(username)) {
      return null; // Return null if the username already exists
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 1000000), // Generate a random ID
      username,
      password, // In a real-world app, you should hash the password before storing it
    };

    this.users.push(newUser);
    this.saveUsersToLocalStorage();

    return newUser;
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      localStorage.setItem('loggedInUser', username);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }
}
