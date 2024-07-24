import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { User } from '../../interface/users.interface';

export class AddUser {
  static readonly type = '[User] Add User';
  constructor(public payload: User) {}
}

export class RemoveUser {
  static readonly type = '[User] Remove User';
  constructor(public payload: string) {}
}

export interface UserStateModel {
  users: User[];
}

function saveUsersToLocalStorage(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

@State<UserStateModel>({
  name: 'users',
  defaults: {
    users: JSON.parse(localStorage.getItem('users') || '[]')
  }
})
@Injectable()
export class UserState {
  @Selector()
  static getUsers(state: UserStateModel) {
    return state.users;
  }

  @Action(AddUser)
  addUser(ctx: StateContext<UserStateModel>, action: AddUser) {
    const state = ctx.getState();
    const updatedUsers = [...state.users, action.payload];
    ctx.setState({
      ...state,
      users: updatedUsers
    });
    saveUsersToLocalStorage(updatedUsers);
  }

  @Action(RemoveUser)
  removeUser(ctx: StateContext<UserStateModel>, action: RemoveUser) {
    const state = ctx.getState();
    const updatedUsers = state.users.filter(user => user.username !== action.payload);
    ctx.setState({
      ...state,
      users: updatedUsers
    });
    saveUsersToLocalStorage(updatedUsers);
  }
}
