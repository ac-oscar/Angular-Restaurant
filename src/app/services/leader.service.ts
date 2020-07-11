import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Promise<Leader[]> {
    return new Promise((resolve, reject) => {
      resolve(LEADERS);
    });
  }

  getLeader(id: string): Promise<Leader> {
    return new Promise((resolve, reject) => {
      resolve(LEADERS.filter((lead) => (lead.id === id))[0]);
    });
  }

  getFeaturedLeader(): Promise<Leader> {
    return new Promise((resolve, reject) => {
      resolve(LEADERS.filter((lead) => lead.featured)[0]);
    });
  }
}
