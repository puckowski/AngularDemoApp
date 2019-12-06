import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private readonly SEGMENT_LENGTH_NO_ACTIVE_ROUTE: number = 0;

  public readonly ROUTE_BOTTOM_SHEET_DEFAULT: string = 'partinfo/';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  public getCurrentRouteUrlSegments(): UrlSegment[] {
    return this.activatedRoute.snapshot.url;
  }

  public getCurrentRouteStringSegments(): string[] {
    return Array.from(this.activatedRoute.snapshot.url, (urlSegment: UrlSegment) => urlSegment.path);
  }

  public navigateRelative(relativeRouteStringArray: string[]): void {
    if (this.getCurrentRouteUrlSegments().length === this.SEGMENT_LENGTH_NO_ACTIVE_ROUTE) {
      relativeRouteStringArray.unshift(this.ROUTE_BOTTOM_SHEET_DEFAULT);
      this.router.navigate(relativeRouteStringArray, { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(relativeRouteStringArray, { relativeTo: this.activatedRoute });
    }
  }

  public navigateAbsolute(routeStringArray: string[]) {
    this.router.navigate(routeStringArray);
  }

  public navigateLogin(): void {
    this.router.navigate(['login']);
  }

  public navigateRoot(): void {
    this.router.navigate(['/']);
  }

  public navigateCurrent(): void {
    const currentRouteStringArray: Array<string> = this.getCurrentRouteStringSegments();

    this.router.navigate(currentRouteStringArray);
  }

  public hasActiveRoute(): boolean {
    return this.getCurrentRouteUrlSegments().length > this.SEGMENT_LENGTH_NO_ACTIVE_ROUTE;
  }
}
