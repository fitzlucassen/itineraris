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

const appRoutes: Routes = [
	{
		path: 'compte/connexion.html',
		component: HomeMembershipComponent,
		canActivate: [NoAuthGuard],
		data: {
			title: 'Itineraris - Connexion'
		}
	},
	{
		path: 'compte/inscription.html',
		component: SignupMembershipComponent,
		canActivate: [NoAuthGuard],
		data: {
			title: 'Itineraris - Inscription'
		}
	},
	{
		path: 'compte/tableau-de-bord.html',
		component: DashboardUserComponent,
		canActivate: [AuthGuard],
		data: {
			title: 'Itineraris - Dashboard'
		}
	},
	{
		path: 'compte/itinéraire/:id/:name',
		component: ItineraryUserComponent,
		canActivate: [AuthGuard],
		data: {
			title: 'Itineraris - Itinéraire'
		}
	},
	{
		path: '',
		component: HomeComponent,
		data: {
			title: 'Itineraris'
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
		HomeComponent
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
		RouterModule.forRoot(appRoutes)
	],
	providers: [UserService, AuthGuard, NoAuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
