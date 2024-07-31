import { Component } from '@angular/core';
import { NbDateService, NbThemeService } from '@nebular/theme';
import { mapKeys } from 'lodash';
import { HttpClient } from '@angular/common/http';
import * as xls from 'xlsx'
import { Observable, Subscription } from 'rxjs';
import { DataService } from '../data.service';

interface menuData {
  foodItemOrdered: string,
  orderedItemClass: string,
  orderNo: string
}

@Component({
  selector: 'ngx-echarts',
  styleUrls: ['./echarts.component.scss'],
  templateUrl: './echarts.component.html',
})
export class EchartsComponent {

  private dataSubscription: Subscription;

  excelData: menuData[] = []
  showChart: boolean = false;
  chartDataArray: Array<any>[] = [];
  groupedChartDataArray: any[] = [];
  labelData: any[] = [];
  min: Date;
  max: Date;

  constructor(private http: HttpClient,
    protected dateService: NbDateService<Date>,
    private dataService: DataService) {
    this.dataSubscription = this.dataService.getData().subscribe(data => {
      this.excelData = data;
      console.log("excel data from subject..")
    });
  }

  setLabelData() {
    let data: any[] = this.chartDataArray.filter(e => e["type"]?.includes("label"))
      .map((data) => {
        let obj: any[] = [];
        let nameArray: any[] = data["itemName"];
        let valueArray = data["itemValue"];
        nameArray.forEach((item, index) => {
          obj.push({
            itemName: item,
            itemValue: valueArray[index],
          });
        });
        return obj;
      });
    return data[0];
  }

  groupArray(data: any[], size: number) {
    data = data.filter(e => e.charttype);
    const groupedArray = [];
    for (let i = 0; i < data.length; i += size) {
      groupedArray.push(data.slice(i, i + size));
    }
    return groupedArray;
  }

  setPieChartData(object: any) {
    object.chartsData = {
      legendData: object["itemName"],
      seriesName: object["title"],
      seriesData: this.getSeriesData(object["itemName"], object["itemValue"])
    };
    return object;
  }

  setBarChartData(object: any) {
    object.barChartData = {
      xAxisData: object["itemName"],
      seriesData: object["itemValue"],
      seriesName: object["title"]
    };
    return object;
  }

  setLineChartData(object: any) {
    object.lineChartData = {
      xAxisData: object["itemName"],
      seriesData: object["itemValue"],
      seriesName: object["title"]
    };
    return object;
  }

  getSeriesData(names: any[], values: any[]) {
    return names.map((name, index) => ({
      value: values[index],
      name: name
    }));
  }

  getKeyValues(object, possibleKeys) {
    for (const key of possibleKeys) {
      if (object.hasOwnProperty(key)) {
        return object[key];
      }
    }
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/data/data.json");
  }

  onSumbitEvent(event) {
    console.log("submit", event);
    this.showChart = true;
    this.loadJsonData();
  }

  loadJsonData() {
    this.getJSON().subscribe(data => {
      this.chartDataArray = data;

      this.chartDataArray = this.chartDataArray.map((object: any) => {
        switch (object?.charttype) {
          case 'donut':
          case 'pie':
            return this.setPieChartData(object);
          case 'bar':
            return this.setBarChartData(object);
          case 'multiline':
            return this.setLineChartData(object);
          // case 'multibar':
          //   return this.setMultiBarChartData(object);
          case 'line':
            return this.setLineChartData(object);
          default:
            return object;
        }
      });
      this.groupedChartDataArray = this.groupArray(this.chartDataArray, 3);
      this.labelData = this.setLabelData();
      console.log("labelData", this.labelData)
      console.log("groupedChartDataArray", this.groupedChartDataArray)
    });
  }

  onBack() {
    this.showChart = false;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}

