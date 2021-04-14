import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PagarePage } from './pagare.page';
import { SafeHtmlPipe } from 'src/app/pipe/safeUrl.pipe';


const routes: Routes = [
  {
    path: '',
    component: PagarePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PagarePage, SafeHtmlPipe],
})
export class PagarePageModule {}
