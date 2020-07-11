import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { DishService } from '../services/dish.service';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  feedbackCommentForm: FormGroup;
  feedback: Comment;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  @ViewChild('fform') feedbackCommentFormDirective;

  formError = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.'
    }
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) { this.createForm(); }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

    this.route.params.pipe(switchMap(
      (params: Params) => this.dishService.getDish(params['id'])
    )
    ).subscribe(dish => {
      this.dish = dish;
      this.setPrevNext(dish.id);
    });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm(): void {
    this.feedbackCommentForm = this.fb.group({
      author: ['',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],
      comment: ['',
        [
          Validators.required
        ]
      ],
      rating: 5
    });

    this.feedbackCommentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackCommentForm) { return; }

    const form = this.feedbackCommentForm;

    for (const field in this.formError) {
      if (this.formError.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formError[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];

          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackCommentForm.value;
    this.feedback.date = new Date().toISOString();
    
    DISHES.map(dish => {
      if (dish.id === this.dish.id) {
        dish.comments.push(this.feedback);
      }
    });

    this.feedbackCommentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });

    // this.feedbackCommentFormDirective.resetForm();
  }

}
