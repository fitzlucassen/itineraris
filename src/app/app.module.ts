import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { UserService } from './service/user.service';
import { AuthGuard } from './auth-guard';
import { NoAuthGuard } from './no-auth-guard';

import { HomeComponent } from './component/home/home/home.component';
import { routing } from './app.routing';

import { ShareButtonsModule } from 'ng2-sharebuttons';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		FormsModule,
		HttpModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng',
			libraries: ["places"]
		}),
		MaterialModule,
		routing
	],
	providers: [UserService, AuthGuard, NoAuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
