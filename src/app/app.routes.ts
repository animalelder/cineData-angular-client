import { Routes } from '@angular/router';
import { WelcomeViewComponent } from './welcome-view/welcome-view.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';

export const appRoutes: Routes = [
  { path: 'welcome', component: WelcomeViewComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: ProfileViewComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
];
