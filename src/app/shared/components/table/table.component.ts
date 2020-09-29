import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ProductRank} from '../../interfaces/product.interface';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EntriesDepartures} from '../../../entries-departures/entries-departures.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
    @Input() data: ProductRank[];
    @Input() dataSourceName: string;
    @Input() displayedColumns: string[];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    dataSource: MatTableDataSource<ProductRank>;

    constructor(private inOutService: EntriesDepartures) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.inOutService.tableDataSubject.subscribe(data => {
            this.updateDateSource(data);
        });
    }

    updateDateSource(data) {
        this.dataSource = new MatTableDataSource(data[this.dataSourceName]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
