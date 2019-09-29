ui-text-controller
===

A simple JavaScript utility for conditionally joining UITextController together.

## Installation:

```sh
$ npm install ui-text-controller --save
```

## Usage

Load this module through the Import command
```js
import UITextController from "ui-text-controller"
```

Create an instance of controller by calling `new UITextController`.

```js
    var controller = new UITextController({
        div: '#frame',
        onSelectionChange: selection => {
          console.log(selection.toString());
        }
    })
```

Pass an object literal with the following options:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| div | HTMLElement, String | none | The element where the text select event is observed. Normally that's the only text container |
| startBtnClassName | String | null | User can customize the start button style name |
| endBtnClassName | String | null | User can customize the end button style name |
| textBgColor | String | 'rgba(51,143,255,0.5)' | User can customize the text to select the color |
| holdDelay | Number | 800 | delay time when the user is pressed on the screen |
| autoInit | Boolean | true | Does it default to initialize |
| onSelectionChange() | function | null | Custom event when the finger selection changed |
| onClear() | function | null | when user selected, Then we can clear the controller |
| onSelectStart() | function | null | Start selecting the function to execute |
| onSelect() | function | null | The function executed in the selection |
| onSelectEnd() | function | null | Function at the top of the choice after completion of the selection |


## Methods
* `init()` - The initialization function after the plug-in is loaded.

* `destroy()` - Destruction function when UITextController is not needed.

* `update()` - Refresh the data when the content data is changed or the window is rotated,[hot tip]When the data contains pictures, such as images that affect the computing position, it is necessary to perform the action after the image is loaded.

* `clear()` - Events that need to be hidden when the user has other operations that need to be hidden the 'UITextController'.

## Demo

![qrdoe](https://raw.githubusercontent.com/lqblovezh/ui-text-controller/master/screenshots/1.0.0.png)