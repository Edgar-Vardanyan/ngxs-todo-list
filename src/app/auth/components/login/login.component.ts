import { Component, inject } from '@angular/core';
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
import { AuthService } from '../../service/auth.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzAlertModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _fb: FormBuilder = inject(FormBuilder);

  public showLoginError: boolean = false;
  public loginForm: FormGroup = this._fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onLogin(): void {
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    this._authService.login(username, password).subscribe(isValid => {
      if (isValid) {
        this._router.navigate(['/dashboard']);
      } else {
        this.showLoginError = true;
        setTimeout(() => {
          this.showLoginError = false;
        }, 2000);
      }
    });
  }
}
