import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { Voter } from '../../../models/voter/voter';
import { Voting } from '../../../models/voting/voting';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VoterApiService } from '../../../services/voter/voter-api.service';
import { VotingApiService } from '../../../services/voting/voting-api.service';
import { MatDialog } from '@angular/material/dialog';
import { VotingDetailsComponent } from '../../voting-module/voting-details/voting-details.component';

@Component({
  selector: 'app-voter',
  templateUrl: './voter.component.html',
  styleUrl: './voter.component.css',
})
export class VoterComponent implements OnInit {
  voters: Voter[] = [];
  votings: Voting[] = [];
  displayedColumns: string[] = [
    'title',
    'startDate',
    'endDate',
    'status',
    'options',
  ];
  dataSource = new MatTableDataSource<Voting>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private voterApiService: VoterApiService,
    private votingApiService: VotingApiService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const uid = user?.uid;

    if (uid) {
      this.voterApiService
        .getVotersByParams({ status: true, user: uid })
        .subscribe((voters) => {
          this.voters = voters;

          const votingIds = voters.map((voter) => voter.votingProcess);
          const requests = votingIds.map((id) =>
            this.votingApiService.getVotingById(id)
          );

          forkJoin(requests).subscribe((votings: Voting[]) => {
            this.votings = votings;
            this.dataSource.data = votings;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openVotingDetailsDialog(voting: Voting): void {
    this.dialog.open(VotingDetailsComponent, {
      width: '400px',
      data: voting,
    });
  }

  getStatusLabel(voting: Voting): string {
    if (voting.isFinished) {
      return 'status-finished';
    } else if (voting.isStarted) {
      return 'status-started';
    } else if (voting.isApproved) {
      return 'status-approved';
    } else {
      return 'status-default';
    }
  }

  logout() {
    // Implementa tu lógica de cerrar sesión aquí
    // Por ejemplo, eliminar el token de autenticación y redirigir a la página de inicio de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/sign-in']);
  }
}
