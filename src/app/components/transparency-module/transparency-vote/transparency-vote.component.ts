import { Component, Inject, OnInit } from '@angular/core';
import { TransparencyVote } from '../../../models/transparency/transparency-vote';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransparencyService } from '../../../services/transparency/transparency.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transparency-vote',
  templateUrl: './transparency-vote.component.html',
  styleUrl: './transparency-vote.component.css',
  providers: [DatePipe],
})
export class TransparencyVoteComponent implements OnInit {
  voteData!: TransparencyVote;
  error!: string;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<TransparencyVoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transparencyService: TransparencyService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.transparencyService.getVoteData(this.data.hash).subscribe(
      (data) => {
        if (data.votingName) {
          this.voteData = {
            ...data,
            timestamp: this.formatDate(data.timestamp),
          };
        } else {
          this.error = 'El hash no existe';
        }
        this.loading = false;
      },
      (error) => {
        this.error = error.message || 'Error al obtener los datos';
        this.loading = false;
      }
    );
  }
  formatDate(date: Date | string): string {
    const formattedDate = this.datePipe.transform(date, 'medium');
    return formattedDate ? formattedDate : '';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
