function Interaction ( renderer, camera ) {

	var scope = this;
	var touching = false;
	var bubbling = true;

	THREE.Group.call( this );

	this.renderer = renderer;
	this.camera = camera;

	this.enabled = true;

	this.mouse = new THREE.Vector2().copy( Interaction.Offscreen );
	this.mouse.uuid = 'mouse';

	this.mouse.start = new THREE.Vector2().copy( Interaction.Offscreen );
	this.mouse.subStart = new THREE.Vector2().copy( Interaction.Offscreen );
	this.mouse.dragThreshold = 10;
	this.mouse.isDown = false;
	this.mouse.moved = false;

	this.mouse.normalized = new THREE.Vector2().copy( Interaction.Offscreen );

	this.searchables = [];
	this.intersections = {};
	this.controllers = { mouse: this.mouse };
	this.raycaster = new THREE.Raycaster();

	function preventDefault () {
		bubbling = false;
	}

	function setMouse( x, y ) {

		var mouse = scope.mouse;
		var rect = renderer.domElement.getBoundingClientRect();

		// raw values
		mouse.set( x, y );

		// -1 to 1
		mouse.normalized.x = ( x - rect.left ) / rect.width * 2 - 1;
		mouse.normalized.y = ( y - rect.top ) / rect.height * -2 + 1;

		if ( mouse.isDown ) {
			mouse.subStart.subVectors( mouse, mouse.start );
			mouse.pixelsDragged = mouse.subStart.length();

			if ( mouse.pixelsDragged > mouse.dragThreshold ) {
				mouse.moved = true;
			}
		}

	}

	this.mousedown = function ( event ) {

		if ( !scope.enabled ) {
			return;
		}

		var mouse = scope.mouse;
		var item = scope.intersections.mouse;

		setMouse( event.clientX, event.clientY );
		mouse.start.copy( mouse );
		mouse.isDown = true;

		if ( item ) {
			item.object.dispatchEvent( {
				type: 'primary-down',
				controller: mouse,
				preventDefault: preventDefault
			} );
		}

		if ( bubbling ) {
			scope.dispatchEvent( {
			  type: 'primary-down',
			  controller: mouse
			} );
		}

		bubbling = true;

		return;

	};

	this.touchstart = function ( event ) {

		if ( !scope.enabled ) {
			return;
		}

		var mouse = scope.mouse;
		var touch = event.touches[ 0 ];

		mouse.isTouch = true;
		touching = true;
		event.preventDefault();

		if ( touch ) {

			setMouse( touch.clientX, touch.clientY );
			mouse.start.copy( mouse );
			mouse.isDown = true;

		}

		scope.update();

		var item = scope.intersections.mouse;

		if ( item ) {
			item.object.dispatchEvent( {
				type: 'primary-down',
				controller: mouse,
				isTouch: true,
				preventDefault: preventDefault
			} );
		}

		if ( bubbling ) {
			scope.dispatchEvent( {
				type: 'primary-down',
				controller: mouse,
				isTouch: true
			} );
		}

		bubbling = true;

		return;

	};

	this.mousemove = function ( event ) {

		setMouse( event.clientX, event.clientY );

		return;

	};

	this.touchmove = function ( event ) {

		var touch = event.touches[ 0 ];

		if ( touching && touch ) {

			setMouse( touch.clientX, touch.clientY );

		}

		return;

	};

	this.mouseup = function ( event ) {

		if ( !scope.enabled ) {
			return;
		}

		var mouse = scope.mouse;
		var item = scope.intersections.mouse;

		mouse.isDown = false;

		if ( item ) {
			item.object.dispatchEvent( {
				type: 'primary-up',
				controller: mouse,
				preventDefault: preventDefault
			} );
		}

		if ( bubbling ) {
			scope.dispatchEvent( {
				type: 'primary-up',
				controller: mouse
			} );
		}

		bubbling = true;
		mouse.moved = false;

		return;

	};

	this.touchend = function ( event ) {

		if ( !scope.enabled ) {
			return;
		}

		var mouse = scope.mouse;
		var item = scope.intersections.mouse;

		var touch = event.touches[ 0 ];

		mouse.isDown = false;
		mouse.isTouch = false;
		touching = false;
		event.preventDefault();

		if ( touch ) {

			setMouse( touch.clientX, touch.clientY );

		}

		if ( item ) {
			item.object.dispatchEvent( {
				type: 'primary-up',
				controller: mouse,
				isTouch: true,
				preventDefault: preventDefault
			} );
		}

		if ( bubbling ) {
			scope.dispatchEvent( {
				type: 'primary-up',
				controller: mouse,
				isTouch: true
			} );
		}

		bubbling = true;
		mouse.moved = false;

		mouse.copy( Interaction.Offscreen );

		return;

	};

	this.connectController = function ( event ) {

		var controller = event.detail;
		scope.add( controller );

		var matrix = renderer.effect ? renderer.effect.getStandingMatrix() : renderer.vr.getStandingMatrix();
		controller.standingMatrix = matrix;
		scope.controllers[ controller.uuid ] = controller;

		var laser = Interaction.Laser.clone();
		var laserParent = controller.userData.pointPose || controller;
		laserParent.add( laser );
		controller.userData.laser = laser;

		function primaryPressBegan () {

			if ( !scope.enabled ) {
				return;
			}

			var item = scope.intersections[ controller.uuid ];

			if ( item ) {
				item.object.dispatchEvent( {
					type: 'primary-down',
					controller: controller,
					preventDefault: preventDefault
			  	} );
			}

			if ( bubbling ) {
				scope.dispatchEvent( {
				  type: 'primary-down',
				  controller: controller
				} );
			}

			bubbling = true;

		}

		function primaryPressEnded () {

			if ( !scope.enabled ) {
				return;
			}

			var item = scope.intersections[ controller.uuid ];

			if ( item ) {
				item.object.dispatchEvent( {
					type: 'primary-up',
					controller: controller,
					preventDefault: preventDefault
				} );
			}

			if ( bubbling ) {
				scope.dispatchEvent( {
				  type: 'primary-up',
				  controller: controller
				} );
			}

			bubbling = true;

		}

		function primaryTouchBegan () {

			if ( !scope.enabled ) {
				return;
			}

			var item = scope.intersections[ controller.uuid ];

			if ( item ) {
				item.object.dispatchEvent( {
					type: 'primary-touchstart',
					controller: controller,
					preventDefault: preventDefault
			  	} );
			}

			if ( bubbling ) {
				scope.dispatchEvent( {
				  type: 'primary-touchstart',
				  controller: controller
				} );
			}

			bubbling = true;

		}

		function primaryTouchEnded () {

			if ( !scope.enabled ) {
				return;
			}

			var item = scope.intersections[ controller.uuid ];

			if ( item ) {
				item.object.dispatchEvent( {
					type: 'primary-touchend',
					controller: controller,
					preventDefault: preventDefault
			  	} );
			}

			if ( bubbling ) {
				scope.dispatchEvent( {
				  type: 'primary-touchend',
				  controller: controller
				} );
			}

			bubbling = true;

		}

		controller.addEventListener( 'primary press began', primaryPressBegan );
		controller.addEventListener( 'primary press ended', primaryPressEnded );

		controller.addEventListener( 'primary touch began', primaryTouchBegan );
		controller.addEventListener( 'primary touch ended', primaryTouchEnded );

		controller.addEventListener( 'disconnected', function ( event ) {

			if ( controller.parent ) {
				controller.parent.remove( controller );
			}

			controller.removeEventListener( 'primary press began', primaryPressBegan );
			controller.removeEventListener( 'primary press ended', primaryPressEnded );

			controller.removeEventListener( 'primary touch began', primaryTouchBegan );
			controller.removeEventListener( 'primary touch ended', primaryTouchEnded );

			delete scope.controllers[ controller.uuid ];
			delete scope.intersections[ controller.uuid ];

		} );

	}

}

Interaction.prototype = Object.create( THREE.Group.prototype );
Interaction.prototype.constructor = Interaction;

Interaction.Laser = new THREE.Mesh(
	new THREE.CylinderBufferGeometry( 0.001, 0.001, 1, 8, 1, true ),
	new THREE.MeshBasicMaterial({ color: 0x0c89c4 })
);
Interaction.Laser.geometry.translate( 0, 0.5, 0 );
Interaction.Laser.rotation.x = - Math.PI / 2;
Interaction.Laser.scale.y = 6;

Interaction.Offscreen = new THREE.Vector2( - 10, - 10 );
Interaction.ZeroZero = new THREE.Vector2( 0, 0 );

Interaction.prototype.update = function() {

	var renderer = this.renderer;
	var list = this.searchables;
	var raycaster = this.raycaster;
	var mouse = this.mouse;
	var camera = this.camera;

	if ( list.length <= 0 || !this.enabled ) {
		return;
	}

	if ( renderer.vr.isPresenting() && THREE.VRController.controllers.length > 0 ) {

		for ( var i = 0; i < THREE.VRController.controllers.length; i++ ) {

			var controller = THREE.VRController.controllers[ i ];

			if ( !controller ) {
				continue;
			}

			if ( controller.dof >= 3 && controller.visible ) {

				var laserParent = controller.userData.pointPose || controller;

				raycaster.ray.origin.setFromMatrixPosition( laserParent.matrixWorld );
				raycaster.ray.direction.set( 0, 0, - 1 )
					.transformDirection( laserParent.matrixWorld );

			} else if ( has.mobile ) {

				raycaster.setFromCamera( Interaction.ZeroZero, camera );

			}

			var intersects = raycaster.intersectObjects( list );

			if ( !!intersects[ 0 ] ) {

				if ( !this.intersections[ controller.uuid ] || this.intersections[ controller.uuid ].object !== intersects[ 0 ].object ) {

					// Update the intersection object and trigger `out` and `over`
					// events if available.

					if ( this.intersections[ controller.uuid ] ) {
						this.intersections[ controller.uuid ].object.dispatchEvent( {
							type: 'out',
							controller: controller
						} );
						controller.userData.laser.scale.y = Interaction.Laser.scale.y;
					}

					this.intersections[ controller.uuid ] = intersects[ 0 ];
					this.intersections[ controller.uuid ].object.dispatchEvent( {
						type: 'over',
						controller: controller
					} );
					controller.userData.laser.scale.y = intersects[0].distance;

				} else {

					// Update the intersection point position,
					// even though the object hasn't changed.

					this.intersections[ controller.uuid ] = intersects[ 0 ];

				}

			} else {

				// Remove intersection object

				if ( this.intersections[ controller.uuid ] ) {
					this.intersections[ controller.uuid ].object.dispatchEvent( {
						type: 'out',
						controller: controller
					} );
					controller.userData.laser.scale.y = Interaction.Laser.scale.y;
				}

				this.intersections[ controller.uuid ] = null;

			}

		}

	} else {

		// No controllers available / connected

		raycaster.setFromCamera( mouse.normalized, camera );

		var intersects = raycaster.intersectObjects( list );

		if ( !!intersects[ 0 ] ) {

			if ( !this.intersections.mouse || this.intersections.mouse.object !== intersects[ 0 ].object ) {

				// Update the intersection object and trigger `out` and `over`
				// events if available.

				if ( this.intersections.mouse ) {
					this.intersections.mouse.object.dispatchEvent( {
						type: 'out',
						controller: mouse
					} );
				}

				this.intersections.mouse = intersects[ 0 ];
				this.intersections.mouse.object.dispatchEvent( {
					type: 'over',
					controller: mouse
				} );

			} else {

				// Update the intersection point position,
				// even though the object hasn't changed.

				this.intersections.mouse = intersects[ 0 ];

			}

			renderer.domElement.style.cursor = 'pointer';

		} else {

			// Remove intersection object

			if ( this.intersections.mouse ) {
				this.intersections.mouse.object.dispatchEvent( {
					type: 'out',
					controller: mouse
				} );
			}

			this.intersections.mouse = null;
			renderer.domElement.style.cursor = 'default';

		}

	}

};

Interaction.prototype.listen = function ( obj ) {
	var list = this.searchables;
	var index = list.indexOf( obj );
	if ( index >= 0 ) {
		return;
	}
	list.push( obj );
	return this;
};

Interaction.prototype.ignore = function ( obj ) {
	var list = this.searchables;
	var renderer = this.renderer;
	var index = list.indexOf( obj );
	// Reset cursor style
	renderer.domElement.style.cursor = 'default';
	if ( index < 0 ) {
		return;
	}
	list.splice( index, 1 );
	return this;
};

Interaction.prototype.connect = function() {

	var renderer = this.renderer;
	this.camera.parent.add( this );

	window.addEventListener( 'vr controller connected', this.connectController );

	renderer.domElement.addEventListener( 'mousedown', this.mousedown, false );
	renderer.domElement.addEventListener( 'mousemove', this.mousemove, false );
	renderer.domElement.addEventListener( 'mouseup', this.mouseup, false );

	renderer.domElement.addEventListener( 'touchstart', this.touchstart, false );
	renderer.domElement.addEventListener( 'touchmove', this.touchmove, false );
	renderer.domElement.addEventListener( 'touchend', this.touchend, false );
	renderer.domElement.addEventListener( 'touchcancel', this.touchend, false );

	return this;

};

Interaction.prototype.disconnect = function() {

	var renderer = this.renderer;
	this.parent.remove( this );

	window.removeEventListener( 'vr controller connected', this.connectController );

	renderer.domElement.removeEventListener( 'mousedown', this.mousedown, false );
	renderer.domElement.removeEventListener( 'mousemove', this.mousemove, false );
	renderer.domElement.removeEventListener( 'mouseup', this.mouseup, false );

	renderer.domElement.removeEventListener( 'touchstart', this.touchstart, false );
	renderer.domElement.removeEventListener( 'touchmove', this.touchmove, false );
	renderer.domElement.removeEventListener( 'touchend', this.touchend, false );
	renderer.domElement.removeEventListener( 'touchcancel', this.touchend, false );

	return this;

};

Interaction.prototype.reset = function() {

	for ( var cid in this.intersections ) {

		var intersection = this.intersections[ cid ];

		if ( intersection ) {
			intersection.object.dispatchEvent( {
				type: 'out',
				controller: this.controllers[ cid ]
			} );
		}

		this.intersections[ cid ] = null;

	}
	return this;

};
