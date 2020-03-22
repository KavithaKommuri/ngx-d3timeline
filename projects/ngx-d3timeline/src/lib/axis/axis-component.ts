import { Component, Input } from '@angular/core';
import { Axis } from './axis';

@Component({
  selector: '[ngx-d3timeline-axis]',
  template: `
    <svg:g class="axis-group">
      <svg:g
        *ngFor="let tickMark of axis.tickMarks"
        ngx-d3timeline-axis-tick-mark
        [tickMark]="tickMark"
      ></svg:g>
      <svg:g
        *ngFor="let gridLine of axis.gridLines"
        class="grid-line"
        ngx-d3timeline-line
        [line]="gridLine"
      ></svg:g>
      <svg:g class="axis-line" ngx-d3timeline-line [line]="axis.line"></svg:g>
    </svg:g>
  `
})
export class AxisComponent {
  @Input() axis: Axis;
}
