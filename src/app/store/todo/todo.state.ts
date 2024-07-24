import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddTodo, DeleteTodo, ToggleTodoCompletion } from './todo.actions';
import { User } from '../../interface/users.interface';

export interface Todo {
  id: number;
  name: string;
  completed: boolean;
}

export interface TodoStateModel {
  users: User[];
}

@State<TodoStateModel>({
  name: 'todoState',
  defaults: {
    users: JSON.parse(localStorage.getItem('users') || '[]')
  }
})
@Injectable()
export class TodoState {
  @Selector()
  static getUserTodos(state: TodoStateModel) {
    return (username: string) => {
      const user = state.users.find(user => user.username === username);
      return user ? user.todos : [];
    };
  }

  @Action(AddTodo)
  addTodo(
    { getState, patchState }: StateContext<TodoStateModel>,
    { username, todo }: AddTodo
  ) {
    const state = getState();
    const users = [...state.users];
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        todos: [...users[userIndex].todos, todo]
      };
    } else {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = allUsers.find((user: any) => user.username === username);
      if (newUser) {
        newUser.todos.push(todo);
        users.push(newUser);
      }
    }

    patchState({ users });
    this.saveUsersToLocalStorage(users);
  }

  @Action(DeleteTodo)
  deleteTodo(
    { getState, patchState }: StateContext<TodoStateModel>,
    { username, todoId }: DeleteTodo
  ) {
    const state = getState();
    const users = [...state.users];
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        todos: users[userIndex].todos.filter(todo => todo.id !== todoId)
      };
    }

    patchState({ users });
    this.saveUsersToLocalStorage(users);
  }

  @Action(ToggleTodoCompletion)
  toggleTodoCompletion(
    { getState, patchState }: StateContext<TodoStateModel>,
    { username, todoId }: ToggleTodoCompletion
  ) {
    const state = getState();
    const users = [...state.users];
    const userIndex = users.findIndex(user => user.username === username);
     console.log(users[userIndex])
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        todos: users[userIndex].todos.map(todo =>
          todo.id === todoId ? { ...todo, completed: todo.completed } : todo
        )
      };
    }

    patchState({ users });
    this.saveUsersToLocalStorage(users);
  }

  private saveUsersToLocalStorage(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
