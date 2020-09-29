import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EntriesDepartures {
    tableDataSubject = new Subject<any>();

    updateData(data): void {
        this.tableDataSubject.next(data);
    }
}
