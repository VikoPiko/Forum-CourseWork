import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopicMeta } from '../topic-meta/topic-meta';
import { Topic } from '../../../lib/constants';

@Component({
  selector: 'app-topic-card',
  imports: [RouterLink, TopicMeta],
  templateUrl: './topic-card.html',
  styleUrl: './topic-card.css',
})
export class TopicCard {
  @Input() topic: Topic | null = null;
}
