import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatComponent } from '../../chat/chat.component';
import { ChatService } from '../../../Service/chat.service';
import { ProjectService } from '../../../Service/project.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ChatComponent, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {



  currentProjectId!: number;

  constructor(private chat: ChatService, private project: ProjectService) { }

  ngOnInit(): void {
    this.project.currentProject$.subscribe((project) => {this.currentProjectId = project.id});
    this.chat.initConnection();
    
  }


  ngOnDestroy(): void {
    this.chat.closeConnection(this.currentProjectId);
  }

}
