import { Component, Inject, OnInit } from '@angular/core';
import { Voter } from '../../../models/voter/voter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user/user';
import { UserApiService } from '../../../services/user/user-api.service';
import { VoterApiService } from '../../../services/voter/voter-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoterData } from '../../../models/voter/voter-data';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.css',
})
export class ParticipantListComponent implements OnInit {
  participants: { user: User; voterId: string }[] = [];
  participantForm!: FormGroup;
  foundUsers: User[] = [];
  isStarted!: boolean;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private voterApiService: VoterApiService,
    public dialogRef: MatDialogRef<ParticipantListComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { votingId: string; isStarted: boolean }
  ) {}

  ngOnInit(): void {
    this.isStarted = this.data.isStarted;
    this.participantForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.voterApiService
      .getVotersByParams({ votingProcess: this.data.votingId, status: true })
      .subscribe((voters) => {
        if (voters.length > 0) {
          const userRequests = voters.map((voter) =>
            this.userApiService.getUserById(voter.user)
          );
          forkJoin(userRequests).subscribe((users) => {
            this.participants = users.map((user, index) => ({
              user: users[index],
              voterId: voters[index]._id,
            }));
          });
        } else {
          this.participants = [];
        }
      });
  }

  onSearchUser(): void {
    const email = this.participantForm.value.email.trim();
    if (email) {
      this.userApiService
        .getUsersByParams({ email, status: true })
        .subscribe((users) => {
          this.foundUsers = users;
        });
    }
  }

  onAddParticipant(user: User): void {
    if (
      !this.isStarted &&
      !this.participants.some(
        (participant) => participant.user.email === user.email
      )
    ) {
      const voterData: VoterData = {
        user: user.uid,
        votingProcess: this.data.votingId,
      };
      this.voterApiService.createVoter(voterData).subscribe(
        () => {
          this.loadParticipants();
          this.participantForm.reset();
          this.foundUsers = [];
        },
        (error) => {
          console.error('Error al agregar participante', error);
        }
      );
    }
  }

  onDeleteParticipant(voterId: string): void {
    if (this.isStarted) {
      alert(
        'No se puede eliminar participantes una vez que la votación ha comenzado.'
      );
      return;
    }

    this.voterApiService.deleteVoter(voterId).subscribe(
      () => {
        this.participants = this.participants.filter(
          (p) => p.voterId !== voterId
        );
      },
      (error) => {
        console.error('Error al eliminar participante', error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
