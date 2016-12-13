/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, EventEmitter, Injectable, Input, NgModule, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';


// ---- model

class OrderItem {
  constructor(
      public orderItemId: number, public orderId: number, public productName: string,
      public quantity: number, public unitPrice: number) {}

  get total(): number { return this.quantity * this.unitPrice; }
}

class Order {
  constructor(
      public orderId: number, public customerName: string, public limit: number,
      private dataService: DataService) {}

  get items(): OrderItem[] { return this.dataService.itemsFor(this); }
  get total(): number { return this.items.map(i => i.total).reduce((a, b) => a + b, 0); }
}



// ---- services

let nextId = 1000;
@Injectable()
class DataService {
  orderItems: OrderItem[];
  orders: Order[];
  currentOrder: Order = null;

  constructor() {
    this.orders = [
      new Order(nextId++, 'J. Coltrane', 100, this), new Order(nextId++, 'B. Evans', 200, this)
    ];

    this.orderItems = [
      new OrderItem(nextId++, this.orders[0].orderId, 'Bread', 5, 1),
      new OrderItem(nextId++, this.orders[0].orderId, 'Brie', 5, 2),
      new OrderItem(nextId++, this.orders[0].orderId, 'IPA', 5, 3),

      new OrderItem(nextId++, this.orders[1].orderId, 'Mozzarella', 5, 2),
      new OrderItem(nextId++, this.orders[1].orderId, 'Wine', 5, 3)
    ];
  }

  itemsFor(order: Order): OrderItem[] {
    return this.orderItems.filter(i => i.orderId === order.orderId);
  }

  addItemForOrder(order: Order): void {
    this.orderItems.push(new OrderItem(nextId++, order.orderId, '', 0, 0));
  }

  deleteItem(item: OrderItem): void { this.orderItems.splice(this.orderItems.indexOf(item), 1); }
}



// ---- components

@Component({
  selector: 'order-list-cmp',
  template: `
    <h1>Orders</h1>
  	<div *ngFor="let order of orders" [class.warning]="order.total > order.limit">
      <div>
        <label>Customer name:</label>
        {{order.customerName}}
      </div>

      <div>
        <label>Limit: <input [(ngModel)]="order.limit" type="number" placeholder="Limit"></label>
      </div>

      <div>
        <label>Number of items:</label>
        {{order.items.length}}
      </div>

      <div>
        <label>Order total:</label>
        {{order.total}}
      </div>

      <button (click)="select(order)">Select</button>
  	</div>
  `
})
class OrderListComponent {
  orders: Order[];

  constructor(private dataService: DataService) { this.orders = dataService.orders; }
  select(order: Order): void { this.dataService.currentOrder = order; }
}


@Component({
  selector: 'order-item-cmp',
  template: `
    <div>
      <div>
        <label>Product name: <input [(ngModel)]="item.productName" type="text" placeholder="Product name"></label>
      </div>

      <div>
        <label>Quantity: <input [(ngModel)]="item.quantity" type="number" placeholder="Quantity"></label>
      </div>

      <div>
        <label>Unit Price: <input [(ngModel)]="item.unitPrice" type="number" placeholder="Unit price"></label>
      </div>

      <div>
        <label>Total:</label>
        {{item.total}}
      </div>

      <button (click)="onDelete()">Delete</button>
    </div>
  `
})
class OrderItemComponent {
  @Input() orderItem: OrderItem;
  @Output() delete = new EventEmitter();

  onDelete(): void { this.delete.emit(this.orderItem); }
}

@Component({
  selector: 'order-details-cmp',
  template: `
    <div *ngIf="order !== null">
      <h1>Selected Order</h1>
      <div>
        <label>Customer name: <input [(ngModel)]="order.customerName" type="text" placeholder="Customer name"></label>
      </div>

      <div>
        <label>Limit: <input [(ngModel)]="order.limit" type="number" placeholder="Limit"></label>
      </div>

      <div>
        <label>Number of items:</label>
        {{order.items.length}}
      </div>

      <div>
        <label>Order total:</label>
        {{order.total}}
      </div>

      <h2>Items</h2>
      <button (click)="addItem()">Add Item</button>
      <order-item-cmp *ngFor="let item of order.items" [item]="item" (delete)="deleteItem(item)"></order-item-cmp>
    </div>
  `
})
class OrderDetailsComponent {
  constructor(private dataService: DataService) {}

  get order(): Order { return this.dataService.currentOrder; }

  deleteItem(orderItem: OrderItem): void { this.dataService.deleteItem(orderItem); }

  addItem(): void { this.dataService.addItemForOrder(this.orderItem); }
}

@Component({
  selector: 'order-management-app',
  providers: [DataService],
  template: `
    <order-list-cmp></order-list-cmp>
    <order-details-cmp></order-details-cmp>
  `
})
class OrderManagementApplication {
}

@NgModule({
  bootstrap: [OrderManagementApplication],
  declarations:
      [OrderManagementApplication, OrderListComponent, OrderDetailsComponent, OrderItemComponent],
  imports: [BrowserModule, FormsModule]
})
class ExampleModule {
}

export function main() {
  platformBrowserDynamic().bootstrapModule(ExampleModule);
}
