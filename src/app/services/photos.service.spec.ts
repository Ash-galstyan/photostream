import { PhotoService } from './photo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  const mockPhotosUrl = 'https://picsum.photos/200/300';
  const bulkCount = 9;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotoService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the PhotoService', () => {
    expect(service).toBeTruthy();
  });

  it('`getPhoto` should make an HTTP GET request and return the photo URL', (done) => {
    service.getPhoto().subscribe((url) => {
      expect(url).toBe(mockPhotosUrl);
      done();
    });

    const req = httpMock.expectOne(mockPhotosUrl);
    expect(req.request.method).toBe('GET');

    req.flush(null, { headers: { location: mockPhotosUrl } });
  });
});
