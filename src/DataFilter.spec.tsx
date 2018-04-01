import * as React from 'react';
import { DataFilter } from './DataFilter';
import { render, Simulate } from 'react-testing-library';

describe('DataFilter', () => {
  it('should filter data', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
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
      </DataFilter>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual(
      [0, 1, 2, 5].toString(),
    );
    expect(container.getByTestId('filter-results').getAttribute('data-allData')).toEqual([0, 1, 2, 3, 4, 5].toString());
  });

  it('should allow for filters that read the whole dataset', () => {
    const testdata = [1, 1, 2, 2, 4, 5];
    const unique = (datum: number, idx: number, data: number[]) => data.filter(dat => dat === datum).length === 1;
    const container = render(
      <DataFilter data={testdata} filters={{ unique }}>
        {({ filteredInData, filteredOutData }) => (
          <span
            data-testid={'filter-results'}
            data-filteredInData={filteredInData}
            data-filteredOutData={filteredOutData}
          />
        )}
      </DataFilter>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual(
      [1, 1, 2, 2].toString(),
    );
  });

  it('should memoize filter functions', () => {
    const testdata = [1, 1, 2, 2, 4, 5];
    const unique = jest.fn(
      (datum: number, idx: number, data: number[]) => data.filter(dat => dat === datum).length === 1,
    );
    const container = render(
      <DataFilter data={testdata} filters={{ unique }}>
        {({ filterData }) => <button onClick={() => filterData()} data-testid={'filter-data'} />}
      </DataFilter>,
    );

    Simulate.click(container.getByTestId('filter-data'));

    expect(unique).toHaveBeenCalledTimes(6);
  });

  it('should memoize filter functions more efficiently for fewer function arguments', () => {
    const testdata = [1, 1, 2, 2, 4, 5];
    const unique = jest.fn((datum: number) => datum === 1);
    const container = render(
      <DataFilter data={testdata} filters={{ unique }}>
        {({ filterData }) => <button onClick={() => filterData()} data-testid={'filter-data'} />}
      </DataFilter>,
    );

    Simulate.click(container.getByTestId('filter-data'));

    expect(unique).toHaveBeenCalledTimes(4);
  });

  it('should allow adding filters', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
        {({ filteredInData, filteredOutData, addFilters }) => (
          <>
            <button onClick={() => addFilters({ lessThanFive })} data-testid={'add-filter-button'} />
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
            />
          </>
        )}
      </DataFilter>,
    );

    Simulate.click(container.getByTestId('add-filter-button'));

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual(
      [0, 1, 2, 5].toString(),
    );
  });

  it('should allow removing filters', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
        {({ filteredInData, filteredOutData, removeFilters }) => (
          <>
            <button onClick={() => removeFilters(['lessThanFive'])} data-testid={'remove-filter-button'} />
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
            />
          </>
        )}
      </DataFilter>,
    );

    Simulate.click(container.getByTestId('remove-filter-button'));

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
  });

  it('should allow excluding filters', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
        {({ filterData }) => {
          const { filteredInData, filteredOutData } = filterData({ exclude: ['lessThanFive'] });
          return (
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
            />
          );
        }}
      </DataFilter>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
  });

  it('should allow including filters selectively', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
        {({ filterData }) => {
          const { filteredInData, filteredOutData } = filterData({ include: ['greaterThanTwo'] });
          return (
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
            />
          );
        }}
      </DataFilter>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
  });

  it('should allow including and excluding filters', () => {
    const data = [0, 1, 2, 3, 4, 5];
    const greaterThanTwo = (datum: number) => datum > 2;
    const lessThanFive = (datum: number) => datum < 5;
    const myFilters = { greaterThanTwo, lessThanFive };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
        {({ filterData }) => {
          const { filteredInData, filteredOutData } = filterData({
            include: ['greaterThanTwo', 'lessThanFive'],
            exclude: ['lessThanFive'],
          });
          return (
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
            />
          );
        }}
      </DataFilter>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
  });

  it('should maintain function properties', () => {
    const data = [0, 1, 2, 3, 4, 5];
    // tslint:disable-next-line:no-any
    const greaterThanTwo: { (datum: number, idx: number, data?: number[]): boolean; [key: string]: any } = (
      datum: number,
    ) => datum > 2;
    greaterThanTwo.myProp = 1;

    const myFilters = { greaterThanTwo };
    const container = render(
      <DataFilter data={data} filters={myFilters}>
        {({ filteredInData, filteredOutData, filters }) => {
          expect(filters.greaterThanTwo.myProp).toEqual(1);
          return (
            <span
              data-testid={'filter-results'}
              data-filteredInData={filteredInData}
              data-filteredOutData={filteredOutData}
            />
          );
        }}
      </DataFilter>,
    );

    expect(container.getByTestId('filter-results').getAttribute('data-filteredInData')).toEqual([3, 4, 5].toString());
    expect(container.getByTestId('filter-results').getAttribute('data-filteredOutData')).toEqual([0, 1, 2].toString());
  });
});
