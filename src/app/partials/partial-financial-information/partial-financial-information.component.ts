import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-partial-financial-information',
  templateUrl: './partial-financial-information.component.html',
  styleUrls: ['./partial-financial-information.component.scss']
})

export class PartialFinancialInformationComponent {
  @Input() form: FormGroup;
  @Input() permissions: any[];
  salary: number;
  othersIncomming: number;
  totalIncomming: number = 0;
  personalExpenses: number;
  creditExpenses: number;
  othersExpenses: number;
  totalExpenses: number = 0;
  rentalIncome: number;
  formFinancialDetails: FormGroup;
  numericPattern = '^[0-9]+$';
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  currencyPattern = '^[0-9]+$';
  hiddenData: boolean = false;
  publicPersonField = false;
  salaryTemp: 'Salario';
  salarySubuscription: Subscription;
  rentalSubscription: Subscription;
  othersIncommingSubscription: Subscription;
  personalExpensesSubscription: Subscription;
  creditExpensesSubscription: Subscription;
  otherExpensesSubscription: Subscription;
  documentSubscription: Subscription;
  familyPublicPersonSubscription: Subscription;
  sectionSubscription: Subscription;
  constructor(private _formbuilder: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('financialInformation')) {
      this.form.addControl('financialInformation', this._formbuilder.group([]));
      this.formFinancialDetails = this.form.get('financialInformation') as FormGroup;
      this.formFinancialDetails.addControl('salary', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('rentalIncome', new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('othersIncomming', new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('othersIncommingDescription', new FormControl('No registra', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFinancialDetails.addControl('totalIncomming', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('personalExpenses', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('creditExpenses', new FormControl(0, Validators.compose([Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('othersExpenses', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('othersExpensesDescription', new FormControl('No registra', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFinancialDetails.addControl('totalExpenses', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('assets', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('liabilities', new FormControl('', Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999)])));
      this.formFinancialDetails.addControl('abroadOperation', new FormControl('', Validators.compose([Validators.required])));
      this.formFinancialDetails.addControl('abroadAccountMoney', new FormControl('', Validators.compose([Validators.required])));
      this.formFinancialDetails.addControl('publicEmployed', new FormControl('', Validators.compose([Validators.required])));
      this.formFinancialDetails.addControl('publicPerson', new FormControl('', Validators.compose([Validators.required])));
      this.formFinancialDetails.addControl('familyPublicPerson', new FormControl('', Validators.compose([Validators.required])));
      this.formFinancialDetails.addControl('familyPublicName', new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFinancialDetails.addControl('familyRelationship', new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));
      this.formFinancialDetails.addControl('incomeSource', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.onlyLettersPattern)])));

      if (!this.salarySubuscription) {
        this.salarySubuscription = this.formFinancialDetails.get('salary').valueChanges.subscribe(salary => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.salary = salary;
            this.getTotalIncommig();
          }
        });
      }

      if (!this.rentalIncome) {
        this.rentalSubscription = this.formFinancialDetails.get('rentalIncome').valueChanges.subscribe(rentalIncome => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.rentalIncome = rentalIncome;
            this.getTotalIncommig();
          }
        });
      }

      if (!this.othersIncommingSubscription) {
        this.othersIncommingSubscription = this.formFinancialDetails.get('othersIncomming').valueChanges.subscribe(othersIncome => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.othersIncomming = othersIncome;
            this.getTotalIncommig();
            if (othersIncome == 0) {
              this.formFinancialDetails.get('othersIncommingDescription').setValue('No registra');
            } else {
              this.formFinancialDetails.get('othersIncommingDescription').setValue('');
            }
          }
        });
      }

      if (!this.sectionSubscription) {
        if (this.form.get('laborDetails')) {
          this.sectionSubscription = this.form.get('laborDetails').get('economicActivitySection').valueChanges.subscribe(section => {
            if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
              if (section >= 1 && section <= 3) {
                this.formFinancialDetails.get('salary').setValue(0);
                this.formFinancialDetails.get('totalIncomming').setValue(0);
              }
              if (section > 3) {
                this.formFinancialDetails.get('salary').setValue(0)
              }
            }
          });
        }

      }

      if (!this.personalExpensesSubscription) {
        this.personalExpensesSubscription = this.formFinancialDetails.get('personalExpenses').valueChanges.subscribe(personalExpe => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.personalExpenses = personalExpe;
            this.getTotalExpenses();
          }
        });
      }

      if (!this.creditExpensesSubscription) {
        this.creditExpensesSubscription = this.formFinancialDetails.get('creditExpenses').valueChanges.subscribe(creditExpe => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            this.creditExpenses = creditExpe;
            this.getTotalExpenses();
          }
        });
      }

      if (!this.otherExpensesSubscription) {
        this.otherExpensesSubscription = this.formFinancialDetails.get('othersExpenses').valueChanges.subscribe(otherExpe => {
          this.othersExpenses = otherExpe;
          this.getTotalExpenses();
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (otherExpe == 0) {
              this.formFinancialDetails.get('othersExpensesDescription').setValue('No registra');
            } else {
              this.formFinancialDetails.get('othersExpensesDescription').setValue('');
            }
          }
        });
      }

      if (!this.othersIncommingSubscription) {
        this.othersIncommingSubscription = this.formFinancialDetails.get('othersIncomming').valueChanges.subscribe(othersIncoValue => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (othersIncoValue == 0) {
              this.formFinancialDetails.get('othersIncommingDescription').setValue('No registra');
            } else {
              this.formFinancialDetails.get('othersIncommingDescription').setValue('');
            }
          }
        });
      }

      if (!this.documentSubscription) {
        this.documentSubscription = this.form.get('basicData').get('document_type').valueChanges.subscribe(document => {
          if (document === 3) {
            this.formFinancialDetails.get('salary').setValue(0);
            this.hiddenData = true;
          } else {
            this.hiddenData = false;
          }
        });
      }

      if (!this.familyPublicPersonSubscription) {
        this.familyPublicPersonSubscription = this.formFinancialDetails.get('familyPublicPerson').valueChanges.subscribe(familyPublic => {
          if (this.form.status != 'DISABLED' && this.form.status != 'VALID') {
            if (familyPublic == 2) {
              this.publicPersonField = false;
              this.formFinancialDetails.get('familyPublicName').setValue('NO FAMILIY PUBLIC');
              this.formFinancialDetails.get('familyRelationship').setValue('NO FAMILIY PUBLIC');
            } if (familyPublic == 1) {
              this.formFinancialDetails.get('familyPublicName').setValue('');
              this.formFinancialDetails.get('familyRelationship').setValue('');
              this.publicPersonField = true;
            }
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.salarySubuscription.unsubscribe;
    this.rentalSubscription.unsubscribe;
    this.othersIncommingSubscription.unsubscribe;
    this.personalExpensesSubscription.unsubscribe;
    this.creditExpensesSubscription.unsubscribe;
    this.otherExpensesSubscription.unsubscribe;
    this.othersIncommingSubscription.unsubscribe;
    this.documentSubscription.unsubscribe;
    this.familyPublicPersonSubscription.unsubscribe;
  }

  getError(field: string) {
    if (this.formFinancialDetails.get(field).hasError('required')) {
      return 'El campo es requerido';
    }
    if (this.formFinancialDetails.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.formFinancialDetails.get(field).hasError('min')) {
      return 'El valor está por debajo del valor mínimo permitido';
    }
    if (this.formFinancialDetails.get(field).hasError('max')) {
      return 'El valor ingresado supera el valor máximo permitido';
    }
    if (this.formFinancialDetails.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.formFinancialDetails.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitido';
    }
  }

  getTotalIncommig() {
    let tempTotalIncomming = 0;
    if (this.salary != null) {
      tempTotalIncomming += this.salary
    }

    if (this.othersIncomming != null) {
      tempTotalIncomming += this.othersIncomming;
    }

    if (this.rentalIncome != null) {
      tempTotalIncomming += this.rentalIncome;

    }
    this.formFinancialDetails.get('totalIncomming').setValue(tempTotalIncomming)
  }

  getTotalExpenses() {
    let tempTotalExpenses = 0;
    if (this.personalExpenses != null) {
      tempTotalExpenses += this.personalExpenses;
    }
    if (this.creditExpenses != null) {
      tempTotalExpenses += this.creditExpenses;
    }
    if (this.othersExpenses != null) {
      tempTotalExpenses += this.othersExpenses;
    }
    this.formFinancialDetails.get('totalExpenses').setValue(tempTotalExpenses);
  }
}
