import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {
  private currentRequestSubject: BehaviorSubject<any>;
  public currentRequest: Observable<string>;
  private httpOptions: any;

  private urlMaster = environment.serverUrl.concat('api/master');
  private urlLogin = environment.serverUrl.concat('api');
  private urlValidate = environment.serverUrl.concat('api/validate');
  private urlRequrements = environment.serverUrl.concat('api/requeriment');
  private urlApplicant = environment.serverUrl.concat('api/applicant');
  private urlAdmin = environment.serverUrl.concat('api/admin');

  terms: any;
  controls: any;

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
  // api que genera el logo, colores parametrizados por el cliente
  getParametrosCliente(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getCustomerParametrics`).toPromise();
  }

  // api que genera una lista de productos
  getListaProductos(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getProductTypes`).toPromise();
  }

  // api que genera una lista de tipos de documentos
  getTiposDocumento(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getDocumentTypes`).toPromise();
  }

  // api que genera formulario dinamico
  getDynamicForm(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getFormCustomer`).toPromise();
  }

  postLogin(user_email, user_password): Promise<any> {
    return this.http.post(`${this.urlLogin}/login`, { user_email: user_email, user_password: user_password }).toPromise();
  }

  sendQuestions(data: any = {}): Observable<any> {
    return this.http.post(`${this.urlValidate}/validateQuestions`, data, this.httpOptions);
  }

  getResponses(data: any = ''): Observable<any> {
    return this.http.post(`${this.urlRequrements}/getResponses`, data, this.httpOptions);
  }

  getRequirements(data: any = {}) {
    return this.http.post(`${this.urlRequrements}/getRequirements`, data, this.httpOptions).toPromise();
  }

  updateRequeriments(data: FormData = null) {
    return this.http.post(`${this.urlRequrements}/updateRequeriments`, data).toPromise();
  }

  // api que genera una lista de actividades economicas
  getActividadEconomica(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getEconomicActivities`).toPromise();
  }

  // api que genera una lista de ciudades
  getCiudades(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getCities`).toPromise();
  }

  getFormDinamico(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getFormCustomer`).toPromise();
  }

  getDataTicket(ticket: string = '', identification = '') {
    return this.http.post(`${this.urlMaster}/getDataTicket`,
      { ticket: ticket, identification: identification }, this.httpOptions)
  }

  getFullDataTicket(data): Observable<any> {
    return this.http.post(`${this.urlMaster}/getDataTicket`, data);
  }

  getSolicitante(data: any = {}) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
    return this.http.post(`${this.urlMaster}/getApplicant`, data, httpOptions).toPromise();
  }

  saveApplicant(data: any = {}) {
    return this.http.post(`${this.urlApplicant}/save_applicant`, data, this.httpOptions);
  }

  getQuestionsValidate(data: any = {}): Observable<any> {
    return this.http.post(`${this.urlValidate}/getQuestionsForm`, data, this.httpOptions);
  }

  getCustomerParametrics(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getCustomerParametrics`).toPromise();
  }

  getProductInterestTerms(product): Promise<any> {
    return this.http.get(`${this.urlMaster}/getProductInterestTerms?id=${product}`).toPromise();
  }

  sendResponseSMS(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/sendResponseSMS`, data, this.httpOptions);
  }

  sendResponseEmail(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/sendResponseEmail`, data, this.httpOptions);
  }

  sendCodeTerms(data): Promise<any> {
    return this.http.post(`${this.urlApplicant}/send_code_sign_terms`, data, this.httpOptions).toPromise();
  }

  validateCodeTerms(data): Promise<any> {
    return this.http.post(`${this.urlApplicant}/validate_code_sign_terms`, data, this.httpOptions).toPromise();
  }

  sendCodePagare(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/sentOTPPAgare`, data, this.httpOptions);
  }

  validateCodePagare(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/validateOTPPagare`, data, this.httpOptions);
  }


  getStatesRequest(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getStatesRequest`).toPromise();
  }

  getApplicantSummary(id): Observable<any> {
    return this.http.get(`${this.urlMaster}/getApplicantSummary?id=${id}`);
  }

  getOffice(): Promise<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
    return this.http.get(`${this.urlMaster}/getOffice`, httpOptions).toPromise();
  }

  downloadPagare(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/downloadPagare`, data, this.httpOptions);
  }

  downloadEngineDecision(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/downloadEngineDecision`, data, this.httpOptions);
  }

  approveRequest(data) {
    return this.http.post(`${this.urlAdmin}/approveRequest`, data);
  }

  denyRequest(data) {
    return this.http.post(`${this.urlAdmin}/denyRequest`, data);
  }

  getProductsListCustomer(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getProductTypesCustomer`).toPromise();
  }

  getDocumentTypes(): Promise<any> {
    return this.http.get(`${this.urlMaster}/getDocumentTypes`).toPromise();
  }

  getProductsChildProduct(type): Promise<any> {
    return this.http.get(`${this.urlMaster}/getProductsChildProduct?type=${type}`).toPromise();
  }

  sendOTPCodeudor(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/sendOTPCodeudor`, data, this.httpOptions);
  }

  validateOTPCodeudor(data): Observable<any> {
    return this.http.post(`${this.urlRequrements}/validateOTPCodeudor`, data, this.httpOptions);
  }

  sendCodeValidatePanel(data): Promise<any> {
    return this.http.post(`${this.urlApplicant}/send_code_sign_terms`, data, this.httpOptions).toPromise();
  }

  validateCodeValidatePanel(data): Promise<any> {
    return this.http.post(`${this.urlApplicant}/validate_code_sign_terms`, data, this.httpOptions).toPromise();
  }

  getAllCountries(): Observable<any> {
    return this.http.get(this.urlMaster + '/getAllCountries', this.httpOptions);
  }

  getStatesByCountry(id: string): Observable<any> {
    const params = new HttpParams().set("id", id);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params
    }
    return this.http.get(this.urlMaster + '/getStatesByCountry', httpOptions);
  }

  getCitiesByState(id: string): Observable<any> {
    const params = new HttpParams().set("id", id);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params
    }
    return this.http.get(this.urlMaster + '/getCitiesByState', httpOptions);
  }



}
