# refine-directus
[**Directus**](https://directus.io/) dataprovider package for refine.

## About

[**refine**](https://refine.dev/) offers lots of out-of-the box functionality for rapid development, without compromising extreme customizability. Use-cases include, but are not limited to *admin panels*, *B2B applications* and *dashboards*.

## Documentation

For more detailed information and usage, refer to the [refine data provider documentation](https://refine.dev/docs/core/providers/data-provider).

## Install

```
npm install @tspvivek/refine-directus
```

## Example
Use below login details in example<br />
username: demo@demo.com<br />
password: 123456<br />
url: https://refine.dev/docs/examples/data-provider/directus/

## Notes
To enable perform archive instead of delete with [**DeleteButton**](https://refine.dev/docs/ui-frameworks/antd/components/buttons/delete-button/#api-reference) pass metaData={deleteType:'archive'} in DeleteButton

### difference From the actual Library
- Removing hardcoded filter from the data provider only to give more flexibility 
```status: { _neq: 'archived' }```

# TODO
- make changes packages JSON file package name change
- update directus sdk to latest version
- add auth provider
- add live provider with help of extension in directus 9 link

