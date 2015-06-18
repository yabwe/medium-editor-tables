# MediumEditor Tables

[![NPM info](https://nodei.co/npm/medium-editor-tables.png?downloads=true)](https://nodei.co/npm/medium-editor-tables.png?downloads=true)

[![Travis build status](https://travis-ci.org/yabwe/medium-editor-tables.png?branch=master)](https://travis-ci.org/yabwe/medium-editor-tables)
[![dependencies](https://david-dm.org/yabwe/medium-editor-tables.png)](https://david-dm.org/yabwe/medium-editor-tables)
[![devDependency Status](https://david-dm.org/yabwe/medium-editor-tables/dev-status.png)](https://david-dm.org/yabwe/medium-editor-tables#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/yabwe/medium-editor-tables/badge.svg)](https://coveralls.io/r/yabwe/medium-editor-tables)

MediumEditor Tables is an extension to add a table button/behavior to [MediumEditor](https://github.com/yabwe/medium-editor).

Demo: [http://yabwe.github.io/medium-editor-tables/](http://yabwe.github.io/medium-editor-tables/)

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
    toolbar: {
      buttons: [
        'bold',
        'italic',
        'table'
      ]
    },
    extensions: {
      table: new MediumEditorTable()
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

## Demo

Clone the repository and:

```
bower install
open demo/index.html
```

## License

MIT: https://github.com/yabwe/medium-editor-tables/blob/master/LICENSE
