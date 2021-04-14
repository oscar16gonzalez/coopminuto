import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './componentes/login/login.module#LoginPageModule' },
  { path: 'menu', loadChildren: './componentes/menu/menu.module#Menu1PageModule' },
  { path: 'initial-form', loadChildren: './componentes/initial-form/initial-form.module#InitialFormPageModule' },
  { path: 'evidente', loadChildren: './componentes/evidente/evidente.module#EvidentePageModule' },
  { path: 'requirements', loadChildren: './componentes/requirements/requirements.module#RequirementsPageModule' },
  { path: 'response', loadChildren: './componentes/response/response.module#ResponsePageModule' },
  { path: 'list-credits', loadChildren: './componentes/list-credits/list-credits.module#ListCreditsPageModule' },
  { path: 'calculadora', loadChildren: './componentes/calculadora/calculadora.module#CalculadoraPageModule' },
  { path: 'detail-credit', loadChildren: './componentes/detail-credit/detail-credit.module#DetailCreditPageModule' },
  { path: 'pagare', loadChildren: './componentes/pagare/pagare.module#PagarePageModule' },
  { path: 'documents', loadChildren: './componentes/documents/documents.module#DocumentsPageModule' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
