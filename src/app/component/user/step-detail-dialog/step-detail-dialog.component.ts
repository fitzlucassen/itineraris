import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatSnackBar, MatDialogRef } from '@angular/material';

import { ItineraryService } from '../../../service/itinerary.service';
import { ItineraryStep } from '../../../model/itinerary-step';
import { StepDetail } from '../../../model/step-detail';
import { ItineraryDetailService } from '../../../service/itineraryDetail.service';

@Component({
    selector: 'app-step-detail-dialog',
    templateUrl: './step-detail-dialog.component.html',
    styleUrls: ['./step-detail-dialog.component.scss'],
    providers: [ItineraryDetailService]
})
export class StepDetailDialogComponent implements OnInit {
    screenHeight: number;
    isLoading = false;

    steps: Array<ItineraryStep>;
    itineraryId: number;
    stepId: number;

    stepDetailType: string;
    stepDetail: StepDetail = new StepDetail();

    search: string;

    form: FormGroup;
    step: FormControl;

    detailType: FormControl;
    detailName: FormControl;
    detailPrice: FormControl;
    detailDescription: FormControl;

    constructor(
        private ngZone: NgZone,
        public dialogRef: MatDialogRef<StepDetailDialogComponent>,
        public snackBar: MatSnackBar,
        private itineraryService: ItineraryService,
        private itineraryDetailService: ItineraryDetailService,
        private fb: FormBuilder) {
        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;

        window.onresize = (e) => {
            // ngZone.run will help to run change detection
            this.ngZone.run(() => {
                this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
            });
        };

        this.detailType = new FormControl('', [Validators.required]);
        this.step = new FormControl('', [Validators.required]);
        this.detailName = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.detailDescription = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.detailPrice = new FormControl('', [Validators.required, Validators.pattern('[0-9\,\.]*')]);

        this.form = this.fb.group({
            step: this.step,
            detailType: this.detailType,
            detailName: this.detailName,
            detailDescription: this.detailDescription,
            detailPrice: this.detailPrice
        });
    }

    ngOnInit() {
        this.itineraryService.getItinerarySteps(this.itineraryId).subscribe(
            data => {
                this.steps = data;
            },
            error => { alert(error); }
        );
    }

    selectStepId($event: MatAutocompleteSelectedEvent) {
        this.stepId = this.steps.find(s => s.city == $event.option.value).id;
    }

    registerStepDetail() {
        if (this.form.dirty && this.form.valid) {
            this.isLoading = true;

            this.stepDetail.stepId = this.stepId;
            this.stepDetail.type = this.stepDetailType;

            this.itineraryDetailService.createStepDetail(this.stepDetail).subscribe(
                id => this.successfullyCreated(),
                error => alert(error)
            );
        }
        return false;
    }

    private successfullyCreated() {
        this.isLoading = false;
        this.snackBar.open('Félicitation vos détails ont été enregistré', 'Ok', {
            duration: 3000
        });

        const that = this;
        setTimeout(function () {
            that.stepDetail = new StepDetail();
            that.dialogRef.close();
        }, 500);
    }
}