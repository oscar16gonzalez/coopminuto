import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApplicantService } from 'src/app/servicios/applicant/applicant.service';

@Component({
  selector: 'app-applicant-form',
  templateUrl: './applicant-form.component.html',
  styleUrls: ['./applicant-form.component.scss']
})
export class ApplicantFormComponent implements OnInit {
 
  @Input() typeApplicant: number;
  @Input() dynamicFormData: any[] = [];
  @Input() applicantForm: FormGroup;
  @Input() personalRefCuantity: number;
  @Input() familyRefCuantity: number;
  @Input() sectionPermissions: any[];
  @Input() numeroIdentification: any;
  familyReferences = [];
  personalReferences = [];
  permissions = [];
  productSectionId: number;

  constructor(public formBuilder: FormBuilder, private applicantService: ApplicantService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.applicantForm.status !== "DISABLED") {
      this.createListToPaintReferences();
    }

    if (changes.sectionPermissions && changes.sectionPermissions.currentValue) {
      const previusValue = changes.sectionPermissions.previousValue || []
      const currentValue = changes.sectionPermissions.currentValue || [];
      const differences = previusValue.filter(x => !currentValue.some(y => x.section_identifier === y.section_identifier));
      differences.forEach(difference => {
        if (this.applicantForm.contains(difference.section_identifier)) {
          this.applicantForm.removeControl(difference.section_identifier)
        }
      })
      this.permissions = currentValue;
    }
  }

  existsPermission(identifier) {
    return this.permissions.some(permission => permission.section_identifier === identifier)
  }

  createListToPaintReferences() {
    this.familyReferences = new Array(this.familyRefCuantity);
    this.personalReferences = new Array(this.personalRefCuantity);
  }

}
