import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions: any;
  isLogged: BehaviorSubject<boolean>;
  readonly JWT_TOKEN = 'JWT_TOKEN';
  readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  readonly EXPIRES_AT = 'EXPIRES_AT';
  readonly WEB_URL: string = environment.serverUrl;

  constructor(private _http: HttpClient, private storageService: StorageService) {
    if (localStorage.getItem(this.JWT_TOKEN)) {
      this.isLogged = new BehaviorSubject<boolean>(true);
    } else {
      this.isLogged = new BehaviorSubject<boolean>(false);
    }
  }

  login({ userEmail, password }) {
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), observe: 'response' };
    return this._http.post(this.WEB_URL.concat('/api/user/login'), { userEmail, password }, this.httpOptions).pipe(tap((tokens: any) => {
      this.setSession(tokens.body);
    }));
  }

  refreshToken() {
    return this._http.post<any>(this.WEB_URL.concat('/api/user/token'), {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens) => {
      this.setSession(tokens);
    }));
  }

  logout() {
    return this._http.post(this.WEB_URL.concat('/api/user/logout'), {})
      .subscribe(res => {
        this.removeTokens();
        this.storageService.logout();
      }, error => {
        this.removeTokens();
        this.storageService.logout();
      });
  }

  isLoggedIn(): BehaviorSubject<boolean> {
    return this.isLogged;
  }

  getExpiration() {
    const expiration = localStorage.getItem(this.EXPIRES_AT);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getJwtToken() {
    const token = localStorage.getItem(this.JWT_TOKEN);
    return token;
  }

  getRoles() {
    const token = this.getJwtToken();
    if (token) {
      const decodeToken: any = jwt_decode(token);
      if (decodeToken) {
        return decodeToken.data.rol;
      }
    }
    return null;
  }

  isAuthorized(allowedRoles: string[]): boolean {
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
    const token = this.getJwtToken();
    if (token) {
      const decodeToken: any = jwt_decode(token);
      if (!decodeToken) {
        return false;
      }
      return allowedRoles.includes(decodeToken.data.rol);
    }
    return false;
  }

  isAuthenticated(): boolean {
    return this.storageService.isAuthenticated();
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  removeTokens() {
    this.isLogged.next(false);
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.EXPIRES_AT);
  }

  setSession(authResult) {
    this.isLogged.next(true);
    const expiresAt = moment(authResult.expires_at);
    localStorage.setItem(this.JWT_TOKEN, authResult.token);
    localStorage.setItem(this.REFRESH_TOKEN, authResult.refreshToken);
    localStorage.setItem(this.EXPIRES_AT, JSON.stringify(expiresAt.valueOf()));
  }
}