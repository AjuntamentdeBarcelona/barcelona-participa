import { Component, PropTypes } from 'react';

export default class FilterOption extends Component {
  render() {
    let elemId = `filter_${this.props.filterGroupName}_${this.props.filterName}`;

    return this.renderOptionAs(this.props.renderAs || 'options', elemId);
  }

  renderOptionAs(renderAs, elemId) {
    switch(renderAs) {
      case 'options':
        return this.renderOptionAsOptions(elemId);
      case 'tabs':
        return this.renderOptionAsTabs(elemId);
    }
  }

  renderOptionAsOptions(elemId) {
    return (
      <div>
        <label>
          <input
            id={elemId}
            type={this.props.isExclusive ? "radio" : "checkbox"}
            value="{this.props.filterValue || this.props.filterName}" 
            checked={this.props.checked}
            onChange={(event) => this.props.onChangeFilter(this.props.filterName, event.target.checked)}
          />
          {this.props.filterLabel || I18n.t(`components.filter_option.${this.props.filterName}`)}
        </label>
        {this.props.children}
      </div>
    );
  }

  renderOptionAsTabs(elemId) {
    return (
      <li id={elemId}>
        <a className={this.props.checked ? 'active' : ''} onClick={() => this.props.onChangeFilter(this.props.filterName, true)}>
          {this.props.filterLabel || I18n.t(`components.filter_option.${this.props.filterName}`)}
        </a>
      </li>
    );
  }
}

FilterOption.propTypes = {
  filterGroupName: PropTypes.string,
  filterName: PropTypes.any.isRequired,
  renderAs: PropTypes.string,
  isExclusive: PropTypes.bool,
  checked: PropTypes.bool,
  onChangeFilter: PropTypes.func,
  children: PropTypes.element,
  filterLabel: PropTypes.string
};
