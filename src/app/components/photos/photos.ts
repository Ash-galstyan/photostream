import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { SafeUrl } from '@angular/platform-browser';
import { Photo } from '../../interfaces/photo';
import { Subject, takeUntil } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photos',
  imports: [CommonModule],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef
  photos: Photo[] = [];
  loading: boolean = false;
  imgUrls: SafeUrl | null = null;
  id = -1;
  private _destroyed = new Subject<void>();
  selectedItemIndexes: number[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private photoService: PhotoService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadInitialPhotos();
  }

  private loadInitialPhotos() {
    this.loadMorePhotos();
  }

  private loadMorePhotos() {
    this.loading = true;
    this.photoService.getBulkPhotos().pipe(takeUntil(this._destroyed)).subscribe((blobs) => {
      blobs.map((blob) => {
        this.id ++;
        this.photos.push({
          id: this.id,
          url: blob
        });
      })
      this.loading = false;
      this.cdRef.markForCheck();
    },
    (err) => {
      console.error('Image loading failed:', err);
      this.loading = false;
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {

    const container = this.scrollContainer.nativeElement as HTMLElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const variance = 10;

    if (scrollTop + clientHeight >= scrollHeight - variance && !this.loading) {
      this.loadMorePhotos();
    }
  }

  addFavorite(photo: Photo) {
    this.selectedItemIndexes.push(photo.id);
    this.favoritesService.addToFavorite(photo);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
