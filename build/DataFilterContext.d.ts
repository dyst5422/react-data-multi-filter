import * as React from 'react';
import { DataFilterProps } from './DataFilter';
export declare function createDataFilterContext<T = any>(): {
    Provider: (props: Pick<DataFilterProps<T>, "data" | "filters"> & {
        children: React.ReactNode;
    }) => JSX.Element;
    Consumer: (props: {
        exclude?: string[] | undefined;
        include?: string[] | undefined;
        children: (props: {
            filteredInData: T[];
            filteredOutData: T[];
            allData: T[];
            filters: {
                [key: string]: (datum: T, idx?: number | undefined, data?: T[] | undefined) => boolean;
            };
            activeFilters: {
                [key: string]: (datum: T, idx?: number | undefined, data?: T[] | undefined) => boolean;
            };
            addFilters: (filters: {
                [key: string]: (datum: T, idx?: number | undefined, data?: T[] | undefined) => boolean;
            }) => void;
            removeFilter: (removeKeys: string[]) => void;
            filterData: (opts?: {
                exclude?: string[] | undefined;
                include?: string[] | undefined;
            } | undefined) => {
                filteredInData: T[];
                filteredOutData: T[];
                activeFilters: {
                    [key: string]: (datum: T, idx?: number | undefined, data?: T[] | undefined) => boolean;
                };
            };
        }) => JSX.Element;
    }) => JSX.Element;
};
export declare const DataFilterContext: {
    Provider: (props: Pick<DataFilterProps<any>, "data" | "filters"> & {
        children: React.ReactNode;
    }) => JSX.Element;
    Consumer: (props: {
        exclude?: string[] | undefined;
        include?: string[] | undefined;
        children: (props: {
            filteredInData: any[];
            filteredOutData: any[];
            allData: any[];
            filters: {
                [key: string]: (datum: any, idx?: number | undefined, data?: any[] | undefined) => boolean;
            };
            activeFilters: {
                [key: string]: (datum: any, idx?: number | undefined, data?: any[] | undefined) => boolean;
            };
            addFilters: (filters: {
                [key: string]: (datum: any, idx?: number | undefined, data?: any[] | undefined) => boolean;
            }) => void;
            removeFilter: (removeKeys: string[]) => void;
            filterData: (opts?: {
                exclude?: string[] | undefined;
                include?: string[] | undefined;
            } | undefined) => {
                filteredInData: any[];
                filteredOutData: any[];
                activeFilters: {
                    [key: string]: (datum: any, idx?: number | undefined, data?: any[] | undefined) => boolean;
                };
            };
        }) => JSX.Element;
    }) => JSX.Element;
};
