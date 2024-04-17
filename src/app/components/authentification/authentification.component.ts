import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';
import { LogsDto } from '../../model/logsDto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.css'
})
export class AuthentificationComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  errorMessage = '';
  hide = true;

  constructor(
    public auth: AuthService, 
    public formBuilder: FormBuilder ) { 
      
      merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMail());
      
  }

  public connectionForm = this.formBuilder.group({
    email: this.email,
    password: this.password
  });

  onSubmit() {
    // console.log('onSubmit was called');
    let user : LogsDto = {
      email: this.connectionForm.value.email!,
      password: this.connectionForm.value.password!
    }
    this.auth.login(user).subscribe();
  }

  updateErrorMail() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }
}

