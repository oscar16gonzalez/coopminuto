import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Router } from "@angular/router";
import { AlertController, LoadingController } from '@ionic/angular';
import { Parametrics } from 'src/entities/parametrics';
import { AuthService } from 'src/app/servicios/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  parametrics: Parametrics;
  email: string;
  password: string;
  ticket;
  cedula;
  navCtrl: any;
  msj: any;
  loaderToShow: Promise<void>;

  constructor(
    public loadingController: LoadingController, 
    private authService: AuthServiceService, 
    private auth: AuthService, 
    public router: Router, 
    public alertController: AlertController
    ) {
    this.parametrics = new Parametrics();

    this.authService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
      })
  }

  //Servicio que realiza la peticion del usuario y contraseña
  // servicio con api generada en firebesa para autenticacion de usuario

  onSubmitLogin() {
    this.showLoader();
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Validando identidad por favor espere...'
    }).then((res) => {
      res.present();

      this.nextMenu();
      res.onDidDismiss().then((dis) => {
      });
    });

  }

  nextMenu() {
    this.auth.login({userEmail: this.email, password: this.password}).subscribe(res => {
      localStorage.setItem('user_email', this.email)
      this.email='';
      this.password='';
      this.router.navigate(['/menu']);
      this.loadingController.dismiss();
    }, err => this.presentAlert())
  }

  async presentAlert() {
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      header: "Información",
      subHeader: 'credenciales Inválidas',
      backdropDismiss: false,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}