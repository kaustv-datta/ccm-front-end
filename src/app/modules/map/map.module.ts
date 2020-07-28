import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './page/map/map.component';
import { MapRoutingModule } from './map.routing';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, MapRoutingModule],
})
export class MapModule { }
