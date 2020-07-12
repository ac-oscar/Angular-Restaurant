import { DishService } from '../services/dish.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  dishes: Dish[];

  constructor(
    private dishService: DishService,
    @Inject('BaseURL') private BaseURL
    ) { }

  ngOnInit() {
    this.dishService.getDishes().subscribe((resolve) => this.dishes = resolve);
  }
}
