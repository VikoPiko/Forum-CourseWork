import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reply } from '../../../lib/constants';

@Component({
  selector: 'app-reply-card',
  imports: [DatePipe],
  templateUrl: './reply-card.html',
  styleUrl: './reply-card.css',
})
export class ReplyCard {
  @Input() reply: Reply | null = null;
  @Input() canEdit = false;
  @Output() edit = new EventEmitter<Reply>();
}
