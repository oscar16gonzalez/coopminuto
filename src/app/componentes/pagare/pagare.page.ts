import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Parametrics } from 'src/entities/parametrics';
import { PromissoryNoteService } from 'src/app/servicios/promissory-note/promissory-note.service';
import { IpService } from 'src/app/servicios/ip/ip.service';
import { Applicant } from 'src/entities/applicant';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-pagare',
  templateUrl: './pagare.page.html',
  styleUrls: ['./pagare.page.scss'],
})
export class PagarePage implements OnInit {
  applicant: Applicant;
  request: {};
  pagareDocument = '';
  pagareCodeSent = false;
  ticket;
  document;
  ip = '';
  cellphone;
  loaderToShow: any;
  hasCodeudor = null;
  CodeudorPG = false;
  codeudor = 'false';
  codePagare = '';
  codePagareCodeudor = '';
  msj: string;
  pagareDocument1: string;
  pagareEmail: string;
  pagareTikcet: string;
  pagareCelphone: string;
  parametrics: Parametrics;
  pdfBase64: String;
  applicants: [] = [];
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
  ]

  constructor(private fileOpener: FileOpener, private solicitanteService: AuthServiceService, private _prommisoryNoteService: PromissoryNoteService, public router: Router, private route: ActivatedRoute, public alertController: AlertController, public loadingController: LoadingController, private navCtrl: NavController, private _ipService: IpService) {
    this.parametrics = new Parametrics();
    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        const color = this.parametrics.button_color;
        const color1 = '#233E50';
        this.changeValueArray(this.buttons, 'Solicitar Crédito', color, color1);
      }).catch(error => { console.log(error); });
  }

  ngOnInit(): void {
    this.ticket = localStorage.getItem('ticket');
    this.document = localStorage.getItem('numIdentificationTicket');
    this.cellphone = localStorage.getItem('cellphone');

    this.solicitanteService.getFullDataTicket({ ticket: this.ticket, identification: this.document }).subscribe(
      (response => {
        this.applicant = response.applicants;
        this.request = response.request;
      }), (e => {
        console.log(e);
      })
    );

    this.AlertPagareDigital();
    this.sendCodePagare();
    this.getIp();
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

  async AlertPagareDigital() {
    const alert = await this.alertController.create({
      header: 'Pagaré Digital',
      subHeader: `Se ha enviado un código a tu celular para la firma del pagaré`,
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'ACEPTAR',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }

  getIp() {
    this._ipService.getIp().subscribe(ip => {
      this.ip = ip;
    });
  }

  sendCodePagare() {


    this._prommisoryNoteService.generateOtp(this.ticket).subscribe((generateOtp: any) => {
      this._prommisoryNoteService.preview(this.ticket).subscribe((preview: any) => {
        const byteArray = new Uint8Array(atob(preview.pdfPagare.contenido).split('').map(char => char.charCodeAt(0)));
        // const blob = new Blob([byteArray], { type: 'application/pdf' });
        // this.pdfBase64 = window.URL.createObjectURL(blob);
        const file = new Blob([byteArray], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }, error => {
        this.msj = "Información, Ocurrió un error al obtener los datos del servidor, por favor inténtalo más tarde";
        this.AlertMessageCodePagare();
      });
      this.applicants = generateOtp.applicants;
    }, (error) => {
      this.msj = "Información, Ocurrió un error al obtener los datos del servidor, por favor inténtalo más tarde";
      this.AlertMessageCodePagare();
    });
  }

  resendOtp() {
    this._prommisoryNoteService.generateOtp(this.ticket).subscribe((generateOtp: any) => {
      this.msj = "Hemos reenviado el código nuevamente";
      this.AlertMessageCodePagare();
      this.applicants = generateOtp.applicants;
    }, error => {
      this.msj = "Ha ocurrido un error al enviár los códigos, inténtalo de nuevo más tarde";
      this.AlertMessageCodePagare();
    });
  }

  async validateCodes() {
    const code = [{ identification: this.document, code: this.codePagare }]

    try {
      const response = await this._prommisoryNoteService.validateOtp(this.ticket, this.ip, code);
      if (response.areAlreadySigned) {
        this.msj = "El pagaré ya ha sido firmado";
        this.AlertMessageCodePagare();
      } else if (!response.validate) {
        this.msj = "Los códigos no coinciden inténtalo de nuevo";
        this.AlertMessageCodePagare();
      } else {
        this.msj = "El pagaré ha sido firmado con exito";
        this.AlertsvalidatePagare();
      }
    } catch (error) {
      this.msj = "Información, Ocurrió un error al obtener los datos del servidor, por favor inténtalo más tarde";
      this.AlertMessageCodePagare();
    }
  }

  LoaderPagareCode() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando, por favor espere...'
    }).then((res) => {
      res.present();
      this.sendCodePagare();
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  async AlertsendCodePagareError() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Ha ocurrido un error intente más tarde',
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

  LoaderValidatePagareCode(data) {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando, por favor espere...'
    }).then((res) => {
      res.present();
      this.validateCodePagare(data);
      res.onDidDismiss().then((dis) => {
      }).catch(error => { console.log(error); });
    });
  }

  validateCodePagare(data) {
    let isRight = this.codePagare !== '';
    // if (isRight && this.hasCodeudor) { isRight = this.codePagareCodeudor !== ''; }
    if (isRight) {
      this.solicitanteService.validateCodePagare({ ticket: this.pagareTikcet, code: this.codePagare, codeCodeudor: this.codePagareCodeudor }).subscribe(
        (response) => {
          this.pagareCodeSent = true;
          this.msj = response.message;
          this.codePagare = '';
          this.codePagareCodeudor = '';
          if (!response.status) {
            if (response.another_try) {
              this.AlertErrorCodePagareUltimoIntento();
              this.loadingController.dismiss();
            } else {
              this.loadingController.dismiss();
              this.AlertMessageErrorCodePagare();
            }
          } else {
            this.AlertsvalidatePagare();
            this.loadingController.dismiss();
          }
        },
        (error) => {
          console.log(error);
          // this.AlertsendCodePagareError();
          this.loadingController.dismiss();
        }
      );
    } else {
      this.loadingController.dismiss();
    }
  }

  async AlertsvalidatePagare() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: this.msj,
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                ticket: this.pagareTikcet,
              }
            };

            this.router.navigate(['/response'], navigationExtras);
          }
        }
      ]
    });
    await alert.present();
  }

  async AlertMessageCodePagare() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: this.msj,
      message: '',
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

  async AlertMessageErrorCodePagare() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: this.msj,
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

  async AlertErrorCodePagareUltimoIntento() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: this.msj,
      message: '',
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
}

interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
  color: string;
}
