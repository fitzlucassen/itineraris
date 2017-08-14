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
import { SharingDialogComponent } from '../../component/user/sharing-dialog/sharing-dialog.component';
import { ItineraryUserDialogComponent } from '../../component/user/itinerary-user-dialog/itinerary-user-dialog.component';

import { SearchPipe } from '../../pipe/search.pipe';
import { SearchStepPipe } from '../../pipe/search-step.pipe';
import { SearchUserPipe } from '../../pipe/search-user.pipe';

import { AuthGuard } from '../../guard/auth-guard';
import { NoAuthGuard } from '../../guard/no-auth-guard';

import { routing } from '../../routing/membership.routing';

import { ShareButtonsModule } from "ng2-sharebuttons";

@NgModule({
	declarations: [
		HomeMembershipComponent,
		SignupMembershipComponent,
		DashboardUserComponent,
		ItineraryUserComponent,
		ItineraryDialogComponent,
		ItineraryUserDialogComponent,
		SearchPipe,
		StepDialogComponent,
		StopDialogComponent,
		SearchStepPipe,
		UploadFileComponent,
		SharingDialogComponent,
		SearchUserPipe
	],
	entryComponents: [
		ItineraryDialogComponent,
		StepDialogComponent,
		StopDialogComponent,
		SharingDialogComponent,
		ItineraryUserDialogComponent,		
	],
	imports: [
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		HttpModule,
		MaterialModule,
		MdNativeDateModule,
		ShareButtonsModule.forRoot(),
		routing
	]
})
export class MembershipModule { }
