import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../Service/auth.service';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Exclude refresh token request
  if (req.url.includes('/refresh') || req.url.includes('/login') || req.url.includes('/register')) {
    return next.handle(req);
  }

    const authToken = JSON.parse(localStorage.getItem('SecurityToken') || '{}').token;
  
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
  
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the request returns a 401, refresh the token
        if (error.status === 401) {
          console.log('Token is expired');
          return this.auth.refreshToken().pipe(
            switchMap(() => {
              const newAuthToken = this.auth.getToken();
              console.log('New token:', newAuthToken);
      
              const authReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + newAuthToken)
              });
      
              return next.handle(authReq) as Observable<HttpEvent<any>>; // Explicitly cast the return type
            })
          );
        }
  
        // If the error is not a 401, throw a erroer with status 404 and a message that said interceptor error
        return throwError(() => new Error('test'));
      })
    );
  }
}