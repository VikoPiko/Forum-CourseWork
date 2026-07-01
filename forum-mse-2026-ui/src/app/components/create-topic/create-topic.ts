import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TopicEditor } from '../topic-editor/topic-editor';
import { ForumService } from '../../forum-service';
import { AuthService } from '../../auth';
import { CreateTopicRequest } from '../../../lib/constants';

@Component({
  selector: 'app-create-topic',
  imports: [RouterLink, TopicEditor],
  templateUrl: './create-topic.html',
  styleUrl: './create-topic.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTopic {
  private readonly forum = inject(ForumService);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected create(request: CreateTopicRequest): void {
    this.saving.set(true);
    this.error.set('');
    this.forum.createTopic(request).subscribe({
      next: (topic) => void this.router.navigate(['/topics', topic.id]),
      error: () => {
        this.saving.set(false);
        this.error.set('Could not create topic. The title may already exist.');
      },
    });
  }
}
