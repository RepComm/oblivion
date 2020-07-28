
import { Renderer } from "./ui/renderer.js";
import { get } from "./ui/aliases.js";
import { World } from "./world.js";
import { Camera } from "./camera.js";
import { GameInput } from "./input/gameinput.js";
import { pointInRect, radians, dist } from "./math.js";
import { Location } from "./location.js";

let renderer = new Renderer({
  premadeCanvas: get("canvas") as HTMLCanvasElement
});

let input = GameInput.get();
input.createBinding("forward")
.addKey("w");
input.createBinding("backward")
.addKey("s");
input.createBinding("left")
.addKey("a");
input.createBinding("right")
.addKey("d");
input.createBinding("jump")
.addKey(" ");
input.createBinding("turn-left")
.addKey("q");
input.createBinding("turn-right")
.addKey("e");
input.createBinding("escape")
.addKey("Escape");

let world = new World();

let center = new Location();
center.set(world.width/2, 0, world.height/2);

for (let xi=0; xi<world.width; xi++) {
  for (let zi=0; zi<world.height; zi++) {

    world.setBlockType(xi, zi, xi+zi);
  }
}

renderer.setWorld(world);

let camera = new Camera();
camera.location.set(10, 0, 10);
camera.location.world = world;

console.log(camera);

setInterval(()=>{
  if (input.pointerPrimary) {
    input.raw.tryLock(renderer.element);
  } else if (input.getButton("escape")) {
    input.raw.unlock();
  }
  if (input.getButton("forward")) {
    camera.location.travel2d(0.1);
  } else if (input.getButton("backward")) {
    camera.location.travel2d(-0.1);
  }
  if (input.getButton("left")) {
    camera.location.travel2d(0.1, radians(90));
  } else if (input.getButton("right")) {
    camera.location.travel2d(0.1, radians(-90));
  }
  if (input.raw.pointer.locked) {
    camera.location.yaw -= input.raw.consumeMovementX()/200;
  }
}, 1000/20);

renderer.setCamera(camera);

renderer.handleResize();
renderer.start();
