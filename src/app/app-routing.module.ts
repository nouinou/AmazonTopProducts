import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductRankingComponent} from './product-ranking/product-ranking.component';
import {EntriesDeparturesComponent} from './entries-departures/entries-departures.component';
import {RankAndPresenceComponent} from './rank-and-presence/rank-and-presence.component';


const routes: Routes = [
    {
        path: '', component: ProductRankingComponent,
    },
    {
        path: 'entries-departures', component: EntriesDeparturesComponent
    },
    {
        path: 'rank-and-presence', component: RankAndPresenceComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
