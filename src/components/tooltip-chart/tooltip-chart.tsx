import { Component, Element, Prop, Method, State } from '@stencil/core';
import { Selection, select } from 'd3-selection';
import { transition } from 'd3-transition';


@Component({
  tag: 'tooltip-chart',
  styleUrl: 'tooltip-chart.css',
})
export class TooltipChart {
  @Prop() align: string = 'center';
  @State() index: number;
  @State() hoodData: any;
  @Element() tooltipEl: HTMLElement;
  _tooltip: Selection<Element, any, any, any>;

  @Method()
  tooltip(tooltip: Element): void {
    this._tooltip = select(tooltip);
    this._tooltip.style('text-align', this.align);
  }

  @Method()
  show(index: number, data: any, positions: number[]): void {
    if (index !== this.index) {
      this.index = index;
      this.hoodData = { ...data };
    }
    this._tooltip.transition(transition().duration(333)).style('opacity', 1);
    this._tooltip
      .style('left', `${positions[0]}px`)
      .style('top', `${positions[1] - 38}px`);
  }

  @Method()
  hide(): void {
    this._tooltip.transition(transition().duration(333)).style('opacity', 0);
  }

  render() {
    return (
      <div class="tooltip">
        <div class="tooltip-title">{this.hoodData ? this.hoodData.benchmark : ''}</div>
        <div class="tooltip-data-row">
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Score</div>
            <div>{this.hoodData ? Math.round(this.hoodData.primaryMetric.score) : ''}</div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Min</div>
            <div>{this.hoodData ? Math.round(Math.min(...this.hoodData.primaryMetric.rawData.reduce((acc, x) => acc.concat(x), []))) : ''}</div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Max</div>
            <div>{this.hoodData ? Math.round(Math.max(...this.hoodData.primaryMetric.rawData.reduce((acc, x) => acc.concat(x), []))) : ''}</div>
           </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Error</div>
            <div class="error-info">{this.hoodData ? Math.round(this.hoodData.primaryMetric.scoreError) : ''}</div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Unit</div>
            <div>{this.hoodData ? this.hoodData.primaryMetric.scoreUnit : ''}</div>
          </div >
        </div>
      </div>
    );
  }
}
