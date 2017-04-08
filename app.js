var interval = 60;

var canvas;
var ctx;
var width;
var height;
	
var cell_width = 10;
var direction;
var food;
var score;

var is_paused = false;

var snake_array;

function setSpeed(speed){
	
	interval = Math.round(240/speed);
	
}

function pause(){
	
	if(!is_paused){
		clearInterval(game_loop);
	}else{
		game_loop = setInterval(paint, interval);
	}	
	
	is_paused = !is_paused;
}

function init()
{
	direction = "right"; //default direction
	create_snake();
	create_food(); //Now we can see the food particle
	//finally lets display the score
	score = 0;
	
	//Lets move the snake now using a timer which will trigger the paint function
	//every 60ms
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, interval);
}

function create_snake()
{
	var length = 5; //Length of the snake
	snake_array = []; //Empty array to start with
	for(var i = length-1; i>=0; i--)
	{
		//This will create a horizontal snake starting from the top left
		snake_array.push({x: i, y:0});
	}
}
	
//Lets create the food now
function create_food()
{
	food = {
		x: Math.round(Math.random()*(width-cell_width)/cell_width), 
		y: Math.round(Math.random()*(height-cell_width)/cell_width), 
	};
	//This will create a cell with x/y between 0-44
	//Because there are 45(450/10) positions accross the rows and columns
}
	
//Lets paint the snake now
function paint()
{
	//To avoid the snake trail we need to paint the BG on every frame
	//Lets paint the canvas now
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, width, height);
	
	//The movement code for the snake to come here.
	//The logic is simple
	//Pop out the tail cell and place it infront of the head cell
	var nx = snake_array[0].x;
	var ny = snake_array[0].y;
	//These were the position of the head cell.
	//We will increment it to get the new head position
	//Lets add proper direction based movement now
	if(direction == "right") nx++;
	else if(direction == "left") nx--;
	else if(direction == "up") ny--;
	else if(direction == "down") ny++;
	
	//Lets add the game over clauses now
	//This will restart the game if the snake hits the wall
	//Lets add the code for body collision
	//Now if the head of the snake bumps into its body, the game will restart
	if(nx == -1 || nx == width/cell_width || ny == -1 || ny == height/cell_width || check_collision(nx, ny, snake_array))
	{
		//restart game
		init();
		//Lets organize the code a bit now.
		return;
	}
	
	//Lets write the code to make the snake eat the food
	//The logic is simple
	//If the new head position matches with that of the food,
	//Create a new head instead of moving the tail
	if(nx == food.x && ny == food.y)
	{
		var tail = {x: nx, y: ny};
		score++;
		//Create new food
		create_food();
	}
	else
	{
		var tail = snake_array.pop(); //pops out the last cell
		tail.x = nx; tail.y = ny;
	}
	//The snake can now eat the food.
	
	snake_array.unshift(tail); //puts back the tail as the first cell
	
	for(var i = 0; i < snake_array.length; i++)
	{
		var c = snake_array[i];
		//Lets paint 10px wide cells
		paint_cell(c.x, c.y);
	}
	
	//Lets paint the food
	paint_cell(food.x, food.y);
	//Lets paint the score
	var score_text = "Score: " + score;
	ctx.fillText(score_text, 5, height-5);
}

//Lets first create a generic function to paint cells
function paint_cell(x, y)
{
	ctx.fillStyle = "red";
	ctx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
}

function check_collision(x, y, array)
{
	//This function will check if the provided x/y coordinates exist
	//in an array of cells or not
	for(var i = 0; i < array.length; i++)
	{
		if(array[i].x == x && array[i].y == y)
		 return true;
	}
	return false;
}
	
$(document).keydown(function(e){
	var key = e.which;
	
	if(key == "37" && direction != "right" && !is_paused) 
		direction = "left";
	else if(key == "38" && direction != "down" && !is_paused) 
		direction = "up";
	else if(key == "39" && direction != "left" && !is_paused) 
		direction = "right";
	else if(key == "40" && direction != "up" && !is_paused) 
		direction = "down";
	else if(key == "32") //space
		pause();
	
})	

$(document).ready(function(){
	//Canvas stuff
	canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	width = $("#canvas").width();
	height = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	cell_width = 10;
	
	init();
	
	
})