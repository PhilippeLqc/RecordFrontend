import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../layouts/header/header.component';
import { FooterComponent } from '../layouts/footer/footer.component';
import { UserService } from '../../Service/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../lib/modal/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  passwordForm!: FormGroup;
  emailForm!: FormGroup;
  showModal: boolean = false;

  constructor(private userService : UserService, private snackBar: MatSnackBar, private router: Router) { }

ngOnInit(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });

    this.emailForm = new FormGroup({
      changeemail: new FormControl('', Validators.required),
      confirmEmail: new FormControl('', Validators.required)
    });
}

updatePassword() {
    if (this.passwordForm.valid && this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 2000
      });
    }
    if (this.passwordForm.valid && this.passwordForm.value.password === this.passwordForm.value.confirmPassword) {
      this.userService.changePassword(JSON.parse(localStorage.getItem('currentUser')!).id, this.passwordForm.value.password).subscribe(
        response => {
          this.openModal();
        },
        error => {
          this.snackBar.open('Password not changed', 'Close', {
            duration: 2000
          });
        }
      );
    }
}

updateEmail() {
  if (this.emailForm.valid && this.emailForm.value.changeemail === this.emailForm.value.confirmEmail) {
    this.snackBar.open('meme email ou champ manquant', 'Close', {
      duration: 2000
    });
    }
  if (this.emailForm.valid && this.emailForm.value.changeemail !== this.emailForm.value.confirmEmail) {
    this.userService.changeEmail(JSON.parse(localStorage.getItem('currentUser')!).id, this.emailForm.value.changemail).subscribe(
      response => {
        this.openModal();
      },
      error => {
        this.snackBar.open('aucun email correspondance ou aucun champ rempli', 'Close', {
          duration: 2000
        });
      }
    );
  }

}

openModal() {
  this.showModal = !this.showModal;
}

closeModal() {
  this.showModal = false;
  this.router.navigate(['/home']);
}
}