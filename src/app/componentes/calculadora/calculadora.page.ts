import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
})
export class CalculadoraPage implements OnInit {

  public form: FormGroup;
  cuotas: any = [];
  error: boolean = false;
  validations: any;
  valorCredito: number;
  plazo: number;
  tasaInteres: number;
  porcentajeRecaudo: number;
  SinCTARecaudo: number;
  CTAMensual: number;
  CTARecaudo: number;
  productTypeList$: Observable<any[]>;
  listProducts: any = [{ id: 0, name: '', description: '', quantity: 1, amount: 0, amountInitial: 0 }];
  productChild: number;

  productChildValue: string;
  listAllProducts: any[];


  constructor(private navCtrl: NavController, public formBuilder: FormBuilder,
    private applicantService: ApplicantService,
  ) {
    this.getProductTypeByCategory(5);
    this.createForm();
  }

  getProductTypeByCategory(sectionId) {
    this.productTypeList$ = this.applicantService.getProductTypeByCategory(sectionId);
  }

  onChangeProductChild(event, i): void {

    const option = event.target.options[event.target.selectedIndex];
    const description = option.getAttribute('description');
    const amountProduct = option.getAttribute('amount');
    const amountInitial = option.getAttribute('amountInitial');
    const type = option.getAttribute('type');
    this.listProducts[i].id = event.target.value;
    this.listProducts[i].name = option.innerText;
    this.listProducts[i].description = description;
    this.listProducts[i].amount = parseFloat(amountProduct);
    this.listProducts[i].amountInitial = parseFloat(amountInitial);
    this.listProducts[i].type = type;
    this.productChild = option.value;
    this.productChildValue = option.innerText;
    // this.calculateTotalProducts();
  }


  onChangeProduct(event, id): void {
    const option = event.target.options[event.target.selectedIndex];
    this.productChild = option.value;
    this.productChildValue = option.innerText;


    Promise.all([
      this.applicantService.getProductsChildProduct(this.productChild),
      this.applicantService.getProductInterestTerms(this.productChild),
    ]).then(data => {
      this.listAllProducts = data[0];
    });


  }

  parseCurrency(value) {
    value = value.replace(/[$/. ]/g, '');
    const priceSplitted = value.split(',');
    const length = (priceSplitted[0].length - 1);
    let i = length, cont = 0, auxiliarFormatted = '', valueFormatted = '';
    while (i >= 0) {
      cont++;
      valueFormatted = valueFormatted.concat(priceSplitted[0].charAt(i));
      if (cont === 3) {
        auxiliarFormatted = auxiliarFormatted.concat(valueFormatted.concat('.'));
        valueFormatted = '';
        cont = 0;
      }
      i--;
    }
    auxiliarFormatted = auxiliarFormatted.concat(valueFormatted);
    auxiliarFormatted = this.reverseString(auxiliarFormatted);
    if (auxiliarFormatted.charAt(0) === '.') { auxiliarFormatted = auxiliarFormatted.substring(1, auxiliarFormatted.length); }
    if (auxiliarFormatted.charAt(auxiliarFormatted.length - 1) === '.') { auxiliarFormatted = auxiliarFormatted.substring(0, (auxiliarFormatted.length - 1)); }
    return '$ '.concat(auxiliarFormatted);
  }

  reverseString(str) {
    let newString = '';
    for (let i = str.length - 1; i >= 0; i--) {
      newString += str[i];
    }
    return newString;
  }

  ngOnInit() {

    this.updateTable();
  }

  createForm() {
    this.form = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      term: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      interest: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
    });
    this.getErrorMessage();
  }

  getErrorMessage() {
    this.validations = {
      amount: [
        { type: 'required', message: 'El valor del credito es requerido' },
        { type: 'pattern', message: 'Solo se deben ingresar números' },
      ],
      term: [
        { type: 'required', message: 'El plazo es requerido' },
        { type: 'pattern', message: 'Solo se deben ingresar números' },
        { type: 'minlength', message: 'El plazo debe tener al menos 1 caracter' },
        { type: 'maxlength', message: 'El plazo debe tener máximo 2 caracteres' },
      ],
      interest: [
        { type: 'required', message: 'El interes es requerido' },
        { type: 'pattern', message: 'Solo se deben ingresar números' },
        { type: 'minlength', message: 'El interes debe tener al menos 1 caracter' },
        { type: 'maxlength', message: 'El interes debe tener máximo 4 caracteres' },
      ],
    };
  }

  updateTable() {
    this.cuotas.push({
      mes: 0,
      saldo_capital: 0,
      abono_capital: 0,
      pago_interes: 0,
      cta_recaudo: 0
    });
  }

  updateData() {
    if (!this.form.invalid) {
      this.error = false;
      this.cuotas = [];
      const valorCredito = Number(this.valorCredito);
      const plazo = Number(this.plazo);
      const tasaInteres = (Number(this.tasaInteres) * 1) / 100;
      const porcentajeRecaudo = 10;
      const sinCTARecaudo = Number(((tasaInteres * valorCredito) / (1 - (Math.pow(1 / (1 + (tasaInteres)), plazo)))).toFixed(2));
      const CTAMensual = sinCTARecaudo

      this.SinCTARecaudo = sinCTARecaudo;
      this.CTARecaudo = CTAMensual;

      this.cuotas.push({
        mes: 0,
        saldo_capital: valorCredito,
        abono_capital: 0,
        pago_interes: 0,
      });
      for (let i = 1; i <= this.plazo; i++) {
        const pagoInteres = this.cuotas[i - 1].saldo_capital * tasaInteres;
        const abonoCapital = this.SinCTARecaudo - pagoInteres;
        const saldoCapital = this.cuotas[i - 1].saldo_capital - abonoCapital;
        this.cuotas.push({
          mes: i,
          saldo_capital: saldoCapital,
          abono_capital: abonoCapital,
          pago_interes: pagoInteres,
        });
      }
    } else {
      this.error = true;
    }

  }

  printBackground(index) {
    if (index % 2) { return { backgroundColor: '#e5e5e5' }; }
    return { backgroundColor: '#fff' };
  }

  back() {
    this.navCtrl.navigateForward(`menu`);
  }
}
