import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';

@Component({
  selector: 'app-partial-personal-reference',
  templateUrl: './partial-personal-reference.component.html',
  styleUrls: ['./partial-personal-reference.component.scss']
})
export class PartialPersonalReferenceComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() permissions: any[];
  formPersonalReferences: FormGroup;
  numericPattern = '^[0-9]+$';
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  economicActivities$: Observable<any[]>;
  economicActivitiesSection$: Observable<any[]>;


  constructor(private _formBuilder: FormBuilder, private _applicantService: ApplicantService) { }

  ngOnInit() {
    this.getAllActivitiesSections();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('formPersonalReferences')) {
      this.form.addControl('formPersonalReferences', this._formBuilder.group([]));
      this.formPersonalReferences = this.form.get('formPersonalReferences') as FormGroup;
      this.formPersonalReferences.addControl('fullname', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formPersonalReferences.addControl('bond', new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formPersonalReferences.addControl('city', new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formPersonalReferences.addControl('homephone', new FormControl('', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern(this.numericPattern)])));
      this.formPersonalReferences.addControl('cellphone', new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(11), Validators.pattern(this.numericPattern)])));
      this.formPersonalReferences.addControl('referenceType', new FormControl('personal', Validators.compose([Validators.required])));
    }
  }

  getError(field: string) {
    if (this.formPersonalReferences.get(field).hasError('required')) {
      return 'El campo es requerido';
    }
    if (this.formPersonalReferences.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.formPersonalReferences.get(field).hasError('min')) {
      return 'El valor está por debajo del valor mínimo permitido';
    }
    if (this.formPersonalReferences.get(field).hasError('max')) {
      return 'El valor ingresado supera el valor máximo permitido';
    }
    if (this.formPersonalReferences.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.formPersonalReferences.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitido';
    }
  }
  getAllActivitiesSections() {
    this.economicActivitiesSection$ = this._applicantService.getAllActivitiesSections();
  }
  getEconomicActivitiesBySection(sectionId: string) {
    this.economicActivities$ = this._applicantService.getEconomicActivityBySection(sectionId);
  }
}
