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

import { routing } from '../../membership.routing';

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
		CommonModule,
		routing
	]
})
export class MembershipModule { }
