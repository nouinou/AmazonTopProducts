import {Component, OnInit} from '@angular/core';
import {ProductRankingService} from '../../services/product-ranking.service';
import {ProductCategory} from '../../enums/product-category.enum';

@Component({
    selector: 'app-category-menu',
    templateUrl: './category-menu.component.html',
    styleUrls: ['./category-menu.component.scss']
})
export class CategoryMenuComponent implements OnInit {
    selectedProductCategory;
    categories: string[] = [
        ProductCategory.furniture,
        ProductCategory.BedroomFurniture,
        ProductCategory.MattressesAndBoxSprings
    ];

    constructor(private productRankingService: ProductRankingService) {
    }

    ngOnInit(): void {
        this.selectedProductCategory = this.productRankingService.getProductCategory();
    }

    selectProductCategory(categoryName: string): void {
        this.productRankingService.setProductCategory(categoryName);
        this.selectedProductCategory = categoryName;
    }

}
