import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  readonly WEB_URL: string = environment.serverUrl;
  constructor(private _http: HttpClient) { }

  getAgreements() {
    return this._http.get(`${this.WEB_URL}/api/agreement`);
  }
}
