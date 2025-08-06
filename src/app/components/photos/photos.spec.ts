import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosComponent } from './photos';
import { ElementRef, provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';
import { Photo } from '../../interfaces/photo';

describe('Photos', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let mockPhotoService: jasmine.SpyObj<PhotoService>;
  let mockFavoritesService: jasmine.SpyObj<FavoritesService>;

  const mockActivatedRoute = {};

  beforeEach(async () => {
    mockPhotoService = jasmine.createSpyObj('PhotoService', ['getPhoto', 'getBulkPhotos']);
    mockFavoritesService = jasmine.createSpyObj('FavoritesService', ['addToFavorite']);

    await TestBed.configureTestingModule({
      imports: [PhotosComponent, HttpClientModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PhotoService, useValue: mockPhotoService },
        { provide: FavoritesService, useValue: mockFavoritesService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;

    component.scrollContainer = new ElementRef({
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call `loadInitialPhotos` in ngOnInit', () => {
    const loadInitialPhotosSpy = spyOn<any>(component, 'loadInitialPhotos');

    component.ngOnInit();
    fixture.detectChanges();

    expect(loadInitialPhotosSpy).toHaveBeenCalled();
  });

  it('should load photos when `loadMorePhotos` is called', () => {
    const photoUrl1 = 'https://example.com/photo1.jpg';
    const photoUrl2 = 'https://example.com/photo2.jpg';
    mockPhotoService.getPhoto.and.returnValues(of(photoUrl1), of(photoUrl2));
    mockPhotoService.getBulkPhotos.and.callFake(() => {
      console.log('getBulkPhotos called');
      return of([photoUrl1, photoUrl2]);
    });

    component['loadMorePhotos']();

    expect(component.photos.length).toBe(2);
    expect(component.photos[0].url).toBe(photoUrl1);
    expect(component.photos[1].url).toBe(photoUrl2);
    expect(component.loading).toBeFalse();
    expect(mockPhotoService.getBulkPhotos).toHaveBeenCalled();
  });

  it('should handle an error from `getBulkPhotos`', () => {
    mockPhotoService.getBulkPhotos.and.returnValue(throwError(() => new Error('Error loading photos')));

    component['loadMorePhotos']();
    fixture.detectChanges();

    expect(component.photos.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should add a photo to favorites when `addFavorite` is called', () => {
    const mockPhoto: Photo = { id: 1, url: 'https://example.com/photo.jpg' };

    mockFavoritesService.addToFavorite.and.callFake((photo: Photo) => {
      localStorage.setItem('favorites', JSON.stringify([photo]));
    });

    component.addFavorite(mockPhoto);

    expect(mockFavoritesService.addToFavorite).toHaveBeenCalledWith(mockPhoto);

    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(storedFavorites.length).toBe(1);
    expect(storedFavorites[0]).toEqual(mockPhoto);
  });

  it('should call `loadMorePhotos` when scrolled to the bottom and not loading', () => {
    const loadMorePhotosSpy = spyOn(component as any, 'loadMorePhotos').and.callThrough();

    const photoUrl1 = 'https://example.com/photo1.jpg';
    const photoUrl2 = 'https://example.com/photo2.jpg';

    mockPhotoService.getPhoto.and.returnValues(of(photoUrl1), of(photoUrl2));

    mockPhotoService.getBulkPhotos.and.callFake(() => {
      return of([photoUrl1, photoUrl2]);
    });

    component.loading = false;
    component.scrollContainer = new ElementRef({
      scrollTop: 490,
      scrollHeight: 500,
      clientHeight: 10,
    });

    const scrollEvent = new Event('scroll');
    component.onScroll(scrollEvent);

    expect(loadMorePhotosSpy).toHaveBeenCalled();
    expect(mockPhotoService.getBulkPhotos).toHaveBeenCalledTimes(1);
    expect(component.photos.length).toBe(2);
    expect(component.photos[0].url).toBe(photoUrl1);
    expect(component.photos[1].url).toBe(photoUrl2);
    expect(component.loading).toBeFalse();
  });

  it('should NOT call `loadMorePhotos` when not scrolled to the bottom', () => {
    const loadMorePhotosSpy = spyOn(component as any, 'loadMorePhotos').and.callThrough();

    component.loading = false;
    component.scrollContainer = new ElementRef({
      scrollTop: 200,
      scrollHeight: 500,
      clientHeight: 10,
    });

    const scrollEvent = new Event('scroll');
    component.onScroll(scrollEvent);

    expect(loadMorePhotosSpy).not.toHaveBeenCalled();
  });

  it('should NOT call `loadMorePhotos` when loading is true', () => {
    const loadMorePhotosSpy = spyOn(component as any, 'loadMorePhotos').and.callThrough();

    component.loading = true;
    component.scrollContainer = new ElementRef({
      scrollTop: 490,
      scrollHeight: 500,
      clientHeight: 10,
    });

    const scrollEvent = new Event('scroll');
    component.onScroll(scrollEvent);

    expect(loadMorePhotosSpy).not.toHaveBeenCalled();
  });
});
