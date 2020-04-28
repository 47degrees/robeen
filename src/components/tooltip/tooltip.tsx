import { h, Component, Element, Method, State } from '@stencil/core';

import { Selection, select } from 'd3-selection';
import { transition } from 'd3-transition';

import { formatter } from "@app/utils/utils";


@Component({
  tag: "robeen-tooltip",
  styleUrl: "tooltip.css",
})
export class Tooltip {
  @State() index: number;
  @State() hoodData: any;
  @Element() tooltipEl: HTMLElement;
  d3sTooltip: Selection<Element, any, any, any>;

  @Method()
  async setTooltip(tooltipElement: any): Promise<void> {
    this.d3sTooltip = select(tooltipElement);
  }

  @Method()
  async show(index: number, data: any, positions: number[]): Promise<void> {
    if (index !== this.index) {
      this.index = index;
      this.hoodData = { ...data };
    }
    this.d3sTooltip.transition(transition().duration(333)).style("opacity", 1);
    this.d3sTooltip
      .style("left", `${positions[0]}px`)
      .style("top", `${positions[1] - 38}px`);
  }

  @Method()
  async hide(): Promise<void> {
    this.d3sTooltip.transition(transition().duration(333)).style("opacity", 0);
  }

  render() {
    return (
      <div class="tooltip">
        <div class="tooltip-title">
          {this.hoodData ? this.hoodData.benchmark : ""}
        </div>
        <div class="tooltip-data-row">
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Score</div>
            <div>
              {formatter(
                "TWO_DECIMALS",
                this.hoodData ? this.hoodData.primaryMetric.score : ""
              )}
            </div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Min</div>
            <div>
              {formatter(
                "TWO_DECIMALS",
                this.hoodData
                  ? Math.min(
                      ...this.hoodData.primaryMetric.rawData.reduce(
                        (acc, x) => acc.concat(x),
                        []
                      )
                    )
                  : ""
              )}
            </div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Max</div>
            <div>
              {formatter(
                "TWO_DECIMALS",
                this.hoodData
                  ? Math.max(
                      ...this.hoodData.primaryMetric.rawData.reduce(
                        (acc, x) => acc.concat(x),
                        []
                      )
                    )
                  : ""
              )}
            </div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Error</div>
            <div class="error-info">
              {formatter(
                "TWO_DECIMALS",
                this.hoodData ? this.hoodData.primaryMetric.scoreError : ""
              )}
            </div>
          </div>
          <div class="tooltip-data-cell">
            <div class="tooltip-data-title">Unit</div>
            <div>
              {this.hoodData ? this.hoodData.primaryMetric.scoreUnit : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
