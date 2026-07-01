import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reply-editor',
  imports: [FormsModule],
  templateUrl: './reply-editor.html',
  styleUrl: './reply-editor.css',
})
export class ReplyEditor {
  @Input() text = '';
  @Input() title = 'Add reply';
  @Input() description = 'Keep the conversation moving with a clear response.';
  @Input() submitLabel = 'Post reply';
  @Input() busy = false;
  @Input() compact = false;
  @Output() replySubmit = new EventEmitter<string>();
  @Output() replyCancel = new EventEmitter<void>();

  protected submit(): void {
    this.replySubmit.emit(this.text);
    if (!this.compact) {
      this.text = '';
    }
  }
}
