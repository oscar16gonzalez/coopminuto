import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Parametrics } from 'src/entities/parametrics';
import { ParametricService } from 'src/app/servicios/parametric/parametric.service';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit {

  @Input() dynamicFormData: any[] = [];
  @Input() form: FormGroup;
  parametrics: Parametrics;
  items: FormGroup;
  objectArray = [];
  validations: {} = {};
  dynamicForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _parametric: ParametricService
  ) { }

  ngOnInit() {
    this._parametric.sharedParametric.subscribe(parametric => {
      this.parametrics = parametric;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form.status != 'DISABLED') {
      if (changes['dynamicFormData']) {
        if (this.form.contains('dynamicForm')) {
          this.form.removeControl('dynamicForm')
        }
        this.form.addControl('dynamicForm', this.formBuilder.group([]))
        this.dynamicForm = this.form.get('dynamicForm') as FormGroup;
        for (const key in this.dynamicFormData) {
          const elementsToReplace = this.dynamicFormData[key].elementos;
          for (let i = 0; i < elementsToReplace.length; i++) {
            this.dynamicFormData[key].elementos[i].id = elementsToReplace[i].id.replace(/-/g, '_');
          }
        }
        for (const key in this.dynamicFormData) {
          this.dynamicForm.addControl(key, this.formBuilder.group([]));
          const elements = this.dynamicFormData[key].elementos;
          for (let i = 0; i < elements.length; i++) {
            const controlName = elements[i].id;
            const max = elements[i].max;
            const maxLength = elements[i].maxlength;
            const min = elements[i].min;
            const minlength = elements[i].minlength;
            const pattern = elements[i].regex;
            const required = elements[i].required;
            const name = elements[i].nombre;
            this.addItem(key, controlName, max, maxLength, min, minlength, pattern, required);
            this.getErrorMessage(controlName, max, maxLength, min, minlength, name);
          }
        }
        this.objectArray = Object.entries(this.dynamicFormData);
      }
    }
  }

  addItem(formGroupName, controlName, max, maxLength, min, minLength, pattern, required): void {
    this.items = this.dynamicForm.get(formGroupName) as FormGroup;
    const partialControl = new FormControl(
      '',
      Validators.compose(
        [
          required === '1' ? Validators.required : null,
          pattern != '' ? Validators.pattern(pattern) : null,
          minLength != '' ? Validators.minLength(minLength) : null,
          maxLength != '' ? Validators.maxLength(maxLength) : null,
          max != null ? Validators.max(max) : null,
          min != null ? Validators.min(min) : null
        ]
      )
    );
    return this.items.addControl(controlName, partialControl);
  }

  getErrorMessage(controlName, max, maxLength, min, minlength, name) {
    this.validations['id' + controlName] = [
      { type: 'required', message: `Se debe proporcionar un valor para ${name}` },
      { type: 'pattern', message: `El valor proporcionado para ${name} no es válido` },
      { type: 'minlength', message: `El valor para ${name} debe ser mínimo de ${minlength} caracteres` },
      { type: 'maxlength', message: `El valor para ${name} no debe superar los ${maxLength} caracteres` },
      { type: 'min', message: `El valor mínimo permitido para ${name} es ${min}` },
      { type: 'max', message: `El valor máximo permitido para ${name} es ${max}` },
    ];
  }
}
