import { Component, ViewEncapsulation } from '@angular/core';
import { deliveryData } from './data';
import { Activity } from 'ngx-d3timeline';
import { Options } from 'ngx-d3timeline';
import { BehaviorSubject } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent {
  activities = deliveryData;

  optionUpdateSubject = new BehaviorSubject<{ [key: string]: any }>(null);

  initialOptions: Options = {
    orientation: 'Vertical',
    resource: {
      gap: 0,
      padding: 5
    },
    activity: {
      fontFace: 'Arial',
      fontSize: 12,
      padding: 0
    },
    resourceAxis: {
      showGridLines: true,
      tickLineLength: 0
    },
    timeAxis: {
      showGridLines: true,
      tickLineLength: 5
    },
    type: {
      Driving: {
        activity: {
          fontFace: 'Arial',
          fontSize: 10,
          padding: 10
        }
      }
    }
  };

  options$ = this.optionUpdateSubject.pipe(
    scan(this.updateOptions, this.initialOptions),
    tap(console.log)
  );

  width = 800;
  height = 600;

  onDropped(activity: Activity) {
    console.log(activity);
  }

  flipOrientation(options: Options) {
    const orientation =
      options.orientation === 'Vertical' ? 'Horizontal' : 'Vertical';
    this.optionUpdateSubject.next({
      orientation
    });
  }

  update(key: string, orig: any, value: any) {
    this.optionUpdateSubject.next({
      [key]: { ...orig, ...value }
    });
  }

  onHovered(event: any) {
    console.log('hovered ', event);
  }

  onUnhovered(event: any) {
    console.log('unhovered ', event);
  }

  private updateOptions(options: Options, value: { [key: string]: any }) {
    console.log(value);
    return { ...{ ...options, ...value } };
  }
}
