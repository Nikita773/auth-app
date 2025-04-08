import { FormControl } from '@angular/forms';

export interface Auth {
  email: string;
  password: string;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface MockUser {
  email: string;
  password: string;
  fullName: string;
  token: string;
}
