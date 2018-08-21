// wrapper class for three-bmfont-text-bundle.js

// https://developers.google.com/web/showcase/2017/within

var TextBitmap = function( config ) {

	THREE.Group.call( this );

	this.config = config;
	config.color = config.color || '#fff';
	config.outlineColor = config.outlineColor || '#000';

	var geometry = this.geometry = createGeometry( config ); // text-bm-font

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

	var scale = config.scale || 1;
	this.scale.setScalar( scale );

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
