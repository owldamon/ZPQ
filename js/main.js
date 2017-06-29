var table = new Array(60);

var camera, scene, renderer;
var controls;

var objects = [];
var targets = {
  table: [],
  sphere: [],
  helix: [],
  grid: [],
  textPixels: []
};
var imgJson = [];
var storage = window.localStorage;
var indexLocalstroge = 0;
var value = localStorage.getItem("val");
var deg = 0;
var posId = 0;
var N = 1;
var levelSelect = $('.levelSelect');
var lottoInfo = [];
var lottoList = [];
init();
animate();

function init() {
  var Id = 0;
  var logo = new Image();

  logo.id = 'logo';
  logo.src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1498545811157&di=9fd33dabbf59a7d6fdf9c5e4c29da019&imgtype=0&src=http%3A%2F%2Fi4.hexunimg.cn%2F2015-09-02%2F178804088.jpg";
  var LOGO = new THREE.CSS3DObject(logo);
  LOGO.position.x = 0;
  LOGO.position.y = 0;
  LOGO.position.z = 0;

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 2500;
  scene = new THREE.Scene();
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0;
  controls.minDistance = 3000;
  controls.maxDistance = 3000;
  controls.addEventListener('change', render);


  // 球形
  var vector = new THREE.Vector3();
  for (i = 0; i < table.length; i += 1) {
    var phi = Math.acos(-1 + (2 * i) / table.length);
    var theta = Math.sqrt(table.length * Math.PI) * phi;
    var element = document.createElement('div');
    element.className = 'element';
    element.style.backgroundImage = "";
    var object = new THREE.CSS3DObject(element);
    object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
    object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
    object.position.z = 800 * Math.cos(phi);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    scene.add(object);
    objects.push(object);
    targets.sphere.push(object);
  }
  scene.add(LOGO);

  var vector = new THREE.Vector3();
  for (i = 0; i < table.length; i += 1) {
    var phi = Math.acos(-1 + (2 * i) / table.length);
    var theta = Math.sqrt(table.length * Math.PI) * phi;
    var element = document.createElement('div');
    element.className = 'element';
    element.style.backgroundImage = "";
    var object = new THREE.CSS3DObject(element);
    object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
    object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
    object.position.z = 800 * Math.cos(phi);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    targets.table.push(object);
  }

  // 螺旋

  var vector = new THREE.Vector3();
  for (var i = 0, l = objects.length; i < l; i++) {
    var phi = i * 0.175 + Math.PI;
    var object = new THREE.Object3D();

    object.position.x = 1200 * Math.sin(phi);
    object.position.y = -(i * 8) + 250;
    object.position.z = 1200 * Math.cos(phi);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;
    object.lookAt(vector);
    targets.helix.push(object);
  }

  // 网格

  for (var i = 0; i < objects.length; i++) {
    var object = new THREE.Object3D();

    object.position.x = ((i % 4) * 400) - 600;
    object.position.y = (-(Math.floor(i / 4) % 5) * 400) + 800;
    object.position.z = (Math.floor(i / 20)) * 1000 - 800;
    targets.grid.push(object);
  };

  // 检查本地存储
  if (storage["img"] && storage["img"].length > 0) {
    imgJson = JSON.parse(storage["img"]);
    imgJson.length = imgJson.length > 60 ? 60 : imgJson.length;
    posId = imgJson.length - 1;
    Id = imgJson.length - 1;
    for (var i = 0; i < imgJson.length; i++) {
      objects[i].element.style.backgroundImage = "url(" + imgJson[i].img + ")";
    }
  }
  // 文字扫描
  // function createText(t) {
  //   var fontSize = 1920 / (t.length);
  //   if (fontSize > 180) fontSize = 600;
  //   text.text = t;
  //   text.font = fontSize + "px 'Source Sans Pro'";
  //   text.textAlign = 'center';
  //   text.x = 800;
  //   text.y = 0;
  //   textCanvas.addChild(text);
  //   textCanvas.update();
  //   var ctx = document.getElementById('text').getContext('2d');
  //   var pix = ctx.getImageData(0, 0, 1600, 800).data;
  //   var vector = new THREE.Vector3();
  //   for (var i = 0; i <= pix.length; i += 60) {
  //     var object = new THREE.Object3D();
  //     if (pix[i] != 0) {
  //       var x = (i / 4) % 1600;
  //       var y = Math.floor(Math.floor(i / 1600) / 4);
  //       if ((x && x % 8 == 0) && (y && y % 8 == 0)) {
  //         object.position.x = x - 800;
  //         object.position.y = -y + 600;
  //         object.position.z = 0;

  //         object.scale.x = 0.25;
  //         object.scale.y = 0.25;
  //         object.scale.z = 0.25;
  //         targets.textPixels.push(object)
  //       };
  //     }
  //   }
  // }
  // createText("Canbo");
  var autoTransform = [targets.table, targets.helix, targets.grid];
  var transTimerNum = 0;

  // 轮询
  var isLotto2;
  var isLotto1 = setInterval(function() {
    arrayAjax(Id);
    if (transTimerNum == 0 || transTimerNum % 4 == 0) {
      isLotto2 = setTimeout(function() {
        var index = Math.round(Math.random() * 2);
        transform(autoTransform[index], 2000);
      }, 15000);
    };
    transTimerNum++;
  }, 5000);

  // 按钮
  var randomN;
  $('#sphere').on('click', function() {
    clearInterval(isLotto1);
    if (!!isLotto2) { clearTimeout(isLotto2) };
    transform(targets.table, 2000);
    $.ajax({
      type: 'get',
      url: 'http://127.0.0.1:3000/users/lottoList',
      dataType: 'json',
      success: function(data){
        lottoList = data;
        for(var i = 0; i < lottoList.length; i++) {
          var li = document.createElement('li');
          li.innerText = lottoList[i].name;
          levelSelect.find('ul').append(li);
        }
      }
    })
  });
  $('#imgReset').on('click', function() {
    storage["img"] = '';
    window.location.href = window.location.href;
  });
  levelSelect.on('click', 'p', function() {
    var height = lottoList.length * 28
    levelSelect.find('ul').css('height', height + 'px');
  });
  levelSelect.on('click', 'li', function() {
    $('#pnum').val('');
    levelSelect.find('p').css('color', 'rgba(128, 255, 255, 0.75)');
    levelSelect.find('p').text($(this).text());
    levelSelect.find('ul').css('height', '0');
    var index = $(this).index();
    $('#pnum').on('input', function(){
      var nowVal = $(this).val();
      if(nowVal > lottoList[index].num) {
        $(this).val(lottoList[index].num)
      }
    });
  });
  
  $('#stop').on('click', function() {
    var isDis = true;
    if (!randomN) return;
    clearTimeout(randomN);
    randomN = null;
    N = 1;
    lottoInfo.forEach(function(i) {
      creatElement(i, isDis)
    })
  })
  $('#confirm').on('click', function() {
    if (!!randomN) clearTimeout(randomN);
    $('#lottoList').html('');
    var lottoLevel = levelSelect.find('p').text();
    var pNum = $('#pnum').val();
    if (lottoLevel == '请选择奖项') {
      levelSelect.find('p').css('color', '#F00');
      return;
    };
    if (pNum == '') {
      return;
    };
    randomN = setInterval(function() {
      N = N == 50 ? 1 : 50;
    }, 1000);

    $.ajax({
      type: 'post',
      url: 'http://127.0.0.1:3000/users/lottoUser',
      dataType: 'json',
      data: {
        lottoLevel: lottoLevel,
        pNum: pNum
      },
      success: function(data) {
        lottoInfo = data;
      },
      error: function(error) {
        $("#errorInfo").html('网络出现问题！');
      }
    })
  });
  $('#lottoList').on('click', 'span', function() {
    $(this).parent().fadeOut();
  })
  window.addEventListener('resize', onWindowResize, false);
}

function creatElement(data, isDis) {
  var element1 = document.createElement('div');
  element1.className = 'element1';
  var symbol = document.createElement('img');
  symbol.className = 'symbol';
  symbol.src = data.img;
  element1.appendChild(symbol);
  if (isDis) {
    var name = document.createElement('p');
    name.innerText = data.name;
    element1.appendChild(name);
    var Dspan = document.createElement('span');
    Dspan.innerText = 'X';
    element1.appendChild(Dspan);
    document.getElementById('lottoList').appendChild(element1);
    return;
  }
  var object = new THREE.CSS3DObject(element1);
  element1.style.left = getPosition(window.innerWidth / 2, 0, true) + 'px';
  element1.style.top = getPosition(window.innerHeight - 350, 0, true) + 'px';
  document.getElementById('container').appendChild(element1);
  elementAnimate(data, element1)
};

function elementAnimate(data, element) {
  var MartRadom = Math.floor(Math.random() * 60);
  setTimeout(function() {
    $('#container').find('.element1').css({
      'top': '30%',
      'left': '36%',
      'transform': 'scale(0)'
    });
    setTimeout(function() {
      document.getElementById('container').removeChild(element);
      if (posId < 59) {
        objects[posId].element.style.backgroundImage = "url(" + data.img + ")";
        posId++;
      } else if (posId >= 59) {
        objects[MartRadom].element.style.backgroundImage = "url(" + data.img + ")";
      };
    }, 3000);
  }, 3000);
}

function arrayAjax(id) {
  var _data;
  $.ajax({
    type: 'post',
    url: 'http://127.0.0.1:3000/users/bar',
    dataType: 'json',
    data: {
      id: id
    },
    success: function(data) {
      $("#errorInfo").html('');
      Id = data.id || id;
      if (data != undefined && data.img != undefined) {
        imgJson.push(data);
        storage["img"] = JSON.stringify(imgJson);
        creatElement(data);
      } else {
        imgJson = JSON.parse(storage["img"]);
        creatElement(imgJson[indexLocalstroge]);
        if (indexLocalstroge >= imgJson.length - 1) {
          indexLocalstroge = 0;
        } else {
          indexLocalstroge++;
        }
      }
    },
    error: function(error) {
      $("#errorInfo").html('网络出现问题！');
    }
  });
};

function transform(targets, duration) {

  TWEEN.removeAll();

  for (var i = 0; i < objects.length; i++) {

    var object = objects[i];
    var target = targets[i];

    new TWEEN.Tween(object.position)
      .to({
        x: target.position.x,
        y: target.position.y,
        z: target.position.z
      }, Math.random() * 500)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to({
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z
      }, Math.random() * 500)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.scale)
      .to({
        x: target.scale.x,
        y: target.scale.y,
        z: target.scale.z
      }, Math.random() * 500)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 1)
    .onUpdate(render)
    .start();
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function xz() {
  deg += Math.PI / 270 * N;
  camera.position.z = 3000 * Math.cos(deg);
  camera.position.x = 3000 * Math.sin(deg);
  scene.children[60].rotation.y += 0.05;
}

function getPosition(max, min, positive) {
  var s = 1;
  var MathRandom = Math.random();
  if (positive != true) {
    if (Math.random() >= 0.5) {
      s = -1;
    }
  }
  return s * (MathRandom * max + min);
}

function animate() {

  renderer.render(scene, camera);

  requestAnimationFrame(animate);

  xz();

  TWEEN.update();

  controls.update();

}

function render() {

  renderer.render(scene, camera);

}