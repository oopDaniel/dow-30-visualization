/* eslint-disable*/
import React, { PropTypes, Component } from 'react';
import Faux from 'react-faux-dom'
import * as d3 from 'd3';

import numFilter from './../../../helpers/number-filter';
import createHook from './../../../helpers/d3-transition';
import styles from './Chart.css';

const d3Params = {
  // 30% padding
  paddingLeft: .2,
  paddingTop: .1,
  paddingBottom: .1,
  // maxWidth: 1000,
  enterDuration: 1000,
  updateDuration: 800,
  delay: 800,

  barWidth: 20,
};


class Chart extends Component {
  static propTypes = {
    stocks: PropTypes.shape({
      allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
      byName: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.setRange       = this.setRange.bind(this);
    this.setDomain      = this.setDomain.bind(this);
    this.extractData    = this.extractData.bind(this);
    this.getLatestStock = this.getLatestStock.bind(this);
    this.getThemeColor  = this.getThemeColor.bind(this);
    this.renderChart    = this.renderChart.bind(this);
    // this.renderText     = this.renderText.bind(this);
    this.renderAxis     = this.renderAxis.bind(this);

    const scale = {
      x:      d3.scale.linear(),
      y:      d3.scale.linear(),
      max:    0,
      min:    Number.MAX_SAFE_INTEGER,
    };

    this.state = {
      chart:  <span />,
      canvas: null,
      hook:   null,
      xAxis:  d3.svg.axis().orient('bottom'),
      data:   [],
      height: 0,
      width:  0,
      scale,
    };

  }

  setRange({ width, height }) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Incorrect input type');
    }

    this.state.scale.x.range([
      width * d3Params.paddingLeft,
      width * (1 - 2 * d3Params.paddingLeft),
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
    this.state.scale.x.domain([ 0, data.length + 1 ])
      .nice();

    // Y-domain
    if (data.length > 0) {
      // Preserve max and min value
      this.state.scale.max = Math.max(
        ...d3.extent(data, d => Math.max(d.value, d.prevValue)),
        this.state.scale.max,
      );
      // this.state.scale.min = Math.min(
      //   ...d3.extent(data, d => Math.min(d.value, d.prevValue)),
      //   this.state.scale.min,
      // );
      this.state.scale.y.domain([0, this.state.scale.max])
      // this.state.scale.y.domain([this.state.scale.min, this.state.scale.max])
        .nice();
    }
  }

  // <renderTarget> subjects to change if UI interaction was allowed later
  extractData({ stocks, renderTarget = 'Open' } = {}) {
    const stockNames = stocks.byName;
    const data       = [];

    Object.keys(stockNames)
      .forEach((name) => {
        const record = {
          name,
          ...this.getLatestStock(stockNames[name], renderTarget),
        }
        data.push(record);
      });

    this.state = {
      ...this.state,
      data,
    };
  }

  getLatestStock(stock, target) {
    const value     = stock.data[stock.latest[1]][target];
    const prevValue = stock.data[stock.latest[0]][target];
    const trend     = value === prevValue
      ? 0
      : value > prevValue
        ? 1
        : -1;
    return { value, prevValue, trend };
  }

  getThemeColor(data) {
    return data.trend === 0
      ? styles.theme_unchanged
      : data.trend > 0
        ? styles.theme_up : styles.theme_down;
  }

  renderChart() {
    const { width, height } = this.state;
    const update = this.state.canvas
      .selectAll('rect')
      .data(this.state.data, d => d.name);
    const enter  = update.enter();
    const exit   = update.exit();

    this.renderAxis();

    const tooltip = d3.select('#chart-container').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    exit
      .transition()
      .attr('y', height - d3Params.paddingBottom * height)
      .attr('height', 0)
      .attr('opacity', .6)
      .duration(d3Params.updateDuration)
      .remove()
      .call(this.state.hook)

    update
      .transition()
      .attr('y', d => this.state.scale.y(d.prevValue) - d3Params.paddingBottom * height)
      .attr('height', d => height - this.state.scale.y(d.prevValue))
      .attr('x', (d, i) => this.state.scale.x(i + 1) - d3Params.barWidth / 2)
      .duration(d3Params.updateDuration)
      .call(this.state.hook)

    enter.append('rect')
      .attr('class', this.getThemeColor)
      .attr('x', (d, i) => this.state.scale.x(i + 1) - d3Params.barWidth / 2)
      .attr('y', d => height - d3Params.paddingBottom * height)
      .attr('width', d3Params.barWidth)
      .attr('height', 0)
      .on('mouseover', (d, i) => {
        const rects   = d3.selectAll('rect')[0];
        const pos     = rects[i].getClientRects()[0];
        const leftPos = pos.left - d3Params.barWidth;
        const topPos  = pos.top - height * d3Params.paddingBottom / 2;
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`
          <div class="inner-toolip">
          ${d.name}
          <br/>
          <span class=${this.getThemeColor(d)}><b>${numFilter(d.value)}</b></span>
          <br/>
          (${numFilter(d.prevValue)})
          </div>
        `)
          .style('left', `${leftPos}px`)
          .style('top', `${topPos}px`);
        })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(400)
          .style('opacity', 0);
        })

    .transition()
      .delay((d, i) => i * d3Params.delay)
      .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height)
      .attr('height', d => height - this.state.scale.y(d.value))
      .duration(d3Params.enterDuration)
      .call(this.state.hook);

  }

  // renderText() {
  //   const { height } = this.state;
  //   let text = this.state.canvas.selectAll('text')
  //       .data(this.state.data, d => d.name);

  //   text.exit()
  //     .remove();

  //   text.enter().append('text')
  //     .attr('x', (d, i) => this.state.scale.x(i + 1) - d3Params.barWidth * .7 )
  //     .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height - 10)
  //     // .text(d => '');

  //   text.transition()
  //     .delay((d, i) => i * d3Params.delay)
  //     .attr('x', (d, i) => this.state.scale.x(i + 1) - d3Params.barWidth * .7 )
  //     .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height - 10)
  //     .text(d => d.value);
  // }

  renderAxis(target = d3.select('.x-axis')) {
    const { height } = this.state;
    const tickValues = Array.from(
      new Array(this.state.data.length),
      (v, i) => i + 1,
    );

    this.state.xAxis
      .tickValues(tickValues)
      .tickFormat((d, i) => this.state.data[i].name)
      .scale(this.state.scale.x)

    target
      .transition()
      .duration(d3Params.updateDuration)
      .call(this.state.xAxis);
  }


  componentWillReceiveProps(props) {
    const hasDataChanged =
      this.state.data.length !== props.stocks.allNames.length;

    if (hasDataChanged) {
      this.extractData(props);
      this.setDomain(this.state.data);

      this.renderChart();
      // this.renderText();
    }


  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height }
      = this.refs.container;

    const faux = new Faux.Element('div')
    faux.setAttribute('class', styles.inner_container)
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

    this.renderChart();
    // this.renderText();

    const axis = this.state.canvas
      .append('g')
      .attr({
        'class': `x-axis`,
        'transform': `translate(0, ${height * (1 - d3Params.paddingBottom * .9)})`,
      })

    this.renderAxis(axis);
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

export default Chart;
