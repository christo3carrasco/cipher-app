import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Voting } from '../../../models/voting/voting';

@Component({
  selector: 'app-voting-details',
  templateUrl: './voting-details.component.html',
  styleUrl: './voting-details.component.css',
})
export class VotingDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<VotingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Voting
  ) {}

  getStatus(): string {
    if (this.data.isFinished) {
      return 'Finalizado';
    } else if (this.data.isStarted) {
      return 'Iniciado';
    } else if (this.data.isApproved) {
      return 'Aprobado';
    } else {
      return 'Espera de aprobación';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
