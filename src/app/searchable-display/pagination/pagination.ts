import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sd-pagination',
  imports: [],
  template: `
    <p>
      pagination works!
    </p>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {

}
