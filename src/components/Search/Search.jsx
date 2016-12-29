/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Search.css';
import {
  openSearchbar,
  closeSearchbar,
  searchFor,
  addFocus,
} from './../../actions/index'
import SearchSugestion from './SearchSugestion';


class Search extends Component {
  constructor() {
    super()
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    const { value } = e.target;
    const { searchFor } = this.props;
    searchFor(value);
    e.preventDefault();
  }

  render() {
    const { openSearchbar, closeSearchbar, search, addFocus } = this.props;
    const { word, isSearching, options } = search;

    return (
      <div className={styles.container}>
        <input
          value={word}
          type="text"
          className={styles.searchbar}
          onClick={openSearchbar.bind(null)}
          onBlur={closeSearchbar.bind(null)}
          onChange={this.handleSearch}
          placeholder="this is a search bar" />

        <SearchSugestion
          isSearching={isSearching}
          options={options}
          clickHandler={addFocus}
        />

      </div>
    );
  }

}

Search.propTypes = {
};
/* eslint-enable */


const mapStateToProps = state => ({
  search: state.search,
});

const connectedSearch = connect(mapStateToProps, {
  openSearchbar,
  closeSearchbar,
  searchFor,
  addFocus,
})(Search);
export default connectedSearch;
