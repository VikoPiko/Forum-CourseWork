import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RUNTIME_CONFIG } from './runtime-config';
import {
  CreateReplyRequest,
  CreateTopicRequest,
  Reply,
  Topic,
  UpdateReplyRequest,
  UpdateTopicRequest,
} from '../lib/constants';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RUNTIME_CONFIG);
  private readonly apiPrefix = '/api';

  listTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.url('/posts'));
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(this.url(`/posts/${id}`));
  }

  createTopic(request: CreateTopicRequest): Observable<Topic> {
    return this.http.post<Topic>(this.url('/posts'), request);
  }

  updateTopic(id: number, request: UpdateTopicRequest): Observable<Topic> {
    return this.http.put<Topic>(this.url(`/posts/${id}`), request);
  }

  listReplies(postId: number): Observable<Reply[]> {
    return this.http.get<Reply[]>(this.url(`/posts/${postId}/replies`));
  }

  createReply(postId: number, request: CreateReplyRequest): Observable<Reply> {
    return this.http.post<Reply>(this.url(`/posts/${postId}/replies`), request);
  }

  updateReply(replyId: number, request: UpdateReplyRequest): Observable<Reply> {
    return this.http.put<Reply>(this.url(`/replies/${replyId}`), request);
  }

  private url(path: string): string {
    return `${this.config.backendBaseUrl}${this.apiPrefix}${path}`;
  }
}
