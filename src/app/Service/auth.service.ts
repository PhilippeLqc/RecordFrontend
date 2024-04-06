import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LogsDto } from "../model/logsDto";
import { UserDto } from "../model/userDto";
import { Observable, catchError, of, switchMap, tap, throwError } from "rxjs";
import { AuthResponseDto } from "../model/authResponseDto";
import { UserRegisterDto } from "../model/userRegisterDto";
import { ChatService } from "./chat.service";
import { Router } from "@angular/router";
import { role } from "../enumTypes/role";

@Injectable({
    providedIn: "root"
    })


export class AuthService {

    constructor(private http : HttpClient, private chat: ChatService, private router: Router){ 
        this.currentUser = {
            id: 0,
            username: '',
            email: '',
            role: 'USER' as role,
            taskIds: [],
            projectIds: [],
            messageIds: []
        }

        this.Securitytoken = {
            token: '',
            refreshToken: ''
        }
    }

    serviceURL = 'http://localhost:8081/api/auth';
    userServiceURL = 'http://localhost:8081/api/user';

    connected : boolean = false;
    currentUser : UserDto;
    private Securitytoken : AuthResponseDto;

    // register user using UserDto
    register(user: UserRegisterDto) {
        console.log(user)
        return this.http.post<UserRegisterDto>(this.serviceURL + '/register', user).subscribe()
    }

    // login user using logsDto
    login(user: LogsDto) {
        return this.http.post<AuthResponseDto>(this.serviceURL + '/login', user).pipe(
            catchError(error => {
                console.error('Error during login request:', error);
                return throwError(error);
              }),
          switchMap((responseLogin) => {
            console.log( "response login", responseLogin);
            this.Securitytoken = responseLogin;
            this.connected = true;
            this.chat.initConnection();
            this.chat.joinRoom('1100');

            console.log("enter the login", this.Securitytoken);
            // Get the user by email
            return this.http.get<UserDto>(this.userServiceURL + '/email/' + user.email);
          }),
          tap((user: Object) => {
            // Save the user in the currentUser object
            this.currentUser = user as UserDto;
          }),
          tap(() => {
            if (this.connected) {
              this.router.navigate([`project`]);
            } else {
                return console.error('email or mdp invalid');
            }
          }),
          catchError((error) => {
            if (error.status === 403) {
              return of ({ error : 'email ou mot de passe invalide' });
            } else {
                return of( { error : ' bug dans la matrice ' });
            }
            })
        );
      }

    // verify if the token is expired
    isTokenExpired(): Observable<boolean> {
        const token = { token : this.Securitytoken.token }
        return this.http.post<boolean>(this.serviceURL + '/validationToken', token);
    }

    // refresh the token
    refreshToken(): Observable<AuthResponseDto> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        const body = {
          token: this.Securitytoken.refreshToken
        };

    return this.http.post<AuthResponseDto>(this.serviceURL + '/refresh', body, { headers }).pipe(
        tap((response) => {
            this.Securitytoken = response;
        })
    );
    }

    getToken(): string {
        return this.Securitytoken.token;
    }

    getRefreshToken(): string {
        return this.Securitytoken.refreshToken;
    }


    getCurrentUser(): UserDto {
        return this.currentUser;
    }

    // if the user is connected, redirect to the chat page of the application
    isConnected(): boolean {
        if (this.Securitytoken != null) {
            this.connected = true
            
            return true;
        } else {
            this.connected = false
            return false;
        }
    
    }
}