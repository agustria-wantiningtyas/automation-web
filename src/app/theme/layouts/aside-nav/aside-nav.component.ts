import { Subscription } from 'rxjs/Rx';
import { UserIdleService } from 'angular-user-idle';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { GeneralService } from '../../../_services/general.service';
import { AuthenticationService } from '../../../auth/_services';
import { ConfirmationService } from 'primeng/primeng';


declare let mLayout: any;
@Component({
    selector: 'app-aside-nav',
    templateUrl: './aside-nav.component.html',
    styleUrls: ['./aside-nav.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {
    post$: Subscription;

    public menuItems: any[] = [];
    public tokenUser: any;
    public firstMenuItem: any[];
    menuDefault: any[] = [];
    returnUrl: any;
    st: any;
    okey: boolean = false;
    st2: string;

    constructor(
        private _router: Router,
        public _generalService: GeneralService,
        private _authService: AuthenticationService,
        private _route: ActivatedRoute,
        private userIdle: UserIdleService,
        public confirmationService: ConfirmationService

    ) {
        this.tokenUser = localStorage.getItem('user_token');
        this.menuDefault = JSON.parse(localStorage.getItem('default_menu'));
        // ketika ada ?
        this.st = this._router.url.substr(0, this._router.url.indexOf('?'))
        this.st2 = this._router.url.substr(this._router.url.indexOf('?'), this._router.url.indexOf('?') + 1)
        // murni url
        this._router.url
        // menu id
        this.returnUrl = this._route.snapshot.queryParams['_m'] || '/';
    }

    ngOnInit() {
        this.startSession();

        if (this.menuDefault) {
            this.menuItems = this.menuDefault;
        } else {
            localStorage.removeItem('default_menu');
            this.loadMenu();
        }
    }

    ngAfterViewInit() {

        mLayout.initAside();

    }

    startSession() {
        //Start watching for user inactivity.
        this.userIdle.startWatching();

        // Start watching when user idle is starting.
        this.post$ = this.userIdle.onTimerStart().subscribe(() => { });

        // Start watch when time is up.
        this.post$ = this.userIdle.onTimeout().subscribe(() => {
            // alert('Your session expired');
            this.restart();
            this.stop();
            this.stopWatching();
            this.doLogout();

            this.confirmationService.confirm({
                header: 'Session Expired',
                message: 'Your session has expired. Please login again.',
                icon: null,
                rejectVisible: false,
                acceptLabel: 'OK',
                accept: () => {
                    this._router.navigate(['/index']);
                    // this.doLogout();
                },
                reject: () => {
                    // this.doLogout();
                    this._router.navigate(['/index']);
                }
            });
        });
    }

    stop() {
        this.userIdle.stopTimer();
    }

    stopWatching() {
        this.userIdle.stopWatching();
    }

    startWatching() {
        this.userIdle.startWatching();
    }

    restart() {
        this.userIdle.resetTimer();
    }

    loadMenu() {

        const content = {
            urlName: 'menu/index',
            body: {
                token: this.tokenUser
            }
        }

        this._generalService.getData(content).subscribe(result => {
            this.menuItems = result['data'];
            localStorage.setItem('default_menu', JSON.stringify(this.menuItems));
        }, error => {
            console.log(error);
            alert('500 - Internal Server Error');
            this.doLogout();
        });
    }

    ngOnDestroy() {
        this.post$.unsubscribe();
    }

    doLogout() {
        // Helpers.setLoading(true);
        this.ngOnDestroy();
        // reset login status
        localStorage.clear();


        this._authService.logout();
    }

}