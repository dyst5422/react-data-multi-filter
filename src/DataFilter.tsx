import * as React from 'react';
import memoize from 'memoizee';

export interface DataFilterProps<T> {
  data: T[];
  // tslint:disable-next-line:no-any
  filters?: { [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any } };
  children: (
    props: {
      filteredInData: T[];
      filteredOutData: T[];
      allData: T[];
      // tslint:disable-next-line:no-any
      filters: { [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any } };
      // tslint:disable-next-line:no-any
      activeFilters: { [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any } };
      addFilters: (filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean }) => void;
      removeFilters: (removeKeys: string[]) => void;
      filterData: (
        opts?: { exclude?: string[]; include?: string[] },
      ) => {
        filteredInData: T[];
        filteredOutData: T[];
        // tslint:disable-next-line:no-any
        activeFilters: { [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any } };
      };
    },
  ) => JSX.Element;
}

export interface DataFilterState<T> {
  filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
}

// tslint:disable-next-line:max-line-length
export class DataFilter<T> extends React.Component<DataFilterProps<T>, DataFilterState<T>> {

  private applyFilterToData = memoize((data: T[], filter: (datum: T, idx?: number, data?: T[]) => boolean) => {
    const filterResults: boolean[] = [];
    for (let idx = 0; idx < data.length; idx += 1) {
      if (filter(data[idx], idx, data)) {
        filterResults.push(true);
      } else {
        filterResults.push(false);
      }
    }
    return filterResults;
  });

  private memoizedFilterData = memoize((
    data: T[],
    // tslint:disable-next-line:no-any
    filters: { [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any } },
    exclude: string[],
    include?: string[],
  ) => {
    let filtersKeysToInclude = Object.keys(filters);

    if (include) {
      filtersKeysToInclude = include;
    }

    filtersKeysToInclude = filtersKeysToInclude.filter(filterKey => !exclude!.includes(filterKey));

    const filteredOutData: T[] = [];
    const filteredInData: T[] = [];

    const filterResults: { [key: string]: boolean[] } = {};
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
      activeFilters: filtersKeysToInclude.reduce(
        (accumulator, filterKey) => ({
          ...accumulator,
          [filterKey]: filters[filterKey],
        }),
        // tslint:disable-next-line:no-any
        {} as { [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any } },
      ),
    };
  });

  private static memoizeHashOfFuncs<F extends Function>(funcHash: { [key: string]: F }) {
    return Object.keys(funcHash).reduce(
      (accumulator, key) => {
        const memoizedFunc = memoize(funcHash[key], { length: funcHash[key].length });
        // Assign any properties to the new memoized function
        for (const propertyKey of Object.keys(funcHash[key])) {
          memoizedFunc[propertyKey] = funcHash[key][propertyKey];
        }
        return {
          ...accumulator,
          [key]: memoizedFunc,
        };
      },
      {} as { [key: string]: F },
    );
  }

  constructor(props: DataFilterProps<T>) {
    super(props);
    let filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean } = {};
    if (props.filters) {
      filters = DataFilter.memoizeHashOfFuncs(props.filters);
    }

    this.state = {
      filters,
    };
  }

  public render() {
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

  private filterData = (opts?: { include?: string[]; exclude?: string[] }) =>
    this.memoizedFilterData(
      this.props.data,
      this.state.filters,
      (opts && opts.exclude) || [],
      (opts && opts.include) || undefined,
    )

  private addFilters = (filters: {
    // tslint:disable-next-line:no-any
    [key: string]: { (datum: T, idx?: number, data?: T[]): boolean; [key: string]: any };
  }) => {
    for (const key of Object.keys(filters)) {
      if (Object.keys(this.state.filters).includes(key)) {
        console.warn(`React-Data-Multi-Filter: Overwriting an existing filter with key [${key}]`);
      }
    }

    this.setState({
      filters: {
        ...this.state.filters,
        ...DataFilter.memoizeHashOfFuncs(filters),
      },
    });
  }

  private removeFilters = (removeKeys: string[]) => {
    const filters = Object.keys(this.state.filters).reduce(
      (accumulator, filterKey) => {
        if (removeKeys.includes(filterKey)) {
          return accumulator;
        } else {
          return {
            ...accumulator,
            [filterKey]: this.state.filters[filterKey],
          };
        }
      },
      {} as { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean },
    );
    this.setState({
      filters,
    });
  }
}