import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Applicant } from 'src/entities/applicant';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';
import { ParametricService } from 'src/app/servicios/parametric/parametric.service';
import { Parametrics } from 'src/entities/parametrics';
import { AppDateAdapter } from '../datepickerAdapter';
import { APP_DATE_FORMATS } from '../datepickerAdapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-basic-fields',
  templateUrl: './basic-fields.component.html',
  styleUrls: ['./basic-fields.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class BasicFieldsComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() permissions: any[];
  @Input() typeApplicant: number;
  @Input() document: any;
  @Input() document_type: any;
  @Input() btn: any;
  @Input() basicForm: FormGroup;
  @Input() allowChild: any;

  documentTypes: any;
  validations: any;
  applicant: Applicant;
  parametrics: Parametrics;
  countries$: Observable<any>;
  natalDepartments$: Observable<any>;
  expeditionDepartments$: Observable<any>;
  natalCities$: Observable<any>;
  expeditionCities$: Observable<any>;
  universities$: Observable<any>;
  campuses$: Observable<any>;
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  alphanumericPatter = '^[A-Za-zÀ-ÿ-0-9]+$';
  numericPattern = '^[0-9]+$';
  birthday: Date;
  nationalitySubs: Subscription;
  natalDeptSubs: Subscription;
  expeditionCountrySubs: Subscription;
  expeditionDeptSubs: Subscription;
  universitySubs: Subscription;
  documentTypeSubs: Subscription;
  birthdaySubs: Subscription;
  maxDate: any;
  minDate: any;

  showOtherPlaceNationality = false;

  constructor(
    private formBuilder: FormBuilder,
    private applicantService: ApplicantService,
    private _parametric: ParametricService,
    private dateAdapter: DateAdapter<any>
  ) { }

  ngOnInit() {
   
    this.dateAdapter.setLocale('es');
    this.getCountries();
    this.getAllUniversities();
    this.getMinDate();
    this._parametric.sharedParametric.subscribe(parametric => {
      this.parametrics = parametric;
    });

    this.applicantService.getDocumentTypes().then(documentsType => {
      if (this.typeApplicant === 2) {
        documentsType = documentsType.filter(document => {
          return document.name != 'Tarjeta de Identidad';
        });
      }
      this.documentTypes = documentsType;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('basicData')) {
      this.buildForm();
    }
  }



  buildForm() {
    this.form.addControl('basicData', this.formBuilder.group([]));
    this.basicForm = this.form.get('basicData') as FormGroup;
    this.basicForm.addControl('document_type', new FormControl(this.document_type, Validators.compose([Validators.required])));
    this.basicForm.addControl('document', new FormControl(this.document, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(this.numericPattern)])));
    this.basicForm.addControl('expeditionDate', new FormControl('', Validators.compose([Validators.required])));
    this.basicForm.addControl('expeditionPlaceCountryId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('expeditionPlaceDepartmentId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('expeditionPlaceCityId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('birthday', new FormControl('', Validators.compose([Validators.required])));
    this.basicForm.addControl('nationality', new FormControl('', Validators.compose([Validators.required])));
    this.basicForm.addControl('otherPlaceNationality', new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*')])));
    this.basicForm.addControl('natalDepartment', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
    this.basicForm.addControl('otherDepartment', new FormControl('', Validators.compose([Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*')])));
    this.basicForm.addControl('natalCityId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('university', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
    this.basicForm.addControl('campus', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));

    this.basicForm.addControl('expeditionDate', new FormControl('', Validators.compose([Validators.required])));
    this.basicForm.addControl('expeditionPlaceCountryId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('expeditionPlaceDepartmentId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('expeditionPlaceCityId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('birthday', new FormControl('', Validators.compose([Validators.required])));
    this.basicForm.addControl('nationality', new FormControl('', Validators.compose([Validators.required])));
    this.basicForm.addControl('otherPlaceNationality', new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*')])));
    this.basicForm.addControl('natalDepartment', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
    this.basicForm.addControl('otherDepartment', new FormControl('', Validators.compose([Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*')])));
    this.basicForm.addControl('natalCityId', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])));
    this.basicForm.addControl('university', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
    this.basicForm.addControl('campus', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));

    this.basicForm.addControl('email', new FormControl('', Validators.compose([Validators.required, Validators.pattern('[ÑA-Zña-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'), Validators.minLength(4), Validators.maxLength(70)])));
    this.basicForm.addControl('cellphone', new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)])));
    this.basicForm.addControl('first_name', new FormControl('', Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*'), Validators.minLength(3), Validators.maxLength(45)])));
    this.basicForm.addControl('second_name', new FormControl('', Validators.compose([Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*'), Validators.minLength(3), Validators.maxLength(45)])));
    this.basicForm.addControl('first_lastname', new FormControl('', Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*'), Validators.minLength(3), Validators.maxLength(45)])));
    this.basicForm.addControl('second_lastname', new FormControl('', Validators.compose([Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ ]*'), Validators.minLength(3), Validators.maxLength(45)])));
    this.getErrorMessage();

    if (!this.nationalitySubs) {
      this.nationalitySubs = this.basicForm.get('nationality').valueChanges.subscribe(country => {
        if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
          this.natalDepartments$ = this.getDepartmentsByCountry(country.id);
          if (country.id == '1') {
            this.basicForm.get('otherPlaceNationality').setValue('No otra nacionalidad');
            this.showOtherPlaceNationality = false;
          } else {
            this.basicForm.get('otherPlaceNationality').setValue('');
            this.showOtherPlaceNationality = true;
          }
        }
      });
    }

    if (!this.expeditionCountrySubs) {
      this.expeditionCountrySubs = this.basicForm.get('expeditionPlaceCountryId').valueChanges.subscribe(country => {
        if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
          this.expeditionDepartments$ = this.getDepartmentsByCountry(country.id);
        }
      });
    }

    if (!this.natalDeptSubs) {
      this.natalDeptSubs = this.basicForm.get('natalDepartment').valueChanges.subscribe(department => {
        if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
          this.natalCities$ = this.getCitiesbyState(department.id);
        }
      });
    }

    if (!this.expeditionDeptSubs) {
      this.expeditionDeptSubs = this.basicForm.get('expeditionPlaceDepartmentId').valueChanges.subscribe(department => {
        if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
          this.expeditionCities$ = this.getCitiesbyState(department.id);
        }
      });
    }

    if (!this.universitySubs) {
      this.universitySubs = this.basicForm.get('university').valueChanges.subscribe(universityId => {
        this.getCampusByUniversity(universityId);
      });
    }

    if (!this.birthdaySubs) {
      this.birthdaySubs = this.basicForm.get('birthday').valueChanges.subscribe(date => {
        this.birthday = date;
      });
    }

    if (!this.documentTypeSubs) {
      this.documentTypeSubs = this.basicForm.get('document_type').valueChanges.subscribe(documentType => {
        this.getMinDate();
        if (documentType == 4) {
          this.basicForm.get('document').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern(this.alphanumericPatter)]);
        } else {
          this.basicForm.get('document').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern(this.numericPattern)]);
        }
      });
    }
  }

  ngOndestroy() {
    this.birthdaySubs.unsubscribe;
    this.natalDeptSubs.unsubscribe;
    this.universitySubs.unsubscribe;
    this.nationalitySubs.unsubscribe;
    this.documentTypeSubs.unsubscribe;
  }

  getErrorMessage() {
    this.validations = {
      document_type: [
        { type: 'required', message: 'El tipo de documento es requerido' }
      ],
      document: [
        { type: 'required', message: 'El documento es requerido' },
        { type: 'pattern', message: 'Solo se deben ingresar letras y números' },
        { type: 'min', message: 'El documento debe tener al menos 7 caracteres' },
        { type: 'max', message: 'El documento debe tener máximo 15 caracteres' },
        { type: 'isValidValue', message: 'Los documentos deben ser diferentes' },
      ],
      expeditionDate: [
        { type: 'required', message: 'La fecha de expidición es requerida' },
      ],
      email: [
        { type: 'required', message: 'El correo electrónico es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un correo electrónico válido (ejemplo@ejemplo.com)' },
        { type: 'minlength', message: 'El correo electrónico debe tener al menos 4 caracteres' },
        { type: 'maxlength', message: 'El correo electrónico debe tener máximo 70 caracteres' },
      ],
      cellphone: [
        { type: 'required', message: 'El número celular es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un célular válido' },
        { type: 'minlength', message: 'El celular debe tener al menos 10 caracteres' },
        { type: 'maxlength', message: 'El celular debe tener máximo 10 caracteres' },
      ],
      first_name: [
        { type: 'required', message: 'El primer nombre es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un primer nombre válido' },
        { type: 'minlength', message: 'El primer nombre debe tener al menos 3 caracteres' },
        { type: 'maxlength', message: 'El primer nombre debe tener máximo 45 caracteres' },
      ],
      second_name: [
        { type: 'pattern', message: 'Se debe ingresar un segundo nombre válido' },
        { type: 'minlength', message: 'El segundo nombre debe tener al menos 3 caracteres' },
        { type: 'maxlength', message: 'El segundo nombre debe tener máximo 45 caracteres' },
      ],
      first_lastname: [
        { type: 'required', message: 'El primer apellido es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un primer apellido válido' },
        { type: 'minlength', message: 'El primer apellido debe tener al menos 3 caracteres' },
        { type: 'maxlength', message: 'El primer apellido debe tener máximo 45 caracteres' },
      ],
      second_lastname: [
        { type: 'pattern', message: 'Se debe ingresar un segundo apellido válido' },
        { type: 'minlength', message: 'El segundo apellido debe tener al menos 3 caracteres' },
        { type: 'maxlength', message: 'El segundo apellido debe tener máximo 45 caracteres' },
      ],
      is_owner: [
        { type: 'required', message: 'Este campo es requerido' }
      ],
      is_headline: [
        { type: 'required', message: 'Este campo es requerido' }
      ],
      need_codeudor: [
        { type: 'required', message: 'Este campo es requerido' }
      ]
    };
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  getCountries() {
    this.countries$ = this.applicantService.getAllCountries();
    return this.countries$;
  }

  getDepartmentsByCountry(countryId) {
    return this.applicantService.getStatesByCountry(countryId);
  }

  getCitiesbyState(deparmentId: string,) {
    return this.applicantService.getCitiesByState(deparmentId);
  }

  getAllUniversities() {
    this.universities$ = this.applicantService.getAllUniversities();
  }

  getCampusByUniversity(universityId) {
    this.campuses$ = this.applicantService.getCampusByUniversity(universityId);
  }

  getError(field: string) {
    if (this.basicForm.get(field).hasError('required')) {
      return 'El campo es requerido';
    }
    if (this.basicForm.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.basicForm.get(field).hasError('min')) {
      return 'El valor está por debajo del valor mínimo permitido';
    }
    if (this.basicForm.get(field).hasError('max')) {
      return 'El valor ingresado supera el valor máximo permitido';
    }
    if (this.basicForm.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.basicForm.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitidos';
    }
    if (this.basicForm.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.basicForm.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitidos';
    }
    if (this.basicForm.get(field).hasError('isValidValue')) {
      return 'El documento del deudor y deudor solidario deben ser diferentes';
    }
    if (this.basicForm.get(field).hasError('cellphoneInvalid')) {
      return 'El número celular del deudor y deudor solidario deben ser diferentes';
    }
    if (this.basicForm.get(field).hasError('emailInvalid')) {
      return 'El correo eléctronico del deudor y deudor solidario deben ser diferentes';
    }
  }

  getMinDate() {
    const date = new Date();
    const day = date.getUTCDate() > 9 ? '' : '0';
    const month = date.getMonth() + 1 > 9 ? '' : '0';
    const year = date.getFullYear();
    const minDeudorAge = 13;
    const minCodeudorAge = 18;
    if (this.typeApplicant === 2 || this.basicForm.get('document_type').value != 3) {
      this.minDate = `${year - 67}-${month}${date.getMonth() + 1}-${day}${date.getUTCDate()}`;
      this.maxDate = `${year - minCodeudorAge}-${month}${date.getMonth() + 1}-${day}${date.getUTCDate()}`;
    } else {
      this.minDate = `${year - 80}-${month}${date.getMonth() + 1}-${day}${date.getUTCDate()}`;
      this.maxDate = `${year - minDeudorAge}-${month}${date.getMonth() + 1}-${day}${date.getUTCDate()}`;

    }
  }
}
