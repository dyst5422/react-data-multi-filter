# React Data Multi Filter

A react component for efficient data filtering.

Multi-level function caching (using [memoization](https://github.com/medikoo/memoizee))enables efficient filtering for large data sets, large filter sets, and expensive filters.

Render prop and Context API makes the component extremely flexible.

## Usage

This is a standalone component with render props...
```tsx
import { DataFilter } from 'react-data-multi-filter';

const MyComponent = () => {
  const data = [0, 1, 2, 3, 4, 5];
  const greaterThanTwo = (datum: number) => datum > 2;
  const lessThanFive = (datum: number) => datum < 5;
  const myFilters = { greaterThanTwo, lessThanFive };
  return (
    <DataFilter data={data} filters={myFilters}>
      {({ filteredInData, addFilter }) => (
        <>
          <button onClick={() => addFilter({ equalToThree: datum => datum === 3 })}>AddFilter</button>
          <span>
            {filteredInData}
          </span>
        </>
      )}
    </DataFilter>,
  );
}
```
...and a context provider...
```tsx
import { DataFilterContext } from 'react-data-multi-filter';

const MyComponent = () => {
  const data = [0, 1, 2, 3, 4, 5];
  const greaterThanTwo = (datum: number) => datum > 2;
  const lessThanFive = (datum: number) => datum < 5;
  const myFilters = { greaterThanTwo, lessThanFive };
  return (
    <DataFilterContext.Provider data={data} filters={myFilters}>
      <DataFilterContext.Consumer>
        {({ filteredInData }) => (
          <span>
            {filteredInData}
          </span>
        )}
      </DataFilterContext.Consumer>
    </DataFilterContext.Provider>,
  );
}
```

## Advanced Usage

Create multiple independent data filter contexts
```tsx
import { createDataFilterContext } from 'react-data-multi-filter';

const MyComponent = () => {
  const data = [0, 1, 2, 3, 4, 5];
  const greaterThanTwo = (datum: number) => datum > 2;
  const lessThanFive = (datum: number) => datum < 5;

  const DataFilter1Context = createDataFilterContext();
  const DataFilter2Context = createDataFilterContext();
  return (
    <DataFilter1Context.Provider data={data} filters={{ greaterThanTwo }}>
      <DataFilter2Context.Provider data={data} filters={{ lessThanFive }}>
        <DataFilter1Context.Consumer>
          {({ filteredInData }) => (
            <span>
              {filteredInData}
            </span>
          )}
        </DataFilter1Context.Consumer>
        <DataFilter2Context.Consumer>
          {({ filteredInData }) => (
            <span>
              {filteredInData}
            </span>
          )}
        </DataFilter2Context.Consumer>
      </DataFilter2Context.Provider>,
    </DataFilter1Context.Provider>,
  );
}
```

Selectively apply filters
```tsx
import { DataFilterContext } from 'react-data-multi-filter';

const MyComponent = () => {
  const data = [0, 1, 2, 3, 4, 5];
  const greaterThanTwo = (datum: number) => datum > 2;
  const lessThanFive = (datum: number) => datum < 5;
  const myFilters = { greaterThanTwo, lessThanFive };
  return (
    <DataFilterContext.Provider data={data} filters={myFilters}>
      <DataFilterContext.Consumer exclude={['lessThanFive']}>
        {({ filteredInData }) => (
          <span>
            {filteredInData}
          </span>
        )}
      </DataFilterContext.Consumer>
    </DataFilterContext.Provider>,
  );
}
```

## API

Named Exports:
- DataFilter
- DataFilterContext
- createDataFilterContext

### DataFilter

```ts
export interface DataFilterProps<T> {
  data: T[]; // Data to filter
  filters?: { // Associative array of initial filters
      [key: string]: (datum: T, idx?: number, data?: T[]): boolean;
  };
  children: (props: { // Render props
      filteredInData: T[]; // Data included by the filters
      filteredOutData: T[]; // Data excluded by the filters
      allData: T[]; // Full data set
      filters: { // Associative array of all filters
          [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
      };
      activeFilters: { // Associative array of all active filters
          [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
      };
      addFilters: (filters: { // Add filters dynamically
          [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
      }) => void;
      removeFilters: (removeKeys: string[]) => void; // Remove filters by key dynamically
      filterData: (opts?: { // Function to apply a custom filter set
          exclude?: string[]; // Keys of filters to exclude
          include?: string[]; // Keys of filters to include
      }) => {
          filteredInData: T[]; // Data included by the custom filter set
          filteredOutData: T[];// Data excluded by the custom filter set
          activeFilters: { // Associative array of all active filters
              [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
          };
      };
  }) => JSX.Element;
}
```

### DataFilterContext.Provider

```ts
export interface DataFilterContext<T>.Provider {
  data: T[]; // Data to filter
  filters?: { // Associative array of initial filters
      [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
  };
}
```

### DataFilterContext.Consumer

```ts
export interface DataFilterContext<T>.Consumer {
  exclude?: string[]; // Keys of filters to exclude
  include?: string[]; // Keys of filters to include
  children: (props: { // Render Props
    filteredInData: T[]; // Data included by the filters
    filteredOutData: T[]; // Data excluded by the filters
    allData: T[]; // Full data set
    filters: { // All data filters
      [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
    };
    activeFilters: { // Active data filters
      [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
    };
    addFilters: (filters: { // Add new filters dynamically
      [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
    }) => void;
    removeFilter: (removeKeys: string[]) => void; // Remove filters by keys dynamically
    filterData: (opts?: { // Function to apply a custom filter set
      exclude?: string[]; // Keys of filters to exclude
      include?: string[]; // Keys of filters to include
    }) => {
      filteredInData: T[]; // Data included by the custom filter set
      filteredOutData: T[]; // Data excluded by the custom filter set
      activeFilters: { // Associative array of all active filters
        [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
      };
    };
  }) => JSX.Element;
}
```

### createDataFilterContext

```ts
function createDataFilterContext<T>(): DataFilterContext<T>
```