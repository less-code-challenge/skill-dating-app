import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SkillTo} from './model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {
  }

  findAll(): Observable<SkillTo[]> {
    return this.http.get<SkillTo[]>(`${this.backendUri}/skills`);
  }
}
