import { Component, OnInit } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../../../service/user.service';

@Component({
	selector: 'app-user-dashboard',
	templateUrl: './dashboard.user.component.html',
	styleUrls: ['./dashboard.user.component.css'],
	providers: [UserService]
})
export class DashboardUserComponent implements OnInit {

	constructor(private userService: UserService) { }

	ngOnInit() {
	}
}
