import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VotingApiService } from '../../../services/voting/voting-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VotingData } from '../../../models/voting/voting-data';

@Component({
  selector: 'app-voting-form',
  templateUrl: './voting-form.component.html',
  styleUrl: './voting-form.component.css',
})
export class VotingFormComponent implements OnInit {
  votingForm!: FormGroup;
  minStartDate!: string;
  minEndDate!: string;

  constructor(
    private fb: FormBuilder,
    private votingApiService: VotingApiService,
    public dialogRef: MatDialogRef<VotingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.minStartDate = this.formatDate(tomorrow);
    this.minEndDate = this.minStartDate;

    this.votingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      startDate: [today, Validators.required],
      endDate: ['', Validators.required],
    });

    this.votingForm
      .get('startDate')
      ?.valueChanges.subscribe((startDate: Date) => {
        this.minEndDate = this.formatDate(startDate || new Date());
        const endDateControl = this.votingForm.get('endDate');
        if (
          endDateControl?.value &&
          new Date(endDateControl.value) < new Date(startDate)
        ) {
          endDateControl.setValue(null);
        }
      });
  }

  onSubmit(): void {
    if (this.votingForm.valid) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const uid = user.uid || '';

      const votingData: VotingData = {
        ...this.votingForm.value,
        organizer: uid,
      };

      this.votingApiService.createVoting(votingData).subscribe(
        (response) => {
          this.dialogRef.close(true); // Cierra el modal y actualiza la tabla
        },
        (error) => {
          console.error('Error al crear la votación', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cierra el modal sin realizar ninguna acción
  }

  onStartDateChange(event: any): void {
    const startDate = event.value;
    const tomorrow = new Date(startDate);
    tomorrow.setDate(startDate.getDate() + 1);
    this.minEndDate = this.formatDate(tomorrow || new Date());
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
