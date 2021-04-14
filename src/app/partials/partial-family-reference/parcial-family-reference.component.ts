import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';

@Component({
  selector: 'app-parcial-family-reference',
  templateUrl: './parcial-family-reference.component.html',
  styleUrls: ['./parcial-family-reference.component.scss']
})
export class ParcialFamilyReferenceComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() permissions: any[];
  formFamilyReferences: FormGroup;
  numericPattern = '^[0-9]+$';
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  economicActivities$: Observable<any[]>;
  economicActivitiesSection$: Observable<any[]>;

  constructor(private _formBuilder: FormBuilder, private _applicantService: ApplicantService) { }

  ngOnInit() {
    this.getAllActivitiesSections();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('formFamilyReferences')) {
      this.form.addControl('formFamilyReferences', this._formBuilder.group([]));
      this.formFamilyReferences = this.form.get('formFamilyReferences') as FormGroup;
      this.formFamilyReferences.addControl('fullname', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFamilyReferences.addControl('bond', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFamilyReferences.addControl('city', new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFamilyReferences.addControl('homephone', new FormControl('', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern(this.numericPattern)])));
      this.formFamilyReferences.addControl('cellphone', new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(11), Validators.pattern(this.numericPattern)])));
      this.formFamilyReferences.addControl('referenceType', new FormControl('family', Validators.compose([Validators.required])));
    }
  }

  getError(field: string) {
    if (this.formFamilyReferences.get(field).hasError('required')) {
      return 'El campo es requerido';
    }
    if (this.formFamilyReferences.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.formFamilyReferences.get(field).hasError('min')) {
      return 'El valor está por debajo del valor mínimo permitido';
    }
    if (this.formFamilyReferences.get(field).hasError('max')) {
      return 'El valor ingresado supera el valor máximo permitido';
    }
    if (this.formFamilyReferences.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.formFamilyReferences.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitido';
    }
  }
  getAllActivitiesSections() {
    this.economicActivitiesSection$ = this._applicantService.getAllActivitiesSections();
  }
  getEconomicActivitiesBySection(id: string) {
    this.economicActivities$ = this._applicantService.getEconomicActivityBySection(id);
  }
}
