import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransparencyService } from '../../../services/transparency/transparency.service';

@Component({
  selector: 'app-transparency-modal',
  templateUrl: './transparency-modal.component.html',
  styleUrl: './transparency-modal.component.css',
})
export class TransparencyModalComponent implements OnInit {
  voteHash!: string;
  error!: string;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<TransparencyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transparencyService: TransparencyService
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString).uid;
      this.transparencyService.getVoteHash(this.data.votingId, user).subscribe(
        (hash) => {
          this.voteHash = hash;
          this.loading = false;
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
    } else {
      this.error = 'No se encontró información del usuario en el localStorage';
      this.loading = false;
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
