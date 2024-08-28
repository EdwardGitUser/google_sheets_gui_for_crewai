import { Injectable, signal } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersSignal = signal<User[]>(this.loadUsersFromLocalStorage());

  private loggedInUserSignal = signal<User | null>(
    this.loadLoggedInUserFromLocalStorage()
  );

  constructor() {}

  //GET
  get currentUser() {
    return this.loggedInUserSignal();
  }

  getUserById(userId: string): User | null {
    return this.usersSignal().find((user) => user.id === userId) || null;
  }

  private loadUsersFromLocalStorage(): User[] {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  private loadLoggedInUserFromLocalStorage(): User | null {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      const { user, loginTime } = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const expirationTime = 24 * 60 * 60 * 1000; // 1 day

      if (currentTime - loginTime < expirationTime) {
        return user;
      } else {
        this.logout(); // if expired
        return null;
      }
    }
    return null;
  }

  //ADD
  addToUserBalance(userId: string, amount: number): void {
    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, balance: user.balance + amount } : user
      )
    );
    this.saveUsersToLocalStorage();

    // Update the logged-in user's balance if they are the one affected
    if (this.loggedInUserSignal()?.id === userId) {
      this.loggedInUserSignal.update((user) =>
        user ? { ...user, balance: user.balance + amount } : user
      );
      this.saveLoggedInUserToLocalStorage();
    }
  }

  //SAVE
  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.usersSignal()));
  }

  private saveLoggedInUserToLocalStorage(): void {
    const user = this.loggedInUserSignal();
    if (user) {
      const loginTime = new Date().getTime();
      localStorage.setItem('loggedInUser', JSON.stringify({ user, loginTime }));
    }
  }

  //UPDATE
  decreaseUserBalance(amount: number): boolean {
    const currentUser = this.loggedInUserSignal();
    if (currentUser && amount > 0 && currentUser.balance >= amount) {
      currentUser.balance -= amount;
      this.loggedInUserSignal.set(currentUser);
      this.saveUsersToLocalStorage();
      return true;
    } else {
      console.log('Insufficient balance or invalid amount.');
      return false;
    }
  }

  //LOGIN
  login(username: string, password: string): boolean {
    const user = this.usersSignal().find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      const loginTime = new Date().getTime();
      localStorage.setItem('loggedInUser', JSON.stringify({ user, loginTime }));
      this.loggedInUserSignal.set(user);
      return true;
    }
    return false;
  }

  //SIGN UP
  signUp(username: string, password: string): boolean {
    const userExists = this.usersSignal().some(
      (user) => user.username === username
    );
    if (!userExists) {
      const newUser: User = {
        id: Math.floor(Math.random() * 10000).toString(),
        username,
        password,
        balance: 0,
      };
      this.usersSignal.update((users) => [...users, newUser]);
      this.saveUsersToLocalStorage();

      const loginTime = new Date().getTime();
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ user: newUser, loginTime })
      );
      this.loggedInUserSignal.set(newUser);

      return true;
    }
    return false;
  }

  //LOGOUT
  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUserSignal.set(null);
  }
}
