import { AfterViewInit, Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-multiBar',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsMultiBarComponent implements AfterViewInit, OnDestroy, OnChanges {
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
      const colors = this.themeSubscription?.config?.variables;
      const echarts = this.themeSubscription?.config?.variables?.echarts;
      this.updateChartOptions(colors, echarts);
    }
  }

  updateChartOptions(colors?: any, echarts?: any) {
    if (!this.chartsData) {
      return;
    }

    const xAxisData = this.chartsData.itemName || [];
    const seriesData = [];

    const keys = Object.keys(this.chartsData.itemValue || {});
    keys.forEach((key) => {
      seriesData.push({
        name: key,
        type: 'bar',
        data: this.chartsData.itemValue[key],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      });
    });

    this.options = {
      title: {
        text: this.chartsData.title,
        left: 'left',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br />{a}: {c}',
        textStyle: {
          fontFamily: 'Arial', // Ensure consistent font
          fontSize: 12 // Adjust tooltip font size
        }
      },
      legend: {
        data: keys,
        top: '5%',
        left: 'center',
        itemGap: 20,
        itemWidth: 30,
        itemHeight: 15
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: {
        left: '0%',
        right: '4%',
        bottom: '5%',
        containLabel: true,
        formatter: '{b}<br />{a}: {c}',
        textStyle: {
          fontFamily: 'Arial', // Ensure consistent font
          fontSize: 12 // Adjust tooltip font size
        }
      },
      backgroundColor: echarts ? echarts.bg : undefined,
      color: colors ? [colors.danger, colors.primary, colors.info] : undefined,
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
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
