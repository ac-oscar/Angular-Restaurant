import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { visibility, flyInOut, expand } from '../animations/app.animations';
import { DishService } from '../services/dish.service';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [visibility(), flyInOut(), expand()]
})

export class DishdetailComponent implements OnInit {

  feedbackCommentForm: FormGroup;
  feedback: Comment;
  dish: Dish;
  dishCopy: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  visibility = 'shown';
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
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL
  ) { this.createForm(); }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

    this.route.params.pipe(switchMap(
      (params: Params) => {
        this.visibility = 'hidden';
        return this.dishService.getDish(params['id']);
      }
    )
    ).subscribe(
      dish => {
        this.dish = dish;
        this.dishCopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = 'shown';
      },
      errmess => this.errMess = <any>errmess
    );
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
    this.dishCopy.comments.push(this.feedback);

    this.dishService.putDish(this.dishCopy).
      subscribe(
        dish => {
          this.dish = dish;
          this.dishCopy = dish;
        },
        errmess => {
          this.errMess = <any>errmess;
          this.dishCopy = null;
          this.dish = null;
        });

    this.feedbackCommentFormDirective.resetForm();
    this.feedbackCommentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }
}
