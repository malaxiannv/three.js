/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function ( object, controls ) {

    var scope = this;

    this.controls = controls;

    this.object = object;

    this.object.rotation.reorder( "YXZ" );

    this.freeze = true;

    this.deviceOrientation = {};

    this.screenOrientation = -90;

    var onDeviceOrientationChangeEvent = function ( event ) {
        scope.deviceOrientation = event;
    };

    var onScreenOrientationChangeEvent = function () {
        console.log(scope.screenOrientation);
        scope.screenOrientation = window.orientation || 0;

    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    var setObjectQuaternion = function () {

        var zee = new THREE.Vector3( 0, 0, 1 );

        var euler = new THREE.Euler();

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

        return function ( quaternion, alpha, beta, gamma, orient ) {

            euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

            quaternion.setFromEuler( euler );                               // orient the device

            quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

            quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

        }

    }();


    this.setObjectQuaternionX = function (quaternion, alpha, beta, gamma, orient) {

        var zee = new THREE.Vector3( 0, 0, 1 );

        var euler = new THREE.Euler();

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

        euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

        quaternion.setFromEuler( euler );                               // orient the device

        quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

        quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

        return quaternion;

    };

    this.connect = function() {

        scope.screenOrientation = 90;

        window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
        window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

        scope.freeze = false;

    };

    this.disconnect = function() {

        scope.freeze = true;

        window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
        window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    };

    this.update = function () {

        if ( scope.freeze ) return;

        var alpha  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 0; // Z
        var beta   = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta  ) : 0; // X'
        var gamma  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
        var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O
        scope.object.quaternion = scope.setObjectQuaternionX( scope.object.quaternion, alpha, beta, gamma, orient );	scope.object.setRotationFromQuaternion(scope.object.quaternion);
    };

};