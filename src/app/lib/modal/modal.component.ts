import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Output() closeEvent: EventEmitter<undefined> = new EventEmitter<undefined>();

  close() {
    this.closeEvent.emit();
  }
}
