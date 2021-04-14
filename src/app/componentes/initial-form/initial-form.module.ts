import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InitialFormPage } from './initial-form.page';
import { ModalTerminosPage } from '../modal-terminos/modal-terminos.page';
import { ModalTerminosPageModule } from '../modal-terminos/modal-terminos.module';
import { PartialsModule } from 'src/app/partials/partials.module';
import { MaterialModule } from 'src/app/partials/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ModalResponsePage } from '../modal-response/modal-response.page';
import { ModalResponsePageModule } from '../modal-response/modal-response.module';


const routes: Routes = [
  {
    path: '',
    component: InitialFormPage
  }
];

@NgModule({
  entryComponents: [
    ModalTerminosPage,
    ModalResponsePage
  ],
  imports: [
    CommonModule,
    CurrencyMaskModule,
    FormsModule,
    IonicModule,
    PartialsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ModalTerminosPageModule,
    ModalResponsePageModule
  ],
  declarations: [InitialFormPage]
})
export class InitialFormPageModule { }
