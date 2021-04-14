import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly WEB_URL: string = environment.serverUrl;

  constructor(private _http: HttpClient) { }

  getProductTax(idProduct): Promise<any> {
    return this._http.get(`${this.WEB_URL}/api/products/getProductTax?idProduct=${idProduct}`).toPromise();
  }
}
