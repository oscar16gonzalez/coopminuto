import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
// import { Parametrics } from 'src/entities/parametrics';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    urlValidate = `${environment.serverUrl}/api/validate`;
    urlEngine = environment.serverUrl.concat('/api/engine');
    urlMaster = environment.serverUrl.concat('/api/master');
    urlUser = environment.serverUrl.concat('/api/user');
    urlAdmin = environment.serverUrl.concat('/api/admin');

    constructor(private http: HttpClient) { }

    getQuestions(): Promise<any> {
        return this.http.get(`${this.urlValidate}/getQuestions`).toPromise();
    }

    getResponsesByQuestion(id = ''): Promise<any> {
        return this.http.get(`${this.urlValidate}/getResponsesByQuestion?question=${id}`).toPromise();
    }

    saveResponse(data: any = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlValidate}/saveResponse`, data, httpOptions).toPromise();
    }

    getProductsList(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getProductTypes`).toPromise();
    }

    getDataEngine(id = ''): Promise<any> {
        return this.http.get(`${this.urlEngine}/getDataEngine?product=${id}`).toPromise();
    }

    getTypesDecision(): Promise<any> {
        return this.http.get(`${this.urlEngine}/getViabilities`).toPromise();
    }

    getOrigins(): Promise<any> {
        return this.http.get(`${this.urlEngine}/getOrigin`).toPromise();
    }

    getEngineModules(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getModules?product=${product}&origin=${origin}`).toPromise();
    }

    getSubmoduleHabitosPago(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getHabitosPagoJSON?product=${product}&origin=${origin}`).toPromise();
    }

    getSubmoduleCalificaciones(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getCalificacionesJSON?product=${product}&origin=${origin}`).toPromise();
    }

    getDataModuleScore(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getDataModuleScore?product=${product}&origin=${origin}`).toPromise();
    }

    getDynamicForm(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getFormCustomer`).toPromise();
    }

    getHuellasConsulta(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getHuellasConsulta?product=${product}&origin=${origin}`).toPromise();
    }

    updateHC(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateHC`, data, httpOptions).toPromise();
    }

    getPuntosCorte(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getPuntosCorte?product=${product}&origin=${origin}`).toPromise();
    }

    updatePC(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updatePC`, data, httpOptions).toPromise();
    }

    updateFormClient(elements = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/updateFormClient`, elements, httpOptions).toPromise();
    }

    updatePercentageElement(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updatePercentageElement`, data, httpOptions).toPromise();
    }

    updateScoreElement(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateScoreElement`, data, httpOptions).toPromise();
    }

    updateParametrizationScore(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateParametrizationScore`, data, httpOptions).toPromise();
    }

    getSubmoduleCuentas(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getSubmoduleCuentas?product=${product}&origin=${origin}`).toPromise();
    }

    getDataModuleListasRestictivas(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getSubmoduleListasRestrictivas?product=${product}&origin=${origin}`).toPromise();
    }

    updateParametrizationHp(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateParametrizationHp`, data, httpOptions).toPromise();
    }

    updateParametrizationCl(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateParametrizationCl`, data, httpOptions).toPromise();
    }

    updateParametrizationCac(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateParametrizationCac`, data, httpOptions).toPromise();
    }

    updateParametrizationList(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateParametrizationList`, data, httpOptions).toPromise();
    }

    getDataModuleCapacity(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getDataModuleCapacity?product=${product}&origin=${origin}`).toPromise();
    }

    getExperienciaCrediticiaParametrics(data): Promise<any> {
        return this.http.post(`${this.urlEngine}/getExperienciaCrediticiaParametrics`, data).toPromise();
    }

    getTypesQuestions(): Promise<any> {
        return this.http.get(`${this.urlValidate}/getTypesQuestions`).toPromise();
    }

    getValuesTypeQuestions() {
        return this.http.get(`${this.urlValidate}/getValuesTypeQuestions`).toPromise();
    }

    typeQuestionsEnabled(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlValidate}/typeQuestionsEnabled`, data, httpOptions).toPromise();
    }

    allTypeQuestionsEnabled(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlValidate}/allTypeQuestionsEnabled`, data, httpOptions).toPromise();
    }

    getConfigurationGeneral(): Promise<any> {
        return this.http.get(`${this.urlValidate}/getConfigurationGeneral`).toPromise();
    }

    updateConfigGeneralValidate(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlValidate}/updateConfigGeneralValidate`, data, httpOptions).toPromise();
    }

    getAllQuestions(): Promise<any> {
        return this.http.get(`${this.urlValidate}/getAllQuestions`).toPromise();
    }

    updateParametrizationCapacity(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateParametrizationCapacity`, data, httpOptions).toPromise();
    }

    getAllTypeQuestions(): Promise<any> {
        return this.http.get(`${this.urlValidate}/getAllTypeQuestions`).toPromise();
    }

    getAllProductsTerms() {
        return this.urlMaster.concat('/getAllProductsTerms');
    }

    insertInterestTerm(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/insertInterestTerm`, data, httpOptions).toPromise();
    }

    deleteInterestTerm(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/deleteInterestTerm`, data, httpOptions).toPromise();
    }

    saveNewProduct(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/saveNewProduct`, data, httpOptions).toPromise();
    }

    getFinalScore(product = '0', origin = 'web'): Promise<any> {
        return this.http.get(`${this.urlEngine}/getFinalScore?product=${product}&origin=${origin}`).toPromise();
    }

    saveFinalScore(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/saveFinalScore`, data, httpOptions).toPromise();
    }

    updateModuleConfiguration(data: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/updateModuleConfiguration`, data, httpOptions);
    }

    saveQuestion(data: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlValidate}/saveQuestion`, data, httpOptions);
    }

    deleteQuestion(data: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlValidate}/deleteQuestion`, data, httpOptions);
    }

    // getRequestSummary() {
    //     return this.urlMaster.concat('/getRequestSummary');
    // }

    getRequestSummary(page: number = 1, name?: string, direction?: string, username?: string, origen?: string, viability?: string, state?: string, newFrom?: string, newTo?: string, filter?: string, office?: string): Observable<any> {
        const httpOptions =
        {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
            params: new HttpParams()
            .set('page', page.toString())
            .set('name', name? name: '')
            .set('direction', direction? direction: '')
            .set('username', username? username: '')
            .set('origen', origen? origen: '')
            .set('viability', viability? viability: '')
            .set('state', state? state: '')
            .set('newFrom', newFrom? newFrom: '')
            .set('newTo', newTo? newTo: '')
            .set('filter', filter? filter: '')
            .set('office', office? office: '')
        };
        return this.http.get(`${this.urlMaster}/getRequestSummary`, httpOptions);
    }

    getCreditsToExport(name?: string, direction?: string, username?: string, origen?: string, viability?: string, state?: string, newFrom?: string, newTo?: string, filter?: string): Observable<any> {
        const httpOptions =
        {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
            params: new HttpParams()
            .set('name', name? name: '')
            .set('direction', direction? direction: '')
            .set('username', username? username: '')
            .set('origen', origen? origen: '')
            .set('viability', viability? viability: '')
            .set('state', state? state: '')
            .set('newFrom', newFrom? newFrom: '')
            .set('newTo', newTo? newTo: '')
            .set('filter', filter? filter: '')
        };
        return this.http.get(`${this.urlMaster}/getCreditsToExport`, httpOptions);
    }



    getStatesRequest(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getStatesRequest`).toPromise();
    }

    // getApplicantSummary(id): Promise<any> {
    //     return this.http.get(`${this.urlMaster}/getApplicantSummary?id=${id}`).toPromise();
    // }

    getAllRequeriments() {
        return this.urlMaster.concat('/getAllRequeriments');
    }

    updateRequeriment(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/updateRequeriment`, data, httpOptions).toPromise();
    }

    updateElementsRequeriment(elements = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/updateElementsRequeriment`, elements, httpOptions).toPromise();
    }

    getAllRequerimentsName(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getAllRequerimentsName`).toPromise();
    }

    getRequerimentsProductViability(product, viability): Promise<any> {
        return this.http.get(`${this.urlMaster}/getRequerimentsProductViability?product=${product}&viability=${viability}`).toPromise();
    }

    updateRequerimentsProductViability(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/updateRequerimentsProductViability`, data, httpOptions).toPromise();
    }

    getCities(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getCities`).toPromise();
    }

    getAllOffices() {
        return this.urlMaster.concat('/getAllOffices');
    }

    saveNewOffice(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/saveNewOffice`, data, httpOptions).toPromise();
    }

    getAllCoordinators(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getAllCoordinators`).toPromise();
    }

    getAdvisorsByOffice(office) {
        return this.http.get(`${this.urlMaster}/getAdvisorsByOffice?id=${office}`).toPromise();
    }

    deleteFileForAdvisor(data: any): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlAdmin}/deleteFileForAdvisor`, data, httpOptions).toPromise();
    }

    deleteOffice(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/deleteOffice`, data, httpOptions).toPromise();
    }

    updateInterestActive(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/updateInterestActive`, data, httpOptions).toPromise();
    }

    updateViability(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/updateViability`, data, httpOptions).toPromise();
    }

    getViabilitiesAll(): Promise<any> {
        return this.http.get(`${this.urlEngine}/getViabilitiesAll`).toPromise();
    }

    updateTypeDecisionEngine(data: any): Observable<any> {
        return this.http.post(`${this.urlEngine}/updateTypeDecisionEngine`, data);
    }

    getAllCustomerParametric(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getAllCustomerParametric`).toPromise();
    }

    updateCustomerParametricFile(data: FormData = null, id): Observable<any> {
        return this.http.post(`${this.urlMaster}/updateCustomerParametricFile`, data, id);
    }

    saveAdvisorFilesForRequest(data: FormData = null): Promise<any> {
        return this.http.post(`${this.urlAdmin}/saveAdvisorFilesForRequest`, data).toPromise();
    }

    uploadCustomerField(data: any): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/uploadCustomerField`, data, httpOptions).toPromise();
    }

    getUsers() {
        return this.urlUser.concat('/getUsers');
    }

    getAllUsers(currentRole, currentUser): Promise<any> {
        return this.http.get(`${this.urlUser}/getUsers?auto=${currentRole}&generate=${currentUser}`).toPromise();
    }

    getListRoles() {
        return this.http.get(`${this.urlUser}/getListroles`).toPromise();
    }

    getAllFilesforAdvisorWeb(ticket): Observable<any> {
        const httpOptions =
        {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
            params: new HttpParams()
            .set('ticket', ticket? ticket: '')
        };
        return this.http.get(`${this.urlAdmin}/getAllFilesforAdvisor`, httpOptions)
    }

    saveEditUserSelected(data: any): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlUser}/saveEditUserSelected`, data, httpOptions).toPromise();
    }

    approveRequest(data) {
        return this.http.post(`${this.urlAdmin}/approveRequest`, data);
    }

    denyRequest(data) {
        return this.http.post(`${this.urlAdmin}/denyRequest`, data);
    }

    reopenRequest(data) {
        return this.http.post(`${this.urlAdmin}/reopenRequest`, data);
    }

    cancelRequest(data) {
        return this.http.post(`${this.urlAdmin}/cancelRequest`, data);
    }

    billingApproved(data) {
        return this.http.post(`${this.urlAdmin}/billingApproved`, data);
    }

    sendRequestToStudy(data) {
        return this.http.post(`${this.urlAdmin}/sendRequestToStudy`, data);
    }

    getAllActionsByRequest(ticket) {
        return this.http.get(`${this.urlAdmin}/getAllActionsByRequest?ticket=${ticket}`).toPromise();
    }

    saveAnalystActions(data: Object): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlAdmin}/saveAnalystActions`, data, httpOptions).toPromise();
    }

    decisionDelivery(data: Object): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlAdmin}/decisionDelivery`, data, httpOptions).toPromise();
    }

    getListOffices(): Promise<any> {
        return this.http.get(`${this.urlMaster}/getListOffices`).toPromise();
    }

    getCurrentCountRequest() {
        return this.http.get(`${this.urlMaster}/getCurrentCountRequest`).toPromise();
    }

    getCountRequestFilteres(data: any): Observable<any> {
        return this.http.post(`${this.urlMaster}/getCountRequestFilteres`, data);
    }

    getAllOficesActives(idRole): Promise<any> {  // LISTAR ASESORES
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/getAllOficesActives`, idRole, httpOptions).toPromise();
    }

    deleteAdvisorOffice(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/deleteAdvisorOffice`, data, httpOptions).toPromise();
    }

    getAdvisorsxOffice(office) {
        return this.http.get(`${this.urlMaster}/getAdvisorsxOffice?id=${office}`).toPromise();
    }

    getAllAdvisors(office) {
        return this.http.get(`${this.urlMaster}/getAllAdvisors?id=${office}`).toPromise();
    }

    saveAdvisorOffice(data = {}): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/saveAdvisorOffice`, data, httpOptions).toPromise();
    }

    getDataUser(email): Promise<any> {
        return this.http.get(`${this.urlMaster}/getDataUser?email=${email}`).toPromise();
    }

    getAllProducts() {
        return this.urlMaster.concat('/getAllProducts');
    }

    saveNewProductChild(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/saveNewProductChild`, data, httpOptions).toPromise();
    }

    deleteProductChild(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/deleteProductChild`, data, httpOptions).toPromise();
    }

    deleteUserSelected(data = {}) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/deleteUserSelected`, data, httpOptions).toPromise();
    }

    saveUsuLogin(data = {}): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlMaster}/saveUsuLogin`, data, httpOptions).toPromise();
    }

    sendRequerimentsToUser(data = {}): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlAdmin}/sendRequerimentsToUser`, data, httpOptions).toPromise();
    }

    saveSalarioLegal(data): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.post(`${this.urlEngine}/saveSalarioLegal`, data, httpOptions).toPromise();
    }

    getParametricPorcentageEndeudamiento(origin = 'web', product = '1') {
        return this.http.get(`${this.urlEngine}/getParametricPorcentageEndeudamiento?origin=${origin}&product=${product}`).toPromise();
    }

    getOffice(): Promise<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
        return this.http.get(`${this.urlMaster}/getOffice`, httpOptions).toPromise();
    }


    getAllFilesDetailCredit(ticket): Observable<any> {
        const httpOptions =
        {
            headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
            params: new HttpParams()
            .set('ticket', ticket.toString())
        };
        return this.http.get(`${this.urlAdmin}/getAllFilesforAdvisor`,httpOptions)
    }

    getElementsDataBasic(): Promise<any> {
        return this.http.get(`${this.urlEngine}/getElementsDataBasic`).toPromise();
    }

}
