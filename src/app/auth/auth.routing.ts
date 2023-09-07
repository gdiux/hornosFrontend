import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// COMPONENTS
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    
    { path: 'login', component: LoginComponent, data:{ title: 'Login' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
