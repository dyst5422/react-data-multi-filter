import * as React from 'react';
export interface DataFilterProps<T> {
    data: T[];
    filters?: {
        [key: string]: {
            (datum: T, idx?: number, data?: T[]): boolean;
            [key: string]: any;
        };
    };
    children: (props: {
        filteredInData: T[];
        filteredOutData: T[];
        allData: T[];
        filters: {
            [key: string]: {
                (datum: T, idx?: number, data?: T[]): boolean;
                [key: string]: any;
            };
        };
        activeFilters: {
            [key: string]: {
                (datum: T, idx?: number, data?: T[]): boolean;
                [key: string]: any;
            };
        };
        addFilters: (filters: {
            [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
        }) => void;
        removeFilters: (removeKeys: string[]) => void;
        filterData: (opts?: {
            exclude?: string[];
            include?: string[];
        }) => {
            filteredInData: T[];
            filteredOutData: T[];
            activeFilters: {
                [key: string]: {
                    (datum: T, idx?: number, data?: T[]): boolean;
                    [key: string]: any;
                };
            };
        };
    }) => JSX.Element;
}
export interface DataFilterState<T> {
    filters: {
        [key: string]: (datum: T, idx?: number, data?: T[]) => boolean;
    };
}
export declare class DataFilter<T> extends React.Component<DataFilterProps<T>, DataFilterState<T>> {
    private applyFilterToData;
    private memoizedFilterData;
    private static memoizeHashOfFuncs<F>(funcHash);
    constructor(props: DataFilterProps<T>);
    render(): JSX.Element;
    private filterData;
    private addFilters;
    private removeFilters;
}
