var NUM_CIRCLES = 15;

function SimplePhysicsEngine(world, objects)
{
	this.World = world;
	this.Objects = objects;

	this.applyPhysics = function ()
	{
		for(var i = 0; i < this.Objects.length; i++)
		{
		
			var currentObject = this.Objects[i];	
			
			for(var j = i+1; j < this.Objects.length; j++)
			{
				var objectToCheck = this.Objects[j];
				this.handleCollision(currentObject, objectToCheck);
			}
			
			this.handleCollisionWithBoundry(currentObject);	
		}
		
		for(var i = 0; i < this.Objects.length; i++)
		{
			var currentObject = this.Objects[i];	
			currentObject.move();
		}
	}
	
	this.handleCollisionWithBoundry = function (object)
	{
		var collisionDetected = false;
		
		//todo square fix
		//?? refactor change handling
		
		if((object.Boundry.XPos - object.Boundry.Width) < 0)
		{
			object.Direction.X *= -1;
			object.XPos = object.Boundry.Width;
		}
		
		if((object.Boundry.XPos + object.Boundry.Width) > this.World.width)
		{
			object.Direction.X *= -1;
			object.XPos = this.World.width - object.Boundry.Width;
		}
		
		if((object.Boundry.YPos - object.Boundry.Height) < 0)
		{
			object.Direction.Y *= -1;
			object.YPos = object.Boundry.Height;
		}
		
		if((object.Boundry.YPos + object.Boundry.Height) > this.World.height)
		{
			object.Direction.Y *= -1;
			object.YPos = this.World.height - object.Boundry.Height;
		}
	}
	
	this.handleCollision = function (object1, object2)
	{
		if(this.isColliding(object1, object2))
		{
			this.respondToCollision(object1, object2);
		}
	}
	
	this.isColliding = function(object1, object2)
	{
		var collisionObject1 = object1.Boundry;
		var collisionObject2 = object2.Boundry;
		
		var collisionDetected = false;
		
		
		if(collisionObject1 instanceof Circle && collisionObject2 instanceof Circle)
		{
			var distanceX = collisionObject1.XPos - collisionObject2.XPos;
			var distanceY = collisionObject1.YPos - collisionObject2.YPos;
			var actualDistance = 0;
			var minDistance = 0;
		
			actualDistance = Math.pow(distanceX,2) + Math.pow(distanceY,2);
			minDistance = Math.pow(collisionObject1.Radius + collisionObject2.Radius,2);
			collisionDetected = (minDistance >= actualDistance)
		}
		else if(collisionObject1 instanceof Square && collisionObject2 instanceof Square)
		{
			collisionDetected |= !((collisionObject1.XPos + collisionObject1.Width) <= collisionObject2.XPos || collisionObject1.XPos >= (collisionObject2.XPos + collisionObject2.Width));
			collisionDetected |= !((collisionObject1.YPos + collisionObject1.Height) <= collisionObject2.YPos || collisionObject1.YPos >= (collisionObject2.YPos + collisionObject2.Height));	
		}
		else
		{
			// box and circle
			var circle = (collisionObject1 instanceof Circle) ? collisionObject1 : collisionObject2;
			var box = (collisionObject1 instanceof Square) ? collisionObject1 : collisionObject2;
						
			var closestX = 0;
			var closestY = 0;
			
			if (circle.XPos  < box.XPos)
				closestX = box.XPos;
			else if (circle.XPos  > (box.XPos + box.Width))
				closestX = box.XPos + box.Width;
			else
				closestX = circle.XPos ;
			 
			if (circle.YPos < box.YPos)
				closestY = box.YPos;
			else if (circle.YPos > (box.YPos + box.Height))
				closestY = box.YPos + box.Height;
			else
				closestY = circle.YPos;
			 
			var distance = Math.pow(circle.XPos - closestX,2) + Math.pow(circle.YPos - closestY,2);
			collisionDetected = distance <= Math.pow(circle.Radius,2);
		}
		
		return collisionDetected;
	}
	
	this.respondToCollision = function(object1, object2)
	{
		// apply impulse law
		var summedMass = (object1.Mass + object2.Mass);
		var dM12 = object1.Mass - object2.Mass;
		var dM21 = object2.Mass - object1.Mass;
		// calc the components of the new velocities
		var newVelX1 = (object1.Direction.X * dM12 + (2 * object2.Mass * object2.Direction.X)) / summedMass;
		var newVelY1 = (object1.Direction.Y * dM12 + (2 * object2.Mass * object2.Direction.Y)) /  summedMass;
		var newVelX2 = (object2.Direction.X * dM21 + (2 * object1.Mass * object1.Direction.X)) /  summedMass;
		var newVelY2 = (object2.Direction.Y * dM21 + (2 * object1.Mass * object1.Direction.Y)) /  summedMass;
			
		object1.Direction.X =newVelX1;
		object1.Direction.Y =newVelY1;
		object2.Direction.X =newVelX2;
		object2.Direction.Y =newVelY2;
		// move objects away from each other
		/*object1.XPos -= object1.Direction.X;
		object1.YPos -= object1.Direction.Y;
		object2.XPos -= object2.Direction.X;
		object2.YPos -= object2.Direction.Y;
		
		object1.XPos +=newVelX1;
		object1.YPos +=newVelY1;
		object2.XPos +=newVelX2;
		object2.YPos +=newVelY2;*/
		
		object1.onCollision(object1);
		object2.onCollision(object2);
	}
}

function CanvasRenderer()
{
	this.Canvas = document.getElementById('plane');
	this.Context = this.Canvas 	.getContext('2d');
	
	this.render = function (objects)
	{
		// clear for redrawing
		this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

		for(var i = 0; i < objects.length; i++)
		{		
			objects[i].draw(this.Context);
		}
	}
}


function Circle(initXPos,initYPos, radius ) 
{
	this.Boundry = this;
	this.XPos = initXPos || 0;
	this.YPos = initYPos || 0;
	this.Radius = radius;
	this.Mass = radius;
	
	this.Width = this.Radius;
	this.Height = this.Radius;
	
	this.Direction = {
		X : Math.random()*3,
		Y : Math.random()*3
	}
	
	this.move = function () 
	{
		this.XPos += this.Direction.X;
		this.YPos += this.Direction.Y;
	}	
	
	this.onCollision = function (objectCollidedWith)
	{
	
	}
	
	this.draw = function(context)
	{
		context.beginPath();
		context.arc(this.XPos ,this.YPos, this.Radius, 0, 2 * Math.PI, false);
		context.lineWidth = 1;
		context.strokeStyle = this.LineColor;
		context.stroke();
	}
}

function Square(initXPos1,initYPos1,initXPos2,initYPos2, mass ) 
{
	this.Boundry = this;
	
	this.XPos = initXPos1;
	this.YPos = initYPos1;
	this.XPos2 = initXPos2;
	this.YPos2 = initYPos2;
	
	this.Mass = mass || 5;
	
	this.Width = initXPos2 - initXPos1;
	this.Height = initYPos2 - initYPos1;
	
	this.Direction = {
		X : Math.random()*3,
		Y : Math.random()*3
	}
	
	this.move = function () 
	{
		this.XPos += this.Direction.X;
		this.YPos += this.Direction.Y;
	}	
	
	this.onCollision = function (objectCollidedWith)
	{
	
	}
	
	this.draw = function(context)
	{
		context.beginPath();
		context.rect(this.XPos,this.YPos,this.XPos2,this.YPos2);
		context.lineWidth = 1;
		context.strokeStyle = this.LineColor;
		context.stroke();
	}
}

function Simulation(renderer)
{
	this.Objects = [];
	this.Renderer = renderer;
	
	this.init = function (environment)
	{
		for(var i = 0; i < NUM_CIRCLES; i++)
		{
			this.Objects.push(new Circle(Math.random()*500, Math.random()*500, Math.random()*30));
		}
		
		
		this.Environment = new SimplePhysicsEngine(document.getElementById('plane'), this.Objects);
	}
	
	this.loop = function ()
	{		
		this.Environment.applyPhysics();
		this.Renderer.render(this.Objects);
	}
}
	
