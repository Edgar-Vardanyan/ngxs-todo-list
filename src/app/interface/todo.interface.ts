export interface Todo {
  id: number;
  name: string;
  completed: boolean;
}

export interface UserTodos {
  username: string;
  todos: Todo[];
}

export interface TodoStateModel {
  todos: UserTodos[];
}
