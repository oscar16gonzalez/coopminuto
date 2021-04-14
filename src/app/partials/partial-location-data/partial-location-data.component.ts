import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';
import * as alertify from 'alertifyjs';
import { Observable, Subscription } from 'rxjs';

export interface LocationData {
  state: string;
  city: string;
  neighbor: string;
  address: string;
  stratum: number;
  housingType: string;
  livinPlaceTime: number;
  locationType: string;
  homePhone: number;
}

@Component({
  selector: 'app-partial-location-data',
  templateUrl: './partial-location-data.component.html',
  styleUrls: ['./partial-location-data.component.scss']
})
export class PartialLocationDataComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() permissions: any[];
  filteredOptions: Observable<string[]>;
  flteredCountries: Observable<any[]>;
  stratumList: number[] = [1, 2, 3, 4, 5, 6];
  housingTypeList: string[] = ['Propia', 'Arrendada', 'Familiar'];
  relationshipTypes: string[] = ['Estudiante', 'Egresado', 'Empleado', 'Voluntario', 'Exempleado'];
  formPersonalInformation: FormGroup;
  numericPattern = '^[0-9]+$';
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  countries$: Observable<any[]>;
  states$: Observable<any[]>;
  cities$: Observable<any[]>;
  showOnChargePerson = false;
  householderSubscription: Subscription;
  stateSubscription: Subscription;
  countrySubs: Subscription;
  sisbenSubscription: Subscription;

  showOtherPlace = false;





  constructor(private _formBuilder: FormBuilder, private _applicantService: ApplicantService) {
  }

  ngOnInit() {
    this.countries$ = this.getCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('locationData')) {
      this.form.addControl('locationData', this._formBuilder.group([]));
      this.formPersonalInformation = this.form.get('locationData') as FormGroup;
      this.formPersonalInformation.addControl('sisben', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('sisbenlevel', new FormControl(0, Validators.compose([Validators.min(0), Validators.max(99), Validators.pattern(this.numericPattern)])));
      this.formPersonalInformation.addControl('adultsPersonOnCharge', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(this.numericPattern)])));
      this.formPersonalInformation.addControl('minorPersonsOnCharge', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(this.numericPattern)])));
      this.formPersonalInformation.addControl('relationshipType', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('householder', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('countryId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
      this.formPersonalInformation.addControl('stateId', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('cityId', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('otherPlace', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formPersonalInformation.addControl('neighborhood', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formPersonalInformation.addControl('address', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
      this.formPersonalInformation.addControl('stratum', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('housingType', new FormControl('', Validators.compose([Validators.required])));
      this.formPersonalInformation.addControl('livinPlaceTime', new FormControl('', Validators.compose([Validators.min(1), Validators.max(9999), Validators.pattern(this.numericPattern)])));
      this.formPersonalInformation.addControl('homePhone', new FormControl('', Validators.compose([Validators.min(1000000), Validators.max(9999999999), Validators.pattern(this.numericPattern)])));

      if (!this.countrySubs) {
        this.countrySubs = this.formPersonalInformation.get('countryId').valueChanges.subscribe(countryId => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.states$ = this.getDepartmentsByCountry(countryId);
            if (countryId == '1') {
              this.formPersonalInformation.get('otherPlace').setValue('No otra nacionalidad');
              this.showOtherPlace = false;
            } else {
              this.formPersonalInformation.get('otherPlace').setValue('');
              this.showOtherPlace = true;
            }
          }
        });
      }

      if (!this.stateSubscription) {
        this.stateSubscription = this.formPersonalInformation.get('stateId').valueChanges.subscribe(stateId => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.cities$ = this.getCitiesbyState(stateId);
          }
        });
      }

      if (!this.sisbenSubscription) {
        this.sisbenSubscription = this.formPersonalInformation.get('sisben').valueChanges.subscribe(sisbenValue => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (sisbenValue == 2) {
              this.formPersonalInformation.get('sisbenlevel').setValue(0);
            }
          }
        });

      }

      if (!this.householderSubscription) {
        this.householderSubscription = this.formPersonalInformation.get('householder').valueChanges.subscribe(houseHolder => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (houseHolder == 1) {
              this.showOnChargePerson = true;
              this.formPersonalInformation.get('adultsPersonOnCharge').setValue('');
              this.formPersonalInformation.get('minorPersonsOnCharge').setValue('');
            }
            if (houseHolder == 2) {
              this.showOnChargePerson = false;
              this.formPersonalInformation.get('adultsPersonOnCharge').setValue(0);
              this.formPersonalInformation.get('minorPersonsOnCharge').setValue(0);
            }
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.householderSubscription.unsubscribe;
    this.stateSubscription.unsubscribe;
    this.sisbenSubscription.unsubscribe;
  }

  getError(field: string) {
    if (this.formPersonalInformation.get(field).hasError('required')) {
      return 'El campo es requerido';
    }
    if (this.formPersonalInformation.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.formPersonalInformation.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.formPersonalInformation.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitido';
    }
    if (this.formPersonalInformation.get(field).hasError('min')) {
      return 'El valor ingresado es menor al requerido';
    }
    if (this.formPersonalInformation.get(field).hasError('max')) {
      return 'El valor ingresado es superior al permitido';
    }
  }

  getCitiesbyState(stateId: string) {
    return this._applicantService.getCitiesByState(stateId);
  }

  getCountries() {
    return this._applicantService.getAllCountries();
  }

  getDepartmentsByCountry(countryId) {
    return this._applicantService.getStatesByCountry(countryId);
  }

}
