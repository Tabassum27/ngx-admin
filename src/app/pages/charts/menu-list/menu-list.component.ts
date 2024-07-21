import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  public onModelChangeSubject = new Subject<string>();


  menuList: menuData[] = [];
  hoverIndex: number;
  searchInput: string;

  constructor() {
  }

  ngOnChanges() {
    if (this.excelData) {
      this.menuList = this.excelData;
    }
    this.onModelChangeSubject.pipe(debounceTime(1000)).subscribe(_ => {
      this.onInputSearch();
    });
  }

  onKeyUp(event) {
    this.menuList = this.excelData.filter(data => {
      if (data.foodItemOrdered.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())) {
        return data;
      }
    });
    console.log(this.menuList)
  }

  onSubmt() {
    console.log("sumbit clicked!!")
    this.submiEvent.emit(true);
  }

  onSelectMenu(item: menuData) {
    this.searchInput = item.foodItemOrdered;
    this.onInputSearch();
  }

  onInputSearch() {
    this.menuList = this.excelData.filter(data => {
      if (data.foodItemOrdered.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase())) {
        return data;
      }
    });
  }
}
