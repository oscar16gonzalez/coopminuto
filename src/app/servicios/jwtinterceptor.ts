import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            const currentRequest = JSON.parse(localStorage.getItem('currentRequest'));
            if (currentRequest && currentRequest.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentRequest.token.token}`
                    }
                });
            }
            return next.handle(request);
        } catch (Exception) {
            return next.handle(request);
        }
    }
}
