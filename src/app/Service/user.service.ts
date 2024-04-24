import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserDto } from "../model/userDto";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
    })

export class UserService {



    constructor(private http : HttpClient, public token : AuthService){ }


    userServiceURL = 'http://localhost:8081/api/user';

    // get user by email
    getUserByEmail(email: string): Observable<UserDto> {
        return this.http.get<UserDto>(this.userServiceURL + '/email/' + email);
    }

    getUserById(userId: number): Observable<UserDto> {
        return this.http.get<UserDto>(this.userServiceURL + '/' + userId);
    }

    getUserName(UserId: number[]): Observable<string[]> {
        return this.http.post<string[]>(this.userServiceURL + '/username/', UserId);
    }

    changePassword(userId: number, password: string): Observable<UserDto> {
        return this.http.put<UserDto>(this.userServiceURL + '/updatePassword/' + userId, password);
    }

    changeEmail(userId: number, email: string): Observable<UserDto> {
        return this.http.put<UserDto>(this.userServiceURL + '/updateEmail/' + userId, email);
    }

}
