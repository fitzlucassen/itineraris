import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { HomeVisitorComponent } from '../../component/visitor/home/home.visitor.component';
import { UserMapComponent } from '../../component/visitor/user-map/user-map.component';
import { MapComponent } from '../../component/visitor/map/map.component';

import { routing } from '../../visitor.routing';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		HttpModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng',
			libraries: ["places"]
		}),
		MaterialModule.forRoot(),
		routing
	],
	declarations: [
		UserMapComponent,
		MapComponent,
		HomeVisitorComponent,
	]
})
export class VisitorModule { }
