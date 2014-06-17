// Matter aliases
var Engine = Matter.Engine,
    Gui = Matter.Gui,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint;

var Demo = {};

var _engine,
    _running = false,
    _sceneName = 'startWorld',
    _sceneWidth,
    _sceneHeight,
    _stamps = [];

Demo.init = function() {
  var canvasContainer = document.getElementById('container');
  
  _engine = Engine.create(canvasContainer, {
    render: {
      options: {
        wireframes: false,
        showAngleIndicator: false,
        showDebug: false,
        background: false
      }
    }
  });

  setTimeout(function() {
    Engine.run(_engine);
    Demo.updateScene();
    _running = true;
  }, 800);
  
  window.addEventListener('deviceorientation', Demo.updateGravity, true);
  window.addEventListener('orientationchange', function() {
      Demo.updateGravity();
      Demo.updateScene();
  }, false);
};

Demo.mixed = function() {
  var _world = _engine.world;
  
  Demo.reset();

  World.add(_world, MouseConstraint.create(_engine));
  
  var stack = Composites.stack(20, 20, 10, 5, 0, 0, function(x, y, column, row) {
    switch (Math.round(Common.random(0, 1))) {
        
    case 0:
      if (Math.random() < 0.8) {
        return Bodies.rectangle(x, y, Common.random(20, 40), Common.random(20, 40), { friction: 0.01, restitution: 0.4 });
      } else {
        return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30), { friction: 0.01, restitution: 0.4 });
      }
      break;
    case 1:
      return Bodies.polygon(x, y, Math.round(Common.random(4, 6)), Common.random(20, 40), { friction: 0.01, restitution: 0.4 });
    }
  });
  
  World.add(_world, stack);
};

Demo.startWorld = function() {
  var _world = _engine.world;
  
  Demo.reset();

  World.add(_world, MouseConstraint.create(_engine));
}

Demo.addCircle = function() {
  if (!_running)
      return;
      
  var _world = _engine.world;
  
  var stamp = Bodies.circle($('#container').width()/2, 30, 20.5, {
      isStatic: false,
      density: 0.25,
      frictionAir: 0,
      restitution: 0.75,
      friction: 0.05,
      render: {
        sprite: {
          texture: 'imgs/paintlounge_ball.png'
        }
      }
    });
  
  _stamps.push(stamp);
  
  World.addBody(_world, stamp);
  
  console.log(_stamps.length);
}

Demo.updateScene = function() {
  if (!_engine)
      return;
  
  _sceneWidth = $('#container').width();
  _sceneHeight = $('#container').height();

  var boundsMax = _engine.world.bounds.max,
      renderOptions = _engine.render.options,
      canvas = _engine.render.canvas;

  boundsMax.x = _sceneWidth;
  boundsMax.y = _sceneHeight;

  canvas.width = renderOptions.width = _sceneWidth;
  canvas.height = renderOptions.height = _sceneHeight;

  Demo[_sceneName]();
};

Demo.updateGravity = function () {
  if (!_engine)
      return;
  
  var orientation = window.orientation,
      gravity = _engine.world.gravity;
  
  // original
  if (orientation === 0) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
  } else if (orientation === 180) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
  } else if (orientation === 90) {
    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
  } else if (orientation === -90) {
    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
  }
/*
  // shift 1
  if (orientation === 0) {
    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
  } else if (orientation === 180) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
  } else if (orientation === 90) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
  } else if (orientation === -90) {
    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
  }
*/ 
/*
  // shift 2
  if (orientation === 0) {
    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
  } else if (orientation === 180) {
    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
  } else if (orientation === 90) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
  } else if (orientation === -90) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
  }
*/
/*
  // shift 3
  if (orientation === 0) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
  } else if (orientation === 180) {
    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
  } else if (orientation === 90) {
    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
  } else if (orientation === -90) {
    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
  }
*/
};

Demo.reset = function() {
  var _world = _engine.world;
  
  World.clear(_world);
  Engine.clear(_engine);
  
  var basket = [];
  
  var step = 2*Math.PI/150;
  var h = $('#container').width()/2; 
  var k = $('#container').width()/2;
  var r = $('#container').width()/2;
  
  for(var theta=0;  theta < 2*Math.PI;  theta+=step) {
    var x = h + r*Math.cos(theta);
    var y = k - r*Math.sin(theta);
    //console.log(x, y, theta, theta/360);
    
    World.add(_world,
      //Bodies.circle(x, y, 5, wallOptions)
      Bodies.rectangle(x, y, 5, 5, { isStatic: true, angle: -theta, render: { visible: false } })
    );
  }
};

Demo.getTotal = function() {
  return _stamps.length;
}