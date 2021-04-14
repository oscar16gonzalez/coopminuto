import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



//ANGULAR MATERIAL COMPONENTS

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule, MatSortModule, MatDialogActions, MatDialogContent } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatInputModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatInputModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogActions,
    MatDialogContent,
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [
  ],
})
export class MaterialModule { }
