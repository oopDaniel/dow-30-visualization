/* eslint-disable*/
import React, { PropTypes, Component } from 'react';
import Faux from 'react-faux-dom'
import * as d3 from 'd3';

import createHook from './../../../helpers/d3-transition';
import styles from './Chart.css';

const d3Params = {
  // 30% padding
  paddingLeft: .3,
  paddingTop: .1,
  paddingBottom: .1,
  maxWidth: 1000,
  enterDuration: 1000,
  updateDuration: 800,

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
    this.renderChart    = this.renderChart.bind(this);
    this.renderText     = this.renderText.bind(this);

    const scale = {
      x:    d3.scale.linear(),
      y:    d3.scale.linear(),
      max:  0,
      min:  Number.MAX_SAFE_INTEGER,
    };

    this.state = {
      chart:  <span />,
      canvas: null,
      hook:   null,
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

    this.state.scale.y.range([
      height * (1 - d3Params.paddingTop - d3Params.paddingBottom),
      height * (d3Params.paddingTop + d3Params.paddingBottom),
    ]);
  }

  setDomain(data) {
    if (!Array.isArray(data)) {
      throw new Error('Incorrect input type');
    }

    // Extend both min and max in x-axis to render a better UI
    this.state.scale.x.domain([ 0, data.length + 1 ])
      .nice();

    // Preserve max and min value
    this.state.scale.max = Math.max(
      ...d3.extent(data, d => d.value),
      this.state.scale.max,
    );
    this.state.scale.min = Math.min(
      ...d3.extent(data, d => d.value),
      this.state.scale.min,
    );
    this.state.scale.y.domain([this.state.scale.min, this.state.scale.max])
      .nice();
  }

  // <renderTarget> subjects to change if UI interaction was allowed later
  extractData({ stocks, renderTarget = 'Open' } = {}) {
    const stockNames = stocks.byName;
    const data       = [];

    Object.keys(stockNames)
      .forEach((name) => {
        const value = this.getLatestStock(stockNames[name])[renderTarget];
        data.push({ name, value });
      });

    this.state = {
      ...this.state,
      data,
    };
  }

  // TODO: Implement this with the last period later
  getLatestStock(stock) {
    // stock.latest.forEach((time) => {
    // });
    return stock.data[stock.latest[0]];
  }

  renderChart() {
    const { width, height } = this.state;
    const update = this.state.canvas
      .selectAll('rect')
      .data(this.state.data, d => d.name);
    const enter  = update.enter();
    const exit   = update.exit();

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
      .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height)
      .attr('height', d => height - this.state.scale.y(d.value))
      .attr('x', (d, i) => this.state.scale.x(i + 1))
      .duration(d3Params.updateDuration)
      .call(this.state.hook)

    enter.append('rect')
      .attr('class', 'bar theme2')
      .attr('x', (d, i) => this.state.scale.x(i + 1))
      .attr('y', height - d3Params.paddingBottom * height)
      .attr('fill', 'steelblue')
      .attr('width', d3Params.barWidth)
      .attr('height', 0)

    .transition()
      .delay((d, i) => i * 800)
      .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height)
      .attr('height', d => height - this.state.scale.y(d.value))
      .duration(d3Params.enterDuration)
      .call(this.state.hook);
  }

  renderText() {
    const { height } = this.state;
    let text = this.state.canvas.selectAll('text')
        .data(this.state.data, d => d.name);

    text.exit()
      .remove();

    text.enter().append('text')
      .attr('x', (d, i) => this.state.scale.x(i + 1))
      .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height - 10)
      .text(d => d.name);

    text.transition()
      .attr('x', (d, i) => this.state.scale.x(i + 1));
  }


  componentWillReceiveProps(p) {
    this.extractData(p);
    this.setDomain(this.state.data);

    this.renderChart();
    this.renderText();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height }
      = this.refs.container;

    const faux = new Faux.Element('div')
    faux.setAttribute('class', styles.inner_container);

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
      .attr('width', '80%')
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 0)');

    this.renderChart();
    this.renderText();
  }

  render() {
    return (
      <div
        ref="container"
        className={styles.container}
      >
        {this.state.chart}
      </div>
    );
  }
}

export default Chart;
