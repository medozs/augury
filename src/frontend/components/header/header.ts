import {Component, NgZone} from '@angular/core';

import {UserActions} from '../../actions/user-actions/user-actions';
import {ComponentDataStore}
  from '../../stores/component-data/component-data-store';


@Component({
  selector: 'augury-header',
  templateUrl: 'src/frontend/components/header/header.html',
  inputs: ['searchDisabled']
})
export class Header {

  private searchDisabled: boolean;
  private searchIndex: number = 0;
  private totalSearchCount: number = 0;
  private query: string = '';

  constructor(
    private userActions: UserActions,
    private componentDataStore: ComponentDataStore,
    private _ngZone: NgZone
  ) {

    this.componentDataStore.dataStream
      .subscribe((data: any) => {
        this.totalSearchCount = data.totalSearchCount;
      });

  }

  ngOnChanges() {
    if (this.searchDisabled) {
      this.query = '';
    }
  }

  /**
   * Query for a node
   * @param  {String} query
   */
  onKey(event, isNext) {

    if (this.query.length === 0) {
      return;
    }

    if (isNext === undefined && event.keyCode === 13) {
      this.searchIndex++;
    } else if (isNext === undefined) {
      this.searchIndex = 0;
    } else if (isNext) {
      this.searchIndex++;
    } else if (!isNext) {
      this.searchIndex--;
    }

    // cycle over the search results if reached at the end
    if (this.searchIndex === this.totalSearchCount) {
      this.searchIndex = 0;
    } else if (this.searchIndex < 0) {
      this.searchIndex = this.totalSearchCount - 1;
    }

    this.query = this.query.toLocaleLowerCase();

    this.userActions.searchNode({ query: this.query, index: this.searchIndex });
    this._ngZone.run(() => undefined);
  }

}
