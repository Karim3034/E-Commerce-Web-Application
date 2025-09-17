import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/productCategories';
  constructor(private httpClient:HttpClient){} 


  getProductListPaginate(pageNumber:number,pageSize:number,categoryId:number):Observable<GetResponseProduct>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` + 
    `&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductSearchPaginate(pageNumber:number,pageSize:number,keyWord:string):Observable<GetResponseProduct>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}` + 
    `&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(categoryId:number):Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.search(searchUrl);
  }

  getProductCategories():Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategories)
    )
  }

  searchProducts(keyWord: string) {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`;
    return this.search(searchUrl)
  }

  private search(searchUrl: string) {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductDetails(id:number): Observable<Product>{
    const productUrl = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Product>(productUrl);
  }
}
interface GetResponseProduct{
  _embedded:{
    products:Product[];
  }
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategories:ProductCategory[];
  }
}