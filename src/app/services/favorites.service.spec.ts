import { FavoritesService } from './favorites.service';
import { Photo } from '../interfaces/photo';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();

    service = new FavoritesService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize `favorites` from localStorage if data exists', () => {
    const mockFavorites: Photo[] = [
      { id: 1, url: 'https://example.com/photo1.jpg' },
      { id: 2, url: 'https://example.com/photo2.jpg' },
    ];
    localStorage.setItem('favorites', JSON.stringify(mockFavorites));

    service = new FavoritesService();

    expect(service.favorites.length).toBe(2);
    expect(service.favorites).toEqual(mockFavorites);
  });

  it('should initialize an empty `favorites` array if no data exists in localStorage', () => {
    service = new FavoritesService();

    expect(service.favorites.length).toBe(0);
    expect(service.favorites).toEqual([]);
  });

  it('should add a photo to favorites and update localStorage', () => {
    const mockPhoto: Photo = { id: 1, url: 'https://example.com/photo1.jpg' };

    service.addToFavorite(mockPhoto);

    expect(service.favorites.length).toBe(1);
    expect(service.favorites[0]).toEqual(mockPhoto);

    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(storedFavorites.length).toBe(1);
    expect(storedFavorites[0]).toEqual(mockPhoto);
  });

  it('should append to existing favorites in localStorage', () => {
    const existingFavorites: Photo[] = [{ id: 1, url: 'https://example.com/photo1.jpg' }];
    localStorage.setItem('favorites', JSON.stringify(existingFavorites));

    const newPhoto: Photo = { id: 2, url: 'https://example.com/photo2.jpg' };
    service.addToFavorite(newPhoto);

    expect(service.favorites.length).toBe(2);
    expect(service.favorites).toEqual([
      { id: 1, url: 'https://example.com/photo1.jpg' },
      { id: 2, url: 'https://example.com/photo2.jpg' },
    ]);

    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(storedFavorites.length).toBe(2);
    expect(storedFavorites).toEqual([
      { id: 1, url: 'https://example.com/photo1.jpg' },
      { id: 2, url: 'https://example.com/photo2.jpg' },
    ]);
  });
});
