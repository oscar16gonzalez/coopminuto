import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DynamicAttributesComponent } from './dynamic-attributes/dynamic-attributes.component';
import { MaterialModule } from './material.module';
import { ApplicantFormComponent } from './applicant-form/applicant-form.component';
import { BasicFieldsComponent } from './basic-fields/basic-fields.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialLaborDetailsComponent } from './partial-labor-details/partial-labor-details.component';
import { PartialFinancialInformationComponent } from './partial-financial-information/partial-financial-information.component';
import { PartialLocationDataComponent } from './partial-location-data/partial-location-data.component';
import { PartialPersonalReferenceComponent } from './partial-personal-reference/partial-personal-reference.component';
import { ParcialFamilyReferenceComponent } from './partial-family-reference/parcial-family-reference.component';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { PartialTextDynamicAffiliationRenovationComponent } from './partial-text-dynamic-affiliation-renovation/partial-text-dynamic-affiliation-renovation.component';
import { PartialTextOutstandingBalanceComponent } from './partial-text-outstanding-balance/partial-text-outstanding-balance.component';



@NgModule({
  declarations: [
    DynamicAttributesComponent,
    ApplicantFormComponent,
    BasicFieldsComponent,
    PartialLaborDetailsComponent,
    PartialFinancialInformationComponent,
    PartialLocationDataComponent,
    PartialPersonalReferenceComponent,
    ParcialFamilyReferenceComponent,
    PartialTextOutstandingBalanceComponent,
    DynamicFormsComponent,
    PartialTextDynamicAffiliationRenovationComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CurrencyMaskModule
  ],
  exports: [
    DynamicAttributesComponent,
    ApplicantFormComponent,
    BasicFieldsComponent,
    PartialLaborDetailsComponent,
    PartialFinancialInformationComponent,
    PartialLocationDataComponent,
    PartialPersonalReferenceComponent,
    ParcialFamilyReferenceComponent,
    PartialTextOutstandingBalanceComponent,
    DynamicFormsComponent,
    PartialTextDynamicAffiliationRenovationComponent
  ]
})
export class PartialsModule { }
