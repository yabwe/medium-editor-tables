# MediumEditor Tables

[![NPM info](https://nodei.co/npm/medium-editor-tables.png?downloads=true)](https://nodei.co/npm/medium-editor-tables.png?downloads=true)

[![Travis build status](https://travis-ci.org/daviferreira/medium-editor-tables.png?branch=master)](https://travis-ci.org/daviferreira/medium-editor-tables)
[![dependencies](https://david-dm.org/daviferreira/medium-editor-tables.png)](https://david-dm.org/daviferreira/medium-editor-tables)
[![devDependency Status](https://david-dm.org/daviferreira/medium-editor-tables/dev-status.png)](https://david-dm.org/daviferreira/medium-editor-tables#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/daviferreira/medium-editor-tables/badge.svg)](https://coveralls.io/r/daviferreira/medium-editor-tables)

MediumEditor Tables is an extension to add a table button/behavior to [MediumEditor](https://github.com/daviferreira/medium-editor).

Demo: [http://daviferreira.github.io/medium-editor-tables/](http://daviferreira.github.io/medium-editor-tables/)

--

![meditor-tables mp4](https://cloud.githubusercontent.com/assets/38787/6430614/8ff048c0-c011-11e4-8e2c-09ff773d2f78.gif)

--

## Usage

You can install manually or either by using npm or bower:

```
npm install medium-editor-tables
```

or

```
bower install medium-editor-tables
```

On your app, link the style and the script and initialize MediumEditor with the table extension:

```html
<!doctype html>
<html>
<head>
...
  <link rel="stylesheet" href="<path_to_medium-editor>/dist/css/medium-editor.css" />
  <link rel="stylesheet" href="<path_to_medium-editor>/dist/css/themes/default.css" />
  <link rel="stylesheet" href="<path_to_medium-editor-tables>/dist/css/medium-editor-tables.css" />
...
</head>
<body>
  <div class="editable"></div>

  <script type="text/javascript" src="<path_to_medium-editor>/dist/js/medium-editor.js"></script>
  <script type="text/javascript" src="<path_to_medium-editor-tables>/dist/js/medium-editor-tables.js"></script>

  <script type="text/javascript" charset="utf-8">
  var editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome',
    buttons: [
      'bold',
      'italic',
      'table'
    ],
    extensions: {
      'table': new MediumEditorTable()
    }
  });
  </script>
</body>
</html>
```

## Initialization options

* __rows__: maximum number of rows. Default: 10.
* __columns__: maximum number of columns. Default: 10.

### Example

```javascript
...
    extensions: {
      'table': new MediumEditorTable({
        rows: 40,
        columns: 40
      })
    }
...
```

## Development

Clone the repository and:

```
npm install
grunt
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Test your changes to the best of your ability
4. Update the documentation to reflect your changes if they add or changes current functionality
5. Commit your changes (`git commit -am 'Added some feature'`)
6. Push to the branch (`git push origin my-new-feature`)
7. Create new Pull Request

or

1. Just pull request all the things the way you want!


## Demo

Clone the repository and:

```
bower install
open demo/index.html
```

## License

MIT: https://github.com/daviferreira/medium-editor-tables/blob/master/LICENSE
