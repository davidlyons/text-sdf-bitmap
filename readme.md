# SDF Bitmap Text

Three.js Bitmap Font / Signed Distance Field Text / One Quad Per Character

## Wrapper and instructions for mattdesl's npm module

[https://www.npmjs.com/package/three-bmfont-text](https://www.npmjs.com/package/three-bmfont-text)

[https://developers.google.com/web/showcase/2017/within](https://developers.google.com/web/showcase/2017/within)

### Create the bitmap font (png + json)

cd fonts/hiero
java -jar runnable-hiero.jar
save .fnt/.png

cd ../../
npm install (from package.json)
or
npm install load-bmfont --save-dev
node load-bmfont.js (to convert .fnt to .json)

### Browserify three-bmfont-text

http://browserify.org/

browserify three-bmfont-text.js -o three-bmfont-text-bundle.js

### Include bundle, shader, and wrapper

<script src="three-bmfont-text-bundle.js"></script>
<script src="sdf-shader.js"></script>
<script src="text-bitmap.js"></script>

### Usage

var bmtext = new TextBitmap({
  text: 'Grumpy wizards make toxic brew for the evil Queen and Jack.',
  font: font,
  texture: texture,
  width: 1000,
  align: 'center',
  valign: 'center',
  lineHeight: font.common.lineHeight - 20,
  letterSpacing: 1,
  scale: 0.0004,
  color: '#fff',
  outlineColor: '#000'
});

bmtext.position.set( 0, 1, -0.5 );
scene.add( bmtext );

To update text:

bmtext.text = 'new string'