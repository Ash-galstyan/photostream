import { Component, OnInit } from '@angular/core';
import { Photo } from '../../interfaces/photo';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class FavoritesComponent implements OnInit {
  favoritePhotos: Photo[] = [];

  constructor(private router: Router, private favoritesService: FavoritesService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.favoritePhotos = this.favoritesService.favorites;
    this.favoritePhotos.map((photo: Photo) => {
      return {
        id: photo.id,
        url: photo.url
      }
    })
  }

  viewPhoto(photo: string) {
    this.router.navigate(['/photos', encodeURIComponent(photo)]);
  }
}
