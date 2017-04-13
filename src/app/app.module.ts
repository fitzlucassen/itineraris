import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeMembershipComponent } from './component/membership/home/home.membership.component';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { SignupMembershipComponent } from './component/membership/signup/signup.membership.component';
import { DashboardUserComponent } from './component/user/dashboard/dashboard.user.component';

import { UserService } from './service/user.service';
import { AuthGuard } from './auth-guard';
import { NoAuthGuard } from './no-auth-guard';
import { ItineraryDialogComponent } from './component/user/itinerary-dialog/itinerary-dialog.component';
import { SearchPipe } from './pipe/search.pipe';
import { ItineraryUserComponent } from './component/user/itinerary/itinerary.user.component';
import { StepDialogComponent } from './component/user/step-dialog/step-dialog.component';
import { SearchStepPipe } from './pipe/search-step.pipe';
import { HomeComponent } from './component/home/home/home.component';
import { UploadFileComponent } from './component/upload-file/upload-file.component';
import { UserMapComponent } from './component/visitor/user-map/user-map.component';
import { MapComponent } from './component/visitor/map/map.component';
import { HomeVisitorComponent } from './component/visitor/home/home.visitor.component';
import { SearchItineraryPipe } from './pipe/search-itinerary.pipe';

import { MetaModule } from 'ng2-meta';
import {ShareButtonsModule} from 'ng2-sharebuttons';

const appRoutes: Routes = [
	/***********/
	// MEMBERSHIP
	/***********/
	{
		path: 'compte/connexion.html',
		component: HomeMembershipComponent,
		canActivate: [NoAuthGuard],
		data: {
			meta: {
				title: 'Itineraris - Connexion',
				description: 'Connectez-vous à votre compte et créez vos itinéraires de voyages'
			}
		}
	},
	{
		path: 'compte/inscription.html',
		component: SignupMembershipComponent,
		canActivate: [NoAuthGuard],
		data: {
			meta: {
				title: 'Itineraris - Inscription',
				description: 'Inscrivez-vous afin de créer vos itinéraires de voyages'
			}
		}
	},
	/***********/
	// ACCOUNT
	/***********/
	{
		path: 'compte/tableau-de-bord.html',
		component: DashboardUserComponent,
		canActivate: [AuthGuard],
		data: {
			meta: {
				title: 'Itineraris - Dashboard',
				description: 'Votre tableau de bord, gérez vos itinéraires de voyages'
			}
		}
	},
	{
		path: 'compte/itinéraire/:id/:name',
		component: ItineraryUserComponent,
		canActivate: [AuthGuard],
		data: {
			meta: {
				title: 'Itineraris - Gérer l\'itinéraire',
				description: 'Gérer votre itinéraire en ajoutant une ou plusieurs étapes'
			}
		}
	},
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
		HomeMembershipComponent,
		SignupMembershipComponent,
		DashboardUserComponent,
		ItineraryDialogComponent,
		SearchPipe,
		ItineraryUserComponent,
		StepDialogComponent,
		SearchStepPipe,
		HomeComponent,
		UploadFileComponent,
		UserMapComponent,
		MapComponent,
		HomeVisitorComponent,
		SearchItineraryPipe,
	],
	entryComponents: [
		ItineraryDialogComponent,
		StepDialogComponent
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
