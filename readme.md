# SDF Bitmap Text

Three.js Bitmap Font / Signed Distance Field Text / One Quad Per Character

[View Example](http://davidscottlyons.com/text-sdf-bitmap/)

## Wrapper and instructions for mattdesl's npm module

[https://www.npmjs.com/package/three-bmfont-text](https://www.npmjs.com/package/three-bmfont-text)

[https://developers.google.com/web/showcase/2017/within](https://developers.google.com/web/showcase/2017/within)

### 1. Create the bitmap font (png + json)

#### Save .fnt/.png
```
cd fonts/hiero
java -jar runnable-hiero.jar
```

#### convert .fnt to .json
install from package.json:
```
cd ../../
npm install
```
or
```
npm install load-bmfont --save-dev
```
then
```
node load-bmfont.js
```

### 2. Browserify three-bmfont-text

http://browserify.org/

```
browserify three-bmfont-text.js -o three-bmfont-text-bundle.js
```

### 3. Include bundle, shader, and wrapper

```
<script src="three-bmfont-text-bundle.js"></script>
<script src="sdf-shader.js"></script>
<script src="text-bitmap.js"></script>
```

### 4. Usage

```
var robotoBoldKey = 'roboto-bold';
var fileName = './fonts/roboto/bitmap/' + robotoBoldKey;
var jsonPath = fileName + '.json';
var texturePath = fileName + '.png';

// after the assets load, you can pass the font key to TextBitmap constructor
TextBitmap.load( robotoBoldKey, jsonPath, texturePath );

THREE.DefaultLoadingManager.onLoad = function ( ) {

  var bmtext = new TextBitmap({
    text: 'Grumpy wizards make toxic brew for the evil Queen and Jack.',
    fontKey: robotoBoldKey,
    width: 1000,
    align: 'center',
    valign: 'center',
    lineHeight: 80,
    letterSpacing: 1,
    scale: 0.0004,
    color: '#fff',
    outlineColor: '#000'
  });

  // TextBitmap inherits THREE.Group
  // so you can add instances to the scene
  // and position, scale or rotate them

  scene.add( bmtext );
  bmtext.position.set( 0, 1, -0.5 );

  // you can also change the text by setting the text property
  bmtext.text = 'The quick brown fox jumps over the lazy dog.';

};
```

To update text:

`bmtext.text = 'new string'`
