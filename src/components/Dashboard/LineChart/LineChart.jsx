/*eslint-disable*/
import React, { PropTypes, Component } from 'react';
import Faux from 'react-faux-dom';
import * as d3 from 'd3';

import numFilter from './../../../helpers/number-filter';
import createHook from './../../../helpers/d3-transition';
import { GetTicksByPeriod } from './../../../consts/periodEnum';
import styles from './LineChart.css';

const d3Params = {
  paddingLeft: 0.2,
  paddingTop: 0.1,
  paddingBottom: 0.1,
  enterDuration: 1000,
  updateDuration: 800,
  delay: 800,
  barWidth: 20,
};


class LineChart extends Component {
  static propTypes = {
    stocks: PropTypes.shape({
      allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
      byName: PropTypes.object.isRequired,
    }).isRequired,
    period: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.setRange       = this.setRange.bind(this);
    this.setDomain      = this.setDomain.bind(this);
    this.extractData    = this.extractData.bind(this);
    this.renderChart    = this.renderChart.bind(this);
    this.renderAxis     = this.renderAxis.bind(this);
    this.renderText     = this.renderText.bind(this);
    this.renderDots     = this.renderDots.bind(this);

    const scale = {
      x:   d3.scale.linear(),
      y:   d3.scale.linear(),
      max: 0,
      min: Number.MAX_SAFE_INTEGER,
    };

    this.state = {
      chart:  <span />,
      canvas: null,
      hook:   null,
      xAxis:  d3.svg.axis().orient('bottom'),
      data:   [],
      height: 0,
      width:  0,
      color:  d3.scale.category10(),
      scale,
    };
  }

  setRange({ width, height }) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Incorrect input type');
    }

    this.state.scale.x.range([
      width * d3Params.paddingLeft,
      width * (1 - (2 * d3Params.paddingLeft)),
    ]);

    // Using 'Scalar' in line with the y-axis default behavior in browser
    // Invert the max and min
    this.state.scale.y.range([
      height * (1 - d3Params.paddingTop - d3Params.paddingBottom),
      height * (d3Params.paddingTop + d3Params.paddingBottom),
    ]);
  }

  setDomain(data) {
    if (!Array.isArray(data)) {
      throw new Error('Incorrect input type');
    }

    // X-domain
    // Extend both min and max in x-axis to render a better UI
    this.state.scale.x.domain(d3.extent(data, d => d.time))
    // const xDomain = d3.extent(data, d => d.time);
    // if (xDomain[0]) xDomain[0] -= 86400000;
    // if (xDomain[1]) xDomain[1] += 86400000;
    // this.state.scale.x.domain(xDomain)
      .nice();

    // Y-domain
    // Preserve max and min value
    this.state.scale.max = Math.max(
      ...d3.extent(data, d => d.value),
      this.state.scale.max,
    );
    this.state.scale.y.domain(d3.extent(data, d => d.value))
      .nice();
  }

  // <renderTarget> subjects to change if UI interaction was allowed later
  extractData({ stocks, renderTarget = 'Open' } = {}) {
    const stockNames = stocks.byName;
    let data = [];

    Object.keys(stockNames)
      .forEach((name) => {
        const period = stockNames[name].period;
        const latest  = period[0];
        const stockDataset = period
          .map((time) => ({
              name,
              time,
              value: stockNames[name].data[time][renderTarget],
              isLast: time === latest,
          }));
        data = [...data, ...stockDataset];
      });

    this.state = {
      ...this.state,
      data,
    };
  }

  renderChart() {
    const line = d3.svg.line()
      .x(d => this.state.scale.x(d.time) )
      .y(d => this.state.scale.y(d.value) );

    const dataNest = d3.nest()
      .key(d => d.name)
      .entries(this.state.data);

    this.state.canvas.selectAll('.line').remove();

    dataNest.forEach((lineData) => {
      this.state.canvas
        .append('path')
        .attr('class', 'line')
        .attr('stroke', this.state.color(lineData.key))
        .attr('d', line(lineData.values))
        .transition()
        .call(this.state.hook);
    });

    setTimeout(() => this.renderAxis());
  }

  renderDots() {
    const { height } = this.state;
    const period = this.props.period;
    const dotSize = period > 4
      ? 0
      : this.props.period === 3
        ? 2
        : this.props.period > 3 ? 1 : 3;

    const tooltip = d3.select('#chart-container').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    const timeFormater = d3.time.format('%m.%d.%y');

    const update = this.state.canvas
      .selectAll('.dot')
      .data(this.state.data);
    const enter = update.enter();
    const exit  = update.exit();

    exit.remove();

    update.transition()
      .attr({
        class: 'dot',
        name: (d, i) => `${d.name}${i}`,
        fill: d => this.state.color(d.name),
        cx: d => this.state.scale.x(d.time),
        cy: d => this.state.scale.y(d.value),
        r: dotSize,
      })

    enter.append('circle')
      .attr({
        class: 'dot',
        name: (d, i) => `${d.name}${i}`,
        fill: d => this.state.color(d.name),
        cx: d => this.state.scale.x(d.time),
        cy: d => this.state.scale.y(d.value),
        r: dotSize,
      })
      .on('mouseover', (d, i) => {
        const dots = d3.selectAll('circle')[0];
        const index = dots.findIndex(dot => dot.attributes.name.value === `${d.name}${i}`);
        const pos   = dots[index] && dots[index].getClientRects()[0];;
        const leftPos = (pos && pos.left) - d3Params.barWidth - 2 || 0;
        const topPos  = (pos && pos.top) - (height * (d3Params.paddingBottom / 2)) || 0;
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`
          <div class="inner-toolip">
          ${timeFormater(new Date(d.time))}
          <br/>
          <span class="toolip-value"><b>${numFilter(d.value)}</b></span>
          </div>
        `)
          .style('left', `${leftPos}px`)
          .style('top', `${topPos}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(400)
          .style('opacity', 0);
      })
  }

  renderText() {
    const update = this.state.canvas
      .selectAll('.text')
      .data(this.state.data.filter(d => d.isLast))

    update.exit().remove();

    update.transition()
      .attr('transform', (d) =>
          `translate(${this.state.scale.x(d.time)}, ${this.state.scale.y(d.value)})`)
      .attr('x', 6)
      .attr('dy', '.35em')
      .text(d => d.name);

    update.enter()
      .append('text')
      .attr('class', 'text')
      .attr('transform', (d) =>
          `translate(${this.state.scale.x(d.time)}, ${this.state.scale.y(d.value)})`)
      .attr('x', 6)
      .attr('dy', '.35em')
      .text(d => d.name);
  }

  renderAxis(target = d3.select('.x-axis')) {
    const ticks = GetTicksByPeriod[this.props.period];
    this.state.xAxis
      .ticks(ticks)
      .tickFormat( d => d3.time.format('%m/%d')(new Date(d)))
      .scale(this.state.scale.x);

    target
      .transition()
      .duration(d3Params.updateDuration)
      .call(this.state.xAxis);
  }

  componentWillReceiveProps(props) {
    this.extractData(props);
    this.setDomain(this.state.data);

    this.renderChart();
    this.renderText();
    this.renderDots();
  }

  shouldComponentUpdate() { return false; }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height }
      = this.refs.container;

    const faux = new Faux.Element('div');
    faux.setAttribute('class', styles.inner_container);
    faux.setAttribute('id', 'as');

    // Keep the width & height for later usage
    this.state = {
      ...this.state,
      hook: createHook(this, faux, 'chart'),
      width,
      height,
    };

    // Set range according to the visible area of client
    this.setRange({ width, height });

    // Set domain
    this.extractData(this.props);
    this.setDomain(this.state.data);

    this.state.canvas = d3.select(faux).append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 0)');

    this.state.canvas
      .append('g')
      .attr({
        class: 'x-axis',
        transform: `translate(0, ${height * (1 - (d3Params.paddingBottom * 0.9))})`,
      });

    this.renderChart();
  }

  render() {
    return (
      <div
        ref="container"
        id="chart-container"
        className={styles.container}
      >
        {this.state.chart}
      </div>
    );
  }

}

export default LineChart;
