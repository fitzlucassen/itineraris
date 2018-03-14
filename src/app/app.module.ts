import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';

import { UserService } from './service/user.service';
import { AuthGuard } from './guard/auth-guard';
import { NoAuthGuard } from './guard/no-auth-guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home/home.component';
import { SharingDialogComponent } from './component/common/sharing-dialog/sharing-dialog.component';

import { routing } from './routing/app.routing';

import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SharingDialogComponent
    ],
    entryComponents: [
        SharingDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,      // (Required) for share counts
        HttpClientJsonpModule, // (Optional) For linkedIn & Tumblr counts
        ShareButtonsModule.forRoot(),
        MatFormFieldModule, MatInputModule,
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
