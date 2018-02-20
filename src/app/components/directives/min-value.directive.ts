import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {Directive, Input} from "@angular/core";

@Directive({
  selector: '[minValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValueValidatorDirective, multi: true}]
})
export class MinValueValidatorDirective implements Validator {
  @Input('minValue') minValue: number;

  validate(control: AbstractControl): {[key: string]: any} {
    return this.minValue > control.value
      ? { 'minValue': { value: control.value } }
      : null;
  }
}

@Directive({
  selector: '[maxValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxValueValidatorDirective, multi: true}]
})
export class MaxValueValidatorDirective implements Validator {
  @Input('maxValue') maxValue: number;

  validate(control: AbstractControl): {[key: string]: any} {
    return this.maxValue < control.value
      ? { 'maxValue': { value: control.value } }
      : null;
  }
}
