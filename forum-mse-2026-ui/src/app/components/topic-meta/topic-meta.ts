import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Topic } from '../../../lib/constants';

@Component({
  selector: 'app-topic-meta',
  imports: [DatePipe],
  templateUrl: './topic-meta.html',
  styleUrl: './topic-meta.css',
})
export class TopicMeta {
  @Input() topic: Topic | null = null;
}
