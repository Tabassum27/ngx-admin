import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'ngx-echarts-percentage',
    template: `
    <div echarts [options]="options"  class="echart"></div>
  `,
})
export class EchartsPercentageComponent implements AfterViewInit, OnDestroy {

    options: any = {};
    @Input() value: any;
    themeSubscription: any;

    constructor(private theme: NbThemeService) {
    }

    ngAfterViewInit() {

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            this.options = Object.assign({}, {
                series: [
                    {
                        name: '', //no name to be given
                        type: 'pie',
                        radius: ['40%', '90%'], //will adjust these values once code is implemented
                        avoidLabelOverlap: false,
                        hoverAnimation: false,  //on mouse over no animation
                        tooltip: false, //on mouse over no labelcode is display
                        itemStyle: {
                            borderRadius: 5,
                            borderColor: '#fff',
                            borderWidth: 1
                        },
                        label: {
                            show: true,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 10,
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.value, name: `${this.value}%`, itemStyle: { color: '#676' } },  //11 is the value to show, 11% is the lable in the center, and set a color to display
                            { value: 100 - this.value, itemStyle: { color: '#e9e9e9' } }  //89 is 100-11, color is is hardcoded for light grey
                        ]
                    }
                ]

            });
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
