import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IpService } from '../ip/ip.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentSignService {

  readonly WEB_URL: string = environment.serverUrl;

  constructor(
    private _http: HttpClient,
    private ipService: IpService
  ) { }

  listDocumentSign(ticket) {
    return this._http.post(this.WEB_URL.concat('/api/documentSign/listDocumentSign'), { ticket }).toPromise();
  }

  createApplicant(data): Promise<any> {
    return this._http.post(this.WEB_URL.concat('/api/documentSign/createApplicant'), data).toPromise();
  }

  postPreviewDocumentByRequest(data) {
    return this._http.post(this.WEB_URL.concat('/api/documentSign/postPreviewDocumentByRequest'), data).toPromise();
  }

  postGenerateCodeDocumentByRequest(data) {
    return this._http.post(this.WEB_URL.concat('/api/documentSign/postGenerateCodeDocumentByRequest'), data).toPromise();
  }

  async postValidateOtpCode(validate) {
    const ip = await this.ipService.getIp().toPromise();
    return this._http.post(this.WEB_URL.concat('/api/documentSign/postValidateOtpCode'), {...validate, ip} ).toPromise();
  }

  postGetSignedDocument(data) {
    return this._http.post(this.WEB_URL.concat('/api/documentSign/postGetSignedDocument'), data, { responseType: 'blob' as 'json' }).toPromise();
  }

  getListDocumentsRequest(ticket) {
    return this._http.post(this.WEB_URL.concat('/api/documentSign/getListDocumentsRequest'), { ticket }).toPromise();
  }

}
