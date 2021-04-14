import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as $ from "jquery";
import { KeyValue } from '@angular/common';
import { Applicant } from 'src/entities/applicant';
import { Parametrics } from 'src/entities/parametrics';
import * as alertify from 'alertifyjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ValidateService } from 'src/app/servicios/validate/validate.service';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';
import { IpService } from 'src/app/servicios/ip/ip.service';


@Component({
  templateUrl: './evidente.page.html',
  styleUrls: ['./evidente.page.scss'],
})
export class EvidentePage implements OnInit {
  url_navegate = '';
  applicant: Applicant;
  parametrics: Parametrics;
  ticket = null;
  numIdentificationTicket = null;
  numIdentification = null;
  questionsList = [];
  isOtp = false;
  questionActual = 1;
  responses = {};
  evidenteResponses = [];
  public otpCode: String = '';
  public typeValidation: String = '';
  continueNext;
  otpCodeudor = '';
  generatedCode: any = '';
  isCygnusValidate = false;
  isEvidenteValidate = true;
  evidentePreguntas = [];
  message;
  request: {};
  ip = '';
  applicants = [];
  applicantValidate;
  loaderToShow: Promise<void>;


  buttons: Componente[] = [
    {
      icon: 'home',
      name: 'Inicio',
      redirectTo: 'menu',
      color: 'red',
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
  ]


  constructor(
    public loadingController: LoadingController,
    private solicitanteService: AuthServiceService,
    private _ipService: IpService,
    private applicantService: ApplicantService,
    private validateService: ValidateService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private avtive: ActivatedRoute,
    private router: Router) {

    this.parametrics = new Parametrics();
    this.applicant = new Applicant();
    this.continueNext = false;
    this.ticket = localStorage.getItem('ticket');
    this.numIdentificationTicket = localStorage.getItem('numIdentificationTicket');
    this.typeValidation = `Deudor`;
    this.numIdentification = this.numIdentificationTicket;
  }

  ngOnInit(): void {
    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        let color = this.parametrics.button_color;
        let color1 = '#233E50';

        this.changeValueArray(this.buttons, 'Solicitar Crédito', color, color1);
      })
    this.initializeForm();
    this.getIp();
  }

  getIp() {
    this._ipService.getIp().subscribe(ip => {
      this.ip = ip;
    });
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

  changeValueArray(array, elementSearch, valueChange, valueOption = null) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === elementSearch) {
        array[i].color = valueChange;
      }
      else {
        array[i].color = valueOption;
      }
    }
    return array;
  }

  initializeForm() {
    this.showLoader();
    this.applicantService.getDataTicket(this.ticket, this.numIdentificationTicket).subscribe((data: any) => {
      if (data == null) { return this.processInvalidData(); }
      if ('message' in data) { return this.processInvalidData(data.message); }
      this.applicant = new Applicant();
      this.ticket = data.request.ticket;
      data.answer_dynamic_form = data.applicant.answer_dynamic_form;
      this.applicant = data.applicant;
      this.request = data.request;
      this.applicants = data.applicants.reverse();
      this.generateValidate(true);
      this.loadingController.dismiss();
    }, e => {
      this.loadingController.dismiss();
      console.log(e);
      this.processInvalidData('');
    });
  }

  generateValidate(canContinue: boolean) {
    if (canContinue) {
      if (this.applicants.length) {
        this.applicantValidate = this.applicants.pop();
      } else {
        this.applicantValidate = undefined;
        sessionStorage.setItem('validate', '1');
        this.router.navigate(['/requirements']);
      }
    }
    if (this.applicantValidate) {
      this.validateService.generateValidate({ ticket: this.ticket, applicantId: this.applicantValidate.id }).subscribe(data => {
        this.loadingController.dismiss();
        if (data.failed) {
          this.alertMessage(data.message);
        } else if (data.continue) {
          this.generateValidate(true);
        } else {
          this.numIdentification = data.identification_number;
          if (this.numIdentification != this.numIdentificationTicket) {
            this.typeValidation = 'Deudor Solidario';
          }
          if (data.questions) {
            this.questionsList = data.questions;
            this.isCygnusValidate = true;
          } else if (data.isOtp) {
            this.isOtp = true;
          } else if (data.status) {
            this.isEvidenteValidate = true;
            this.evidentePreguntas = data.preguntas;
          } else {
            this.message = data.message;
            this.alertMessage(this.message);
            this.router.navigate(['/menu']);
          }
        }
      }, error => {
        this.message = error.error.message;
        this.alertMessage(this.message);
        this.router.navigate(['/menu']);
      });
    }
  }


  resendValidate() {
    this.initializeValidate().then(data => {
      if (!data) {
        sessionStorage.clear();
        // this.SESSION_USER_RETOMAR === '' ? this.url_navegate = '' : this.url_navegate = './administrator';
        this.router.navigate([`${this.url_navegate}`]);
      } else {
        this.message = "Se ha vuelto a generar otra validación de identidad";
        this.alertMessage(this.message);
      }
    });
  }

  initializeValidate(): Promise<any> {
    return new Promise((resolve) => {
      let send: any = { applicant: this.numIdentificationTicket, ticket: this.ticket, origin };
      if (this.numIdentificationTicket !== this.numIdentification) {
        send = { applicant: this.numIdentificationTicket, ticket: this.ticket, codeudor: this.numIdentification, origin };
      }
      this.applicantService.getQuestionsValidate(send).subscribe(data => {
        if (data.status) {
          if (!data.continue) {
            if (data.isOtp) {
              this.isOtp = true;
            } else {
              this.isOtp = false;
              this.questionsList = data.questions;
            }
            resolve(true);
          } else {
            if (data.message === '') {
              this.alertMessage(data.message);
            }
            localStorage.setItem('ticket', this.ticket);
            localStorage.setItem('numIdentificationTicket', this.numIdentificationTicket);
            localStorage.setItem('validate', '1');
            localStorage.setItem('validateSocket', '1');
            this.router.navigate(['/requirements']);

          }
        } else {
          const msj = ('message' in data) ? data.message : 'No se puede procesar la solicitud en estos momentos';
          this.alertMessage(msj);
        }
      }, e => {
        const msj = ('message' in e.error) ? e.error.message : 'No se puede procesar la solicitud en estos momentos';
        this.alertMessage(msj);
        resolve(false);
      });
    });
  }

  processInvalidData(message = '') {
    const msj = (message === '') ? 'No se encontraron datos para esta solicitud' : message;
    this.alertMessage(msj);

  }

  enableNext() {
    this.continueNext = true;
  }

  saveQuestion(key) {
    const response = $('input[name=optradio]:checked').val();
    this.continueNext = false;
    this.responses[key] = response;
    this.questionActual++;
  }

  saveEvidenteQuestion(orden) {
    this.continueNext = false;
    const response = $('input[name=optradio]:checked').val();
    this.evidenteResponses.push({
      idRespuesta: response,
      idPregunta: orden
    });
    this.questionActual++;
  }

  finalizeValidate(key) {
    let send = {};
    if (this.isOtp) {
      send = {
        identification_number: this.numIdentification,
        ticket: this.ticket,
        responses: key,
        origin
      };
    } else if (this.isCygnusValidate) {
      const response = $('input[name=optradio]:checked').val();
      this.responses[key] = response;
      this.questionsList.length = 0;
      this.questionActual = 1;
      send = {
        identification_number: this.numIdentification,
        ticket: this.ticket,
        responses: this.responses,
        cygnus: this.isCygnusValidate,
        ip: this.ip
      };
    } else if (this.isEvidenteValidate) {
      const response = $('input[name=optradio]:checked').val();
      this.evidenteResponses.push({
        idRespuesta: response,
        idPregunta: key
      });
      send = {
        ticket: this.ticket,
        identification_number: this.numIdentification,
        response: this.evidenteResponses,
        evidente: this.isEvidenteValidate,
        ip: this.ip
      }
    }
    this.validateService.validateAnswers(send).subscribe(data => {
      this.isCygnusValidate = false;
      this.isEvidenteValidate = false;
      if (data.data.message) {
        this.alertMessage(data.data.message);
        this.generateValidate(true);
      } else if (data.data.Evaluacion.aprobacion) {
        this.message = "Identidad validada exitosamente";
        this.alertMessage(this.message);
        this.generateValidate(true);
      }
    }, error => {

      if (error.error.anotherTry) {
        this.alertMessage(error.error.message);
        this.evidentePreguntas = [];
        this.evidenteResponses = [];
        this.responses = {};
        this.questionActual = 1;
        this.generateValidate(false);
      } else {
        this.alertMessage(error.error.message);
        this.router.navigate(['/menu']);
      }
    })
  }

  validateOTPCodeudor() {
    if (this.otpCodeudor) {
      this.applicantService
        .validateOTPCodeudor({
          ticket: this.ticket,
          code: this.otpCodeudor
        })
        .subscribe(
          data => {
            if (data['status']) {
              $('#modalCodeudorB').trigger('click');
              alert(data['message']);
            } else {
              alert(data['message']);
            }
          },
          error => {
            alert('Ocurrió un error intente de nuevo más tarde');
          }
        );
    } else {
      alert('Ingrese un código para continuar');
    }
  }

  indexOrderAsc = (akv: KeyValue<string, any>, bkv: KeyValue<string, any>): number => {
    const a = akv.value.index;
    const b = bkv.value.index;
    return a > b ? 1 : (b > a ? -1 : 0);
  }

  backMenu() {
    this.navCtrl.navigateForward('menu');
  }

  back(event) {
    if (event == 'menu') {
      this.ConfirmarSalida(event);
    } else if (event == 'list-credits') {
      this.ConfirmarSalida(event);
    }
  }

  async ConfirmarSalida(event) {
    const alert = await this.alertCtrl.create({
      header: 'Información',
      subHeader: 'Está seguro que desea salir del formulario?',
      message: '',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Ok',
          handler: () => {
            this.navCtrl.navigateBack('/' + event);
            this.router.ngOnDestroy;
          }
        }
      ]
    });
    await alert.present();
  }

  async alertMessage(Message) {
    const alert = await this.alertCtrl.create({
      header: "Información",
      subHeader: Message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
          }
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