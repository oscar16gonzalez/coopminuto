import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  readonly WEB_URL: string = environment.serverUrl;
  constructor(private _http: HttpClient) { }

  getIp(): Observable<string> {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'https://api.ipify.org');
    return this._http.get(`https://api.ipify.org/?format=text`, { responseType: 'text', headers });
  }
}
