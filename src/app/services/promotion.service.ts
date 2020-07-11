import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Promise<Promotion[]> {
    return new Promise((resolve, reject) => {
      resolve(PROMOTIONS);
    });
  }

  getPromotion(id: string): Promise<Promotion> {
    return new Promise((resolve, reject) => {
      resolve(PROMOTIONS.filter((prom) => (prom.id === id))[0]);
    });
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return new Promise((resolve, reject) => {
      resolve(PROMOTIONS.filter((prom) => prom.featured)[0]);
    });
  }
}
