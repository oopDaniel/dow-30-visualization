/* eslint-disable*/
import React, { PropTypes, Component } from 'react';
import styles from './Chart.css';
import * as d3 from 'd3';

const d3Params = {
  paddingLeft: 20,
  paddingTop: 20,
  paddingBottom: 20,
  contentWidth: 800,
  contentHeight: 600,
  maxWidth: 1000,
};

const propTypes = {
  stocks: PropTypes.shape({
    allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    byName: PropTypes.object.isRequired,
  }).isRequired,
};


class Chart extends Component {
  constructor() {
    super();

    this.w = 0;

    this.setRange          = this.setRange.bind(this);
    this.setDomain         = this.setDomain.bind(this);
    this.extractData       = this.extractData.bind(this);
    this.getLatestStock    = this.getLatestStock.bind(this);
    this.renderChart       = this.renderChart.bind(this);

    this.scale             = null;
    this.canvas            = null;
    this.currentStockNames = [];
    this.data              = [];
  }

  setRange({ width, height }) {
    this.scale = {
      x: d3.scaleLinear().range([
          d3Params.paddingLeft,
          width + d3Params.paddingLeft
        ]),
      y: d3.scaleLinear().range([
          d3Params.paddingTop,
          height + d3Params.paddingTop
        ]),
    };
  }

  setDomain(data) {
    if (!Array.isArray(data)) {
      throw new Error('Incorrect input type');
    }
    if (!this.scale) {
      throw new Error('Must init range before setting domain');
    }

    // Extend both min and max in x-axis to render a better UI
    this.scale.x = d3.scaleLinear().domain([ 0, data.length + 1 ]);
    this.scale.y = d3.scaleLinear().domain(d3.extent(data, d => d.value));
  }

  // <renderTarget> subjects to change if UI interaction was allowed later
  extractData({ stocks, renderTarget = 'Open' } = {}) {
    const stockNames = stocks.byName;

    Object.keys(stockNames)
      // Only update the new stock
      .filter(name => !this.currentStockNames.includes(name))
      .forEach((name)=> {
        const value = this.getLatestStock(stockNames[name])[renderTarget];
        this.currentStockNames.push(name);
        this.data.push({ name, value });
    });
  }

  // TODO: Implement this with the last period later
  getLatestStock(stock) {
    // stock.latest.forEach((time) => {
    // });
    return stock.data[stock.latest[0]];

  }

  renderChart() {
    const translate = `translate(50, 100)`;
    const g = d3.select(this.refs.chart).append('g')
      .attr({
        'transform': translate,
      });

    console.error(this.canvas, g);

    const update = g.selectAll('rect')
      .data(this.data);
    const enter  = update.enter();
    const exit   = update.exit();

    enter.append('rect')
      .attr('class', 'bar theme2');

    const attr = {
      'x':      (d, i) => this.scale.x(i),
      'y':      d => this.scale.y(d.value),
      'width':  10,
      'height': d => (200 + d3Params.paddindTop) - this.scale.y(d.value) - d3Params.paddingBottom
    }
    update.attr(attr);
  }

  updateChart() {

  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(p) {
    // console.error('yo');
    // console.warn(d3, p);
  }

  componentDidMount() {
    // Set range according to the visible area of client
    const { clientWidth: width, clientHeight: height }
      = this.refs.container;
    this.setRange({ width, height });

    // Set domain
    this.extractData(this.props);
    this.setDomain(this.data);

    this.canvas = d3.select(this.refs.chart);
    this.canvas.attr({
      'class': styles.chart,
      width,
      height,
    });

    // this.renderChart();
  }

  render() {
    this.w = 500;
    return (
      <div
        className={styles.container}
        ref="container"
      >
      <svg ref="chart" width="80%" height="400">
        <g></g>
      </svg>
   { /*
        <svg className={styles.svg_container}>
          <circle r="10" cx="10" cy="10" fill="#ff8282" />
          <circle r="10" cx="50" cy="10" fill="#e0e0e4" />
          <circle r="10" cx="15" cy="50" fill="#1FC2F9" />
          <circle r="20" cx="64" cy="50" fill="#52bd7e" />
        </svg>
*/ }
      </div>
    );
  }

}

Chart.propTypes = propTypes;


export default Chart;
