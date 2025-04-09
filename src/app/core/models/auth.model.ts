import { FormControl } from '@angular/forms';

export interface Auth {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
