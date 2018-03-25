import {_countGroupLabelsBeforeOption} from "@angular/material";

export default class AvgCounter {
  private _sum = 0;
  private _count = 1;
  date: string;


  constructor(num: number= 0, date) {
    this._count = 1;
    this.date = date;
    this._sum = num;
  }
  get value() {
    return this ? (this._count !== 0 ? Math.round(this._sum / this._count) : null) : null;
  }
  addItem (num: number) {
    console.log(this._sum, num);
    this._sum += num;
    this._count++;
  }
  remove (num: number) {
    this._sum -= num;
    this._count--;
  }
}

