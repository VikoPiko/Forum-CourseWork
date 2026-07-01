import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReplyEditor } from '../reply-editor/reply-editor';
import { ReplyList } from '../reply-list/reply-list';
import { TopicEditor } from '../topic-editor/topic-editor';
import { TopicMeta } from '../topic-meta/topic-meta';
import { ForumService } from '../../forum-service';
import { AuthService } from '../../auth';
import { CreateTopicRequest, Reply, Topic } from '../../../lib/constants';

@Component({
  selector: 'app-topic-detail',
  imports: [RouterLink, ReplyEditor, ReplyList, TopicEditor, TopicMeta],
  templateUrl: './topic-detail.html',
  styleUrl: './topic-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly forum = inject(ForumService);
  protected readonly auth = inject(AuthService);

  protected readonly topic = signal<Topic | null>(null);
  protected readonly replies = signal<Reply[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly savingReply = signal(false);
  protected readonly editingTopic = signal(false);
  protected readonly editingReplyId = signal<number | null>(null);
  protected readonly editReplyText = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.forum.getTopic(id).subscribe({
      next: (topic) => {
        this.topic.set(topic);
        this.loading.set(false);
        this.loadReplies();
      },
      error: () => {
        this.error.set('Topic not found.');
        this.loading.set(false);
      },
    });
  }

  protected loadReplies(): void {
    const topic = this.topic();
    if (!topic) return;
    this.forum.listReplies(topic.id).subscribe({
      next: (response) => this.replies.set(response),
      error: () => this.error.set('Could not load replies.'),
    });
  }

  protected createReply(text: string): void {
    const topic = this.topic();
    if (!topic) return;
    this.savingReply.set(true);
    this.forum.createReply(topic.id, { content: text }).subscribe({
      next: () => {
        this.savingReply.set(false);
        this.loadReplies();
      },
      error: () => {
        this.savingReply.set(false);
        this.error.set('Could not create reply.');
      },
    });
  }

  protected canEdit(ownerUserId: number): boolean {
    const user = this.auth.currentUser();
    return (
      !!user && (user.role === 'ADMIN' || user.role === 'MODERATOR' || user.id === ownerUserId)
    );
  }

  protected canEditAny(): boolean {
    const user = this.auth.currentUser();
    return !!user && (user.role === 'ADMIN' || user.role === 'MODERATOR');
  }

  protected saveTopic(request: CreateTopicRequest): void {
    const topic = this.topic();
    if (!topic) return;
    this.forum.updateTopic(topic.id, request).subscribe({
      next: (updated) => {
        this.topic.set(updated);
        this.editingTopic.set(false);
      },
      error: () => this.error.set('Could not update topic.'),
    });
  }

  protected startReplyEdit(reply: Reply): void {
    this.editReplyText.set(reply.text);
    this.editingReplyId.set(reply.id);
  }

  protected saveReplyEdit(payload: { reply: Reply; text: string }): void {
    this.forum.updateReply(payload.reply.id, { text: payload.text }).subscribe({
      next: () => {
        this.editingReplyId.set(null);
        this.loadReplies();
      },
      error: () => this.error.set('Could not update reply.'),
    });
  }
}
