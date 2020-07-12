import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { Leader } from '../shared/leader';
import { Promotion } from '../shared/promotion';

import { DishService } from '../services/dish.service';
import { LeaderService } from '../services/leader.service';
import { PromotionService } from '../services/promotion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL
  ) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe((resolve) => this.dish = resolve);
    this.promotionService.getFeaturedPromotion().subscribe((resolve) => this.promotion = resolve);
    this.leaderService.getFeaturedLeader().subscribe((resolve) => this.leader = resolve);
  }

}
