
var camera, scene, renderer;
var geometry, material, mesh;
var target = new THREE.Vector3();

var lon = 90, lat = 0;
var phi = 0, theta = 0;

var touchX, touchY;

init();
initDevices();
animate();

function init() {
  // 创建容器
  scene = new THREE.Scene();
  // 创建相机
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    var sides = [
        {
            position: [ -512, 0, 0 ],//位置
            rotation: [ 0, Math.PI / 2, 0 ]//角度
        },
        {
            position: [ 512, 0, 0 ],
            rotation: [ 0, -Math.PI / 2, 0 ]
        },
        {
            position: [ 0,  512, 0 ],
            rotation: [ Math.PI / 2, 0, Math.PI ]
        },
        {
            position: [ 0, -512, 0 ],
            rotation: [ - Math.PI / 2, 0, Math.PI ]
        },
        {
            position: [ 0, 0,  512 ],
            rotation: [ 0, Math.PI, 0 ]
        },
        {
            position: [ 0, 0, -512 ],
            rotation: [ 0, 0, 0 ]
        }
    ];

    /**
     * 根据六个面的信息，new出六个对象放入场景中
     */
    for ( var i = 0; i < sides.length; i ++ ) {

        var side = sides[ i ];

        var element = document.getElementById("surface_"+i);
        element.width = 1026; // 2 pixels extra to close the gap.多余的2像素用于闭合正方体
        element.height = 1026;
        // 添加一个渲染器
        var object = new THREE.CSS3DObject( element );
        object.position.fromArray( side.position );
        object.rotation.fromArray( side.rotation );
        scene.add( object );

    }
    // 定义渲染器以及渲染器的尺寸，并把渲染器加到页面的DOM中
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );

    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    window.addEventListener( 'resize', onWindowResize, false );

}
// 实时渲染函数
function animate() {
  requestAnimationFrame( animate );
  // lat +=  0.1;
  // 限制固定角度内旋转
  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = THREE.Math.degToRad( 90 - lat );
  theta = THREE.Math.degToRad( lon );

  target.x = Math.sin( phi ) * Math.cos( theta );
  target.y = Math.cos( phi );
  target.z = Math.sin( phi ) * Math.sin( theta );

  camera.lookAt( target );
  camera.updateProjectionMatrix();
  // isDeviceing == false ? initMouseControl() : deviceControl.update();
  deviceControl.update();
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
// 窗口改变时对Camera焦点的处理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
/*
相机焦点跟着鼠标或手指的操作移动
 */
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
/**
 * 鼠标滚轮改变相机焦距
 */
function onDocumentMouseWheel( event ) {
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

function onDocumentTouchStart( event ) {
  event.preventDefault();
  var touch = event.touches[ 0 ];
  touchX = touch.screenX;
  touchY = touch.screenY;
}

function onDocumentTouchMove( event ) {
  event.preventDefault();
  var touch = event.touches[ 0 ];
  lon -= ( touch.screenX - touchX ) * 0.1;
  lat += ( touch.screenY - touchY ) * 0.1;
  touchX = touch.screenX;
  touchY = touch.screenY;
}
//绑定陀螺仪

// 控制陀螺仪开关的按钮样式
// var controlsBtn= document.getElementById("controlBtn");
// var isDeviceing = false; // 陀螺仪状态
// controlsBtn.addEventListener("touchend", controlDevice, true);
// isDeviceing == true ? $("#controlBtn").addClass("controlIconae") : $("#controlBtn").addClass("controlIcon");

// 初始化陀螺仪
function initDevices() {
  deviceControl = new THREE.DeviceOrientationControls(camera);
}
/* 控制陀螺仪 */
// function controlDevice(event) {
//   if (isDeviceing == true) {
//     isDeviceing = false;
//     //关闭陀螺仪
//     $("#controlBtn").removeClass("controlIcon").addClass("controlIconae");
//   } else {
//     isDeviceing = true;
//     //开启陀螺仪
//     $("#controlBtn").removeClass("controlIconae").addClass("controlIcon");
//   }
// }
