import { Component } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { CommonModule } from '@angular/common';
import { Product } from '../../interface/product.interface';
import { CatalogService } from '../../service/catalog.service';
import { FooterComponent } from '../footer/footer.component';
import { PreviewComponent } from "../preview/preview.component";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { UserService } from '../../service/user.service';
import { UserView } from '../../interface/user-view.interface';
import { MessageDialogComponent } from "../message-dialog/message-dialog.component";

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers: [CatalogService],
  imports: [HeaderComponent, ProductComponent, CommonModule, FooterComponent, PreviewComponent, SearchBarComponent, MessageDialogComponent]
})
export class MainComponent {
  products: Product[] = [];
  categories: string[] = [];
  productPreView!: Product;
  username!: string;
  user!: UserView;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private productService: CatalogService,
    private preview: PreviewComponent
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
    });

    this.productService.getProducts(this.username).subscribe({

      next: (data: Product[]) => {
        this.products = data;
        this.getUser(this.products[0]);

        this.products.forEach(p => {
          let c = p.category.toUpperCase();

          if (!this.categories.includes(c)) {
            this.categories.push(c);
          }
        })
      },
      error: (err) => console.error(err)
    });
  }
  searchByName(searchTerm: string) {

    this.productService.getProductsByName(searchTerm, this.username).subscribe({
      next: (data: Product[]) => {
        console.log("Produtos recebidos por nome:", data);
        this.products = data;
      },
      error: (err) => console.error(err)
    });
  }
  searchByCategory(category: string) {

    this.productService.getProductsByCategory(category, this.username).subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err) => console.error(err)
    });
  }
  isVisible(): string {
    return this.preview.isVisible() ? 'opacity' : '';
  }
  shareLink() {
    this.sendMessage('',`Olá, dê uma olhada nesse link: ${window.location.href}`);
  }

  sendMessage(phone: string, message: string) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    var whatsappUrl =
      isMobile ?
        `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}` :
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  contactSeller(product: Product) {
    if (!this.user) {
      return;
    }
    console.log(`send message to ${this.user.phone} about product with id ${product.product_id}`);
    this.sendMessage(this.user.phone, `Olá, gostaria de mais informações sobre o produto: ${product.name}\n${product.image}`);
  }
  getUser(product: Product) {
    this.userService.getUserById(product.product_id).subscribe({
      next: (user: UserView) => { this.user = user },
      error: (err) => { console.error(err) }
    })
  }
}
