import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from "./auth/logout/logout.component";
import { RegistrationComponent } from './auth/templates/registration/registration.component';

const routes: Routes = [
    { path: 'index', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'registration', component: RegistrationComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '', redirectTo: 'run-test', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }