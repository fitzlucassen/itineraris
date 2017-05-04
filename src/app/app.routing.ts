import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './component/home/home/home.component';

const appRoutes: Routes = [
	{ path: 'visiteur', loadChildren: 'app/module/visitor/visitor.module#VisitorModule' },
	{ path: 'compte', loadChildren: 'app/module/membership/membership.module#MembershipModule' },
	{
		path: '',
		component: HomeComponent,
		data: {
			meta: {
				title: 'Vos itinéraires voyages - Itineraris',
				description: 'Créez vos itinéraires de voyages et tenez informé vos proches'
			}
		}
	}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });