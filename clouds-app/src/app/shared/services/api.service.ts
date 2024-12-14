import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Prediction } from '../../../prediction';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "http://localhost:5000/api/";

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  predict(image: string) {
    return firstValueFrom(this.http.post<Prediction>(this.url + "predict", image).pipe(
      catchError(this.handleError)
    ));
  }
}
