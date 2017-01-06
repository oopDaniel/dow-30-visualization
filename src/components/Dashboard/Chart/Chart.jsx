/* eslint-disable*/
import React, { PropTypes, Component } from 'react';
import Faux from 'react-faux-dom'

import styles from './Chart.css';
import * as d3 from 'd3';

const d3Params = {
  // 30% padding
  paddingLeft: .3,
  paddingTop: .1,
  paddingBottom: .1,
  contentWidth: 800,
  contentHeight: 600,
  maxWidth: 1000,
  animateRuration: 1000,
};


let createHook = (comp, elem, statename) => {
  let elems = new Map(),
    interval
  const updateState = ()=> {
    comp.setState({[statename]:elem.toReact()})
    comp.forceUpdate()
  }
console.error('here')

  setTimeout(updateState)
  comp.isAnimating = () => !!interval;

  return (transition) => {
    transition.each((e)=>{
      elems.set(e,(elems.get(e) || new Set()).add(transition.id))
      interval = interval || setInterval(updateState, 32)
    })
    transition.each("end",(e)=>{
      let anims = elems.get(e)
      anims.delete(transition.id)
      if (anims.size){
        elems.set(e,anims)
      } else {
        elems.delete(e)
      }
      if (!elems.size) interval = clearInterval(interval)
    })
  }
}


const propTypes = {
  stocks: PropTypes.shape({
    allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    byName: PropTypes.object.isRequired,
  }).isRequired,
};


class Chart extends Component {
  static test() {
    console.log('test')
  }
  constructor() {
    super();

    this.setRange          = this.setRange.bind(this);
    this.setDomain         = this.setDomain.bind(this);
    this.extractData       = this.extractData.bind(this);
    this.getLatestStock    = this.getLatestStock.bind(this);
    this.renderChart       = this.renderChart.bind(this);


    this.scale             = null;
    this.canvas            = null;
    this.currentStockNames = [];
    this.data              = [];

    this.state = {
      chart            : <span />,
      dom              : null,
      scale            : null,
      canvas           : null,
      currentStockNames: [],
      data             : [],
    };
  }

  setRange({ width, height }) {
    this.scale = {
      x: d3.scale.linear().range([
          width * d3Params.paddingLeft,
          width * (1 - 2 * d3Params.paddingLeft),
        ]),
      y: d3.scale.linear().range([
          height * (1 - d3Params.paddingTop - d3Params.paddingBottom),
          height * (d3Params.paddingTop + d3Params.paddingBottom),
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
    // this.scale.x = d3.scale.linear().domain([ 0, data.length + 1 ]);
    this.scale.x.domain([ 0, data.length + 1 ]);
    this.scale.y.domain(d3.extent(data, d => d.value));
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
    const g = this.canvas.append('g')
      .attr({
        'transform': translate,
        'class':     'bars'
      });

    // console.error(d3.select(this.refs.chart));

    // const update = g.selectAll('rect')
    //   .data(this.data);
    // const enter  = update.enter();
    // const exit   = update.exit();

    // enter.append('rect')
    //   .attr('class', 'bar theme2');

    // const attr = {
    //   'x':      (d, i) => this.scale.x(i),
    //   'y':      d => this.scale.y(d.value),
    //   'width':  10,
    //   'height': d => (200 + d3Params.paddindTop) - this.scale.y(d.value) - d3Params.paddingBottom
    // }
    // update.attr(attr);
  }


  shouldComponentUpdate() {
    return false;
  }


  componentDidMount() {

    const faux = new Faux.Element('div')
    faux.setAttribute('class', styles.inner_container);
    const hook = createHook(this, faux, 'chart')


    // Set range according to the visible area of client
    const { clientWidth: width, clientHeight: height }
      = this.refs.container;
    this.setRange({ width, height });

    // Set domain
    this.extractData(this.props);
    this.setDomain(this.data);

    // this.canvas =
    const svg = d3.select(faux).append('svg')
      .attr('width', '80%')
      .attr('height', height)
      .append('g')
      .attr({
          'transform': 'translate(0, 0)',
      });

    const update = svg.selectAll('rect')
                    .data(this.data);
    const enter  = update.enter();
    const exit   = update.exit();

    const rect = enter.append('rect')
      .attr('class', 'bar theme2')
      .attr('x', (d, i) => this.scale.x(i + 1))
      .attr('y', height - d3Params.paddingBottom * height)
      .attr('fill', 'steelblue')
      .attr('width', 20)
      .attr('height', 0);

    rect.transition()
        .delay((d, i) => i * 800)
        .attr('y', d => this.scale.y(d.value) - d3Params.paddingBottom * height)
        .attr('height', d => height - this.scale.y(d.value))
        .duration(d3Params.animateRuration)
        .call(hook)

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
//     // var el = Faux.createElement('div')

//     // // Change stuff using actual DOM functions.
//     // // Even perform CSS selections!
//     // el.style.setProperty('background', 'red')
//     // el.style.setProperty('width', '200')
//     // el.setAttribute('class', 'box')

//     // console.warn(el.toReact());

//     // Render it to React elements.
//     // return this.state.dom;
//     return (
//       <div
//         className={styles.container}
//         ref="container"
//       >

//       { el.toReact() }
//       { this.state.dom }

//    { /*
//     <button onClick={()=>this.yo()}>ASD</button>
//     <svg ref="chart" width="80%" height="400">
//         <g></g>
//       </svg>
//         <svg className={styles.svg_container}>
//           <circle r="10" cx="10" cy="10" fill="#ff8282" />
//           <circle r="10" cx="50" cy="10" fill="#e0e0e4" />
//           <circle r="10" cx="15" cy="50" fill="#1FC2F9" />
//           <circle r="20" cx="64" cy="50" fill="#52bd7e" />
//         </svg>
// */ }
//       </div>
//     );
//   }

}


Chart.propTypes = propTypes;

export default Chart;
