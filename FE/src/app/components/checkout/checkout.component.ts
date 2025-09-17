import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/common/address';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout-service';
import { KarimRamadanShopFormService } from 'src/app/services/karim-ramadan-shop-form.service';
import { CustomValidator } from 'src/app/validators/custom-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  selectedShippingAddressCountry: string = '';
  selectedBillingAddressCountry: string = '';
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  months: number[] = [];
  years: number[] = [];
  customer!: Customer;
  order!: Order;
  billingAddress!: Address;
  shippingAddress!: Address;
  orderItems!: OrderItem[];

  constructor(
    private formBuilder: FormBuilder,
    private formService: KarimRamadanShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router:Router) {
  }

  handleReviewOrder() {
    this.cartService.totalQuantity.subscribe(data => {
      console.log("quantity -> ", data);
      this.totalQuantity = data;
    })
    this.cartService.totalPrice.subscribe(data => {
      console.log("price -> ", data);
      this.totalPrice = data;
    })
  }
  handleStatesBasedOnCountry(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const selectedCountry = formGroup?.get('country')?.value;

    this.formService.getStatesByCountryCode(selectedCountry).subscribe(
      data => {
        if (formGroupName === "shippingAddress") {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  handleMonthBasedOnYear() {
    let startMonth: number;
    if (Number(this.checkoutFormGroup.get('creditCard.expirationYear')?.value) === new Date().getFullYear()) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.formService.getMonthsForCreditCard(startMonth).subscribe(
      data => this.months = data
    );
    this.creditCardExpirationMonth?.setValue(startMonth);
  }
  ngOnInit(): void {
    this.handleReviewOrder();
    this.populateCountries();
    console.log("countries => ", this.countries);
    let startMonth: number = new Date().getMonth() + 1;
    this.formService.getMonthsForCreditCard(startMonth).subscribe(
      data => {
        console.log("Received Month: ", JSON.stringify(data));
        this.months = data
      }
    );
    this.formService.getYearsForCreditCard().subscribe(
      data => this.years = data
    );
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        email: new FormControl('', [Validators.required, Validators.email, CustomValidator.notOnlyWhiteSpaces])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpaces]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    })
  }
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      console.log("invalid");
      return;
    }
    console.log("ok submitted");
    this.handleCheckout();
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }
  copyShippingAddressToBilingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.billingAddressStates = this.shippingAddressStates;
      this.checkoutFormGroup.get('billingAddress')?.setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
    }
    else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
      this.billingAddressStates = [];
    }
  }
  populateCountries() {
    this.formService.getCountries().subscribe(
      data => this.countries = data
    );
  }
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardName() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }
  get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  handleCheckout() {
    let purchase = new Purchase();
    purchase.customer.firstName = this.firstName?.value;
    purchase.customer.lastName = this.lastName?.value;
    purchase.customer.email = this.email?.value;

    purchase.billingAddress.city = this.billingAddressCity?.value.name;
    purchase.billingAddress.country = this.billingAddressCountry?.value;
    purchase.billingAddress.state = this.billingAddressState?.value.name;
    purchase.billingAddress.street = this.billingAddressStreet?.value;
    purchase.billingAddress.zipCode = this.billingAddressZipCode?.value;

    purchase.shippingAddress.city = this.shippingAddressCity?.value;
    purchase.shippingAddress.country = this.shippingAddressCountry?.value;
    purchase.shippingAddress.state = this.shippingAddressState?.value.name;
    purchase.shippingAddress.street = this.shippingAddressStreet?.value;
    purchase.shippingAddress.zipCode = this.shippingAddressZipCode?.value;

    this.cartService.totalPrice.subscribe(
      data => purchase.order.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => purchase.order.totalQuantity = data
    );

    purchase.orderItems = this.cartService.cartItems.map(
      cartItem => new OrderItem(cartItem)
    )
    console.log("order ->",purchase);
    this.checkoutService.addPurchase(purchase).subscribe(
      {
        next: res => {
          alert(`your order has been received.\nyour order tracking number is: ${res.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => console.error('error -> ',err)
      }
    );
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }
}
