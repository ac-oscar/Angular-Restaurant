import { Injectable } from '@angular/core';
import { DISHES } from '../shared/dishes';
import { Dish } from '../shared/dish';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDishes(): Promise<Dish[]> {
    return new Promise((resolve, reject) => {
      resolve(DISHES);
    });
  }

  getDish(id: string): Promise<Dish> {
    return new Promise((resolve, reject) => {
      resolve(DISHES.filter((dish) => (dish.id === id))[0]);
    });
  }

  getFeaturedDish(): Promise<Dish> {
    return new Promise((resolve, reject) => {
      resolve(DISHES.filter((dish) => (dish.featured))[0]);
    });
  }
}
