import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeVisitorComponent } from '../../component/visitor/home/home.visitor.component';
import { UserMapComponent } from '../../component/visitor/user-map/user-map.component';
import { MapComponent } from '../../component/visitor/map/map.component';

import { routing } from '../../visitor.routing';

@NgModule({
	imports: [
		CommonModule,
		routing
	],
	declarations: [
		UserMapComponent,
		MapComponent,
		HomeVisitorComponent,
	]
})
export class VisitorModule { }
