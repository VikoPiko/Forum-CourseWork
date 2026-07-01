import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reply } from '../../../lib/constants';
import { ReplyCard } from '../reply-card/reply-card';
import { ReplyEditor } from '../reply-editor/reply-editor';

@Component({
  selector: 'app-reply-list',
  standalone: true,
  imports: [ReplyCard, ReplyEditor],
  templateUrl: './reply-list.html',
  styleUrl: './reply-list.css',
})
export class ReplyList {
  @Input() replies: Reply[] = [];
  @Input() currentUserId: number | null = null;
  @Input() canEditAny = false;
  @Input() editingReplyId: number | null = null;
  @Input() editReplyText = '';

  @Output() edit = new EventEmitter<Reply>();
  @Output() saveEdit = new EventEmitter<{ reply: Reply; text: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  protected canEdit(reply: Reply): boolean {
    return this.canEditAny || (!!this.currentUserId && reply.createdByUserId === this.currentUserId);
  }
}
