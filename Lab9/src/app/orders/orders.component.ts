import { Component, OnInit } from '@angular/core';
import {OrdersService} from '../shared/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  coffees = [
    'Americano',
    'Flat White',
    'Cappuccino',
    'Latte',
    'Espresso',
    'Machiato',
    'Mocha',
    'Hot Chocolate',
    'Tea'
  ];

  coffeeOrder = [];

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
  }

  addCoffee = coffee => this.coffeeOrder.push(coffee);

  removeCoffee = coffee => {
    const index = this.coffeeOrder.indexOf(coffee);
    if (index > -1) {
      this.coffeeOrder.splice(index, 1);
    }
  };

  onSubmit() {
    this.ordersService.form.value.coffeeOrder = this.coffeeOrder;
    const data = this.ordersService.form.value;

    this.ordersService.createCoffeeOrder(data)
      .then(res => {
        /*do something here....
        maybe clear the form or give a success message*/
      });
  }

}
