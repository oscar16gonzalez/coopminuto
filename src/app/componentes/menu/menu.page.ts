import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth/auth.service';

@Component({
  selector: 'app-menu1',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class Menu1Page implements OnInit {
  // public parametrics: Parametrics;
  ticket: string;
  cedula: string;
  msj: any;
  loading: any;
  loaderToShow: Promise<void>;
  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthServiceService, private auth: AuthService, public router: Router, private navCtrl: NavController, public alertController: AlertController, public loadingController: LoadingController) {

  }

  ionViewDidEnter() {
    document.addEventListener('backbutton', function (e) {
    }, false);
  }

  ngOnInit() {

  }

  solicitar() {
    this.loadingController.create({
      message: 'Cargando...'
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
    setTimeout(() => {
      this.loading.dismiss();
      //this.consultarSygnus();
      this.navCtrl.navigateForward(`initial-form`);
    }, 1000);
  }

  calculadora() {
    this.loadingController.create({
      message: 'Cargando...'
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
    setTimeout(() => {
      this.loading.dismiss();
      this.navCtrl.navigateForward(`calculadora`);
    }, 1000);
  }

  retomar() {
    this.loadingController.create({
      message: 'Cargando...'
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
    setTimeout(() => {
      this.loading.dismiss();
      this.retomarcredito();
    }, 1000);
  }

  listar() {
    this.loadingController.create({
      message: 'Cargando...'
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
    setTimeout(() => {
      this.loading.dismiss();
      this.navCtrl.navigateForward(`list-credits`);
    }, 1000);
  }


  async consultarSygnus() {
    const alert = await this.alertController.create({
      header: '¡Bienvenido!',
      subHeader: 'Para hacer mas fácil tu experiencia, podemos comenzar por definir que tipo de crédito deseas e ingresar tu numero de identificacion ',
      backdropDismiss: false,

      inputs: [
        {
          name: 'ticket',
          type: 'text',
          placeholder: '  Seleccione modalidad de crédito'
        },
        {
          name: 'cedula',
          type: 'text',
          placeholder: '  Cédula'
        },
      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Ok',
          handler: (data) => {
            localStorage.setItem('numIdentificationTicket', data.cedula);
            localStorage.setItem('ticket', data.ticket);
            const dataForm = {
              identification: data.cedula,
              ticket: data.ticket,


            };
            this.showLoader(dataForm);

          }
        }
      ]
    });

    await alert.present();
  }


  async retomarcredito() {
    const alert = await this.alertController.create({
      header: 'INGRESA LOS DATOS PARA RETOMAR TU SOLICITUD',
      backdropDismiss: false,
      // subHeader : 'INGRESAR CÓDIGO',

      inputs: [
        {
          name: 'cedula',
          type: 'text',
          placeholder: '  Número de identificación'
        },
        {
          name: 'ticket',
          type: 'text',
          placeholder: '  TICKET'
        },
      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            if (data.cedula == data.ticket) {
              this.msj = "Petición o solicitante no existente."
              this.Alert(this.msj);
            } else {
              const dataForm = {
                identification: data.cedula,
                ticket: data.ticket,
              };

              localStorage.setItem('ticket', dataForm.ticket);
              localStorage.setItem('numIdentificationTicket', dataForm.identification);
              this.showLoader(dataForm);
            }
          }
        }
      ]
    });

    await alert.present();
  }



  showLoader(dataForm) {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando, por favor espere...'
    }).then((res) => {
      res.present();
      this.validateTicket(dataForm);
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  validateTicket(dataForm) {
    this.loadingController.dismiss();
    this.authService.getDataTicket(dataForm.ticket, dataForm.identification).subscribe(dataJWT => {
      if (dataJWT['message']) {
        this.msj = dataJWT['message'];
        this.Alert(this.msj);
      } else {
        const cedula = dataForm.identification;
        const ticket = dataForm.ticket;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            cedula: cedula, ticket: ticket
          }
        };
        this.router.navigate(['/evidente'], navigationExtras);
      }
    }, e => {
      this.msj = e.error[0].message;
      console.log(e.error);

      this.Alert(this.msj);
    });
  }


  async Alert(message) {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: message,
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

  cerrarSesion() {
    this.ConfirmarSalida();
  }

  async ConfirmarSalida() {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: 'Seguro deseas cerrar sesión?',
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
            this.auth.logout();
            this.navCtrl.navigateBack('/login');
          }
        }
      ]
    });
    await alert.present();
  }
}
