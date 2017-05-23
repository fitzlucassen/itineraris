import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';

import { HomeVisitorComponent } from '../../component/visitor/home/home.visitor.component';
import { UserMapComponent } from '../../component/visitor/user-map/user-map.component';
import { MapComponent } from '../../component/visitor/map/map.component';
import { SearchItineraryPipe } from '../../pipe/search-itinerary.pipe';

import { ShareButtonsModule } from 'ng2-sharebuttons';

import { routing } from '../../visitor.routing';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		HttpModule,
		MaterialModule,
		ShareButtonsModule.forRoot(),
		routing
	],
	declarations: [
		UserMapComponent,
		MapComponent,
		HomeVisitorComponent,
		SearchItineraryPipe
	]
})
export class VisitorModule { }
