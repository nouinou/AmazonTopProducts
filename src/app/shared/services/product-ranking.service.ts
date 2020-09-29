import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {ProductRank} from '../interfaces/product.interface';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProductCategory} from '../enums/product-category.enum';

@Injectable({
    providedIn: 'root'
})
export class ProductRankingService {
    categorySubject = new Subject<string>();

    selectedProductCategory: { name: string; path: string; } = {
        name: ProductCategory.furniture,
        path: '../../assets/json-files/furniture.json'
    };

    constructor(private http: HttpClient) {
    }

    getProductRankingData(): Observable<ProductRank[]> {
        return this.http.get(this.selectedProductCategory.path).pipe(
            map((products: any[]) => {
                products.splice(0, 2);
                return products.map(x => {
                    const values = Object.values(x);
                    return {
                        date: values[0],
                        rank: values[1],
                        link: values[2],
                        asin: values[3],
                        name: values[4],
                        rating: values[5],
                        reviews: values[6],
                        price: values[7],
                        prime: values[8],
                    } as ProductRank;
                });
            })
        );
    }

    setProductCategory(categoryName: string): void {
        switch (categoryName) {
            case ProductCategory.furniture:
                this.selectedProductCategory = {
                    name: ProductCategory.furniture,
                    path: '../../assets/json-files/furniture.json'
                };
                break;
            case ProductCategory.BedroomFurniture:
                this.selectedProductCategory = {
                    name: ProductCategory.BedroomFurniture,
                    path: '../../assets/json-files/BedroomFurniture.json'
                };
                break;
            case ProductCategory.MattressesAndBoxSprings:
                this.selectedProductCategory = {
                    name: ProductCategory.MattressesAndBoxSprings,
                    path: '../../assets/json-files/MattressesAndBoxSprings.json'
                };
                break;
        }
        this.categorySubject.next(categoryName);
    }

    getProductCategory(): string {
        return this.selectedProductCategory.name;
    }

}
