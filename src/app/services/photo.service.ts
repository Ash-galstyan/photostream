import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, forkJoin, map, Observable } from "rxjs";
const photosUrl = 'https://picsum.photos/200/300';
const delayTime = 300;
const bulkCount = 9;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private http: HttpClient) {}

  getPhoto(): Observable<string> {
    return this.http.get(photosUrl, { observe: 'response', responseType: 'blob' }).pipe(
      delay(delayTime),
      map((response) => response.url || '')
    )
  }

  getBulkPhotos(): Observable<string[]> {
    const requests: Observable<string>[] = [];
    for (let i = 0; i < bulkCount; i++) {
      requests.push(this.getPhoto());
    }

    return forkJoin(requests)
  }
}
