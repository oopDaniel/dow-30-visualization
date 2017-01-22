/* eslint-disable no-shadow */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import styles from './Search.css';
import {
  openSearchbar,
  closeSearchbar,
  searchFor,
  addFocus,
  removeFocus,
} from './../../actions/index';
import SearchSugestion from './SearchSugestion';
import Tags from './Tags/Tags';
import Period from './Period/Period';


const propTypes = {
  focus: PropTypes.arrayOf(PropTypes.string).isRequired,
  search: PropTypes.object.isRequired,
  period: PropTypes.number.isRequired,
  openSearchbar: PropTypes.func.isRequired,
  closeSearchbar: PropTypes.func.isRequired,
  searchFor: PropTypes.func.isRequired,
  addFocus: PropTypes.func.isRequired,
  removeFocus: PropTypes.func.isRequired,
};


class Search extends Component {
  constructor() {
    super();
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    const { value } = e.target;
    const { searchFor } = this.props;
    searchFor(value);
    e.preventDefault();
  }

  render() {
    const {
      openSearchbar,
      closeSearchbar,
      addFocus,
      removeFocus,
      search,
      focus,
      period,
    } = this.props;
    const { word, isSearching, options } = search;

    return (
      <div className={styles.container}>
        <div className={styles.searchbar_container}>
          <div className={styles.searchbar_row}>
            <input
              value={word}
              type="text"
              className={styles.searchbar}
              onClick={openSearchbar}
              onBlur={closeSearchbar}
              onChange={this.handleSearch}
              placeholder="Select your stock"
            />
            <Period
              period={period}
            />
          </div>
          <SearchSugestion
            isSearching={isSearching}
            options={options}
            clickHandler={addFocus}
          />
        </div>
        <Tags
          focus={focus}
          closeHandler={removeFocus}
        />

      </div>
    );
  }

}


Search.propTypes = propTypes;


const mapStateToProps = state => ({
  focus: state.focus,
  search: state.search,
  period: state.period,
});

const connectedSearch = connect(mapStateToProps, {
  openSearchbar,
  closeSearchbar,
  searchFor,
  addFocus,
  removeFocus,
})(Search);

export default connectedSearch;
