import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Parametrics } from 'src/entities/parametrics';

@Component({
  selector: 'app-modal-terminos',
  templateUrl: './modal-terminos.page.html',
  styleUrls: ['./modal-terminos.page.scss'],
})
export class ModalTerminosPage implements OnInit {
  // parametrics: any;
  private parametrics: Parametrics;

  constructor(private solicitanteService: AuthServiceService, public modalCtrl: ModalController) {
    this.parametrics = new Parametrics();
  }

  ngOnInit() {
    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
      });
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
