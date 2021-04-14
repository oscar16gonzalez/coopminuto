import { Component, ViewChild, Renderer2, ElementRef, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { filter, tap, map } from 'rxjs/operators';
import * as $ from 'jquery';
import { LoadingController } from '@ionic/angular';
import { Parametrics } from 'src/entities/parametrics';
import { ModalTerminosPage } from '../modal-terminos/modal-terminos.page';
import { Applicant } from 'src/entities/applicant';
import { Observable, Subscription, timer } from 'rxjs';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RequestService } from 'src/app/servicios/request/request.service';
import { AgreementService } from 'src/app/servicios/agreement/agreement.service';
import { ParametricService } from 'src/app/servicios/parametric/parametric.service';
import { NeedCodeudorService } from 'src/app/servicios/need-codeudor/need-codeudor.service';
import { IpService } from 'src/app/servicios/ip/ip.service';
import { ProductService } from 'src/app/servicios/product/product.service';
import { CygnusService } from 'src/app/servicios/cygnus/cygnus.service';
import { RequestProductTax } from 'src/entities/requestProductTax';
import { ModalResponsePage } from '../modal-response/modal-response.page';


@Component({
  selector: 'app-initial-form',
  templateUrl: './initial-form.page.html',
  styleUrls: ['./initial-form.page.scss'],
})
export class InitialFormPage implements OnInit {

  @Input() typeApplicant: number;
  @Input() dynamicFormData: any[] = [];
  familyReferences = [];
  personalReferences = [];
  permissions = [];


  @Input() SESSION_USER: String = this.storageService.getCurrentUser() ? this.storageService.getCurrentUser() : '';
  url_navegate = '/';
  applicant: Applicant;
  form = false;
  formBasic = true;
  form1 = false;
  form_reference = false;
  form_labor = false;
  preForm = false;
  response = false;
  parametrics: Parametrics;
  otpCode = '';
  disabled = false;
  otpCodeCodeudor = '';
  productList: any[];
  datosTabla = false;
  termList = [{ id: '', term: 'Selecciona un plazo para la linea de crédito', interest: 0 }];
  documentTypes: any[];
  dynamicsFields: any[];
  productSelected: any = '';
  generatedCode: any = '';
  validProduct = false;
  origi = this.SESSION_USER;
  validTerms = false;
  listProducts: any = [{ id: 0, name: '', description: '', quantity: 1, amount: 0, amountInitial: 0 }];
  listAllProducts: any[];
  montTotal = 0;
  product_interest: any = '';
  netProductValue = 0;
  totalValue = 0;
  rowUpdate = 0;
  totalProducts = 0;
  idTermsAndCondition: number;
  termsAndCondition: boolean = true;
  total = 0;
  office: string;
  divToValidateCodeTC = false;
  validatedOtpCode = false;
  codeTermsSent = true;
  buttonNext = true;
  showButton = true;
  validateOtpSignRequest = '';
  validateOtpSignRequestCodeudor = '';
  totalSumProductsWithoutInterest = 0;
  requestId: number;
  applicantId: number;
  countries$: Observable<any>;
  states$: Observable<any>;
  cities$: Observable<any>;
  requestForm: FormGroup;
  agreements$: Observable<any>;
  applicantForm: FormGroup;
  codeudorForm: FormGroup;
  needCodeudor = false;
  showAgreement: boolean;
  ip = '';
  btnEdit = false;
  disableCodeudor = false;
  personalRefCuantity = 0;
  familyRefCuantity = 0;
  personalRefCuantityCod = 0;
  familyRefCuantityCod = 0;
  isEducativeCredit = false;
  sectionPermissions: any[];
  productTypeSubscription: Subscription;
  productTypePayrollSubscription: Subscription;
  productSectionId: number;
  productTypeList$: Observable<any[]>;
  numeroIdentification;
  cygnusPersonalInfo;
  cygnusCreditsInfo;
  cygnusFinancialInfo;
  productTypeId;
  afiliacionSectionId = 1;
  existCygnus: Boolean = false;
  productChild: number;
  taxes: any[];
  productChildValue: string;
  titleNameAmount = 'Monto solicitado';
  titleNameTable = 'Datos de crédito';
  productTaxes: RequestProductTax[];
  applicantSubscription: Subscription;
  basicDataSubscription: Subscription;
  laborDataSubscription: Subscription;
  disable: Boolean = false;
  minAmountProduct: number = 0;
  affiliation: number;
  category: any;
  isAdult: boolean = true;
  text = true;
  messageForm;
  ticket: any;
  productCategories: any[];
  finalLetter: Array<Object>[];
  renovationTerm: number = 0;
  renovationCase: String = '';
  form_renovation = false;
  loaderToShow: Promise<void>;
  btndisabled = "true";
  document;
  document_type;
  btn = true;
  alphanumericPatter = '^[A-Za-zÀ-ÿ-0-9]+$';
  numericPattern = '^[0-9]+$';
  balanceToCollect: number = 0;
  filingNumber: number = 0;

  validations: any;

  constructor(
    public loadingController: LoadingController,
    private storageService: StorageService,
    public router: Router,
    public formBuilder: FormBuilder,
    private applicantService: ApplicantService,
    private requestService: RequestService,
    private _agreementService: AgreementService,
    private _parametric: ParametricService,
    private _need_codeudor: NeedCodeudorService,
    private _ipService: IpService,
    private _productService: ProductService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private _cygnusService: CygnusService,
    private solicitanteService: AuthServiceService,
    public modalCtrl: ModalController,


  ) {
    this._cygnusService.getContributionsBalance(this.document).catch(data => {
    });

    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
      })

    this.getAllProductCategories();
  }


  getAllProductCategories() {
    this.applicantService.getAllProductCategories().subscribe(categories => {
      this.productCategories = categories;
    })
  }

  ngOnInit() {

    this.applicantService.getDocumentTypes().then(documentsType => {
      this.documentTypes = documentsType;
    });

    this.initializeForm();
    this._parametric.sharedParametric.subscribe(parametric => {
      this.parametrics = parametric;
    });

    this.applicant = new Applicant();
    this.requestForm = this.formBuilder.group({
      document_type: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      productTypeId: ['Selecciona una opción'],
      productId: ['Selecciona una opción'],
      initial_fee: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(0), Validators.maxLength(12)])],
      administration_fee: ['', Validators.compose([Validators.maxLength(12)])],
      productSelected: [],
      productTypeCategoryId: ['', Validators.required],
      productQuantity: ['', Validators.compose([Validators.pattern('^[0-9]*$')])],
      productValue: [],
      document: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
      totalSumOfProductsMinusInitialFee: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(10)])],
      need_codeudor: [''],
      agreementId: [''],
      terms: [''],
    });

    this.getErrorMessage();

    this.applicantForm = this.formBuilder.group({
    });
    this.codeudorForm = this.formBuilder.group({
    }, {
      validator: [
        this.identificationsValidator.bind(this)
      ]
    }
    );
    this.getIp();
    this.getCountries();
    this.onValueChanges();
    this.updateSubscriptions();
    this.taxes = [];
  }

  getErrorMessage() {
    this.validations = {
      document_type: [
        { type: 'required', message: 'El tipo de documento es requerido' }
      ],
      document: [
        { type: 'required', message: 'El documento es requerido' },
        { type: 'minlength', message: 'El documento debe tener al menos 6 caracter' },
        { type: 'maxlength', message: 'El documento debe tener máximo 15 caracteres' },
      ],
      productTypeCategoryId: [
        { type: 'required', message: 'Debes seleccionar una modalidad de crédito' },
      ]
    };
  }

  identificationsValidator(control: AbstractControl) {
    if (this.applicantForm.get('basicData') && control.get('basicData').get('document') && control.status != 'DISABLED') {
      const codeudorIdentification = control.get('basicData').get('document').value;
      const deudorIdentification = this.applicantForm.get('basicData').get('document').value;
      if (codeudorIdentification === deudorIdentification) {
        control.get('basicData').get('document').setErrors({ isValidValue: true });
      } else {
        const errors = control.get('basicData').get('document').errors;
        if (errors && errors.isValidValue) {
          if (Object.keys(errors).length === 1) {
            control.get('basicData').get('document').setErrors(null);
          } else {
            delete errors.isValidValue;
            control.get('basicData').get('document').setErrors(errors);
          }
        }
      }
      this.applicantForm.get('basicData').get('document').valueChanges.subscribe(value => {
        if (codeudorIdentification === value) {
          control.get('basicData').get('document').setErrors({ isValidValue: true });
        } else {
          const errors = control.get('basicData').get('document').errors;
          if (errors && errors.isValidValue) {
            if (Object.keys(errors).length === 1) {
              control.get('basicData').get('document').setErrors(null);
            } else {
              delete errors.isValidValue;
              control.get('basicData').get('document').setErrors(errors);
            }
          }
        }
      });
    }


    if (this.applicantForm.get('basicData') && control.get('basicData').get('cellphone') && control.status != 'DISABLED') {
      const codeudorIdentification = control.get('basicData').get('cellphone').value;
      const deudorIdentification = this.applicantForm.get('basicData').get('cellphone').value;
      if (codeudorIdentification === deudorIdentification) {
        control.get('basicData').get('cellphone').setErrors({ cellphoneInvalid: true });
      } else {
        const errors = control.get('basicData').get('cellphone').errors;
        if (errors && errors.cellphoneInvalid) {
          if (Object.keys(errors).length === 1) {
            control.get('basicData').get('cellphone').setErrors(null);
          } else {
            delete errors.cellphoneInvalid;
            control.get('basicData').get('cellphone').setErrors(errors);
          }
        }
      }
      this.applicantForm.get('basicData').get('cellphone').valueChanges.subscribe(value => {
        if (codeudorIdentification === value) {
          control.get('basicData').get('cellphone').setErrors({ cellphoneInvalid: true });
        } else {
          const errors = control.get('basicData').get('cellphone').errors;
          if (errors && errors.cellphoneInvalid) {
            if (Object.keys(errors).length === 1) {
              control.get('basicData').get('cellphone').setErrors(null);
            } else {
              delete errors.cellphoneInvalid;
              control.get('basicData').get('cellphone').setErrors(errors);
            }
          }
        }
      });
    }

    if (this.applicantForm.get('basicData') && control.get('basicData').get('email') && control.status != 'DISABLED') {
      const codeudorIdentification = control.get('basicData').get('email').value.toUpperCase();
      const deudorIdentification = this.applicantForm.get('basicData').get('email').value.toUpperCase();
      if (codeudorIdentification === deudorIdentification) {
        control.get('basicData').get('email').setErrors({ emailInvalid: true });
      } else {
        const errors = control.get('basicData').get('email').errors;
        if (errors && errors.emailInvalid) {
          if (Object.keys(errors).length === 1) {
            control.get('basicData').get('email').setErrors(null);
          } else {
            delete errors.emailInvalid;
            control.get('basicData').get('email').setErrors(errors);
          }
        }
      }
      this.applicantForm.get('basicData').get('email').valueChanges.subscribe(value => {
        if (codeudorIdentification === value) {
          control.get('basicData').get('email').setErrors({ emailInvalid: true });
        } else {
          const errors = control.get('basicData').get('email').errors;
          if (errors && errors.emailInvalid) {
            if (Object.keys(errors).length === 1) {
              control.get('basicData').get('email').setErrors(null);
            } else {
              delete errors.emailInvalid;
              control.get('basicData').get('email').setErrors(errors);
            }
          }
        }
      });
    }
  }

  getApplicantInformation(document) {
    this.applicantService.getCygnusPersonalInformation(document)
      .subscribe((personalInfo: any) => {
        this.loadingController.dismiss();
        if (personalInfo.data && personalInfo.data.empty) {
          this.existCygnus = false;
        } else {
          this.existCygnus = true;
        }
        this.applicantService.getAllActiveCredits(document).subscribe((info: any) => {
          if (info.data[0]) {
            this.balanceToCollect = info.data[0].SALDO;
            this.filingNumber = info.data[0].NUM_RADIC;
          }
        })
        this.continue(personalInfo);
      }, error => {
        console.log(error);
        this.loadingController.dismiss();
        this.messageForm = "No se pudo consultar la cédula, inténtalo de nuevo";
        this.alertMessageForm(this.messageForm)
      });
  }

  continue(personalInfo) {
    this.productTypeList$ = this.category.id;
    if (personalInfo.data) {
      if (this.category.identifier === 'afiliation' && !personalInfo.data.empty) {
        this.messageForm = 'Ya te encuentras afiliado, debes elegir otra modalidad de crédito';
        this.alertMessageForm(this.messageForm);
        return false;

      } else if (
        (this.category.identifier === 'renovation'
          || this.category.identifier === 'consumption'
          || this.category.identifier === 'servicedgoods')
        && personalInfo.data.empty) {
        this.messageForm = 'Debes afiliarte primero';
        this.alertMessageForm(this.messageForm)
        return false;
      } else if (this.category.identifier === 'renovation') {
        this.applicantService.getAllActiveCredits(this.requestForm.get('document').value).subscribe((data: any) => {
          let educativoCredit;
          let icetexCredit;
          if (!data.data.empty) {
            if (data.data[0].DIAS_MORA > 30) {
              this.messageForm = 'Para renovar un crédito no puedes tener más de 30 dias en mora.';
              this.alertMessageForm(this.messageForm);
              return false;
            }
            educativoCredit = data.data.find(o => o.TIPO_LINEA === 'EDUCATIVO');
            icetexCredit = data.data.find(o => o.TIPO_LINEA === 'ICETEX');
          } if (data.data.empty) {
            this.messageForm = 'No tienes renovaciones disponibles, por favor elige otra modalidad de crédito.';
            this.alertMessageForm(this.messageForm);
            return false;
          } else if (!educativoCredit && !icetexCredit) {
            this.messageForm = 'No tienes renovaciones disponibles, por favor elige otra modalidad de crédito.';
            this.alertMessageForm(this.messageForm);
            return false;
          } else {
            this.formPrincipal();
          }
        });
      }
      else if (this.category.identifier === 'icetex' && !personalInfo.data.empty) {
        this.applicantService.getAllActiveCredits(this.requestForm.get('document').value).subscribe((data: any) => {
          let icetexCredit;
          if (!data.data.empty) {
            icetexCredit = data.data.find(o => o.TIPO_LINEA === 'ICETEX');
          }
          if (icetexCredit) {
            this.messageForm = 'Ya tienes un crédito icetex activo, debes realizar una renovación';
            this.alertMessageForm(this.messageForm);
            this.requestForm.get('productTypeCategoryId').setValue(this.productCategories[5]);
          } else {
            this.formPrincipal();
          }
        });
      } else if (this.category.identifier === 'education' && !personalInfo.data.empty) {
        this.applicantService.getAllActiveCredits(this.requestForm.get('document').value).subscribe((data: any) => {
          let educativoCredit;
          if (!data.data.empty) {
            educativoCredit = data.data.find(o => o.TIPO_LINEA === 'EDUCATIVO');
          }
          if (educativoCredit) {
            this.messageForm = 'Ya tienes un crédito educativo activo, debes realizar una renovación';
            this.alertMessageForm(this.messageForm);
            this.requestForm.get('productTypeCategoryId').setValue(this.productCategories[5]);
          } else if (data.data.empty) {
            this.preForm = true;
            this.form = true;
          }
        });
      }
      else {
        this.preForm = true;
        this.form = true;
        this.form_labor = true;
        this.form_reference = true;
        this.form_renovation = false;
      }
    }
    this.getProductTypeByCategory(this.productTypeList$);
  }

  formPrincipal() {
    this.preForm = true;
    this.form = true;
    // this.form_labor = true;
    // this.form_reference = true;
    // this.form_renovation = false;
    // this.applicantForm.get('financialInformation').status;
  }

  getIp() {
    this._ipService.getIp().subscribe(ip => {
      this.ip = ip;
    });
  }

  errorDocument() {
    if (this.requestForm.controls.document.invalid) {
      $('#btnConsutlCygnus').prop('disabled', true);
    } else {
      $('#btnConsutlCygnus').prop('disabled', false);
    }
  }

  consultCygnus() {
    this.document = this.requestForm.get('document').value;
    if (this.document !== '' && this.requestForm.get('document_type').status !== 'INVALID') {
      this.showLoader();
      this.getApplicantInformation(this.document);
    } else {
      Object.values(this.requestForm.controls || this.requestForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    return true;
  }

  onValueChanges(): void {
    const productObservable = this.requestForm.get('productTypeId').valueChanges.pipe(
      map((id) => {
        const idNumber = Number(id);
        return this.productList ? this.productList.find((productType) => {
          this.personalRefCuantity = productType.personal_refererences_quantity;
          this.familyRefCuantity = productType.family_references_quantity;
          this.personalRefCuantityCod = productType.personal_refererences_quantity_codeudor;
          this.familyRefCuantityCod = productType.family_references_quantity_codeudor;
          this.isEducativeCredit = productType.is_educative;
          return productType.id === idNumber;
        }) : false;
      }),
      filter((productType) => productType),
    );
    this.productTypeSubscription = productObservable.subscribe((productType) => {
      this.rowUpdate = 0;
      if (this.requestForm.status != 'DISABLED') {
        this.requestForm.get('productValue').setValue(0);
      }
      this.dynamicsFields = JSON.parse(productType.form_client);
      this.onChangeProduct(productType.id);
    });
    this.productTypePayrollSubscription = productObservable.pipe(
      tap(() => {
        this.showAgreement = false;
        this.requestForm.get('agreementId').clearValidators();
      }),
      filter((productType) => productType.payroll),
    ).subscribe((productType) => {
      this.showAgreement = true;
      this.agreements$ = this._agreementService.getAgreements();
      this.requestForm.get('agreementId').setValidators(Validators.required);
    });
  }

  updateSubscriptions() {
    if (this.applicantForm.get('basicData') && this.applicantForm.get('basicData').get('document_type')) {
      if (this.basicDataSubscription) {
        this.basicDataSubscription.unsubscribe();
      }
      this.basicDataSubscription = this.applicantForm.get('basicData').get('document_type').valueChanges.subscribe(value => {
        if (this.applicantForm.status != 'DISABLED' && !this.disable) {
          if (value == 3) {
            this.isAdult = false;
            this.disableCodeudor = true;
            this.termsAndCondition = false;
          } else {
            this.isAdult = true;
            this.disableCodeudor = false;
            this.termsAndCondition = true;
          }
          this.needCodeudor = this._need_codeudor.asignDocumentType(value, this.applicantForm);
          if (!this.needCodeudor) {
            this.codeudorForm = this.formBuilder.group({
            });
          } else {
            this.disableCodeudor = true;
          }
        }
      });
    }
    if (this.applicantForm.get('laborDetails') && this.applicantForm.get('laborDetails').get('economicActivitySection')) {
      if (this.laborDataSubscription) {
        this.laborDataSubscription.unsubscribe();
      }
      this.laborDataSubscription = this.applicantForm.get('laborDetails').get('economicActivitySection').valueChanges.subscribe(value => {
        if (this.applicantForm.status != 'DISABLED' && !this.disable) {
          if (value >= 1 && value < 3) {
            this.disableCodeudor = true;
            this.termsAndCondition = false;
          } if (value >= 3) {
            this.disableCodeudor = false;
            this.termsAndCondition = true;
          }
          this.needCodeudor = this._need_codeudor.asignEconomicActivity(value, this.applicantForm);
          if (!this.needCodeudor) {
            this.codeudorForm = this.formBuilder.group({
            });
          } else {
            this.disableCodeudor = true;
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.productTypeSubscription.unsubscribe();
    this.productTypePayrollSubscription.unsubscribe();
    if (this.basicDataSubscription) {
      this.basicDataSubscription.unsubscribe();
    }
    if (this.laborDataSubscription) {
      this.laborDataSubscription.unsubscribe();
    }
  }

  initializeForm() {
    let promises = [];
    promises = [
      this.applicantService.getProductsTypeListCustomer(),
    ];
    Promise.all(promises).then(data => {
      data[0].unshift({ id: '', name: 'Seleccione una modalidad de crédito', valor: 0, form_client: '{}' });
      this.requestForm.controls.productTypeId.setValue('');
      this.productList = data[0];
    }).catch(e => {
      console.log(e);
      this.messageForm = "Ocurrió un error al obtener los datos del servidor, por favor inténtelo más tarde";
      this.alertMessageForm(this.messageForm)
    });
  }

  getProductTypeByCategory(sectionId) {
    this.productTypeList$ = this.applicantService.getProductTypeByCategory(sectionId);
  }

  /** Mover a partial location data*/
  getCountries() {
    this.countries$ = this.applicantService.getAllCountries();
    return this.countries$;
  }

  /** Mover a partial location data*/
  getStates(country_id: string) {
    if (country_id && country_id !== '') {
      this.states$ = this.applicantService.getStatesByCountry(country_id);
      return this.states$;
    } else if (country_id === '') {
      this.messageForm = "Debe seleccionar un país";
      this.alertMessageForm(this.messageForm)
      return false;
    }
  }

  getCities(state_id: string) {
    if (state_id && state_id !== '') {
      this.cities$ = this.applicantService.getCitiesByState(state_id);
      return this.cities$;
    } else if (state_id === '') {
      this.messageForm = "Debe seleccionar un Departamento";
      this.alertMessageForm(this.messageForm)
      return false;
    }
  }

  setValidatorControl(event): void {
    const id = event.target.id;
    const control = this.requestForm.controls[id];
    control.setValue(event.target.value);

    $(event.target).removeClass('is-invalid');
    const divs = $(`div[id*='${id}']`);
    for (let d = 0; d < divs.length; d++) {
      $(divs[d]).hide();
    }

    if (!control.valid) {
      if (Object.keys(control.errors).length > 0) {
        $(event.target).addClass('is-invalid');
        for (const key in control.errors) {
          if (key) {
            $(`#${key}_${id}`).show();
          }
        }
      }
    }
  }

  calculateTotalValue(idProductSelected) {
    this.netProductValue = this.listAllProducts[idProductSelected]['amount'];
    this.totalValue = this.netProductValue + (this.netProductValue * this.product_interest);
  }

  async onSubmit() {
    this.showLoader();
    this.disabled = true;
    let deudorDynamicForm;
    const applicantDataData = this.applicantForm.get('basicData') as FormGroup;
    const applicantData = applicantDataData.getRawValue();
    const deudorForm = this.applicantForm.get('dynamicForm') as FormGroup;
    if (deudorForm) {
      deudorDynamicForm = deudorForm.getRawValue();
    } else {
      deudorDynamicForm = {};
    }
    let codeudorData;
    let codeudorDynamicForm;
    if (!this.needCodeudor) {
      this.codeudorForm = this.formBuilder.group({
      });
    } else {
      const codeudorForm = this.codeudorForm.get('basicData') as FormGroup;
      codeudorData = codeudorForm.getRawValue();
      const dynamicCodeudorForm = this.codeudorForm.get('dynamicForm') as FormGroup;
      codeudorDynamicForm = dynamicCodeudorForm.getRawValue();
    }


    // this.codeudorForm.markAllAsTouched();
    // this.applicantForm.markAllAsTouched();
    // this.requestForm.markAllAsTouched();

    this.codeudorForm.markAsTouched();
    this.applicantForm.markAsTouched();
    this.requestForm.markAsTouched();

    if (!this.applicant.terms) {
      this.messageForm = "Debe aceptar los Términos y Condiciones para continuar.";
      this.alertMessageForm(this.messageForm);
      return false;
    }

    if (
      this.requestForm.get('productValue').value < 0
    ) {
      this.codeTermsSent = false;
      this.messageForm = "El valor a financiar no puede ser negativo para poder realizar la solicitud";
      this.alertMessageForm(this.messageForm)
    } else {
      try {
        await this.requestService.validateForm({ ...this.requestForm.getRawValue(), document: this.applicantForm.get('basicData').get('document').value });
        const applicant = await this.applicantService.saveApplicant({ applicantData, deudorDynamicForm });
        const request = await this.saveRequest();
        this.generatedCode = request.ticket;
        const ticket = this.generatedCode;

        await this.saveApplicantData(this.applicantForm, applicant.id, request.id);
        await this.saveReferences(this.applicantForm, applicant.id, request.id);
        if (this.needCodeudor) {
          const codeudor = await this.applicantService.saveApplicant({ codeudorData, codeudorDynamicForm });
          await this.saveApplicantData(this.codeudorForm, codeudor.id, request.id);
          await this.saveReferences(this.applicantForm, codeudor.id, request.id);
          await this.applicantService.saveRequestApplicant({ requestId: request.id, applicantId: applicant.id, typeApplicantId: 3 });
          await this.applicantService.saveRequestApplicant({ requestId: request.id, applicantId: codeudor.id, typeApplicantId: 2 });
        } else {
          await this.applicantService.saveRequestApplicant({ requestId: request.id, applicantId: applicant.id, typeApplicantId: 1 });
        }
        await this.saveProductTax(request.id);
        this.requestService.executeDecisionEngine(request.id).subscribe((viability: any) => {


          if (viability.continue) {
            this.messageForm = this.generatedCode;
            this.alertGenerateToken();
          } else {
            this.loadingController.dismiss();
            this.modalResponse();
            // this.form = false;
            this.codeTermsSent = true;
            this.showButton = true;
            this.divToValidateCodeTC = false;
            this.validatedOtpCode = false;
            this.applicant.terms = false;
            this.disable = false;
            this.enabledForms();
          }
        }, error => {
          this.loadingController.dismiss();
          console.log(error);
          this.messageForm = "Ha ocurrido un error en el servidor";
          this.alertMessageForm(this.messageForm)
        });
      } catch (error) {
        if (error.status === 400) {
          this.loadingController.dismiss();
          console.log(error);
          this.messageForm = "Ya te encuentras con una solicitud abierta";
          this.alertMessageForm(this.messageForm)
          this.router.navigate(['/menu']);
        } else {
          this.loadingController.dismiss();
          console.log(error);
          this.messageForm = "Ha ocurrido un error en el servidor";
          this.alertMessageForm(this.messageForm)
        }

      }
    }
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando, por favor espera...'
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  async modalResponse() {
    this.btnEdit = false;
    const modal = await this.modalCtrl.create({
      component: ModalResponsePage,
      cssClass: 'my-custom-class',
      componentProps: {
        ticket: this.generatedCode,
      }
    });

    await modal.present()
  }

  saveProductTax(request_id) {
    this.productTaxes = [];
    this.productTaxes.push(
      {
        name_tax: 'fixedFeeAndFixedCosts',
        value: this.requestForm.get('fixedFeeAndFixedCosts').value
      },
      {
        name_tax: 'monthlyFee',
        value: this.requestForm.get('monthlyFee').value
      },
      {
        name_tax: 'interestPercent',
        value: this.requestForm.get('interestPercent').value
      },
      {
        name_tax: 'guaranteeValueVat',
        value: this.requestForm.get('guaranteeValueVat').value
      },
      {
        name_tax: 'totalGuarantee',
        value: this.requestForm.get('totalGuarantee').value
      },
      {
        name_tax: 'creditStudy',
        value: this.requestForm.get('creditStudy').value
      },
      {
        name_tax: 'totalAntioquiaGuarantee',
        value: this.requestForm.get('totalAntioquiaGuarantee').value
      },
      {
        name_tax: 'afiliationEducative',
        value: this.requestForm.get('afiliationEducative').value
      },
      {
        name_tax: 'totalcommunityGuarantee',
        value: this.requestForm.get('totalcommunityGuarantee').value
      },
      {
        name_tax: 'totalSafeXThousand',
        value: this.requestForm.get('totalSafeXThousand').value
      });
    return this.requestService.saveRequestProductTax(this.productTaxes.filter(x => x.value !== 0), request_id, this.productChild);
    // this.productTaxes.filter(x => x.value !== 0);
    // onSubmit() se pasa a esta funcion
  }


  saveRequest() {
    const value = this.requestForm.getRawValue();
    value['list_products'] = JSON.stringify(this.listProducts);
    value.idTermsAndCondition = this.idTermsAndCondition;
    value.terms_conditions = this.applicant.terms;
    value.product_type_id = this.productSelected;
    value.otpEntered = this.validateOtpSignRequest;
    value.mont_total = this.montTotal;
    value.product_type_interest_term = this.requestForm.controls.term.value;
    value.office = this.office;
    value.origin = 2;
    value.ip = this.ip;
    value.balanceToCollect = this.balanceToCollect;
    value.filingNumber = this.filingNumber;

    return this.requestService.saveRequest({ value });
  }

  saveApplicantData(applicantForm: FormGroup, applicantId: number, requestId: number) {
    const form = [];
    const locationDataForm = applicantForm.get('locationData') as FormGroup;
    const applicantLocation = locationDataForm ? locationDataForm.getRawValue() : '';
    if (applicantLocation) {
      form.push(this.applicantService.saveApplicantLocation({ applicantLocation, applicantId, requestId }));
    }
    const financialForm = applicantForm.get('financialInformation') as FormGroup;
    const applicantFinancial = financialForm ? financialForm.getRawValue() : '';
    if (applicantFinancial) {
      form.push(this.applicantService.saveApplicantFinancialData({ applicantFinancial: applicantFinancial, applicantId, requestId }));
    }
    const laborForm = applicantForm.get('laborDetails') as FormGroup;
    const applicantLabor = laborForm ? laborForm.getRawValue() : '';
    if (applicantLabor) {
      form.push(this.applicantService.saveApplicantLaborInformation({ applicantLabor, applicantId, requestId }));
    }
    return Promise.all([
      form
    ]);
  }



  saveReferences(applicantForm: FormGroup, applicantId: number, requestId: number) {
    const form = [];
    const personalRefForm = applicantForm.get('formPersonalReferences') as FormGroup;
    const applicantPersonalRereferenceForm = personalRefForm ? personalRefForm.getRawValue() : '';
    if (applicantPersonalRereferenceForm) {
      form.push(this.applicantService.savePersonalReference({ applicantPersonalRereferenceForm, applicant_id: applicantId, request_id: requestId }));
    }
    const familyRefForm = applicantForm.get('formFamilyReferences') as FormGroup;
    const applicantFamilyForm = familyRefForm ? familyRefForm.getRawValue() : '';
    if (applicantFamilyForm) {
      form.push(this.applicantService.saveFamilyReference({ applicantFamilyForm, applicant_id: applicantId, request_id: requestId }));
    }
    return Promise.all([
      form
    ]);
  }

  validateRequestForm() {
    if (!this.requestForm.valid) {
      Object.values(this.requestForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.buttonNext = false;
      this.formBasic = true;
    }
  }

  sendCodeValidateOTP() {
    if (this.requestForm.get('productTypeId').value === '') {
      this.messageForm = "Debes seleccionar una modalidad de crédito";
      this.alertMessageForm(this.messageForm)
    } else if (this.requestForm.get('productValue').value === 0) {
      this.messageForm = "Debes aceptar la línea de crédito y el monto a solicitar";
      this.alertMessageForm(this.messageForm)
    } else if (!this.ip) {
      this.messageForm = "Ha ocurrido un error, es posible que tenga opciónes habilitadas para bloquear anuncios, deshabilitelas e intente de nuevo";
      this.alertMessageForm(this.messageForm)
    } else {
      if (!this.datosTabla) {
        this.validProduct = true;
        this.messageForm = "Debes aceptar la línea de crédito y el monto a solicitar";
        this.alertMessageForm(this.messageForm)
      } else {
        this.validProduct = false;
        if (this.requestForm.get('productSelected').value == '') {
          this.messageForm = "Debes seleccionar una línea de crédito para crear la solicitud";
          this.alertMessageForm(this.messageForm)
        } else {
          if (!this.needCodeudor) {
            this.codeudorForm = this.formBuilder.group({});
          }
          if ((!this.requestForm.valid || !this.applicantForm.valid || !this.codeudorForm.valid) && this.requestForm.status != 'DISABLED') {

            this.messageForm = "Debes completar todos los campos marcados en rojo para poder continuar.";
            this.alertMessageForm(this.messageForm)
            Object.values(this.requestForm.controls || this.codeudorForm.controls).forEach(control => {
              control.markAsTouched();
              const basicData = this.applicantForm.get('basicData') as FormGroup;
              Object.values(basicData.controls).forEach(control => {
                control.markAsTouched();
              });
              const financialInformation = this.applicantForm.get('financialInformation') as FormGroup;
              Object.values(financialInformation.controls).forEach(control => {
                control.markAsTouched();
              });
              const formFamilyReferences = this.applicantForm.get('formFamilyReferences') as FormGroup;
              Object.values(formFamilyReferences.controls).forEach(control => {
                control.markAsTouched();
              });
              const formPersonalReferences = this.applicantForm.get('formPersonalReferences') as FormGroup;
              Object.values(formPersonalReferences.controls).forEach(control => {
                control.markAsTouched();
              });
              const laborDetails = this.applicantForm.get('laborDetails') as FormGroup;
              Object.values(laborDetails.controls).forEach(control => {
                control.markAsTouched();
              });
              const locationData = this.applicantForm.get('locationData') as FormGroup;
              Object.values(locationData.controls).forEach(control => {
                control.markAsTouched();
              });
            });
            this.disable = false;
          }
          else {
            if (this.category.identifier === 'renovation') {
              this.applicantService.getLastCodebtor(this.applicantForm.get('basicData').get('document').value).subscribe((data: any) => {
                if (data.data[0].IDEN_CODEUDOR && this.codeudorForm.get('basicData')) {
                  if (this.codeudorForm.get('basicData').get('document').value === data.data[0].IDEN_CODEUDOR) {
                    this.sendOTPCode();
                  } else {
                    this.messageForm = "Si tu deudor solidario cambió, no puedes continuar con esta renovación, debes crear una solicitud de crédito nueva para continuar.";
                    this.alertMessageForm(this.messageForm)
                  }
                } else if (data.data[0].IDEN_CODEUDOR && !this.codeudorForm.get('basicData')) {
                  this.messageForm = "Debes ingresar el deudor solidario con el que realizaste tu crédito inicialmente.";
                  this.alertMessageForm(this.messageForm)
                } else if (this.applicantForm.get('radio').value == 0) {
                  this.messageForm = "Debes autorizar recoger el saldo pendiente para continuar con la solicitud.";
                  this.alertMessageForm(this.messageForm)
                }
                else if (!data.data[0].IDEN_CODEUDOR) {
                  this.sendOTPCode();
                } else if (data.data.empty) {
                  this.sendOTPCode();
                }
              });
            }
            else {
              this.sendOTPCode();
            }
          }
        }
      }
    }
  }

  sendOTPCode() {
    let cellphone_deudor;
    if (this.applicantForm.get('basicData').get('document_type').value === 3) {
      cellphone_deudor = '';
    } else {
      cellphone_deudor = this.isAdult ? this.applicantForm.get('basicData').get('cellphone').value : undefined;
    }
    const cellphone_codeudor = this.codeudorForm.get('basicData') ? this.codeudorForm.get('basicData').get('cellphone').value : '';
    this.applicantService.sendCodeValidatePanel({ idTermsAndCondition: this.idTermsAndCondition, 'cellphone': cellphone_deudor, 'co_cellphone': cellphone_codeudor }).then(response => {
      if (response.status) {
        this.showButton = false;
        this.idTermsAndCondition = response.idTermsAndCondition;
        this.validateOtpSignRequest = response.optGenerated;
        this.validateOtpSignRequestCodeudor = response.optGeneratedCodeudor;
        this.divToValidateCodeTC = true;
        this.messageForm = response['message'];
        if (this.isAdult === false) {
          this.alertTerminosCodeudorAdult();
        } else if (!this.needCodeudor) {
          this.alertTerminosDeudor();
        } else {
          this.alertTerminosCodeudor();
        }
      } else {
        this.messageForm = 'Ha ocurrido un error al enviar el còdigo.';
        this.alertMessageForm(this.messageForm)
      }
    }).catch(err => {
      this.messageForm = 'Ha ocurrido un error intente de nuevo más tarde';
      this.alertMessageForm(this.messageForm)
    });
  }

  validateOTPTC(otpCode, otpCodeCodeudor) {
    let message = '';
    if (this.needCodeudor) {
      if (this.isAdult) {
        if (otpCode === '' || otpCodeCodeudor === '') {
          message = 'Debes de ingresar ambos códigos para continuar';
        }
      } else {
        if (!otpCodeCodeudor) {
          message = 'Debes de ingresar el código del deudor solidario';
        }
      }
    } else {
      if (otpCode === '') {
        message = 'Debes de ingresar el código de Deudor';
      }
    }
    if (message !== '') {
      this.alertMessageForm(message)
      return false;
    } else {
      this.applicantService.validateCodeValidatePanel({ code: otpCode, codeCodeudor: otpCodeCodeudor, id: this.idTermsAndCondition, ip: this.ip }).then(response => {
        if (response.cantContinue) {
          this.messageForm = 'No se ha podido completar la solicitud porque se ha fallado en la firma de términos y condiciones';
          this.alertMessageForm(this.messageForm)
          localStorage.clear();
          this.router.navigate([`menu`]);
        } else {
          this.returnResponseValidateCodes(response.signed);
        }
      }).catch(error => {
        this.returnResponseValidateCodes(false);
      });

    }
  }


  disabledForms() {
    this.disable = true;
    this.disableCodeudor = true;
    this.codeudorForm.disable();
    this.applicantForm.disable();
    this.requestForm.disable();
  }

  enabledForms() {
    this.disable = false;
    this.disableCodeudor = false;
    this.codeudorForm.enable();
    this.applicantForm.enable();
    this.requestForm.enable();
  }


  returnResponseValidateCodes(value) {
    if (value) {
      this.messageForm = "Código validado con éxito";
      this.alertMessageForm(this.messageForm)
      this.disabledForms();
      this.codeTermsSent = false;
      this.divToValidateCodeTC = false;
      this.validatedOtpCode = true;
      this.applicant.terms = true;
    } else {
      this.messageForm = "Los códigos no coinciden.";
      this.alertMessageForm(this.messageForm)
    }
  }

  alertresponse() {
    this.response = false;
    this.preForm = true;
    this.form = true;
    // if (this.category.identifier === 'renovation') {
    //   this.form_labor = false;
    //   this.form_reference = false;
    // } else {
    //   this.form_labor = true;
    //   this.form_reference = true;
    // }
  }

  sendValidation() {
    localStorage.setItem('ticket', this.generatedCode);
    localStorage.setItem('numIdentificationTicket', this.applicantForm.get('basicData').get('document').value);
    localStorage.setItem('validateSocket', '1');
    this.generatedCode = '';
  }

  sendCode() {
    const ticket = $('#tickedTyped').val().toString();
    const numIdentificationTicket = $('#numIdentificationTicket').val().toString();
    if (ticket !== '' && numIdentificationTicket !== '') {
      localStorage.setItem('ticket', ticket);
      localStorage.setItem('numIdentificationTicket', numIdentificationTicket);
      localStorage.setItem('validateSocket', '1');
      this.router.navigate(['/evidente']);


    }
  }


  onChangeTerms(event): void {
    this.applicant.terms = event.target.checked;
    if (event.target.checked === true) {
      this.codeudorForm.disable();
      this.applicantForm.disable();
      this.requestForm.disable();
    }

  }

  onChangeProduct(id): void {
    if (!this.origi) {
      $('#quantityValue').prop('disabled', true);
    } else {
      $('#quantityValue').prop('enabled', true);
    }
    if (this.requestForm.status != 'DISABLED') {
      this.productSelected = id;
      if (this.productSelected !== '') {
        Promise.all([
          this.applicantService.getProductsChildProduct(this.productSelected),
          this.requestService.getSections(this.productSelected)
        ])
          .then(data => {

            data[0].unshift({ id: 0, name: 'Selecciona una línea de crédito', amount: 0, amountInitial: 0 });
            this.listAllProducts = data[0];
            this.sectionPermissions = data[1];
            timer(100).subscribe(() =>
              this.updateSubscriptions()
            );
            const elementCollapse = $('#btncollapseOne');
            if (elementCollapse.attr('aria-expanded') === 'false') {
              elementCollapse.click();
            }
          })
          .catch(e => {
            this.messageForm = "Ocurrió un error al obtener el plazo e interés para el producto";
            this.alertMessageForm(this.messageForm)
          });
      }
    }
    this.changeTitleNameAmount(this.category);
  }

  onChangeTerm(event): void {
    const option = event.target.options[event.target.selectedIndex];
    this.requestForm.controls['term'].setValue(option.value);
    $('#interestProductSelected').val(
      event.target.options[event.target.selectedIndex]
        .getAttribute('interest')
        .concat('%')
    );
  }

  sendCustomerParametrics() {
    const parameters = JSON.parse(localStorage.getItem('customerParametrics'));
    if (parameters && this.parametrics) {
      this.parametrics.font_color = parameters['font_color'];
      this.parametrics.background_color = parameters['background_color'];
      this.parametrics.button_color = parameters['button_color'];
      $('body').attr('style', 'background-color:' + this.parametrics.background_color + '!important');
    }
  }

  setUpadteProductLine(i): void {
    this.btnEdit = false;
    this.text = true;
    $('#productTypeId').prop('disabled', false);
    this.datosTabla = false;
    this.rowUpdate = i;
  }

  changeCodeudor(event) {
    if (event.value) {
      this.termsAndCondition = false;
    } else {
      this.termsAndCondition = true;
    }
    if (!this.needCodeudor) {
      this.codeudorForm = this.formBuilder.group({
      });
    }
  }

  updateProductLine(i) {
    this.datosTabla = true;
    if (this.datosTabla) {
      this.validProduct = true;
      if (!this.listProducts[i]['description']) {
        this.codeTermsSent = false;
        this.messageForm = "Debes seleccionar una línea de crédito";
        this.alertMessageForm(this.messageForm)
        return false;
      }
      let message = '';
      if (this.listProducts[i]['quantity'] <= 0 && this.listProducts[i]['amountInitial'] > 0) {
        message = 'La cantidad del producto no debe de ser Cero';
        this.codeTermsSent = false;
        alert(message);
        this.messageForm = message;
        this.alertMessageForm(this.messageForm)
        this.validProduct = true;
        return false;
      }
      if (this.listProducts[i]['quantity'] > 0 && this.listProducts[i]['amountInitial'] <= 0) {
        message = 'Debes ingresar un  monto a solicitar válido';
        this.codeTermsSent = false;
        this.messageForm = message;
        this.alertMessageForm(this.messageForm)
        this.validProduct = true;
        return false;
      }
      if (this.listProducts[i]['quantity'] <= 0 && this.listProducts[i]['amountInitial'] <= 0) {
        message = 'La Cantidad y el Valor Unidad del producto no debe de ser Cero';
        this.codeTermsSent = false;
        this.messageForm = message;
        this.alertMessageForm(this.messageForm)
        this.validProduct = true;
        return false;
      }
      if (this.requestForm.get('productValue').value < this.minAmountProduct) {
        message = `El valor de los aportes mensuales no debe ser menor a ${this.minAmountProduct}`;
        this.codeTermsSent = false;
        this.messageForm = message;
        this.alertMessageForm(this.messageForm)
        this.validProduct = true;
        return false;
      }

      this.text = false;
      this.codeTermsSent = true;
      this.validProduct = false;
      this.rowUpdate = null;
      this.montTotal = this.listProducts[i]['amountInitial'];
      $('#productTypeId').attr('disabled', 'true');
      this.btnEdit = true;
      this.getTaxByProduct();
      this.calculateTotalProducts();
    } else {
      this.messageForm = "Debe seleccionar un nuevo producto.";
      this.alertMessageForm(this.messageForm)
      this.validProduct = false;
      this.listProducts.splice(i, 1);
      this.rowUpdate = null;
      this.calculateTotalProducts();
      return false;
    }
  }

  getTaxByProduct() {
    this.affiliation = 0;
    this._productService.getProductTax(this.productChild)
      .then(data => {
        if (data.length > 0) {
          this.taxes = data;
          if (!this.existCygnus) {
            this.affiliation = this.taxes.find(element => element.identifier === 'affiliation').pivot.value;
          }
        }
      })
      .catch(err => {
        this.messageForm = "Ocurrió un error al obtener los datos del servidor, por favor inténtelo más tarde";
        this.alertMessageForm(this.messageForm)
      });
  }

  onChangeCategory(event) {
    this.productTypeList$ = event.target.value;
    this.getProductTypeByCategory(this.productTypeList$);

  }

  onChangeProductChild(event, i): void {
    const option = event.target.options[event.target.selectedIndex];
    this.requestForm.get('productValue').setValue(Math.floor(option.getAttribute('amountInitial')));
    const description = option.getAttribute('description');
    const amountProduct = option.getAttribute('amount');
    const amountInitial = this.requestForm.get('productValue').value;
    const type = option.getAttribute('type');
    this.listProducts[i].id = event.target.value;
    this.listProducts[i].name = option.innerText;
    this.listProducts[i].description = description;
    this.listProducts[i].amount = parseFloat(amountProduct);
    this.listProducts[i].amountInitial = parseFloat(amountInitial);
    this.listProducts[i].type = type;
    this.productChild = option.value;
    this.productChildValue = option.innerText;
    if (amountInitial === 0) {
      this.minAmountProduct = 100;
    } else {
      this.minAmountProduct = parseFloat(amountInitial);
    }

    this.applicantService.getProductTerms(this.productChild)
      .pipe(
        map(terms => {
          terms.forEach(term => {
            term.term = `${term.term / 30} mes(es)`;
          });
          return terms;
        })
      )
      .subscribe(data => {
        data.unshift({ id: '', term: 'Seleccione un plazo para el producto' });
        this.termList = data;
      });
    this.calculateTotalProducts();
  }

  changeTitleNameAmount(category) {

    if (category.identifier === 'afiliation') {
      this.titleNameAmount = 'Aportes Mensuales';
      this.titleNameTable = 'Datos de solicitud';
    } else if (category.identifier === 'education' || category.identifier === 'renovation' || category.identifier === 'icetex') {
      if (category.identifier === 'renovation') {
        this.messageForm = "Si tu deudor solidario cambió, no puedes continuar con esta renovación, debes crear una solicitud de crédito nueva para continuar.";
        this.alertMessageForm(this.messageForm);
      }
      this.titleNameAmount = 'Monto Matrícula';
      this.titleNameTable = 'Datos de crédito';
    } else {
      this.titleNameAmount = 'Monto solicitado';
      this.titleNameTable = 'Datos de crédito';
    }
  }

  onChangeValue(event, i) {
    if (this.listProducts[i].name != 'Seleccione un producto') {
      if (this.listProducts[i].name != '') {
        if (event !== '' || event < 0) {
          this.listProducts[i].amountInitial = event;
          this.listProducts[i].amount = (this.listProducts[i].amountInitial * Number(this.listProducts[i].quantity));
          this.calculateTotalProducts();
        } else {
          this.listProducts[i].amountInitial = 0;
          this.listProducts[i].amount = (this.listProducts[i].amountInitial * Number(this.listProducts[i].quantity));
          this.calculateTotalProducts();
        }
      }
    }
    return true;
  }

  addRowChildProduct() {
    this.datosTabla = false;
    this.listProducts.push({ id: 0, name: '', description: '', quantity: 1, amount: 0, amountInitial: 0 });
    this.rowUpdate = this.listProducts.length - 1;
  }

  calculateTotalProducts() {
    let total = 0;
    for (let i = 0; i < this.listProducts.length; i++) {
      total = total + this.listProducts[i].amount;
    }
    this.totalProducts = total;
  }

  disableBtnSiguiente(is_disable) {
    $('#btnContinuarFlujo').attr('disabled', is_disable);
    $('#btnEnviarCodigoPanel').attr('disabled', is_disable);
  }

  isAnAdult() {
    if (this.applicantForm.get('basicData') && this.applicantForm.get('basicData').get('birthday').value) {
      const today = new Date();
      const birthday = new Date(this.applicantForm.get('basicData').get('birthday').value);
      const diff = this.diffYears(birthday, today);
      return diff >= 18;
    }
    return true;
  }

  diffYears(dt2: Date, dt1: Date) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
  }

  onChangeStationeryValue(event, i) {
    if (event !== 0 || event !== '') {
      this.requestForm.controls.stationeryValue.setValue(event);
    } else {
      this.requestForm.controls.stationeryValue.setValue(0);
    }
    this.listProducts[i].amount = (Number(this.listProducts[i].amountInitial) * (Number(this.listProducts[i].quantity))) + Number(this.listProducts[i].stationeryValue);
    this.calculateTotalProducts();
    return 0;
  }

  getError(field: string) {
    if (this.requestForm.get(field).hasError('required')) {
      return 'El campo es requerido';
    }
    if (this.requestForm.get(field).hasError('pattern')) {
      return 'Los caracteres ingresados no son válidos para este campo';
    }
    if (this.requestForm.get(field).hasError('min')) {
      return 'El valor está por debajo del valor mínimo permitido';
    }
    if (this.requestForm.get(field).hasError('max')) {
      return 'El valor ingresado supera el valor máximo permitido';
    }
    if (this.requestForm.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.requestForm.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitidos';
    }
    if (this.requestForm.get(field).hasError('minlength')) {
      return 'El campo tiene menos caracteres de los requeridos';
    }
    if (this.requestForm.get(field).hasError('maxlength')) {
      return 'El campo supera el número máximo de caracteres permitidos';
    }
    if (this.requestForm.get(field).hasError('isValidValue')) {
      return 'El documento del deudor y deudor solidario deben ser diferentes';
    }
  }


  async alertTerminosDeudor() {
    const alert = await this.alertCtrl.create({
      header: 'INGRESAR CÓDIGO OTP PARA ACEPTAR TÉRMINOS Y CONDICIONES',
      backdropDismiss: false,
      inputs: [
        {
          name: 'ticket',
          type: 'text',
          placeholder: '  CÓDIGO DEUDOR',

        },

      ],
      buttons: [
        {
          text: 'Reenviar Código',
          handler: () => {
            this.sendCodeValidateOTP();
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            if (data.ticket !== '') {
              this.validateOTPTC(data.ticket, false);
            } else {
              this.alertTerminosDeudor();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async alertTerminosCodeudorAdult() {
    const alert = await this.alertCtrl.create({
      header: 'INGRESAR CÓDIGO OTP PARA ACEPTAR TÉRMINOS Y CONDICIONES',
      backdropDismiss: false,
      inputs: [
        {
          name: 'ticket',
          type: 'text',
          placeholder: '  CÓDIGO DEUDOR SOLIDARIO',

        },

      ],
      buttons: [
        {
          text: 'Reenviar Código',
          handler: () => {
            this.sendCodeValidateOTP();
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (data.ticket !== '') {
              this.validateOTPTC(false, data.ticket);
            } else {
              this.alertTerminosDeudor();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async alertTerminosCodeudor() {
    const alert = await this.alertCtrl.create({
      header: 'INGRESAR CÓDIGO OTP PARA ACEPTAR TÉRMINOS Y CONDICIONES',
      backdropDismiss: false,
      inputs: [
        {
          name: 'ticket',
          type: 'text',
          placeholder: '  CÓDIGO DEUDOR',

        },
        {
          name: 'ticket1',
          type: 'text',
          placeholder: '  CÓDIGO DEUDOR SOLIDARIO',

        },
      ],
      buttons: [
        {
          text: 'Reenviar Código',
          handler: () => {
            this.sendCodeValidateOTP();
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (data.ticket !== '') {
              this.validateOTPTC(data.ticket, data.ticket1);
            } else {
              this.alertTerminosCodeudor();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async alertMessageForm(Message) {
    const alert = await this.alertCtrl.create({
      header: "Información",
      subHeader: Message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            if (Message === "Los códigos no coinciden.") {
              if (!this.needCodeudor) {
                this.alertTerminosDeudor();
              } else if (!this.isAdult) {
                this.alertTerminosCodeudorAdult();
              } else {
                this.alertTerminosCodeudor();
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }


  async alertGenerateToken() {
    this.loadingController.dismiss();
    const alert = await this.alertCtrl.create({
      header: this.generatedCode,
      subHeader: 'Guarda este Ticket, es tu código de solicitud y con él puedes retomarla en cualquier momento.',
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            const ticket = this.generatedCode;
            const numIdentificationTicket = this.applicantForm.get('basicData').get('document').value;
            const email = this.applicantForm.get('basicData').get('email').value;
            const cellphone = this.applicantForm.get('basicData').get('cellphone').value;
            localStorage.setItem('numIdentificationTicket', numIdentificationTicket);
            localStorage.setItem('email', email);
            localStorage.setItem('cellphone', cellphone);
            localStorage.setItem('ticket', ticket);
            const navigationExtras: NavigationExtras = {
              queryParams: {
                ticket,
              }

            };


            this.router.navigate(['/evidente'], navigationExtras);
          }
        }
      ]
    });
    await alert.present();
  }

  backMenu() {
    this.navCtrl.navigateForward('menu');
  }

  async terminos_condiciones() {
    const modal = await this.modalCtrl.create({
      component: ModalTerminosPage
    });

    await modal.present();
  }

  async terminos_condiciones_codeudor() {
    const modal = await this.modalCtrl.create({
      component: ModalTerminosPage
    });

    await modal.present();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.applicantForm.status !== "DISABLED") {
      this.createListToPaintReferences();
    }

    if (changes.sectionPermissions && changes.sectionPermissions.currentValue) {
      const previusValue = changes.sectionPermissions.previousValue || []
      const currentValue = changes.sectionPermissions.currentValue || [];
      const differences = previusValue.filter(x => !currentValue.some(y => x.section_identifier === y.section_identifier));
      differences.forEach(difference => {
        if (this.applicantForm.contains(difference.section_identifier)) {
          this.applicantForm.removeControl(difference.section_identifier)
        }
      })
      this.permissions = currentValue;
    }
  }

  existsPermission(identifier) {
    return this.permissions.some(permission => permission.section_identifier === identifier)
  }

  createListToPaintReferences() {
    this.familyReferences = new Array(this.familyRefCuantity);
    this.personalReferences = new Array(this.personalRefCuantity);
  }
}
