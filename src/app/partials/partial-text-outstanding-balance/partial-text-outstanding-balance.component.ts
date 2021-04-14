import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Applicant } from 'src/entities/applicant';

@Component({
  selector: 'app-partial-text-outstanding-balance',
  templateUrl: './partial-text-outstanding-balance.component.html',
  styleUrls: ['./partial-text-outstanding-balance.component.scss'],
})
export class PartialTextOutstandingBalanceComponent implements OnInit {
  @Input() document: number;
  @Input() balanceToCollect: number;
  @Input() filingNumber: number;
  @Input() form: FormGroup;
  @Input() basicForm: FormGroup;
  @Input() permissions: any[];
  applicant: Applicant;
  radio;
  dinamicText = false;
  title: string;
  textDynamicAffiliation: string;

  checked = false;
  indeterminate = false;
  disabled = false;
  validations: any;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();

    if (this.balanceToCollect && this.filingNumber) {
      this.dinamicText = true;
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })
      this.title = 'Consentimiento de afiliación';
      this.textDynamicAffiliation = `
          Señor@ asociado, actualmente cuentas con un crédito vigente bajo radicado No.
           ${this.filingNumber} que cuenta con un saldo de $ ${formatter.format(this.balanceToCollect)}, 
           para poder continuar con la solicitud es necesario que se autorice incluir este saldo dentro de la solicitud actual.`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED' && !this.form.contains('basicData')) {
      this.buildForm();
    }
  }

  buildForm() {
    this.form.addControl('radio', new FormControl('', Validators.compose([Validators.required])));

    this.getErrorMessage();
  }

  getErrorMessage() {
    this.validations = {
      radio: [
        { type: 'required', message: 'Este campo es requerido' },
      ],
    };
  }
}
