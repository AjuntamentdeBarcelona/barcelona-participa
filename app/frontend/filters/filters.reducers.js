import { 
  SET_FILTER_TEXT, 
  SET_FILTER_GROUP, 
  TOGGLE_TAG, 
  CLEAR_FILTERS 
} from './filters.actions';

export default function (state = getInitialFiltersState(), action) {
  var idx;

  switch(action.type) {
    case SET_FILTER_TEXT:
      return {
        ...state,
        text: action.text
      };
    case SET_FILTER_GROUP:
      let filter = state.filter;

      filter[action.name] = action.value;

      if (action.name === 'category_id') {
        filter["subcategory_id"] = []
      }
      
      if (!filter["scope"]) {
        filter["scope"] = [];
      }

      idx = filter["scope"].indexOf("district");

      if (filter["district"] && filter["district"].length > 0) {
        if (idx === -1) {
          filter["scope"] = [...filter["scope"], "district"];
        }
      } else if (idx >= 0) {
        filter["scope"].splice(idx, 1);
      }

      return {
        ...state,
        filter
      };
    case TOGGLE_TAG:
      let tags;

      idx = state.tags.indexOf(action.tag);

      if (idx === -1) {
        tags = [...state.tags, action.tag];
      } else {
        tags = [
          ...state.tags.slice(0, idx),
          ...state.tags.slice(idx + 1)
        ];
      }

      return {
        ...state,
        tags 
      };
    case CLEAR_FILTERS:
      return {
        filter: {},
        text: "",
        tags: []
      };
  }
  return state;
}

function getInitialFiltersState() {
  let filters = {
        filter: {},
        text: "",
        tags: []
      },
      matchData;

  matchData = location.search.match(/filter=([^&]*)/);

  if (matchData) {
    let filterData = decodeURIComponent(matchData[1]).split(":");

    filterData.map(function (data) {
      let [name, values] = data.split("=");

      values = values.split(",");

      if (name !== "scope" && name !== "other" && name !== "source" && name !== 'reviewer_status') {
        values = values.map((x) => parseInt(x, 10));
      }

      filters.filter[name] = values;
    });
  }

  matchData = location.search.match(/search=([^&]*)/)

  if (matchData) {
    filters.text = decodeURIComponent(matchData[1]);
  }

  matchData = location.search.match(/tag=([^&]*)/)

  if (matchData) {
    filters.tags = decodeURIComponent(matchData[1]).split(',').map(decodeURI);
  }

  return filters;
}
