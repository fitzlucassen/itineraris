import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';

import { UserService } from './service/user.service';
import { AuthGuard } from './guard/auth-guard';
import { NoAuthGuard } from './guard/no-auth-guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home/home.component';
import { routing } from './routing/app.routing';

import { ShareButtonsModule } from 'ng2-sharebuttons';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		FormsModule,
		HttpModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng',
			libraries: ['places']
		}),
		routing
	],
	providers: [UserService, AuthGuard, NoAuthGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
