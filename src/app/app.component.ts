/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { NbIconLibraries } from '@nebular/theme';
import { NbIonIcons } from './NbIonIcons';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService,
    private iconsLibrary: NbIconLibraries,
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconsLibrary.registerFontPack('nebular', { iconClassPrefix: 'nb' });

    iconsLibrary.registerSvgPack('ionicons', NbIonIcons);

    iconsLibrary.setDefaultPack('nebular');
    // @ts-ignore
    if (window.Cypress) {
      // @ts-ignore
      window.__appStore__ = store$;
    }
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
