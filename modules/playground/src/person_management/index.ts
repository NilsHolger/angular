/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';


// services

@Injectable()
class DataService {
  currentPerson: Person;
  persons: Person[];

  constructor() {
    this.persons = [
      new Person('Victor', 'Savkin', 1980), new Person('Igor', 'Minar', 1981),
      new Person('Victor', 'Berchet', 1982), new Person('Vamsi', 'Varikuti', 1983),
      new Person('Timothy', 'Blasi', 1984), new Person('Tobias', 'Bosch', 1985),
      new Person('Miško', 'Hevery', 1986), new Person('Kara', 'Puppylove', 1987),
      new Person('Flavio', 'Corpa', 1988), new Person('Brian', 'Ford', 1989),
      new Person('Alex', 'Rickabaugh', 1990), new Person('João', 'Dias', 1991),
      new Person('Alex', 'Eagle', 1992), new Person('Nils', 'Naegele', 1993)
    ];
    
    for (let i = 0; i < this.persons.length; i++){
        this.persons[i].friends = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(_ => this.persons[_]);
        continue;
    }
    this.currentPerson = this.persons[0];
  }
}

// components

@Component({
  selector: 'full-name-cmp',
  template: `
    <h1>Edit Full Name</h1>
    <div>
      <form ngNoForm>
          <div>
            <label>
              First: <input [(ngModel)]="person.firstName" type="text" placeholder="First name">
            </label>
          </div>
          <div>
            <label>
              Last: <input [(ngModel)]="person.lastName" type="text" placeholder="Last name">
            </label>
          </div>
          <div>
            <label>{{person.fullName}}</label>
          </div>
      </form>
    </div>
  `
})
class FullNameComponent {
  constructor(private dataService: DataService) {}
  get person(): Person { return this.dataService.currentPerson; }
}

@Component({
  selector: 'persons-detail-cmp',
  template: `
    <h2>{{person.fullName}}</h2>
    <div>
      <form ngNoForm>
        <div>
					<label>First: <input [(ngModel)]="person.firstName" type="text" placeholder="First name"></label>
				</div>
        <div>
					<label>Last: <input [(ngModel)]="person.lastName" type="text" placeholder="Last name"></label>
				</div>
        <div>
					<label>Year of birth: <input [(ngModel)]="person.yearOfBirth" type="number" placeholder="Year of birth"></label>
          Age: {{person.age}}
				</div>
        <div *ngIf="person.friends.length > 0">
					<label>Friends:</label>
          {{person.friendNames}}
				</div>
      </form>
    </div>
  `
})
class PersonsDetailComponent {
  constructor(private dataService: DataService) {}
  get person(): Person { return this.dataService.currentPerson; }
}

@Component({
  selector: 'persons-cmp',
  template: `
    <h1>FullName Demo</h1>
    <div>
      <ul>
  		  <li *ngFor="let person of persons">
  			  <label (click)="select(person)">{{person.fullName}}</label>
  			</li>
  	 </ul>
     <persons-detail-cmp></persons-detail-cmp>
    </div>
  `
})
class PersonsComponent {
  persons: Person[];
  constructor(private dataService: DataService) { this.persons = dataService.persons; }
  select(person: Person): void { this.dataService.currentPerson = person; }
}


@Component({
  selector: 'person-management-app',
  viewProviders: [DataService],
  template: `
    <button (click)="switchToEditName()">Edit Full Name</button>
    <button (click)="switchToPersonList()">Person Array</button>
    <full-name-cmp *ngIf="mode === 'editName'"></full-name-cmp>
    <persons-cmp *ngIf="mode === 'personList'"></persons-cmp>
  `
})
class PersonManagementApplication {
  mode: string;
  switchToEditName(): void { this.mode = 'editName'; }
  switchToPersonList(): void { this.mode = 'personList'; }
}


// model

let id = 0;
class Person {
  personId: number;
  friends: Person[];

  constructor(public firstName: string, public lastName: string, public yearOfBirth: number) {
    this.personId = id++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.friends = [];
  }

  get age(): number { return 2016 - this.yearOfBirth; }
  get fullName(): string { return `${this.firstName} ${this.lastName}`; }
  get friendNames(): string { return this.friends.map(f => f.fullName).join(', '); }
}

@NgModule({
   bootstrap: [PersonManagementApplication],
   declarations:
       [PersonManagementApplication, FullNameComponent, PersonsComponent, PersonsDetailComponent],
   imports: [BrowserModule, FormsModule]
 })
 class ExampleModule {
 }

function main() {
   platformBrowserDynamic().bootstrapModule(ExampleModule);
 }


