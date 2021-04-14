import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApplicantService {
    
    currentRequestSubject: BehaviorSubject<any>;
    currentRequest: Observable<string>;
    httpOptions: any;

    urlMaster = environment.serverUrl.concat('/api/master');
    urlApplicant = environment.serverUrl.concat('/api/applicant');
    urlValidate = environment.serverUrl.concat('/api/validate');
    urlRequeriment = environment.serverUrl.concat('/api/requeriment');
    urlApplicantInformation = environment.serverUrl.concat('/api/applicant');
    urlEconomicActivities = environment.serverUrl.concat('/api/economicActivities');
    urlEducativeCredit = environment.serverUrl.concat('/api/educativeCredit');
    urlProducts = environment.serverUrl.concat('/api/products');
    urlCygnus = environment.serverUrl.concat('/api/cygnus');

    readonly WEB_URL: string = environment.serverUrl;

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

    getCustomerParametrics(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getCustomerParametrics`).toPromise();
    }

    getProductsList(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getProductTypes`).toPromise();
    }

    getProductsTypeListCustomer(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getProductTypesCustomer`).toPromise();
    }

    getDocumentTypes(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getDocumentTypes`).toPromise();
    }

    getCities(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getCities`).toPromise();
    }

    getDynamicForm(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getFormCustomer`).toPromise();
    }

    getEconomicActivities(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getEconomicActivities`).toPromise();
    }

    getDataTicket(ticket: string = '', identification = '') {
        return this.http.post(`${this.urlMaster}/getDataTicket`,
            { ticket: ticket, identification: identification }, this.httpOptions);
    }

    saveApplicant(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicant}/save_applicant`, data, this.httpOptions).toPromise();
    }

    saveApplicantLaborInformation(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicantInformation}/saveLaborData`, data, this.httpOptions).toPromise();
    }

    saveApplicantLocation(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicantInformation}/savePersonalInformation`, data, this.httpOptions).toPromise();
    }

    saveApplicantFinancialData(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicantInformation}/saveFinancialData`, data, this.httpOptions).toPromise();
    }

    saveRequestApplicant(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicantInformation}/saveRequestApplicant`, data, this.httpOptions).toPromise();
    }

    getQuestionsValidate(data: any = {}): Observable<any> {
        return this.http.post(`${this.urlValidate}/getQuestionsForm`, data, this.httpOptions);
    }

    sendQuestions(data: any = {}): Observable<any> {
        return this.http.post(`${this.urlValidate}/validateQuestions`, data, this.httpOptions);
    }

    getResponses(data: any = ''): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/getResponses`, data, this.httpOptions);
    }

    getRequirements(data: any = {}) {
        return this.http.post(`${this.urlRequeriment}/getRequirements`, data, this.httpOptions).toPromise();
    }

    updateRequeriments(data: FormData = null) {
        return this.http.post(`${this.urlRequeriment}/updateRequeriments`, data).toPromise();
    }

    public get currentRequestValue(): string {
        return this.currentRequestSubject.value;
    }

    getProductInterestTerms(product): Promise<any> {
        return this.http.get(`${this.urlMaster}/getProductInterestTerms?id=${product}`).toPromise();
    }

    downloadEngineDecision(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/downloadEngineDecision`, data, this.httpOptions);
    }

    downloadProviderInformation(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/downloadProviderInformation`, data, this.httpOptions);
    }

    downloadDocument(ticket, documentName): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/urlDownloadDocument`, { ticket, documentName });
    }

    sendResponseSMS(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/sendResponseSMS`, data, this.httpOptions);
    }

    sendResponseEmail(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/sendResponseEmail`, data, this.httpOptions);
    }

    sendCodePagare(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/sentOTPPAgare`, data, this.httpOptions);
    }

    validateCodePagare(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/validateOTPPagare`, data, this.httpOptions);
    }

    sendOTPCodeudor(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/sendOTPCodeudor`, data, this.httpOptions);
    }

    validateOTPCodeudor(data): Observable<any> {
        return this.http.post(`${this.urlRequeriment}/validateOTPCodeudor`, data, this.httpOptions);
    }

    getNotificationsUrl() {
        return `${this.urlApplicant}/getNotifications`;
    }

    getNotifications(data = {}): Observable<any> {
        return this.http.post(`${this.urlApplicant}/getNotifications`, data, this.httpOptions);
    }

    deleteNotification(data = {}): Observable<any> {
        return this.http.post(`${this.urlApplicant}/deleteNotification`, data, this.httpOptions);
    }

    getProductsChildProduct(type): Promise<any> {
        return this.http.get(`${this.urlMaster}/getProductsChildProduct?type=${type}`).toPromise();
    }

    sendCodeValidatePanel(data): Promise<any> {
        return this.http.post(`${this.urlApplicant}/send_code_sign_terms`, data, this.httpOptions).toPromise();
    }

    validateCodeValidatePanel(data): Promise<any> {
        return this.http.post(`${this.urlApplicant}/validate_code_sign_terms`, data, this.httpOptions).toPromise();
    }

    assosiateTicketToCot(data): Observable<any> {
        return this.http.post(`${this.urlApplicant}/associate_ticket_cotization`, data, this.httpOptions);
    }

    getCotization(data): Observable<any> {
        return this.http.post(`${this.urlApplicant}/get_data_cotization`, data, this.httpOptions);
    }

    getAllCountries(): Observable<any> {
        return this.http.get(this.urlMaster + '/getAllCountries', this.httpOptions);
    }

    getAllDepartments(): Observable<any> {
        return this.http.get(this.urlMaster + '/getAllDepartments', this.httpOptions);
    }

    getStatesByCountry(id: string): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params
        };
        return this.http.get(this.urlMaster + '/getStatesByCountry', httpOptions);
    }

    getCitiesByState(id: string): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params
        };
        return this.http.get(this.urlMaster + '/getCitiesByState', httpOptions);
    }

    getAllActivitiesSections(): Observable<any> {
        return this.http.get(this.urlEconomicActivities + '/getAllEconomicActivitiesSection', this.httpOptions);
    }

    getEconomicActivityBySection(id: string): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlEconomicActivities + '/getEconomicActivityBySection', httpOptions);
    }

    getAllEconomicActivities(): Observable<any> {
        return this.http.get(this.urlEconomicActivities + '/getAllEconomicActivies', this.httpOptions);
    }

    /** Peticiones referentes a las referencias de un aplicante */
    savePersonalReference(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicantInformation}/savePersonalReference`, data, this.httpOptions).toPromise();
    }

    saveFamilyReference(data: any = {}): Promise<any> {
        return this.http.post(`${this.urlApplicantInformation}/saveFamilyReference`, data, this.httpOptions).toPromise();
    }

    getApplicantReferences(id): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlApplicantInformation + '/getApplicantReferences', httpOptions);
    }

    getAllUniversities(): Observable<any> {
        return this.http.get(this.urlEducativeCredit + '/getAllUniversities', this.httpOptions);
    }

    getCampusByUniversity(id): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlEducativeCredit + '/getCampusByUniversity', httpOptions);
    }

    getAllProductCategories(): Observable<any> {
        return this.http.get(this.urlProducts + '/getAllProductCategories', this.httpOptions);
    }

    getProductTypeByCategory(id): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlProducts + '/getProductTypeByCategory', httpOptions);
    }

    getProductsByProductType(id): Observable<any> {
        const params = new HttpParams().set('id', id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlProducts + '/getProductsByProductType', httpOptions);
    }

    getCredits(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlProducts + '/cygnusCredits', httpOptions);
    }

    getCygnusPersonalInformation(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlCygnus + '/cygnusPersonalInformation', httpOptions);
    }

    getCygnusFinancialInformation(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlCygnus + '/cygnusFinancialInformation', httpOptions);
    }

    getCygnusCredits(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlCygnus + '/cygnusCredits', httpOptions);
    }

    getCygnusLastCredit(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlCygnus + '/cygnusLastCredit', httpOptions);
    }

    getAllActiveCredits(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlCygnus + '/cygnusActiveCredits', httpOptions);
    }

    getLastCodebtor(numeroIdentificacion) {
        const params = new HttpParams().set('numeroIdentificacion', numeroIdentificacion);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'applicant/json',
            }),
            params
        };
        return this.http.get(this.urlCygnus + '/cygnusLastCodebdtor', httpOptions);
    }

    getProductTerms(product): Observable<any> {
        return this.http.get(`${this.urlMaster}/getProductTerms?id=${product}`);
    }
}
