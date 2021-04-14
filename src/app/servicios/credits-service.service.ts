import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  private currentRequestSubject: BehaviorSubject<any>;
  public currentRequest: Observable<string>;
  private httpOptions: any;

  WEB_URL: string = environment.serverUrl;
  urlMaster = environment.serverUrl.concat('/api/master');

  constructor(private http: HttpClient) {
    try {
      this.currentRequestSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentRequest')));
      this.currentRequest = this.currentRequestSubject.asObservable();
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    } catch (Exception) { }
  }

  getRequestSummaryMovilAdvisors(page: number = 1, name?: string, direction?: string, username?: string, origen?: string, viability?: string, state?: string, newFrom?: string, newTo?: string, filter?: string, office?: string): Observable<any> {
    const httpOptions =
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
      params: new HttpParams()
        .set('page', page.toString())
        .set('name', name ? name : '')
        .set('direction', direction ? direction : '')
        .set('username', username ? username : '')
        .set('origen', origen ? origen : '')
        .set('viability', viability ? viability : '')
        .set('state', state ? state : '')
        .set('newFrom', newFrom ? newFrom : '')
        .set('newTo', newTo ? newTo : '')
        .set('filter', filter ? filter : '')
        .set('office', office ? office : '')
    };
    return this.http.get(`${this.urlMaster}/getRequestSummaryMovilAdvisors`, httpOptions);
  }
}
