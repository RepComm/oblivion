
import { on } from "./aliases.js";
import { EPSILON, radians, LineIntersectResult, pointInRect } from "../math.js";
import Component from "./component.js";
import { World, BlockData } from "../world.js";
import { Camera } from "../camera.js";
import { Location } from "../location.js";

interface RendererConstructorOptions {
  premadeCanvas: HTMLCanvasElement
}

export class Renderer extends Component {
  element: HTMLCanvasElement; //Override component's element member
  ctx: CanvasRenderingContext2D;
  zoom: number = 1;
  fps: number = 0;
  countedFrames: number = 0;
  lastTime: number = 0;
  nowTime: number = 0;
  deltaTime: number = 0;
  secondCounter: number = 0;
  world: World;
  camera: Camera;
  onRenderCallback: FrameRequestCallback;
  doRender: boolean = false;
  onResizeCallback: EventListener;

  rayOrigin: Location = new Location();
  rayHit: Location = new Location();
  hitBlock: BlockData = new BlockData();

  lineResult: LineIntersectResult = {
    x: 0,
    y: 0,
    onLine0: false,
    onLine1: false
  };

  drawColor: string = "black";
  drawDist: number = 0;
  inverseDist: number = 0;
  floorColor: string = "brown";
  ceilingColor: string = "blue";
  constructor(opts: RendererConstructorOptions | undefined = undefined) {
    super();
    if (opts) {
      if (opts.premadeCanvas) this.useNative(opts.premadeCanvas);
      else this.make("canvas");
    } else {
      this.make("canvas");
    }
    this.ctx = this.element.getContext("2d");
    
    this.onRenderCallback = (time) => {
      this.render();
      if (this.doRender) {
        window.requestAnimationFrame(this.onRenderCallback);
      }
    }
    this.onResizeCallback = () => {
      this.element.width = Math.floor(this.rect.width);
      this.element.height = Math.floor(this.rect.height);
      // console.log("On resize", this.element.width, this.element.height);
    }
    setTimeout(() => {
      this.onResizeCallback(undefined);
    }, 500);
  }
  setSize(width: number, height: number, updateCameraAspect: boolean = false) {
    this.element.width = Math.floor(width);
    this.element.height = Math.floor(height);
  }
  setWorld(world: World) {
    this.world = world;
  }
  setCamera(camera: Camera) {
    this.camera = camera;
  }
  handleResize() {
    on(window, "resize", this.onResizeCallback);
  }
  render() {
    this.countedFrames++;
    this.lastTime = this.nowTime;
    this.nowTime = Date.now();
    this.deltaTime = this.nowTime - this.lastTime;
    this.secondCounter += this.deltaTime;
    if (this.secondCounter > 1000) {
      this.secondCounter = 0;
      this.fps = this.countedFrames;
      this.countedFrames = 0;
      document.title = this.fps.toString();
    }
    // this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    this.ctx.save();
    this.ctx.fillStyle = this.floorColor;
    this.ctx.fillRect(0, this.element.height/2, this.element.width, this.element.height/2);
    this.ctx.fillStyle = this.ceilingColor;
    this.ctx.fillRect(0, 0, this.element.width, this.element.height/2);
    this.ctx.restore();

    if (this.world && this.camera) {
      let fovToWidthRatio = this.element.width / this.camera.fov;

      this.rayOrigin.copy(this.camera.location);
      let yaw = -this.camera.fov / 2;

      for (let i = 0; i < this.camera.fov; i++) {
        yaw += 1;
        this.rayHit.copy(this.rayOrigin);
        this.rayHit.yaw = this.rayOrigin.yaw - radians(yaw);

        for (let j = 0; j < this.camera.depth; j++) {
          this.rayHit.travel2d(0.01);

          //DEBUG DRAW
          // this.ctx.save();
          // this.ctx.strokeStyle = "white";
          // this.ctx.beginPath();
          // this.ctx.translate(this.rect.width / 2, this.rect.height / 2);
          // this.ctx.moveTo(-this.rayOrigin.x, this.rayOrigin.z);
          // this.ctx.lineTo(-this.rayHit.x, this.rayHit.z);
          // this.ctx.stroke();
          // this.ctx.restore();

          this.hitBlock.setLocation(this.rayHit);
          this.world.getBlock(this.hitBlock.x, this.hitBlock.z, this.hitBlock);
          if (this.hitBlock.type !== 0) {
            if (pointInRect(
              this.camera.location.x,
              this.camera.location.z,
              this.hitBlock.x,
              this.hitBlock.z,
              1, 1
            )) {
              this.camera.location.travel2d(-0.2);
            }
            this.drawDist = Math.floor((j / this.camera.depth) * 255);
            this.inverseDist = 1 / this.drawDist * 255;
            this.drawColor = `rgb(${this.inverseDist/2}, ${this.inverseDist}, ${this.inverseDist})`;

            let height = Math.pow(this.element.height / this.drawDist, 1.2);
            let top = height
            let bottom = this.element.height/2 - height/2;

            let addedHeight = height*(this.hitBlock.type-1);

            this.ctx.save();
            this.ctx.fillStyle = this.drawColor;
            this.ctx.fillRect(
              i * fovToWidthRatio,
              bottom - addedHeight,
              1 * fovToWidthRatio,
              top + addedHeight
            );
            this.ctx.restore();
            j=this.camera.depth+1;
          }
        }
      }
    }
  }
  start() {
    this.doRender = true;
    window.requestAnimationFrame(this.onRenderCallback);
  }
  stop() {
    this.doRender = false;
  }
}
