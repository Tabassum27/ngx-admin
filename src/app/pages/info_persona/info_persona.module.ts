import { InfoPersonaRoutingModule, routedComponents } from './info_persona-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ImplicitAutenticationService } from './../../@core/utils/implicit_autentication.service';
import { PersonaService } from '../../@core/data/persona.service';
import { InfoPersonaService } from '../../@core/data/info_persona.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudInfoPersonaComponent } from './crud-info_persona/crud-info_persona.component';

@NgModule({
  imports: [
    ThemeModule,
    InfoPersonaRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ImplicitAutenticationService,
    PersonaService,
    InfoPersonaService,
  ],
  exports: [
    CrudInfoPersonaComponent,
  ],
})
export class InfoPersonaModule { }