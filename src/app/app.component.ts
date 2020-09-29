import {Component, HostListener, ViewChild} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'amazon-top-sellers';
    @ViewChild(MatDrawer) drawer;

    @HostListener('window:resize', ['$event'])
    onResize() {
        if (window.innerWidth <= 700 && this.drawer.opened) {
            this.drawer.close();
        } else if (window.innerWidth > 700 && !this.drawer.opened) {
            this.drawer.open();
        }
    }

}
