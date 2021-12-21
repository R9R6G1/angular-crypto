import { Component, TRANSLATIONS } from '@angular/core';
import {
  concatMap,
  delay,
  finalize,
  map,
  retryWhen,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { iif, Observable, of, Subject, throwError } from 'rxjs';

import { CryptoApiService } from './crypto-api.service';
import { symbols } from '../assets/test_history';
import * as moment from 'moment';
import { CryptoWsService } from './crypto-ws.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private cryptoApiService;
  private cryptoWsService;
  assets: string[];
  public socketData: any = {
    time_exchange: new Date(),
    time_coinapi: new Date(),
    uuid: '384675d1-8674-4d09-ac6b-5db17a4b2044',
    price: 0.0,
    size: 0.0,
    taker_side: 'SELL',
    symbol_id: 'BITSTAMP_SPOT_BTC_USD',
    sequence: 65061,
    type: 'trade',
  };
  constructor(
    cryptoApiService: CryptoApiService,
    cryptoWsService: CryptoWsService
  ) {
    this.cryptoApiService = cryptoApiService;
    this.cryptoWsService = cryptoWsService;
    this.assets = symbols
      .filter((sym) => /BITSTAMP.*/.test(sym))
      .map((sym) => {
        const splited = sym.split('_');
        return `${splited[splited.length - 2]}/${splited[splited.length - 1]}`;
      });
  }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels: any = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData: any = [];

  updateChartData(coin: string, currency: string, date: Date) {
    this.cryptoApiService
      .getHistory(coin, currency, date)
      .subscribe((his: any) => {
        if (his) {
          this.barChartData = [
            {
              data: his.map((e: any) => e.bid_price),
              label: his[0].symbol_id,
            },
          ];
          this.barChartLabels = his.map((e: any) =>
            moment(e.time_coinapi).format('MM-DD')
          );
        }
      });
  }
  private connectToWebsocketServer(): void {
    this.cryptoWsService
      .connect()
      .pipe(retryWhen((errors: Observable<any>) => errors.pipe()))
      .subscribe((response: any) => {
        console.log('response ==> ', response);
        this.socketData = response;
      });
  }
  sendMessage(coin: string, currency: string) {
    const obj = {
      type: 'hello',
      apikey: environment.api_key,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_symbol_id: [
        `BITSTAMP_SPOT_${coin.toUpperCase() || 'BTC'}_${
          currency.toUpperCase() || 'USD'
        }$`,
      ],
    };
    this.cryptoWsService.send(obj);
  }

  onSubmit({
    target: {
      coin: { value: coinValue },
      date: { value: dateValue },
    },
  }: any) {
    const splited = coinValue.split('/');
    this.updateChartData(splited[0], splited[1], new Date(dateValue));
    this.sendMessage(splited[0], splited[1]);
  }
  ngOnInit() {
    this.updateChartData(
      'BTC',
      'USD',
      moment(new Date()).subtract(1, 'days').toDate()
    );
    this.connectToWebsocketServer();
    this.sendMessage('BTC', 'USD');
  }
}
// BITFINEX_SPOT_BTC_LTC$
