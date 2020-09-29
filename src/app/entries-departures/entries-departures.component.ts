import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductRankingService} from '../shared/services/product-ranking.service';
import {ProductRank} from '../shared/interfaces/product.interface';
import {DatePipe} from '@angular/common';
import {EntriesDepartures} from './entries-departures.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-in-out-table',
    templateUrl: './entries-departures.component.html',
    styleUrls: ['./entries-departures.component.scss']
})
export class EntriesDeparturesComponent implements OnInit, OnDestroy {

    productCategoryName;

    showTables = false;
    loading = false;
    productsRanks: ProductRank[];
    productsByWeek;
    weeks;
    weekRanges = {};

    entries;
    leaves;

    selectedWeek1: number;
    selectedWeek2: number;
    loadingTables: boolean;

    columns = ['asin', 'rank', 'link', 'name'];

    categorySubscription: Subscription;

    constructor(private productRankingService: ProductRankingService,
                private datePipe: DatePipe,
                private entriesDeparturesService: EntriesDepartures) {
    }

    reset() {
        this.showTables = false;
        this.loading = false;

        this.productsRanks = undefined;
        this.productsByWeek = undefined;

        this.weeks = undefined;
        this.weekRanges = {};

        this.entries = undefined;
        this.leaves = undefined;

        this.selectedWeek1 = undefined;
        this.selectedWeek2 = undefined;
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.entries.filter = filterValue.trim().toLowerCase();
        if (this.entries.paginator) {
            this.entries.paginator.firstPage();
        }
    }

    findProductsFromAsins(asins: string[]): ProductRank[] {
        return asins.map(asin => {
            return [...this.productsRanks].find(p => p.asin === asin);
        });
    }

    getInsAndOuts(selectedWeek1, selectedWeek2) {
        this.loadingTables = true;

        let asin1 = this.productsByWeek[selectedWeek1].map(x => x.asin);
        let asin2 = this.productsByWeek[selectedWeek2].map(x => x.asin);

        asin1 = this.removeDuplicates(asin1);
        asin2 = this.removeDuplicates(asin2);

        const ins = this.filterProducts(asin1, asin2);
        const outs = this.filterProducts(asin2, asin1);
        this.showResults(ins, outs);
    }

    showResults(entries: string[], leaves: string[]): void {
        this.entries = this.findProductsFromAsins(entries);
        this.leaves = this.findProductsFromAsins(leaves);

        this.entriesDeparturesService.updateData({
            entries: this.entries, leaves: this.leaves
        });
        this.showTables = true;
        this.loadingTables = false;
    }

    onSelectedWeek1(week: string) {
        this.selectedWeek1 = +week;
    }

    onSelectedWeek2(week: string) {
        this.selectedWeek2 = +week;
    }

    fetchData(): void {
        this.reset();
        this.loading = true;
        this.productRankingService.getProductRankingData()
            .subscribe((pr: ProductRank[]) => {
                    this.loading = false;
                    this.productsRanks = pr;
                    this.productsByWeek = this.getProductsByWeek(pr);
                    this.weeks = Object.keys(this.productsByWeek);
                    this.weeks.forEach(w => {
                        this.weekRanges[w] = this.getDateRangeOfWeek(w);
                    });
                },
                () => {
                    this.loading = false;
                }
            );
    }

    filterProducts(arr1: string[], arr2: string[]) {
        return arr2.filter(asin => !arr1.includes(asin));
    }

    removeDuplicates(array: string[]): string[] {
        const set = new Set(array);
        return Array.from(set);
    }

    getProductsByWeek(data: ProductRank[]) {
        const weeks = {};
        let lastWeek;
        for (const item of data) {
            const thisWeek = this.getWeekNumber(new Date(item.date));
            if (!lastWeek || lastWeek !== thisWeek) {
                weeks[thisWeek] = [];
                lastWeek = thisWeek;
                weeks[thisWeek].push(item);
            } else {
                weeks[thisWeek].push(item);
            }
        }
        return weeks;
    }

    getWeekNumber(date) {
        date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    getWeek(date) {
        const target = new Date(date.valueOf());
        const dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
    }

    getDateRangeOfWeek(weekNo) {
        const dates = this.productsByWeek[weekNo].reverse().map(p => new Date(p.date));
        dates.sort((a, b) => a.getTime() - b.getTime());
        return this.datePipe.transform(dates[0], 'MM-dd-yyyy') + ' to ' + this.datePipe.transform(dates[dates.length - 1], 'MM-dd-yyyy');
    }

    ngOnDestroy() {
        this.categorySubscription.unsubscribe();
    }

}
