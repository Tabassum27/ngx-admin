import { Component } from '@angular/core';
import { NbDateService, NbThemeService } from '@nebular/theme';
import { mapKeys } from 'lodash';
import { HttpClient } from '@angular/common/http';
import * as xls from 'xlsx'
import { Observable } from 'rxjs';

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

  excelData: menuData[] = []
  showChart: boolean = false;
  chartDataArray: Array<any>[] = [];
  groupedChartDataArray: any[] = [];
  labelData: any[] = [];
  min: Date;
  max: Date;

  constructor(private http: HttpClient,
    protected dateService: NbDateService<Date>) {
    this.min = this.dateService.addDay(this.dateService.today(), -5);
    this.max = this.dateService.addDay(this.dateService.today(), 5);

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

  onFileSelected(e: any) {

    const file = e.target.files[0];
    let fr = new FileReader();

    fr.readAsArrayBuffer(file);

    fr.onload = () => {

      let data = fr.result;
      let workbook = xls.read(data, { type: 'array' });

      const sheetname = workbook.SheetNames[0];

      const sheet1 = workbook.Sheets[sheetname]

      this.excelData = xls.utils
        .sheet_to_json(sheet1)
        .map(row => mapKeys(row, (value, key) => this.toCamelCase(key)))
        .map(e => {
          let data = {} as menuData;
          data.foodItemOrdered = e['foodItemOrdered'];
          data.orderedItemClass = e['orderedItemClass'];
          data.orderNo = e['orderNo']
          return data;
        });

      this.excelData = this.excelData.slice(0, 50);
    }
  }

  // Helper function to convert strings to camelCase
  private toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  onSumbitEvent(event) {
    console.log("submit", event);
    this.showChart = true;
  }
  onBack() {
    this.showChart = false;
  }
}

