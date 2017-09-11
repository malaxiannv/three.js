<!DOCTYPE html>
<html>
  <head>
    <title>sphere panorama</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <style>
      body {
        background-color: #FFF;
        margin: 0px;
        padding: 0px;
        overflow:hidden;
        box-sizing: border-box;
      }
      #container {
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        overflow-y: hidden;
      }
      #info {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: #ffffff;
        font-family:Monospace;
        font-size:13px;
        box-sizing: border-box;
        height: 250px;
        background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
      }
      .content {
        position: absolute;
        bottom: 20px;
        width: 100%;
        padding: 15px;
        box-sizing: border-box;
      }
      .user {
        line-height: 39px;
        height: 35px;
        box-sizing: border-box;
        margin-bottom: -4px;
      }
      #pic {
        width: 35px;
        height: 35px;
        border-radius:50%;
        box-sizing: border-box;
      }
      #source {
        position: absolute;
        display: inline-block;
        margin-left: 5px;
        box-sizing: border-box;
      }
      #name {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: -4px;
      }
      #btn {
        display: block;
        width: 250px;
        height: 40px;
        line-height: 40px;
        background: #0097ff;
        text-align: center;
        margin: 0 auto;
        border-radius: 20px;
        color: #FFF;
        text-decoration: none;

      }
      #discription {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-bottom: 22px;
      }
    </style>
  </head>
  <body>
    <script src="../../activities/panorama/js/three.js"></script>
    <script src="../../activities/panorama/js/DeviceOrientationControls1.js"></script>
    <script>
      {/* 进入页面的第一件事情:检测当前的浏览器是pc端还是移动端 */}
      var isMobile
      if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
        //是移动端设备
        isMobile = true;
      } else {
        // pc端设备
        isMobile = false;
      }
      {/* 渲染全景图 */}
      var camera, scene, renderer;
      onMouseDownMouseX = 0, onMouseDownMouseY = 0,
      lon = 0, onMouseDownLon = 0,
      lat = 0, onMouseDownLat = 0,
      phi = 0, theta = 0;
      var touchX, touchY;

      init();
      animate();

      function init() {
        var container, mesh;
        container = document.getElementById( 'container' );
        // 创建相机
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
        camera.target = new THREE.Vector3( 1, 1, 1 );
        // 创建场景
        scene = new THREE.Scene();
        // 创建球状背景，半径是500
        var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale( - 1, 1, 1 );
        // 创建材质
        var texture = new THREE.TextureLoader().load('全景图的URL');
        var material = new THREE.MeshBasicMaterial({map: texture});
        // 把照片贴到球体模型上
        mesh = new THREE.Mesh( geometry, material );
        // 把模型加入场景中
        scene.add( mesh );
        // 创建渲染器
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        // 初始化手势或者鼠标事件
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'wheel', onDocumentMouseWheel, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        document.addEventListener( 'drop', function (event) {
          event.preventDefault();
          var reader = new FileReader();
          reader.addEventListener( 'load', function (event) {
            material.map.image.src = event.target.result;
            material.map.needsUpdate = true;
          }, false );
          reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
          document.body.style.opacity = 1;
        }, false );
        window.addEventListener( 'resize', onWindowResize, false );
        // 初始化陀螺仪
        if (isMobile) {
          initDevices();
        }
      }
      // 初始化陀螺仪
      function initDevices() {
        deviceControl = new THREE.DeviceOrientationControls(camera);
      }
      // PC端事件定义
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      function onDocumentMouseDown( event ) {
        event.preventDefault();
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
      }
      function onDocumentMouseMove( event ) {
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        lon -= movementX * 0.1;
        lat += movementY * 0.1;
      }
      function onDocumentMouseUp( event ) {
        document.removeEventListener( 'mousemove', onDocumentMouseMove );
        document.removeEventListener( 'mouseup', onDocumentMouseUp );
      }
      function onDocumentMouseWheel( event ) {
        var fov = camera.fov + event.deltaY * 0.05;
        camera.fov = THREE.Math.clamp( fov, 10, 75 );
        camera.updateProjectionMatrix();
      }

      // 移动手势
      function onDocumentTouchStart( event ) {
        var touch = event.touches[ 0 ];
        touchX = touch.screenX;
        touchY = touch.screenY;
      }
      function onDocumentTouchMove( event ) {
        event.preventDefault();
        var touch = event.touches[ 0 ];
        // lon lat就是手势滑动平移的距离
        lon += ( touch.screenX - touchX ) * 0.005;
        lat += ( touch.screenY - touchY ) * 0.005;
        touchX = touch.screenX;
        touchY = touch.screenY;
      }

      // 实时渲染函数
      function animate() {
        requestAnimationFrame( animate );
        // 限制固定角度内旋转
        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );
        camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        camera.target.y = 500 * Math.cos( phi );
        camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
        camera.lookAt( camera.target );
        camera.updateProjectionMatrix();

        // 传入参数，计算手动滑过的距离
        if (isMobile) {
          deviceControl.updateAlphaOffsetAngle(lon, lat);
        }
        /**
        * 通过传入的scene和camera
        * 获取其中object在创建时候传入的element信息
        * 以及后面定义的包括位置，角度等信息
        * 根据场景中的obj创建dom元素
        * 插入render本身自己创建的场景div中
        * 达到渲染场景的效果
        */
        renderer.render( scene, camera );
      }
    </script>
  </body>
</html>
