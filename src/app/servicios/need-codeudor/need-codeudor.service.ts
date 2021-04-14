import { Injectable } from '@angular/core';
import { Validators, FormControl, FormGroup} from '@angular/forms';
​
@Injectable({
  providedIn: 'root'
})
export class NeedCodeudorService {
  needCodeudor: boolean = false;
  documentTypeId: number;
  economicActivitySectionId: number;
  numericPattern = '^[0-9]+$';
  constructor() { }
  /**
   * Función que recibe el formulario principal que a su vez tiene
   * los formularios individuales, se extraen algunos de estos formularios
   * para validar campos cuando el aplicante necesita codeudor por ser
   * desempleado o estudiante, si por algún motivo, el aplicante cambia el valor a uno
   * donde no necesita aplicante, se restablecen los campos
   */
  asignCodeudor(form: FormGroup) {
    if ((this.economicActivitySectionId >= 1 && this.economicActivitySectionId < 3) || this.documentTypeId == 3) {
      this.needCodeudor = true;
    } else if (this.documentTypeId && this.economicActivitySectionId) {
      if (this.documentTypeId != 3 && this.economicActivitySectionId >=3 )
      this.needCodeudor = false;
    } else {
      this.needCodeudor = false;
    }
    return this.needCodeudor;
  }

  /** Función que se encarga de deshabilitar los campos
  * en el formulario financiero cuando se selecciona
  * una actividad económica en la cual podría no tenerse un salario como desempleado
  * o estudiante */
  financialFormdisableFieldsAndSetValidators(form: FormGroup) {
    const financialForm = form.get('financialInformation');
    financialForm.get('salary').setValue(0);
    financialForm.get('salary').disable();
    financialForm.get('othersIncomming').setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999), Validators.pattern(this.numericPattern)]));
    financialForm.get('mensualExpenses').setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999), Validators.pattern(this.numericPattern)]));
    financialForm.get('totalIncomming').setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999), Validators.pattern(this.numericPattern)]));
    financialForm.get('financialExpenses').setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999), Validators.pattern(this.numericPattern)]));
    financialForm.get('totalExpenses').setValidators(Validators.compose([Validators.required, Validators.min(0), Validators.max(9999999999999999999), Validators.pattern(this.numericPattern)]));


  }
  /** Función que se encarga de restablecer los campos
  * deshabilitados en el formulario financiero cuando se selecciona
  * una actividad económica en la cual se debería tener un salario */
  financialFormEnableFields(form: FormGroup) {
    const financialForm = form.get('financialInformation');
    financialForm.get('salary').setValue(null);
    financialForm.get('salary').enable();
  }
  /**
   * Función que recibe el id del tipo de documento  y llama a la función que valida
   * los campos cuando se necesita codeudor
   */
  asignDocumentType(documentType: number, form: any) {
    this.documentTypeId = documentType;
    return this.asignCodeudor(form);
  }
  /**
 * Función que recibe el id de la actividad económica  y llama a la función que valida
 * los campos cuando se necesita codeudor
 */
  asignEconomicActivity(economicActivitySection, form: any) {
    this.economicActivitySectionId = economicActivitySection;
    return this.asignCodeudor(form);
  }
  /**
   * Función para deshabilitar los campos del formulario de datos laborales
   */
  disableFormLaborFields(form: FormGroup) {
    const laborInformation = form.get('laborDetails');
    laborInformation.get('companyPosition').disable();
    laborInformation.get('companyName').disable();
    laborInformation.get('bossName').disable();
    laborInformation.get('companyPhone').disable();
    laborInformation.get('companyAddress').disable();
    laborInformation.get('contractType').disable();
    laborInformation.get('admissionDate').disable();
  }
  /**
  * Función para habilitar los campos del formulario de datos laborales
  */
  enableFormLaborFields(form: FormGroup) {
    const laborInformation = form.get('laborDetails');
    laborInformation.get('companyPosition').enable();
    laborInformation.get('companyName').enable();
    laborInformation.get('bossName').enable();
    laborInformation.get('companyPhone').enable();
    laborInformation.get('companyAddress').enable();
    laborInformation.get('contractType').enable();
    laborInformation.get('admissionDate').enable();
  }
}
