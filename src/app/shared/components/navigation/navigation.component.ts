import {Component} from '@angular/core';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
    pages: { name: string, link: string } [] = [
        {
            name: 'Top Products Chart',
            link: ''
        },
        {
            name: 'Entries/Departures',
            link: 'entries-departures'
        },
        {
            name: 'Product Presence',
            link: 'rank-and-presence'
        }
    ];
}
