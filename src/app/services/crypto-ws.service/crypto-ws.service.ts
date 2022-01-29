import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
interface SendData {
  type: any;
  apikey: any;
  heartbeat: any;
  subscribe_data_type: any;
  subscribe_filter_symbol_id: any;
}
@Injectable({
  providedIn: 'root',
})
export class CryptoWsService implements OnDestroy {
  connection$: WebSocketSubject<any> | null | undefined;

  public connect(): Observable<any> {
    if (this.connection$) {
      return this.connection$;
    } else {
      this.connection$ = webSocket(environment.ws);

      return this.connection$;
    }
  }

  public send(data: SendData): void {
    if (this.connection$) {
      this.connection$.next(data);
    } else {
      console.error('Error!');
    }
  }

  private closeConnection(): void {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }

  ngOnDestroy(): void {
    this.closeConnection();
  }
}
