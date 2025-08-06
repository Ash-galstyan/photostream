import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header';
import { provideZonelessChangeDetection } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

class MockRouter {
  events = new Subject<Event>();
  navigate = jasmine.createSpy('navigate');
}
let mockRouter: MockRouter;

describe('Header', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update `activeRoute` when a `NavigationEnd` event occurs', () => {
    (router.events as Subject<Event>).next(new NavigationEnd(1, '/test-route', '/test-route'));

    expect(component.activeRoute).toBe('/test-route');
  });

  it('should call `router.navigate` with the correct route when `navigate` is called', () => {
    component.navigate('/new-route');

    expect(router.navigate).toHaveBeenCalledWith(['/new-route']);
  });
});
