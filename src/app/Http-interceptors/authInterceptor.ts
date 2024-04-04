import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../Service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getToken();

    //verify if the token is still valid before sending the request
    if (this.auth.isTokenExpired()) {
      //refresh the token if it is expired
      this.auth.refreshToken(this.auth.getRefreshToken()).subscribe();

      // make a new request with the new token
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });

      // send cloned request with header to the next handler.
      return next.handle(authReq);
    }

    //put bearer token in the header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}