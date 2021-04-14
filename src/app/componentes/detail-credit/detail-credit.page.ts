import { Component, OnInit } from '@angular/core';
import * as alertify from 'alertifyjs';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Parametrics } from 'src/entities/parametrics';
import { environment } from 'src/environments/environment';
import { RequestService } from 'src/app/servicios/request/request.service';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as $ from "jquery";


@Component({
  selector: 'app-detail-credit',
  templateUrl: './detail-credit.page.html',
  styleUrls: ['./detail-credit.page.scss'],
})
export class DetailCreditPage implements OnInit {

  currentRequest: any;
  serverUrl = '';
  totalProducts: Number = 0;
  arrayRequeriments: Array<any> = [];
  arrayRequerimentsSelected: Array<any> = [];
  emailSubmitted: String = '';
  articles_ = null;
  tableFiles = null;
  dtOptions = {};
  currentRoleUser = null;
  arrayActions = null;
  showDocumentosGenerados = false;
  files = [];



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
      redirectTo: 'list-credits',
      color: '',
    },
  ]
  loaderToShow: Promise<void>;
  parametrics: Parametrics;

  constructor(
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private solicitanteService: AuthServiceService,
    private route: ActivatedRoute,
    private applicantService: AuthServiceService,
    private alertCtrl: AlertController,
    private service: RequestService,
    private adminService: AdminService,
    private storageService: StorageService,



  ) {
    this.parametrics = new Parametrics();


    this.solicitanteService.getCustomerParametrics()
      .then(data => {
        this.parametrics = data;
        let color = this.parametrics.button_color;
        let color1 = '#233E50';

        this.changeValueArray(this.buttons, 'Listar Crédito', color, color1);
      })
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        const id = params.id;
        this.showLoader(id);
      }
    });
  }

  showLoader(id) {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando detalles de crédito, por favor espere...'
    }).then((res) => {
      res.present();

      this.loadData(id);
      res.onDidDismiss().then((dis) => {
      });
    });
  }

  loadData(id) {
    this.service.getApplicantSummary(id)
      .then(result => {
        this.loadingController.dismiss();
        if ('message' in result) { return this.processInvalidData(); }
        const request = result.request;
        request.files = result.files;
        this.currentRequest = this.handleResult(request);

        if (this.currentRequest.productTypeInterestTerm) {
          const months = this.currentRequest.productTypeInterestTerm.term / 30;
          this.currentRequest.productTypeInterestTerm.term = months.toString().length < 2 ? `0${months}` : `${months}`
        }
        this.adminService.getAllActionsByRequest(this.currentRequest['ticket'])
          .then(data => {
            if (data['actions']) {
              this.arrayActions = data['actions'];
            } else {
              this.arrayActions = false;
            }
          })
          .catch(error => {
            console.log(error);
          });

        this.showDocumentosGenerados = (this.currentRoleUser === 1 || this.currentRoleUser === 4);

        this.calculateTotalProducts();
        this.adminService.getAllFilesDetailCredit(this.currentRequest['ticket']).subscribe(data => {
          this.files = data;
        })
        $['size'] = function () { return this.length; };
      })
      .catch(err => {
        console.log(err);

        alertify.error('Ocurrió un error al obtener el resumen de la solicitud');
      });
  }

  requerimentSelected(requerimentSelected_) {
    requerimentSelected_.is_selected = requerimentSelected_.is_selected === 0 ? 1 : 0;
    if (requerimentSelected_.is_selected === 0) {
      this.arrayRequerimentsSelected = this.arrayRequerimentsSelected.filter((element, index) => {
        return requerimentSelected_.id !== this.arrayRequerimentsSelected[index].id;
      });
    }
    if (requerimentSelected_.is_selected === 1) {
      const if_exist = this.arrayRequerimentsSelected.find((element, index) => {
        return requerimentSelected_.id === this.arrayRequerimentsSelected[index].id;
      });
      if (!if_exist) {
        this.arrayRequerimentsSelected.push(requerimentSelected_);
      }
    }
  }

  parseRequerimentsToHTML() {
    let result = '<ul>';
    for (const req of this.arrayRequerimentsSelected) {
      if (req) {
        result = result.concat(`<li>${req.nombre}</li>`);
      }
    }
    result = result.concat('</ul>');
    return result;
  }

  handleResult(result) {
    result.sent_requirements_list = result.sent_requirements_list ? result.sent_requirements_list : '[]';
    this.arrayRequerimentsSelected = JSON.parse(result.sent_requirements_list);
    this.emailSubmitted = this.parseRequerimentsToHTML();
    result.applicants[0].fullname = `${result.applicants[0].first_name} ${result.applicants[0].second_name} ${result.applicants[0].first_surname} ${result.applicants[0].second_surname}`
    if (result.applicants[0].response_form !== '{}') {
      result.applicants[0].response_form = this.parseDynamicResponse(result.applicants[0].response_form);
    } else {
      result.applicants[0].response_form = [];
    }
    if (result.applicants[1]) {
      if (result.applicants[1].response_form !== '{}') {
        result.applicants[1].response_form = this.parseDynamicResponse(result.applicants[1].response_form);
      } else {
        result.applicants[1].response_form = [];
      }
    }
    if (result.list_of_products !== '{}') {
      result.list_of_products = JSON.parse(result.list_of_products);
    } else {
      result.list_of_products = [];
    }
    if (result.cod_answer_dynamic_form) {
      result.cod_answer_dynamic_form = result.cod_answer_dynamic_form.replace(/cod_/g, '');
      result.cod_answer_dynamic_form = JSON.parse(result.cod_answer_dynamic_form);
    } else {
      result.cod_answer_dynamic_form = [];
    }
    if (result.analyst_comment_request !== "'{}'") {
      result.analyst_comment_request = JSON.parse(result.analyst_comment_request);
    } else {
      result.analyst_comment_request = [];
    }
    for (let i = 0; i < result.responses.length; i++) {
      result.responses[i].value = JSON.parse(result.responses[i].value);
      result.responses[i].elements = JSON.parse(result.responses[i].elements);
      for (let j = 0; j < result.responses[i].value.length; j++) {
        result.responses[i].value[j]['ext'] = '';
        if (result.responses[i].value[j].tipo === 'file') {
          const valueFile = result.responses[i].value[j].valor;
          if (valueFile !== '') {
            const sepp = valueFile.split('.');
            result.responses[i].value[j]['ext'] = sepp[sepp.length - 1];
          }
        }
      }
    }

    if (result.applicants[1]) {
      result.applicants[1].fullname = `${result.applicants[1].first_name} ${result.applicants[1].second_name} ${result.applicants[1].first_surname} ${result.applicants[1].second_surname}`
      result.applicants[1].identityValidation = result.identityValidations.find((identityValidations) => identityValidations.identification_number == result.applicants[1].identification_number)
    }

    if (!result.product_amount) { result.product_amount = 0; } else { result.product_amount = Number(result.product_amount).toFixed(2); }
    if (!result.initial_fee) { result.initial_fee = 0; } else { result.initial_fee = Number(result.initial_fee).toFixed(2); }
    if (!result.fixed_monthly_fee) { result.fixed_monthly_fee = 0; } else { result.fixed_monthly_fee = Number(result.fixed_monthly_fee).toFixed(2); }
    if (!result.administration_fee) { result.administration_fee = 0; } else { result.administration_fee = Number(result.administration_fee).toFixed(2); }
    if (!result.total_monthly_fixed_fee) { result.total_monthly_fixed_fee = 0; } else { result.total_monthly_fixed_fee = Number(result.total_monthly_fixed_fee).toFixed(2); }

    // result.files = JSON.parse(result.files);

    return result;
  }

  parseDynamicResponse(response) {
    const groups = [];
    for (const index in response) {
      if (index) {
        const itemSplitted = index.split('(');
        if (itemSplitted.length > 1) {
          const groupName = itemSplitted[1].replace(')', '');
          const position = groups.findIndex(x => x.name === groupName);
          if (position === -1) {
            const values = [];
            values.push({ name: itemSplitted[0], value: response[index] });
            groups.push({ name: groupName, values: values });
          } else {
            groups[position].values.push({ name: itemSplitted[0], value: response[index] });
          }
        }
      }
    }
    return groups;
  }

  calculateTotalProducts() {
    let total = 0;
    if (this.currentRequest.list_of_products) {
      for (let i = 0; i < this.currentRequest.list_of_products.length; i++) {
        total = total + this.currentRequest.list_of_products[i].amount;
      }
    }
    this.totalProducts = total - Number(this.currentRequest.initial_fee);
  }

  processInvalidData() {
    alertify.alert('Información', 'No se encontraron datos para esta solicitud', () => { }).set({ closableByDimmer: false, movable: false });
  }

  back(event) {
    if (event == 'menu') {
      this.navCtrl.navigateBack('/' + event);
    } else if (event == 'initial-form') {
      this.navCtrl.navigateBack('/' + event);
    } else if (event == 'list-credits') {
      this.navCtrl.navigateBack('/' + event);
    }
  }
}

interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
  color: string;
}