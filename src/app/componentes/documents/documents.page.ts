import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Parametrics } from 'src/entities/parametrics';
import { DocumentSignService } from 'src/app/servicios/document-sign/document-sign.service';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  data;
  documentSignId;
  document;
  message;
  ticket;
  documents = false;
  btnDocuments = true;
  parametrics: Parametrics;
  codePagare = '';
  documentSigns;
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

  constructor(public router: Router, private navCtrl: NavController, private solicitanteService: AuthServiceService, private _documentSignService: DocumentSignService, public alertController: AlertController) {
    this.parametrics = new Parametrics();
    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        const color = this.parametrics.button_color;
        const color1 = '#233E50';
        this.changeValueArray(this.buttons, 'Solicitar Crédito', color, color1);
      }).catch(error => { console.log(error); });

  }

  ngOnInit() {
    this.data = localStorage.getItem('data.document');
    this.documentSignId = localStorage.getItem('documentSignId');
    this.ticket = localStorage.getItem('ticket');
    this.document = localStorage.getItem('numIdentificationTicket');
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

  generateCode() {
    this.documents = true;
    this.btnDocuments = false;
    const data = {
      ticket: this.ticket,
      documentSignId: parseInt(this.documentSignId),
    };

    const generateCode = this._documentSignService.postGenerateCodeDocumentByRequest(data).then((data: any) => {
      if (data.data) {
      } else {
        this.message = 'Alerta, Hubo un error al solicitar la información, inténtalo más tarde';
        this.AlertMessageCodeLibranza(false);
      }
    }, error => {
      this.message = 'Hubo un error al solicitar la información, inténtalo más tarde';
      this.AlertMessageCodeLibranza(false);
    });
  }

  async validateCodes() {
    const code = [{ identification: this.document, code: this.codePagare }]
    const data = {
      ticket: this.ticket,
      documentSignId: parseInt(this.documentSignId),
      signs: code
    };
    this._documentSignService.postValidateOtpCode(data).then((data: any) => {
      if (data) {
        this.message = 'Se firmó correctamente el documento';
        this.AlertMessageCodeLibranza(true);
      }
    }, (reject: any) => {
      if (reject.error && reject.error.data) {
        if (reject.error.data.errors.find(element => element.code === '002')) {
          this.message = 'Lo sentimos, has fallado el número máximo de intentos para firmar el documento';
          this.AlertMessageCodeLibranza(true);
        } else if (reject.error.data.errors.find(element => element.code === '004')) {
          this.message = 'Código incorrecto, vuelve a intentarlo por favor';
          this.AlertMessageCodeLibranza(true);
        } else {
          this.message = 'La petición falló, vuelve a intetarlo más tarde';
          this.AlertMessageCodeLibranza(true);
        }
      } else {
        this.message = 'La petición falló, vuelve a intetarlo más tarde';
        this.AlertMessageCodeLibranza(true);
      }
    });
  }


  async AlertMessageCodeLibranza(status) {
    const alert = await this.alertController.create({
      header: 'Información',
      subHeader: this.message,
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            if (status == true) {
              this.router.navigate(['/response']);
            }
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