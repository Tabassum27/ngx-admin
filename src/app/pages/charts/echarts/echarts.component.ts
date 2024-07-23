import { Component } from '@angular/core';
import { mapKeys } from 'lodash';
import * as xls from 'xlsx'
import * as exampleData from '../../../../assets/data.json';
import { HttpClient } from '@angular/common/http';
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

  sampleData: any[] = [
    {
      "name": "Target Product",
      "likes": '50%',
      "menuName": "Chicken Biryani"
    },
    {
      "name": "Cross Sell Product 1",
      "likes": '60%',
      "menuName": "Strawberry Smoothie"
    },
    {
      "name": "Cross Sell Product 2",
      "likes": '30%',
      "menuName": "Caesar Salad"
    },
    {
      "name": "Best Day of the Week",
      "likes": '41%',
      "menuName": "Wednseday"
    }
  ]

  constructor(private http: HttpClient
  ) {
    this.getJSON().subscribe(data => {
      this.chartDataArray = data;
      for (let i = 0; i < this.chartDataArray.length; i++) {
        let object: any = this.chartDataArray[i];

        //set pie data
        if (object?.type == 'pie') {
          object = this.setPieChartsData(object);
        }

        //set bar data
        if (object?.type == 'bar') {
          object = this.setBarChartData(object);
        }

        //set line data
        if (object?.type == 'line') {
          object = this.setLineChartData(object);
        }

        this.chartDataArray[i] = object;
      }
    });
  }

  setPieChartsData(object) {
    const possibleKeys = ["Restaurant Names", "Delivery Names", "order Names"];
    let legendData = this.getKeyValues(object, possibleKeys)
    object.chartsData = {
      legendData: legendData,
      seriesName: object["title"],
      seriesData: this.getSeriesData(legendData, object["Percentages"])
    }
    return object;
  }

  setBarChartData(object) {
    const possibleKeys = ["Day Names", "hour Names"];
    let xAxis = this.getKeyValues(object, possibleKeys);
    object.barChartData = {
      xAxisData: xAxis,
      seriesData: object["Counts"],
      seriesName: object["title"]
    }
    return object;
  }

  setLineChartData(object) {
    const possibleKeys = ["Month Names"];
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
    return this.http.get("./assets/data.json");
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

