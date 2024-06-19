import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { Router } from '@angular/router';

import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Voting } from '../../../models/voting/voting';
import { VotingApiService } from '../../../services/voting/voting-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'description',
    'startDate',
    'endDate',
    'contractAddress',
    'organizer',
    'status',
    'options',
  ];

  dataSource!: MatTableDataSource<Voting>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private votingApiService: VotingApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVotings();
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.sidenav.close();
      }
    });
  }

  loadVotings(): void {
    this.votingApiService
      .getVotingsByParams({ status: true })
      .subscribe((votings) => {
        this.dataSource = new MatTableDataSource(votings);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusClass(voting: Voting): string {
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

  formatDateToLocale(date: Date): string {
    return format(date, 'PPP', { locale: es });
  }

  updateVotingStatus(voting: Voting, status: string): void {
    let message: string = '';
    let update: Partial<Voting> = {};

    if (status === 'approve') {
      message = '¿Está seguro de que desea aprobar esta votación?';
      update = { isApproved: true };
    } else if (status === 'start') {
      message = '¿Está seguro de que desea iniciar esta votación?';
      update = { isStarted: true };
    } else if (status === 'finish') {
      message = '¿Está seguro de que desea finalizar esta votación?';
      update = { isFinished: true };
    }

    if (message && confirm(message)) {
      this.votingApiService.updateVoting(voting._id, update).subscribe({
        next: () => {
          this.loadVotings();
        },
        error: (error) => {
          console.error('Error al actualizar el estado de la votación', error);
        },
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/sign-in']);
  }
}
