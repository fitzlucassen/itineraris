import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeMembershipComponent } from '../../component/membership/home/home.membership.component';
import { SignupMembershipComponent } from '../../component/membership/signup/signup.membership.component';
import { DashboardUserComponent } from '../../component/user/dashboard/dashboard.user.component';
import { ItineraryDialogComponent } from '../../component/user/itinerary-dialog/itinerary-dialog.component';
import { StepDialogComponent } from '../../component/user/step-dialog/step-dialog.component';
import { UploadFileComponent } from '../../component/upload-file/upload-file.component';
import { ItineraryUserComponent } from '../../component/user/itinerary/itinerary.user.component';

import { SearchPipe } from '../../pipe/search.pipe';
import { SearchStepPipe } from '../../pipe/search-step.pipe';
import { SearchItineraryPipe } from '../../pipe/search-itinerary.pipe';

import { AuthGuard } from '../../auth-guard';
import { NoAuthGuard } from '../../no-auth-guard';

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
	}
];

@NgModule({
	declarations: [
		HomeMembershipComponent,
		SignupMembershipComponent,
		DashboardUserComponent,
		ItineraryUserComponent,
		ItineraryDialogComponent,
		SearchPipe,
		StepDialogComponent,
		SearchStepPipe,
		UploadFileComponent,
		SearchItineraryPipe,
	],
	entryComponents: [
		ItineraryDialogComponent,
		StepDialogComponent
	],
	imports: [
		CommonModule
	]
})
export class MembershipModule { }
