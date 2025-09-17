import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService implements OnInit{
  private checkoutUrl = `http://localhost:8080/api/checkout/purchase`;
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
  }

  addPurchase(purchase:Purchase): Observable<any>{
    return this.http.post<Purchase>(this.checkoutUrl,purchase);
  }

}
