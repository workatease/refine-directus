import { CrudFilters, CrudSorting, DataProvider,CrudOperators, LogicalFilter } from "@pankod/refine-core";
import { IDirectus } from '@directus/sdk';
import { CustomTypes } from "./helpers/interface";
type DirectusFilterOperators='_eq'|'_neq'|
    '_gt'|'_gte'|'_lt'|'_lte'|
    '_in'| '_nin'|'_between'|'_nbetween'|
    '_contains'| '_ncontains'|
    '_starts_with'|'_nstarts_with'|'_ends_with'| '_nends_with'|
    '_empty'|'_nempty'|'_nnull'|'_null'|
    '_intersects'|'_nintersects'| '_intersects_bbox'|'_nintersects_bbox';

const operators: Record<CrudOperators, DirectusFilterOperators | undefined>= {
    eq: "_eq",
    ne: "_neq",
    lt: "_lt",
    gt: "_gt",
    lte: "_lte",
    gte: "_gte",
    in: "_in",
    nin: "_nin",
    contains: "_contains",
    containss: undefined,
    ncontains: "_ncontains",
    ncontainss: undefined,
    null: "_null",
    nnull: "_nnull",
    between: "_between",
    nbetween: "_nbetween",
    startswith: "_starts_with",
    nstartswith: "_nstarts_with",
    endswith: "_ends_with",
    nendswith: "_nends_with",startswiths:undefined,
    nstartswiths:undefined, endswiths:undefined, nendswiths:undefined,
    or:undefined,and:undefined
};

type Fields<T> = keyof T | (keyof T)[] | '*' | '*.*' | '*.*.*' | string | string[];


const strToObj = (str: string, val: any) => {
    var i: number,
        obj = {},
        strarr = str.split('.');
    var x: any = obj;
    for (i = 0; i < strarr.length - 1; i++) {
        x = x[strarr[i]] = {};
    }
    x[strarr[i]] = val;
    return obj;
};

const generateSort = (sort?: CrudSorting) => {
    const _sort: string[] = [];

    if (sort) {
        sort.map((item) => {
            if (item.order) {
                item.order === "desc" ? _sort.push(`-${item.field}`) : _sort.push(`${item.field}`);
            }
        });
    }

    return _sort;
};

const generateFilter = (filters?: CrudFilters) => {
    const queryFilters: { [key: string]: any } = {};
    let search: string = '';
    if (filters) {
        queryFilters['_and'] = [];
        filters.map((filter) => {            
                if (
                    filter.operator !== "or" &&
                    filter.operator !== "and" &&
                    "field" in filter
                ) {
                const { field, operator, value } = filter;

                if (value) {
                    if (field === "search") {
                        search = value;
                    }
                    else {
                        const directusOperator = operators[operator];
                        let queryField = `${field}.${directusOperator}`;
                        let filterObj = strToObj(queryField, value);

                        queryFilters['_and'].push(filterObj);
                    }
                }
            } else {

                const { value } = filter;
                const queryOrFilters: { [key: string]: any } = {};
                queryOrFilters['_or'] = [];
                value.map((item) => {
                    const { field, operator, value } = item as LogicalFilter;
                    const directusOperator = operators[operator];
                    let queryField = `${field}.${directusOperator}`;
                    let filterObj = strToObj(queryField, value);
                    queryOrFilters['_or'].push(filterObj);
                });
                queryFilters['_and'].push(queryOrFilters);
            }
        });
    }

    return { search: search, filters: queryFilters };
};

export const dataProvider = (directusClient: IDirectus<CustomTypes>): DataProvider => ({
    getList: async ({ resource, pagination, filters, sort, metaData }) => {

        const current = pagination?.current || 1;
        const pageSize = pagination?.pageSize || 50;

        const _sort = generateSort(sort);
        const paramsFilters = generateFilter(filters);

        const sortString: any = sort && sort.length > 0 ? _sort.join(",") : '';

        const directus = directusClient.items(resource);
        let params: any = {
            search: paramsFilters.search,
            filter: {
                ...paramsFilters.filters
            },
            meta: '*',
            page: current,
            limit: pageSize,
            fields: ['*'],
            rnd:JSON.stringify(new Date().getTime()),
            ...metaData
        };
        if (sortString !== '') {
            params.sort = sortString;
        }

        try {
            const response: any = await directus.readByQuery(params);

            return {
                data: response.data,
                total: response?.meta?.filter_count,
            };
        }
        catch (e) {
            console.log(e);
            throw e;
            // throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    getMany: async ({ resource, ids, metaData }) => {
        const directus = directusClient.items(resource);

        let params: any = {
            ...metaData,
            rnd:JSON.stringify(new Date().getTime()),
        };

        try {
            const response: any = await directus.readMany(ids, params);

            return {
                data: response.data,
                total: response?.meta?.filter_count,
            };
        }
        catch (e) {
            console.log(e);
            throw e;
            //throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    create: async ({ resource, variables, metaData }) => {

        const directus = directusClient.items(resource);

        let params: any = {
            ...variables,
            ...metaData
        };

        try {
            const response: any = await directus.createOne(params);

            return {
                data: response
            };
        }
        catch (e) {
            console.log(e);
            throw e;
            //throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    update: async ({ resource, id, variables, metaData }) => {
        const directus = directusClient.items(resource);

        let params: any = {
            ...variables,
            ...metaData,
            fields: undefined
        };

        try {
            const response: any = await directus.updateOne(id, params);

            return {
                data: response
            };
        }
        catch (e) {
            console.log(e);
            throw e;
            //  throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    updateMany: async ({ resource, ids, variables, metaData }) => {

        const directus = directusClient.items(resource);

        let params: any = {
            ...variables,
            ...metaData,
            fields: undefined
        };

        try {
            const response: any = await directus.updateMany(ids, params);

            return {
                data: response.data
            };
        }
        catch (e) {
            console.log(e);
            throw e;
            //throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    createMany: async ({ resource, variables, metaData }) => {

        const directus = directusClient.items(resource);

        try {
            let items: any[] = [...variables];
            let params: any = {
                ...metaData
            };
            const response: any = await directus.createMany(items, params);

            return {
                data: response.data
            };
        }
        catch (e) {
            console.log(e);
            throw e;
            // throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }

    },

    getOne: async ({ resource, id, metaData }) => {
        const directus = directusClient.items(resource);

        let params: any = {
            ...metaData,
            rnd:JSON.stringify(new Date().getTime()),
        };

        try {
            const response: any = await directus.readOne(id, params);

            return Promise.resolve({
                data: response
            });
        }
        catch (e) {
            console.log(e);
            throw e;
            // throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    deleteOne: async ({ resource, id, metaData }) => {
        const directus = directusClient.items(resource);

        try {
            if (metaData && metaData.softDelete) {
                delete metaData.softDelete;
                let params: any = {}
                if (Object.keys(metaData).length > 0) {
                    params = {
                        ...metaData
                    }
                } else {
                    // if metaData is empty, then we need to set status to archived default behavior
                    params = {
                        status: 'archived'
                    }
                }
                const response: any = await directus.updateOne(id, params);
                return {
                    data: response
                };
            }
            else {
                const response: any = await directus.deleteOne(id);
                return {
                    data: response
                };
            }
        }
        catch (e) {
            console.log(e);
            throw e;
            // throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },

    deleteMany: async ({ resource, ids, metaData }) => {
        const directus = directusClient.items(resource);

        try {
            if (metaData && metaData.softDelete) {
                delete metaData.softDelete;
                let params: any = {}
                if (Object.keys(metaData).length > 0) {
                    params = {
                        ...metaData
                    }
                } else {
                    // if metaData is empty, then we need to set status to archived default behavior
                    params = {
                        status: 'archived'
                    }
                }
                const response: any = await directus.updateMany(ids, params);

                return {
                    data: response.data
                };
            }
            else {
                const response: any = await directus.deleteMany(ids);

                return {
                    data: response
                };
            }
        }
        catch (e) {
            console.log(e);
            throw e;
            //throw new Error(e.errors && e.errors[0] && e.errors[0].message);
        }
    },


    getApiUrl: () => {
        return directusClient.url;
    },

    custom: async ({ url, method, filters, sort, payload, query, headers }) => {

        const directusTransport = directusClient.transport;

        let response: any;
        switch (method) {
            // put method is not supported by directus but it is required if there is any custom endpoint hooks
            case "put":
                response = await directusTransport.put(url, payload, { headers: headers, params: query });
                break;
            case "post":
                response = await directusTransport.post(url, payload, { headers: headers, params: query });
                break;
            case "patch":
                response = await directusTransport.patch(url, payload, { headers: headers, params: query });
                break;
            case "delete":
                response = await directusTransport.delete(url, { headers: headers, params: query });
                break;
            default:
                response = await directusTransport.get(url, { headers: headers, params: query });
                break;
        }
        console.log(response);
        return {
            ...response,
            data: response?.data
        };

    },
});
