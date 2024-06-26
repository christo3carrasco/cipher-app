import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { TransparencyVoteComponent } from '../transparency-vote/transparency-vote.component';

@Component({
  selector: 'app-transparency',
  templateUrl: './transparency.component.html',
  styleUrl: './transparency.component.css',
})
export class TransparencyComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  hash!: string;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.sidenav.close();
      }
    });
  }

  openVoteModal(): void {
    this.dialog.open(TransparencyVoteComponent, {
      width: '600px',
      data: { hash: this.hash },
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/sign-in']);
  }
}
