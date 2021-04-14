import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Parametrics } from 'src/entities/parametrics';
import * as $ from "jquery";
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-response',
  templateUrl: './response.page.html',
  styleUrls: ['./response.page.scss'],
})
export class ResponsePage implements OnInit {
  pdfPagare;
  documentPagare = '';
  ticket = null;
  haveAdditionalFiles: Boolean = false;
  finalLetter: Array<Object>[];
  additionalFiles: Array<Object>[];
  isPagare: Boolean = false;
  parametrics: Parametrics;
  srcLoading = 'assets/images/logo.png';
  msj;
  loaderToShow: any;
  sentEmail = false;
  sentSms = false;
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

  constructor(private applicantService: AuthServiceService, public loadingController: LoadingController, private navCtrl: NavController, private router: Router, private route: ActivatedRoute, public alertController: AlertController) {

    this.parametrics = new Parametrics();
    this.applicantService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        let color = this.parametrics.button_color;
        let color1 = '#233E50';

        this.changeValueArray(this.buttons, 'Solicitar Crédito', color, color1);
      });

    this.ticket = localStorage.getItem('ticket');

  }

  ngOnInit() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando por favor espere...'
    }).then((res) => {
      res.present();
      this.response();
      res.onDidDismiss().then((dis) => {
      });
    });
  }


  response() {
    this.sendResponseSMS();
    this.sendResponseMail();
    this.applicantService.getResponses({ ticket: this.ticket }).subscribe(
      (data) => {
        this.loadingController.dismiss();
        $('.loading').hide();
        if ('message' in data) {
          this.msj = data.message;
          this.alertError(this.msj);
        } else {
          this.finalLetter = data['responseLetters'].find(x => (!x.isfile) && (x.type === 'web_response')).valor;
          this.additionalFiles = data['responseLetters'].filter(x => x.viab_lett_isfile === true);
          this.haveAdditionalFiles = data['responseLetters'].length > 0;
          this.isPagare = data['isPagare'];
          this.documentPagare = data['documentPagare'];
        }
        
      }, (error) => {
        this.loadingController.dismiss();
        this.msj = 'Información, No tiene permiso para acceder a este paso';
        this.alertError(this.msj);
      }
    ); 
  }

  async alertError(message) {
    const alert = await this.alertController.create({
      header: "Información",
      subHeader: message,
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: (data) => {
            this.router.navigate(['/menu']);
          }
        }
      ]
    });
    await alert.present();
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

  sendResponseSMS() {
    this.applicantService.sendResponseSMS({ ticket: this.ticket }).subscribe(
      (data) => {
        if (data.status && !data.sent) {
          alert(data.message);
        } else if (data.status && data.sent) {
          this.sentSms = true;
        } else {
          alert(data.message);
        }
      }, (error) => {
        console.log(error);
        alert('Información, Se ha generado un error al enviar el correo de respuesta.');
      }
    );
  }

  sendResponseMail() {
    this.applicantService.sendResponseEmail({ ticket: this.ticket }).subscribe(
      (data) => {
        if (data.status && !data.sent) {
          alert(data.message);
        } else if (data.status && data.sent) {
          this.sentEmail = true;
        } else {
          alert(data.message);
        }
      }, (error) => {
        console.log(error);
        alert('Información, Se ha generado un error al enviar el correo de respuesta.');
      }
    );
  }


  async alertSendResponse(data) {
    const alert = await this.alertController.create({
      header: "Información",
      subHeader: data.message,
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: (data) => {
          }
        }
      ]
    });
    await alert.present();
  }

  finishIt() {
    this.navCtrl.navigateBack('/menu');
    this.router.ngOnDestroy;
  }

  backMenu() {
    this.navCtrl.navigateBack('menu');
    this.router.ngOnDestroy;
  }

  back(event) {
    if (event == 'menu') {
      this.ConfirmarSalida(event);
    } else if (event == 'list-credits') {
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
          handler: () => {

          }
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