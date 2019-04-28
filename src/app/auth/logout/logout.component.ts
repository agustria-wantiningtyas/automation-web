import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { Helpers } from "../../helpers";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit {

    constructor(
        private _router: Router,
        private _authService: AuthenticationService
    ) {
    }

    ngOnInit(): void {
        this.doLogout();
    }

    public doLogout() {
        Helpers.setLoading(true);
        // reset login status
        console.log('logout sukses');
        localStorage.clear();
        // localStorage.removeItem('dataUser')
        // localStorage.removeItem('myEmail');
        // localStorage.removeItem('tokenUser');
        // localStorage.removeItem('is_ot')
        // localStorage.removeItem('roleUser');
        // localStorage.removeItem('currentUser');
        // localStorage.removeItem('menuDefault');

        this._authService.logout();
        this._router.navigate(['/index']);
    }
}