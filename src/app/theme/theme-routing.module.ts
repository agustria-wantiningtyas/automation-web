import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "_index",
                "loadChildren": "./pages/subheader-type-search/index/index.module#IndexModule"
            },
            ////////////////////////// Start Dashboard //////////////////////////
            {
                "path": "run-test",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/run-test/run-test.module#RunTestModule"
            },
            {
                "path": "run-test/detail",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/run-test/run-test-detail/run-test-detail.module#RunTestDetailModule"
            },
            {
                "path": "setting/feature",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/setting/feature/feature.module#FeatureModule"
            },
            {
                "path": "setting/feature/add",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/setting/feature/feature-add/feature-add.module#FeatureAddModule"
            },
            {
                "path": "setting/feature/edit",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/setting/feature/feature-edit/feature-edit.module#FeatureEditModule"
            }, {
                "path": "setting/test-case",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/setting/testCase/test-case.module#TestCaseModule"
            },
            {
                "path": "setting/test-case/add",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/setting/testCase/test-case-add/test-case-add.module#TestCaseAddModule"
            },
            {
                "path": "setting/test-case/edit",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/setting/testCase/test-case-edit/test-case-edit.module#TestCaseEditModule"
            },
            {
                "path": "report",
                // "canActivateChild": [AuthGuard],
                "loadChildren": "./pages/default/report/report.module#ReportModule"
            },
            {
                "path": "inner",
                "loadChildren": "./pages/default/inner/inner.module#InnerModule"
            },
            {
                "path": "profile",
                "loadChildren": "./pages/default/profile/profile.module#ProfileModule"
            },
            {
                "path": "401",
                "loadChildren": "./pages/default/not-authorized/not-authorized.module#NotAuthorizedModule"
            },
            {
                "path": "403",
                "loadChildren": "./pages/default/access-denied/access-denied.module#AccessDeniedModule"
            },
            {
                "path": "404",
                "loadChildren": "./pages/default/not-found/not-found.module#NotFoundModule"
            },
            {
                "path": "maintenance",
                "loadChildren": "./pages/default/maintenance/maintenance.module#MaintenanceModule"
            },
            {
                "path": "",
                "redirectTo": "run-test",
                "pathMatch": "full"
            }
        ]
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }