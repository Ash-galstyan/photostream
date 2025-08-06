import { FavoritesComponent } from './components/favorites/favorites';
import { Routes } from '@angular/router';
import { PhotosComponent } from './components/photos/photos';
import { PhotoDetailComponent } from './components/photo-detail/photo-detail';

export const routes: Routes = [
  { path: '', component: PhotosComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'photos/:id', component: PhotoDetailComponent }
];
