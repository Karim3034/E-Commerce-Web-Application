import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{
  cartItems:CartItem[]=[];
  totalPrice:number=0.00;
  totalQuantity:number=0;

  constructor(private cartService:CartService){
  }
  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(price=>
      this.totalPrice = price
    )
    this.cartService.totalQuantity.subscribe(quantity=>
      this.totalQuantity = quantity
    )
  }
  incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem)
  }
  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }
  remove(theCartItem:CartItem){
    this.cartService.removeCartItem(theCartItem);
  }
}

