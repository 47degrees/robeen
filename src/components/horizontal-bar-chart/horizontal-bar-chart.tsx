import { Component, Element, Prop, Method } from '@stencil/core';
import objectAssignDeep from 'object-assign-deep';

import { Selection, select, event } from 'd3-selection';
import { max } from 'd3-array';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import {
  initTooltipIfExists,
  formatter,
  circularFind,
} from '@app/utils/utils';
import { DEFAULT_GRAPH_DATA_BAR } from '@app/shared/default-graph-data';

import {  GraphData, JMHData } from '@app/types/types';


@Component({
  tag: 'horizontal-bar-chart',
})
export class HorizontalBarChart {
  @Prop() graphData: GraphData<number[]>;
  @Prop() dataUrl: string;
  @Element() horizontalBarChartEl: HTMLElement;
  graphDataMerged: GraphData<number[]>;
  hoodData: JMHData;
  svg: Selection<SVGElement, any, HTMLElement, any>;
  root: Selection<SVGElement, any, HTMLElement, any>;
  width: number;
  height: number;
  x: ScaleLinear<number, number>;
  y: ScaleBand<string>;
  tooltipEl: HTMLTooltipChartElement;

  async componentWillLoad() {
    const response = await fetch(this.dataUrl);
    const data = await response.json();
    this.hoodData = data;

    this.graphDataMerged = objectAssignDeep(
      { ...DEFAULT_GRAPH_DATA_BAR },
      this.graphData,
    );

    this.graphDataMerged.labels = this.hoodData.map((metric) => metric.benchmark);
    this.graphDataMerged.data = this.hoodData.map((metric) => metric.primaryMetric.score);
  }

  componentDidLoad() {
    this.svg = select(this.horizontalBarChartEl.getElementsByTagName('svg')[0]);

    this.height =
      this.svg.node().getBoundingClientRect().height -
      this.graphDataMerged.barChart.margin.top -
      this.graphDataMerged.barChart.margin.bottom;

    this.initSlots();
    this.drawChart();
    const onResize = () => {
      this.drawChart();
    };

    window.addEventListener('resize', onResize);
  }

  @Method()
  updateGraphData(graphData: GraphData<number[]>): void {
    this.graphDataMerged = objectAssignDeep(
      { ...DEFAULT_GRAPH_DATA_BAR },
      graphData,
    );

    this.drawChart();
  }

  drawChart(): void {
    if (this.hasData()) {
      this.reSetRoot();

      this.width =
        this.svg.node().getBoundingClientRect().width -
        this.graphDataMerged.barChart.margin.left -
        this.graphDataMerged.barChart.margin.right;

      const originalGraphData: number[] = this.graphDataMerged.data;
      const originalGraphDataSortedIndexes: any[] = originalGraphData
        .map((val, ind) => ({ ind, val }))
        .sort((a, b) => a.val >= b.val ? 1 : 0)
        .map((obj) => obj.ind);

      const maxValue = max<number, number>(originalGraphData, data => data);

      this.x = scaleLinear()
        .domain([0, Math.ceil(maxValue / 100) * 100])
        .range([0, this.width]);

      const sortData: boolean = false;

      this.y = scaleBand()
        .domain(
          originalGraphDataSortedIndexes
            .map(
            (sortedIndex, originaIndex): string => `${this.graphDataMerged.labels[sortData ? sortedIndex : originaIndex].split('.').slice(-1)[0]}`,
          ),
        )
        .range([0, this.height])
        .padding(0.2);

      this.drawAxis();
      this.drawGrid();
      this.drawBars();
    }
  }

  hasData(): Error | boolean {
    return this.graphDataMerged.hasData(this.graphDataMerged);
  }

  reSetRoot(): void {
    if (this.root) {
      this.root.remove();
    }

    this.root = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.graphDataMerged.barChart.margin.left}, ${
        this.graphDataMerged.barChart.margin.top
        })`,
      );
  }

  initSlots() {
    this.tooltipEl = initTooltipIfExists(this.horizontalBarChartEl);
  }

  drawAxis(): void {
    if (this.graphDataMerged.barChart.axis.x.visible) {
      this.root
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${this.height})`)
        .call(
          axisBottom(this.x).tickFormat(domainValue =>
            formatter(
              this.graphDataMerged.barChart.axis.x.format,
              domainValue,
            ),
          ),
        );
    }

    if (this.graphDataMerged.barChart.axis.y.visible) {
      this.root
        .append('g')
        .attr('class', 'y axis')
        .call(axisLeft(this.y));
    }
  }

  drawGrid(): void {
    if (this.graphDataMerged.barChart.axis.x.gridVisible) {
      this.root
        .append('g')
        .attr('class', 'grid')
        .call(
          axisBottom(this.x)
            .tickSize(this.height)
            .tickFormat(() => ''),
        );
    }

    if (this.graphDataMerged.barChart.axis.y.gridVisible) {
      this.root
        .append('g')
        .attr('class', 'grid')
        .call(
          axisLeft(this.y)
            .tickSize(-this.width)
            .tickFormat(() => ''),
        );
    }
  }

  drawBars(): void {
    this.root
      .append('g')
      .attr('class', 'bar-group')
      .selectAll('.bar')
      .data(this.graphDataMerged.data)
      .enter()
      .filter(data => this.x(data) > 0)
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', this.y.bandwidth())
      .attr('y', (_, index) => this.y(`${this.graphDataMerged.labels[index].split('.').slice(-1)[0]}`))
      .attr('width', data => this.x(data))
      .attr('fill', (_, index) =>
        circularFind(this.graphDataMerged.colors, index),
      )
      .on('mousemove', (_, index) =>
        this.eventsTooltip({ index, isToShow: true }),
      )
      .on('mouseout', () => this.eventsTooltip({ isToShow: false }));
  }

  eventsTooltip({
    index,
    isToShow,
  }: {
    index?: number;
    isToShow: boolean;
  }): void {
    const toShow = () => {
      this.tooltipEl.show(
        index,
        this.hoodData[index],
        [event.pageX, event.pageY],
      );
    };

    const toHide = () => this.tooltipEl.hide();

    if (this.tooltipEl) {
      isToShow ? toShow() : toHide();
    }
  }

  render() {
    return (
      <div class="o-layout">
        <div class="o-layout--chart">
          <svg style={this.graphDataMerged ? this.graphDataMerged.styles : ''} />
        </div>
        <div class="o-layout--slot">
          <slot name="tooltip" />
        </div>
      </div>
    );
  }
}
