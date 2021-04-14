import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Parametrics } from 'src/entities/parametrics';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';

@Component({
  selector: 'app-modal-response',
  templateUrl: './modal-response.page.html',
  styleUrls: ['./modal-response.page.scss'],
})
export class ModalResponsePage implements OnInit {
  @Input() ticket;
  private parametrics: Parametrics;
  finalLetter: Array<Object>[];
  loaderToShow: Promise<void>;


  constructor(
    public loadingController: LoadingController,
    private solicitanteService: AuthServiceService,
    public modalCtrl: ModalController,
    private applicantService: ApplicantService,
  ) {
    this.parametrics = new Parametrics();
  }

  ngOnInit() {
    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
      });

    this.showLoader();
    this.response();
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

  response() {
    const ticket = this.ticket;
    this.applicantService.getResponses({ ticket }).subscribe(responses => {
      this.loadingController.dismiss();
      const finalLetter = responses['responseLetters'].find(x => (!x.isfile) && (x.type === 'web_response'));
      this.finalLetter = finalLetter.valor;
    });
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
