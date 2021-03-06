import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { error } from "@angular/compiler/src/util";
import { Program } from "../../programs/models/program";
import { Activity } from "../../activities/models/activity";

@Injectable({
  providedIn: "root"
})
export class ProgramsService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer GfR6vIHG0zTWaJle6TjNXvYUrjDn6g"
    })
  };
  LIVE_URI = "https://dev.toladata.io/api/";

  constructor(private httpClient: HttpClient) {}

  getPrograms(): Observable<Program[]> {
    return this.httpClient
    // ${this.LIVE_URI}workflowlevel1/?courseId=1&filter=&sortOrder=asc&pageNumber=0&pageSize=3
      .get(`${this.LIVE_URI}workflowlevel1/`, this.httpOptions)
      // .pipe(map((res: Program[]) => res));
      .pipe(
        catchError(error),
        map((result: Program[]) => {
          return result.map(programs => {
            return new Program({ ...programs });
          });
        })
      );
  }

  getProgramActivities(programId: number): Observable<Activity[]> {
    return this.httpClient
      .get<Array<Activity>>(
        `${this.LIVE_URI}workflowlevel2/?workflowlevel1__id=` + programId,
        this.httpOptions
      )
      .pipe(
        catchError(error),
        // map((res: Activity[]) => res));
        map((result: Activity[]) => {
          return result.map(activity => {
            return new Activity({ ...activity });
          });
        })
      );
  }

  addProgramActivity(activity: Activity): Observable<Activity> {
    return this.httpClient
      .post(`${this.LIVE_URI}workflowlevel2/`, activity, this.httpOptions)
      .pipe(map((res: Activity) => res));
  }

  deleteProgramActivity(activityId: number) {
    return this.httpClient
      .delete(`${this.LIVE_URI}workflowlevel2/` + activityId, this.httpOptions)
      .pipe(map((res: Activity[]) => res));
  }

  // deleteProgramActivity(activityId: number): Observable<any> {
  //   const result = new BehaviorSubject<any>(false);
  //   this.httpClient
  //     .delete(`${this.LIVE_URI}workflowlevel2/` + activityId, this.httpOptions)
  //     // .pipe(map((res: Activity) => res));
  //     .pipe(catchError(error))
  //       .subscribe((removeActivityResponse: boolean) => {
  //         console.log("service : ", removeActivityResponse);
  //           result.next(removeActivityResponse);
  //       });

  //   return result.asObservable().pipe(skip(1));
  // }
}
