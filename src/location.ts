
import { World } from "./world.js";

export class Location {
  x: number = 0.01;
  z: number = 0.01;
  y: number = 0.01;
  /**Axis X*/
  pitch: number = 0.01;
  /**Axis Y*/
  yaw: number = 0.01;
  world: World = undefined;
  set (x: number = 0, y: number = 0, z: number = 0): Location {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  travel2d (dist: number, theta: number = 0): Location {
    this.x += Math.cos(this.yaw + theta) * dist;
    this.z += Math.sin(this.yaw + theta) * dist;
    return this;
  }
  copy (from: Location): Location {
    this.x = from.x;
    this.y = from.y;
    this.z = from.z;
    this.pitch = from.pitch;
    this.yaw = from.yaw;
    this.world = from.world;
    return this;
  }
}
