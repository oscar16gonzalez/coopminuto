import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AppDateAdapter } from '../datepickerAdapter';
import { APP_DATE_FORMATS } from '../datepickerAdapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dynamic-attributes',
  templateUrl: './dynamic-attributes.component.html',
  styleUrls: ['./dynamic-attributes.component.scss'],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class DynamicAttributesComponent implements OnInit {

  @Input() parametrics: any;
  @Input() form: FormGroup;
  @Input() showAgreement: boolean;
  @Input() agreements: any;
  @Input() termList: any;
  @Input() totalMonthlyFixedFee: any;
  @Input() taxes: any;
  @Input() montTotal: number;
  @Input() productSelectValue: string;
  @Input() existCygnus = false;
  @Input() category: any;
  @Input() renovationTerm: number;
  productTypeId: number;
  validations: any = {};
  educativeValidations: any = {};
  myShowAgreement: SimpleChange;
  total_first_fee: number;
  findTaxRateMV: any;
  interest: number;
  interestRate: number;
  highInterestTerm: number;
  monthlyFee;
  findTaxCreditStudy: any;
  findTaxSafeXThousand: any;
  findTaxContributionsFrom: any;
  creditStudy;
  safeXThousand: number;
  contributionsFrom;
  advanceFixedCosts: number;
  findTaxGuarantee: any;
  guarantee: any;
  guaranteeValue: any;
  guaranteeValueVat: any;
  vat = 1.19;
  fixedFeeAndFixedCosts;
  interestPorcentage;
  plazo: number;
  findFundGuarantee: any;
  totalGuarantee: number;
  fundGuaranteeValue: number;
  findCommunityGuarantee: any;
  communityGuaranteeValue: number;
  totalcommunityGuarantee: number;
  findAntioquiaGuarantee: any;
  antioquiaGuaranteeValue: number;
  totalAntioquiaGuarantee: number;
  totalSafeXThousand: number;
  totalEducative: number;
  findAfiliationEducative: any;
  afiliationEducative: number;
  interestPercent: number;
  hidden = true;
  selectTerm = false;
  onlyLettersPattern = '^[A-Za-zÀ-ÿ ]+$';
  numericPattern = '^[0-9]+$';
  alphanumericPatter = '^[A-Za-zÀ-ÿ-0-9]+$';
  currentMonth;
  months = [
    'Enero', 'Febrero', 'Marzo',
    'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre',
    'Octubre', 'Noviembre', 'Diciembre'
  ];
  renovationPeriods = [2, 3, 4, 5, 6, 7, 8, 9];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  radioGroup = [
    {
      value: 5,
      disabled: true
    },
    {
      value: 10,
      disabled: true
    },
    {
      value: 20,
      disabled: true
    },
    {
      value: 25,
      disabled: true
    }
  ];

  constructor(private alertCtrl: AlertController, public formBuilder: FormBuilder, public barcodeScanner: BarcodeScanner) { }

  ngOnInit() {

    this.form.controls.productTypeId.valueChanges.subscribe(productTypeId => {
      this.productTypeId = productTypeId;
      this.loadAttributes();
    });
    this.getCurrentMonth();
    this.hidden = true;
  }

  loadAttributes() {
    this.form.addControl('agreementId', new FormControl(''));

    this.form.addControl('term', new FormControl('', Validators.compose([Validators.required])));
    this.form.addControl('fixedFeeAndFixedCosts', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('monthlyFee', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('interestPercent', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('guaranteeValueVat', new FormControl(0, Validators.compose([Validators.maxLength(12)])));
    this.form.addControl('totalGuarantee', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('creditStudy', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('totalAntioquiaGuarantee', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('afiliationEducative', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('totalcommunityGuarantee', new FormControl(0, Validators.compose([Validators.required])));
    this.form.addControl('totalSafeXThousand', new FormControl(0, Validators.compose([Validators.required])));

    this.getErrorMessage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.category) {
      if (this.category.identifier === 'renovation') {
        if (this.termList[1]) {
          this.form.setControl('term', this.formBuilder.control(this.termList[1].id));
          this.selectPlazo('1 mes(es)');
        }
        const newTerm = this.termList.find(o => o.term === `${this.renovationTerm} mes(es)`);
        if (newTerm) {
          this.form.setControl('term', this.formBuilder.control(newTerm.id, [Validators.required]));
          this.selectPlazo(`${this.renovationTerm} mes(es)`);
        }
        this.hidden = true;
        this.selectTerm = true;
      } else if ((this.category.identifier === 'afiliation' || this.category.identifier === 'icetex')) {
        if (this.termList[1]) {
          this.form.setControl('term', this.formBuilder.control(this.termList[1].id, [Validators.required]));
          this.selectPlazo('1 mes(es)');
        }
        this.hidden = true;
        this.selectTerm = true;
      } else if (this.category.identifier !== 'afiliation' || this.category.identifier !== 'renovation') {

        this.hidden = false;
        this.selectTerm = false;
      }
    }

    if (changes.showAgreement && changes.showAgreement.currentValue) {
      this.myShowAgreement = changes.showAgreement.currentValue;
      if (this.myShowAgreement) {
        this.form.get('agreementId').setValidators(Validators.required);
      } else {
        this.form.get('agreementId').clearValidators();
      }
    }

    if (this.productTypeId >= 7 && this.productTypeId <= 15) {
      this.form.addControl('monthlyPayment', new FormControl(''));
      this.form.addControl('program', new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])));
      this.form.addControl('semester', new FormControl('', Validators.compose([Validators.min(1)])));
      this.form.addControl('receiptNumber', new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(this.alphanumericPatter)])));
      this.form.addControl('firstStudentCode', new FormControl('', Validators.compose([Validators.required, , Validators.minLength(3), Validators.max(99999999999999999999), Validators.pattern(this.numericPattern)])));
      this.form.addControl('secondStudentCode', new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.max(99999999999999999999), Validators.pattern(this.numericPattern)])));
      if (this.productTypeId != 8 && this.productTypeId != 15) {
        this.form.addControl('initialMonth', new FormControl('', Validators.compose([Validators.required])));
        this.form.addControl('programDuration', new FormControl(''));
        this.form.addControl('paymentDate', new FormControl('', Validators.compose([Validators.required])));
      }
      if ((this.productTypeId >= 9 && this.productTypeId <= 14) || this.productTypeId == 7) {
        this.form.addControl('contributions', new FormControl(15000, Validators.compose([Validators.required, Validators.min(15000)])));
      } else {
        this.form.addControl('contributions', new FormControl(0, Validators.compose([Validators.required, Validators.min(0)])));
      }
      if (this.productTypeId == 8 || this.productTypeId == 15) {
        this.form.addControl('RenovationPeriod', new FormControl(''));
        this.form.addControl('semester', new FormControl(0));

      } else {
        this.form.addControl('semester', new FormControl('', Validators.compose([Validators.min(1)])));
      }
      this.educativeFieldsMessages();
    } else {
      this.form.removeControl('monthlyPayment');
      this.form.removeControl('initialMonth');
      this.form.removeControl('program');
      this.form.removeControl('programDuration');
      this.form.removeControl('semester');
      this.form.removeControl('receiptNumber');
      this.form.removeControl('paymentDate');
      this.form.removeControl('firstStudentCode');
      this.form.removeControl('secondStudentCode');
      this.form.removeControl('contributions');
      this.form.removeControl('RenovationPeriod');
    }

    if (changes['montTotal']) {
      this.montTotal = this.montTotal;
    }
    if (changes['taxes']) {
      this.taxes = this.taxes;
    }
    if (changes['productSelectValue']) {
      this.productSelectValue = this.productSelectValue;
    }
    if (changes['existCygnus']) {
      this.existCygnus = this.existCygnus;
    }
    if (this.plazo || this.plazo > 0) {
      this.generateTax();
    }
  }

  educativeFieldsMessages() {
    this.educativeValidations = {
      initialMonth: [
        { type: 'required', message: 'El mes de inicio es requerido' }
      ],
      program: [
        { type: 'minlength', message: 'El programa debe tener mínimo 3 carácteres' },
        { type: 'maxlength', message: 'El programa debe tener máximo 50 carácteres' },
        { type: 'pattern', message: 'Los caracteres ingresados no son válidos para este campo' }
      ],
      semester: [
        { type: 'minlength', message: 'El semestre mínimo es 1' },
      ],
      receiptNumber: [
        { type: 'required', message: 'El número de recibo es requerido' },
        { type: 'minlength', message: 'El número de recibo debe tener mínimo 1 caracter' },
        { type: 'pattern', message: 'Los caracteres ingresados no son válidos para este campo' }
      ],
      paymentDate: [
        { type: 'required', message: 'La fecha de pago es requerida' },
      ],
      firstStudentCode: [
        { type: 'required', message: 'El código de estudiante es requerido' },
        { type: 'minlength', message: 'El código de estudiante debe tener mínimo 3 carácteres' },
        { type: 'max', message: 'El código de estudiante debe tener máximo 20 carácteres' },
        { type: 'pattern', message: 'Los caracteres ingresados no son válidos para este campo' }
      ],
      secondStudentCode: [
        { type: 'required', message: 'El código de estudiante es requerido' },
        { type: 'minlength', message: 'El código de estudiante debe tener mínimo 3 carácteres' },
        { type: 'max', message: 'El código de estudiante debe tener máximo 20 carácteres' },
        { type: 'pattern', message: 'Los caracteres ingresados no son válidos para este campo' }
      ],
      contributions: [
        { type: 'required', message: 'El valor de aportes es requerido' },
        { type: 'min', message: 'El valor de aportes debe ser mínimo $15000' }
      ],
    }
  }

  getErrorMessage() {
    this.validations = {
      agreementId: [
        { type: 'required', message: `Se debe proporcionar un valor para convenio` }
      ],
      term: [
        { type: 'required', message: `Se debe proporcionar un valor para plazo` }
      ]
    };
  }
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDate();
    const currentDate = this.getToday().split('-');
    const currentDay = parseInt(currentDate[2]);
    return (currentDay + 3 < 5 && day == 5) || (currentDay + 3 < 10 && day == 10) || (currentDay + 3 < 20 && day == 20) || (currentDay + 3 < 25 && day == 25);
  }

  monthChange(month) {
    const currentDay = new Date().getDate()
    this.form.get('paymentDate').setValue('');
    if (month.value === month.source.options.first.value) {
      this.radioGroup.forEach(radio => {
        radio.disabled = currentDay + 3 > radio.value;
      });
    } else {
      this.radioGroup.forEach(radio => {
        radio.disabled = false;
      });
    }
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  getCurrentMonth() {
    const currentDay = new Date();
    this.currentMonth = `${((currentDay.getMonth() + 1))}`;
  }

  selectPlazo(event) {
    if (event.source) {
      this.plazo = parseInt(event.source.triggerValue.split(' ')[0]);
    } else {
      this.plazo = parseInt(event.split(' ')[0]);
    }
    this.generateTax();
  }


  generateTax() {
    if (this.taxes.length > 0) {
      this.calculateMonthlyfee();
      this.calculateGuaranteeValueVat();
      this.calculateAdvanceFixedCosts();
      this.calculateGuarantee();
      this.calculateCommunityGuarantee();
      this.calculateAntioquiaGuarantee();
      this.calculateEducativoEmpleado();
      this.calculateFixedFeeAndFixedCosts();
      this.calculateInterest();
    }
  }

  calculateMonthlyfee() {
    this.findTaxRateMV = this.taxes.find(element => element.identifier === 'rate_mv_percentage');
    if (this.findTaxRateMV) {
      this.interestPercent = this.findTaxRateMV.pivot.value;
      this.interest = this.interestPercent / 100;
      this.interestRate = 1 + (this.interest);
      this.highInterestTerm = Math.pow(this.interestRate, this.plazo);
      this.monthlyFee = Math.round(this.montTotal * ((this.interest * this.highInterestTerm) / (this.highInterestTerm - 1)));
    } else {
      this.interestRate = 0;
      this.highInterestTerm = 0;
      this.monthlyFee = 0;
      this.interestPercent = 0;
    }
    this.form.get('interestPercent').setValue(this.interestPercent);
    this.form.get('monthlyFee').setValue(this.monthlyFee);
  }

  calculateGuaranteeValueVat() {
    this.findTaxGuarantee = this.taxes.find(element => element.identifier === 'guarantee_percentage');
    if (this.findTaxGuarantee) {
      this.guarantee = this.findTaxGuarantee.pivot.value / 100;
      this.guaranteeValue = this.montTotal * this.guarantee;
      this.guaranteeValueVat = Math.round(this.guaranteeValue * this.vat);
    } else {
      this.guarantee = 0;
      this.guaranteeValue = 0;
      this.guaranteeValueVat = 0;
    }
    this.form.get('guaranteeValueVat').setValue(this.guaranteeValueVat);
  }


  calculateAdvanceFixedCosts() {
    this.findTaxCreditStudy = this.taxes.find(element => element.identifier === 'credit_study');
    this.findTaxSafeXThousand = this.taxes.find(element => element.identifier === 'insurance_percentage_x_every_one_thousand');
    this.findTaxContributionsFrom = this.taxes.find(element => element.identifier === 'minimum_contributions');
    if (this.findTaxCreditStudy || this.findTaxContributionsFrom || this.findTaxSafeXThousand) {
      this.creditStudy = this.findTaxCreditStudy ? this.findTaxCreditStudy.pivot.value : 0;
      this.safeXThousand = this.findTaxSafeXThousand ? this.findTaxSafeXThousand.pivot.value : 0;
      this.totalSafeXThousand = this.findTaxSafeXThousand ? Math.round(this.montTotal / 1000) * this.safeXThousand : 0;
      this.advanceFixedCosts = Math.round(this.guaranteeValueVat + this.creditStudy + this.totalSafeXThousand);
      this.contributionsFrom = this.findTaxContributionsFrom.pivot.value;
    } else {
      this.creditStudy = 0;
      this.safeXThousand = 0;
      this.contributionsFrom = 0;
      this.advanceFixedCosts = 0;
      this.totalSafeXThousand = 0;
    }
    this.form.get('totalSafeXThousand').setValue(this.totalSafeXThousand);
    this.form.get('creditStudy').setValue(this.creditStudy);
    if (this.form.get('contributions')) {
      this.form.get('contributions').setValue(this.contributionsFrom);
    }
  }

  calculateGuarantee() {
    this.findFundGuarantee = this.taxes.find(element => element.identifier === 'librance' || element.identifier === 'box');
    if (this.findFundGuarantee) {
      this.fundGuaranteeValue = this.findFundGuarantee.pivot.value / 100;
      this.totalGuarantee = Math.round((this.montTotal * this.fundGuaranteeValue) * this.vat);
    } else {
      this.totalGuarantee = 0;
    }
    this.form.get('totalGuarantee').setValue(this.totalGuarantee);
  }

  calculateCommunityGuarantee() {
    this.findCommunityGuarantee = this.taxes.find(element => element.identifier === 'communityguarantee');
    if (this.findCommunityGuarantee) {
      this.communityGuaranteeValue = this.findCommunityGuarantee.pivot.value / 100;
      this.totalcommunityGuarantee = Math.round((this.montTotal * this.communityGuaranteeValue) * this.vat);
    } else {
      this.totalcommunityGuarantee = 0;
    }
    this.form.get('totalcommunityGuarantee').setValue(this.totalcommunityGuarantee);
  }

  calculateAntioquiaGuarantee() {
    this.findAntioquiaGuarantee = this.taxes.find(element => element.identifier === 'antioquiaguarantee');
    if (this.findAntioquiaGuarantee) {
      this.antioquiaGuaranteeValue = this.findAntioquiaGuarantee.pivot.value / 100;
      this.totalAntioquiaGuarantee = Math.round((this.montTotal * this.antioquiaGuaranteeValue) * this.vat);
    } else {
      this.totalAntioquiaGuarantee = 0;
    }
    this.form.get('totalAntioquiaGuarantee').setValue(this.totalAntioquiaGuarantee);
  }

  calculateFixedFeeAndFixedCosts() {
    this.findAfiliationEducative = this.taxes.find(element => element.identifier === 'affiliation');
    if (this.findAfiliationEducative && !this.existCygnus) {
      this.afiliationEducative = this.findAfiliationEducative.pivot.value;
    } else {
      this.afiliationEducative = 0;
    }
    if (this.productSelectValue.includes('Afiliación')) {
      this.monthlyFee = this.montTotal;
      this.form.get('monthlyFee').setValue(this.monthlyFee);
      this.fixedFeeAndFixedCosts = Math.round(this.monthlyFee + this.afiliationEducative);
    } else {
      this.fixedFeeAndFixedCosts = Math.round(this.monthlyFee + this.advanceFixedCosts + this.totalGuarantee + this.totalAntioquiaGuarantee + this.totalcommunityGuarantee + this.afiliationEducative);
    }
    this.form.get('afiliationEducative').setValue(this.afiliationEducative);
    this.form.get('fixedFeeAndFixedCosts').setValue(this.fixedFeeAndFixedCosts);
  }

  calculateInterest() {
    this.interestPorcentage = Math.round(this.interest * this.montTotal);
  }

  calculateEducativoEmpleado() {
    if (this.productSelectValue.includes('Educativo empleados')) {
      this.monthlyFee = Math.round(this.montTotal / this.plazo);
    }
  }

  async alertMessageForm() {
    const alert = await this.alertCtrl.create({
      header: "NOTA",
      subHeader: "Ten en cuenta que los valores que se mostrarán a continuación son aproximados",
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });
  }

}

