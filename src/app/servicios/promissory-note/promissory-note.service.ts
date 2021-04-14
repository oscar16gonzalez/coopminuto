import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IpService } from '../ip/ip.service';

@Injectable({
  providedIn: 'root'
})
export class PromissoryNoteService {

  readonly WEB_URL: string = environment.serverUrl;

  constructor(
    private _http: HttpClient,
  ) { }

  generateOtp(ticket) {
    return this._http.post(`${this.WEB_URL}/api/promissoryNote/generateOtp`, { ticket });
  }

   validateOtp(ticket, ip, codes): Promise<any> {
    return this._http.post(`${this.WEB_URL}/api/promissoryNote/validateOtp`, { ticket, ip, codes }).toPromise();
  }

  preview(ticket) {
    return this._http.post(`${this.WEB_URL}/api/promissoryNote/preview`, { ticket });
  }

  areAlreadySigned(ticket) {
    return this._http.post(`${this.WEB_URL}/api/promissoryNote/areAlreadySigned`, { ticket });
  }
  
  needSignPromissoryNote(ticket) {
    return this._http.post(`${this.WEB_URL}/api/promissoryNote/needSignPromissoryNote`, { ticket });
  }
}
