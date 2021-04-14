import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CygnusService {

  readonly WEB_URL: string = environment.serverUrl;
  constructor(private _http: HttpClient) { }

  getContributionsBalance(numeroIdentificacion): Promise<any>  {
    return this._http.get(`${this.WEB_URL}/api/cygnus/getContributionsBalance?numeroIdentificacion=${numeroIdentificacion}`).toPromise();
  }
}
