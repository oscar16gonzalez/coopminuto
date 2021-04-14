import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  readonly WEB_URL: string = environment.serverUrl;

  constructor(private _http: HttpClient) { }

  generateValidate(data: any = {}): Observable<any> {
    return this._http.post(`${this.WEB_URL}/api/validate/generateValidate`, data);
  }

  validateAnswers(data: any = {}): Observable<any> {
    return this._http.post(`${this.WEB_URL}/api/validate/validateAnswers`, data);
  }
}
