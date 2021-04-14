import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Parametrics } from 'src/entities/parametrics';
import { CreditsService } from 'src/app/servicios/credits-service.service';

@Component({
  selector: 'app-list-credits',
  templateUrl: './list-credits.page.html',
  styleUrls: ['./list-credits.page.scss'],
})
export class ListCreditsPage implements OnInit {
  lista: any;
  itemsOfFilter: any[];
  parametrics: Parametrics;
  items: any;
  page: number = 1;
  name: string = "";
  direction: string = "";
  length: number = 0;
  username: string = "";
  origen: string = "";
  viability: string = "";
  state: string = "";
  newFrom: string = "";
  newTo: string = "";
  office: string = "";
  filter: string = "";
  lastPage: number;
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
      redirectTo: 'initial-form',
      color: '',
    },
    {
      icon: 'document',
      name: 'Listar Crédito',
      redirectTo: 'listar',
      color: '',
    },
  ]
  loaderToShow;

  constructor(
    public loadingController: LoadingController, 
    public alertCtrl: AlertController, 
    public router: Router, 
    private solicitanteService: AuthServiceService, 
    private creditsService: CreditsService, 
    private navCtrl: NavController, 
    public alertController: AlertController
  ) {
    this.parametrics = new Parametrics();
    this.lista = [];

    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        let color = this.parametrics.button_color;
        let color1 = '#233E50';

        this.changeValueArray(this.buttons, 'Listar Crédito', color, color1);
      })
    this.showLoader();
    
  }

  ngOnInit() {
    this.getCredits();
  }


  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando lista de créditos por favor espere...'
    }).then((res) => {
      res.present();

      this.getCredits();
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  getCredits() {
    this.creditsService.getRequestSummaryMovilAdvisors(
      this.page,
      this.name,
      this.direction,
      this.username,
      this.origen,
      this.viability,
      this.state,
      this.newFrom,
      this.newTo,
      this.filter,
      this.office
    ).subscribe(
      (credits: any) => {
        if(credits){
          this.lista = credits;
          this.itemsOfFilter = this.lista;
          this.loadingController.dismiss();
        } else {
          this.ErrorDatos();
          this.loadingController.dismiss();
        }
      }
    )
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


  async ErrorDatos() {
    const alert = await this.alertController.create({
      header: "Información",
      subHeader: 'No se encontraron datos',
      message: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SIGUIENTE',
          handler: () => {
            this.router.navigate(['/menu']);
          }
        }
      ]
    });
    await alert.present();
  }

  searchProduct(ev: any) {
    this.lista = this.itemsOfFilter;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.lista = this.lista.filter((item) => {
        return (item.identification_number.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val.toLowerCase()) > -1 || item.first_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val.toLowerCase()) > -1 || item.ticket.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val.toLowerCase()) > -1 || item.states_description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val.toLowerCase()) > -1 || item.viability_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  printBackground(index) {
    if (index % 2) { return { backgroundColor: '#e5e5e5' }; }
    return { backgroundColor: '#fff' };
  }

  detail(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: { id: id }
    };
    this.router.navigate(['/detail-credit'], navigationExtras);
  }

  backMenu() {
    this.navCtrl.navigateBack('/menu');
  }

  back(event) {
    this.navCtrl.navigateBack('/' + event);
  }
}

interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
  color: string;
}