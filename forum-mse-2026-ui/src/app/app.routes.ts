import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';
import { TopicList } from './components/topic-list/topic-list';
import { CreateTopic } from './components/create-topic/create-topic';
import { TopicDetail } from './components/topic-detail/topic-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'topics' },
  { path: 'login', component: AuthComponent },
  { path: 'topics', component: TopicList },
  { path: 'topics/new', component: CreateTopic },
  { path: 'topics/:id', component: TopicDetail },
  { path: '**', redirectTo: 'topics' },
];
