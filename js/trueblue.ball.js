//var count = 5;
var balls = new Array();

// grab the canvas
var canvaselm, canvascontext, canvaswidth, canvasheight;

/*
$(document).ready(function() {

  // grab the canvas
  
	//game.initialize();
	//game.loadUpTheCircles();
});

$(window).load(function() {
	//sensors.init();
	if (window.DeviceOrientationEvent) {
    //$('.gyrodevice').html("Your browser supports Device Orientation");
    sensors.init();
    //window.addEventListener("deviceorientation", game.handleOrientation, true);
  } else {
    //$('.gyrodevice').html("Sorry, your browser doesn't support Device Orientation");
  }
});
*/

var sensors = (function() {
  return {
    init : function() {
/*
      var features = gyro.getFeatures();
      for (f in features) {
        $('.gyrofeatures').append("<div>"+f+"</div>");
      }
      if (gyro.hasFeature('devicemotion')) {
        $('.gyrodevice').html("i gots devicemotion!");
      }
*/
      if(gyro.getFeatures().length > 0) {
        // awesome!
      } else {
        // usually it's right... a lot of times, it's not. esp on mobile. even within window load! hm.
        //$('.badgyro').html("gyro doesn't work here :(");
      }
      
      gyro.frequency = 100;
      
      gyro.startTracking(function(o) {
        $('.gyro').html(o.x+", "+o.y);
        // changing the gravity affects all of the objects!
        game.changeGravity(o.x, -o.y)
      });
    }
  }
}());

var game = (function() {
  
  var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	b2Body = Box2D.Dynamics.b2Body
    ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,	b2World = Box2D.Dynamics.b2World
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ;
  
  var world = new b2World(new b2Vec2(0, 0) // gravity
    , false // don't allow sleep
  );

  return {
    /**
     * The following config variable is the global game configuration. You
     * can set all the game related values, like sensors or game timeout.
     */
    config : {
        width : 425,
        height : 425,
        useSensor : true,
        debug : false,
        box2dDebug : true, // Box2d debug mode flag
        box2dScale : 30, // scale for Box2d debug mode
        timeout : 30,
        /**
         * All game multimedia resources
         */
        resources : [ {
            type : "image",
            src : "physics/paintlounge_ball.png"
        } ]
    },
    initialize : function() {
      //create ground
      var fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0;
      
      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_staticBody;
      fixDef.shape = new b2PolygonShape;
      
      game.config.width = canvaswidth;
      game.config.height = canvasheight;
      //console.log(game.config);
      
      var basket = [];
      
      var step = 2*Math.PI/150;
      var h = (game.config.width/game.config.box2dScale)/2; // x coordinate of circle center
      var k = (game.config.height/game.config.box2dScale)/2; // y coordinate of circle center
      var r = ((game.config.width/game.config.box2dScale)/2)+0.5;
      console.log(h, k, r);
      
      fixDef.shape.SetAsBox(0.5, 0.5);
      
      for(var theta = 0; theta < 2*Math.PI; theta += step) {
        var x = h + r*Math.cos(theta);
        var y = k - r*Math.sin(theta);
        
        bodyDef.position.Set(x, y);
        bodyDef.angle = -theta;
        world.CreateBody(bodyDef).CreateFixture(fixDef);
      }

/*
      fixDef.shape.SetAsBox(20, 2);
      bodyDef.position.Set(10, game.config.height / game.config.box2dScale + 1.8);
      world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(10, -1.8);
      world.CreateBody(bodyDef).CreateFixture(fixDef);
      
      fixDef.shape.SetAsBox(2, 14);
      bodyDef.position.Set(-1.8, 13);
      world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(game.config.width / game.config.box2dScale + 1.8, 13);
      world.CreateBody(bodyDef).CreateFixture(fixDef);
*/
      
      window.setInterval(this.updateBox2dWeb, 1000 / 60);
      
      this.setBox2dDebug();
    },
    getBox2dWorld : function() {
      return world;
    },
    updateBox2dWeb : function(callback) {
      world.Step(1 / 60, 10, 10);
      canvascontext.clearRect(0,0,canvaswidth,canvasheight);
      world.DrawDebugData();
      world.ClearForces();
      //game.processObjects();
    },
    setBox2dDebug : function() {
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(canvascontext);
      debugDraw.SetDrawScale(game.config.box2dScale);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
    },
    processObjects : function() {
      var node = world.GetBodyList();
      while (node) {
        var b = node;
        node = node.GetNext();
        var position = b.GetPosition();
        
        // Draw the dynamic objects
        if (b.GetType() == b2Body.b2_dynamicBody) {
          // put an image in place if we store it in user data
          if (b.m_userData && b.m_userData.imgsrc) {
          
            // Draw the image on the object
            var size = b.m_userData.imgsize;
            var scale = b.m_userData.scale;
            var imgObj = new Image(size,size);
            imgObj.src = b.m_userData.imgsrc;
            
            canvascontext.save();
            
            // Translate to the center of the object, then flip and scale appropriately
            canvascontext.translate(position.x*scale,position.y*scale);
            //console.log(position.x*scale, position.y*scale);
            canvascontext.rotate(b.GetAngle());
            var s2 = -1*(size/2);
            canvascontext.drawImage(imgObj,s2,s2,size,size);
            canvascontext.restore();
          }
        }
      }
	  },
    loadUpTheCircles : function(count) {
      for (var a = 0; a < count; a++) {
        setTimeout(this.addCircle, a*100);
      }
    },
    addCircle : function() {
      var fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.7;
      
      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.fixedRotation = true;
      bodyDef.linearDamping = 0.05;
      
      var velocityX = Math.floor(Math.random()*9) + 1;
      velocityX *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
      var velocityY = Math.floor(Math.random()*9) + 1;
      velocityY *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
      
      bodyDef.linearVelocity = new b2Vec2(velocityX,velocityY);
      
      fixDef.shape = new b2CircleShape(game.config.box2dScale/(41+3));
      bodyDef.position.x = (game.config.width/game.config.box2dScale)/2 - (game.config.box2dScale/(41+3))/2;
      bodyDef.position.y = (game.config.height/game.config.box2dScale)/2 - (game.config.box2dScale/(41+3))/2;
      
      var data = { imgsrc: "imgs/paintlounge_ball.png",
                   imgsize: 41,
                   scale: game.config.box2dScale
                 }
                 
  		bodyDef.userData = data;
  		
      world.CreateBody(bodyDef).CreateFixture(fixDef);
      
      balls.push(bodyDef);
      //console.log("count!", balls.length);
    },
    getTotal : function() {
      return balls.length;
    },
    changeGravity : function(x,y) {
      var gravity = new b2Vec2(x,y);
      world.SetGravity( gravity );
    }
  };
}());
