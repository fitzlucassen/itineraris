import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMembershipComponent } from './component/membership/home/home.membership.component';
import { SignupMembershipComponent } from './component/membership/signup/signup.membership.component';
import { DashboardUserComponent } from './component/user/dashboard/dashboard.user.component';
import { ItineraryUserComponent } from './component/user/itinerary/itinerary.user.component';

import { AuthGuard } from './auth-guard';
import { NoAuthGuard } from './no-auth-guard';

const appRoutes: Routes = [
	/***********/
	// MEMBERSHIP
	/***********/
	{
		path: 'connexion.html',
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
		path: 'inscription.html',
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
		path: 'tableau-de-bord.html',
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
		path: 'itinéraire/:id/:name',
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

export const routing: ModuleWithProviders = RouterModule.forChild(appRoutes);