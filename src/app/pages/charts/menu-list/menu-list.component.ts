import { Component, EventEmitter, Input, Output } from '@angular/core';

interface menuData {
  foodItemOrdered: string,
  orderedItemClass: string,
  orderNo: string
}

@Component({
  selector: 'ngx-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {

  @Input() excelData: menuData[];
  @Output() submiEvent = new EventEmitter();

  menuList: menuData[] = [];
  hoverIndex: number;

  constructor() {
  }

  ngOnChanges() {
    if (this.excelData) {
      this.menuList = this.excelData;
    }
  }

  onKeyUp(event) {
    console.log(event.target.value);
    console.log("excel", this.excelData);
    this.menuList = this.excelData.filter(data => {
      if (data.foodItemOrdered.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())) {
        return data;
      }
    });
    console.log(this.menuList)
  }

  onOrder(item: menuData) {

  }

  onSubmt() {
    console.log("sumbit clicked!!")
    this.submiEvent.emit(true);
  }
}
