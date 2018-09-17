// wrapper class for three-bmfont-text-bundle.js

// https://developers.google.com/web/showcase/2017/within

var TextBitmap = function( config ) {

	THREE.Group.call( this );

	this.config = config;
	config.color = config.color || '#fff';
	config.outlineColor = config.outlineColor || '#000';

	config.font = TextBitmap.fonts[ config.fontKey ].json;
	config.texture = TextBitmap.fonts[ config.fontKey ].texture;

	config.width = config.width || undefined; // Leave as undefined to remove word-wrapping
	config.align = config.align || 'left';
	config.valign = config.valign || 'center';
	config.lineHeight = config.lineHeight || config.font.common.lineHeight;
	config.letterSpacing = config.letterSpacing || 0;

	// https://github.com/Jam3/three-bmfont-text
	// defined in // three-bmfont-text-bundle.js
	var geometry = this.geometry = createGeometry( config );

	var material = this.material = new THREE.ShaderMaterial({
		uniforms: THREE.UniformsUtils.clone( SDFShader.uniforms ),
		fragmentShader: SDFShader.fragmentShader,
		vertexShader: SDFShader.vertexShader,
		side: THREE.DoubleSide,
		transparent: true,
		depthTest: false
	});

	material.uniforms.map.value = config.texture;
	if (config.color) material.uniforms.color.value.setStyle( config.color );
	if (config.outlineColor) material.uniforms.outlineColor.value.setStyle( config.outlineColor );

	var mesh = this.mesh = new THREE.Mesh( geometry, material );

	mesh.renderOrder = 1;

	mesh.rotation.x = Math.PI;

	var boxGeo = new THREE.BoxGeometry(1,1,1);
	var boxMat = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		transparent: true,
		opacity: config.showHitBox ? 1 : 0,
		wireframe: true
	});
	var hitBox = this.hitBox = new THREE.Mesh( boxGeo, boxMat );
	hitBox.mesh = mesh;

	this.update();

	config.scale = config.scale || 0.0004;
	this.scale.setScalar( config.scale );

	this.add( mesh );
	this.add( hitBox );

}

TextBitmap.prototype = Object.create( THREE.Group.prototype );
TextBitmap.prototype.constructor = TextBitmap;

TextBitmap.prototype.update = function(){

	var geometry = this.geometry;
	var mesh = this.mesh;

	geometry.update( this.config );

	// centering
	// todo: add config option for valign center or top (or bottom?)
	geometry.computeBoundingBox();

	this.hitBox.scale.set( geometry.layout.width, geometry.layout.height, 1 );

	// center horizontally
	mesh.position.x = - geometry.layout.width / 2;

	switch ( this.config.valign ) {
		case 'top':
			mesh.position.y = - ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
			this.hitBox.position.y = - geometry.layout.height / 2;
			break;
		case 'bottom':
			mesh.position.y = 0;
			this.hitBox.position.y = geometry.layout.height / 2;
			break;
		case 'center':
		default:
			mesh.position.y = - ( geometry.boundingBox.max.y - geometry.boundingBox.min.y ) / 2;
			this.hitBox.position.y = 0;
	}

	// for html-like flow / positioning
	this.height = geometry.layout.height * this.config.scale;
}

Object.defineProperty(TextBitmap.prototype, 'text', {

	get: function() {
		return this.config.text;
	},

	set: function(s) {

		this.config.text = s;
		this.update();

		return this;

	}

});

// array of objects of all the bitmap fonts loaded through TextBitmap.load
// access font assets (json and texture) with the same fontKey after loading
// this way you can reuse fonts without reloading their two assets
// and you can set fonts with a single property, rather than two
TextBitmap.fonts = [];

TextBitmap.fileLoader = new THREE.FileLoader();
TextBitmap.textureLoader = new THREE.TextureLoader();
TextBitmap.textureLoader.crossOrigin = 'anonymous';

TextBitmap.load = function( fontKey, jsonPath, imagePath ){

	TextBitmap.fonts[ fontKey ] = TextBitmap.fonts[ fontKey ] || {};

	TextBitmap.fileLoader.load( jsonPath, function( response ){
		var json = JSON.parse( response );
		TextBitmap.fonts[ fontKey ].json = json;
	});

	var texture = TextBitmap.textureLoader.load( imagePath, function(){
		texture.needsUpdate = true;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.generateMipmaps = true;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	});

	TextBitmap.fonts[ fontKey ].texture = texture;

};
