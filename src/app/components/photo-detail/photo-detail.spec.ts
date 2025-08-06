import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetailComponent } from './photo-detail';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => 'https%3A%2F%2Fexample.com%2Fphoto.jpg',
    },
  };
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockFavoritesService {
  favorites = [
    { url: 'https://example.com/photo1.jpg' },
    { url: 'https://example.com/photo2.jpg' },
  ];
}

describe('PhotoDetail', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let mockFavoritesService: MockFavoritesService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    mockFavoritesService = new MockFavoritesService();
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      imports: [PhotoDetailComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should decode and set `photoUrl` from ActivatedRoute parameter on ngOnInit', () => {
    expect(component.photoUrl).toBe('https://example.com/photo.jpg');
  });

  it('should remove a photo from favorites and navigate to /favorites', () => {
    const initialFavorites = [
      { url: 'https://example.com/photo.jpg' },
      { url: 'https://example.com/photo2.jpg' },
    ];
    mockFavoritesService.favorites = initialFavorites;

    component.photoUrl = 'https://example.com/photo.jpg';
    component.removeFavorite();

    expect(mockFavoritesService.favorites.length).toBe(1);
    expect(mockFavoritesService.favorites[0].url).toBe('https://example.com/photo2.jpg');

    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(storedFavorites.length).toBe(1);
    expect(storedFavorites[0].url).toBe('https://example.com/photo2.jpg');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/favorites']);
  });
});
