import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { DocumentSignService } from 'services/document-sign/document-sign.service';
// import { RequestService } from 'services/request/request.service';
import { MatDialog } from '@angular/material/dialog';
// import { ModalsigningDocumentsComponent } from '../modalsigning-documents/modalsigning-documents.component';
import { FormGroup } from '@angular/forms';
// import { CustomerDocumentsComponent } from 'app/credit-request/customer-documents/customer-documents.component';
import * as alertify from 'alertifyjs';
// import { StorageService } from '@shared/services/storage.service';
import { Router } from '@angular/router';
// import { ParametricService } from 'services/parametric/parametric.service';
import { Parametrics } from 'src/entities/parametrics';
// import { ShowPdfBase64Component } from '../show-pdf-base64/show-pdf-base64.component';
// import { PromissoryNoteService } from 'services/promissory-note/promissory-note.service';
import { DocumentSignService } from 'src/app/servicios/document-sign/document-sign.service';
import { RequestService } from 'src/app/servicios/request/request.service';
import { ParametricService } from 'src/app/servicios/parametric/parametric.service';
import { PromissoryNoteService } from 'src/app/servicios/promissory-note/promissory-note.service';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-signing-documents',
  templateUrl: './signing-documents.component.html',
  styleUrls: ['./signing-documents.component.scss']
})
export class SigningDocumentsComponent implements OnInit, OnChanges {

  @Input() ticket;
  @Input() buttonColor;
  @Input() SESSION_USER_DOCUMENTS_DOC: String = this.storageService.getCurrentUser() ? this.storageService.getCurrentUser() : '';
  @Input() dataRequirements;
  @Input() allowTofinish;
  documentSigns: any;
  previewDocumentSigns: any;
  objectPhotos = {};
  documentsForm: FormGroup;
  showPromissoryNote: Boolean = false;
  promissoryNoteSigned: Boolean = false;
  request: {};
  url_navegate = '/';
  validateOtpCodeudor = false;
  parametrics: Parametrics;

  constructor(private storageService: StorageService
    , private router: Router
    , private _documentSignService: DocumentSignService
    , private _requestService: RequestService
    // , private _customerDocumentsComponent: CustomerDocumentsComponent
    , private _parametric: ParametricService
    , private _prommisoryNoteService: PromissoryNoteService
    , public dialog: MatDialog) { }

  ngOnInit() {
    this._parametric.sharedParametric.subscribe(parametric => {
      this.parametrics = parametric;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataRequirements']) {
      this.dataRequirements = this.dataRequirements;
    }
    if (changes['allowTofinish']) {
      this.allowTofinish = this.allowTofinish;
      if (this.allowTofinish) {
        this.listDocumentSign(this.ticket);
        this._prommisoryNoteService.needSignPromissoryNote(this.ticket).subscribe((showPromissoryNote: boolean) => this.showPromissoryNote = showPromissoryNote);
        this._prommisoryNoteService.areAlreadySigned(this.ticket).subscribe((signed: any) => this.promissoryNoteSigned = signed.areAlreadySigned);
      }
    }
  }

  listDocumentSign(ticket) {
    if (ticket) {
      this.documentSigns = [];
      this._documentSignService.listDocumentSign(ticket).then((request: any) => {
        this.documentSigns = request;
      });
    }
  }

  async openDialog(documentId) {
    const data = {
      ticket: this.ticket,
      documentSignId: documentId
    };
    const applicants = await this.createApplicant(data);
    if (applicants) {
      this.previewDocumentSigns = [];
      this._documentSignService.postPreviewDocumentByRequest(data).then((request: any) => {
        if (request.data) {
          this.previewDocumentSigns = {
            ticket: this.ticket,
            documentSignId: documentId,
            applicants,
            data: request.data
          };
          } else {
          alertify.alert('No se pudo generar el documento').setting({label : 'Aceptar', closableByDimmer: false, movable: false });
        }
      }, (reject: any) => {
        if (reject) {
          alertify.alert('No se pudo generar el documento').setting({label : 'Aceptar', closableByDimmer: false, movable: false });
        }
      });
    }
  }

  async createApplicant(data) {
    if (data) {
      return this._documentSignService.createApplicant(data);
    }
  }

  // processForm(process) {
  //   this._customerDocumentsComponent.processForm(process);
  // }


  finishProcess() {
    if (this.documentSigns.length === 0 && (this.promissoryNoteSigned || !this.showPromissoryNote)) {
      this._requestService.getRrequestByTicket(this.ticket).then((request) => {
        if (request['viability_id'] === 4) {
          this.url_navegate = this.SESSION_USER_DOCUMENTS_DOC === '' ? '/response' : './administrator/panel-opc/response-cred';
          this.router.navigate([`${this.url_navegate}`]);
        } else {
          if ($('[name=allowTofinish]').attr('hidden') !== 'hidden') {
            if (this.allowTofinish) {
              if (request['viability_id'] === 4 && this.validateOtpCodeudor) {
                this.url_navegate = this.SESSION_USER_DOCUMENTS_DOC === '' ? '/response' : './administrator/panel-opc/response-cred';
                this.router.navigate([`${this.url_navegate}`]);
                return true;
              } else if (request['viability_id'] === 4 && !this.validateOtpCodeudor) {
                alertify.error('No se han completado los campos obligatorios del Deudor Solidario');
                return false;
              }
              this.url_navegate = this.SESSION_USER_DOCUMENTS_DOC === '' ? '/response' : './administrator/panel-opc/response-cred';
              this.router.navigate([`${this.url_navegate}`]);
            } else {
              alertify.error('Debes adjuntar los requisitos requeridos para continuar');
            }
          }
        }
      });
    } else {
      alertify.error('Debes firmar todos los documentos');
    }
  }
}
