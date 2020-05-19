# [www.jsdelivr.com](https://www.jsdelivr.com)

[![Build Status](https://github.com/jsdelivr/www.jsdelivr.com/workflows/Node%20CI/badge.svg)](https://github.com/jsdelivr/www.jsdelivr.com/actions?query=workflow%3A%22Node+CI%22)
[![dependencies](https://img.shields.io/david/jsdelivr/www.jsdelivr.com.svg?style=flat-square)](https://david-dm.org/jsdelivr/www.jsdelivr.com)
[![devDependencies](https://img.shields.io/david/dev/jsdelivr/www.jsdelivr.com.svg?style=flat-square)](https://david-dm.org/jsdelivr/www.jsdelivr.com?type=dev)

Related projects:
 - [jsDelivr CDN](https://github.com/jsdelivr/jsdelivr)
 - [jsDelivr API](https://github.com/jsdelivr/data.jsdelivr.com)

## Development

The website uses [Ractive.js](https://ractive.js.org/), [ractive-route](https://github.com/MartinKolarik/ractive-route), and a custom build of [Bootstrap v3](https://getbootstrap.com/). To add a new page, you need to create a new `.html` in [views/pages](https://github.com/jsdelivr/www.jsdelivr.com/tree/master/src/views/pages) (use one of the existing ones as a reference), and add it to [client-side routing](https://github.com/jsdelivr/www.jsdelivr.com/blob/master/src/public/js/app.js). All `.html` files are compiled as [Ractive.js components](https://ractive.js.org/api/#component-files). Styles are in a separate [less directory](https://github.com/jsdelivr/www.jsdelivr.com/tree/master/src/public/less), which mirrors the `views` structure.

### Setup

```
$ npm install
$ node src
```

Configuration for IntelliJ based IDEs is also available in this repository. If you use one, it is a good idea to add https://github.com/MartinKolarik/idea-config as a [read-only settings repository](https://www.jetbrains.com/help/idea/sharing-your-ide-settings.html#share-more-settings-through-read-only-repo). It contains code style and inspection profiles used by this project.

### Testing

 - JS code style: `npm run lint:js`
 - CSS code style: `npm run lint:css`
 - Integration tests: `npm run mocha`
 - All combined: `npm test`

### Contributing

 - Bug fixes and changes discussed in the existing issues are always welcome.
 - For new ideas, please open an issue to discuss them before sending a PR.
 - Make sure your PR passes `npm test` and has [appropriate commit messages](https://github.com/jsdelivr/www.jsdelivr.com/commits/master).
 - A Heroku preview is built automatically for every PR and will be reviewed before merging.

## Production config

```js
module.exports = {
    server: {
        port: 'SERVER_PORT', // defaults to 4400
    },
}
```

Additionally, `ELASTIC_APM_SERVER_URL`, `ELASTIC_APM_SECRET_TOKEN`, `ELASTIC_SEARCH_URL` (including user + pass), and `NODE_ENV=production` should be set.

Staging: https://jsdelivr-com.herokuapp.com/
