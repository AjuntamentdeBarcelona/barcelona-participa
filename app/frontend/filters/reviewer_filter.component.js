import { Component }          from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';

import FilterOptionGroup      from './filter_option_group.component';
import FilterOption           from './filter_option.component';

import { setFilterGroup }     from './filters.actions';

class ReviewerFilter extends Component {
  render() {
    if (this.props.session.is_reviewer) {
      return (
        <FilterOptionGroup 
          isExclusive={true}
          filterGroupName="reviewer_status" 
          filterGroupValue={this.props.filters.filter["reviewer_status"]}
          onChangeFilterGroup={(name, value) => this.props.setFilterGroup(name, value) }>
          <FilterOption filterName="reviewed" />
          <FilterOption filterName="not_reviewed" />
        </FilterOptionGroup>
      );
    }
    return null;
  }
}

function mapStateToProps({ filters, session }) {
  return { filters, session };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setFilterGroup }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewerFilter);
