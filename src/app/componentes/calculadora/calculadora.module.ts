import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalculadoraPage } from './calculadora.page';
import { MaterialModule } from 'src/app/partials/material.module';

const routes: Routes = [
  {
    path: '',
    component: CalculadoraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CalculadoraPage]
})
export class CalculadoraPageModule {}
