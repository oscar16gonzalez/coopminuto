import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CygnusService } from 'src/app/servicios/cygnus/cygnus.service';

@Component({
  selector: 'app-partial-text-dynamic-affiliation-renovation',
  templateUrl: './partial-text-dynamic-affiliation-renovation.component.html',
  styleUrls: ['./partial-text-dynamic-affiliation-renovation.component.scss']
})
export class PartialTextDynamicAffiliationRenovationComponent implements OnInit {

  @Input() montTotal: number;
  @Input() monthlyFee: number;
  @Input() productSelectValue: string;
  @Input() document: number;
  @Input() existCygnus: Boolean;
  @Input() affiliation: number;
  @Input() category: any;
  @Input() contributions: number;
  pendingContribution: number;
  textDynamicAffiliation: string;
  month: number;
  year: number;
  title: string;
  dynamicText = false;
  constructor(private _cygnusService: CygnusService) { }

  ngOnInit() {
    this.initializationAttribustes();
    this.existCygnus = this.existCygnus;

  }

  ngOnChanges(change: SimpleChanges) {
    if (change['montTotal']) {
      this.montTotal = this.montTotal;
    }
    if (change['monthlyFee']) {
      this.monthlyFee = this.monthlyFee;

    }
    if (change['document']) {
      this.document = this.document;
    }
    if (change['affiliation']) {
      this.affiliation = this.affiliation;
    }
    if (change['contributions']) {
      this.contributions = this.contributions;
    }

    if (change['existCygnus'] && change['existCygnus'].currentValue) {
      this.existCygnus = this.existCygnus;
    }
    this.initializationAttribustes();
  }
  initializationAttribustes() {
    if (this.productSelectValue && this.document) {
      this.month = new Date().getMonth() + 1;
      this.year = new Date().getFullYear();
      if (this.existCygnus && (this.productSelectValue.includes('Renovación')
        || this.category.identifier === 'education'
        || this.category.identifier === 'servicedgoods'
        || this.category.identifier === 'consumption')) {
        this._cygnusService.getContributionsBalance(this.document)
          .then(data => {
            if (data) {
              this.pendingContribution = data;
            }
          });
      }
      this.generateText();
    }
  }

  generateText() {
    if ((this.productSelectValue.includes('Afiliación') && this.montTotal) && this.affiliation) {
      this.dynamicText = true;
      this.title = 'Consentimiento de afiliación';
      this.textDynamicAffiliation = `Manifiesto mi voluntad de pertenecer como asociado(a) a la COOPERATIVA MINUTO DE DIOS a partir del mes ${this.month} de ${this.year}
        para lo cual me permito suministrar la información requerida, para el estudio aprobación de esta solicitud. Igualmente
        me comprometo a cumplir con los estatutos y demas normas de la COOPERATIVA MINUTO DE DIOS, con el pago de la cuota de afiliación
        y aportes ordinarios que rigen para todos los asociados, así: Cuota afiliación: $ ${this.formatCurrency(this.affiliation)}, aporte mensual: $ ${this.formatCurrency(this.montTotal)}.`;
    } else if (((this.category.identifier === 'education' || this.productSelectValue.includes('Icetex Nuevo')) && !this.existCygnus) && this.contributions) {
      this.dynamicText = true;
      this.title = 'Consentimiento de afiliación';
      this.textDynamicAffiliation = `Manifiesto mi voluntad de pertenecer como asociado(a) a la COOPERATIVA MINUTO DE DIOS a partir del mes ${this.month} de ${this.year}
        para lo cual me permito suministrar la información requerida, para el estudio aprobación de esta solicitud. Igualmente
        me comprometo a cumplir con los estatutos y demas normas de la COOPERATIVA MINUTO DE DIOS, con el pago de la cuota de afiliación
        y aportes ordinarios que rigen para todos los asociados, así: Cuota afiliación: $ ${this.formatCurrency(this.affiliation)}, aporte mensual: $ ${this.formatCurrency(this.contributions)}.`;
    } else if ((this.category.identifier === 'education' || this.productSelectValue.includes('Icetex Nuevo')) && this.pendingContribution) {
      this.dynamicText = true;
      this.title = 'Consentimiento de aportes';
      this.textDynamicAffiliation = `Autorizo sean incluidos en la financiación del crédito los aportes que tengo en mora por la suma de: $ ${this.formatCurrency(this.pendingContribution)}.`;
    } else if (this.productSelectValue.includes('Renovación') && this.pendingContribution) {
      this.dynamicText = true;
      this.title = 'Consentimiento de renovación';
      this.textDynamicAffiliation = `Autorizo sean incluidos en la financiación del crédito los aportes que tengo en mora por la suma de: $ ${this.formatCurrency(this.pendingContribution)}.`;
    } else if ((this.category.identifier === 'servicedgoods' || this.category.identifier === 'consumption') && this.pendingContribution) {
      this.dynamicText = true;
      this.title = 'Consentimiento de afiliación';
      this.textDynamicAffiliation = `Autorizo sean incluidos en la financiación del crédito los aportes que tengo en mora por la suma de: $ ${this.formatCurrency(this.pendingContribution)}.`;
    }
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('es-IN').format(value);
  }
}
