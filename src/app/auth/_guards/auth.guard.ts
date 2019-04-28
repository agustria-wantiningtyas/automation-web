import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";
import { Helpers } from "../../helpers";
import { Config } from '../../components/api-config';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _userService: UserService,
        public http: HttpClient,
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let dataUser = JSON.parse(localStorage.getItem('user_data'));
        if (dataUser) {
            return this._userService.verify().map(
                data => {
                    if (data !== null) {
                        // logged in so return true
                        return true;
                    }
                    // error when verify so redirect to login page with the return url
                    this._router.navigate(['/index'], { queryParams: { returnUrl: state.url } });
                    return false;
                },
                _error => {
                    // error when verify so redirect to login page with the return url
                    this._router.navigate(['/index'], { queryParams: { returnUrl: state.url } });
                    return false;
                });
        } else {
            this._router.navigate(['/index'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }

    // child
    canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let tokenUser = localStorage.getItem('user_token');
        let strUrl = state.url;
        let url = strUrl.substring(0, strUrl.indexOf("?"));
        if (url == '') {
            url = strUrl
        }

        if (url !== '') {
            const body = {
                token: tokenUser,
                path: url
            }

            return this.http.post(Config.apiUrl + 'menu/check-menu-access', body).map(
                result => {
                    if (result['response_code'] == 200) {
                        return true;

                    } else {
                        this._router.navigate(['/401']);
                        return false;
                    }
                }, error => {
                    this._router.navigate(['/401']);
                    console.log(error);
                    return false;
                });
        } else {
            Helpers.setLoading(false);
            this._router.navigate(['/401']);
            return false;
        }
    }
}