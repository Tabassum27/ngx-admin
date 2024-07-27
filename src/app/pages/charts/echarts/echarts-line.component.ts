import { AfterViewInit, Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-line',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsLineComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() chartsData: any;
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) { }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.updateChartOptions(colors, echarts);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartsData && !changes.chartsData.firstChange) {
      this.updateChartOptions();
    }
  }

  updateChartOptions(colors?: any, echarts?: any) {
    if (!this.chartsData) {
      return;
    }
    const xAxisData = this.chartsData.xAxisData || [];
    const seriesData = [];

    if (Array.isArray(this.chartsData.seriesData)) {
      // Single line chart
      seriesData.push({
        name: this.chartsData.title,
        type: 'line',
        data: this.chartsData.seriesData,
        smooth: true,
      });
    } else {
      // Multiline chart
      const keys = Object.keys(this.chartsData.seriesData || {});
      keys.forEach((key, index) => {
        seriesData.push({
          name: key,
          type: 'line',
          data: this.chartsData.seriesData[key],
          smooth: true,
        });
      });
    }

    this.options = {
      title: {
        text: this.chartsData.title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: seriesData.map(series => series.name),
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      backgroundColor: echarts ? echarts.bg : undefined,
      color: colors ? [colors.danger, colors.primary, colors.info] : undefined,
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          formatter: function (value: string) {
            return value;
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value: number) {
            return value;
          }
        }
      },
      series: seriesData
    };
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
