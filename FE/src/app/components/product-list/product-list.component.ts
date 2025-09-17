import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  products:Product[] = [];
  currentCategoryId:number = 1;
  previousCategoryId:number = 1;
  searchMode:boolean = false;

  pageNumber:number = 1;
  pageSize:number = 15;
  totalElements:number = 0;
  previousKeyword:string="";

  constructor(private productService:ProductService,
              private cartService:CartService,
              private route:ActivatedRoute
  ){};

  ngOnInit(){
    this.route.paramMap.subscribe(()=> {
      this.listProducts();
    });
  }
  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProduct();
    }
    else{
      this.handleListProducts();
    }
  }
  handleSearchProduct(){
    const keyWord:string = this.route.snapshot.paramMap.get('keyword')!;
    
    if(keyWord !=this.previousKeyword){
      this.pageNumber = 1;
    }

    this.previousKeyword = keyWord;
    
    this.productService.getProductSearchPaginate(this.pageNumber-1,this.pageSize,keyWord).subscribe(
      data =>
      { 
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    );
  }



  handleListProducts(){
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      this.currentCategoryId = 1;
    }

    if(this.previousCategoryId !=this.currentCategoryId){
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber-1,this.pageSize,this.currentCategoryId).subscribe(
      data => 
      {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number+1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    );
  }
  updatePageSize(pageSize:string){
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    this.cartService.addToCart(new CartItem(product)); 
  }
}
