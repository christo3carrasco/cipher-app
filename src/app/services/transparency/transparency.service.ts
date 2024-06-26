import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Voter } from '../../models/voter/voter';
import { Vote } from '../../models/vote/vote';
import { TransparencyVote } from '../../models/transparency/transparency-vote';
import { Voting } from '../../models/voting/voting';
import { Option } from '../../models/option/option';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class TransparencyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVoteHash(votingProcess: string, user: string): Observable<string> {
    let voterParams = new HttpParams()
      .set('votingProcess', votingProcess)
      .set('user', user)
      .set('status', true);

    return this.http
      .get<{ success: boolean; message: string; voters: Voter[] }>(
        `${this.apiUrl}/voter`,
        { params: voterParams }
      )
      .pipe(
        switchMap((response) => {
          const voters = response.voters;
          if (voters.length > 0 && voters[0].hasVoted) {
            let voteParams = new HttpParams().set('voter', voters[0]._id);

            return this.http
              .get<{ success: boolean; message: string; votes: Vote[] }>(
                `${this.apiUrl}/vote`,
                { params: voteParams }
              )
              .pipe(
                map((response) => {
                  const votes = response.votes;
                  if (votes.length > 0) {
                    return votes[0].transactionHash;
                  } else {
                    throw new Error('Vote not found');
                  }
                }),
                catchError((error) => of(`Error: ${error.message}`))
              );
          } else {
            return of('El usuario no votó.');
          }
        }),
        catchError((error) => {
          if (error.status === 404) {
            return of('El usuario no votó.');
          }
          return of(`Error: ${error.message}`);
        })
      );
  }

  getVoteData(hash: string): Observable<TransparencyVote> {
    // Buscar voto por transactionHash para obtener el voter, optionNumber, votingProcess
    let voteParams = new HttpParams().set('transactionHash', hash);

    return this.http
      .get<{ votes: Vote[] }>(`${this.apiUrl}/vote`, { params: voteParams })
      .pipe(
        switchMap((voteResponse) => {
          if (voteResponse.votes.length === 0) {
            throw new Error('Vote not found');
          }

          const vote = voteResponse.votes[0];
          const voterId = vote.voter;
          const votingProcessId = vote.votingProcess;
          const optionNumber = vote.optionNumber;

          // Consultar el votante para obtener el user
          const voterUrl = `${this.apiUrl}/voter/${voterId}`;
          const voter$ = this.http
            .get<{ voter: Voter }>(voterUrl)
            .pipe(map((response) => response.voter));

          // Consultar el proceso de votación para obtener los datos del proceso
          const votingUrl = `${this.apiUrl}/voting/${votingProcessId}`;
          const voting$ = this.http
            .get<{ voting: Voting }>(votingUrl)
            .pipe(map((response) => response.voting));

          // Consultar la opción para obtener los datos de la opción (id es del voting process)
          const optionUrl = `${this.apiUrl}/option/${votingProcessId}`;
          const option$ = this.http
            .get<{ details: Option[] }>(optionUrl)
            .pipe(
              map((response) =>
                response.details.find((opt) => opt.id === optionNumber)
              )
            );

          return forkJoin({
            voter: voter$,
            voting: voting$,
            option: option$,
          }).pipe(
            switchMap(({ voter, voting, option }) => {
              if (!option) {
                throw new Error('Option not found');
              }

              // Consultar el user para obtener los datos del usuario
              const userUrl = `${this.apiUrl}/user/${voter.user}`;
              return this.http.get<{ user: User }>(userUrl).pipe(
                map((response) => {
                  const user = response.user;
                  return {
                    votingName: voting.title,
                    name: user.name,
                    email: user.email,
                    optionName: option.name,
                    hashVote: vote.transactionHash,
                    timestamp: vote.timestamp,
                  };
                })
              );
            })
          );
        }),
        catchError((error) =>
          of({
            votingName: '',
            name: '',
            email: '',
            optionName: '',
            hashVote: hash,
            timestamp: '',
          })
        )
      );
  }
}
