import { Component } from '@angular/core';
import { AuthentificationComponent } from '../authentification/authentification.component';
import { RegisterComponent } from '../register/register.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AuthentificationComponent, RegisterComponent, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  hidden = false;

  showLogin() {
    this.hidden = false;
  }

  showRegister() {
    this.hidden = true;
  }

}
