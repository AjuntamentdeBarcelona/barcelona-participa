import { Component, PropTypes } from 'react';

import FilterLink               from './filter_link.component';
import FilterServerLink         from './filter_server_link.component';

export default class FilterMeta extends Component {
  render() {
    return (
      <ul className="item-meta tags tags--proposal">
        {this.renderMetaScope()}
        {this.renderMetaCategories()}
      </ul>
    );
  }

  renderMetaScope() {
    const { scope, district, useServerLinks, namespace } = this.props;

    if (scope === "city") {
      if (useServerLinks) {
        return (
          <FilterServerLink name="scope" value="city" cssClass="bcn-icon-localitzacio bcn-icon" label={I18n.t("components.filter_option.city")} namespace={namespace} />
        );
      } else {
        return (
          <FilterLink name="scope" value="city" cssClass="bcn-icon-localitzacio bcn-icon" label={I18n.t("components.filter_option.city")} />
        );
      }
    }

    if (useServerLinks && district) {
      return (
        <FilterServerLink name="district" value={district.id} cssClass="bcn-icon-localitzacio bcn-icon" label={district.name} namespace={namespace} />
      );
    } else if (district) {
      return (
        <FilterLink name="district" value={district.id} cssClass="bcn-icon-localitzacio bcn-icon" label={district.name} />
      );
    }

    return null;
  }

  renderMetaCategories() {
    const { category, subcategory, useServerLinks, namespace } = this.props;
    let links = [];

    if (useServerLinks) {
      links = [
        <FilterServerLink key="category_id" name="category_id" value={category.id} label={` ${category.name}`} cssClass={`category-icon category-icon-${category.id}`}  namespace={namespace} />,
        <FilterServerLink key="subcategory_id" name="subcategory_id" value={subcategory.id} label={subcategory.name} namespace={namespace} />
      ];
    } else {
      links = [
        <FilterLink key="category_id" name="category_id" value={category.id} label={` ${category.name}`} cssClass={`category-icon category-icon-${category.id}`} />,
        <FilterLink key="subcategory_id" name="subcategory_id" value={subcategory.id} label={subcategory.name} />
      ];
    }

    return links;
  }
}

FilterMeta.propTypes = {
  scope: PropTypes.string.isRequired,
  district: PropTypes.object,
  category: PropTypes.object,
  subcategory: PropTypes.object,
  useServerLinks: PropTypes.bool,
  namespace: PropTypes.string
};
