import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

@Directive({
  selector: '[ngModelChangeDebounced]'
})
export class ChangeDebouncedDirective {
  @Output()
  ngModelChangeDebounced = new EventEmitter<any>();
  @Input()
  ngModelChangeDebounceTime = 500; // optional, 500 default

  subscription: Subscription;
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private ngModel: NgModel) {
    this.subscription = this.ngModel.control.valueChanges.pipe(
      skip(1), // skip initial value
      distinctUntilChanged(),
      debounceTime(this.ngModelChangeDebounceTime)
    ).subscribe((value) => this.ngModelChangeDebounced.emit(value));
  }

}
