# MediumEditor Tables

[![Build Status](https://travis-ci.org/daviferreira/medium-editor-tables.svg)](https://travis-ci.org/daviferreira/medium-editor-tables)

MediumEditor Tables is an extension to add a table button/behavior to [MediumEditor](https://github.com/daviferreira/medium-editor).

--

![meditor-tables mp4](https://cloud.githubusercontent.com/assets/38787/6200245/5528756c-b46f-11e4-9d52-fdd7b8dbc864.gif)

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

"THE BEER-WARE LICENSE" (Revision 42):

As long as you retain this notice you can do whatever you want with this stuff. If we meet some day, and you think this stuff is worth it, you can buy me a beer in return.