// Write the game name to 'title'.
title = "Flytrap";

// 'description' is displayed on the title screen.
description = `
[Hold] Stretch
`;

// User-defined characters can be written here.
characters = [
  `
R    R
GR  RG
GGRRGG
 GGGG 
  gg  
      
`,
  `
  G   
 GgG  
 GgG  
GGgGG 
GGGGG 
 GGG  
`,
  `
 llll
ll  ll
l    l
l    l
ll  ll 
 llll 
`,
  `
     
  l  
 lll 
  l
   
      
`,
];

// Configure game options.
options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  // If you want to play a different BGM or SE,
  // you can try changing the 'seed' value.
  seed: 82,
};

// (Optional) Defining the types of variables is useful for
// code completion and error detection.
/** @type {{angle: number, length: number, pin: Vector}} */
let cord;
/** @type {{pos: Vector,direction: number, offset: number}[]} */
let flys = [];
let nextPinDist;
const cordLength = 7;
let p1;

let l;
/*
Next, wyatt, add new sprite for scissors, add collision, check for collision of that new sprite using the line `l`


*/

// 'update()' is called every frame (60 times per second).
function update() {
  let scr = 0; //getScrVal();
  const SPEED_MULT = 0.3;
  //const angle = Math.sin(difficulty * 0.03 * (ticks / 3)) * 0.5 - 1.5707;
  const angle = Math.sin(ticks / 60) * 0.5 - 1.5707;

  //Testing sprites visuals
  // const c1 = char("a", vec(50, 10)).isColliding.char;
  // const c2 = char("b", vec(60, 9)).isColliding.char;
  // const c3 = char("c", vec(70, 10)).isColliding.char;
  // const c4 = char("d", vec(80, 10)).isColliding.char;

  // Runs on first tick
  if (!ticks) {
    //flys = [vec(50, 100)]; // 'vec()' creates a 2d vector instance.
    nextPinDist = 10;
    cord = { angle: 0, length: cordLength, pin: vec(50, 100) };
    //pins.push(vec(rnd(10, 90), -2 - nextPinDist));
    spawnFly();
  }

  if (ticks % 60 == 0) {
    spawnFly();
  }

  // Draw plant
  drawPlant(angle);

  handleFlys();

  //Re-draw head so it appears ontop of flys
  drawPlant(angle);

  handleCordLength(SPEED_MULT);
}

function handleCordLength(SPEED_MULT) {
  if (input.isPressed) {
    cord.length += difficulty * SPEED_MULT;
  } else {
    cord.length += (cordLength - cord.length) * 0.04 * SPEED_MULT;
  }
}

function drawPlant(angle) {
  cord.angle = angle;
  color("green");
  const top = vec(cord.pin).addWithAngle(cord.angle, cord.length);
  l = line(cord.pin, top, 3).isColliding;
  color("black");
  drawHead(top);
}

function drawHead(top) {
  if (input.isPressed) {
    char("a", top.add(0, -2)).isColliding;
  } else {
    char("b", top.add(0.5, -2)).isColliding;
  }
}

function spawnFly() {
  let r = Math.random() - 0.5;
  let offset = rnd(-1000, 1000);
  let UPPER_LIMIT = 10;
  let LOWER_LIMIT = 60;

  if (r < 0) {
    flys.push({
      pos: vec(rnd(-20, -5), rnd(UPPER_LIMIT, LOWER_LIMIT)),
      direction: 1,
      offset,
    });
  } else {
    flys.push({
      pos: vec(rnd(105, 120), rnd(UPPER_LIMIT, LOWER_LIMIT)),
      direction: -1,
      offset,
    });
  }
}

function handleFlys() {
  if (flys.length <= 0) {
    return;
  }
  remove(flys, (fly) => {
    fly.pos.x += 0.25 * fly.direction * difficulty;

    const f = char(
      "d",
      vec(fly.pos.x, fly.pos.y + getFlyOffset(fly))
    ).isColliding;

    //Collision w/ open mouth
    if (f.char.a) {
      console.log("munch");
      play("select");
      addScore(difficulty * 10 + rnd(-5, 5), fly.pos);
      return true;
    }

    if (fly.pos.x < -40 || fly.pos.x > 140) {
      return true;
    }
  });
}

function getFlyOffset(fly) {
  return (
    Math.sin((ticks + fly.offset) / 25) * 6 +
    Math.sin((ticks + fly.offset) / 20) * 3 +
    Math.sin((ticks + fly.offset) / 10) * 1.5 +
    Math.sin((ticks + fly.offset) / 5) * 1 +
    Math.sin((ticks + fly.offset) / 2.5) * 0.5
  );
}

// if (nextPin != null) {
//   play("powerUp");
//   // Add up the score.
//   // By specifying the coordinates as the second argument,
//   // the added score is displayed on the screen.
//   addScore(ceil(cord.pin.distanceTo(nextPin)), nextPin);
//   cord.pin = nextPin;
//   cord.length = cordLength;
//}

// let nextPin;
// 'remove()' passes the elements of the array of the first argument to
// the function of the second argument in order and executes it.
// If the function returns true, the element will be removed from the array.
// remove(pins, (p) => {
//   p.y += scr;
//   // Draw a box and check if it collides with other black rectangles or lines.
//   color("green");
//   if (box(p, 3).isColliding.rect.black && p !== cord.pin) {
//     nextPin = p;
//   }
//   color("black");
//   return p.y > 102;
// });

// Check for end game
// if (cord.pin.y > 98) {
//   play("explosion");
//   // Call 'end()' to end the game. (Game Over)
//   end();
// }
