import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import localEs from '@angular/common/locales/es-CO'
import { registerLocaleData } from '@angular/common'

registerLocaleData(localEs, 'es-CO');

// MODULES
import { NgChartsModule } from 'ng2-charts';
import { PipesModule } from '../pipes/pipes.module';

// COMPONENTS
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HornosComponent } from './hornos/hornos.component';
import { TermometrosComponent } from './termometros/termometros.component';
import { HornoComponent } from './horno/horno.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    PerfilComponent,
    UsuariosComponent,
    HornosComponent,
    TermometrosComponent,
    HornoComponent
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,    
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    NgChartsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
})
export class PagesModule { }
