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
    this.minStartDate = this.formatDate(today);
    this.minEndDate = this.minStartDate;

    this.votingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [today, Validators.required],
      endDate: ['', Validators.required],
    });

    this.votingForm
      .get('startDate')
      ?.valueChanges.subscribe((startDate: Date) => {
        this.minEndDate = this.formatDate(startDate || new Date());
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
    this.minEndDate = this.formatDate(startDate || new Date());
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
