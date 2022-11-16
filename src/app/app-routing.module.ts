import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaisesModule } from './paises/paises.module';

const routes: Routes = [
  {
    // lo que pongamos en path es lo que se mostrara en la url pero lo que importa es la ruta relative en el import
    // por tanto podemos poner lo que nos de la gana
    ///////////////////////////////////////////////////////////////////////////////////////////
    // ACORDARSE DE PONER EN EL APP.COMPONENT EL <router-outlet> para ver las paginas del enrutador ///
    ///////////////////////////////////////////////////////////////////////////////////////////
    path: 'selector', 
    // esto carga los modulos hijos de template
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesModule)
  },  
  {
    path:'**',
    redirectTo: 'selector'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
