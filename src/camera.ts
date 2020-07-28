
import { Location } from "./location.js";

export class Camera {
  location: Location;
  fov: number;
  scanLines: number;
  depth: number;
  constructor () {
    this.location = new Location();
    this.fov = 80;
    this.scanLines = 120;
    this.depth = 1000;
  }
}
