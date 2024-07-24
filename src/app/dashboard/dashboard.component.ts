import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { TodoService } from './service/todo.service';
import { Todo } from '../store/todo/todo.state';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzListModule,
    NzCheckboxModule,
    NzPaginationModule
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private _todoService = inject(TodoService);
  private _userService = inject(AuthService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  todoForm: FormGroup = this._fb.group({
    name: ['']
  });
  todos = signal<Todo[]>([]);
  filteredTodos = signal<Todo[]>([]);
  currentUsername = signal<string>('');
  pageIndex = signal<number>(1);
  pageSize = 10;
  currentFilter = signal<string>('all');

  ngOnInit(): void {
    this.todoForm = this._fb.group({
      name: ['']
    });

    const currentUser = this._userService.getCurrentUser();
    if (currentUser) {
      this.currentUsername.set(currentUser);
      this.loadTodos();
    }
  }

  loadTodos() {
    this._todoService.getUserTodos(this.currentUsername()).subscribe(todos => {
      this.todos.set(todos);
      this.updateFilteredTodos();
    });
  }

  addTodo() {
    const name = this.todoForm.controls['name'].value;
    const newTodo: Todo = {
      id: Date.now(),
      name,
      completed: false
    };
    this._todoService.addTodo(this.currentUsername(), newTodo).subscribe(() => {
      this.updateFilteredTodos();
    });
    this.todoForm.reset();
  }

  deleteTodo(todoId: number) {
    this._todoService.deleteTodo(this.currentUsername(), todoId).subscribe(() => {
      this.todos.set(this.todos().filter(todo => todo.id !== todoId));
      this.updateFilteredTodos();
    });
  }

  toggleTodoCompletion(todoId: number) {
    console.log(todoId)
    this._todoService.toggleTodoCompletion(this.currentUsername(), todoId).subscribe(() => {
      this._todoService.getUserTodos(this.currentUsername()).subscribe(todos => {
        this.todos.set(todos);
        this.updateFilteredTodos();
      });
    });
  }

  filterTodos(status: string) {
    this.currentFilter.set(status);
    this.updateFilteredTodos();
  }

  search(event: any) {
    const query = event.target.value;
    if (query) {
      this.filteredTodos.set(this.todos().filter(todo => todo.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      this.filterTodos(this.currentFilter());
    }
  }

  onPageChange(page: number) {
    this.pageIndex.set(page);
    this.updateFilteredTodos();
  }

  updateFilteredTodos() {
    let filtered = this.todos();
    if (this.currentFilter() === 'active') {
      filtered = this.todos().filter(todo => !todo.completed);
    } else if (this.currentFilter() === 'completed') {
      filtered = this.todos().filter(todo => todo.completed);
    }
    this.filteredTodos.set(filtered.slice((this.pageIndex() - 1) * this.pageSize, this.pageIndex() * this.pageSize));
  }

  totalTodos() {
    return this.todos().length;
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  logout() {
    this._userService.logout();
    this._router.navigate(['/login']);
  }
}
