import { Component, OnInit } from '@angular/core';
import { InvitationProjectService } from '../../Service/invitation-project.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invitationproject',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './invitationproject.component.html',
  styleUrl: './invitationproject.component.css'
})
export class InvitationprojectComponent implements OnInit{
inviteForm!: FormGroup;
currentProjectId!: number; 

  constructor(private invitationService: InvitationProjectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.inviteForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.currentProjectId = Number(this.route.snapshot.params["projectId"]);
    console.log('Current project id: ', this.currentProjectId);
  }

  inviteUserToProject() {
    const emailControl = this.inviteForm.get('email');
    if (emailControl) {
      const email = emailControl.value;
      this.invitationService.invite(this.currentProjectId, email).subscribe((response) => {
        console.log(response);
      });
    }
  }
}