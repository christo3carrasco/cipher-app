import { Component, Inject, OnInit } from '@angular/core';
import { Vote } from '../../../models/vote/vote';
import { VoteApiService } from '../../../services/vote/vote-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoterApiService } from '../../../services/voter/voter-api.service';
import { Option } from '../../../models/option/option';
import { OptionApiService } from '../../../services/option/option-api.service';
import { UserApiService } from '../../../services/user/user-api.service';
import { Voter } from '../../../models/voter/voter';
import { User } from '../../../models/user/user';
import { forkJoin, map } from 'rxjs';

interface VoteResults {
  [key: number]: {
    count: number;
    users: string[];
  };
}

@Component({
  selector: 'app-results-modal',
  templateUrl: './results-modal.component.html',
  styleUrl: './results-modal.component.css',
})
export class ResultsModalComponent implements OnInit {
  votes: Vote[] = [];
  results: VoteResults = {};
  totalVotes: number = 0;
  totalVoters: number = 0;
  options: Option[] = [];
  voters: Voter[] = [];
  users: { [key: string]: User } = {};

  constructor(
    private voteApiService: VoteApiService,
    private voterApiService: VoterApiService,
    private optionApiService: OptionApiService,
    private userApiService: UserApiService,
    public dialogRef: MatDialogRef<ResultsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { votingId: string }
  ) {}

  ngOnInit(): void {
    this.loadVotes();
    this.loadOptions();
    this.loadVoters();
  }

  loadVotes(): void {
    this.voteApiService
      .getVotesByParams({ votingProcess: this.data.votingId })
      .subscribe((votes) => {
        this.votes = votes;
        this.calculateResults();
      });
  }

  loadOptions(): void {
    this.optionApiService
      .getOptionById(this.data.votingId)
      .subscribe((options) => {
        this.options = options;
      });
  }

  loadVoters(): void {
    this.voterApiService
      .getVotersByParams({ votingProcess: this.data.votingId, status: true })
      .subscribe((voters) => {
        this.voters = voters;
        this.totalVoters = voters.length;

        const userRequests = voters.map((voter) =>
          this.userApiService
            .getUserById(voter.user)
            .pipe(map((user) => ({ userId: voter.user, user })))
        );

        forkJoin(userRequests).subscribe((userResponses) => {
          userResponses.forEach(({ userId, user }) => {
            this.users[userId] = user;
          });
          this.calculateResults();
        });
      });
  }

  calculateResults(): void {
    this.results = this.votes.reduce<VoteResults>((acc, vote) => {
      if (!acc[vote.optionNumber]) {
        acc[vote.optionNumber] = { count: 0, users: [] };
      }
      const voter = this.voters.find((v) => v._id === vote.voter);
      if (voter) {
        acc[vote.optionNumber].count++;
        acc[vote.optionNumber].users.push(voter.user);
      }
      return acc;
    }, {});
    this.totalVotes = this.votes.length;
  }

  getUserById(userId: string): string {
    return this.users[userId]?.email || userId;
  }

  getOptionName(optionNumber: number): string {
    const option = this.options.find((opt) => opt.id === optionNumber);
    return option ? option.name : `Opción ${optionNumber}`;
  }

  getVotersNotVoted(): string[] {
    return this.voters
      .filter((voter) => !voter.hasVoted)
      .map((voter) => voter.user);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
