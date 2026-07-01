import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopicCard } from '../topic-card/topic-card';
import { ForumService } from '../../forum-service';
import { AuthService } from '../../auth';
import { Topic } from '../../../lib/constants';

@Component({
  selector: 'app-topic-list',
  imports: [RouterLink, TopicCard],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicList implements OnInit {
  private readonly forum = inject(ForumService);
  protected readonly auth = inject(AuthService);
  protected readonly topics = signal<Topic[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.forum.listTopics().subscribe({
      next: (topics) => {
        this.topics.set(topics);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load topics.');
        this.loading.set(false);
      },
    });
  }
}
