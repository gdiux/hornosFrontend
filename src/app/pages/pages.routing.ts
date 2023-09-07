import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARDS
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HornosComponent } from './hornos/hornos.component';
import { TermometrosComponent } from './termometros/termometros.component';


// COMPONENTS
const routes: Routes = [
    
    { 
      path: 'dashboard',
      component: PagesComponent,
      canActivate: [AuthGuard],
      children:
      [
        { path: '', component: DashboardComponent, data:{ title: 'Dashboard' } },
        { path: 'perfil/:id', component: PerfilComponent, canActivate: [AdminGuard], data:{ title: 'Perfil' } },
        { path: 'hornos', component: HornosComponent, canActivate: [AdminGuard], data:{ title: 'Hornos' } },
        { path: 'termometros', component: TermometrosComponent, canActivate: [AdminGuard], data:{ title: 'Termometros' } },
        { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard], data:{ title: 'Usuarios' } },
        
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
      ] 
    },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
