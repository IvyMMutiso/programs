import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Program } from "src/app/models/program";
import { Activity } from "src/app/models/activity";
import {
  MatTableDataSource,
  MatDialog,
  MatDialogConfig
} from "@angular/material";
import { ProgramsService } from "src/app/service/programs.service";
import { ActivityDetailsComponent } from "../activity-details/activity-details.component";
import { ActivitiesListComponent } from "../activities-list/activities-list.component";

@Component({
  selector: "app-programs-list",
  templateUrl: "./programs-list.component.html",
  styleUrls: ["./programs-list.component.scss"]
})
export class ProgramsListComponent implements OnInit {
  programs: Program[];
  programs$: Observable<Program[]>;
  activities: Activity[];
  activities$: Observable<Activity[]>;
  displayedColumns: string[] = ["name", "actions"];
  dataSource: MatTableDataSource<Program>;

  constructor(
    private readonly programsService: ProgramsService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getPrograms();
  }

  getPrograms() {
    this.programs$ = this.programsService.getPrograms();
    this.programs$.subscribe(programs => {
      this.programs = programs;
      this.dataSource = new MatTableDataSource(this.programs);
    });
  }

  viewActivities(programId: number) {
    //   const dialogConfig = new MatDialogConfig();

    //   dialogConfig.disableClose = true;
    //   dialogConfig.autoFocus = true;

    //   dialogConfig.position = {
    //     "top": "0",
    //     left: "0"
    // };

    //   this.dialog.open(ActivityDetailsComponent, dialogConfig);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ActivitiesListComponent, {
      data: programId,
      panelClass: "product-dialog"
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getProducts();
    //   }
    // });
  }
}
