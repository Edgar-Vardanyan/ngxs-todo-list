import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo, TodoState } from '../../store/todo/todo.state';
import { AddTodo, DeleteTodo, ToggleTodoCompletion } from '../../store/todo/todo.actions';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private store: Store) {}

  addTodo(username: string, todo: Todo): Observable<void> {
    return this.store.dispatch(new AddTodo(username, todo));
  }

  deleteTodo(username: string, todoId: number): Observable<void> {
    return this.store.dispatch(new DeleteTodo(username, todoId));
  }

  toggleTodoCompletion(username: string, todoId: number): Observable<void> {
    return this.store.dispatch(new ToggleTodoCompletion(username, todoId));
  }

  getUserTodos(username: string): Observable<Todo[]> {
    return this.store.select(TodoState.getUserTodos).pipe(
      map(selectorFn => selectorFn(username))
    );
  }
}
