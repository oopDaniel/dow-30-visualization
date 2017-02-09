/*eslint-disable*/
import React, { PropTypes, Component } from 'react';
import Faux from 'react-faux-dom';
import * as d3 from 'd3';

import numFilter from './../../../helpers/number-filter';
import createHook from './../../../helpers/d3-transition';
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
  };

  constructor(props) {
    super(props);

    this.setRange       = this.setRange.bind(this);
    this.setDomain      = this.setDomain.bind(this);
    this.extractData    = this.extractData.bind(this);
    this.renderChart    = this.renderChart.bind(this);
    this.renderAxis     = this.renderAxis.bind(this);

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
    console.error(stocks);
    const stockNames = stocks.byName;
    let data = [];

    Object.keys(stockNames)
      .forEach((name) => {
        const stockDataset = Object.keys(stockNames[name].data)
          .map((time) => ({
              name,
              time,
              value: stockNames[name].data[time][renderTarget]
          }));
        data = [...data, ...stockDataset];
      });

    this.state = {
      ...this.state,
      data,
    };
  }


  getThemeColor(data) {
    const isUpTrend = data.trend > 0 ? styles.theme_up : styles.theme_down;
    return data.trend === 0
      ? styles.theme_unchanged
      : isUpTrend;
  }

  renderChart() {
    // debugger
    // const { height } = this.state;
    // const update = this.state.canvas
    //   .selectAll('rect')
    //   .data(this.state.data, d => d.name);
    // const enter  = update.enter();
    // const exit   = update.exit();

    const line = d3.svg.line()
      .x(d => this.state.scale.x(d.time) )
      .y(d => this.state.scale.y(d.value) );

    const dataNest = d3.nest()
      .key(d => d.name)
      .entries(this.state.data);

    this.state.canvas.selectAll('.line').remove();

    dataNest.forEach((lineData) => {
      // console.info(lineData);

      // const update = this.state.canvas
      //   .selectAll('path')
      //   .data(lineData.values);
      // const enter  = update.enter();
      // const exit   = update.exit();

      // exit.remove();

      // update
      //   .append('path')
      //   .attr('class', 'line')
      //   .attr('d', line(lineData.values));

      this.state.canvas
        .append('path')
        .attr('class', 'line')
        .attr('d', line(lineData.values))
        .transition()
        .call(this.state.hook);
    })
    // const tooltip = d3.select('#chart-container').append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0);




    // exit
    //   .transition()
    //   .attr('y', height - (d3Params.paddingBottom * height))
    //   .attr('height', 0)
    //   .attr('opacity', 0.6)
    //   .remove();

    // update
    //   .transition()
    //   .attr('y', d => this.state.scale.y(d.prevValue) - (d3Params.paddingBottom * height))
    //   .attr('height', d => height - this.state.scale.y(d.prevValue))
    //   .attr('x', (d, i) => this.state.scale.x(i + 1) - (d3Params.barWidth / 2))
    //   .duration(d3Params.updateDuration)
    //   .call(this.state.hook);

    // enter.append('rect')
    //   .attr('class', this.getThemeColor)
    //   .attr('name', d => d.name)  // For getting correct index of rect in tooltips
    //   .attr('x', (d, i) => this.state.scale.x(i + 1) - (d3Params.barWidth / 2))
    //   .attr('y', () => height - (d3Params.paddingBottom * height))
    //   .attr('width', d3Params.barWidth)
    //   .attr('height', 0)
      // .on('mouseover', (d) => {
      //   const rects   = d3.selectAll('rect')[0];
      //   const index   = rects.findIndex(rect => rect.attributes.name.value === d.name);
      //   const pos     = rects[index] && rects[index].getClientRects()[0];
      //   const leftPos = (pos && pos.left) - d3Params.barWidth - 2 || 0;
      //   const topPos  = (pos && pos.top) - (height * (d3Params.paddingBottom / 2)) || 0;
      //   tooltip.transition()
      //     .duration(200)
      //     .style('opacity', 0.9);
      //   tooltip.html(`
      //     <div class="inner-toolip">
      //     ${d.name}
      //     <br/>
      //     <span class=${this.getThemeColor(d)}><b>${numFilter(d.value)}</b></span>
      //     <br/>
      //     (${numFilter(d.prevValue)})
      //     </div>
      //   `)
      //     .style('left', `${leftPos}px`)
      //     .style('top', `${topPos}px`);
      // })
      // .on('mouseout', () => {
      //   tooltip.transition()
      //     .duration(400)
      //     .style('opacity', 0);
      // })

    // .transition()
    //   .delay((d, i) => i * d3Params.delay)
    //   .attr('y', d => this.state.scale.y(d.value) - d3Params.paddingBottom * height)
    //   .attr('height', d => height - this.state.scale.y(d.value))
    //   .duration(d3Params.enterDuration)
    //   .call(this.state.hook);

    setTimeout(() => this.renderAxis());
  }

  renderAxis(target = d3.select('.x-axis')) {
    this.state.xAxis
      .ticks(5)
      .tickFormat( d => d3.time.format('%m/%d')(new Date(d)))
      .scale(this.state.scale.x);

    target
      .transition()
      .duration(d3Params.updateDuration)
      .call(this.state.xAxis);
  }

  componentWillReceiveProps(props) {
    console.log("%creceive", 'color:red;font-size:3rem');
    console.log(props);
    this.extractData(props);
    this.setDomain(this.state.data);

    console.info(this.state.data);
    // debugger

    this.renderChart();
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
