import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserPlaceholderService {
    private readonly http = inject(HttpClient);

    users = toSignal(this.http.get<User[]>('https://jsonplaceholder.typicode.com/users'))
}