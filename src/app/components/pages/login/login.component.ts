import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { first } from 'rxjs/operators';
import { DataHelper } from '@app/helpers/data-helper.helper';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private returnUrl: string;
  private loading: boolean;
  private error: string;
  private formUsername = new FormControl('', [Validators.required.bind(this)]);
  private formPassword = new FormControl('', [Validators.required.bind(this)]);
  private hide = true;

  constructor(private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService) {
    /*
     * Redirect to home if already logged in.
     */
    if (DataHelper.isDefined(this.authenticationService.currentUserValue) === true) {
      this.router.navigate(['/']);
    }
  }

  public ngOnInit(): void {
    /*
     * Get return url from route parameters or default to '/'.
     */
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    if (DataHelper.isDefined(this.returnUrl) === false) {
      this.returnUrl = '/';
    }
  }

  public getFormUsername(): FormControl {
    return this.formUsername;
  }

  public getFormPassword(): FormControl {
    return this.formPassword;
  }

  public toggleHidePassword(): void {
    this.hide = !this.hide;
  }

  public getHidePassword(): boolean {
    return this.hide;
  }

  public getFormUsernameError(): string {
    return this.formUsername.hasError('required') ? 'You must enter a username' : '';
  }

  public getFormPasswordError(): string {
    return this.formPassword.hasError('required') ? 'You must enter a password' : '';
  }

  public isAttemptingLogin(): boolean {
    return this.loading;
  }

  public getErrorMessage(): string {
    return this.error;
  }

  public onSubmit(): void {
    if (this.formUsername.invalid) {
      this.formUsername.markAsTouched();

      return;
    }

    if (this.formPassword.invalid) {
      this.formUsername.markAsTouched();

      return;
    }

    this.loading = true;
    this.authenticationService.login(this.formUsername.value, this.formPassword.value)
      .pipe(first())
      .subscribe(
        (data: User) => {
          this.router.navigate([this.returnUrl]);
        },
        (error: string) => {
          this.error = error;
          this.loading = false;
        });
  }
}
