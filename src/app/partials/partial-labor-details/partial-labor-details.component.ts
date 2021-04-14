import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AppDateAdapter } from '../datepickerAdapter';
import { APP_DATE_FORMATS } from '../datepickerAdapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';
import { Observable, from, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { format } from 'url';
import * as moment from 'moment';


@Component({
  selector: 'app-partial-labor-details',
  templateUrl: './partial-labor-details.component.html',
  styleUrls: ['./partial-labor-details.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PartialLaborDetailsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() permissions: any[];
  @Input() typeApplicant: number;
  constructor(
    private _formBuilder: FormBuilder,
    private _applicantService: ApplicantService,
    private dateAdapter: DateAdapter<any>
  ) { }
  formlaboralDetails: FormGroup;
  economicActivitiesSection: any[];
  economicActivities$: Observable<any[]>;
  numericPattern = '^[0-9]+$';
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  textwithdotPattern = '^[A-Za-zÀ-ÿ ]+.$';
  contractsList = ['TERMINO INDEFINIDO', 'TERMINO FIJO', 'PRESTACION DE SERVICIOS',
    'OBRA LABOR', 'HONORARIOS', 'LIBRE NOMBRAMIENTO Y REMOCION',
    'CARRERA ADMINISTRATIVA', 'FREELANCE'
  ];
  currentDay = new Date;
  hiddenData: boolean = false;
  department$: Observable<any[]>;
  cities$: Observable<any[]>;
  departmentId: string;
  showEmployedState: boolean = false;
  departmentSubscription: Subscription;
  economicActivitySectionSubscription: Subscription;

  ngOnInit() {
    this.dateAdapter.setLocale('es');
    this.getAllDepartments();
    this.getAllActivitiesSections();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('laborDetails')) {
      this.form.addControl('laborDetails', this._formBuilder.group([]));
      this.formlaboralDetails = this.form.get('laborDetails') as FormGroup;
      this.formlaboralDetails.addControl('economicActivitySection', new FormControl('', Validators.compose([Validators.required])));
      this.formlaboralDetails.addControl('economicActivity', new FormControl('', Validators.compose([Validators.required])));
      this.formlaboralDetails.addControl('employedState', new FormControl(1, Validators.compose([Validators.required])));
      this.formlaboralDetails.addControl('companyPosition', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formlaboralDetails.addControl('companyName', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
      this.formlaboralDetails.addControl('companyPhone', new FormControl('', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern(this.numericPattern)])));
      this.formlaboralDetails.addControl('extension', new FormControl('', Validators.compose([Validators.minLength(0), Validators.maxLength(10), Validators.pattern(this.numericPattern)])));
      this.formlaboralDetails.addControl('companyAddress', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])));
      this.formlaboralDetails.addControl('department', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])));
      this.formlaboralDetails.addControl('otherDepartment', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formlaboralDetails.addControl('city', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])));
      this.formlaboralDetails.addControl('contractType', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formlaboralDetails.addControl('admissionDate', new FormControl(''));
      this.formlaboralDetails.addControl('activityTime', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999), Validators.pattern(this.numericPattern)])));

      if (!this.departmentSubscription) {
        this.departmentSubscription = this.formlaboralDetails.get('department').valueChanges.subscribe(department => {
          this.departmentId = this.formlaboralDetails.get('department').value.id;
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (department.id == 34) {
              this.formlaboralDetails.get('otherDepartment').setValue('');
            } else {
              this.formlaboralDetails.get('otherDepartment').setValue('No departamento');
              this.getCitiesbyState(this.departmentId);
            }
          }
        });
      }

      if (!this.economicActivitySectionSubscription) {
        this.economicActivitySectionSubscription = this.form.get('laborDetails').get('economicActivitySection').valueChanges.subscribe(section => {
          if (section >= 1 && section <= 3) {
            this.showEmployedState = false;
            this.hiddenData = true;
            this.form.get('laborDetails').get('companyName').setValue('No Aplica');
            this.form.get('laborDetails').get('companyPosition').setValue('No Aplica');
            this.form.get('laborDetails').get('companyPhone').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern(this.numericPattern)]);
            this.form.get('laborDetails').get('companyPhone').setValue('No Aplica');
            this.form.get('laborDetails').get('extension').setValue('0');
            this.form.get('laborDetails').get('companyAddress').setValue('No Aplica');
            this.form.get('laborDetails').get('department').setValue('Otro');
            this.form.get('laborDetails').get('otherDepartment').setValue('No aplica');
            this.form.get('laborDetails').get('city').setValue('No aplica');
            this.form.get('laborDetails').get('contractType').setValue('No aplica');
            this.form.get('laborDetails').get('admissionDate').setValue(this.getToday());
            this.form.get('laborDetails').get('activityTime').setValue('0');
            this.form.get('laborDetails').get('employedState').setValue(1);

          } else {
            this.hiddenData = false;
          }
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (section > 3) {
              this.showEmployedState = true;
              this.form.get('laborDetails').get('companyName').setValue('');
              this.form.get('laborDetails').get('employedState').setValue('');
              this.form.get('laborDetails').get('companyPosition').setValue('');
              this.form.get('laborDetails').get('companyPhone').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern(this.numericPattern) ]);
              this.form.get('laborDetails').get('companyPhone').setValue('');
              this.form.get('laborDetails').get('extension').setValue('');
              this.form.get('laborDetails').get('companyAddress').setValue('');
              this.form.get('laborDetails').get('department').setValue('');
              this.form.get('laborDetails').get('otherDepartment').setValue('');
              this.form.get('laborDetails').get('city').setValue('');
              this.form.get('laborDetails').get('contractType').setValue('');
              this.form.get('laborDetails').get('admissionDate').setValue('');
              this.form.get('laborDetails').get('activityTime').setValue('');
            }
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe;
    this.economicActivitySectionSubscription.unsubscribe;
  }

  getError(field: string) {
    if (this.formlaboralDetails.get(field).hasError('required')) {
      return `El campo es requerido`;
    }
    if (this.formlaboralDetails.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.formlaboralDetails.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.formlaboralDetails.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres';
    }
    if (this.formlaboralDetails.get(field).hasError('min')) {
      return 'El valor está por debajo del valor mínimo permitido';
    }
    if (this.formlaboralDetails.get(field).hasError('max')) {
      return 'El valor ingresado supera el valor máximo permitido';
    }
  }

  getFinancialActivitiesSections() {
    this._applicantService.getAllActivitiesSections();
  }

  getAllEconomicActivities() {
    this.economicActivities$ = this._applicantService.getAllEconomicActivities();
    return this.economicActivities$;
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  getAllActivitiesSections() {
    this._applicantService.getAllActivitiesSections().subscribe(economicSections => {
      if (this.typeApplicant === 2) {
        economicSections = economicSections.filter(section => {
          return section.section_name != 'Sección 0' && section.section_name != 'Sección 1'
        })
      }
      this.economicActivitiesSection = economicSections;
    });
  }
  getEconomicActivitiesBySection(sectionId: string) {
    this.economicActivities$ = this._applicantService.getEconomicActivityBySection(sectionId);
  }

  getAllDepartments() {
    this.department$ = this._applicantService.getAllDepartments();
  }

  getCitiesbyState(stateId: string) {
    if (stateId && stateId !== '') {
      this.cities$ = this._applicantService.getCitiesByState(stateId);
      return this.cities$;
    } else if (stateId === '') {
      alert('Debes seleccionar un Departamento');
      return false;
    }
  }
}
