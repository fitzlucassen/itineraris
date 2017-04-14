import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';


import { UserService } from './service/user.service';
import { AuthGuard } from './auth-guard';
import { NoAuthGuard } from './no-auth-guard';

import { HomeComponent } from './component/home/home/home.component';
import { HomeVisitorComponent } from './component/visitor/home/home.visitor.component';
import { UserMapComponent } from './component/visitor/user-map/user-map.component';
import { MapComponent } from './component/visitor/map/map.component';


import { MetaModule } from 'ng2-meta';
import { ShareButtonsModule } from 'ng2-sharebuttons';

const appRoutes: Routes = [
	/***********/
	// MEMBERSHIP
	/***********/

	/***********/
	// VISITOR
	/***********/
	{
		path: 'itineraires.html',
		component: HomeVisitorComponent,
		data: {
			meta: {
				title: 'Trouvez un itinéraire de voyage',
				description: 'Recherchez un itinéraire de voyage'
			}
		}
	},
	{
		path: ':nameuser/:id/:name',
		component: UserMapComponent,
		data: {
			meta: {
				title: 'Itinéraire de voyage',
				description: 'Visualisation de l\'itinéraire de voyage'
			}
		}
	},
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

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		UserMapComponent,
		MapComponent,
		HomeVisitorComponent,
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng',
			libraries: ["places"]
		}),
		MaterialModule.forRoot(),
		RouterModule.forRoot(appRoutes, { useHash: true }),
		MetaModule.forRoot(),
		ShareButtonsModule.forRoot()
	],
	providers: [UserService, AuthGuard, NoAuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
