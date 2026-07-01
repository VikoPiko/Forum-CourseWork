import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTopicRequest } from '../../../lib/constants';

@Component({
  selector: 'app-topic-editor',
  imports: [FormsModule],
  templateUrl: './topic-editor.html',
  styleUrl: './topic-editor.css',
})
export class TopicEditor {
  @Input() title = '';
  @Input() content = '';
  @Input() submitLabel = 'Save topic';
  @Input() busy = false;
  @Input() showCancel = true;
  @Output() topicSubmit = new EventEmitter<CreateTopicRequest>();
  @Output() topicCancel = new EventEmitter<void>();

  protected submit(): void {
    this.topicSubmit.emit({ title: this.title, content: this.content });
  }
}
