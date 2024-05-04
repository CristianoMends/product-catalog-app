import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interface/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl ='http://localhost:3000/catalog/'; //'https://product-catalog-api-woad.vercel.app/catalog/cristiano_mendes';
  constructor(private http: HttpClient) { }

  getProducts(username:string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}${username}`);
  }
  getProductsByName(searchTerm:string, username:string): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}${username}?name=${searchTerm}`);
  }
  getProductsByCategory(category:string, username:string): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}${username}?category=${category}`);
  }
}
