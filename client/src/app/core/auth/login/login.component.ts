import { DeviceService } from './../../../device/services/device.service';

import {from as observableFrom,  Observable } from 'rxjs';


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../shared/_services/app-config.service';

import { UserService } from '../../../shared/_services/user.service';
import { AuthenticationService } from '../../../shared/_services/authentication.service';
import { _TRANSLATE } from '../../../shared/translation-marker';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  devicePassword = ''
  requiresDevicePasswordToRecover
  returnUrl: string; // stores the value of the url to redirect to after login
  user = { username: '', password: '' };
  users = [];
  installed = false
  showRecoveryInput = false;
  securityQuestionText;
  allUsernames;
  listUsernamesOnLoginScreen;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UserService,
    private deviceService:DeviceService,
    private appConfigService: AppConfigService
  ) {
    this.installed = localStorage.getItem('installed') ? true : false
  }

  async ngOnInit() {
    const appConfig = await this.appConfigService.getAppConfig();
    const homeUrl = appConfig.homeUrl;
    this.requiresDevicePasswordToRecover = this.deviceService.passwordIsSet()
    this.securityQuestionText = appConfig.securityQuestionText;
    this.listUsernamesOnLoginScreen = appConfig.listUsernamesOnLoginScreen;
    if (this.listUsernamesOnLoginScreen) {
      this.allUsernames = await this.usersService.getUsernames();
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || homeUrl;
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }

  }

  async toggleRecoveryInput() {
    this.showRecoveryInput = !this.showRecoveryInput;
  }

  resetPassword() {
    if (!this.deviceService.verifyPassword(this.devicePassword)) {
      this.errorMessage = _TRANSLATE('Device password incorrect.')
      return
    }
    observableFrom(this.authenticationService.resetPassword(this.user, this.devicePassword)).subscribe(data => {
      if (data) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage = _TRANSLATE('Password Reset Unsuccesful');
      }
    }, error => {
      this.errorMessage = _TRANSLATE('Password Reset Unsuccesful');

    });
  }

  loginUser() {
    observableFrom(this.authenticationService.login(this.user.username, this.user.password)).subscribe(data => {
      if (data) {
        this.router.navigate(['' + this.returnUrl]);
      } else {
        this.errorMessage = _TRANSLATE('Login Unsuccesful');
      }
    }, error => {
      this.errorMessage = _TRANSLATE('Login Unsuccesful');

    });
  }

  register(): void {
    this.router.navigate(['/register']);
  }


}


