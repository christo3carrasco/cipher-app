import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Voting } from '../../../models/voting/voting';
import { VoteApiService } from '../../../services/vote/vote-api.service';
import { OptionApiService } from '../../../services/option/option-api.service';
import { Option } from '../../../models/option/option';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.css',
})
export class VoteComponent implements OnInit {
  options: Option[] = [];
  selectedOption: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<VoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { votingId: string; voterId: string },
    private optionApiService: OptionApiService,
    private voteApiService: VoteApiService
  ) {}

  ngOnInit(): void {
    this.optionApiService
      .getOptionById(this.data.votingId)
      .subscribe((options) => {
        this.options = options;
      });
  }

  vote(): void {
    if (this.selectedOption !== null) {
      if (confirm('¿Estás seguro de que deseas votar por esta opción?')) {
        this.voteApiService
          .createVote(this.data.voterId, this.selectedOption)
          .subscribe(
            () => {
              alert('Voto registrado con éxito');
              this.dialogRef.close();
            },
            (error) => {
              alert('Solo puede realizar un voto');
              console.error(error);
            }
          );
      }
    } else {
      alert('Por favor selecciona una opción antes de votar.');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
