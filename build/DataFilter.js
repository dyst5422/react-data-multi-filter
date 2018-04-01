"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const memoizee_1 = require("memoizee");
class DataFilter extends React.Component {
    constructor(props) {
        super(props);
        this.applyFilterToData = memoizee_1.default((data, filter) => {
            const filterResults = [];
            for (let idx = 0; idx < data.length; idx += 1) {
                if (filter(data[idx], idx, data)) {
                    filterResults.push(true);
                }
                else {
                    filterResults.push(false);
                }
            }
            return filterResults;
        });
        this.memoizedFilterData = memoizee_1.default((data, 
        filters, exclude, include) => {
            let filtersKeysToInclude = Object.keys(filters);
            if (include) {
                filtersKeysToInclude = include;
            }
            filtersKeysToInclude = filtersKeysToInclude.filter(filterKey => !exclude.includes(filterKey));
            const filteredOutData = [];
            const filteredInData = [];
            const filterResults = {};
            for (const filterKey of filtersKeysToInclude) {
                filterResults[filterKey] = this.applyFilterToData(data, filters[filterKey]);
            }
            dataLoop: for (let idx = 0; idx < data.length; idx += 1) {
                for (const filterKey of Object.keys(filterResults)) {
                    if (filters[filterKey]) {
                        if (!filterResults[filterKey][idx]) {
                            filteredOutData.push(data[idx]);
                            continue dataLoop;
                        }
                    }
                }
                filteredInData.push(data[idx]);
            }
            return {
                filteredOutData,
                filteredInData,
                activeFilters: filtersKeysToInclude.reduce((accumulator, filterKey) => (Object.assign({}, accumulator, { [filterKey]: filters[filterKey] })), 
                {}),
            };
        });
        this.filterData = (opts) => this.memoizedFilterData(this.props.data, this.state.filters, (opts && opts.exclude) || [], (opts && opts.include) || undefined);
        this.addFilters = (filters) => {
            this.setState({
                filters: Object.assign({}, this.state.filters, DataFilter.memoizeHashOfFuncs(filters)),
            });
        };
        this.removeFilters = (removeKeys) => {
            const filters = Object.keys(this.state.filters).reduce((accumulator, filterKey) => {
                if (removeKeys.includes(filterKey)) {
                    return accumulator;
                }
                else {
                    return Object.assign({}, accumulator, { [filterKey]: this.state.filters[filterKey] });
                }
            }, {});
            this.setState({
                filters,
            });
        };
        let filters = {};
        if (props.filters) {
            filters = DataFilter.memoizeHashOfFuncs(props.filters);
        }
        this.state = {
            filters,
        };
    }
    static memoizeHashOfFuncs(funcHash) {
        return Object.keys(funcHash).reduce((accumulator, key) => {
            const memoizedFunc = memoizee_1.default(funcHash[key], { length: funcHash[key].length });
            for (const propertyKey of Object.keys(funcHash[key])) {
                memoizedFunc[propertyKey] = funcHash[key][propertyKey];
            }
            return Object.assign({}, accumulator, { [key]: memoizedFunc });
        }, {});
    }
    render() {
        const { filteredInData, filteredOutData, activeFilters } = this.filterData();
        return this.props.children({
            allData: this.props.data,
            filteredInData,
            filteredOutData,
            filters: this.state.filters,
            activeFilters,
            addFilters: this.addFilters,
            removeFilters: this.removeFilters,
            filterData: this.filterData,
        });
    }
}
exports.DataFilter = DataFilter;

