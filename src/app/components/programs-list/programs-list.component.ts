import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";

import {
  MatTableDataSource,
  MatDialog,
  MatDialogConfig,
  MatPaginator
} from "@angular/material";
import { ActivityDetailsComponent } from "../activity-details/activity-details.component";
import { ActivitiesListComponent } from "../activities-list/activities-list.component";
import { Subscription } from "rxjs";
import { ProgramsService } from "src/app/lists/service/programs.service";
import { Program } from "src/app/lists/models/program";
import * as fromStore from "../../lists/reducers/programs.reducer";
import * as ProgramsActions from "../../lists/actions/programs.actions";
import { GetProgramsList } from "../../lists/actions/programs.actions";

@Component({
  selector: "app-programs-list",
  templateUrl: "./programs-list.component.html",
  styleUrls: ["./programs-list.component.scss"]
})
export class ProgramsListComponent implements OnInit {
  programs: Program[];
  programs$: Observable<Program[]>;
  displayedColumns: string[] = ["name", "start_date", "actions"];
  dataSource = new MatTableDataSource<Program>();
  subscription: Subscription;
  isLoading = true;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;

  constructor(
    private readonly programsService: ProgramsService,
    private readonly dialog: MatDialog,
    private readonly store: Store<fromStore.ProgramsState>
  ) {
    this.store.dispatch(new ProgramsActions.GetProgramsList());
  }

  ngOnInit() {
    this.getPrograms();
  }

  getPrograms() {
    this.subscription = this.store.pipe(select("programs")).subscribe(data => {
      this.prepareProgramsList(data);
    });

    // this.programs$ = this.programsService.getPrograms();
    // this.programs$.subscribe(programs => {
    //   this.isLoading = false;
    //   this.programs = programs;
    //   // console.log(programs);
    //   this.dataSource = new MatTableDataSource(this.programs);
    //   this.dataSource.paginator = this.paginator;
    //   this.totalSize = this.programs.length;
    //   this.iterator();
    // });
  }

  prepareProgramsList(data) {
    if (data.programsList == null) {
      this.store.dispatch(new GetProgramsList());
      return;
    }

    if (data.programsList.programsList !== null) {
      this.programs = data.programsList.programsList;
      this.dataSource = new MatTableDataSource<Program>(null);
      setTimeout(() => {
        this.dataSource = new MatTableDataSource<Program>(this.programs);
        this.isLoading = false;
        this.dataSource.paginator = this.paginator;
        this.totalSize = this.programs.length;
        this.iterator();
      }, 1);
    }
  }

  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.programs.slice(start, end);
    this.dataSource = new MatTableDataSource(part);
  }

  getPaginatorData(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  dialogConfig(program: Program) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = program;
    dialogConfig.panelClass = "activities-dialog";

    return dialogConfig;
  }

  viewActivities(program: Program) {
    this.dialog.open(ActivitiesListComponent, this.dialogConfig(program));
  }

  addActivity(program: Program) {
    const dialogRef = this.dialog.open(
      ActivityDetailsComponent,
      this.dialogConfig(program)
    );
    dialogRef.afterClosed().subscribe(result => {
      this.viewActivities(program);
    });
  }
}
