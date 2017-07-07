import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';

import { HomeMembershipComponent } from '../../component/membership/home/home.membership.component';
import { SignupMembershipComponent } from '../../component/membership/signup/signup.membership.component';
import { DashboardUserComponent } from '../../component/user/dashboard/dashboard.user.component';
import { ItineraryDialogComponent } from '../../component/user/itinerary-dialog/itinerary-dialog.component';
import { StepDialogComponent } from '../../component/user/step-dialog/step-dialog.component';
import { StopDialogComponent } from '../../component/user/stop-dialog/stop-dialog.component';
import { UploadFileComponent } from '../../component/upload-file/upload-file.component';
import { ItineraryUserComponent } from '../../component/user/itinerary/itinerary.user.component';

import { SearchPipe } from '../../pipe/search.pipe';
import { SearchStepPipe } from '../../pipe/search-step.pipe';

import { AuthGuard } from '../../guard/auth-guard';
import { NoAuthGuard } from '../../guard/no-auth-guard';

import { routing } from '../../routing/membership.routing';

@NgModule({
	declarations: [
		HomeMembershipComponent,
		SignupMembershipComponent,
		DashboardUserComponent,
		ItineraryUserComponent,
		ItineraryDialogComponent,
		SearchPipe,
		StepDialogComponent,
		StopDialogComponent,
		SearchStepPipe,
		UploadFileComponent,
	],
	entryComponents: [
		ItineraryDialogComponent,
		StepDialogComponent,
		StopDialogComponent,
	],
	imports: [
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		HttpModule,
		MaterialModule,
		MdNativeDateModule,
		routing
	]
})
export class MembershipModule { }
