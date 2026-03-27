import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User, UserData } from '../models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserPlaceholderService {
  private readonly http = inject(HttpClient);

  users = toSignal(
    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      map((users) =>
        users.map(
          (user) =>
            ({
              ...user,
              formattedAddress: `${user.address?.street} ${user.address?.suite}\n${user.address?.city}  ${user.address?.zipcode}`,
              formattedGeo: `${user.address?.geo?.lat} : ${user.address?.geo?.lng}`,
              formattedCompany: `${user.company?.name} - ${user.company?.catchPhrase} (${user.company?.bs})`,
            }) as UserData,
        ),
      ),
    ),
    { initialValue: [] as UserData[] },
  );
}
