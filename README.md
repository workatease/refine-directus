[![codecov](https://codecov.io/gh/workatease/refine-directus/branch/master/graph/badge.svg?token=UD27GSCVNA)](https://codecov.io/gh/workatease/refine-directus) [![build](https://github.com/workatease/refine-directus/workflows/build/badge.svg)](https://github.com/workatease/refine-directus/actions/workflows/ci.yml) 
[![npm version](https://badge.fury.io/js/@workatease%2Frefine-directus.svg)](https://badge.fury.io/js/@workatease%2Frefine-directus)

# [**Directus**](https://directus.io/) dataprovider package for refine.

## About

[**refine**](https://refine.dev/) offers lots of out-of-the box functionality for rapid development, without compromising extreme customizability. Use-cases include, but are not limited to *admin panels*, *B2B applications* and *dashboards*.


A big thanks to [**Directus**](https://directus.io/) for providing the API and js SDK and to @tspvivek for the initial implementation of the package.


## Documentation

For more detailed information and usage, refer to the [refine data provider documentation](https://refine.dev/docs/core/providers/data-provider).
see below notes for more information.

## Install

```
npm install @workatease/refine-directus
```

## Example
Use below login details in example<br />
username: demo@demo.com<br />
password: 123456<br />
url: https://refine.dev/docs/examples/data-provider/directus/


## Notes

To enable perform archive instead of delete with [**DeleteButton**](https://refine.dev/docs/ui-frameworks/antd/components/buttons/delete-button/#api-reference) pass metaData={softDelete:true,field:value} in DeleteButton
if no field is passed then default `status` field will be used and set to `archived`
example:
```
<DeleteButton
    hideText
    size="small"
    recordItemId={record.id}
    metaData={{ softDelete: true }}
/>

<DeleteButton
    hideText
    size="small"
    recordItemId={record.id}
    metaData={{ softDelete: true, isDeleted: "true" }}
/>
```

## usage
    
   App.tsx 
   ``` 
    import { Directus, authProvider,dataProvider } from '@workatease/refine-directus';
    function App() {
    const directus = new Directus<MyCollections>("https://url");

    return (
     <Refine 
      routerProvider={routerProvider}
      dataProvider={dataProvider(directus)}
      authProvider={authProvider(directus)}  // optional - can use your own auth provider
      ...
    />
    );
    }
```

## Tests
 All Tests are run against the latest version of Directus Cloud.

### difference From the [actual](https://www.npmjs.com/package/@tspvivek/refine-directus) Library
- Removing hardcoded filter from the data provider for flexibility if status field is not present in the table
```status: { _neq: 'archived' }```
- ```or``` Query support added to the data provider
- soft delete parameter changed and added support to add custom field for soft delete

### TODO
- ~~make changes packages JSON file package name change~~
- ~~update directus sdk to latest version~~
- ~~add auth provider~~
- add upload utils without react dependency
- add live provider with help of extension in directus 9 link
- update examples files
- ~~automate integration with directus server~~


### Changesets
#### 1.0.11
- Added rnd value to the url to avoid caching issue in Auth provider
----------------
#### 1.0.10
- Added rnd value to the url to avoid caching issue
----------------
#### 1.0.9

- update library version
  - "@directus/sdk": "^10.1.4"
  - "@pankod/refine-core": "3.69.0"
- now support filter startwith, endswith, nstartswith, nendswith

----------------
#### 1.0.8

- Data provider will support soft delete with metaData={softDelete:true,field:value} in DeleteButton
- Default AuthProvider added to the package
 