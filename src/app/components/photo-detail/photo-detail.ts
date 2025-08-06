import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-photo-detail',
  imports: [],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss'
})
export class PhotoDetailComponent implements OnInit {
  photoUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.photoUrl = decodeURIComponent(this.route.snapshot.paramMap.get('id') || '');
  }

  removeFavorite() {
    const favorites = this.favoritesService.favorites;
    this.favoritesService.favorites = this.favoritesService.favorites.filter(photo => photo.url !== this.photoUrl);
    localStorage.setItem('favorites', JSON.stringify(this.favoritesService.favorites));
    this.router.navigate(['/favorites']);
  }
}
