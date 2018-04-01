import * as React from 'react';
import { DataFilterContext, createDataFilterContext } from './DataFilterContext';
import { render } from 'react-testing-library';

describe('DataFilterContext', () => {
  it('should provide the datafilter to context', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilterContext.Provider data={data} filters={myFilters}>
        <DataFilterContext.Consumer>
          {({ filteredInData, filteredOutData, allData, filters }) => {
            expect(Object.keys(filters)).toEqual(['greaterThanTwo', 'lessThanFive']);
            expect(filters.greaterThanTwo(1)).toEqual(false);
            return (
              <span
                data-testid={'filter-results'}
                data-filteredInData={filteredInData}
                data-filteredOutData={filteredOutData}
                data-allData={allData}
              />
            );
          }}
        </DataFilterContext.Consumer>
      </DataFilterContext.Provider>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual(
      [0, 1, 2, 5].toString(),
    );
    expect(container.getByTestId('filter-results').getAttribute('data-allData')).toEqual([0, 1, 2, 3, 4, 5].toString());
  });

  it('should allow excluding filters', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilterContext.Provider data={data} filters={myFilters}>
        <DataFilterContext.Consumer exclude={['lessThanFive']}>
          {({ filteredInData, filteredOutData, allData, activeFilters }) => (
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
              data-allData={allData}
            />
          )}
        </DataFilterContext.Consumer>
      </DataFilterContext.Provider>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-allData')).toEqual([0, 1, 2, 3, 4, 5].toString());
  });

  it('should allow including filters selectively', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const container = render(
      <DataFilterContext.Provider data={data} filters={{ greaterThanTwo }}>
        <DataFilterContext.Consumer include={['greaterThanTwo']}>
          {({ filteredInData, filteredOutData, allData, activeFilters }) => (
            <span
              data-testid={'filter-results1'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
              data-allData={allData}
            />
          )}
        </DataFilterContext.Consumer>
        <DataFilterContext.Consumer filters={{ lessThanFive }}>
          {({ filteredInData, filteredOutData, allData, activeFilters }) => (
            <span
              data-testid={'filter-results2'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
              data-allData={allData}
            />
          )}
        </DataFilterContext.Consumer>
      </DataFilterContext.Provider>,
    );

    expect(container.getByTestId('filter-results1').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results1').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
    expect(container.getByTestId('filter-results1').getAttribute('data-allData')).toEqual(
      [0, 1, 2, 3, 4, 5].toString(),
    );
    expect(container.getByTestId('filter-results2').getAttribute('data-filteredInData')).toEqual([3, 4].toString());
    expect(container.getByTestId('filter-results2').getAttribute('data-filteredOutData')).toEqual(
      [0, 1, 2, 5].toString(),
    );
    expect(container.getByTestId('filter-results2').getAttribute('data-allData')).toEqual(
      [0, 1, 2, 3, 4, 5].toString(),
    );
  });
});

describe('createDataFilterContext', () => {
  it('should create a new data filter context set', () => {
    const context = createDataFilterContext();
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <context.Provider data={data} filters={myFilters}>
        <context.Consumer>
          {({ filteredInData, filteredOutData, allData, filters }) => {
            expect(Object.keys(filters)).toEqual(['greaterThanTwo', 'lessThanFive']);
            expect(filters.greaterThanTwo(1)).toEqual(false);
            return (
              <span
                data-testid={'filter-results'}
                data-filteredInData={filteredInData}
                data-filteredOutData={filteredOutData}
                data-allData={allData}
              />
            );
          }}
        </context.Consumer>
      </context.Provider>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual(
      [0, 1, 2, 5].toString(),
    );
    expect(container.getByTestId('filter-results').getAttribute('data-allData')).toEqual([0, 1, 2, 3, 4, 5].toString());
  });

  it('should allow for multiple context sets', () => {
    const context1 = createDataFilterContext();
    const context2 = createDataFilterContext();
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const container = render(
      <context1.Provider data={data} filters={{ greaterThanTwo }}>
        <context2.Provider data={data} filters={{ lessThanFive }}>
          <context1.Consumer>
            {({ filteredInData, filteredOutData, allData, filters }) => (
              <span
                data-testid={'filter-results1'}
                data-filteredInData={filteredInData}
                data-filteredOutData={filteredOutData}
                data-allData={allData}
              />
            )}
          </context1.Consumer>
          <context2.Consumer>
            {({ filteredInData, filteredOutData, allData, filters }) => (
              <span
                data-testid={'filter-results2'}
                data-filteredInData={filteredInData}
                data-filteredOutData={filteredOutData}
                data-allData={allData}
              />
            )}
          </context2.Consumer>
        </context2.Provider>
      </context1.Provider>,
    );

    expect(container.getByTestId('filter-results1').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results1').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
    expect(container.getByTestId('filter-results1').getAttribute('data-allData')).toEqual(
      [0, 1, 2, 3, 4, 5].toString(),
    );
    expect(container.getByTestId('filter-results2').getAttribute('data-filteredInData')).toEqual(
      [0, 1, 2, 3, 4].toString(),
    );
    expect(container.getByTestId('filter-results2').getAttribute('data-filteredOutData')).toEqual([5].toString());
    expect(container.getByTestId('filter-results2').getAttribute('data-allData')).toEqual(
      [0, 1, 2, 3, 4, 5].toString(),
    );
  });
});
