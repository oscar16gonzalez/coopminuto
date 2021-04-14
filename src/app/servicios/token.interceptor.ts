
import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import * as alertify from 'alertifyjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private readonly WEB_URL: string = environment.serverUrl;

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(this.WEB_URL)) {
      if (this.authService.getJwtToken()) {
        request = this.addToken(request, this.authService.getJwtToken());
      }
    }
    return next.handle(request).pipe(catchError((error) => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403 || error.status === 408)) {
        this.isRefreshing = false;
        alertify.alert('Información', 'Su sesión ha expirado, inicia sesión nuevamente', function () { }).set({ closableByDimmer: false, movable: false });
        this.authService.logout();
      }
      return throwError(error);
    }));

  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
