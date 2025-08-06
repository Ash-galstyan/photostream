import { Injectable } from "@angular/core";
import { Photo } from "../interfaces/photo";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  favorites: Photo[] = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites') as string) : [];

  addToFavorite(photo: Photo) {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.favorites.push(photo);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}
