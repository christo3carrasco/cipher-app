import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { format } from 'date-fns-tz';
import { es } from 'date-fns/locale';

import { VotingApiService } from '../../../services/voting/voting-api.service';
import { Voting } from '../../../models/voting/voting';
import { MatDialog } from '@angular/material/dialog';
import { VotingFormComponent } from '../voting-form/voting-form.component';
import { VotingDetailsComponent } from '../voting-details/voting-details.component';
import { OptionListComponent } from '../../option-module/option-list/option-list.component';
import { ParticipantListComponent } from '../../participant-module/participant-list/participant-list.component';
import { ResultsModalComponent } from '../../result-module/results-modal/results-modal.component';
import { VotingData } from '../../../models/voting/voting-data';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css',
})
export class VotingComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'startDate',
    'endDate',
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
    private router: Router,
    public dialog: MatDialog
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const uid = user.uid || '';

    this.votingApiService
      .getVotingsByParams({ status: true, organizer: uid })
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

  openNewVotingDialog(): void {
    const dialogRef = this.dialog.open(VotingFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadVotings(); // Recargar la tabla si se creó una nueva votación
      }
    });
  }

  openVotingDetailsDialog(voting: Voting): void {
    this.dialog.open(VotingDetailsComponent, {
      width: '400px',
      data: voting,
    });
  }

  openOptionListDialog(voting: Voting): void {
    this.dialog.open(OptionListComponent, {
      width: '400px',
      data: { votingId: voting._id, isStarted: voting.isStarted },
    });
  }

  openParticipantListDialog(voting: Voting): void {
    this.dialog.open(ParticipantListComponent, {
      width: '500px',
      data: { votingId: voting._id, isStarted: voting.isStarted },
    });
  }

  openResultsDialog(voting: Voting): void {
    this.dialog.open(ResultsModalComponent, {
      width: '600px',
      data: { votingId: voting._id },
    });
  }

  updateVotingStatus(voting: Voting, status: string): void {
    let message: string = ''; // Inicializar message con un valor vacío
    let update: Partial<Voting> = {};

    if (status === 'start') {
      message = '¿Está seguro de que desea iniciar esta votación?';
      update = { isStarted: true };
    } else if (status === 'finish') {
      message = '¿Está seguro de que desea finalizar esta votación?';
      update = { isFinished: true };
    }

    if (message && confirm(message)) {
      this.votingApiService.updateVoting(voting._id, update).subscribe(
        () => {
          this.loadVotings();
        },
        (error) => {
          console.error('Error al actualizar el estado de la votación', error);
        }
      );
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
