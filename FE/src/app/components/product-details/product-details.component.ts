import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute} from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductListComponent } from '../product-list/product-list.component';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  product!:Product;
  constructor(private productService:ProductService,
              private cartService:CartService,private route:ActivatedRoute){
  }
  ngOnInit(){
    this.route.paramMap.subscribe(()=> {
      this.listProductDetails();
    });
  }

  listProductDetails(){
    const id:number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductDetails(id).subscribe(
        data => {
           this.product = data
        }
    )
  };
  addToCart(){
    this.cartService.addToCart(new CartItem(this.product));
  }
}
