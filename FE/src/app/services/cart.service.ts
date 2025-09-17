import { Injectable, OnInit } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  subTotalPrice = 0;
  storage: Storage = localStorage;
  ngOnInit(): void {
  }
  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data) {
      this.cartItems = data;
      this.computeCartTotals();
    }
  }
  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let currentItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      currentItem = this.cartItems.find(c => c.id === theCartItem.id);
    }
    alreadyExistsInCart = (currentItem != undefined);

    if (alreadyExistsInCart) {
      currentItem!.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.removeCartItem(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }
  removeCartItem(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(c => c.id = theCartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue, totalQuantityValue);
    this.persistCartItems();
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("contents of the cart: ");
    for (let tempCartItem of this.cartItems) {
      this.subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${this.subTotalPrice}`)
    }
    console.log(`totalPrice=${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log("-----")
  }

}
