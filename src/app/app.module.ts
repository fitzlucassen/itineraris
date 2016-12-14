import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeMembershipComponent } from './component/membership/home/home.membership.component';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { SignupMembershipComponent } from './component/membership/signup/signup.membership.component';

const appRoutes: Routes = [
  {
    path: 'signup',
    component: SignupMembershipComponent,
    data: {
      title: 'Itineraris - Inscription'
    }
  },
  { path: '', component: HomeMembershipComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeMembershipComponent,
    SignupMembershipComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng'
    }),
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
