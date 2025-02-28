import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { resetStateAction } from 'src/app/store/meta/actions';
import { UserActions } from 'src/app/store/user-store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
    password: new FormControl(''),
    remember: new FormControl(false),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  public login() {
    const login: Login = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
      remember: this.loginForm.value.remember ?? false,
    };

    this.store.dispatch(resetStateAction());
    this.store.dispatch(UserActions.login(login));

    this.loginForm.patchValue({ password: '' });
  }

  public disableLoginButton(): boolean {
    return this.loginForm.value.email === '' || this.loginForm.value.password === '';
  }
}
