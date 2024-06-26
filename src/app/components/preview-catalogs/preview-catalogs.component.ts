import { AfterViewInit, Component } from '@angular/core';
import { CatalogService } from '../../service/catalog.service';
import { PreviewCatalog } from '../../interface/preview-catalog';
import { CommonModule } from '@angular/common';
import { Init } from 'node:v8';

@Component({
  selector: 'app-preview-catalogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-catalogs.component.html',
  styleUrl: './preview-catalogs.component.css'
})
export class PreviewCatalogsComponent {
  catalogs!:PreviewCatalog[]
  localhost:string = '' 
    constructor(private catalogService:CatalogService){}

    ngOnInit(): void {
      try {
        this.localhost = window.location.href;
      } catch (error) {
        
      }  
      this.getAllCatalogs();
    }

    getAllCatalogs(){
      this.catalogService.getAllCatalogs().subscribe({
        next:(res)=>{
          this.catalogs = res
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
    ngAfterViewInit(): void {
   
    }

    getHost():string{
      return this.localhost;
    }
    redirect(link:string){
      window.open(this.getHost()+link);
    }
}
