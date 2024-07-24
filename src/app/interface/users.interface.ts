import { Todo } from "./todo.interface";

export interface User {
    username: string;
    password: string;
    todos: Todo[] 
}
