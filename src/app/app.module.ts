import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProductRankingComponent} from './product-ranking/product-ranking.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {EntriesDeparturesComponent} from './entries-departures/entries-departures.component';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {TableComponent} from './shared/components/table/table.component';
import {RankAndPresenceComponent} from './rank-and-presence/rank-and-presence.component';
import {CategoryMenuComponent} from './shared/components/category-menu/category-menu.component';
import {NavigationComponent} from './shared/components/navigation/navigation.component';

/* Angular Material Modules */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        AppComponent,
        ProductRankingComponent,
        EntriesDeparturesComponent,
        TableComponent,
        RankAndPresenceComponent,
        CategoryMenuComponent,
        NavigationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule {
}
