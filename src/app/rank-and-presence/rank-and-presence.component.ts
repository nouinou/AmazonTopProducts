import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ProductRank} from '../shared/interfaces/product.interface';
import {ProductRankingService} from '../shared/services/product-ranking.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-rank-and-presence',
    templateUrl: './rank-and-presence.component.html',
    styleUrls: ['./rank-and-presence.component.scss']
})
export class RankAndPresenceComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    productCategoryName;

    showResults = false;
    loading = false;

    averageRankColumns = ['asin', 'average rank', 'link', 'name'];
    presenceRateColumns = ['asin', 'presence rate', 'link', 'name'];

    data: ProductRank[];

    productsAvRank;
    productsPR;

    categorySubscription: Subscription;

    constructor(private productRankingService: ProductRankingService) {
    }

    ngOnInit(): void {
        this.subscribeToProductCategory();
        this.fetchData();
    }

    subscribeToProductCategory() {
        this.productCategoryName = this.productRankingService.getProductCategory();
        this.categorySubscription = this.productRankingService.categorySubject.subscribe((name) => {
            this.productCategoryName = name;
            this.fetchData();
        });
    }

    reset() {
        this.data = undefined;
        this.showResults = false;
        this.productsAvRank = undefined;
        this.productsPR = undefined;
    }

    fetchData() {
        this.reset();
        this.loading = true;
        this.productRankingService.getProductRankingData().subscribe((data) => {
            this.loading = false;
            this.data = data;
            const asinsAvRank = [];
            const asinsPR = [];
            const productsAvRank = [];
            const productsPR = [];
            this.data.forEach(p => {
                if (!asinsAvRank.includes(p.asin)) {
                    productsAvRank.push(this.getProductAvRank(p.asin, p.name, p.link));
                    asinsAvRank.push(p.asin);
                }
                if (!asinsPR.includes(p.asin)) {
                    productsPR.push(this.getProductPR(p.asin, p.name, p.link));
                    asinsPR.push(p.asin);
                }
            });
            this.productsAvRank = productsAvRank;
            this.productsPR = productsPR;
            this.showResults = true;
        });
    }

    getProductAvRank(asin: string, name: string, link: string) {
        const products = this.getAllProductRankings(asin);
        let sum = 0;
        for (const product of products) {
            sum += +product.rank;
        }
        return {asin, 'average rank': Math.round(sum / products.length), link, name};
    }

    getProductPR(asin: string, name: string, link: string) {
        const products = this.getAllTop10Ranking(asin);
        return {asin, 'presence rate': Math.round(products.length * 100 / 30), link, name};
    }

    getAllProductRankings(asin: any) {
        return [...this.data].filter(p => p.asin === asin);
    }

    getAllTop10Ranking(asin: any) {
        return [...this.data].filter(p => p.asin === asin && p.rank <= 10);
    }

    ngOnDestroy() {
        this.categorySubscription.unsubscribe();
    }

}
