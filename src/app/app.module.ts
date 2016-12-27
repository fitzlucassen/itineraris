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

const appRoutes: Routes = [
	{
		path: 'membership',
		component: HomeMembershipComponent,
		data: {
			title: 'Itineraris - Connexion'
		}
	},
	{
		path: 'membership/signup',
		component: SignupMembershipComponent,
		data: {
			title: 'Itineraris - Inscription'
		}
	},
	{
		path: 'account/dashboard',
		component: DashboardUserComponent,
		canActivate: [AuthGuard],
		data: {
			title: 'Itineraris - Dashboard'
		}
	},
];

@NgModule({
	declarations: [
		AppComponent,
		HomeMembershipComponent,
		SignupMembershipComponent,
		DashboardUserComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng'
		}),
		MaterialModule.forRoot(),
		RouterModule.forRoot(appRoutes)
	],
	providers: [UserService, AuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
