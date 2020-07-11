import { DishService } from '../services/dish.service';
import { Component, OnInit } from '@angular/core';
import { DISHES } from '../shared/dishes';
import { Dish } from '../shared/dish';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  dishes: Dish[];

  selectedDish: Dish;

  constructor(private dishService: DishService) { }

  ngOnInit() {
    this.dishService.getDishes().subscribe((resolve) => this.dishes = resolve);
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

}