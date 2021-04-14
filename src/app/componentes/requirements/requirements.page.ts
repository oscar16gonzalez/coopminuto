import { Component, OnInit, ElementRef, Renderer2, ViewChild, SimpleChanges, Input } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { KeyValue } from '@angular/common';
import * as $ from 'jquery';
import { Applicant } from 'src/entities/applicant';
import { Parametrics } from 'src/entities/parametrics';
import { CustomValidators } from 'src/app/validators/customValidators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PromissoryNoteService } from 'src/app/servicios/promissory-note/promissory-note.service';
import { RequestService } from 'src/app/servicios/request/request.service';
import { DocumentSignService } from 'src/app/servicios/document-sign/document-sign.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.page.html',
  styleUrls: ['./requirements.page.scss'],
})
export class RequirementsPage implements OnInit {

  @Input() dataRequirements;
  @ViewChild('formRequeriments') private formRequeriments: ElementRef;
  applicant: Applicant;
  request: {};
  parametrics: Parametrics;
  ticket;
  cedula;
  srcLoading = 'assets/images/IsotipoOnCredit.png';
  documentsForm: FormGroup;
  invalidForm = false;
  objectPhotos = {};
  allowTofinish = false;
  toastCtrl: any;
  isPagare = false;
  nodocuments = false;
  documentPagare: ''; // SafeResourceUrl;
  pagareSigned = false;
  msj: string;
  questionsList: any;
  image: string = null;
  loaderToShow: any;
  platform: any;
  hasCodeudor = false;
  documentos = [];
  idTermsAndCondition: number;
  showPromissoryNote: Boolean = false;
  promissoryNoteSigned: Boolean = false;
  cellphone;
  email;
  prueba;
  documentSigns: any;
  validateOtpCodeudor = false;
  documentId;
  previewDocumentSigns: any;


  buttons: Componente[] = [
    {
      icon: 'home',
      name: 'Inicio',
      redirectTo: 'menu',
      color: '',
    },
    {
      icon: 'card',
      name: 'Solicitar Crédito',
      redirectTo: 'solicitar',
      color: '',
    },
    {
      icon: 'document',
      name: 'Listar Crédito',
      redirectTo: 'list-credits',
      color: '',
    },
  ];

  constructor(
    private formBuilder: FormBuilder, private camera: Camera, private applicantService: AuthServiceService,
    public router: Router, private renderer: Renderer2, private route: ActivatedRoute, private navCtrl: NavController,
    public alertController: AlertController, public loadingController: LoadingController, private _requestService: RequestService
    , private _prommisoryNoteService: PromissoryNoteService, private _documentSignService: DocumentSignService
  ) {
    this.parametrics = new Parametrics();
    this.applicant = new Applicant();

    this.applicantService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        const color = this.parametrics.button_color;
        const color1 = '#233E50';
        this.changeValueArray(this.buttons, 'Solicitar Crédito', color, color1);
      }).catch(error => { console.log(error); });

    this.ticket = localStorage.getItem('ticket');
    this.cedula = localStorage.getItem('numIdentificationTicket');
    this.email = localStorage.getItem('email');
    this.cellphone = localStorage.getItem('cellphone');

    this.applicantService.getTiposDocumento()
      .then(data => {
        this.documentos = data;
      }).catch(error => console.log(error));

    this.documentsForm = new FormGroup({});
    this.initializeForm().then(result => {
      this.applicantService.getFullDataTicket({ ticket: this.ticket, identification: this.cedula }).subscribe(
        (response => {
          this.applicant = response.applicant;
          this.request = response.request;
          this.loaderRequirements();
        }), (e => {
          console.log(e);
          this.processInvalidData();
        })
      );


    }).catch(e => {
      console.log(e);
      this.processInvalidData();
    });
  }

  ngOnInit(): void {
    this._prommisoryNoteService.needSignPromissoryNote(this.ticket).subscribe((response: any) => this.showPromissoryNote = response.showPromissoryNote);
    this._prommisoryNoteService.areAlreadySigned(this.ticket).subscribe((signed: any) => this.promissoryNoteSigned = signed.areAlreadySigned);
    this.listDocumentSign(this.ticket);
    
  }
  
  
  listDocumentSign(ticket) {
    if (ticket) {
      this.documentSigns = [];
      this._documentSignService.listDocumentSign(ticket).then((request: any) => {
        this.documentSigns = request;
        if(this.documentSigns.length > 0){
          localStorage.setItem('documentSignId', this.documentSigns[0].id);
        }
      });
    }
  }

  requeriments() {
    this.loadingController.dismiss();
    this.initialzeRequeriments().then(data => {
      if (data.length > 0) {
        this.loadingController.dismiss();
        $('input[type="file"]').change(e => {
          const fileName = e.target['files'].length !== 0 ? e.target['files'][0].name : '';
          this.documentsForm.controls[e.target.id].setValue('requisito_adjunto');
          $(e.target.parentElement).find('.custom-file-label').html('requisito_adjunto');
          const parent = $(e.target.parentElement.parentElement.parentElement.parentElement);
          this.objectPhotos[e.target.id] = '';
          this.validateChangeRequeriment(parent, this.documentsForm);
        });
        for (let i = 0; i < data.length; i++) {
          this.validateChangeRequerimentLoad($('#'.concat(data[i])), this.documentsForm);
        }

      }
    }).catch(e => {
      console.log(e);
      this.loadingController.dismiss();
      this.processInvalidData();
    });
  }


  loaderRequirements() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando por favor espere...'
    }).then((res) => {
      res.present();
      this.requeriments();
      res.onDidDismiss().then((dis) => {
      });
    });

  }

  validateChangeRequerimentLoad(parent, frm) {
    const elements = parent.find(':input').not(':input[type=button]');
    const legend = parent.parent().find('legend');
    let isValid = true;
    $.each(elements, function (i, element) {
      const control = frm.get(element.getAttribute('id'));
      if (!control.valid) { isValid = false; }
      if (!isValid) {
        $(legend.find('i')[0]).attr('class', 'fa fa-spinner fa-spin');
      } else {
        $(legend.find('i')[0]).attr('class', 'fa fa-check-circle correct-icon');
      }
    });
  }

  validateChangeRequeriment(parent, frm) {
    const elements = parent.find(':input').not(':input[type=button]');
    $.each(elements, function (i, element) {
      const control = frm.get(element.getAttribute('id'));
      if (!control.valid) {
        $(element).addClass('is-invalid');
        return false;
      } else {
        $(element).removeClass('is-invalid');
      }
    });
  }

  private initializeForm(): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  private processInvalidData(message = '') {
    const msj = (message === '') ? 'No se encontraron datos para esta solicitud' : message;
  }

  indexOrderAsc = (akv: KeyValue<string, any>, bkv: KeyValue<string, any>): number => {
    const a = akv.value.index;
    const b = bkv.value.index;
    return a > b ? 1 : (b > a ? -1 : 0);
  }

  private initialzeRequeriments(): Promise<any> {
    return new Promise((resolve) => {

      const send = {
        ticket: this.ticket,
        email: this.email,
        cellphone: this.applicant.cellphone
      };
      this.applicantService.getRequirements(send).then(data => {
        const idsCollapses = [];
        const nameGroups = [];
        const nameGroupsRepeat = [];
        if (data['requirements']['length'] === 0) {
          this.nodocuments = true;
          this.allowTofinish = true;
        }
        this.hasCodeudor = data['hasCodeudor'];
        for (let i = 0; i < data['requirements']['length']; i++) {
          const elements = JSON.parse(data['requirements'][i].structure.replace(/\'/g, '"'));
          if (!Array.isArray(elements)) { continue; }
          const values = data['requirements'][i].responses.length ? JSON.parse(data['requirements'][i].responses[0].value) : [];
          const fieldset = this.renderer.createElement('fieldset');
          const divCollapse = this.renderer.createElement('div');
          this.renderer.setAttribute(divCollapse, 'id', `D${data['requirements'][i].id}`);
          idsCollapses.push(`D${data['requirements'][i].id}`);

          for (let j = 0; j < elements.length; j++) {
            if (elements[j].activo === '1') {
              if (j === 0) {
                if (i !== 0) { this.renderer.appendChild(this.formRequeriments.nativeElement, this.renderer.createElement('hr')); }

                const legend = this.renderer.createElement('legend');
                this.renderer.setStyle(legend, 'font-size', '1.3em');
                this.renderer.setStyle(legend, 'font-weight', '800');
                this.renderer.setStyle(legend, 'color', this.parametrics.font_color);
                this.renderer.setStyle(legend, 'cursor', 'pointer');
                this.renderer.setAttribute(legend, 'name', 'legend');
                this.renderer.setAttribute(legend, 'data-toggle', 'collapse');
                this.renderer.setAttribute(legend, 'data-target', `#D${data['requirements'][i].id}`);
                this.renderer.setAttribute(legend, 'title', 'Dar clic para desplegar los requisitos');

                let cont = 0;
                nameGroups.push(data['requirements'][i].name);
                for (let c = 0; c < nameGroups.length; c++) {
                  if (nameGroups[c] === data['requirements'][i].name) { cont++; }
                }

                if (cont > 1) {
                  if (nameGroupsRepeat.indexOf(data['requirements'][i].name) === -1) { nameGroupsRepeat.push(data['requirements'][i].name); }
                  data['requirements'][i].name = `${data['requirements'][i].name} ${cont}`;
                }


                if (cont > 1) {
                  if (nameGroupsRepeat.indexOf(data['requirements'][i].name) === -1) { nameGroupsRepeat.push(data['requirements'][i].name); }
                  data['requirements'][i].name = `${data['requirements'][i].name} ${cont}`;
                }

                this.renderer.appendChild(legend, this.renderer.createText(data['requirements'][i].name));

                const icon = this.renderer.createElement('i');
                this.renderer.setAttribute(icon, 'class', 'fa');
                this.renderer.setStyle(icon, 'width', '5%');
                this.renderer.setStyle(icon, 'float', 'right');
                this.renderer.setStyle(icon, 'margin-top', '5px');
                this.renderer.setAttribute(legend, 'validate', '1');
                this.renderer.appendChild(legend, icon);

                const dropDownIcon = this.renderer.createElement('i');
                this.renderer.setAttribute(dropDownIcon, 'class', 'fa fa-caret-down');
                this.renderer.setStyle(dropDownIcon, 'width', '5%');
                this.renderer.setStyle(dropDownIcon, 'float', 'left');
                this.renderer.appendChild(legend, dropDownIcon);

                this.renderer.appendChild(fieldset, legend);

              }

              let element = null;
              const idElement = `${elements[j].id}_${data['requirements'][i].id}`;
              const required = elements[j].required === '1';

              const divToAddClass = this.renderer.createElement('div');
              const h = this.renderer.createElement('h5');
              var t = document.createTextNode(elements[j].nombre);
              h.appendChild(t);
              this.renderer.appendChild(divToAddClass, h)
              this.renderer.setStyle(h, 'font-size', '12px');
              this.renderer.addClass(h, 'pl-3');
              const divColToAddClass = this.renderer.createElement('div');
              this.renderer.addClass(divToAddClass, 'form-group');
              this.renderer.addClass(divToAddClass, 'row');
              this.renderer.addClass(divColToAddClass, 'col-md-12');
              this.renderer.setStyle(divColToAddClass, 'font-size', '12px');


              const label = this.renderer.createElement('label');
              this.renderer.setAttribute(label, 'for', idElement);

              const validators = [];
              const divsValidators = [];
              let labelText = elements[j].placeholder;
              if (required) { labelText = labelText.concat(' *'); }


              if (values[j] === undefined) { values[j] = { id: elements[j].id, valor: '' }; }

              if (elements[j].tipo === 'text') {
                this.renderer.appendChild(label, this.renderer.createText(labelText));
                element = this.renderer.createElement('input');
                this.renderer.addClass(element, 'form-control');
                this.renderer.setAttribute(element, 'id', idElement);
                this.renderer.setAttribute(element, 'type', elements[j].tipo);
                this.renderer.setAttribute(element, 'value', values[j].valor);
                this.renderer.setAttribute(element, 'placeholder', elements[j].nombre);
                this.renderer.setAttribute(element, 'formControlName', idElement);

                this.renderer.listen(element, 'keyup', (evt) => {
                  this.setValidatorControl(evt);
                });

                this.renderer.listen(element, 'change', (evt) => {
                  this.setValidatorControls(evt, false);
                });

                if (required) {
                  validators.push(Validators.required);
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'required_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`Se debe proporcionar un valor para ${elements[j].nombre}`));
                  divsValidators.push(divValidator);
                }

                if (elements[j].regex !== '') {
                  validators.push(Validators.pattern(elements[j].regex));
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'pattern_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`El valor proporcionado para ${elements[j].nombre} no es valido`));
                  divsValidators.push(divValidator);
                }
                if (elements[j].minlength !== '') {
                  validators.push(Validators.minLength(Number(elements[j].minlength)));
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'minlength_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`El valor para ${elements[j].nombre} debe ser minimo de ${elements[j].minlength} caracteres`));
                  divsValidators.push(divValidator);
                }
                if (elements[j].maxlength !== '') {
                  validators.push(Validators.maxLength(Number(elements[j].maxlength)));
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'maxlength_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`El valor para ${elements[j].nombre} no debe superar los ${elements[j].maxlength} caracteres`));
                  divsValidators.push(divValidator);
                }

                this.renderer.appendChild(divColToAddClass, label);
                this.renderer.appendChild(divColToAddClass, element);
              } else if (elements[j].tipo === 'number') {
                this.renderer.appendChild(label, this.renderer.createText(labelText));
                element = this.renderer.createElement('input');
                this.renderer.addClass(element, 'form-control');
                this.renderer.setAttribute(element, 'id', idElement);
                this.renderer.setAttribute(element, 'type', elements[j].tipo);
                this.renderer.setAttribute(element, 'value', values[j].valor);
                this.renderer.setAttribute(element, 'placeholder', elements[j].nombre);
                this.renderer.setAttribute(element, 'formControlName', idElement);

                this.renderer.listen(element, 'keyup', (evt) => {
                  this.setValidatorControl(evt);
                });

                this.renderer.listen(element, 'change', (evt) => {
                  this.setValidatorControls(evt, false);
                });

                if (required) {
                  validators.push(Validators.required);
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'required_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`Se debe proporcinar un valor para ${elements[j].nombre}`));
                  divsValidators.push(divValidator);
                }
                if (elements[j].hasOwnProperty('min') && elements[j].min !== '') {
                  validators.push(CustomValidators.min(Number(elements[j].min)));
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'min_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`El valor minimo permitido para ${elements[j].nombre} es ${elements[j].min}`));
                  divsValidators.push(divValidator);
                }
                if (elements[j].hasOwnProperty('max') && elements[j].max !== '') {
                  validators.push(CustomValidators.max(Number(elements[j].max)));
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'max_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`El valor maximo permitido para ${elements[j].nombre} es ${elements[j].max}`));
                  divsValidators.push(divValidator);
                }

                this.renderer.appendChild(divColToAddClass, label);
                this.renderer.appendChild(divColToAddClass, element);
              } else if (elements[j].tipo === 'select') {
                if (!Array.isArray(elements[j].datos)) { continue; }

                this.renderer.appendChild(label, this.renderer.createText(labelText));
                element = this.renderer.createElement('select');
                this.renderer.addClass(element, 'custom-select');
                this.renderer.setAttribute(element, 'id', idElement);
                this.renderer.setAttribute(element, 'formControlName', idElement);

                this.renderer.listen(element, 'change', (evt) => {
                  this.setValidatorControl(evt);
                  this.setValidatorControls(evt, false);
                });

                const optionInitial = this.renderer.createElement('option');
                this.renderer.setAttribute(optionInitial, 'value', '');
                this.renderer.appendChild(optionInitial, this.renderer.createText('Seleccione un elemento'));
                this.renderer.appendChild(element, optionInitial);

                for (let k = 0; k < elements[j].datos.length; k++) {
                  const option = this.renderer.createElement('option');
                  this.renderer.setAttribute(option, 'value', elements[j].datos[k]);
                  if (elements[j].datos[k] === values[j].valor) {
                    this.renderer.setAttribute(option, 'selected', 'selected');
                  }
                  this.renderer.appendChild(option, this.renderer.createText(elements[j].datos[k]));
                  this.renderer.appendChild(element, option);
                }

                if (required) {
                  validators.push(Validators.required);
                  const divValidator = this.renderer.createElement('div');
                  this.renderer.addClass(divValidator, 'invalid-feedback');
                  this.renderer.setAttribute(divValidator, 'id', 'required_'.concat(idElement));
                  this.renderer.appendChild(divValidator, this.renderer.createText(`Se debe proporcinar un valor para ${elements[j].nombre}`));
                  divsValidators.push(divValidator);
                }

                this.renderer.appendChild(divColToAddClass, label);
                this.renderer.appendChild(divColToAddClass, element);
              } else if (elements[j].tipo === 'file') {
                if (elements[j].archivo_descarga !== '') {
                  const divLink = this.renderer.createElement('div');
                  this.renderer.addClass(divLink, 'col-md-12');
                  this.renderer.appendChild(divToAddClass, divLink);
                  const link = this.renderer.createElement('a');
                  this.renderer.setAttribute(link, 'href', elements[j].archivo_descarga);
                  this.renderer.setAttribute(link, 'target', '_blank');
                  this.renderer.appendChild(divLink, this.renderer.createElement('br'));
                  this.renderer.appendChild(link, this.renderer.createText('FORMATO PARA DESCARGAR'));
                  this.renderer.appendChild(divLink, link);
                  this.renderer.appendChild(divLink, this.renderer.createElement('br'));
                  this.renderer.appendChild(divLink, this.renderer.createElement('br'));
                  this.renderer.appendChild(divToAddClass, divLink);
                }

                const divDocument = this.renderer.createElement('div');
                this.renderer.addClass(divDocument, 'custom-file');
                element = this.renderer.createElement('input');
                this.renderer.setAttribute(element, 'type', 'file');
                this.renderer.setAttribute(element, 'id', idElement);
                this.renderer.setAttribute(element, 'lang', 'es');
                // this.renderer.setAttribute(element, 'accept', 'image/*, application/pdf, application/doc, application/docx"');
                this.renderer.setAttribute(element, 'value', values[j].valor);
                this.renderer.addClass(element, 'custom-file-input');
                this.renderer.addClass(label, 'custom-file-label');

                const textLabel = values[j].valor === '' ? labelText : values[j].valor;
                this.renderer.appendChild(label, this.renderer.createText(textLabel));
                this.renderer.appendChild(divDocument, element);
                this.renderer.appendChild(divDocument, label);

                this.renderer.setStyle(divDocument, 'display', 'inline-block');
                this.renderer.setStyle(divDocument, 'width', '76%');

                const buttonPhoto = this.renderer.createElement('button');
                this.renderer.setAttribute(buttonPhoto, 'type', 'button');
                this.renderer.addClass(buttonPhoto, 'btn');
                this.renderer.addClass(buttonPhoto, 'btn-light');
                this.renderer.setStyle(buttonPhoto, 'display', 'inline-block');
                this.renderer.setStyle(buttonPhoto, 'height', '90%');
                this.renderer.setStyle(buttonPhoto, 'width', 'max-content');
                this.renderer.setStyle(buttonPhoto, 'margin-left', '1%');
                this.renderer.listen(buttonPhoto, 'click', (evt) => {
                  this.getPicture(idElement);
                });

                const iPhoto = this.renderer.createElement('i');

                this.renderer.appendChild(buttonPhoto, iPhoto);
                this.renderer.appendChild(buttonPhoto, this.renderer.createText('Foto'));

                this.renderer.appendChild(divColToAddClass, divDocument);
                this.renderer.appendChild(divColToAddClass, buttonPhoto);
              }

              if (elements[j].required === '1') {
                this.renderer.setAttribute(element, 'required', 'required');
                validators.push(Validators.required);
              }

              this.documentsForm.setControl(idElement, new FormControl(values[j].valor, Validators.compose(validators)));

              for (let dv = 0; dv < divsValidators.length; dv++) {
                this.renderer.appendChild(divColToAddClass, divsValidators[dv]);
              }

              this.renderer.appendChild(divToAddClass, divColToAddClass);
              this.renderer.appendChild(divCollapse, divToAddClass);
              this.renderer.appendChild(fieldset, divCollapse);
            }

            this.renderer.appendChild(this.formRequeriments.nativeElement, fieldset);
          }
        }

        for (let i = 0; i < nameGroupsRepeat.length; i++) {
          const element = $(`legend:contains('${nameGroupsRepeat[i]}')`).first();
          const html = element.html().replace(nameGroupsRepeat[i], `${nameGroupsRepeat[i]} 1`);
          element.html(html);
        }

        resolve(idsCollapses);
        this.processForm(false);
      }).catch(e => {
        console.log(e);
        this.AlertQuestion();
        resolve([]);
      });
    });
  }

  changeValueArray(array, elementSearch, valueChange, valueOption = null) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === elementSearch) {
        array[i].color = valueChange;
      } else {
        array[i].color = valueOption;
      }
    }
    return array;
  }

  async AlertQuestion() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Ocurrio un error al obtener los requisitos de la solicitud, intentelo mas tarde',
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            this.navCtrl.navigateBack('/menu');
          }
        }
      ]
    });
    await alert.present();
  }

  private processForm(save) {
    const formData: FormData = new FormData();
    const elements = $('#frmDocuments').find(':input').not('.btn');
    const sendObject = {};
    let idElement = '';
    let idElementPrev = '';
    let cantRequiredEmpty = 0;

    for (let i = 0; i < elements.length; i++) {
      const type = elements[i].getAttribute('type');
      const isFile = type === 'file';
      const id = elements[i].getAttribute('id');

      idElement = id.substring(id.indexOf('_') + 1, id.length);
      if (idElement === '' || idElement !== idElementPrev) {
        sendObject[idElement] = [];
      }
      idElementPrev = idElement;

      const send = {};
      send['id'] = id.substring(0, id.indexOf('_'));
      send['valor'] = elements[i]['value'];
      send['tipo'] = type != null ? type : elements[i]['tagName'].toString().toLowerCase();

      if (isFile) {
        const isRequired = elements[i].getAttribute('required') === 'required';
        let validateFiles = true;
        let valueFile = elements[i]['value'];
        valueFile = valueFile === '' ? elements[i].getAttribute('value') : valueFile;
        if (isRequired && (!valueFile)) { cantRequiredEmpty++; }
        valueFile = valueFile.toString().replace(/^.*[\\\/]/, '');
        send['valor'] = valueFile;

        let file = null;
        const key = send['id'].concat('_').concat(idElement);
        if (this.objectPhotos.hasOwnProperty(key)) {
          if (this.objectPhotos[key] !== '') {
            validateFiles = false;
            file = this.objectPhotos[key];
            send['valor'] = file.name;
            formData.append(id, file, file.name);
          }
        }

        if (validateFiles) {
          if (elements[i]['files'].length === 0) {
            sendObject[idElement].push(send);
            continue;
          }
          file = elements[i]['files'][0];
          formData.append(id, file, file.name);
        }
      }

      sendObject[idElement].push(send);

      const control = this.documentsForm.controls[id];
      if (!control.valid) {
        cantRequiredEmpty++;
      }
    }

    this.allowTofinish = cantRequiredEmpty === 0;

    if (this.allowTofinish) {
      if (this.isPagare && !this.pagareSigned) { $('[name=pagareButton]').removeAttr('hidden'); } else { $('[name=allowTofinish]').removeAttr('hidden'); }
    }


    formData.append('frm', JSON.stringify(sendObject));
    formData.append('ticket', this.ticket);

    if (save) {
      this.showLoader(formData);
    }
  }


  showLoader(formData) {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando, por favor espere...'
    }).then((res) => {
      res.present();
      this.applicantService.updateRequeriments(formData).then(data => {
        this.setValidatorControls(null, true);
        this.AlertSuccess();
        this.loadingController.dismiss();
      }).catch(e => {
        this.AlertdocumentsFormError();
        this.loadingController.dismiss();
      });
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  async AlertSuccess() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Requisitos actualizados con éxito',
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            window.location.reload();
          }
        }
      ]
    });
    await alert.present();
  }

  async AlertdocumentsFormError() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Ocurrió un error al actualizar los requisitos',
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            this.navCtrl.navigateBack('/menu');
          }
        }
      ]
    });
    await alert.present();
  }

  finishProcess() {
    if (this.documentSigns.length === 0 && (this.promissoryNoteSigned || !this.showPromissoryNote)) {
      this._requestService.getRrequestByTicket(this.ticket).then((request) => {

        if ($('[name=allowTofinish]').attr('hidden') !== 'hidden') {
          if (this.allowTofinish) {
            this.router.navigate(['/response']);
          } else {
            alert('Debes adjuntar los requisitos requeridos para continuar');
          }
        }
      });
    }
    else {
      this.alertDocuments();
    }
  }

  async openDialog(documentId) {
    const data = {
      ticket: this.ticket,
      documentSignId: documentId
    };

    this.previewDocumentSigns = [];
    const applicants = await this.createApplicant(data);
    if (applicants) {
      this.previewDocumentSigns = [];
      this._documentSignService.postPreviewDocumentByRequest(data).then((request: any) => {
        if (request.data) {
          this.prueba = request.data
          localStorage.setItem('data.document', this.prueba);
          this.router.navigate(['/documents']);
        } else {
          alert('No se pudo generar el documento');
        }
      }, (reject: any) => {
        if (reject) {
          alert('No se pudo generar el documento');
        }
      });
    }

  }

  async createApplicant(data) {
    if (data) {
      return this._documentSignService.createApplicant(data);
    }
  }

  async AlertAdjuntarDocumentos() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Debe adjuntar los requisitos requeridos para continuar',
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
        }
      ]
    });
    await alert.present();
  }

  setValidatorControl(event): void {
    const id = event.target.id;
    const control = this.documentsForm.controls[id];
    control.setValue(event.target.value);
    const legend = $(event.target.parentElement.parentElement.parentElement).parent().find('legend');

    $(event.target).removeClass('is-invalid');
    const divs = $(`div[id*='${id}']`);
    for (let d = 0; d < divs.length; d++) {
      $(divs[d]).hide();
    }

    if (!control.valid) {
      if (Object.keys(control.errors).length > 0) {
        $(legend.find('i')[0]).attr('class', 'fa fa-times-circle wrong-icon');
        $(event.target).addClass('is-invalid');
        for (const key in control.errors) {
          if (key) {
            $(`#${key}_${id}`).show();
          }
        }
      }
    } else {
      $(legend.find('i')[0]).attr('class', 'fa fa-spinner fa-spin');
    }
  }

  setValidatorControls(event, isSave): void {
    try {
      let parent;
      if (!isSave) {
        parent = $(event.target.parentElement.parentElement.parentElement);
      } else {
        parent = $('body');
      }
      const elements = parent.find('[name=legend]');

      for (let j = 0; j < elements.length; j++) {
        const inputElements = elements[j].parentElement.getElementsByTagName('input');
        let valid = true;
        for (let i = 0; i < inputElements.length; i++) {
          const id = inputElements[i].id;
          const control = this.documentsForm.controls[id];
          if (!control.valid) {
            valid = false;
          }
        }
        if (isSave) {
          elements[j].setAttribute('validate', valid ? '1' : '0');
          $(elements[j].getElementsByTagName('i'))[0].setAttribute('class', valid ? 'fa fa-check-circle correct-icon' : 'fa fa-spinner fa-spin');
        }
      }
    } catch (Exception) {
      console.log(Exception);
    }
  }

  getPicture(id) {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1024,
      targetHeight: 1024,
      quality: 100
    }

    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
        fetch(this.image)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "requisito_adjunto.jpg");
            document.getElementById(id).setAttribute('value', "requisito_adjunto.jpg");
            this.objectPhotos[id] = file;
          })
      })
      .catch(error => {
      });
  }



  openPagare() {
    this.router.navigate(['/pagare']);
  }


  backMenu() {
    this.navCtrl.navigateBack('/menu');
    this.router.ngOnDestroy;
  }

  back(event) {
    if (event === 'menu') {
      this.ConfirmarSalida(event);
    } else if (event === 'list-credits') {
      this.ConfirmarSalida(event);
    }
  }

  async ConfirmarSalida(event) {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Estás seguro que deseas salir del formulario?',
      message: '',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.navigateBack('/' + event);
            this.router.ngOnDestroy;
          }
        }
      ]
    });
    await alert.present();
  }

  async alertDocuments() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Debes firmar todos los documentos',
      message: '',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }
}

interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
  color: string;
}