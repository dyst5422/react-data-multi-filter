import * as React from 'react';
import createReactContext from 'create-react-context';
import { DataFilter } from './DataFilter';
export function createDataFilterContext() {
    const Context = createReactContext({
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
        return (React.createElement(DataFilter, Object.assign({}, props), filterProps => React.createElement(Context.Provider, { value: filterProps }, props.children)));
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
export const DataFilterContext = createDataFilterContext();

