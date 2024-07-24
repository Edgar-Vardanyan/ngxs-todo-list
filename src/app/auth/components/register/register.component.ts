import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AuthService } from '../../service/auth.service';
import { checkUserExists } from '../../util/check-user-exist.util';
import { confirmPasswordValidator } from '../../util/custom-validators/confirm-password.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzAlertModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private _fb: FormBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  public showUserExistsError: boolean = false;
  public showRegisterSuccess: boolean = false;
  public registerForm: FormGroup = this._fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.registerForm.setValidators(confirmPasswordValidator);
  }

  onRegister() {
    const username = this.registerForm.controls['username'].value;
    const password = this.registerForm.controls['password'].value;
    if (checkUserExists(username)) {
      this.showUserExistsError = true;
      setTimeout(() => {
        this.showUserExistsError = false;
      }, 2000);
    } else {
      this._authService.addUser({username: username, password: password, todos: []});
      this.showRegisterSuccess = true;
      setTimeout(() => {
        this.showRegisterSuccess = false;
        this._router.navigate(['login']);
      }, 1000);
    }
  }
}
