import * as React from 'react';
import createReactContext from 'create-react-context';
import { DataFilter, DataFilterProps } from './DataFilter';
import Component from 'react-component-component';

type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// tslint:disable-next-line:no-any
export function createDataFilterContext<T = any>() {
  const Context = createReactContext<{
    filteredInData: T[];
    filteredOutData: T[];
    allData: T[];
    filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
    activeFilters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
    addFilters: (filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean }) => void;
    removeFilters: (removeKeys: string[]) => void;
    filterData: (
      opts?: { exclude?: string[]; include?: string[] },
    ) => {
      filteredInData: T[];
      filteredOutData: T[];
      activeFilters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
    };
  }>({
    filteredInData: [],
    filteredOutData: [],
    allData: [],
    filters: {},
    activeFilters: {},
    addFilters: () => {}, // tslint:disable-line:no-empty
    removeFilters: () => {}, // tslint:disable-line:no-empty
    filterData: () => ({
      filteredInData: [],
      filteredOutData: [],
      activeFilters: {},
    }),
  });

  function Provider(props: Omit<DataFilterProps<T>, 'children'> & { children: React.ReactNode }) {
    return (
      <DataFilter {...props}>
        {filterProps => <Context.Provider value={filterProps}>{props.children}</Context.Provider>}
      </DataFilter>
    );
  }

  function Consumer(props: {
    exclude?: string[];
    include?: string[];
    filters?: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
    children: (
      props: {
        filteredInData: T[];
        filteredOutData: T[];
        allData: T[];
        filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
        activeFilters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
        addFilters: (filters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean }) => void;
        removeFilter: (removeKeys: string[]) => void;
        filterData: (
          opts?: { exclude?: string[]; include?: string[] },
        ) => {
          filteredInData: T[];
          filteredOutData: T[];
          activeFilters: { [key: string]: (datum: T, idx?: number, data?: T[]) => boolean };
        };
      },
    ) => JSX.Element;
  }) {
    return (
      <Context.Consumer>
        {filterProps => (
          <Component didMount={() => props.filters && filterProps.addFilters(props.filters)}>
            {() => {
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
            }}
          </Component>
        )}
      </Context.Consumer>
    );
  }

  return {
    Provider,
    Consumer,
  };
}

export const DataFilterContext = createDataFilterContext();