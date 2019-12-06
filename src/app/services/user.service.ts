import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoggerService } from './logger.service';
import uuid from 'uuidv4';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly COOKIE_STATUS_READY: number = 0;
  private readonly COOKIE_STATUS_DIRTY: number = 100;
  private readonly COOKIE_STATUS_EMPTY: number = 200;

  private readonly COOKIE_EXPIRY_DAYS: number = 90;

  public readonly COOKIE_APP: string = 'demoapp';
  public readonly PROPERTY_UUID: string = 'uuid';

  private userCookie: string;
  private userCookieObject: object;
  private cookieStatus: number;

  constructor(private ngxCookie: CookieService, private loggerService: LoggerService) {
    this.userCookie = null;
    this.userCookieObject = null;
    this.cookieStatus = this.COOKIE_STATUS_EMPTY;

    this.initializeUserCookie();
    this.initializeUuid();
  }

  private getCookieExpiryDate(): Date {
    const expiryDate: Date = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS);

    return expiryDate;
  }

  private initializeUserCookie(): void {
    if (this.userCookieExists() === false) {
      this.createUserCookie();
    }
  }

  private userCookieExists(): boolean {
    const userCookieExists: boolean = this.ngxCookie.check(this.COOKIE_APP);

    return userCookieExists;
  }

  private createUserCookie(): void {
    this.ngxCookie.set(this.COOKIE_APP, '{}', this.getCookieExpiryDate()); // , null, null, true, 'Strict');
  }

  private writeUserCookie(): void {
    const newCookieData: string = JSON.stringify(this.userCookieObject);

    this.ngxCookie.set(this.COOKIE_APP, newCookieData, this.getCookieExpiryDate());
  }

  private readUserCookie(forceRead: boolean = false): void {
    if (this.cookieStatus !== this.COOKIE_STATUS_READY || forceRead === true) {
      this.userCookie = this.ngxCookie.get(this.COOKIE_APP);
      this.userCookieObject = JSON.parse(this.userCookie);
      this.cookieStatus = this.COOKIE_STATUS_READY;
    }
  }

  private cookieObjectHasProperty(cookieObject: object, propertyName: string): boolean {
    if (cookieObject === null || cookieObject === undefined) {
      return;
    }

    const propertyValue: string = cookieObject[propertyName];

    if (propertyValue !== null && propertyValue !== undefined) {
      return true;
    }

    return false;
  }

  private cookieSetProperty(cookieObject: object, propertyName: string, valueToSet: string): void {
    Object.defineProperty(cookieObject, propertyName, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: valueToSet
    });
  }

  private hasUuid(): boolean {
    if (this.userCookieExists() === false) {
      return false;
    }

    if (this.cookieObjectHasProperty(this.userCookieObject, this.PROPERTY_UUID) === true) {
      return true;
    }

    return false;
  }

  public initializeUuid(): void {
    /*
    if (this.userCookieExists() === false) {
      this.loggerService.error('User cookie not defined. Could not initialize UUID.');
      return;
    }
    */

    if (this.cookieStatus !== this.COOKIE_STATUS_READY) {
      this.readUserCookie();
    }

    if (this.hasUuid() === true) {
      return;
    }

    const newUuid: string = uuid();

    this.cookieSetProperty(this.userCookieObject, this.PROPERTY_UUID, newUuid);
    this.writeUserCookie();
    this.cookieStatus = this.COOKIE_STATUS_DIRTY;
  }

  public getUuid(): string {
    /*
    if (this.userCookieExists() === false) {
      this.loggerService.error('User cookie not defined. Could not get UUID.');
      return;
    }
    */

    if (this.cookieStatus !== this.COOKIE_STATUS_READY) {
      this.readUserCookie();
    }

    const userUuid: string = this.ngxCookie.get(this.PROPERTY_UUID);

    return userUuid;
  }
}
