import { Injectable, inject } from '@angular/core';
import { User } from '../../interface/users.interface';
import { Store } from '@ngxs/store';
import { AddUser, RemoveUser, UserState } from '../../store/user/user.state';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _store = inject(Store);
  private _loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor() { }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('auth_token');
  }

  public register(username: string, password: string): void {
    const newUser: User = {
      username,
      password,
      todos: []
    }
    const users: User[] = JSON.parse(localStorage.getItem('users') as string) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
  }

  login(username: string, password: string): Observable<boolean> {
    return this._store.selectOnce(UserState.getUsers).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          sessionStorage.setItem('auth_token', 'some-auth-token');
          localStorage.setItem('current_user', username);
          this._loggedIn.next(true);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this._loggedIn.next(false);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('current_user');
  }

  addUser(user: User) {
    this._store.dispatch(new AddUser(user));
  }

  removeUser(username: string) {
    this._store.dispatch(new RemoveUser(username));
  }

  getUsers() {
    return this._store.select(state => state.users.users);
  }

  checkUserExists(username: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => users.some((user: User) => user.username === username))
    );
  }

  validateLogin(username: string, password: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
        const user = users.find((user: User) => user.username === username);
        const isValid = user ? user.password === password : false;
        if (isValid) {
          this._loggedIn.next(true);
        }
        return isValid;
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this._loggedIn.asObservable();
  }
}
