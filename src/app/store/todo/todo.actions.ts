import { Todo } from "./todo.state";

export class AddTodo {
    static readonly type = '[Todo] Add Todo';
    constructor(public username: string, public todo: Todo) {}
  }
  
  export class DeleteTodo {
    static readonly type = '[Todo] Delete Todo';
    constructor(public username: string, public todoId: number) {}
  }
  
  export class ToggleTodoCompletion {
    static readonly type = '[Todo] Toggle Todo Completion';
    constructor(public username: string, public todoId: number) {}
  }
  