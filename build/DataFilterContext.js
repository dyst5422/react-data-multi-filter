"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const create_react_context_1 = require("create-react-context");
const DataFilter_1 = require("./DataFilter");
function createDataFilterContext() {
    const Context = create_react_context_1.default({
        filteredInData: [],
        filteredOutData: [],
        allData: [],
        filters: {},
        activeFilters: {},
        addFilters: () => { },
        removeFilters: () => { },
        filterData: () => ({
            filteredInData: [],
            filteredOutData: [],
            activeFilters: {},
        }),
    });
    function Provider(props) {
        return (React.createElement(DataFilter_1.DataFilter, Object.assign({}, props), filterProps => React.createElement(Context.Provider, { value: filterProps }, props.children)));
    }
    function Consumer(props) {
        return (React.createElement(Context.Consumer, null, filterProps => {
            const { filteredInData, filteredOutData, activeFilters } = filterProps.filterData({
                exclude: props.exclude,
                include: props.include,
            });
            return props.children({
                allData: filterProps.allData,
                filteredInData,
                filteredOutData,
                filters: filterProps.filters,
                activeFilters,
                addFilters: filterProps.addFilters,
                removeFilter: filterProps.removeFilters,
                filterData: filterProps.filterData,
            });
        }));
    }
    return {
        Provider,
        Consumer,
    };
}
exports.createDataFilterContext = createDataFilterContext;
exports.DataFilterContext = createDataFilterContext();

