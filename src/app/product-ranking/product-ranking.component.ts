import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductRankingService} from '../shared/services/product-ranking.service';
import {ProductRank} from '../shared/interfaces/product.interface';
import * as echarts from 'echarts';
import {Subscription} from 'rxjs';

class Product {
    name: string;
    asin: string;
    link: string;
}

@Component({
    selector: 'app-product-ranking',
    templateUrl: './product-ranking.component.html',
    styleUrls: ['./product-ranking.component.scss']
})
export class ProductRankingComponent implements OnInit, OnDestroy {
    topNumber = 10;
    loading = false;
    chart;
    options;
    dates;

    dataZoom = [
        {
            show: true,
            type: 'inside',

        },
        {show: true},
        {
            type: 'slider',
            yAxisIndex: 0,
            minValueSpan: 1
        },
    ];

    selectedProduct: Product;

    productCategoryName;

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

    changeTopNumber(num: number){
        this.topNumber = +num;
        this.fetchData();
    }


    initiateChart() {
        this.chart = echarts.init(document.getElementById('product-rank-chart'));
        this.options = {
            tooltip: {
                trigger: 'item',
                formatter(obj) {
                    const value = obj.data;
                    return `<p>Name: ${value[2].substring(0, 30).trim()}...
                            <p>Rank: ${value[1]}
                            <p>ASIN: ${value[3]}
                            <p>Date: ${value[0]}`;
                }
            },
            dataZoom: [...this.dataZoom],
            toolbox: {
                feature: {
                    restore: {title: 'Restore'},
                }
            },
            xAxis: {
                type: 'category',
                data: this.dates.reverse()
            },
            yAxis: {
                type: 'value',
                min: 1,
                max: this.topNumber,
                zlevel: 1,
                z: 1,
                inverse: true,
                smooth: 0.6,
                minInterval: 1,
                // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
        };
    }

    reset() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = undefined;
        }
        this.options = undefined;
        this.dates = undefined;
        this.selectedProduct = undefined;
        this.options = undefined;
    }

    fetchData(): void {
        this.reset();
        this.loading = true;
        this.productRankingService.getProductRankingData()
            .subscribe((pr: ProductRank[]) => {
                    pr = pr.filter(p => p.rank <= this.topNumber);
                    const dates = new Set(pr.map(r => r.date));
                    this.dates = [...dates].sort((a, b) => new Date(b) > new Date(a) ? 1 : 0);
                    this.initiateChart();
                    this.showChart(pr);
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                }
            );
    }


    showChart(productRanks: ProductRank[]) {
        const cachedProductAsins = [];
        const data = [];
        for (const pr of productRanks) {
            if (cachedProductAsins.includes(pr.asin)) {
                data.find(p => p.asin === pr.asin).data.push([pr.date, +pr.rank, pr.name, pr.asin, pr.link]);
            } else {
                const product = {
                    asin: pr.asin,
                    name: pr.name,
                    link: pr.link,
                    symbolSize: 10,
                    type: 'line',
                    connectNulls: false,
                    data: [[pr.date, +pr.rank, pr.name, pr.asin, pr.link]],
                    markLine: {
                        symbol: ['none', 'none'],
                        label: {show: false},
                    },
                    lineStyle: [{opacity: 0.8, }]
                };
                data.push(product);
                cachedProductAsins.push(pr.asin);
            }
        }

        this.options.series = data;
        this.chart.setOption(this.options);
        this.chart.on('click', (params) => this.highlightSelectedProduct(params));
        this.chart.on('restore', () => this.restoreChart());
    }

    highlightSelectedProduct(params) {
        const selectedProductData = this.options.series.find(p => p.asin === params.data[3]);
        selectedProductData.data.sort((a, b) => new Date(b[0]) > new Date(a[0]) ? 1 : 0);
        this.selectedProduct = {
            name: params.data[2],
            asin: params.data[3],
            link: params.data[4]
        };
        this.options.dataZoom = this.chart.getOption().dataZoom;
        this.options.series.forEach(x => {
                x.symbolSize = 10;
                x.lineStyle = {
                    width: 1, opacity: 0.5, shadowColor: null,
                    shadowBlur: null
                };
            }
        );
        const selectedProduct = this.options.series.filter(p => p.asin === params.data[3])[0];
        selectedProduct.symbolSize = 15;
        selectedProduct.lineStyle = {
            width: 6,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 2
        };
        this.chart.setOption(this.options);
    }

    restoreChart() {
        this.options.dataZoom = [...this.dataZoom];
        this.options.series.forEach(x => {
                x.symbolSize = 10;
                x.lineStyle = {
                    width: 1, opacity: 0.8, shadowColor: null,
                    shadowBlur: null
                };
            }
        );
        this.chart.setOption(this.options);
    }

    ngOnDestroy() {
        this.categorySubscription.unsubscribe();
        this.chart.clear();
        this.chart.dispose();
    }
}
