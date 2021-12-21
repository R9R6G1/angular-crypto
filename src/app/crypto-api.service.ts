import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CryptoApiService {
  private baseUrl = 'https://rest.coinapi.io/';
  constructor(private http: HttpClient) {}
  getLatestCryptoCurrencies(): Observable<any[]> {
    let reqUrl = this.baseUrl + 'v1/exchanges';
    return this.http
      .get<any[]>(reqUrl)
      .pipe(
        catchError(
          this.handleError(
            'Get exchanges from getLatestCryptoCurrencies function ',
            []
          )
        )
      );
  }
  getLatestCryptoAssets(): Observable<any[]> {
    let reqUrl = this.baseUrl + 'v1/assets';
    return this.http
      .get<any[]>(reqUrl)
      .pipe(catchError(this.handleError('', [])));
  }
  getSymbols() {
    return this.http.get<any[]>(`${this.baseUrl}v1/symbols/BITSTAMP`);
  }
  getPeriodList(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}v1/exchangerate/history/periods`
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  public getHistory(
    coin: string,
    currency: string,
    startDate: Date
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}v1/quotes/${`BITSTAMP_SPOT_${
        coin.toUpperCase() || 'BTC'
      }_${currency || 'USD'}`}/history?time_start=${
        startDate.toISOString() || new Date().toISOString()
      }&limit=${50}`
    );
  }
}
