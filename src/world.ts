
import { Utils } from "./math.js";

import { Location } from "./location.js";

export interface WorldCreateOptions {
  width: number;
  height: number;
}

export class BlockData {
  x: number = 0;
  z: number = 0;
  index: number = 0;
  world: World = undefined;
  type: number = 0;
  setLocation (loc: Location): BlockData {
    this.x = Math.floor(loc.x);
    this.z = Math.floor(loc.z);
    this.world = loc.world;
    this.index = Utils.twoDimToIndex(this.x, this.z, this.world.width);
    return this;
  }
  setType (type: number): BlockData {
    this.type = type;
    return this;
  }
}

export const DefaultWorldCreateOptions: WorldCreateOptions = {
  width: 16,
  height: 16
};

export class World {
  data: ArrayBuffer;
  dataView: DataView;
  width: number;
  height: number;
  _t_blockLoc: Location;
  _t_blockData: BlockData;

  static BYTES_PER_BLOCK = 1;
  constructor (options: WorldCreateOptions = DefaultWorldCreateOptions) {
    this.data = new ArrayBuffer(options.width * options.height * World.BYTES_PER_BLOCK);
    this.dataView = new DataView(this.data);

    this.width = options.width;
    this.height = options.height;

    this._t_blockLoc = new Location ();
    this._t_blockData = new BlockData();
  }
  getBlock(x: number, z: number, bd: BlockData): BlockData {
    this._t_blockLoc.world = this;
    this._t_blockLoc.x = x;
    this._t_blockLoc.z = z;
    bd.setLocation(this._t_blockLoc);
    if (bd.index < 0 || bd.index > this.dataView.byteLength-1) {
      bd.setType(0); //Set to air for now
    } else {
      bd.setType(this.dataView.getUint8(bd.index));
    }
    return bd;
  }
  setBlock (x: number, z: number, bd: BlockData): World {
    this._t_blockLoc.world = this;
    this._t_blockLoc.x = x;
    this._t_blockLoc.z = z;
    bd.setLocation(this._t_blockLoc);
    if (bd.index < 0 || bd.index > this.dataView.byteLength-1) {
      //Can't do that, john
    } else {
      this.dataView.setUint8(bd.index, bd.type);
    }
    return this;
  }
  setBlockType (x: number, z: number, type: number): World {
    this._t_blockLoc.world = this;
    this._t_blockLoc.x = x;
    this._t_blockLoc.z = z;
    this._t_blockData.setLocation(this._t_blockLoc);
    this._t_blockData.setType(type);
    this.dataView.setUint8(this._t_blockData.index, this._t_blockData.type);
    return this;
  }
}
