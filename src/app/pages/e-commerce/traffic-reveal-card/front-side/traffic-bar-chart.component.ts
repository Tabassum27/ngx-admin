import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

declare const echarts: any;

@Component({
  selector: 'ngx-traffic-bar-chart',
  styleUrls: ['traffic-front-card.component.scss'],
  template: `
    <div echarts [options]="option" class="echart" (chartInit)="onChartInit($event)"></div>
  `,
})
export class TrafficBarChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() data: number[];
  @Input() labels: string[];
  @Input() formatter: string;

  option: any = {};
  themeSubscription: any;
  echartsInstance;

  constructor(private theme: NbThemeService) {
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.data.isFirstChange() && !changes.labels.isFirstChange()) {
      this.echartsInstance.setOption({
        series: [{
          data: this.data,
        }],
        xAxis: {
          data: this.labels,
        },
        tooltip: {
          formatter: this.formatter,
        },
      })
    }
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const trafficTheme: any = config.variables.trafficBarEchart;

      this.option = Object.assign({}, {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type : 'category',
          data : this.labels,
          axisLabel: {
            color: trafficTheme.axisTextColor,
            fontSize: trafficTheme.axisFontSize,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          show: false,
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          boundaryGap: [0, '5%'],
        },
        tooltip: {
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            color: trafficTheme.tooltipTextColor,
            fontWeight: trafficTheme.tooltipFontWeight,
            fontSize: 16,
          },
          position: 'top',
          backgroundColor: trafficTheme.tooltipBg,
          borderColor: trafficTheme.tooltipBorderColor,
          borderWidth: 3,
          formatter: this.formatter,
          extraCssText: trafficTheme.tooltipExtraCss,
        },
        series: [
          {
            type: 'bar',
            barWidth: '40%',
            data: this.data,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: trafficTheme.gradientFrom,
                }, {
                  offset: 1,
                  color: trafficTheme.gradientTo,
                }]),
                opacity: 1,
                shadowColor: trafficTheme.gradientFrom,
                shadowBlur: 5,
              },
            },
          },
        ],
      });
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}