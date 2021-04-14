import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  readonly WEB_URL: string = environment.serverUrl;

  constructor(private _http: HttpClient) { }

  getApplicantSummary(id): Promise<any> {
    return this._http.get(this.WEB_URL.concat(`/api/request/getApplicantSummary?id=${id}`)).toPromise();
  }

  getCloseRequests() {
      return this._http.get(this.WEB_URL.concat('/api/request/getCloseRequests'));
  }
  getPendingPayerRequests() {
    return this._http.get(this.WEB_URL.concat('/api/request/getPendingPayerRequests'));
  }
  getAcceptedPayerRequests() {
    return this._http.get(this.WEB_URL.concat('/api/request/getAcceptedPayerRequests'));
  }
  getRejectedPayerRequests() {
    return this._http.get(this.WEB_URL.concat('/api/request/getRejectedPayerRequests'));
  }

  updateRequestComments(data) {
    return this._http.post(this.WEB_URL.concat(`/api/request/updateRequestComments`), data).toPromise();
  }

  getRrequestByTicket(ticket) {
    return this._http.post(this.WEB_URL.concat(`/api/request/getRrequestByTicket`), {ticket}).toPromise();
  }

  saveRequest(data: any = {}): Promise <any> {
    return this._http.post(`${this.WEB_URL}/api/request/saveRequest`, data).toPromise();
  }

  validateForm(data: any = {}): Promise<any> {
    return this._http.post(`${this.WEB_URL}/api/request/validateForm`, data).toPromise();
  }

  getSections(id): Promise<any> {
    return this._http.get(`${this.WEB_URL}/api/master/getPermissionsByProductType?id=${id}`).toPromise();
  }

  saveRequestProductTax(productTaxes, requestId, productId): Promise<any> {
    return this._http.post(`${this.WEB_URL}/api/request/saveRequestProductTax`, {productTaxes, requestId, productId}).toPromise();
  }

  executeDecisionEngine(requestId) {
    return this._http.post(`${this.WEB_URL}/api/engine/executeEngineDecision`, { requestId });
  }
}

