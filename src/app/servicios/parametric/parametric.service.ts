import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Parametrics } from 'src/entities/parametrics';

@Injectable({
  providedIn: 'root'
})
export class ParametricService {

  readonly WEB_URL: string = environment.serverUrl;

  sharedParametric = new BehaviorSubject<Parametrics>(new Parametrics());

  constructor(private _http: HttpClient) {
  }

  getCustomerParametrics(): Observable<any> {
    return this._http.get(`${this.WEB_URL}/api/master/getCustomerParametrics`).pipe(tap((parametric: Parametrics) => this.setParametric(parametric)))
  }

  setParametric(parametric: Parametrics) {
    this.sharedParametric.next(parametric)
  }
}
