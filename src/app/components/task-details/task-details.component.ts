import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskDto } from '../../model/taskDto';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../Service/task.service';
import { map, Observable } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnChanges{

@Input() task!: TaskDto;
@Input() userNames!: { [taskId: number]: string[]; };

constructor( ) { }

ngOnChanges(changes: SimpleChanges): void {
  if (changes['userNames'] && changes['userNames'].currentValue) {
    setTimeout(() => {
      this.getInitials();
    }, 0);
  }
}

getDaysLeft(): number {
  const currentDate = new Date();
  const expirationDate = new Date(this.task.expirationDate);
  
  // Remise à zéro de l'heure pour ne comparer que les dates
  currentDate.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);

  const diffInMilliseconds = expirationDate.getTime() - currentDate.getTime();
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
}

getDaysLeftPositive() {
  const daysLeft = this.getDaysLeft();
  if (daysLeft > 2) {
    return `${daysLeft} jours restants`;
  } else if (daysLeft === 1) {
    return `${daysLeft} jour restant`;
  } else {
    // Supposons qu'une journée de travail se termine à 20h
    const endOfDay = moment().endOf('day').hour(20);
    const hoursLeft = moment().diff(endOfDay, 'hours');
    if (Math.abs(hoursLeft) > 1) {
    return `${Math.abs(hoursLeft)} heures restantes`
    } else {
    return `${Math.abs(hoursLeft)} heure restante`
    }
  }
}

getInitials() {
  const userNamesgetInitial = this.userNames[this.task.taskId];
  if (userNamesgetInitial) {
    return userNamesgetInitial.map((name) => {
      const words = name.split(' ');
      if (words.length === 1) {
        return words[0].substring(0, 2);
      } else {
        return words[0].charAt(0) + words[1].charAt(0);
      }
    }).join('').toUpperCase();
  }
  return ""; 
}

getBackgroundColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

}
