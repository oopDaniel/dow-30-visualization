import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import styles from './Period.css';
import periodEnum, { GetPeriodByName } from './../../../consts/periodEnum';


class Period extends Component {
  static propTypes = {
    period: PropTypes.number.isRequired,
    clickHandler: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.renderOption = this.renderOption.bind(this);
    this.state = { isActive: false };
  }

  renderOption(period) {
    const { period: currentPeriod, clickHandler } = this.props;
    const itemStyle = classNames({
      [styles.item]: true,
      [styles.isSelected]: GetPeriodByName[period] === currentPeriod,
    });

    return (
      <div
        key={period}
        className={itemStyle}
        onClick={() => clickHandler(period)}
      >
        {period}
      </div>
    );
  }

  render() {
    const { period }   = this.props;
    const { isActive } = this.state;
    const periods = Object.keys(GetPeriodByName);

    return (
      <button
        className={styles.container}
        onBlur={() => this.setState({ isActive: false })}
        onClick={() => this.setState({ isActive: !isActive })}
      >
        <span className={styles.curr_period}>
          {periodEnum[period]} <span className={styles.triangle}>&#9662;</span>
        </span>
        { isActive ?
          <div className={styles.periods_container}>
            {periods.map(this.renderOption)}
          </div>
          :
          null
        }
      </button>
    );
  }
}


export default Period;
