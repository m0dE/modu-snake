"use strict";
var SnakeGame = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/game.ts
  var game_exports = {};
  __export(game_exports, {
    initGame: () => initGame
  });

  // ../../engine/src/math/fixed.ts
  var FP_SHIFT = 16;
  var FP_ONE = 1 << FP_SHIFT;
  var FP_HALF = FP_ONE >> 1;
  var FP_PI = 205887;
  var FP_2PI = 411775;
  var FP_HALF_PI = 102944;
  function toFixed(f) {
    return Math.round(f * FP_ONE);
  }
  function toFloat(fp) {
    return fp / FP_ONE;
  }
  function fpMul(a, b) {
    return Number(BigInt(a) * BigInt(b) >> BigInt(FP_SHIFT));
  }
  function fpDiv(a, b) {
    if (b === 0)
      return a >= 0 ? 2147483647 : -2147483647;
    return Number((BigInt(a) << BigInt(FP_SHIFT)) / BigInt(b));
  }
  function fpAbs(a) {
    return a < 0 ? -a : a;
  }
  function fpMin(a, b) {
    return a < b ? a : b;
  }
  function fpMax(a, b) {
    return a > b ? a : b;
  }
  function fpSqrt(a) {
    if (a <= 0)
      return 0;
    const scaled = BigInt(a) * BigInt(FP_ONE);
    if (scaled <= 0n)
      return 0;
    let bitLen = 0n;
    let temp = scaled;
    while (temp > 0n) {
      bitLen++;
      temp >>= 1n;
    }
    let x = 1n << (bitLen >> 1n);
    if (x === 0n)
      x = 1n;
    let prevX = 0n;
    for (let i = 0; i < 30; i++) {
      const xNew = x + scaled / x >> 1n;
      if (xNew === x || xNew === prevX)
        break;
      prevX = x;
      x = xNew;
    }
    while (x * x > scaled)
      x--;
    while ((x + 1n) * (x + 1n) <= scaled)
      x++;
    return Number(x);
  }
  function dSqrt(x) {
    return toFloat(fpSqrt(toFixed(x)));
  }
  var SIN_TABLE_SIZE = 256;
  var SIN_TABLE = [
    0,
    402,
    804,
    1206,
    1608,
    2010,
    2412,
    2814,
    3216,
    3617,
    4019,
    4420,
    4821,
    5222,
    5623,
    6023,
    6424,
    6824,
    7224,
    7623,
    8022,
    8421,
    8820,
    9218,
    9616,
    10014,
    10411,
    10808,
    11204,
    11600,
    11996,
    12391,
    12785,
    13180,
    13573,
    13966,
    14359,
    14751,
    15143,
    15534,
    15924,
    16314,
    16703,
    17091,
    17479,
    17867,
    18253,
    18639,
    19024,
    19409,
    19792,
    20175,
    20557,
    20939,
    21320,
    21699,
    22078,
    22457,
    22834,
    23210,
    23586,
    23961,
    24335,
    24708,
    25080,
    25451,
    25821,
    26190,
    26558,
    26925,
    27291,
    27656,
    28020,
    28383,
    28745,
    29106,
    29466,
    29824,
    30182,
    30538,
    30893,
    31248,
    31600,
    31952,
    32303,
    32652,
    33e3,
    33347,
    33692,
    34037,
    34380,
    34721,
    35062,
    35401,
    35738,
    36075,
    36410,
    36744,
    37076,
    37407,
    37736,
    38064,
    38391,
    38716,
    39040,
    39362,
    39683,
    40002,
    40320,
    40636,
    40951,
    41264,
    41576,
    41886,
    42194,
    42501,
    42806,
    43110,
    43412,
    43713,
    44011,
    44308,
    44604,
    44898,
    45190,
    45480,
    45769,
    46056,
    46341,
    46624,
    46906,
    47186,
    47464,
    47741,
    48015,
    48288,
    48559,
    48828,
    49095,
    49361,
    49624,
    49886,
    50146,
    50404,
    50660,
    50914,
    51166,
    51417,
    51665,
    51911,
    52156,
    52398,
    52639,
    52878,
    53114,
    53349,
    53581,
    53812,
    54040,
    54267,
    54491,
    54714,
    54934,
    55152,
    55368,
    55582,
    55794,
    56004,
    56212,
    56418,
    56621,
    56823,
    57022,
    57219,
    57414,
    57607,
    57798,
    57986,
    58172,
    58356,
    58538,
    58718,
    58896,
    59071,
    59244,
    59415,
    59583,
    59750,
    59914,
    60075,
    60235,
    60392,
    60547,
    60700,
    60851,
    60999,
    61145,
    61288,
    61429,
    61568,
    61705,
    61839,
    61971,
    62101,
    62228,
    62353,
    62476,
    62596,
    62714,
    62830,
    62943,
    63054,
    63162,
    63268,
    63372,
    63473,
    63572,
    63668,
    63763,
    63854,
    63944,
    64031,
    64115,
    64197,
    64277,
    64354,
    64429,
    64501,
    64571,
    64639,
    64704,
    64766,
    64827,
    64884,
    64940,
    64993,
    65043,
    65091,
    65137,
    65180,
    65220,
    65259,
    65294,
    65328,
    65358,
    65387,
    65413,
    65436,
    65457,
    65476,
    65492,
    65505,
    65516,
    65525,
    65531,
    65535,
    65536
    // sin(PI/2) = 1.0 = FP_ONE
  ];
  var FP_ANGLE_TO_INDEX = 10680707;
  function fpSin(angle) {
    if (angle < 0) {
      const periods = (-angle / FP_2PI | 0) + 1;
      angle += periods * FP_2PI;
    }
    if (angle >= FP_2PI) {
      angle = angle % FP_2PI;
    }
    let quadrant = 0;
    if (angle >= FP_PI) {
      angle -= FP_PI;
      quadrant = 2;
    }
    if (angle >= FP_HALF_PI) {
      angle = FP_PI - angle;
      quadrant += 1;
    }
    const indexFp = fpMul(angle, FP_ANGLE_TO_INDEX);
    const index = indexFp >> FP_SHIFT;
    const frac = indexFp & FP_ONE - 1;
    const clampedIndex = index < 0 ? 0 : index > SIN_TABLE_SIZE ? SIN_TABLE_SIZE : index;
    const nextIndex = index + 1;
    const clampedIndexNext = nextIndex < 0 ? 0 : nextIndex > SIN_TABLE_SIZE ? SIN_TABLE_SIZE : nextIndex;
    const a = SIN_TABLE[clampedIndex] ?? 0;
    const b = SIN_TABLE[clampedIndexNext] ?? FP_ONE;
    let result = a + fpMul(b - a, frac);
    if (quadrant >= 2)
      result = -result;
    return result;
  }
  function fpCos(angle) {
    return fpSin(angle + FP_HALF_PI);
  }

  // ../../engine/src/math/random.ts
  var s0 = 1;
  var s1 = 2;
  function next() {
    let x = s0;
    const y = s1;
    s0 = y;
    x ^= x << 23 >>> 0;
    x ^= x >>> 17;
    x ^= y;
    x ^= y >>> 26;
    s1 = x >>> 0;
    return s0 + s1 >>> 0;
  }
  function setSeed(seed) {
    seed = seed >>> 0;
    if (seed === 0)
      seed = 1;
    let s = seed;
    s = (s >>> 16 ^ s) * 73244475 >>> 0;
    s = (s >>> 16 ^ s) * 73244475 >>> 0;
    s0 = (s >>> 16 ^ s) >>> 0;
    s = seed * 2654435769 >>> 0;
    s = (s >>> 16 ^ s) * 73244475 >>> 0;
    s = (s >>> 16 ^ s) * 73244475 >>> 0;
    s1 = (s >>> 16 ^ s) >>> 0;
    if (s0 === 0 && s1 === 0)
      s0 = 1;
  }
  function dRandom() {
    return next() / 4294967296;
  }
  function saveRandomState() {
    return { s0, s1 };
  }
  function loadRandomState(state) {
    s0 = state.s0;
    s1 = state.s1;
  }
  setSeed(1);

  // ../../engine/src/core/constants.ts
  var MAX_ENTITIES = 1e4;
  var GENERATION_BITS = 12;
  var INDEX_BITS = 20;
  var INDEX_MASK = (1 << INDEX_BITS) - 1;
  var MAX_GENERATION = (1 << GENERATION_BITS) - 1;
  var SYSTEM_PHASES = [
    "input",
    "update",
    "prePhysics",
    "physics",
    "postPhysics",
    "render"
  ];

  // ../../engine/src/core/component.ts
  function inferFieldDef(value) {
    if (typeof value === "object" && value !== null && "type" in value) {
      const def = value;
      if (def.type === "f32") {
        console.warn(
          `Component field uses f32 which is NON-DETERMINISTIC. Only use for render-only data, never for synced state.`
        );
      }
      return {
        type: def.type,
        default: def.default ?? (def.type === "bool" ? false : 0)
      };
    }
    if (typeof value === "boolean") {
      return { type: "bool", default: value };
    }
    if (typeof value === "number") {
      return { type: "i32", default: value };
    }
    if (value === null || value === void 0) {
      return { type: "i32", default: 0 };
    }
    throw new Error(
      `Unsupported field type: ${typeof value}. Components can only contain numbers and booleans. Use game.internString() for string values.`
    );
  }
  function createFieldArray(type) {
    switch (type) {
      case "i32":
        return new Int32Array(MAX_ENTITIES);
      case "u8":
      case "bool":
        return new Uint8Array(MAX_ENTITIES);
      case "f32":
        return new Float32Array(MAX_ENTITIES);
      default:
        throw new Error(`Unknown field type: ${type}`);
    }
  }
  function createComponentStorage(schema) {
    const fields = {};
    for (const [name, def] of Object.entries(schema)) {
      fields[name] = createFieldArray(def.type);
    }
    return {
      mask: new Uint32Array(Math.ceil(MAX_ENTITIES / 32)),
      fields,
      schema
    };
  }
  function generateAccessorClass(name, schema, storage) {
    const AccessorClass = function(index) {
      this._index = index;
    };
    AccessorClass.prototype = {};
    for (const [fieldName, fieldDef] of Object.entries(schema)) {
      const fieldArray = storage.fields[fieldName];
      const isFixedPoint = fieldDef.type === "i32";
      const isBool = fieldDef.type === "bool";
      Object.defineProperty(AccessorClass.prototype, fieldName, {
        get: function() {
          const value = fieldArray[this._index];
          if (isBool)
            return value !== 0;
          if (isFixedPoint)
            return toFloat(value);
          return value;
        },
        set: function(value) {
          if (isBool) {
            fieldArray[this._index] = value ? 1 : 0;
          } else if (isFixedPoint) {
            fieldArray[this._index] = toFixed(value);
          } else {
            fieldArray[this._index] = value;
          }
        },
        enumerable: true,
        configurable: false
      });
    }
    Object.defineProperty(AccessorClass.prototype, "_index", {
      value: 0,
      writable: true,
      enumerable: false,
      configurable: false
    });
    return AccessorClass;
  }
  var componentRegistry = /* @__PURE__ */ new Map();
  function defineComponent(name, defaults, options) {
    if (componentRegistry.has(name)) {
      throw new Error(`Component '${name}' is already defined`);
    }
    const schema = {};
    for (const [fieldName, defaultValue] of Object.entries(defaults)) {
      schema[fieldName] = inferFieldDef(defaultValue);
    }
    const storage = createComponentStorage(schema);
    const AccessorClass = generateAccessorClass(name, schema, storage);
    const componentType = {
      name,
      schema,
      storage,
      AccessorClass,
      fieldNames: Object.keys(schema),
      sync: options?.sync !== false
      // Default to true
    };
    componentRegistry.set(name, componentType);
    return componentType;
  }
  function hasComponent(storage, index) {
    const word = index >>> 5;
    const bit = 1 << (index & 31);
    return (storage.mask[word] & bit) !== 0;
  }
  function addComponentToEntity(storage, index) {
    const word = index >>> 5;
    const bit = 1 << (index & 31);
    storage.mask[word] |= bit;
  }
  function removeComponentFromEntity(storage, index) {
    const word = index >>> 5;
    const bit = 1 << (index & 31);
    storage.mask[word] &= ~bit;
  }
  function initializeComponentDefaults(storage, index) {
    for (const [fieldName, fieldDef] of Object.entries(storage.schema)) {
      const arr = storage.fields[fieldName];
      if (fieldDef.type === "i32") {
        arr[index] = toFixed(fieldDef.default);
      } else if (fieldDef.type === "bool") {
        arr[index] = fieldDef.default ? 1 : 0;
      } else {
        arr[index] = fieldDef.default;
      }
    }
  }
  function getAllComponents() {
    return componentRegistry;
  }

  // ../../engine/src/core/entity-id.ts
  var EntityIdAllocator = class {
    constructor() {
      /** Free list of available indices (sorted ascending for determinism) */
      this.freeList = [];
      /** Next index to allocate if free list is empty */
      this.nextIndex = 0;
      this.generations = new Uint16Array(MAX_ENTITIES);
    }
    /**
     * Allocate a new entity ID.
     * Returns entity ID with generation encoded.
     */
    allocate() {
      let index;
      if (this.freeList.length > 0) {
        index = this.freeList.shift();
      } else {
        if (this.nextIndex >= MAX_ENTITIES) {
          throw new Error(
            `Entity limit exceeded (MAX_ENTITIES=${MAX_ENTITIES}). Consider destroying unused entities or increasing the limit.`
          );
        }
        index = this.nextIndex++;
      }
      const generation = this.generations[index];
      return generation << INDEX_BITS | index;
    }
    /**
     * Free an entity ID, returning it to the pool.
     * Increments generation to invalidate stale references.
     */
    free(eid) {
      const index = eid & INDEX_MASK;
      this.generations[index] = this.generations[index] + 1 & MAX_GENERATION;
      const insertIdx = this.findInsertIndex(index);
      this.freeList.splice(insertIdx, 0, index);
    }
    /**
     * Check if an entity ID is still valid (generation matches).
     */
    isValid(eid) {
      const index = eid & INDEX_MASK;
      const generation = eid >>> INDEX_BITS;
      return index < this.nextIndex && this.generations[index] === generation;
    }
    /**
     * Get the index portion of an entity ID.
     */
    getIndex(eid) {
      return eid & INDEX_MASK;
    }
    /**
     * Get the generation portion of an entity ID.
     */
    getGeneration(eid) {
      return eid >>> INDEX_BITS;
    }
    /**
     * Get current state for snapshotting.
     */
    getState() {
      return {
        nextIndex: this.nextIndex,
        freeList: [...this.freeList],
        generations: Array.from(this.generations.slice(0, this.nextIndex))
      };
    }
    /**
     * Restore state from snapshot.
     */
    setState(state) {
      this.nextIndex = state.nextIndex;
      this.freeList = [...state.freeList];
      for (let i = 0; i < state.generations.length; i++) {
        this.generations[i] = state.generations[i];
      }
    }
    /**
     * Reset allocator to initial state.
     */
    reset() {
      this.nextIndex = 0;
      this.freeList = [];
      this.generations.fill(0);
    }
    /**
     * Get number of active entities.
     */
    getActiveCount() {
      return this.nextIndex - this.freeList.length;
    }
    /**
     * Binary search to find insert position for sorted free list.
     */
    /**
     * Get next ID that will be allocated (for snapshots).
     */
    getNextId() {
      return this.nextIndex;
    }
    /**
     * Set next ID (for snapshot restore).
     */
    setNextId(id) {
      this.nextIndex = id;
    }
    /**
     * Allocate a specific entity ID (for snapshot restore).
     * This bypasses normal allocation and marks the specific eid as used.
     * Returns the requested eid.
     */
    allocateSpecific(eid) {
      const index = eid & INDEX_MASK;
      const generation = eid >>> INDEX_BITS;
      if (index >= this.nextIndex) {
        this.nextIndex = index + 1;
      }
      const freeIdx = this.freeList.indexOf(index);
      if (freeIdx !== -1) {
        this.freeList.splice(freeIdx, 1);
      }
      this.generations[index] = generation;
      return eid;
    }
    findInsertIndex(index) {
      let lo = 0;
      let hi = this.freeList.length;
      while (lo < hi) {
        const mid = lo + hi >>> 1;
        if (this.freeList[mid] < index) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      return lo;
    }
  };

  // ../../engine/src/components/index.ts
  var Transform2D = defineComponent("Transform2D", {
    x: 0,
    y: 0,
    angle: 0
  });
  var Body2D = defineComponent("Body2D", {
    // Velocity
    vx: 0,
    vy: 0,
    // Angular velocity
    angularVelocity: 0,
    // Force accumulator (added to velocity each frame, then cleared)
    forceX: 0,
    forceY: 0,
    // Impulse accumulator (added to velocity once, then cleared)
    impulseX: 0,
    impulseY: 0,
    // Size (use width/height OR radius)
    width: 0,
    height: 0,
    radius: 0,
    // Physics properties
    mass: 1,
    restitution: 0,
    // Bounciness (0-1)
    friction: 0,
    // Body type: 0=dynamic, 1=static, 2=kinematic
    bodyType: 0,
    // Shape type: 0=rect, 1=circle
    shapeType: 1,
    // Is sensor (no collision response, just events)
    damping: 0,
    isSensor: false
  });
  var Player = defineComponent("Player", {
    clientId: 0
    // Interned clientId string
  });
  var Sprite = defineComponent("Sprite", {
    // Shape type: 0=rect, 1=circle, 2=image
    shape: 1,
    // Default circle
    // Size (for shapes)
    width: 0,
    height: 0,
    radius: 10,
    // Color (interned string ID, e.g., '#ff0000')
    color: 0,
    // Image sprite ID (interned string, for shape=SPRITE_IMAGE)
    spriteId: 0,
    // Render offset from transform position
    offsetX: 0,
    offsetY: 0,
    // Scale
    scaleX: 1,
    scaleY: 1,
    // Layer for z-ordering (higher = in front)
    layer: 0,
    // Visibility
    visible: true
  });
  var SPRITE_IMAGE = 2;
  var Camera2D = defineComponent("Camera2D", {
    // Position (world coordinates the camera is centered on)
    x: 0,
    y: 0,
    // Zoom level (1 = normal, >1 = zoomed in, <1 = zoomed out)
    zoom: 1,
    // Target zoom for smooth transitions
    targetZoom: 1,
    // Smoothing factor for position interpolation (0-1, higher = snappier)
    smoothing: 0.1,
    // Optional: follow entity ID (0 = no target)
    followEntity: 0,
    // Viewport bounds (set by renderer)
    viewportWidth: 0,
    viewportHeight: 0
  }, { sync: false });
  var BODY_STATIC = 1;
  var BODY_KINEMATIC = 2;
  var SHAPE_RECT = 0;
  var SHAPE_CIRCLE = 1;

  // ../../engine/src/core/entity.ts
  var Entity = class {
    constructor() {
      /** Entity ID (includes generation) */
      this.eid = -1;
      /** Entity type name */
      this.type = "";
      /** Whether entity is destroyed */
      this.destroyed = false;
      /** Render-only state (client-only, never serialized) */
      this.render = {
        prevX: 0,
        prevY: 0,
        interpX: 0,
        interpY: 0,
        screenX: 0,
        screenY: 0,
        visible: true
      };
      /** Component types this entity has */
      this._components = [];
      /** Cached accessor instances */
      this._accessors = /* @__PURE__ */ new Map();
      /** Reference to world for operations */
      this._world = null;
      /** Current frame's input data (set during tick) */
      this._inputData = null;
    }
    /**
     * Get component accessor.
     * Returns typed accessor for reading/writing component data.
     */
    get(component) {
      const index = this.eid & INDEX_MASK;
      if (!hasComponent(component.storage, index)) {
        throw new Error(
          `Entity ${this.eid} (type: ${this.type}) does not have component '${component.name}'`
        );
      }
      let accessor = this._accessors.get(component);
      if (!accessor) {
        accessor = new component.AccessorClass(index);
        this._accessors.set(component, accessor);
      } else {
        accessor._index = index;
      }
      return accessor;
    }
    /**
     * Check if entity has a component.
     */
    has(component) {
      return hasComponent(component.storage, this.eid & INDEX_MASK);
    }
    /**
     * Add a component to this entity at runtime.
     */
    addComponent(component, data) {
      const index = this.eid & INDEX_MASK;
      if (hasComponent(component.storage, index)) {
        throw new Error(
          `Entity ${this.eid} already has component '${component.name}'`
        );
      }
      addComponentToEntity(component.storage, index);
      initializeComponentDefaults(component.storage, index);
      this._components.push(component);
      if (this._world) {
        this._world.queryEngine.addComponent(this.eid, component);
      }
      const accessor = this.get(component);
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          accessor[key] = value;
        }
      }
      return accessor;
    }
    /**
     * Remove a component from this entity at runtime.
     */
    removeComponent(component) {
      const index = this.eid & INDEX_MASK;
      if (!hasComponent(component.storage, index)) {
        throw new Error(
          `Entity ${this.eid} does not have component '${component.name}'`
        );
      }
      removeComponentFromEntity(component.storage, index);
      const idx = this._components.indexOf(component);
      if (idx !== -1) {
        this._components.splice(idx, 1);
      }
      if (this._world) {
        this._world.queryEngine.removeComponent(this.eid, component);
      }
      this._accessors.delete(component);
    }
    /**
     * Destroy this entity.
     */
    destroy() {
      if (this.destroyed)
        return;
      this.destroyed = true;
      if (this._world) {
        this._world.destroyEntity(this);
      }
    }
    /**
     * Get all components on this entity.
     */
    getComponents() {
      return [...this._components];
    }
    /**
     * Get current frame's input data.
     * Returns null if no input was received this tick.
     */
    get input() {
      return this._inputData;
    }
    /**
     * Set input data for this tick (called by World).
     */
    _setInputData(data) {
      this._inputData = data;
    }
    /**
     * Save current position to render.prev* for interpolation.
     * Should be called in prePhysics phase before physics updates position.
     */
    _savePreviousState() {
      for (const component of this._components) {
        const index = this.eid & INDEX_MASK;
        if ("x" in component.storage.fields && "y" in component.storage.fields) {
          const xArr = component.storage.fields["x"];
          const yArr = component.storage.fields["y"];
          this.render.prevX = toFloat(xArr[index]);
          this.render.prevY = toFloat(yArr[index]);
          return;
        }
      }
    }
    /**
     * Calculate interpolated position for rendering.
     * @param alpha Interpolation factor (0-1) between previous and current state
     */
    interpolate(alpha) {
      for (const component of this._components) {
        const index = this.eid & INDEX_MASK;
        if ("x" in component.storage.fields && "y" in component.storage.fields) {
          const currentX = toFloat(component.storage.fields["x"][index]);
          const currentY = toFloat(component.storage.fields["y"][index]);
          this.render.interpX = this.render.prevX + (currentX - this.render.prevX) * alpha;
          this.render.interpY = this.render.prevY + (currentY - this.render.prevY) * alpha;
          return;
        }
      }
    }
    /**
     * Initialize entity (called by world).
     */
    _init(eid, type, components, world) {
      this.eid = eid;
      this.type = type;
      this.destroyed = false;
      this._components = components;
      this._world = world;
      this._accessors.clear();
      this.render.prevX = 0;
      this.render.prevY = 0;
      this.render.interpX = 0;
      this.render.interpY = 0;
      this.render.screenX = 0;
      this.render.screenY = 0;
      this.render.visible = true;
      this._inputData = null;
    }
    /**
     * Clean up entity (called when returned to pool).
     */
    _cleanup() {
      this._world = null;
      this._components = [];
      this._accessors.clear();
      this._inputData = null;
    }
    // ==========================================
    // Movement Helpers (Deterministic)
    // ==========================================
    /**
     * Set velocity toward a target point.
     * Uses fixed-point math internally for determinism.
     *
     * @param target Target position {x, y}
     * @param speed Speed in units per second
     */
    moveTowards(target, speed) {
      if (!this.has(Transform2D) || !this.has(Body2D))
        return;
      const transform = this.get(Transform2D);
      const body = this.get(Body2D);
      const dx = toFixed(target.x) - toFixed(transform.x);
      const dy = toFixed(target.y) - toFixed(transform.y);
      const distSq = fpMul(dx, dx) + fpMul(dy, dy);
      if (distSq === 0) {
        body.vx = 0;
        body.vy = 0;
        return;
      }
      const dist = fpSqrt(distSq);
      const speedFp = toFixed(speed * 60);
      body.vx = toFloat(fpDiv(fpMul(dx, speedFp), dist));
      body.vy = toFloat(fpDiv(fpMul(dy, speedFp), dist));
    }
    /**
     * Stop all movement.
     */
    stop() {
      if (!this.has(Body2D))
        return;
      const body = this.get(Body2D);
      body.vx = 0;
      body.vy = 0;
    }
    /**
     * Set velocity directly.
     *
     * @param vx X velocity
     * @param vy Y velocity
     */
    setVelocity(vx, vy) {
      if (!this.has(Body2D))
        return;
      const body = this.get(Body2D);
      body.vx = vx;
      body.vy = vy;
    }
    /**
     * Get distance to a point (deterministic).
     */
    distanceTo(target) {
      if (!this.has(Transform2D))
        return 0;
      const transform = this.get(Transform2D);
      const dx = toFixed(target.x) - toFixed(transform.x);
      const dy = toFixed(target.y) - toFixed(transform.y);
      const distSq = fpMul(dx, dx) + fpMul(dy, dy);
      return toFloat(fpSqrt(distSq));
    }
    /**
     * Check if within distance of a point (deterministic).
     */
    isWithin(target, distance) {
      if (!this.has(Transform2D))
        return false;
      const transform = this.get(Transform2D);
      const dx = toFixed(target.x) - toFixed(transform.x);
      const dy = toFixed(target.y) - toFixed(transform.y);
      const distSq = fpMul(dx, dx) + fpMul(dy, dy);
      const distFp = toFixed(distance);
      const distSqThreshold = fpMul(distFp, distFp);
      return distSq <= distSqThreshold;
    }
  };
  var EntityPool = class {
    constructor() {
      this.pool = [];
      this.active = /* @__PURE__ */ new Map();
    }
    /**
     * Get or create an entity wrapper.
     */
    acquire(eid) {
      let entity = this.active.get(eid);
      if (entity) {
        return entity;
      }
      entity = this.pool.pop() || new Entity();
      this.active.set(eid, entity);
      return entity;
    }
    /**
     * Return entity wrapper to pool.
     */
    release(eid) {
      const entity = this.active.get(eid);
      if (entity) {
        entity._cleanup();
        this.active.delete(eid);
        this.pool.push(entity);
      }
    }
    /**
     * Get entity by eid if it exists.
     */
    get(eid) {
      return this.active.get(eid);
    }
    /**
     * Check if entity exists.
     */
    has(eid) {
      return this.active.has(eid);
    }
    /**
     * Clear all entities.
     */
    clear() {
      for (const entity of this.active.values()) {
        entity._cleanup();
        this.pool.push(entity);
      }
      this.active.clear();
    }
    /**
     * Get count of active entities.
     */
    get size() {
      return this.active.size;
    }
  };

  // ../../engine/src/core/query.ts
  var QueryIterator = class {
    constructor(matchingEids, getEntity, isDestroyed) {
      this.index = 0;
      this.eids = matchingEids.slice();
      this.getEntity = getEntity;
      this.isDestroyed = isDestroyed;
    }
    [Symbol.iterator]() {
      this.index = 0;
      return {
        next: () => {
          while (this.index < this.eids.length) {
            const eid = this.eids[this.index++];
            if (this.isDestroyed(eid))
              continue;
            const entity = this.getEntity(eid);
            if (entity) {
              return { done: false, value: entity };
            }
          }
          return { done: true, value: void 0 };
        }
      };
    }
    /**
     * Convert to array (allocates).
     */
    toArray() {
      const result = [];
      for (const entity of this) {
        result.push(entity);
      }
      return result;
    }
    /**
     * Get first matching entity.
     */
    first() {
      for (const entity of this) {
        return entity;
      }
      return null;
    }
    /**
     * Find entity matching predicate.
     */
    find(predicate) {
      for (const entity of this) {
        if (predicate(entity)) {
          return entity;
        }
      }
      return null;
    }
    /**
     * Count entities without allocating array.
     */
    count() {
      let count = 0;
      for (const _ of this) {
        count++;
      }
      return count;
    }
  };
  var QueryEngine = class {
    constructor(getEntity, isDestroyed) {
      /** Type index: entity type -> set of eids */
      this.typeIndex = /* @__PURE__ */ new Map();
      /** Component index: component -> set of eids */
      this.componentIndex = /* @__PURE__ */ new Map();
      /** Client ID index: clientId -> eid (O(1) lookup) */
      this.clientIdIndex = /* @__PURE__ */ new Map();
      this.getEntity = getEntity;
      this.isDestroyed = isDestroyed;
    }
    /**
     * Register an entity in the indices.
     */
    addEntity(eid, type, components, clientId) {
      let typeSet = this.typeIndex.get(type);
      if (!typeSet) {
        typeSet = /* @__PURE__ */ new Set();
        this.typeIndex.set(type, typeSet);
      }
      typeSet.add(eid);
      for (const component of components) {
        let compSet = this.componentIndex.get(component);
        if (!compSet) {
          compSet = /* @__PURE__ */ new Set();
          this.componentIndex.set(component, compSet);
        }
        compSet.add(eid);
      }
      if (clientId !== void 0) {
        this.clientIdIndex.set(clientId, eid);
      }
    }
    /**
     * Remove an entity from all indices.
     */
    removeEntity(eid, type, components, clientId) {
      this.typeIndex.get(type)?.delete(eid);
      for (const component of components) {
        this.componentIndex.get(component)?.delete(eid);
      }
      if (clientId !== void 0) {
        this.clientIdIndex.delete(clientId);
      }
    }
    /**
     * Add component to an existing entity.
     */
    addComponent(eid, component) {
      let compSet = this.componentIndex.get(component);
      if (!compSet) {
        compSet = /* @__PURE__ */ new Set();
        this.componentIndex.set(component, compSet);
      }
      compSet.add(eid);
    }
    /**
     * Remove component from an existing entity.
     */
    removeComponent(eid, component) {
      this.componentIndex.get(component)?.delete(eid);
    }
    /**
     * Update clientId mapping for an entity.
     */
    setClientId(eid, clientId) {
      this.clientIdIndex.set(clientId, eid);
    }
    /**
     * Remove clientId mapping.
     */
    removeClientId(clientId) {
      this.clientIdIndex.delete(clientId);
    }
    /**
     * Query by entity type.
     */
    byType(type) {
      const typeSet = this.typeIndex.get(type);
      const eids = typeSet ? this.sortedEids(typeSet) : [];
      return new QueryIterator(eids, this.getEntity, this.isDestroyed);
    }
    /**
     * Query by component(s) - entities must have ALL specified components.
     */
    byComponents(...components) {
      if (components.length === 0) {
        return new QueryIterator([], this.getEntity, this.isDestroyed);
      }
      let smallestSet;
      let smallestSize = Infinity;
      for (const component of components) {
        const compSet = this.componentIndex.get(component);
        if (!compSet || compSet.size === 0) {
          return new QueryIterator([], this.getEntity, this.isDestroyed);
        }
        if (compSet.size < smallestSize) {
          smallestSize = compSet.size;
          smallestSet = compSet;
        }
      }
      if (!smallestSet) {
        return new QueryIterator([], this.getEntity, this.isDestroyed);
      }
      const result = [];
      for (const eid of smallestSet) {
        let hasAll = true;
        for (const component of components) {
          if (component.storage && !hasComponent(component.storage, eid & INDEX_MASK)) {
            hasAll = false;
            break;
          }
        }
        if (hasAll) {
          result.push(eid);
        }
      }
      result.sort((a, b) => a - b);
      return new QueryIterator(result, this.getEntity, this.isDestroyed);
    }
    /**
     * Query by type or component.
     */
    query(typeOrComponent, ...moreComponents) {
      if (typeof typeOrComponent === "string") {
        if (moreComponents.length > 0) {
          const typeSet = this.typeIndex.get(typeOrComponent);
          if (!typeSet || typeSet.size === 0) {
            return new QueryIterator([], this.getEntity, this.isDestroyed);
          }
          const result = [];
          for (const eid of typeSet) {
            let hasAll = true;
            for (const component of moreComponents) {
              if (component.storage && !hasComponent(component.storage, eid & INDEX_MASK)) {
                hasAll = false;
                break;
              }
            }
            if (hasAll) {
              result.push(eid);
            }
          }
          result.sort((a, b) => a - b);
          return new QueryIterator(result, this.getEntity, this.isDestroyed);
        }
        return this.byType(typeOrComponent);
      }
      return this.byComponents(typeOrComponent, ...moreComponents);
    }
    /**
     * O(1) lookup by clientId.
     */
    getByClientId(clientId) {
      return this.clientIdIndex.get(clientId);
    }
    /**
     * Get all entity IDs (sorted for determinism).
     */
    getAllEids() {
      const allEids = /* @__PURE__ */ new Set();
      for (const typeSet of this.typeIndex.values()) {
        for (const eid of typeSet) {
          allEids.add(eid);
        }
      }
      return Array.from(allEids).sort((a, b) => a - b);
    }
    /**
     * Clear all indices (for reset).
     */
    clear() {
      this.typeIndex.clear();
      this.componentIndex.clear();
      this.clientIdIndex.clear();
    }
    /**
     * Get sorted eids from a set (for deterministic iteration).
     */
    sortedEids(set) {
      return Array.from(set).sort((a, b) => a - b);
    }
  };

  // ../../engine/src/core/system.ts
  var SystemScheduler = class {
    constructor() {
      /** Systems organized by phase */
      this.systems = /* @__PURE__ */ new Map();
      /** Whether we're running on client or server */
      this.isClient = true;
      /** System ID counter for ordering */
      this.nextSystemId = 0;
      for (const phase of SYSTEM_PHASES) {
        this.systems.set(phase, []);
      }
    }
    /**
     * Set whether this scheduler is running on client or server.
     */
    setIsClient(isClient) {
      this.isClient = isClient;
    }
    /**
     * Add a system to the scheduler.
     *
     * @param fn System function to execute
     * @param options System options (phase, client/server, order)
     * @returns Function to remove the system
     */
    add(fn, options = {}) {
      const phase = options.phase || "update";
      const systems = this.systems.get(phase);
      if (!systems) {
        throw new Error(`Unknown system phase: ${phase}`);
      }
      const entry = {
        fn,
        options,
        order: options.order ?? this.nextSystemId++
      };
      systems.push(entry);
      systems.sort((a, b) => a.order - b.order);
      return () => this.remove(fn);
    }
    /**
     * Remove a system from the scheduler.
     */
    remove(fn) {
      for (const systems of this.systems.values()) {
        const index = systems.findIndex((s) => s.fn === fn);
        if (index !== -1) {
          systems.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    /**
     * Run all systems in a specific phase.
     */
    runPhase(phase) {
      const systems = this.systems.get(phase);
      if (!systems)
        return;
      for (const system of systems) {
        if (system.options.client && !this.isClient)
          continue;
        if (system.options.server && this.isClient)
          continue;
        try {
          const result = system.fn();
          if (result && typeof result === "object" && "then" in result) {
            throw new Error(
              `System returned a Promise. Async systems are not allowed as they break determinism. Remove 'await' from your system.`
            );
          }
        } catch (error) {
          console.error(`Error in system during '${phase}' phase:`, error);
          throw error;
        }
      }
    }
    /**
     * Run all phases in order (except render if not client).
     */
    runAll() {
      for (const phase of SYSTEM_PHASES) {
        if (phase === "render" && !this.isClient)
          continue;
        this.runPhase(phase);
      }
    }
    /**
     * Get count of systems in each phase (for debugging).
     */
    getSystemCounts() {
      const counts = {};
      for (const [phase, systems] of this.systems) {
        counts[phase] = systems.length;
      }
      return counts;
    }
    /**
     * Clear all systems (for testing).
     */
    clear() {
      for (const systems of this.systems.values()) {
        systems.length = 0;
      }
      this.nextSystemId = 0;
    }
  };

  // ../../engine/src/core/snapshot.ts
  var SparseSnapshotCodec = class {
    /**
     * Encode world state to sparse snapshot.
     */
    encode(activeEids, getEntityType, getEntityClientId, getComponentsForEntity, allocatorState, stringsState, frame = 0, seq = 0, rng) {
      const entityMask = new Uint32Array(Math.ceil(MAX_ENTITIES / 32));
      const entityMeta = [];
      const sortedEids = [...activeEids].sort((a, b) => a - b);
      for (const eid of sortedEids) {
        const index = eid & INDEX_MASK;
        entityMask[index >>> 5] |= 1 << (index & 31);
        entityMeta.push({
          eid,
          type: getEntityType(eid),
          clientId: getEntityClientId(eid)
        });
      }
      const componentData = /* @__PURE__ */ new Map();
      const allComponents = getAllComponents();
      for (const [name, component] of allComponents) {
        if (!component.sync)
          continue;
        const fieldCount = component.fieldNames.length;
        if (fieldCount === 0)
          continue;
        let totalSize = 0;
        for (const fieldName of component.fieldNames) {
          const arr = component.storage.fields[fieldName];
          totalSize += sortedEids.length * arr.BYTES_PER_ELEMENT;
        }
        const buffer = new ArrayBuffer(totalSize);
        let offset = 0;
        for (const fieldName of component.fieldNames) {
          const sourceArr = component.storage.fields[fieldName];
          const bytesPerElement = sourceArr.BYTES_PER_ELEMENT;
          const packedArr = new sourceArr.constructor(
            buffer,
            offset,
            sortedEids.length
          );
          for (let i = 0; i < sortedEids.length; i++) {
            const index = sortedEids[i] & INDEX_MASK;
            packedArr[i] = sourceArr[index];
          }
          offset += sortedEids.length * bytesPerElement;
        }
        componentData.set(name, buffer);
      }
      return {
        frame,
        seq,
        entityMask,
        entityMeta,
        componentData,
        entityCount: sortedEids.length,
        allocator: allocatorState,
        strings: stringsState,
        rng
      };
    }
    /**
     * Decode sparse snapshot back to world state.
     */
    decode(snapshot, clearWorld, setAllocatorState, setStringsState, createEntity, setRng) {
      clearWorld();
      setAllocatorState(snapshot.allocator);
      setStringsState(snapshot.strings);
      if (snapshot.rng && setRng) {
        setRng(snapshot.rng);
      }
      const allComponents = getAllComponents();
      for (let i = 0; i < snapshot.entityMeta.length; i++) {
        const meta = snapshot.entityMeta[i];
        createEntity(meta.eid, meta.type, meta.clientId);
      }
      for (const [name, buffer] of snapshot.componentData) {
        const component = allComponents.get(name);
        if (!component)
          continue;
        let offset = 0;
        for (const fieldName of component.fieldNames) {
          const targetArr = component.storage.fields[fieldName];
          const bytesPerElement = targetArr.BYTES_PER_ELEMENT;
          const packedArr = new targetArr.constructor(
            buffer,
            offset,
            snapshot.entityCount
          );
          for (let i = 0; i < snapshot.entityMeta.length; i++) {
            const index = snapshot.entityMeta[i].eid & INDEX_MASK;
            targetArr[index] = packedArr[i];
          }
          offset += snapshot.entityCount * bytesPerElement;
        }
      }
    }
    /**
     * Calculate snapshot size in bytes.
     */
    getSize(snapshot) {
      let size = 0;
      size += snapshot.entityMask.byteLength;
      size += snapshot.entityMeta.length * 32;
      for (const buffer of snapshot.componentData.values()) {
        size += buffer.byteLength;
      }
      size += snapshot.allocator.freeList.length * 4;
      size += snapshot.allocator.generations.length * 2;
      return size;
    }
    /**
     * Serialize snapshot to binary for network transfer.
     */
    toBinary(snapshot) {
      const metaJson = JSON.stringify({
        frame: snapshot.frame,
        seq: snapshot.seq,
        entityMeta: snapshot.entityMeta,
        allocator: snapshot.allocator,
        strings: snapshot.strings,
        rng: snapshot.rng,
        componentNames: Array.from(snapshot.componentData.keys())
      });
      const metaBytes = new TextEncoder().encode(metaJson);
      const metaLength = metaBytes.length;
      let componentDataSize = 0;
      const componentSizes = [];
      for (const buffer2 of snapshot.componentData.values()) {
        componentSizes.push(buffer2.byteLength);
        componentDataSize += buffer2.byteLength;
      }
      const totalSize = 4 + metaLength + 4 + snapshot.entityMask.byteLength + componentDataSize;
      const buffer = new ArrayBuffer(totalSize);
      const view = new DataView(buffer);
      let offset = 0;
      view.setUint32(offset, metaLength, true);
      offset += 4;
      new Uint8Array(buffer, offset, metaLength).set(metaBytes);
      offset += metaLength;
      view.setUint32(offset, snapshot.entityMask.byteLength, true);
      offset += 4;
      new Uint8Array(buffer, offset, snapshot.entityMask.byteLength).set(
        new Uint8Array(snapshot.entityMask.buffer)
      );
      offset += snapshot.entityMask.byteLength;
      for (const compBuffer of snapshot.componentData.values()) {
        new Uint8Array(buffer, offset, compBuffer.byteLength).set(
          new Uint8Array(compBuffer)
        );
        offset += compBuffer.byteLength;
      }
      return buffer;
    }
    /**
     * Deserialize snapshot from binary.
     */
    fromBinary(buffer) {
      const view = new DataView(buffer);
      let offset = 0;
      const metaLength = view.getUint32(offset, true);
      offset += 4;
      const metaBytes = new Uint8Array(buffer, offset, metaLength);
      const metaJson = new TextDecoder().decode(metaBytes);
      const meta = JSON.parse(metaJson);
      offset += metaLength;
      const maskLength = view.getUint32(offset, true);
      offset += 4;
      const entityMask = new Uint32Array(
        buffer.slice(offset, offset + maskLength)
      );
      offset += maskLength;
      const componentData = /* @__PURE__ */ new Map();
      const allComponents = getAllComponents();
      for (const name of meta.componentNames) {
        const component = allComponents.get(name);
        if (!component)
          continue;
        let compSize = 0;
        for (const fieldName of component.fieldNames) {
          const arr = component.storage.fields[fieldName];
          compSize += meta.entityMeta.length * arr.BYTES_PER_ELEMENT;
        }
        const compBuffer = buffer.slice(offset, offset + compSize);
        componentData.set(name, compBuffer);
        offset += compSize;
      }
      return {
        frame: meta.frame,
        seq: meta.seq,
        entityMask,
        entityMeta: meta.entityMeta,
        componentData,
        entityCount: meta.entityMeta.length,
        allocator: meta.allocator,
        strings: meta.strings,
        rng: meta.rng
      };
    }
  };

  // ../../engine/src/core/string-registry.ts
  var StringRegistry = class {
    constructor() {
      this.stringToId = /* @__PURE__ */ new Map();
      this.idToString = /* @__PURE__ */ new Map();
      this.nextId = /* @__PURE__ */ new Map();
    }
    /**
     * Intern a string, get back an integer ID.
     * If the string was already interned, returns the existing ID.
     *
     * @param namespace - Category for the string (e.g., 'color', 'sprite')
     * @param str - The string to intern
     * @returns Integer ID for the string
     */
    intern(namespace, str) {
      let nsMap = this.stringToId.get(namespace);
      if (!nsMap) {
        nsMap = /* @__PURE__ */ new Map();
        this.stringToId.set(namespace, nsMap);
      }
      const existing = nsMap.get(str);
      if (existing !== void 0)
        return existing;
      const id = this.nextId.get(namespace) ?? 1;
      this.nextId.set(namespace, id + 1);
      nsMap.set(str, id);
      let idMap = this.idToString.get(namespace);
      if (!idMap) {
        idMap = /* @__PURE__ */ new Map();
        this.idToString.set(namespace, idMap);
      }
      idMap.set(id, str);
      return id;
    }
    /**
     * Look up string by ID.
     *
     * @param namespace - Category for the string
     * @param id - Integer ID to look up
     * @returns The original string, or null if not found
     */
    getString(namespace, id) {
      return this.idToString.get(namespace)?.get(id) ?? null;
    }
    /**
     * Get state for snapshotting.
     * Returns a serializable representation of all interned strings.
     */
    getState() {
      const tables = {};
      const nextIds = {};
      for (const [ns, nsMap] of this.stringToId) {
        tables[ns] = Object.fromEntries(nsMap);
        nextIds[ns] = this.nextId.get(ns) ?? 1;
      }
      return { tables, nextIds };
    }
    /**
     * Restore state from snapshot.
     * Replaces all current data with the snapshot state.
     */
    setState(state) {
      this.stringToId.clear();
      this.idToString.clear();
      this.nextId.clear();
      for (const [ns, table] of Object.entries(state.tables)) {
        const nsMap = new Map(Object.entries(table));
        this.stringToId.set(ns, nsMap);
        const idMap = /* @__PURE__ */ new Map();
        for (const [str, id] of nsMap) {
          idMap.set(id, str);
        }
        this.idToString.set(ns, idMap);
        this.nextId.set(ns, state.nextIds[ns] ?? 1);
      }
    }
    /**
     * Clear all data.
     */
    clear() {
      this.stringToId.clear();
      this.idToString.clear();
      this.nextId.clear();
    }
  };

  // ../../engine/src/core/input-history.ts
  var FrameInputImpl = class {
    constructor(frame) {
      this.frame = frame;
      this.inputs = /* @__PURE__ */ new Map();
      this.confirmed = false;
    }
    /**
     * Get inputs sorted by clientId for deterministic iteration.
     */
    getSortedInputs() {
      const entries = Array.from(this.inputs.entries());
      entries.sort((a, b) => a[0] - b[0]);
      return entries;
    }
  };
  var InputHistory = class {
    /**
     * Create InputHistory with optional max frame limit.
     * @param maxFrames Maximum frames to keep (default 120)
     */
    constructor(maxFrames = 120) {
      /** Stored frames: frame number -> FrameInput */
      this.history = /* @__PURE__ */ new Map();
      this.maxFrames = maxFrames;
    }
    /**
     * Store input for a frame from a client.
     * Used for local predictions before server confirmation.
     *
     * @param frame Frame number
     * @param clientId Client ID (numeric)
     * @param input Input data
     */
    setInput(frame, clientId, input2) {
      let frameInput = this.history.get(frame);
      if (!frameInput) {
        frameInput = new FrameInputImpl(frame);
        this.history.set(frame, frameInput);
      }
      frameInput.inputs.set(clientId, input2);
    }
    /**
     * Mark a frame as server-confirmed with authoritative inputs.
     * This replaces any local predictions with server-provided data.
     *
     * @param frame Frame number
     * @param inputs Map of clientId -> input data from server
     */
    confirmFrame(frame, inputs) {
      const frameInput = new FrameInputImpl(frame);
      frameInput.confirmed = true;
      for (const [clientId, data] of inputs) {
        frameInput.inputs.set(clientId, data);
      }
      this.history.set(frame, frameInput);
    }
    /**
     * Get input data for a specific frame.
     *
     * @param frame Frame number
     * @returns FrameInput or undefined if not found
     */
    getFrame(frame) {
      return this.history.get(frame);
    }
    /**
     * Get ordered frames for resimulation.
     * Returns frames in ascending order, skipping any missing frames.
     *
     * CRITICAL: Order must be deterministic for rollback to work.
     *
     * @param fromFrame Start frame (inclusive)
     * @param toFrame End frame (inclusive)
     * @returns Array of FrameInput in ascending frame order
     */
    getRange(fromFrame, toFrame) {
      if (fromFrame > toFrame) {
        return [];
      }
      const result = [];
      for (const [frame, frameInput] of this.history) {
        if (frame >= fromFrame && frame <= toFrame) {
          result.push(frameInput);
        }
      }
      result.sort((a, b) => a.frame - b.frame);
      return result;
    }
    /**
     * Remove frames before the specified frame number.
     * Called to limit memory usage.
     *
     * @param beforeFrame Remove all frames with frame < beforeFrame
     */
    prune(beforeFrame) {
      const toRemove = [];
      for (const frame of this.history.keys()) {
        if (frame < beforeFrame) {
          toRemove.push(frame);
        }
      }
      for (const frame of toRemove) {
        this.history.delete(frame);
      }
    }
    /**
     * Serialize for snapshots (late joiner sync).
     * CRITICAL: Must produce identical output across all clients.
     *
     * @returns Serializable state object
     */
    getState() {
      const frames = [];
      const sortedFrames = Array.from(this.history.entries()).sort((a, b) => a[0] - b[0]);
      for (const [, frameInput] of sortedFrames) {
        const sortedInputs = frameInput.getSortedInputs().map(([clientId, data]) => ({
          clientId,
          data
        }));
        frames.push({
          frame: frameInput.frame,
          inputs: sortedInputs,
          confirmed: frameInput.confirmed
        });
      }
      return { frames };
    }
    /**
     * Restore from serialized state (for late joiner sync).
     * Clears existing data before restoring.
     *
     * @param state Previously serialized state
     */
    setState(state) {
      this.history.clear();
      for (const frameData of state.frames) {
        const frameInput = new FrameInputImpl(frameData.frame);
        frameInput.confirmed = frameData.confirmed;
        for (const { clientId, data } of frameData.inputs) {
          frameInput.inputs.set(clientId, data);
        }
        this.history.set(frameData.frame, frameInput);
      }
    }
    /**
     * Get the number of frames currently stored.
     * Useful for debugging and monitoring memory usage.
     */
    get size() {
      return this.history.size;
    }
    /**
     * Clear all stored history.
     */
    clear() {
      this.history.clear();
    }
  };

  // ../../engine/src/core/world.ts
  var EntityBuilder = class {
    constructor(world, name) {
      this.world = world;
      this.name = name;
      this.components = [];
      this.registered = false;
    }
    /**
     * Add a component to this entity definition.
     */
    with(component, defaults) {
      this.components.push({
        type: component,
        defaults
      });
      this.register();
      return this;
    }
    /**
     * Set sync fields for this entity (internal - use GameEntityBuilder.syncOnly()).
     */
    _setSyncFields(fields) {
      this._syncFields = fields;
    }
    /**
     * Set restore callback for this entity (internal - use GameEntityBuilder.onRestore()).
     */
    _setOnRestore(callback) {
      this._onRestore = callback;
    }
    /**
     * Finalize entity definition.
     */
    register() {
      this.world._registerEntityDef({
        name: this.name,
        components: this.components,
        syncFields: this._syncFields,
        onRestore: this._onRestore
      });
    }
    /**
     * Force immediate registration (for sync usage).
     */
    _ensureRegistered() {
      if (!this.registered) {
        this.registered = true;
      }
      this.register();
    }
    /**
     * Get the entity definition (for internal use).
     */
    _getDefinition() {
      return {
        name: this.name,
        components: this.components,
        syncFields: this._syncFields,
        onRestore: this._onRestore
      };
    }
  };
  var World = class {
    constructor() {
      /** Entity definitions */
      this.entityDefs = /* @__PURE__ */ new Map();
      /** Active entity eids */
      this.activeEntities = /* @__PURE__ */ new Set();
      /** Entity type by eid */
      this.entityTypes = /* @__PURE__ */ new Map();
      /** Entity components by eid */
      this.entityComponents = /* @__PURE__ */ new Map();
      /** Client ID by eid */
      this.entityClientIds = /* @__PURE__ */ new Map();
      /** Input registry: clientId → input data */
      this.inputRegistry = /* @__PURE__ */ new Map();
      /** Whether running on client */
      this._isClient = true;
      // ==========================================
      // Sparse Snapshot API (Efficient)
      // ==========================================
      /** Snapshot codec */
      this.snapshotCodec = new SparseSnapshotCodec();
      /** Current frame number */
      this.frame = 0;
      /** Current sequence number */
      this.seq = 0;
      // ==========================================
      // Network Integration (Phase 3)
      // ==========================================
      /**
       * Network input format.
       */
      this.inputBuffer = /* @__PURE__ */ new Map();
      /**
       * Run a single game tick with network inputs.
       *
       * Executes all system phases in order:
       * 1. INPUT - Apply network inputs to entities
       * 2. UPDATE - Game logic systems
       * 3. PREPHYSICS - Save state for interpolation
       * 4. PHYSICS - Physics simulation (external hook)
       * 5. POSTPHYSICS - Post-physics cleanup
       * 6. RENDER - Rendering (client only)
       */
      /** True while running deterministic simulation phases */
      this._isSimulating = false;
      // ==========================================
      // Client-Side Prediction (Phase 4)
      // ==========================================
      /** Local client ID for prediction */
      this.localClientId = null;
      /** Pending predictions awaiting server confirmation */
      this.predictions = [];
      /** Rollback buffer for state restoration */
      this.rollbackBuffer = /* @__PURE__ */ new Map();
      /** Maximum frames to keep in rollback buffer */
      this.rollbackBufferSize = 60;
      /** Input history for rollback resimulation */
      this.inputHistory = new InputHistory(120);
      this.idAllocator = new EntityIdAllocator();
      this.entityPool = new EntityPool();
      this.strings = new StringRegistry();
      this.queryEngine = new QueryEngine(
        (eid) => this.getEntity(eid),
        (eid) => this.isDestroyed(eid)
      );
      this.scheduler = new SystemScheduler();
      this.addSystem(() => this.saveInterpolationState(), { phase: "prePhysics", order: -1e3 });
    }
    /**
     * Set whether running on client.
     */
    setIsClient(isClient) {
      this._isClient = isClient;
      this.scheduler.setIsClient(isClient);
    }
    /**
     * Check if running on client.
     */
    get isClient() {
      return this._isClient;
    }
    // ==========================================
    // Component API
    // ==========================================
    /**
     * Define a new component type.
     */
    defineComponent(name, defaults) {
      return defineComponent(name, defaults);
    }
    // ==========================================
    // Entity Definition API
    // ==========================================
    /**
     * Define a new entity type.
     */
    defineEntity(name) {
      const builder = new EntityBuilder(this, name);
      return builder;
    }
    /**
     * Register an entity definition (internal).
     */
    _registerEntityDef(def) {
      this.entityDefs.set(def.name, def);
    }
    /**
     * Get entity definition by type name.
     */
    getEntityDef(typeName) {
      return this.entityDefs.get(typeName);
    }
    // ==========================================
    // Entity Spawning/Destruction
    // ==========================================
    /**
     * Spawn a new entity.
     */
    spawn(typeOrBuilder, props = {}) {
      let typeName;
      if (typeof typeOrBuilder === "string") {
        typeName = typeOrBuilder;
      } else {
        const def2 = typeOrBuilder._getDefinition();
        this._registerEntityDef(def2);
        typeName = def2.name;
      }
      const def = this.entityDefs.get(typeName);
      if (!def) {
        throw new Error(`Unknown entity type: '${typeName}'`);
      }
      const eid = this.idAllocator.allocate();
      const index = eid & INDEX_MASK;
      const entity = this.entityPool.acquire(eid);
      this.activeEntities.add(eid);
      this.entityTypes.set(eid, typeName);
      const componentTypes = [];
      for (const compDef of def.components) {
        const component = compDef.type;
        componentTypes.push(component);
        addComponentToEntity(component.storage, index);
        initializeComponentDefaults(component.storage, index);
        if (compDef.defaults) {
          for (const [key, value] of Object.entries(compDef.defaults)) {
            const arr = component.storage.fields[key];
            if (arr) {
              const fieldDef = component.storage.schema[key];
              if (fieldDef.type === "i32") {
                arr[index] = toFixed(value);
              } else if (fieldDef.type === "bool") {
                arr[index] = value ? 1 : 0;
              } else {
                arr[index] = value;
              }
            }
          }
        }
      }
      let clientId;
      for (const [key, value] of Object.entries(props)) {
        if (key === "clientId") {
          clientId = value;
          this.entityClientIds.set(eid, clientId);
        }
        for (const component of componentTypes) {
          if (key in component.storage.schema) {
            const arr = component.storage.fields[key];
            const fieldDef = component.storage.schema[key];
            if (fieldDef.type === "i32") {
              arr[index] = toFixed(value);
            } else if (fieldDef.type === "bool") {
              arr[index] = value ? 1 : 0;
            } else {
              arr[index] = value;
            }
            break;
          }
        }
      }
      this.entityComponents.set(eid, componentTypes);
      entity._init(eid, typeName, componentTypes, this);
      if (props.x !== void 0 || props.y !== void 0) {
        const spawnX = props.x ?? 0;
        const spawnY = props.y ?? 0;
        entity.render.prevX = spawnX;
        entity.render.prevY = spawnY;
        entity.render.interpX = spawnX;
        entity.render.interpY = spawnY;
      }
      this.queryEngine.addEntity(eid, typeName, componentTypes, clientId);
      return entity;
    }
    /**
     * Spawn an entity with a specific eid (for snapshot restore).
     * This is used when restoring entities to preserve their original IDs.
     */
    spawnWithId(typeOrBuilder, targetEid, props = {}) {
      let typeName;
      if (typeof typeOrBuilder === "string") {
        typeName = typeOrBuilder;
      } else {
        const def2 = typeOrBuilder._getDefinition();
        this._registerEntityDef(def2);
        typeName = def2.name;
      }
      const def = this.entityDefs.get(typeName);
      if (!def) {
        throw new Error(`Unknown entity type: '${typeName}'`);
      }
      const eid = this.idAllocator.allocateSpecific(targetEid);
      const index = eid & INDEX_MASK;
      const entity = this.entityPool.acquire(eid);
      this.activeEntities.add(eid);
      this.entityTypes.set(eid, typeName);
      const componentTypes = [];
      for (const compDef of def.components) {
        const component = compDef.type;
        componentTypes.push(component);
        addComponentToEntity(component.storage, index);
        initializeComponentDefaults(component.storage, index);
        if (compDef.defaults) {
          for (const [key, value] of Object.entries(compDef.defaults)) {
            const arr = component.storage.fields[key];
            if (arr) {
              const fieldDef = component.storage.schema[key];
              if (fieldDef.type === "i32") {
                arr[index] = toFixed(value);
              } else if (fieldDef.type === "bool") {
                arr[index] = value ? 1 : 0;
              } else {
                arr[index] = value;
              }
            }
          }
        }
      }
      let clientId;
      for (const [key, value] of Object.entries(props)) {
        if (key === "clientId") {
          clientId = value;
          this.entityClientIds.set(eid, clientId);
        }
        for (const compDef of def.components) {
          const arr = compDef.type.storage.fields[key];
          if (arr) {
            const fieldDef = compDef.type.storage.schema[key];
            if (fieldDef.type === "i32") {
              arr[index] = toFixed(value);
            } else if (fieldDef.type === "bool") {
              arr[index] = value ? 1 : 0;
            } else {
              arr[index] = value;
            }
            break;
          }
        }
      }
      this.entityComponents.set(eid, componentTypes);
      entity._init(eid, typeName, componentTypes, this);
      if (props.x !== void 0 || props.y !== void 0) {
        const spawnX = props.x ?? 0;
        const spawnY = props.y ?? 0;
        entity.render.prevX = spawnX;
        entity.render.prevY = spawnY;
        entity.render.interpX = spawnX;
        entity.render.interpY = spawnY;
      }
      this.queryEngine.addEntity(eid, typeName, componentTypes, clientId);
      return entity;
    }
    /**
     * Destroy an entity.
     */
    destroyEntity(entity) {
      const eid = entity.eid;
      if (!this.activeEntities.has(eid)) {
        return;
      }
      const typeName = this.entityTypes.get(eid) || "";
      const components = this.entityComponents.get(eid) || [];
      const clientId = this.entityClientIds.get(eid);
      const index = eid & INDEX_MASK;
      for (const component of components) {
        removeComponentFromEntity(component.storage, index);
      }
      this.queryEngine.removeEntity(eid, typeName, components, clientId);
      this.activeEntities.delete(eid);
      this.entityTypes.delete(eid);
      this.entityComponents.delete(eid);
      this.entityClientIds.delete(eid);
      this.entityPool.release(eid);
      this.idAllocator.free(eid);
    }
    /**
     * Get entity by eid.
     */
    getEntity(eid) {
      if (!this.activeEntities.has(eid)) {
        return null;
      }
      const entity = this.entityPool.get(eid);
      if (entity && !entity.destroyed) {
        return entity;
      }
      return null;
    }
    /**
     * Check if entity is destroyed.
     */
    isDestroyed(eid) {
      return !this.activeEntities.has(eid);
    }
    /**
     * Get entity by clientId (O(1) lookup).
     */
    getEntityByClientId(clientId) {
      const eid = this.queryEngine.getByClientId(clientId);
      if (eid === void 0)
        return null;
      return this.getEntity(eid);
    }
    /**
     * Set clientId for an entity (for snapshot restore).
     * Updates both entityClientIds map and queryEngine index.
     */
    setEntityClientId(eid, clientId) {
      this.entityClientIds.set(eid, clientId);
      this.queryEngine.setClientId(eid, clientId);
    }
    // ==========================================
    // Query API
    // ==========================================
    /**
     * Query entities by type or component.
     */
    query(typeOrComponent, ...moreComponents) {
      return this.queryEngine.query(typeOrComponent, ...moreComponents);
    }
    /**
     * Get all active entities.
     */
    getAllEntities() {
      const result = [];
      const sortedEids = Array.from(this.activeEntities).sort((a, b) => a - b);
      for (const eid of sortedEids) {
        const entity = this.entityPool.get(eid);
        if (entity) {
          result.push(entity);
        }
      }
      return result;
    }
    /**
     * Get all active entity IDs.
     */
    getAllEntityIds() {
      return Array.from(this.activeEntities).sort((a, b) => a - b);
    }
    // ==========================================
    // System API
    // ==========================================
    /**
     * Add a system.
     */
    addSystem(fn, options) {
      return this.scheduler.add(fn, options);
    }
    /**
     * Run all systems.
     */
    runSystems() {
      this.scheduler.runAll();
    }
    // ==========================================
    // String Interning API
    // ==========================================
    /**
     * Intern a string, get back an integer ID.
     */
    internString(namespace, str) {
      return this.strings.intern(namespace, str);
    }
    /**
     * Look up string by ID.
     */
    getString(namespace, id) {
      return this.strings.getString(namespace, id);
    }
    // ==========================================
    // Input Registry
    // ==========================================
    /**
     * Set input data for a client.
     */
    setInput(clientId, data) {
      this.inputRegistry.set(clientId, data);
      const entity = this.getEntityByClientId(clientId);
      if (entity) {
        entity._setInputData(data);
      }
    }
    /**
     * Get input data for a client.
     */
    getInput(clientId) {
      return this.inputRegistry.get(clientId);
    }
    /**
     * Clear all input data (call at end of tick).
     */
    clearInputs() {
      this.inputRegistry.clear();
    }
    /**
     * Get input state for snapshot.
     * Returns a map of clientId -> input data.
     */
    getInputState() {
      const state = {};
      for (const [clientId, data] of this.inputRegistry) {
        state[clientId] = data;
      }
      return state;
    }
    /**
     * Set input state from snapshot.
     * Restores the input registry and entity input caches.
     */
    setInputState(state) {
      this.inputRegistry.clear();
      for (const [clientIdStr, data] of Object.entries(state)) {
        const clientId = parseInt(clientIdStr, 10);
        this.inputRegistry.set(clientId, data);
        const entity = this.getEntityByClientId(clientId);
        if (entity) {
          entity._setInputData(data);
        }
      }
    }
    // ==========================================
    // State Management
    // ==========================================
    /**
     * Get full world state for snapshotting.
     */
    getState() {
      const entities = [];
      for (const eid of this.activeEntities) {
        const typeName = this.entityTypes.get(eid);
        const components = this.entityComponents.get(eid) || [];
        const index = eid & INDEX_MASK;
        const componentData = {};
        for (const component of components) {
          const data = {};
          for (const [fieldName, arr] of Object.entries(component.storage.fields)) {
            data[fieldName] = arr[index];
          }
          componentData[component.name] = data;
        }
        entities.push({
          eid,
          type: typeName,
          components: componentData,
          clientId: this.entityClientIds.get(eid)
        });
      }
      return {
        entities,
        allocator: this.idAllocator.getState(),
        strings: this.strings.getState()
      };
    }
    /**
     * Restore world state from snapshot.
     */
    setState(state) {
      this.clear();
      this.idAllocator.setState(state.allocator);
      this.strings.setState(state.strings);
      for (const entityState of state.entities) {
        const def = this.entityDefs.get(entityState.type);
        if (!def) {
          console.warn(`Unknown entity type in snapshot: ${entityState.type}`);
          continue;
        }
        const eid = entityState.eid;
        const index = eid & INDEX_MASK;
        const entity = this.entityPool.acquire(eid);
        this.activeEntities.add(eid);
        this.entityTypes.set(eid, entityState.type);
        if (entityState.clientId !== void 0) {
          this.entityClientIds.set(eid, entityState.clientId);
        }
        const componentTypes = [];
        for (const compDef of def.components) {
          const component = compDef.type;
          componentTypes.push(component);
          addComponentToEntity(component.storage, index);
          const savedData = entityState.components[component.name];
          if (savedData) {
            for (const [fieldName, value] of Object.entries(savedData)) {
              const arr = component.storage.fields[fieldName];
              if (arr) {
                arr[index] = value;
              }
            }
          }
        }
        this.entityComponents.set(eid, componentTypes);
        entity._init(eid, entityState.type, componentTypes, this);
        this.queryEngine.addEntity(eid, entityState.type, componentTypes, entityState.clientId);
      }
    }
    /**
     * Clear all world state.
     */
    clear() {
      for (const eid of this.activeEntities) {
        const components = this.entityComponents.get(eid) || [];
        const index = eid & INDEX_MASK;
        for (const component of components) {
          removeComponentFromEntity(component.storage, index);
        }
        this.entityPool.release(eid);
      }
      this.activeEntities.clear();
      this.entityTypes.clear();
      this.entityComponents.clear();
      this.entityClientIds.clear();
      this.queryEngine.clear();
      this.idAllocator.reset();
      this.strings.clear();
    }
    /**
     * Reset world (keeps definitions, clears entities).
     */
    reset() {
      this.clear();
    }
    /**
     * Get entity count.
     */
    get entityCount() {
      return this.activeEntities.size;
    }
    /**
     * Get sparse snapshot (efficient format).
     */
    getSparseSnapshot() {
      return this.snapshotCodec.encode(
        Array.from(this.activeEntities),
        (eid) => this.entityTypes.get(eid) || "",
        (eid) => this.entityClientIds.get(eid),
        (eid) => this.entityComponents.get(eid) || [],
        this.idAllocator.getState(),
        this.strings.getState(),
        this.frame,
        this.seq,
        saveRandomState()
        // CRITICAL: Save actual RNG state for deterministic rollback
      );
    }
    /**
     * Load sparse snapshot (efficient format).
     */
    loadSparseSnapshot(snapshot) {
      this.snapshotCodec.decode(
        snapshot,
        () => this.clearForSnapshot(),
        (state) => this.idAllocator.setState(state),
        (state) => this.strings.setState(state),
        (eid, type, clientId) => this.createEntityFromSnapshot(eid, type, clientId),
        (rng) => {
          if (rng) {
            loadRandomState(rng);
          }
        }
      );
      this.frame = snapshot.frame;
      this.seq = snapshot.seq;
      this.syncRenderStateFromTransforms();
    }
    /**
     * Sync render state with current transform positions.
     * Called after snapshot restore to prevent interpolation artifacts.
     */
    syncRenderStateFromTransforms() {
      for (const eid of this.activeEntities) {
        const entity = this.getEntity(eid);
        if (!entity)
          continue;
        const components = this.entityComponents.get(eid) || [];
        const index = eid & INDEX_MASK;
        for (const component of components) {
          if (component.name === "Transform2D") {
            const xArr = component.storage.fields["x"];
            const yArr = component.storage.fields["y"];
            if (xArr && yArr) {
              const x = xArr[index] / 65536;
              const y = yArr[index] / 65536;
              entity.render.prevX = x;
              entity.render.prevY = y;
              entity.render.interpX = x;
              entity.render.interpY = y;
            }
            break;
          }
        }
      }
    }
    /**
     * Clear world for snapshot restore (doesn't reset allocator).
     */
    clearForSnapshot() {
      for (const eid of this.activeEntities) {
        const components = this.entityComponents.get(eid) || [];
        const index = eid & INDEX_MASK;
        for (const component of components) {
          removeComponentFromEntity(component.storage, index);
        }
        this.entityPool.release(eid);
      }
      this.activeEntities.clear();
      this.entityTypes.clear();
      this.entityComponents.clear();
      this.entityClientIds.clear();
      this.queryEngine.clear();
    }
    /**
     * Create entity from snapshot data (without allocating new ID).
     */
    createEntityFromSnapshot(eid, type, clientId) {
      const def = this.entityDefs.get(type);
      if (!def) {
        console.warn(`Unknown entity type in snapshot: ${type}`);
        return;
      }
      const index = eid & INDEX_MASK;
      const entity = this.entityPool.acquire(eid);
      this.activeEntities.add(eid);
      this.entityTypes.set(eid, type);
      if (clientId !== void 0) {
        this.entityClientIds.set(eid, clientId);
      }
      const componentTypes = [];
      for (const compDef of def.components) {
        const component = compDef.type;
        componentTypes.push(component);
        addComponentToEntity(component.storage, index);
      }
      this.entityComponents.set(eid, componentTypes);
      entity._init(eid, type, componentTypes, this);
      this.queryEngine.addEntity(eid, type, componentTypes, clientId);
    }
    /**
     * Serialize snapshot to binary for network transfer.
     */
    snapshotToBinary(snapshot) {
      return this.snapshotCodec.toBinary(snapshot);
    }
    /**
     * Deserialize snapshot from binary.
     */
    snapshotFromBinary(buffer) {
      return this.snapshotCodec.fromBinary(buffer);
    }
    /**
     * Get snapshot size estimate.
     */
    getSnapshotSize(snapshot) {
      return this.snapshotCodec.getSize(snapshot);
    }
    tick(frame, inputs = []) {
      this.frame = frame;
      this.applyNetworkInputs(inputs);
      this._isSimulating = true;
      try {
        this.scheduler.runPhase("input");
        this.scheduler.runPhase("update");
        this.scheduler.runPhase("prePhysics");
        this.scheduler.runPhase("physics");
        this.scheduler.runPhase("postPhysics");
      } finally {
        this._isSimulating = false;
      }
      if (this._isClient) {
        this.scheduler.runPhase("render");
      }
      this.inputBuffer.clear();
    }
    /**
     * Apply network inputs to entities via O(1) clientId lookup.
     */
    applyNetworkInputs(inputs) {
      for (const input2 of inputs) {
        const entity = this.getEntityByClientId(input2.clientId);
        if (entity) {
          this.inputBuffer.set(input2.clientId, input2.data);
          const data = input2.data;
          if (data) {
            entity._setInputData(data);
          }
        }
      }
    }
    /**
     * Get input data for a clientId.
     */
    getInputForClient(clientId) {
      return this.inputBuffer.get(clientId);
    }
    /**
     * Check if we have input for a clientId this tick.
     */
    hasInputForClient(clientId) {
      return this.inputBuffer.has(clientId);
    }
    /**
     * Run only physics phase (for external physics integration).
     */
    runPhysics() {
      this.scheduler.runPhase("physics");
    }
    /**
     * Set physics step callback (called during PHYSICS phase).
     */
    setPhysicsStep(fn) {
      return this.addSystem(fn, { phase: "physics", order: 0 });
    }
    /**
     * Save previous positions for interpolation (called in prePhysics).
     */
    saveInterpolationState() {
      for (const eid of this.activeEntities) {
        const entity = this.getEntity(eid);
        if (entity) {
          entity._savePreviousState();
        }
      }
    }
    /**
     * Handle local player input (client-side prediction).
     * Applies input immediately for responsiveness.
     */
    handleLocalInput(input2) {
      if (this.localClientId === null) {
        console.warn("Cannot handle local input: localClientId not set");
        return;
      }
      const entity = this.getEntityByClientId(this.localClientId);
      if (entity) {
        entity._setInputData(input2);
      }
      this.inputHistory.setInput(this.frame, this.localClientId, input2);
      this.predictions.push({
        frame: this.frame,
        input: input2,
        hash: this.getStateHash()
      });
    }
    /**
     * Process server-confirmed inputs.
     * Detects mispredictions and triggers rollback if needed.
     */
    onServerTick(serverFrame, inputs) {
      this.saveSnapshot(this.frame);
      const inputMap = /* @__PURE__ */ new Map();
      for (const input2 of inputs) {
        inputMap.set(input2.clientId, input2.data);
      }
      this.inputHistory.confirmFrame(serverFrame, inputMap);
      const minFrame = serverFrame - 120;
      if (minFrame > 0) {
        this.inputHistory.prune(minFrame);
      }
      const predictionIdx = this.predictions.findIndex((p) => p.frame === serverFrame);
      if (predictionIdx !== -1) {
        const prediction = this.predictions[predictionIdx];
        const snapshot = this.rollbackBuffer.get(serverFrame);
        if (snapshot) {
          this.loadSparseSnapshot(snapshot);
        }
        this.tick(serverFrame, inputs);
        const serverHash = this.getStateHash();
        const mispredicted = serverHash !== prediction.hash;
        if (mispredicted) {
          this.onRollback?.(serverFrame);
          this.resimulateFrom(serverFrame);
        }
        this.predictions = this.predictions.filter((p) => p.frame > serverFrame);
        return mispredicted;
      } else {
        this.tick(serverFrame, inputs);
        return false;
      }
    }
    /**
     * Save snapshot for potential rollback.
     */
    saveSnapshot(frame) {
      const snapshot = this.getSparseSnapshot();
      this.rollbackBuffer.set(frame, snapshot);
      const minFrame = frame - this.rollbackBufferSize + 1;
      for (const f of this.rollbackBuffer.keys()) {
        if (f < minFrame) {
          this.rollbackBuffer.delete(f);
        }
      }
    }
    /**
     * Restore state from snapshot at frame.
     */
    restoreSnapshot(frame) {
      const snapshot = this.rollbackBuffer.get(frame);
      if (!snapshot) {
        return false;
      }
      this.loadSparseSnapshot(snapshot);
      return true;
    }
    /**
     * Check if snapshot exists for frame.
     */
    hasSnapshot(frame) {
      return this.rollbackBuffer.has(frame);
    }
    /**
     * Get oldest frame in rollback buffer.
     */
    getOldestSnapshotFrame() {
      let oldest;
      for (const frame of this.rollbackBuffer.keys()) {
        if (oldest === void 0 || frame < oldest) {
          oldest = frame;
        }
      }
      return oldest;
    }
    /**
     * Resimulate from a frame forward to current frame.
     * Uses stored inputs from input history.
     *
     * NOTE: This retrieves data from InputHistory but full tick logic
     * will be implemented in Phase 2 of the rollback implementation plan.
     */
    resimulateFrom(fromFrame) {
      const currentFrame = this.frame;
      const framesToResim = this.inputHistory.getRange(fromFrame + 1, currentFrame);
      if (framesToResim.length > 0) {
        for (const frameInput of framesToResim) {
          const inputs = [];
          for (const [clientId, data] of frameInput.getSortedInputs()) {
            inputs.push({ clientId, data });
          }
          this.tick(frameInput.frame, inputs);
        }
      }
      this.frame = currentFrame;
    }
    /**
     * Get deterministic hash of world state.
     * Used for comparing state between clients.
     * Excludes components with sync: false (client-only state).
     */
    getStateHash() {
      const sortedEids = Array.from(this.activeEntities).sort((a, b) => a - b);
      let hash = 0;
      for (const eid of sortedEids) {
        const index = eid & INDEX_MASK;
        const components = this.entityComponents.get(eid) || [];
        hash = hash * 31 + eid | 0;
        for (const component of components) {
          if (!component.sync)
            continue;
          const fieldNames = [...component.fieldNames].sort();
          for (const fieldName of fieldNames) {
            const arr = component.storage.fields[fieldName];
            const value = arr[index];
            hash = hash * 31 + value | 0;
          }
        }
      }
      return (hash >>> 0).toString(16).padStart(8, "0");
    }
    /**
     * Clear rollback buffer.
     */
    clearRollbackBuffer() {
      this.rollbackBuffer.clear();
      this.predictions = [];
    }
    /**
     * Get pending prediction count.
     */
    getPendingPredictionCount() {
      return this.predictions.length;
    }
    /**
     * Check if we have pending predictions.
     */
    hasPendingPredictions() {
      return this.predictions.length > 0;
    }
  };

  // ../../engine/src/codec/binary.ts
  var TYPE_NULL = 0;
  var TYPE_FALSE = 1;
  var TYPE_TRUE = 2;
  var TYPE_INT32 = 5;
  var TYPE_FLOAT64 = 6;
  var TYPE_STRING = 7;
  var TYPE_ARRAY = 8;
  var TYPE_OBJECT = 9;
  var TYPE_UINT8 = 10;
  var TYPE_UINT16 = 11;
  var TYPE_UINT32 = 12;
  var BinaryEncoder = class {
    constructor() {
      this.buffer = [];
    }
    writeByte(b) {
      this.buffer.push(b & 255);
    }
    writeUint16(n) {
      this.buffer.push(n >> 8 & 255);
      this.buffer.push(n & 255);
    }
    writeUint32(n) {
      this.buffer.push(n >> 24 & 255);
      this.buffer.push(n >> 16 & 255);
      this.buffer.push(n >> 8 & 255);
      this.buffer.push(n & 255);
    }
    writeInt32(n) {
      this.writeUint32(n >>> 0);
    }
    writeFloat64(n) {
      const view = new DataView(new ArrayBuffer(8));
      view.setFloat64(0, n, false);
      for (let i = 0; i < 8; i++) {
        this.buffer.push(view.getUint8(i));
      }
    }
    writeString(s) {
      const encoded = new TextEncoder().encode(s);
      this.writeUint16(encoded.length);
      for (let i = 0; i < encoded.length; i++) {
        this.buffer.push(encoded[i]);
      }
    }
    writeValue(value) {
      if (value === null || value === void 0) {
        this.writeByte(TYPE_NULL);
      } else if (value === false) {
        this.writeByte(TYPE_FALSE);
      } else if (value === true) {
        this.writeByte(TYPE_TRUE);
      } else if (typeof value === "number") {
        if (Number.isInteger(value)) {
          if (value >= 0 && value <= 255) {
            this.writeByte(TYPE_UINT8);
            this.writeByte(value);
          } else if (value >= 0 && value <= 65535) {
            this.writeByte(TYPE_UINT16);
            this.writeUint16(value);
          } else if (value >= -2147483648 && value <= 2147483647) {
            this.writeByte(TYPE_INT32);
            this.writeInt32(value);
          } else {
            this.writeByte(TYPE_FLOAT64);
            this.writeFloat64(value);
          }
        } else {
          this.writeByte(TYPE_FLOAT64);
          this.writeFloat64(value);
        }
      } else if (typeof value === "string") {
        this.writeByte(TYPE_STRING);
        this.writeString(value);
      } else if (Array.isArray(value)) {
        this.writeByte(TYPE_ARRAY);
        this.writeUint16(value.length);
        for (const item of value) {
          this.writeValue(item);
        }
      } else if (typeof value === "object") {
        this.writeByte(TYPE_OBJECT);
        const keys = Object.keys(value);
        this.writeUint16(keys.length);
        for (const key of keys) {
          this.writeString(key);
          this.writeValue(value[key]);
        }
      } else {
        this.writeByte(TYPE_NULL);
      }
    }
    toUint8Array() {
      return new Uint8Array(this.buffer);
    }
  };
  var BinaryDecoder = class {
    constructor(data) {
      this.pos = 0;
      this.data = data;
    }
    readByte() {
      return this.data[this.pos++];
    }
    readUint16() {
      const b1 = this.data[this.pos++];
      const b2 = this.data[this.pos++];
      return b1 << 8 | b2;
    }
    readUint32() {
      const b1 = this.data[this.pos++];
      const b2 = this.data[this.pos++];
      const b3 = this.data[this.pos++];
      const b4 = this.data[this.pos++];
      return (b1 << 24 | b2 << 16 | b3 << 8 | b4) >>> 0;
    }
    readInt32() {
      const u = this.readUint32();
      return u > 2147483647 ? u - 4294967296 : u;
    }
    readFloat64() {
      const view = new DataView(new ArrayBuffer(8));
      for (let i = 0; i < 8; i++) {
        view.setUint8(i, this.data[this.pos++]);
      }
      return view.getFloat64(0, false);
    }
    readString() {
      const len = this.readUint16();
      const bytes = this.data.slice(this.pos, this.pos + len);
      this.pos += len;
      return new TextDecoder().decode(bytes);
    }
    readValue() {
      const type = this.readByte();
      switch (type) {
        case TYPE_NULL:
          return null;
        case TYPE_FALSE:
          return false;
        case TYPE_TRUE:
          return true;
        case TYPE_UINT8:
          return this.readByte();
        case TYPE_UINT16:
          return this.readUint16();
        case TYPE_INT32:
          return this.readInt32();
        case TYPE_UINT32:
          return this.readUint32();
        case TYPE_FLOAT64:
          return this.readFloat64();
        case TYPE_STRING:
          return this.readString();
        case TYPE_ARRAY: {
          const len = this.readUint16();
          const arr = [];
          for (let i = 0; i < len; i++) {
            arr.push(this.readValue());
          }
          return arr;
        }
        case TYPE_OBJECT: {
          const len = this.readUint16();
          const obj = {};
          for (let i = 0; i < len; i++) {
            const key = this.readString();
            obj[key] = this.readValue();
          }
          return obj;
        }
        default:
          return null;
      }
    }
  };
  function encode(value) {
    const encoder = new BinaryEncoder();
    encoder.writeValue(value);
    return encoder.toUint8Array();
  }
  function decode(data) {
    const decoder = new BinaryDecoder(data);
    return decoder.readValue();
  }

  // ../../engine/src/game.ts
  var DEBUG_NETWORK = false;
  var Prefab = class {
    constructor(game2, typeName, builder) {
      this.game = game2;
      this.typeName = typeName;
      this.builder = builder;
    }
    /**
     * Spawn a new entity from this prefab.
     */
    spawn(props = {}) {
      return this.game.spawn(this.typeName, props);
    }
  };
  var Game = class {
    constructor() {
      /** Physics system (optional) */
      this.physics = null;
      // ==========================================
      // Network State
      // ==========================================
      /** WebSocket connection */
      this.connection = null;
      /** Game callbacks */
      this.callbacks = {};
      /** Connected room ID */
      this.connectedRoomId = null;
      /** Local client ID (string form) */
      this.localClientIdStr = null;
      /** All connected client IDs (in join order for determinism) */
      this.connectedClients = [];
      /** Authority client (first joiner, sends snapshots) */
      this.authorityClientId = null;
      /** Current server frame */
      this.currentFrame = 0;
      /** Last processed frame (for skipping old frames after catchup) */
      this.lastProcessedFrame = 0;
      /** Last processed input sequence */
      this.lastInputSeq = 0;
      /** Server tick rate */
      this.serverFps = 20;
      /** RequestAnimationFrame handle */
      this.gameLoop = null;
      /** Deferred snapshot flag (send after tick completes) */
      this.pendingSnapshotUpload = false;
      /** Last snapshot info for debug UI */
      this.lastSnapshotHash = null;
      this.lastSnapshotFrame = 0;
      this.lastSnapshotSize = 0;
      this.lastSnapshotEntityCount = 0;
      /** Drift tracking stats for debug UI */
      this.driftStats = {
        determinismPercent: 100,
        totalChecks: 0,
        matchingFieldCount: 0,
        totalFieldCount: 0
      };
      /** Divergence tracking */
      this.lastSyncPercent = 100;
      this.firstDivergenceFrame = null;
      this.divergenceHistory = [];
      this.recentInputs = [];
      this.lastServerSnapshot = { raw: null, decoded: null, frame: 0 };
      this.lastGoodSnapshot = null;
      this.divergenceCaptured = false;
      this.divergenceCapture = null;
      /** Tick timing for render interpolation */
      this.lastTickTime = 0;
      this.tickIntervalMs = 50;
      // 20fps default
      // ==========================================
      // String Interning
      // ==========================================
      /** String to ID mapping for clientIds */
      this.clientIdToNum = /* @__PURE__ */ new Map();
      this.numToClientId = /* @__PURE__ */ new Map();
      this.nextClientNum = 1;
      /** Prefab registry */
      this.prefabs = /* @__PURE__ */ new Map();
      /** Collision handlers (type:type -> handler) */
      this.collisionHandlers = /* @__PURE__ */ new Map();
      /** Clients that already have entities from snapshot (skip onConnect for them during catchup) */
      this.clientsWithEntitiesFromSnapshot = /* @__PURE__ */ new Set();
      /** Attached renderer */
      this.renderer = null;
      /** Installed plugins */
      this.plugins = /* @__PURE__ */ new Map();
      this.world = new World();
    }
    // ==========================================
    // Plugin API
    // ==========================================
    /**
     * Add a plugin to the game.
     *
     * Plugins can be classes or factory functions that integrate with the game.
     * Common plugins include Physics2DSystem and AutoRenderer.
     *
     * @example
     * const physics = game.addPlugin(Physics2DSystem, { gravity: { x: 0, y: 0 } });
     * game.addPlugin(AutoRenderer, canvas);
     *
     * @param Plugin - Plugin class or factory
     * @param args - Arguments to pass to the plugin constructor
     * @returns The created plugin instance
     */
    addPlugin(Plugin, ...args) {
      const plugin = new Plugin(this, ...args);
      const name = Plugin.name || "anonymous";
      this.plugins.set(name, plugin);
      return plugin;
    }
    /**
     * Get a previously added plugin by class.
     */
    getPlugin(Plugin) {
      return this.plugins.get(Plugin.name);
    }
    /**
     * Current frame number.
     */
    get frame() {
      return this.currentFrame;
    }
    /**
     * Deterministic time in milliseconds.
     * Use this instead of Date.now() for game logic.
     *
     * @example
     * const RESPAWN_TIME = 3000; // 3 seconds
     * deadPlayers.set(clientId, game.time + RESPAWN_TIME);
     * if (game.time >= respawnTime) spawnPlayer(clientId);
     */
    get time() {
      return this.currentFrame * this.tickIntervalMs;
    }
    // ==========================================
    // Entity Definition API
    // ==========================================
    /**
     * Define a new entity type.
     *
     * @example
     * const Cell = game.defineEntity('cell')
     *     .with(Transform2D)
     *     .with(Body2D, { shapeType: 1, radius: 20 })
     *     .with(Player);
     */
    defineEntity(name) {
      return new GameEntityBuilder(this, name);
    }
    /**
     * Register a prefab (internal).
     */
    _registerPrefab(name, builder) {
      const prefab = new Prefab(this, name, builder);
      this.prefabs.set(name, prefab);
      return prefab;
    }
    // ==========================================
    // Entity Spawning
    // ==========================================
    /**
     * Spawn an entity.
     *
     * @param type Entity type name
     * @param props Property overrides
     */
    spawn(type, props = {}) {
      let numericProps = { ...props };
      if (props.clientId && typeof props.clientId === "string") {
        numericProps.clientId = this.internClientId(props.clientId);
      }
      return this.world.spawn(type, numericProps);
    }
    /**
     * Get a prefab by name.
     */
    getPrefab(name) {
      return this.prefabs.get(name);
    }
    // ==========================================
    // Query API
    // ==========================================
    /**
     * Query entities by type.
     */
    query(type) {
      return this.world.query(type);
    }
    /**
     * Get entities by type as array.
     */
    getEntitiesByType(type) {
      return this.world.query(type).toArray();
    }
    /**
     * Get all entities.
     */
    getAllEntities() {
      return this.world.getAllEntities();
    }
    /**
     * Get entity by client ID.
     */
    getEntityByClientId(clientId) {
      const numId = this.clientIdToNum.get(clientId);
      if (numId === void 0)
        return null;
      return this.world.getEntityByClientId(numId);
    }
    /**
     * Get player by client ID (alias for getEntityByClientId).
     */
    getPlayer(clientId) {
      return this.getEntityByClientId(clientId);
    }
    /**
     * Get all players (entities with Player component).
     */
    getPlayers() {
      return this.world.query(Player).toArray();
    }
    // ==========================================
    // System API
    // ==========================================
    /**
     * Add a system.
     */
    addSystem(fn, options) {
      return this.world.addSystem(fn, options);
    }
    // ==========================================
    // Collision API
    // ==========================================
    /**
     * Register a collision handler.
     */
    onCollision(typeA, typeB, handler) {
      if (this.physics) {
        this.physics.onCollision(typeA, typeB, handler);
      } else {
        const key = `${typeA}:${typeB}`;
        this.collisionHandlers.set(key, handler);
      }
      return this;
    }
    // ==========================================
    // String Interning
    // ==========================================
    /**
     * Intern a client ID string, get back a number.
     */
    internClientId(clientId) {
      let num = this.clientIdToNum.get(clientId);
      if (num === void 0) {
        num = this.nextClientNum++;
        this.clientIdToNum.set(clientId, num);
        this.numToClientId.set(num, clientId);
      }
      return num;
    }
    /**
     * Get client ID string from number.
     */
    getClientIdString(num) {
      return this.numToClientId.get(num);
    }
    /**
     * Intern any string in a namespace.
     */
    internString(namespace, str) {
      return this.world.internString(namespace, str);
    }
    /**
     * Get string by ID from namespace.
     */
    getString(namespace, id) {
      return this.world.getString(namespace, id);
    }
    // ==========================================
    // State Management
    // ==========================================
    /**
     * Get deterministic state hash.
     */
    getStateHash() {
      return this.world.getStateHash();
    }
    /**
     * Reset game state.
     */
    reset() {
      this.world.reset();
      this.currentFrame = 0;
    }
    // ==========================================
    // Network Connection
    // ==========================================
    /**
     * Connect to a multiplayer room.
     */
    async connect(roomId, callbacks, options = {}) {
      this.callbacks = callbacks;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("room"))
          roomId = params.get("room");
        if (params.get("nodeUrl"))
          options.nodeUrl = params.get("nodeUrl");
      }
      this.connectedRoomId = roomId;
      const network = window.moduNetwork;
      if (!network) {
        throw new Error("moduNetwork not found. Include modu-network SDK before calling connect().");
      }
      console.log(`[ecs] Connecting to room "${roomId}"...`);
      try {
        this.connection = await network.connect(roomId, {
          nodeUrl: options.nodeUrl,
          centralServiceUrl: options.centralServiceUrl,
          appId: "dev",
          joinToken: options.joinToken,
          onConnect: (snapshot, inputs, frame, nodeUrl, fps, clientId) => {
            this.handleConnect(snapshot, inputs, frame, fps, clientId);
          },
          onTick: (frame, inputs) => {
            this.handleTick(frame, inputs);
          },
          onDisconnect: () => {
            this.handleDisconnect();
          },
          onBinarySnapshot: (data) => {
            this.handleServerSnapshot(data);
          },
          onError: (error) => {
            console.error("[ecs] Network error:", error);
          }
        });
        this.localClientIdStr = this.connection.clientId;
      } catch (err) {
        console.warn("[ecs] Connection failed:", err?.message || err);
        this.connection = null;
        this.connectedRoomId = null;
      }
    }
    /**
     * Handle initial connection (first join or late join).
     */
    handleConnect(snapshot, inputs, frame, fps, clientId) {
      let snapshotSize = 0;
      if (snapshot instanceof Uint8Array) {
        snapshotSize = snapshot.length;
        if (snapshot.length < 2) {
          snapshot = null;
        } else {
          try {
            snapshot = decode(snapshot)?.snapshot || null;
          } catch (e) {
            console.error("[ecs] Failed to decode snapshot:", e);
            snapshot = null;
          }
        }
      }
      this.localClientIdStr = clientId;
      this.serverFps = fps;
      this.tickIntervalMs = 1e3 / fps;
      this.currentFrame = frame;
      if (snapshot?.hash !== void 0) {
        this.lastSnapshotHash = typeof snapshot.hash === "number" ? snapshot.hash.toString(16).padStart(8, "0") : String(snapshot.hash);
        this.lastSnapshotFrame = snapshot.frame || frame;
        this.lastSnapshotSize = snapshotSize;
        this.lastSnapshotEntityCount = snapshot.entities?.length || 0;
      }
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Connected as ${clientId}, frame ${frame}, fps ${fps}`);
        console.log(`[ecs] Snapshot:`, snapshot ? { frame: snapshot.frame, entityCount: snapshot.entities?.length } : "none");
        console.log(`[ecs] Inputs: ${inputs.length}`);
      }
      const hasValidSnapshot = snapshot?.entities && snapshot.entities.length > 0;
      if (hasValidSnapshot) {
        if (DEBUG_NETWORK)
          console.log(`[ecs] Late join: restoring snapshot frame=${snapshot.frame}`);
        this.currentFrame = snapshot.frame || frame;
        this.loadNetworkSnapshot(snapshot);
        for (const input2 of inputs) {
          this.processAuthorityChainInput(input2);
        }
        if (this.callbacks.onSnapshot) {
          this.callbacks.onSnapshot(this.world.getAllEntities());
        }
        const snapshotSeq = snapshot.seq || 0;
        const pendingInputs = inputs.filter((i) => i.seq > snapshotSeq).sort((a, b) => a.seq - b.seq);
        const snapshotFrame = this.currentFrame;
        const isPostTick = snapshot.postTick === true;
        const startFrame = isPostTick ? snapshotFrame + 1 : snapshotFrame;
        const ticksToRun = frame - startFrame + 1;
        if (DEBUG_NETWORK) {
          console.log(`[ecs] Catchup: from ${startFrame} to ${frame} (${ticksToRun} ticks), ${pendingInputs.length} pending inputs`);
        }
        if (ticksToRun > 0) {
          this.runCatchup(startFrame, frame, pendingInputs);
        }
        this.lastGoodSnapshot = {
          snapshot: JSON.parse(JSON.stringify(snapshot)),
          frame: this.currentFrame,
          hash: this.getStateHash()
        };
      } else {
        if (DEBUG_NETWORK)
          console.log("[ecs] First join: creating room");
        this.currentFrame = frame;
        this.callbacks.onRoomCreate?.();
        for (const input2 of inputs) {
          this.processInput(input2);
        }
      }
      if (this.checkIsAuthority()) {
        this.sendSnapshot("init");
      }
      this.startGameLoop();
      if (DEBUG_NETWORK)
        console.log("[ecs] Game loop started");
    }
    /**
     * Handle server tick.
     */
    handleTick(frame, inputs) {
      if (frame <= this.lastProcessedFrame) {
        if (DEBUG_NETWORK) {
          console.log(`[ecs] Skipping old frame ${frame} (already at ${this.lastProcessedFrame})`);
        }
        return;
      }
      this.currentFrame = frame;
      this.lastProcessedFrame = frame;
      if (DEBUG_NETWORK && inputs.length > 0) {
        const types = inputs.map((i) => i.data?.type || "game").join(",");
        console.log(`[ecs] onTick frame=${frame}: ${inputs.length} inputs (${types})`);
      }
      const sortedInputs = inputs.length > 1 ? [...inputs].sort((a, b) => (a.seq || 0) - (b.seq || 0)) : inputs;
      for (const input2 of sortedInputs) {
        this.processInput(input2);
      }
      this.world.tick(frame, []);
      this.callbacks.onTick?.(frame);
      if (this.pendingSnapshotUpload && this.checkIsAuthority()) {
        this.sendSnapshot("join");
        this.pendingSnapshotUpload = false;
      }
      this.lastTickTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    }
    /**
     * Process a network input (join/leave/game).
     */
    processInput(input2) {
      let data = input2.data;
      if (data instanceof Uint8Array) {
        try {
          data = decode(data);
        } catch (e) {
          console.warn("[ecs] Failed to decode input:", e);
          return;
        }
      }
      const clientId = data?.clientId || input2.clientId;
      const type = data?.type;
      this.recentInputs.push({
        frame: this.currentFrame,
        seq: input2.seq,
        clientId,
        data: JSON.parse(JSON.stringify(data))
      });
      if (this.recentInputs.length > 500) {
        this.recentInputs.shift();
      }
      if (input2.seq > this.lastInputSeq) {
        this.lastInputSeq = input2.seq;
      }
      if (type === "join") {
        if (!this.connectedClients.includes(clientId)) {
          this.connectedClients.push(clientId);
        }
        if (this.authorityClientId === null) {
          this.authorityClientId = clientId;
        }
        if (DEBUG_NETWORK) {
          console.log(`[ecs] Join: ${clientId.slice(0, 8)}, authority=${this.authorityClientId?.slice(0, 8)}`);
        }
        if (this.clientsWithEntitiesFromSnapshot.has(clientId)) {
          if (DEBUG_NETWORK) {
            console.log(`[ecs] Skipping onConnect for ${clientId.slice(0, 8)} - already has entity from snapshot`);
          }
        } else {
          this.callbacks.onConnect?.(clientId);
        }
        if (this.checkIsAuthority()) {
          this.pendingSnapshotUpload = true;
        }
      } else if (type === "leave" || type === "disconnect") {
        const idx = this.connectedClients.indexOf(clientId);
        if (idx !== -1) {
          this.connectedClients.splice(idx, 1);
        }
        if (clientId === this.authorityClientId) {
          this.authorityClientId = this.connectedClients[0] || null;
        }
        if (DEBUG_NETWORK) {
          console.log(`[ecs] Leave: ${clientId.slice(0, 8)}, new authority=${this.authorityClientId?.slice(0, 8)}`);
        }
        this.callbacks.onDisconnect?.(clientId);
      } else if (data) {
        this.routeInputToEntity(clientId, data);
      }
    }
    /**
     * Route game input to the world's input registry for systems to read.
     */
    routeInputToEntity(clientId, data) {
      const numId = this.internClientId(clientId);
      const entity = this.world.getEntityByClientId(numId);
      if (DEBUG_NETWORK) {
        console.log(`[ecs] routeInput: clientId=${clientId.slice(0, 8)}, numId=${numId}, entity=${entity?.eid || "null"}, data=${JSON.stringify(data)}`);
      }
      if (entity) {
        this.world.setInput(numId, data);
      } else if (DEBUG_NETWORK) {
        console.log(`[ecs] WARNING: No entity for clientId ${clientId.slice(0, 8)} (numId=${numId})`);
      }
    }
    /**
     * Process input for authority chain only (no game logic).
     */
    processAuthorityChainInput(input2) {
      let data = input2.data;
      if (data instanceof Uint8Array) {
        try {
          data = decode(data);
        } catch {
          return;
        }
      }
      const clientId = data?.clientId || input2.clientId;
      const type = data?.type;
      if (type === "join") {
        if (!this.connectedClients.includes(clientId)) {
          this.connectedClients.push(clientId);
        }
        if (this.authorityClientId === null) {
          this.authorityClientId = clientId;
        }
      } else if (type === "leave" || type === "disconnect") {
        const idx = this.connectedClients.indexOf(clientId);
        if (idx !== -1) {
          this.connectedClients.splice(idx, 1);
        }
        if (clientId === this.authorityClientId) {
          this.authorityClientId = this.connectedClients[0] || null;
        }
      }
    }
    /**
     * Run catchup simulation.
     */
    runCatchup(startFrame, endFrame, inputs) {
      const ticksToRun = endFrame - startFrame + 1;
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Catchup: ${ticksToRun} ticks from ${startFrame} to ${endFrame}, ${inputs.length} inputs`);
      }
      const sortedInputs = [...inputs].sort((a, b) => (a.seq || 0) - (b.seq || 0));
      const inputsByFrame = /* @__PURE__ */ new Map();
      for (const input2 of sortedInputs) {
        const frame = input2.frame ?? startFrame;
        if (!inputsByFrame.has(frame)) {
          inputsByFrame.set(frame, []);
        }
        inputsByFrame.get(frame).push(input2);
      }
      for (let f = 0; f < ticksToRun; f++) {
        const tickFrame = startFrame + f;
        const frameInputs = inputsByFrame.get(tickFrame) || [];
        for (const input2 of frameInputs) {
          this.processInput(input2);
        }
        this.world.tick(tickFrame, []);
        this.callbacks.onTick?.(tickFrame);
      }
      this.currentFrame = endFrame;
      this.lastProcessedFrame = endFrame;
      this.clientsWithEntitiesFromSnapshot.clear();
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Catchup complete at frame ${this.currentFrame}, hash=${this.getStateHash()}`);
      }
    }
    // ==========================================
    // Snapshot Methods
    // ==========================================
    /**
     * Convert ECS snapshot to network wire format.
     */
    getNetworkSnapshot() {
      const types = [];
      const typeToIndex = /* @__PURE__ */ new Map();
      const schema = [];
      const typeSyncFields = /* @__PURE__ */ new Map();
      const entities = [];
      for (const entity of this.world.getAllEntities()) {
        const index = entity.eid & INDEX_MASK;
        const type = entity.type;
        if (!typeToIndex.has(type)) {
          const typeIdx = types.length;
          types.push(type);
          typeToIndex.set(type, typeIdx);
          const entityDef = this.world.getEntityDef(type);
          const syncFieldsSet2 = entityDef?.syncFields ? new Set(entityDef.syncFields) : null;
          typeSyncFields.set(type, syncFieldsSet2);
          const typeSchema = [];
          for (const comp of entity.getComponents()) {
            const fieldsToSync = syncFieldsSet2 ? comp.fieldNames.filter((f) => syncFieldsSet2.has(f)) : comp.fieldNames;
            if (fieldsToSync.length > 0) {
              typeSchema.push([comp.name, fieldsToSync]);
            }
          }
          schema.push(typeSchema);
        }
        const syncFieldsSet = typeSyncFields.get(type);
        const values = [];
        for (const comp of entity.getComponents()) {
          for (const fieldName of comp.fieldNames) {
            if (!syncFieldsSet || syncFieldsSet.has(fieldName)) {
              values.push(comp.storage.fields[fieldName][index]);
            }
          }
        }
        entities.push([
          entity.eid,
          // eid as number (no need for hex conversion)
          typeToIndex.get(type),
          // type INDEX (1 byte) instead of string
          values
        ]);
      }
      let maxIndex = 0;
      const activeGenerations = {};
      for (const e of entities) {
        const eid = e[0];
        const index = eid & INDEX_MASK;
        const gen = eid >>> 20;
        if (index >= maxIndex)
          maxIndex = index + 1;
        activeGenerations[index] = gen;
      }
      return {
        frame: this.currentFrame,
        seq: this.lastInputSeq,
        format: 5,
        // Format 5: type-indexed compact encoding
        types,
        // Type names array (sent once)
        schema,
        // Component schemas indexed by type index
        entities,
        // Array of [eid, typeIndex, values[]]
        idAllocatorState: {
          nextIndex: maxIndex,
          freeList: [],
          generations: activeGenerations
        },
        rng: saveRandomState(),
        strings: this.world.strings.getState(),
        clientIdMap: {
          toNum: Object.fromEntries(this.clientIdToNum),
          nextNum: this.nextClientNum
        },
        inputState: this.world.getInputState()
      };
    }
    /**
     * Load network snapshot into ECS world.
     */
    loadNetworkSnapshot(snapshot) {
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Loading snapshot: ${snapshot.entities?.length} entities`);
      }
      this.world.reset();
      if (this.physics) {
        this.physics.clear();
      }
      if (snapshot.rng) {
        loadRandomState(snapshot.rng);
      }
      if (snapshot.strings) {
        this.world.strings.setState(snapshot.strings);
      }
      if (snapshot.clientIdMap) {
        this.clientIdToNum = new Map(Object.entries(snapshot.clientIdMap.toNum).map(([k, v]) => [k, v]));
        this.numToClientId = new Map(Array.from(this.clientIdToNum.entries()).map(([k, v]) => [v, k]));
        this.nextClientNum = snapshot.clientIdMap.nextNum || 1;
      }
      const types = snapshot.types;
      const schema = snapshot.schema;
      const entitiesData = snapshot.entities;
      const loadedEntitiesByType = /* @__PURE__ */ new Map();
      for (const entityData of entitiesData) {
        const [eid, typeIndex, values] = entityData;
        const type = types[typeIndex];
        const typeSchema = schema[typeIndex];
        let entity;
        try {
          entity = this.world.spawnWithId(type, eid, {});
        } catch (e) {
          console.warn(`[ecs] Failed to spawn ${type} with eid ${eid}:`, e);
          continue;
        }
        if (!loadedEntitiesByType.has(type)) {
          loadedEntitiesByType.set(type, []);
        }
        loadedEntitiesByType.get(type).push(entity);
        const index = eid & INDEX_MASK;
        let valueIdx = 0;
        for (const [compName, fieldNames] of typeSchema) {
          for (const comp of entity.getComponents()) {
            if (comp.name === compName) {
              for (const fieldName of fieldNames) {
                comp.storage.fields[fieldName][index] = values[valueIdx++];
              }
              break;
            }
          }
        }
        if (entity.has(Player)) {
          const player = entity.get(Player);
          if (player.clientId !== 0) {
            this.world.setEntityClientId(entity.eid, player.clientId);
          }
        }
      }
      for (const [type, entities] of loadedEntitiesByType) {
        const entityDef = this.world.getEntityDef(type);
        if (entityDef?.onRestore) {
          for (const entity of entities) {
            entityDef.onRestore(entity, this);
          }
        }
      }
      this.lastInputSeq = snapshot.seq || 0;
      if (snapshot.idAllocatorState) {
        const state = snapshot.idAllocatorState;
        if (snapshot.format >= 3 && typeof state.generations === "object" && !Array.isArray(state.generations)) {
          this.world.idAllocator.reset();
          this.world.idAllocator.setNextId(state.nextIndex);
          for (const [indexStr, gen] of Object.entries(state.generations)) {
            const index = parseInt(indexStr, 10);
            this.world.idAllocator.generations[index] = gen;
          }
          const freeList = [];
          for (let i = 0; i < state.nextIndex; i++) {
            if (!(i.toString() in state.generations)) {
              freeList.push(i);
            }
          }
          this.world.idAllocator.freeList = freeList;
        } else {
          this.world.idAllocator.setState(state);
        }
      }
      this.clientsWithEntitiesFromSnapshot.clear();
      for (const entity of this.world.query(Player)) {
        const player = entity.get(Player);
        if (player.clientId !== 0) {
          const clientIdStr = this.getClientIdString(player.clientId);
          if (clientIdStr) {
            this.clientsWithEntitiesFromSnapshot.add(clientIdStr);
            if (DEBUG_NETWORK) {
              console.log(`[ecs] Snapshot has entity for client ${clientIdStr.slice(0, 8)}`);
            }
          }
        }
      }
      if (this.physics) {
        this.physics.wakeAllBodies();
      }
      if (snapshot.inputState) {
        this.world.setInputState(snapshot.inputState);
      }
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Snapshot loaded: ${this.world.getAllEntities().length} entities, hash=${this.getStateHash()}`);
        const firstEntity = this.world.getAllEntities()[0];
        if (firstEntity) {
          const components = {};
          for (const comp of firstEntity.getComponents()) {
            const data = {};
            for (const fieldName of comp.fieldNames) {
              data[fieldName] = firstEntity.get(comp)[fieldName];
            }
            components[comp.name] = data;
          }
          console.log(`[ecs] Restored first entity: type=${firstEntity.type}, components=`, JSON.stringify(components));
        }
      }
    }
    /**
     * Send snapshot to network.
     */
    sendSnapshot(source) {
      if (!this.connection)
        return;
      if (this.physics) {
        this.physics.wakeAllBodies();
      }
      const snapshot = this.getNetworkSnapshot();
      const hash = this.world.getStateHash();
      const binary = encode({ snapshot, hash });
      const entitiesSize = encode(snapshot.entities).length;
      const schemaSize = encode(snapshot.schema).length;
      const entityCount = snapshot.entities.length;
      console.log(`[SNAPSHOT-SIZE] Total: ${binary.length}B | entities: ${entitiesSize}B (${entityCount}) | schema: ${schemaSize}B`);
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Sending snapshot (${source}): ${binary.length} bytes, ${entityCount} entities, hash=${hash}`);
      }
      this.connection.sendSnapshot(binary, hash, snapshot.seq, snapshot.frame);
      this.lastSnapshotHash = hash;
      this.lastSnapshotFrame = snapshot.frame;
      this.lastSnapshotSize = binary.length;
      this.lastSnapshotEntityCount = entityCount;
    }
    /**
     * Handle server snapshot (for drift detection).
     */
    handleServerSnapshot(data) {
      if (DEBUG_NETWORK) {
        console.log(`[ecs] Received server snapshot: ${data.length} bytes`);
      }
      try {
        const decoded = decode(data);
        const serverSnapshot = decoded?.snapshot;
        const serverHash = decoded?.hash;
        if (serverSnapshot) {
          this.lastSnapshotHash = serverHash;
          this.lastSnapshotFrame = serverSnapshot.frame;
          this.lastSnapshotSize = data.length;
          this.lastSnapshotEntityCount = serverSnapshot.entities?.length || 0;
          if (this.currentFrame === serverSnapshot.frame) {
            this.compareSnapshotFields(serverSnapshot);
            const localHash = this.getStateHash();
            if (localHash !== serverHash) {
              console.warn(`[ecs] DRIFT detected at frame ${serverSnapshot.frame}: local=${localHash}, server=${serverHash}`);
            }
          } else {
            this.driftStats = {
              determinismPercent: 100,
              totalChecks: 0,
              matchingFieldCount: 0,
              totalFieldCount: 0
            };
          }
        }
      } catch (e) {
        console.warn("[ecs] Failed to decode server snapshot:", e);
      }
    }
    /**
     * Compare server snapshot fields with local state for drift tracking.
     */
    compareSnapshotFields(serverSnapshot) {
      const frame = serverSnapshot.frame;
      let matchingFields = 0;
      let totalFields = 0;
      const diffs = [];
      this.lastServerSnapshot = { raw: null, decoded: serverSnapshot, frame };
      const types = serverSnapshot.types || [];
      const serverEntities = serverSnapshot.entities || [];
      const schema = serverSnapshot.schema || [];
      const serverEntityMap = /* @__PURE__ */ new Map();
      for (const e of serverEntities) {
        serverEntityMap.set(e[0], e);
      }
      for (const entity of this.world.getAllEntities()) {
        const eid = entity.eid;
        const serverEntity = serverEntityMap.get(eid);
        const index = eid & INDEX_MASK;
        if (!serverEntity) {
          for (const comp of entity.getComponents()) {
            totalFields += comp.fieldNames.length;
            for (const fieldName of comp.fieldNames) {
              diffs.push({ entity: entity.type, eid, comp: comp.name, field: fieldName, local: "EXISTS", server: "MISSING" });
            }
          }
          continue;
        }
        const [, typeIndex, serverValues] = serverEntity;
        const typeSchema = schema[typeIndex];
        if (!typeSchema)
          continue;
        let valueIdx = 0;
        for (const [compName, fieldNames] of typeSchema) {
          const localComp = entity.getComponents().find((c) => c.name === compName);
          for (const fieldName of fieldNames) {
            totalFields++;
            const serverValue = serverValues[valueIdx++];
            if (localComp) {
              const localValue = localComp.storage.fields[fieldName][index];
              const fieldDef = localComp.schema[fieldName];
              let valuesMatch = false;
              if (fieldDef?.type === "bool") {
                const localBool = localValue !== 0;
                const serverBool = serverValue !== 0 && serverValue !== false;
                valuesMatch = localBool === serverBool;
              } else {
                valuesMatch = localValue === serverValue;
              }
              if (valuesMatch) {
                matchingFields++;
              } else {
                diffs.push({ entity: entity.type, eid, comp: compName, field: fieldName, local: localValue, server: serverValue });
              }
            }
          }
        }
      }
      for (const [eid, serverEntity] of serverEntityMap) {
        if (this.world.getEntity(eid) === null) {
          const [, typeIndex, serverValues] = serverEntity;
          const serverType = types[typeIndex] || `type${typeIndex}`;
          totalFields += serverValues.length;
          diffs.push({ entity: serverType, eid, comp: "*", field: "*", local: "MISSING", server: "EXISTS" });
        }
      }
      const newPercent = totalFields > 0 ? matchingFields / totalFields * 100 : 100;
      const wasSync = this.lastSyncPercent === 100;
      const isSync = newPercent === 100;
      if (isSync) {
        this.lastGoodSnapshot = {
          snapshot: JSON.parse(JSON.stringify(serverSnapshot)),
          frame,
          hash: this.getStateHash()
        };
      }
      if (wasSync && !isSync && !this.divergenceCaptured) {
        this.firstDivergenceFrame = frame;
        this.divergenceHistory = [];
        this.divergenceCaptured = true;
        const lastGoodFrame = this.lastGoodSnapshot?.frame ?? 0;
        const inputsInRange = this.recentInputs.filter((i) => i.frame > lastGoodFrame && i.frame <= frame);
        const localSnapshot = this.world.getState();
        this.divergenceCapture = {
          lastGoodSnapshot: this.lastGoodSnapshot?.snapshot ?? null,
          lastGoodFrame,
          inputs: inputsInRange,
          localSnapshot,
          serverSnapshot,
          diffs,
          divergenceFrame: frame,
          clientId: this.localClientIdStr,
          isAuthority: this.checkIsAuthority()
        };
        this.showDivergenceDiff(diffs, inputsInRange, frame);
      }
      this.lastSyncPercent = newPercent;
      this.driftStats.totalChecks++;
      this.driftStats.matchingFieldCount = matchingFields;
      this.driftStats.totalFieldCount = totalFields;
      this.driftStats.determinismPercent = newPercent;
      if (diffs.length > 0 && newPercent < 100 && this.divergenceCaptured && frame % 60 === 0) {
        console.warn(`[DIVERGENCE] Frame ${frame}: still diverged (${newPercent.toFixed(1)}% sync, first at ${this.firstDivergenceFrame})`);
      }
    }
    /**
     * Show divergence debug data (auto-called on first divergence).
     */
    showDivergenceDiff(diffs, inputs, frame) {
      const lines = [];
      const lastGoodFrame = this.lastGoodSnapshot?.frame ?? 0;
      const myClientId = this.localClientIdStr || "";
      const clientIds = /* @__PURE__ */ new Set();
      for (const input2 of inputs) {
        clientIds.add(input2.clientId);
      }
      const clientList = Array.from(clientIds);
      const clientLabels = /* @__PURE__ */ new Map();
      clientList.forEach((cid, i) => {
        const label = cid === myClientId ? "ME" : `P${i + 1}`;
        clientLabels.set(cid, label);
      });
      const entityOwners = /* @__PURE__ */ new Map();
      for (const entity of this.world.getAllEntities()) {
        if (entity.has(Player)) {
          const playerData = entity.get(Player);
          const ownerClientId = this.numToClientId.get(playerData.clientId);
          if (ownerClientId) {
            entityOwners.set(entity.eid, clientLabels.get(ownerClientId) || ownerClientId.slice(0, 8));
          }
        }
      }
      lines.push(`=== DIVERGENCE DEBUG DATA ===`);
      lines.push(`Frame: ${frame} | Last good: ${lastGoodFrame} | Authority: ${this.checkIsAuthority()}`);
      lines.push(`Clients: ${clientList.map((cid) => `${clientLabels.get(cid)}=${cid.slice(0, 8)}`).join(", ")}`);
      lines.push(``);
      lines.push(`DIVERGENT FIELDS (${diffs.length}):`);
      for (const d of diffs) {
        const delta = typeof d.local === "number" && typeof d.server === "number" ? ` \u0394${d.local - d.server}` : "";
        const owner = entityOwners.get(d.eid);
        const ownerStr = owner ? ` [${owner}]` : "";
        lines.push(`  ${d.entity}#${d.eid.toString(16)}${ownerStr}.${d.comp}.${d.field}: local=${d.local} server=${d.server}${delta}`);
      }
      lines.push(``);
      lines.push(`INPUTS (${inputs.length}):`);
      for (const input2 of inputs) {
        const label = clientLabels.get(input2.clientId) || input2.clientId.slice(0, 8);
        lines.push(`  f${input2.frame} [${label}]: ${JSON.stringify(input2.data)}`);
      }
      lines.push(``);
      if (this.lastGoodSnapshot) {
        const goodEnts = Object.keys(this.lastGoodSnapshot.snapshot.entities || {}).length;
        lines.push(`LAST GOOD SNAPSHOT (f${lastGoodFrame}): ${goodEnts} entities`);
      } else {
        lines.push(`LAST GOOD SNAPSHOT: none (never had 100% sync)`);
      }
      if (this.lastServerSnapshot.decoded) {
        const serverEnts = Object.keys(this.lastServerSnapshot.decoded.entities || {}).length;
        lines.push(`SERVER SNAPSHOT (f${this.lastServerSnapshot.frame}): ${serverEnts} entities`);
      }
      lines.push(`=== END DEBUG DATA ===`);
      lines.push(`To get detailed replay data: game.getDivergenceReplay()`);
      console.error(lines.join("\n"));
    }
    /**
     * Download divergence replay data as JSON.
     */
    getDivergenceReplay() {
      if (!this.divergenceCapture) {
        console.warn("[REPLAY] No divergence captured yet.");
        return;
      }
      const json = JSON.stringify(this.divergenceCapture, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `divergence-${this.divergenceCapture.divergenceFrame}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log(`[REPLAY] Downloaded (${(json.length / 1024).toFixed(1)} KB)`);
    }
    // ==========================================
    // Game Loop
    // ==========================================
    /**
     * Start the render loop.
     */
    startGameLoop() {
      if (this.gameLoop)
        return;
      let lastSnapshotFrame = 0;
      const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const SNAPSHOT_INTERVAL = isLocalhost ? 10 : 100;
      const loop = () => {
        if (this.renderer?.render) {
          this.renderer.render();
        } else if (this.callbacks.render) {
          this.callbacks.render();
        }
        if (this.checkIsAuthority() && this.currentFrame - lastSnapshotFrame >= SNAPSHOT_INTERVAL) {
          this.sendSnapshot("loop");
          lastSnapshotFrame = this.currentFrame;
        }
        this.gameLoop = requestAnimationFrame(loop);
      };
      this.gameLoop = requestAnimationFrame(loop);
    }
    /**
     * Stop the render loop.
     */
    stopGameLoop() {
      if (this.gameLoop) {
        cancelAnimationFrame(this.gameLoop);
        this.gameLoop = null;
      }
    }
    /**
     * Handle disconnect.
     */
    handleDisconnect() {
      if (DEBUG_NETWORK)
        console.log("[ecs] Disconnected");
      this.stopGameLoop();
    }
    // ==========================================
    // Utility Methods
    // ==========================================
    /**
     * Check if this client is the authority.
     * Handles potential length mismatch between SDK and server client IDs.
     */
    checkIsAuthority() {
      if (this.localClientIdStr === null || this.authorityClientId === null) {
        return false;
      }
      const minLen = Math.min(this.localClientIdStr.length, this.authorityClientId.length);
      return this.localClientIdStr.substring(0, minLen) === this.authorityClientId.substring(0, minLen);
    }
    /**
     * Check if this client is the authority (public).
     */
    isAuthority() {
      return this.checkIsAuthority();
    }
    /**
     * Check if connected.
     */
    isConnected() {
      return this.connection !== null;
    }
    /**
     * Get current frame.
     */
    getFrame() {
      return this.currentFrame;
    }
    /**
     * Get server tick rate.
     */
    getServerFps() {
      return this.serverFps;
    }
    /**
     * Get render interpolation alpha (0-1).
     */
    getRenderAlpha() {
      if (this.lastTickTime === 0)
        return 1;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const elapsed = now - this.lastTickTime;
      return Math.min(elapsed / this.tickIntervalMs, 1);
    }
    /**
     * Send input to network.
     */
    sendInput(input2) {
      if (!this.connection)
        return;
      const binary = encode(input2);
      this.connection.send(binary);
    }
    /**
     * Leave current room.
     */
    leaveRoom() {
      if (this.connection) {
        this.connection.leaveRoom();
        this.connection = null;
        this.stopGameLoop();
      }
    }
    /**
     * Get local client ID.
     */
    get localClientId() {
      return this.localClientIdStr;
    }
    /**
     * Set local client ID.
     */
    setLocalClientId(clientId) {
      this.localClientIdStr = clientId;
      const numId = this.internClientId(clientId);
      this.world.localClientId = numId;
    }
    /**
     * Get room ID.
     */
    getRoomId() {
      return this.connectedRoomId;
    }
    /**
     * Get last snapshot info.
     */
    getLastSnapshot() {
      return {
        hash: this.lastSnapshotHash,
        frame: this.lastSnapshotFrame,
        size: this.lastSnapshotSize,
        entityCount: this.lastSnapshotEntityCount
      };
    }
    /**
     * Get connected clients.
     */
    getClients() {
      return this.connectedClients;
    }
    /**
     * Get client ID (for debug UI).
     */
    getClientId() {
      return this.localClientIdStr;
    }
    /**
     * Get node URL (for debug UI).
     */
    getNodeUrl() {
      return null;
    }
    /**
     * Get upload rate in bytes/second (for debug UI).
     */
    getUploadRate() {
      return this.connection?.bandwidthOut || 0;
    }
    /**
     * Get download rate in bytes/second (for debug UI).
     */
    getDownloadRate() {
      return this.connection?.bandwidthIn || 0;
    }
    /**
     * Get drift stats (for debug UI).
     * Authority clients show 100% until they receive a comparison snapshot.
     */
    getDriftStats() {
      if (this.driftStats.totalChecks === 0) {
        const entityCount = this.world.getAllEntities().length;
        let estimatedFields = 0;
        for (const entity of this.world.getAllEntities()) {
          for (const comp of entity.getComponents()) {
            estimatedFields += comp.fieldNames.length;
          }
        }
        return {
          determinismPercent: 100,
          totalChecks: 0,
          matchingFieldCount: estimatedFields,
          totalFieldCount: estimatedFields
        };
      }
      return { ...this.driftStats };
    }
    /**
     * Attach a renderer.
     */
    setRenderer(renderer2) {
      this.renderer = renderer2;
    }
    /**
     * Get canvas from attached renderer.
     */
    getCanvas() {
      return this.renderer?.element ?? null;
    }
  };
  var GameEntityBuilder = class {
    constructor(game2, name) {
      this.game = game2;
      this.name = name;
      this.inputCommandsDef = null;
      this.worldBuilder = game2.world.defineEntity(name);
    }
    /**
     * Add a component to the entity definition.
     */
    with(component, defaults) {
      this.worldBuilder.with(component, defaults);
      return this;
    }
    /**
     * Define input commands for this entity type.
     */
    commands(def) {
      this.inputCommandsDef = def;
      return this;
    }
    /**
     * Specify which fields to sync in snapshots (field-level sync).
     * Only the specified fields are included in network snapshots.
     *
     * Use this to reduce bandwidth by only syncing essential fields.
     * Non-synced fields can be reconstructed via onRestore().
     *
     * @example
     * game.defineEntity('snake-segment')
     *     .with(Transform2D)
     *     .with(Sprite)
     *     .with(SnakeSegment)
     *     .syncOnly(['x', 'y', 'ownerId', 'spawnFrame'])
     *     .register();
     */
    syncOnly(fields) {
      this.worldBuilder._setSyncFields(fields);
      return this;
    }
    /**
     * Exclude all fields from syncing for this entity type.
     * The entity will not be included in network snapshots at all.
     *
     * Use this for purely client-local entities like cameras, UI, or effects.
     *
     * @example
     * game.defineEntity('local-camera')
     *     .with(Camera2D)
     *     .syncNone()
     *     .register();
     */
    syncNone() {
      this.worldBuilder._setSyncFields([]);
      return this;
    }
    /**
     * @deprecated Use syncOnly() instead for clarity
     */
    sync(fields) {
      return this.syncOnly(fields);
    }
    /**
     * Set a callback to reconstruct non-synced fields after snapshot load.
     * Called for each entity of this type after loading a snapshot.
     *
     * @example
     * game.defineEntity('snake-segment')
     *     .with(Transform2D)
     *     .with(Sprite)
     *     .with(SnakeSegment)
     *     .syncOnly(['x', 'y', 'ownerId', 'spawnFrame'])
     *     .onRestore((entity, game) => {
     *         const owner = game.world.getEntityByClientId(entity.get(SnakeSegment).ownerId);
     *         if (owner) {
     *             entity.get(Sprite).color = owner.get(Sprite).color;
     *             entity.get(Sprite).radius = SEGMENT_RADIUS;
     *         }
     *     })
     *     .register();
     */
    onRestore(callback) {
      this.worldBuilder._setOnRestore(callback);
      return this;
    }
    /**
     * Finalize and register the entity definition.
     */
    register() {
      this.worldBuilder._ensureRegistered();
      return this.game._registerPrefab(this.name, this.worldBuilder);
    }
  };
  function createGame() {
    return new Game();
  }

  // ../../engine/src/plugins/simple-2d-renderer.ts
  var Simple2DRenderer = class {
    constructor(game2, canvas2, options = {}) {
      this.imageCache = /* @__PURE__ */ new Map();
      this._cameraEntity = null;
      this.game = game2;
      if (typeof canvas2 === "string") {
        const el = document.querySelector(canvas2);
        if (!el)
          throw new Error(`Canvas not found: ${canvas2}`);
        this.canvas = el;
      } else {
        this.canvas = canvas2;
      }
      const ctx = this.canvas.getContext("2d");
      if (!ctx)
        throw new Error("Could not get 2d context");
      this.ctx = ctx;
      this.options = {
        background: options.background ?? "#111",
        autoClear: options.autoClear ?? true
      };
      game2.setRenderer(this);
    }
    /** Canvas width */
    get width() {
      return this.canvas.width;
    }
    /** Canvas height */
    get height() {
      return this.canvas.height;
    }
    /** The canvas element */
    get element() {
      return this.canvas;
    }
    /** The 2D context (for custom drawing) */
    get context() {
      return this.ctx;
    }
    /**
     * Set the camera entity to use for rendering.
     * When set, the renderer will apply camera transform (position, zoom).
     */
    set camera(entity) {
      this._cameraEntity = entity;
      if (entity) {
        try {
          const cam = entity.get(Camera2D);
          cam.viewportWidth = this.canvas.width;
          cam.viewportHeight = this.canvas.height;
        } catch {
        }
      }
    }
    get camera() {
      return this._cameraEntity;
    }
    /**
     * Render all entities with Sprite component.
     */
    render() {
      const { ctx, canvas: canvas2, options, game: game2 } = this;
      if (options.autoClear) {
        ctx.fillStyle = options.background;
        ctx.fillRect(0, 0, canvas2.width, canvas2.height);
      }
      const alpha = game2.getRenderAlpha();
      let camX = 0, camY = 0, camZoom = 1;
      if (this._cameraEntity && !this._cameraEntity.destroyed) {
        try {
          const cam = this._cameraEntity.get(Camera2D);
          camX = cam.x;
          camY = cam.y;
          camZoom = cam.zoom;
          cam.viewportWidth = canvas2.width;
          cam.viewportHeight = canvas2.height;
        } catch {
        }
      }
      const entities = [];
      for (const entity of game2.getAllEntities()) {
        if (entity.destroyed)
          continue;
        try {
          const sprite = entity.get(Sprite);
          if (sprite && sprite.visible) {
            entity.interpolate(alpha);
            entities.push({ entity, layer: sprite.layer });
          }
        } catch {
        }
      }
      entities.sort((a, b) => a.layer - b.layer);
      ctx.save();
      ctx.translate(canvas2.width / 2, canvas2.height / 2);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-camX, -camY);
      for (const { entity } of entities) {
        this.drawEntity(entity);
      }
      ctx.restore();
    }
    /**
     * Draw a single entity.
     */
    drawEntity(entity) {
      const { ctx, game: game2 } = this;
      const sprite = entity.get(Sprite);
      const x = entity.render.interpX + sprite.offsetX;
      const y = entity.render.interpY + sprite.offsetY;
      const scaleX = sprite.scaleX;
      const scaleY = sprite.scaleY;
      const colorStr = game2.getString("color", sprite.color) || "#fff";
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scaleX, scaleY);
      const shape = sprite.shape;
      if (shape === SHAPE_CIRCLE) {
        const radius = sprite.radius;
        ctx.fillStyle = colorStr;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === SHAPE_RECT) {
        const w = sprite.width;
        const h = sprite.height;
        ctx.fillStyle = colorStr;
        ctx.fillRect(-w / 2, -h / 2, w, h);
      } else if (shape === SPRITE_IMAGE) {
        const imageId = game2.getString("sprite", sprite.spriteId);
        if (imageId) {
          const img = this.getImage(imageId);
          if (img && img.complete) {
            const w = sprite.width || img.width;
            const h = sprite.height || img.height;
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
          }
        }
      }
      ctx.restore();
    }
    /**
     * Get or load an image.
     */
    getImage(src) {
      let img = this.imageCache.get(src);
      if (!img) {
        img = new Image();
        img.src = src;
        this.imageCache.set(src, img);
      }
      return img;
    }
    /**
     * Preload images for faster rendering.
     */
    preload(images) {
      return Promise.all(
        images.map((src) => new Promise((resolve) => {
          const img = this.getImage(src);
          if (img?.complete) {
            resolve();
          } else if (img) {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        }))
      ).then(() => {
      });
    }
  };

  // ../../engine/src/plugins/input-plugin.ts
  var InputPlugin = class {
    constructor(game2, canvas2) {
      /** Action definitions */
      this.actions = /* @__PURE__ */ new Map();
      /** Current bindings (may differ from defaults after rebind) */
      this.bindings = /* @__PURE__ */ new Map();
      /** Raw input state */
      this.mousePos = { x: 0, y: 0 };
      this.keysDown = /* @__PURE__ */ new Set();
      this.mouseButtons = /* @__PURE__ */ new Set();
      /** Send interval handle */
      this.sendInterval = null;
      /** Last sent input (for deduplication) */
      this.lastSentInput = "";
      this.game = game2;
      if (typeof canvas2 === "string") {
        const el = document.querySelector(canvas2);
        if (!el)
          throw new Error(`Canvas not found: ${canvas2}`);
        this.canvas = el;
      } else {
        this.canvas = canvas2;
      }
      this.setupListeners();
      this.startSendLoop();
    }
    /**
     * Define an action with default bindings.
     */
    action(name, def) {
      this.actions.set(name, def);
      if (!this.bindings.has(name)) {
        this.bindings.set(name, [...def.bindings]);
      }
      return this;
    }
    /**
     * Rebind an action to new bindings.
     */
    rebind(name, bindings) {
      if (!this.actions.has(name)) {
        console.warn(`[InputPlugin] Unknown action: ${name}`);
        return this;
      }
      this.bindings.set(name, bindings);
      return this;
    }
    /**
     * Reset action to default bindings.
     */
    resetBinding(name) {
      const action = this.actions.get(name);
      if (action) {
        this.bindings.set(name, [...action.bindings]);
      }
      return this;
    }
    /**
     * Reset all bindings to defaults.
     */
    resetAllBindings() {
      for (const [name, action] of this.actions) {
        this.bindings.set(name, [...action.bindings]);
      }
      return this;
    }
    /**
     * Get current bindings for serialization.
     * Only includes string bindings (callbacks can't be serialized).
     */
    getBindings() {
      const result = {};
      for (const [name, sources] of this.bindings) {
        result[name] = sources.filter((s) => typeof s === "string");
      }
      return result;
    }
    /**
     * Load bindings from serialized data.
     */
    loadBindings(data) {
      for (const [name, sources] of Object.entries(data)) {
        if (this.actions.has(name)) {
          this.bindings.set(name, sources);
        }
      }
      return this;
    }
    /**
     * Get current value of an action.
     */
    get(name) {
      const action = this.actions.get(name);
      const sources = this.bindings.get(name);
      if (!action || !sources)
        return null;
      if (action.type === "button") {
        return this.resolveButton(sources);
      } else {
        return this.resolveVector(sources);
      }
    }
    /**
     * Get all action values as an object.
     */
    getAll() {
      const result = {};
      for (const name of this.actions.keys()) {
        result[name] = this.get(name);
      }
      return result;
    }
    /**
     * Resolve button value from sources (OR logic).
     */
    resolveButton(sources) {
      for (const source of sources) {
        if (typeof source === "function") {
          if (source())
            return true;
        } else if (this.resolveStringButton(source)) {
          return true;
        }
      }
      return false;
    }
    /**
     * Resolve vector value from sources (additive, clamped).
     */
    resolveVector(sources) {
      let x = 0, y = 0;
      for (const source of sources) {
        let vec = null;
        if (typeof source === "function") {
          vec = source();
        } else {
          vec = this.resolveStringVector(source);
        }
        if (vec) {
          x += vec.x;
          y += vec.y;
        }
      }
      if (Math.abs(x) <= 1 && Math.abs(y) <= 1) {
        const len = Math.sqrt(x * x + y * y);
        if (len > 1) {
          x /= len;
          y /= len;
        }
      }
      return { x, y };
    }
    /**
     * Resolve a string binding to button value.
     */
    resolveStringButton(source) {
      if (source.startsWith("key:")) {
        const key = source.slice(4).toLowerCase();
        return this.keysDown.has(key);
      }
      if (source.startsWith("mouse:")) {
        const button = source.slice(6);
        if (button === "left")
          return this.mouseButtons.has(0);
        if (button === "right")
          return this.mouseButtons.has(2);
        if (button === "middle")
          return this.mouseButtons.has(1);
      }
      return false;
    }
    /**
     * Resolve a string binding to vector value.
     */
    resolveStringVector(source) {
      if (source === "mouse") {
        return { ...this.mousePos };
      }
      if (source === "keys:wasd") {
        return this.getWASD();
      }
      if (source === "keys:arrows") {
        return this.getArrows();
      }
      if (source === "keys:wasd+arrows") {
        const wasd = this.getWASD();
        const arrows = this.getArrows();
        return {
          x: Math.max(-1, Math.min(1, wasd.x + arrows.x)),
          y: Math.max(-1, Math.min(1, wasd.y + arrows.y))
        };
      }
      return null;
    }
    /**
     * Get WASD direction.
     */
    getWASD() {
      let x = 0, y = 0;
      if (this.keysDown.has("a"))
        x -= 1;
      if (this.keysDown.has("d"))
        x += 1;
      if (this.keysDown.has("w"))
        y -= 1;
      if (this.keysDown.has("s"))
        y += 1;
      return { x, y };
    }
    /**
     * Get arrow keys direction.
     */
    getArrows() {
      let x = 0, y = 0;
      if (this.keysDown.has("arrowleft"))
        x -= 1;
      if (this.keysDown.has("arrowright"))
        x += 1;
      if (this.keysDown.has("arrowup"))
        y -= 1;
      if (this.keysDown.has("arrowdown"))
        y += 1;
      return { x, y };
    }
    /**
     * Set up event listeners.
     */
    setupListeners() {
      this.canvas.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
      });
      this.canvas.addEventListener("mousedown", (e) => {
        this.mouseButtons.add(e.button);
      });
      this.canvas.addEventListener("mouseup", (e) => {
        this.mouseButtons.delete(e.button);
      });
      window.addEventListener("keydown", (e) => {
        this.keysDown.add(e.key.toLowerCase());
      });
      window.addEventListener("keyup", (e) => {
        this.keysDown.delete(e.key.toLowerCase());
      });
      window.addEventListener("blur", () => {
        this.keysDown.clear();
        this.mouseButtons.clear();
      });
    }
    /**
     * Start the send loop.
     */
    startSendLoop() {
      const sendRate = 1e3 / (this.game.getServerFps?.() || 20);
      this.sendInterval = window.setInterval(() => {
        if (this.game.isConnected() && this.game.localClientId && this.actions.size > 0) {
          const input2 = this.getAll();
          const inputStr = this.inputToString(input2);
          if (inputStr !== this.lastSentInput) {
            this.lastSentInput = inputStr;
            this.game.sendInput(input2);
          }
        }
      }, sendRate);
    }
    /**
     * Convert input to string for comparison.
     * Uses rounding for vectors to avoid sending tiny mouse movements.
     */
    inputToString(input2) {
      const normalized = {};
      for (const [key, value] of Object.entries(input2)) {
        if (value && typeof value === "object" && "x" in value && "y" in value) {
          normalized[key] = { x: Math.round(value.x / 10) * 10, y: Math.round(value.y / 10) * 10 };
        } else {
          normalized[key] = value;
        }
      }
      return JSON.stringify(normalized);
    }
    /**
     * Stop the send loop.
     */
    destroy() {
      if (this.sendInterval !== null) {
        clearInterval(this.sendInterval);
        this.sendInterval = null;
      }
    }
  };

  // ../../engine/src/plugins/camera-system.ts
  var CameraSystem = class {
    constructor(game2, options = {}) {
      this.game = game2;
      this.options = {
        defaultZoom: options.defaultZoom ?? 1,
        defaultSmoothing: options.defaultSmoothing ?? 0.1,
        minZoom: options.minZoom ?? 0.1,
        maxZoom: options.maxZoom ?? 10
      };
      game2.addSystem(this.update.bind(this), { phase: "render" });
    }
    /**
     * Update all cameras.
     */
    update() {
      for (const entity of this.game.query("Camera2D")) {
        this.updateCamera(entity);
      }
    }
    /**
     * Update a single camera entity.
     */
    updateCamera(cameraEntity2) {
      const cam = cameraEntity2.get(Camera2D);
      if (cam.followEntity !== 0) {
        const target = this.game.world.getEntity(cam.followEntity);
        if (target && !target.destroyed) {
          try {
            const transform = target.get(Transform2D);
            cam.x += (transform.x - cam.x) * cam.smoothing;
            cam.y += (transform.y - cam.y) * cam.smoothing;
          } catch {
          }
        }
      }
      if (cam.zoom !== cam.targetZoom) {
        cam.zoom += (cam.targetZoom - cam.zoom) * cam.smoothing;
        cam.zoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, cam.zoom));
      }
    }
    /**
     * Set camera to follow an entity.
     */
    follow(cameraEntity2, targetEntity) {
      const cam = cameraEntity2.get(Camera2D);
      cam.followEntity = targetEntity ? targetEntity.eid : 0;
    }
    /**
     * Center camera on multiple entities (weighted by optional areas).
     */
    centerOn(cameraEntity2, entities, weights) {
      if (entities.length === 0)
        return;
      const cam = cameraEntity2.get(Camera2D);
      let totalWeight = 0;
      let centerX = 0;
      let centerY = 0;
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.destroyed)
          continue;
        try {
          const transform = entity.get(Transform2D);
          const weight = weights?.[i] ?? 1;
          centerX += transform.x * weight;
          centerY += transform.y * weight;
          totalWeight += weight;
        } catch {
        }
      }
      if (totalWeight > 0) {
        cam.x += (centerX / totalWeight - cam.x) * cam.smoothing;
        cam.y += (centerY / totalWeight - cam.y) * cam.smoothing;
      }
    }
    /**
     * Convert world coordinates to screen coordinates.
     */
    worldToScreen(cameraEntity2, worldX, worldY) {
      const cam = cameraEntity2.get(Camera2D);
      return {
        x: (worldX - cam.x) * cam.zoom + cam.viewportWidth / 2,
        y: (worldY - cam.y) * cam.zoom + cam.viewportHeight / 2
      };
    }
    /**
     * Convert screen coordinates to world coordinates.
     */
    screenToWorld(cameraEntity2, screenX, screenY) {
      const cam = cameraEntity2.get(Camera2D);
      return {
        x: (screenX - cam.viewportWidth / 2) / cam.zoom + cam.x,
        y: (screenY - cam.viewportHeight / 2) / cam.zoom + cam.y
      };
    }
    /**
     * Set zoom with optional target position.
     */
    setZoom(cameraEntity2, zoom, immediate = false) {
      const cam = cameraEntity2.get(Camera2D);
      const clampedZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, zoom));
      cam.targetZoom = clampedZoom;
      if (immediate) {
        cam.zoom = clampedZoom;
      }
    }
    /**
     * Get visible bounds in world coordinates.
     */
    getVisibleBounds(cameraEntity2) {
      const cam = cameraEntity2.get(Camera2D);
      const halfWidth = cam.viewportWidth / 2 / cam.zoom;
      const halfHeight = cam.viewportHeight / 2 / cam.zoom;
      return {
        left: cam.x - halfWidth,
        top: cam.y - halfHeight,
        right: cam.x + halfWidth,
        bottom: cam.y + halfHeight
      };
    }
    /**
     * Check if a world point is visible.
     */
    isPointVisible(cameraEntity2, worldX, worldY, margin = 0) {
      const bounds = this.getVisibleBounds(cameraEntity2);
      return worldX >= bounds.left - margin && worldX <= bounds.right + margin && worldY >= bounds.top - margin && worldY <= bounds.bottom + margin;
    }
  };

  // ../../engine/src/plugins/determinism-guard.ts
  var originalFunctions = {};
  var installedGame = null;
  var warnedFunctions = /* @__PURE__ */ new Set();
  function isSimulating() {
    return installedGame?.world?._isSimulating ?? false;
  }
  function warnOnce(key, message) {
    if (!warnedFunctions.has(key)) {
      warnedFunctions.add(key);
      console.warn(message);
    }
  }
  function enableDeterminismGuard(game2) {
    if (installedGame) {
      console.warn("Determinism guard already installed for another game instance");
      return;
    }
    installedGame = game2;
    warnedFunctions.clear();
    originalFunctions.mathRandom = Math.random;
    Math.random = function() {
      if (isSimulating()) {
        warnOnce(
          "Math.random",
          "\u26A0\uFE0F Math.random() is non-deterministic!\n   Use dRandom() instead for deterministic random numbers.\n   Example: const r = dRandom();"
        );
      }
      return originalFunctions.mathRandom();
    };
    originalFunctions.mathSqrt = Math.sqrt;
    Math.sqrt = function(x) {
      if (isSimulating()) {
        warnOnce(
          "Math.sqrt",
          "\u26A0\uFE0F Math.sqrt() is non-deterministic!\n   Use dSqrt() instead for deterministic square root.\n   Example: const dist = dSqrt(dx * dx + dy * dy);"
        );
      }
      return originalFunctions.mathSqrt(x);
    };
    originalFunctions.dateNow = Date.now;
    Date.now = function() {
      if (isSimulating()) {
        warnOnce(
          "Date.now",
          "\u26A0\uFE0F Date.now() is non-deterministic!\n   Use game.time instead for deterministic timing.\n   Example: const respawnAt = game.time + 3000;"
        );
      }
      return originalFunctions.dateNow();
    };
    if (typeof performance !== "undefined") {
      originalFunctions.performanceNow = performance.now.bind(performance);
      performance.now = function() {
        if (isSimulating()) {
          warnOnce(
            "performance.now",
            "\u26A0\uFE0F performance.now() is non-deterministic!\n   Use game.time instead for deterministic timing."
          );
        }
        return originalFunctions.performanceNow();
      };
    }
    console.log("\u{1F6E1}\uFE0F Determinism guard enabled");
  }

  // ../../engine/src/version.ts
  var ENGINE_VERSION = "63bd2a3";

  // ../../engine/src/plugins/debug-ui.ts
  var debugDiv = null;
  var updateInterval = null;
  var hashCallback = null;
  var debugTarget = null;
  var frameCount = 0;
  var renderFps = 0;
  var fpsUpdateTime = 0;
  function enableDebugUI(target, options = {}) {
    if (debugDiv)
      return debugDiv;
    debugTarget = target || null;
    if (target && "world" in target) {
      enableDeterminismGuard(target);
    }
    const pos = options.position || "top-right";
    debugDiv = document.createElement("div");
    debugDiv.id = "modu-debug-ui";
    debugDiv.style.cssText = `
        position: fixed;
        ${pos.includes("top") ? "top: 10px" : "bottom: 10px"};
        ${pos.includes("right") ? "right: 10px" : "left: 10px"};
        background: rgba(0, 0, 0, 0.8);
        color: #0f0;
        font: 12px monospace;
        padding: 8px 12px;
        border-radius: 4px;
        z-index: 10000;
        min-width: 180px;
        pointer-events: none;
    `;
    document.body.appendChild(debugDiv);
    const update = (now) => {
      if (!debugDiv)
        return;
      frameCount++;
      if (now - fpsUpdateTime >= 1e3) {
        renderFps = frameCount;
        frameCount = 0;
        fpsUpdateTime = now;
      }
      const eng = debugTarget;
      if (!eng) {
        debugDiv.innerHTML = '<div style="color:#f00">No engine instance</div>';
        return;
      }
      const clientId = eng.getClientId();
      const frame = eng.getFrame();
      const nodeUrl = eng.getNodeUrl();
      const lastSnap = eng.getLastSnapshot();
      const fps = eng.getServerFps();
      const roomId = eng.getRoomId();
      const up = eng.getUploadRate();
      const down = eng.getDownloadRate();
      const clients = eng.getClients();
      const isAuthority = eng.isAuthority?.() || false;
      let currentHash = "--------";
      try {
        if (hashCallback) {
          const hash = hashCallback();
          currentHash = typeof hash === "number" ? hash.toString(16).padStart(8, "0") : String(hash).slice(0, 8);
        } else {
          currentHash = eng.getStateHash();
        }
      } catch (e) {
        currentHash = "error";
      }
      const formatBandwidth = (bytes) => {
        if (bytes >= 1024) {
          return (bytes / 1024).toFixed(1) + " kB/s";
        }
        return Math.round(bytes) + " B/s";
      };
      const upStr = formatBandwidth(up);
      const downStr = formatBandwidth(down);
      const driftStats = eng.getDriftStats?.() || { determinismPercent: 100, totalChecks: 0, matchingFieldCount: 0, totalFieldCount: 0 };
      const detPct = (Math.floor(driftStats.determinismPercent * 10) / 10).toFixed(1);
      const detColor = driftStats.determinismPercent === 100 ? "#0f0" : driftStats.determinismPercent >= 99 ? "#ff0" : "#f00";
      let syncStatus;
      if (isAuthority) {
        syncStatus = `<span style="color:#888">I'm authority</span>`;
      } else if (driftStats.totalChecks === 0) {
        syncStatus = '<span style="color:#888">waiting...</span>';
      } else {
        syncStatus = `<span style="color:${detColor}">${detPct}%</span> <span style="color:#888">(${driftStats.matchingFieldCount}/${driftStats.totalFieldCount})</span>`;
      }
      const framesAgo = lastSnap.frame ? frame - lastSnap.frame : 0;
      const snapInfo = lastSnap.hash ? `${lastSnap.hash.slice(0, 8)} <span style="color:#888">(${framesAgo} ago)</span>` : "none";
      const formatSize = (bytes) => {
        if (bytes >= 1024 * 1024) {
          return (bytes / (1024 * 1024)).toFixed(2) + " MB";
        } else if (bytes >= 1024) {
          return (bytes / 1024).toFixed(1) + " KB";
        }
        return bytes + " B";
      };
      const sizeStr = lastSnap.size > 0 ? formatSize(lastSnap.size) : "-";
      const entityStr = lastSnap.entityCount > 0 ? String(lastSnap.entityCount) : "-";
      const sectionStyle = "color:#666;font-size:10px;margin-top:6px;margin-bottom:2px;border-bottom:1px solid #333;";
      debugDiv.innerHTML = `
            <div style="${sectionStyle}">ROOM</div>
            <div>ID: <span style="color:#fff">${roomId || "-"}</span></div>
            <div>Players: <span style="color:#ff0">${clients.length}</span></div>
            <div>Frame: <span style="color:#fff">${frame}</span></div>
            <div>URL: <span style="color:#0ff">${nodeUrl || "-"}</span></div>

            <div style="${sectionStyle}">ME</div>
            <div>Authority: <span style="color:${isAuthority ? "#0ff" : "#888"}">${isAuthority ? "Yes" : "No"}</span></div>
            <div>Client: <span style="color:#ff0">${clientId ? clientId.slice(0, 8) : "-"}</span></div>

            <div style="${sectionStyle}">ENGINE</div>
            <div>Commit: <span style="color:#888">${ENGINE_VERSION}</span></div>
            <div>FPS: <span style="color:#0f0">${renderFps}</span> render, <span style="color:#0f0">${fps}</span> tick</div>
            <div>Net: <span style="color:#0f0">${upStr}</span> up, <span style="color:#f80">${downStr}</span> down</div>

            <div style="${sectionStyle}">SNAPSHOT</div>
            <div>Current: <span style="color:#f0f">${currentHash}</span></div>
            <div>Received: <span style="color:#f80">${snapInfo}</span></div>
            <div>Size: <span style="color:#fff">${sizeStr}</span>, Entities: <span style="color:#fff">${entityStr}</span></div>
            <div>Last Sync: ${syncStatus}</div>
        `;
    };
    const loop = (now) => {
      update(now);
      updateInterval = requestAnimationFrame(loop);
    };
    fpsUpdateTime = performance.now();
    requestAnimationFrame(loop);
    return debugDiv;
  }

  // ../../engine/src/plugins/physics2d/shapes.ts
  function aabb2DOverlap(a, b) {
    return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
  }
  function createCircle(radius) {
    return {
      type: 0 /* Circle */,
      radius: toFixed(radius)
    };
  }
  function createBox2DFromSize(width, height) {
    const halfWidth = toFixed(width) >> 1;
    const halfHeight = toFixed(height) >> 1;
    return {
      type: 1 /* Box */,
      halfWidth,
      halfHeight
    };
  }

  // ../../engine/src/plugins/physics2d/layers.ts
  var Layers = {
    NONE: 0,
    DEFAULT: 1 << 0,
    // 1
    PLAYER: 1 << 1,
    // 2
    ENEMY: 1 << 2,
    // 4
    PROJECTILE: 1 << 3,
    // 8
    ITEM: 1 << 4,
    // 16
    TRIGGER: 1 << 5,
    // 32
    WORLD: 1 << 6,
    // 64
    PROP: 1 << 7,
    // 128
    // Layers 8-15 reserved for game-specific use
    CUSTOM_1: 1 << 8,
    CUSTOM_2: 1 << 9,
    CUSTOM_3: 1 << 10,
    CUSTOM_4: 1 << 11,
    CUSTOM_5: 1 << 12,
    CUSTOM_6: 1 << 13,
    CUSTOM_7: 1 << 14,
    CUSTOM_8: 1 << 15,
    ALL: 65535
    // All layers
  };
  var DEFAULT_FILTER = {
    layer: Layers.DEFAULT,
    mask: Layers.ALL
  };
  function shouldCollide(a, b) {
    return (a.mask & b.layer) !== 0 && (b.mask & a.layer) !== 0;
  }

  // ../../engine/src/plugins/physics2d/rigid-body.ts
  var RESTITUTION_DEFAULT = toFixed(0);
  var FRICTION_DEFAULT = toFixed(0.5);
  var FP_ONE_TWELFTH = 5461;
  function vec2Zero2() {
    return { x: 0, y: 0 };
  }
  function vec22(x, y) {
    return { x: toFixed(x), y: toFixed(y) };
  }
  function vec2Add2(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
  }
  function vec2Scale2(v, s) {
    return { x: fpMul(v.x, s), y: fpMul(v.y, s) };
  }
  function vec2LengthSq2(v) {
    return fpMul(v.x, v.x) + fpMul(v.y, v.y);
  }
  var nextBodyId2D = 1;
  function resetBody2DIdCounter() {
    nextBodyId2D = 1;
  }
  function createBody2D(type, shape, x, y, label) {
    const mass = type === 2 /* Dynamic */ ? toFixed(1) : 0;
    const invMass = type === 2 /* Dynamic */ ? FP_ONE : 0;
    let inertia = 0;
    if (type === 2 /* Dynamic */) {
      if (shape.type === 0 /* Circle */) {
        const r = shape.radius;
        inertia = fpMul(fpMul(mass, FP_HALF), fpMul(r, r));
      } else {
        const w = shape.halfWidth << 1;
        const h = shape.halfHeight << 1;
        inertia = fpMul(fpMul(mass, FP_ONE_TWELFTH), fpMul(w, w) + fpMul(h, h));
      }
    }
    const bodyId = nextBodyId2D++;
    const bodyLabel = label || "body2d_" + bodyId;
    return {
      id: bodyId,
      type,
      shape,
      label: bodyLabel,
      position: vec22(x, y),
      angle: 0,
      linearVelocity: vec2Zero2(),
      angularVelocity: 0,
      mass,
      invMass,
      inertia: inertia || FP_ONE,
      invInertia: inertia ? fpDiv(FP_ONE, inertia) : 0,
      restitution: RESTITUTION_DEFAULT,
      friction: FRICTION_DEFAULT,
      isSleeping: false,
      sleepFrames: 0,
      lockRotation: false,
      isSensor: false,
      isBullet: false,
      filter: { ...DEFAULT_FILTER },
      userData: null
    };
  }

  // ../../engine/src/plugins/physics2d/collision.ts
  function computeAABB2D(body) {
    const { position, shape, angle } = body;
    if (shape.type === 0 /* Circle */) {
      const radius = shape.radius;
      return {
        minX: position.x - radius,
        minY: position.y - radius,
        maxX: position.x + radius,
        maxY: position.y + radius
      };
    } else {
      const box = shape;
      const halfWidth = box.halfWidth;
      const halfHeight = box.halfHeight;
      if (angle === 0) {
        return {
          minX: position.x - halfWidth,
          minY: position.y - halfHeight,
          maxX: position.x + halfWidth,
          maxY: position.y + halfHeight
        };
      }
      const cosAngle = fpCos(angle);
      const sinAngle = fpSin(angle);
      const absCos = fpAbs(cosAngle);
      const absSin = fpAbs(sinAngle);
      const extentX = fpMul(halfWidth, absCos) + fpMul(halfHeight, absSin);
      const extentY = fpMul(halfWidth, absSin) + fpMul(halfHeight, absCos);
      return {
        minX: position.x - extentX,
        minY: position.y - extentY,
        maxX: position.x + extentX,
        maxY: position.y + extentY
      };
    }
  }
  function detectCollision2D(bodyA, bodyB) {
    const shapeA = bodyA.shape;
    const shapeB = bodyB.shape;
    if (shapeA.type === 0 /* Circle */ && shapeB.type === 0 /* Circle */) {
      return detectCircleCircle(bodyA, bodyB);
    }
    if (shapeA.type === 1 /* Box */ && shapeB.type === 1 /* Box */) {
      return detectBoxBox(bodyA, bodyB);
    }
    if (shapeA.type === 0 /* Circle */ && shapeB.type === 1 /* Box */) {
      return detectCircleBox(bodyA, bodyB);
    }
    if (shapeA.type === 1 /* Box */ && shapeB.type === 0 /* Circle */) {
      const contact = detectCircleBox(bodyB, bodyA);
      if (contact) {
        return {
          bodyA,
          bodyB,
          point: contact.point,
          normal: { x: -contact.normal.x, y: -contact.normal.y },
          depth: contact.depth
        };
      }
      return null;
    }
    return null;
  }
  function detectCircleCircle(circleA, circleB) {
    const radiusA = circleA.shape.radius;
    const radiusB = circleB.shape.radius;
    const sumRadius = radiusA + radiusB;
    const deltaX = circleB.position.x - circleA.position.x;
    const deltaY = circleB.position.y - circleA.position.y;
    const distanceSq = fpMul(deltaX, deltaX) + fpMul(deltaY, deltaY);
    const minDistSq = fpMul(sumRadius, sumRadius);
    if (distanceSq >= minDistSq)
      return null;
    const distance = fpSqrt(distanceSq);
    const penetration = sumRadius - distance;
    let normalX, normalY;
    if (distance > 0) {
      const invDist = fpDiv(FP_ONE, distance);
      normalX = fpMul(deltaX, invDist);
      normalY = fpMul(deltaY, invDist);
    } else {
      normalX = FP_ONE;
      normalY = 0;
    }
    const contactX = circleA.position.x + fpMul(normalX, radiusA);
    const contactY = circleA.position.y + fpMul(normalY, radiusA);
    return {
      bodyA: circleA,
      bodyB: circleB,
      point: { x: contactX, y: contactY },
      normal: { x: normalX, y: normalY },
      depth: penetration
    };
  }
  function detectBoxBox(boxA, boxB) {
    const shapeA = boxA.shape;
    const shapeB = boxB.shape;
    const deltaX = boxB.position.x - boxA.position.x;
    const deltaY = boxB.position.y - boxA.position.y;
    const overlapX = shapeA.halfWidth + shapeB.halfWidth - fpAbs(deltaX);
    const overlapY = shapeA.halfHeight + shapeB.halfHeight - fpAbs(deltaY);
    if (overlapX <= 0 || overlapY <= 0)
      return null;
    let normalX, normalY;
    let penetration;
    if (overlapX < overlapY) {
      penetration = overlapX;
      normalX = deltaX > 0 ? FP_ONE : -FP_ONE;
      normalY = 0;
    } else {
      penetration = overlapY;
      normalX = 0;
      normalY = deltaY > 0 ? FP_ONE : -FP_ONE;
    }
    const contactX = boxA.position.x + boxB.position.x >> 1;
    const contactY = boxA.position.y + boxB.position.y >> 1;
    return {
      bodyA: boxA,
      bodyB: boxB,
      point: { x: contactX, y: contactY },
      normal: { x: normalX, y: normalY },
      depth: penetration
    };
  }
  function detectCircleBox(circle, box) {
    const radius = circle.shape.radius;
    const boxShape = box.shape;
    const localX = circle.position.x - box.position.x;
    const localY = circle.position.y - box.position.y;
    const clampedX = fpMax(-boxShape.halfWidth, fpMin(boxShape.halfWidth, localX));
    const clampedY = fpMax(-boxShape.halfHeight, fpMin(boxShape.halfHeight, localY));
    const centerInside = fpAbs(localX) < boxShape.halfWidth && fpAbs(localY) < boxShape.halfHeight;
    let normalX, normalY;
    let penetration;
    if (centerInside) {
      const distToRight = boxShape.halfWidth - localX;
      const distToLeft = boxShape.halfWidth + localX;
      const distToTop = boxShape.halfHeight - localY;
      const distToBottom = boxShape.halfHeight + localY;
      let minDist = distToRight;
      normalX = FP_ONE;
      normalY = 0;
      if (distToLeft < minDist) {
        minDist = distToLeft;
        normalX = -FP_ONE;
        normalY = 0;
      }
      if (distToTop < minDist) {
        minDist = distToTop;
        normalX = 0;
        normalY = FP_ONE;
      }
      if (distToBottom < minDist) {
        minDist = distToBottom;
        normalX = 0;
        normalY = -FP_ONE;
      }
      penetration = minDist + radius;
    } else {
      const diffX = localX - clampedX;
      const diffY = localY - clampedY;
      const distanceSq = fpMul(diffX, diffX) + fpMul(diffY, diffY);
      if (distanceSq >= fpMul(radius, radius))
        return null;
      const distance = fpSqrt(distanceSq);
      penetration = radius - distance;
      if (distance > 0) {
        const invDist = fpDiv(FP_ONE, distance);
        normalX = fpMul(-diffX, invDist);
        normalY = fpMul(-diffY, invDist);
      } else {
        normalX = FP_ONE;
        normalY = 0;
      }
    }
    const contactX = circle.position.x + fpMul(normalX, radius);
    const contactY = circle.position.y + fpMul(normalY, radius);
    return {
      bodyA: circle,
      bodyB: box,
      point: { x: contactX, y: contactY },
      normal: { x: normalX, y: normalY },
      depth: penetration
    };
  }
  function resolveCollision2D(contact) {
    const { bodyA, bodyB, normal, depth } = contact;
    if (bodyA.isSensor || bodyB.isSensor)
      return;
    const typeA = bodyA.type;
    const typeB = bodyB.type;
    if (typeA === 0 /* Static */ && typeB === 0 /* Static */)
      return;
    applyPositionCorrection(bodyA, bodyB, normal, depth);
    if (typeA === 2 /* Dynamic */ || typeB === 2 /* Dynamic */) {
      applyVelocityImpulse(bodyA, bodyB, normal);
    }
  }
  function applyPositionCorrection(bodyA, bodyB, normal, depth) {
    const typeA = bodyA.type;
    const typeB = bodyB.type;
    const aMovable = typeA !== 0 /* Static */;
    const bMovable = typeB !== 0 /* Static */;
    if (!aMovable && !bMovable)
      return;
    const slop = toFixed(0.01);
    const correctionDepth = fpMax(0, depth - slop);
    if (correctionDepth <= 0)
      return;
    if (aMovable && bMovable) {
      const halfCorrection = correctionDepth >> 1;
      bodyA.position.x = bodyA.position.x - fpMul(normal.x, halfCorrection);
      bodyA.position.y = bodyA.position.y - fpMul(normal.y, halfCorrection);
      bodyB.position.x = bodyB.position.x + fpMul(normal.x, halfCorrection);
      bodyB.position.y = bodyB.position.y + fpMul(normal.y, halfCorrection);
    } else if (aMovable) {
      bodyA.position.x = bodyA.position.x - fpMul(normal.x, correctionDepth);
      bodyA.position.y = bodyA.position.y - fpMul(normal.y, correctionDepth);
    } else {
      bodyB.position.x = bodyB.position.x + fpMul(normal.x, correctionDepth);
      bodyB.position.y = bodyB.position.y + fpMul(normal.y, correctionDepth);
    }
  }
  function applyVelocityImpulse(bodyA, bodyB, normal) {
    const invMassA = bodyA.type === 2 /* Dynamic */ ? bodyA.invMass : 0;
    const invMassB = bodyB.type === 2 /* Dynamic */ ? bodyB.invMass : 0;
    const totalInvMass = invMassA + invMassB;
    if (totalInvMass === 0)
      return;
    const relVelX = bodyB.linearVelocity.x - bodyA.linearVelocity.x;
    const relVelY = bodyB.linearVelocity.y - bodyA.linearVelocity.y;
    const velAlongNormal = fpMul(relVelX, normal.x) + fpMul(relVelY, normal.y);
    if (velAlongNormal > 0)
      return;
    const restitution = fpMin(bodyA.restitution, bodyB.restitution);
    const impulseMag = fpDiv(
      fpMul(-(FP_ONE + restitution), velAlongNormal),
      totalInvMass
    );
    const impulseX = fpMul(normal.x, impulseMag);
    const impulseY = fpMul(normal.y, impulseMag);
    if (bodyA.type === 2 /* Dynamic */) {
      bodyA.linearVelocity.x = bodyA.linearVelocity.x - fpMul(impulseX, invMassA);
      bodyA.linearVelocity.y = bodyA.linearVelocity.y - fpMul(impulseY, invMassA);
    }
    if (bodyB.type === 2 /* Dynamic */) {
      bodyB.linearVelocity.x = bodyB.linearVelocity.x + fpMul(impulseX, invMassB);
      bodyB.linearVelocity.y = bodyB.linearVelocity.y + fpMul(impulseY, invMassB);
    }
    applyFrictionImpulse(bodyA, bodyB, normal, impulseMag, invMassA, invMassB, totalInvMass);
  }
  function applyFrictionImpulse(bodyA, bodyB, normal, normalImpulse, invMassA, invMassB, totalInvMass) {
    const relVelX = bodyB.linearVelocity.x - bodyA.linearVelocity.x;
    const relVelY = bodyB.linearVelocity.y - bodyA.linearVelocity.y;
    const velAlongNormal = fpMul(relVelX, normal.x) + fpMul(relVelY, normal.y);
    const tangentX = relVelX - fpMul(normal.x, velAlongNormal);
    const tangentY = relVelY - fpMul(normal.y, velAlongNormal);
    const tangentLenSq = fpMul(tangentX, tangentX) + fpMul(tangentY, tangentY);
    if (tangentLenSq === 0)
      return;
    const tangentLen = fpSqrt(tangentLenSq);
    const invTangentLen = fpDiv(FP_ONE, tangentLen);
    const tangentNormX = fpMul(tangentX, invTangentLen);
    const tangentNormY = fpMul(tangentY, invTangentLen);
    const friction = fpMul(bodyA.friction, bodyB.friction);
    const tangentVel = fpMul(relVelX, tangentNormX) + fpMul(relVelY, tangentNormY);
    let frictionMag = fpDiv(-tangentVel, totalInvMass);
    const maxFriction = fpMul(friction, fpAbs(normalImpulse));
    if (fpAbs(frictionMag) > maxFriction) {
      frictionMag = frictionMag > 0 ? maxFriction : -maxFriction;
    }
    const frictionX = fpMul(tangentNormX, frictionMag);
    const frictionY = fpMul(tangentNormY, frictionMag);
    if (bodyA.type === 2 /* Dynamic */) {
      bodyA.linearVelocity.x = bodyA.linearVelocity.x - fpMul(frictionX, invMassA);
      bodyA.linearVelocity.y = bodyA.linearVelocity.y - fpMul(frictionY, invMassA);
    }
    if (bodyB.type === 2 /* Dynamic */) {
      bodyB.linearVelocity.x = bodyB.linearVelocity.x + fpMul(frictionX, invMassB);
      bodyB.linearVelocity.y = bodyB.linearVelocity.y + fpMul(frictionY, invMassB);
    }
  }

  // ../../engine/src/plugins/physics2d/spatial-hash.ts
  function getBodyRadius(body) {
    if (body.shape.type === 0 /* Circle */) {
      return toFloat(body.shape.radius);
    } else {
      const box = body.shape;
      const hw = toFloat(box.halfWidth);
      const hh = toFloat(box.halfHeight);
      return Math.sqrt(hw * hw + hh * hh);
    }
  }
  var SpatialHash2D = class {
    /**
     * Create a spatial hash grid.
     * @param cellSize Size of each cell. Entities larger than this are
     *                 handled specially (checked against all others).
     */
    constructor(cellSize = 64) {
      this.cells = /* @__PURE__ */ new Map();
      this.bodyToCell = /* @__PURE__ */ new Map();
      // Oversized entities (diameter > cellSize) - checked against all others
      this.oversized = [];
      // All regular (non-oversized) bodies for oversized checks
      this.allRegular = [];
      this.cellSize = cellSize;
      this.invCellSize = 1 / cellSize;
    }
    /**
     * Hash a position to a cell key.
     * Uses bit packing for fast integer key: (x << 16) | y
     */
    hashPosition(x, y) {
      const cellX = Math.floor(x * this.invCellSize) & 65535;
      const cellY = Math.floor(y * this.invCellSize) & 65535;
      return cellX << 16 | cellY;
    }
    /**
     * Clear all cells (call at start of each frame).
     */
    clear() {
      this.cells.clear();
      this.bodyToCell.clear();
      this.oversized.length = 0;
      this.allRegular.length = 0;
    }
    /**
     * Insert a body into the grid.
     * Oversized bodies (diameter > cellSize) are tracked separately.
     */
    insert(body) {
      const radius = getBodyRadius(body);
      const diameter = radius * 2;
      if (diameter > this.cellSize) {
        this.oversized.push(body);
        return;
      }
      this.allRegular.push(body);
      const x = toFloat(body.position.x);
      const y = toFloat(body.position.y);
      const key = this.hashPosition(x, y);
      let cell = this.cells.get(key);
      if (!cell) {
        cell = [];
        this.cells.set(key, cell);
      }
      cell.push(body);
      this.bodyToCell.set(body, key);
    }
    /**
     * Insert all bodies into the grid.
     */
    insertAll(bodies) {
      for (const body of bodies) {
        this.insert(body);
      }
    }
    /**
     * Get all bodies in the same cell as a position.
     */
    queryPoint(x, y) {
      const key = this.hashPosition(x, y);
      return this.cells.get(key) || [];
    }
    /**
     * Get all bodies in the same and adjacent cells (3x3 neighborhood).
     * This handles bodies near cell boundaries.
     */
    queryNearby(body) {
      const x = toFloat(body.position.x);
      const y = toFloat(body.position.y);
      const cellX = Math.floor(x * this.invCellSize);
      const cellY = Math.floor(y * this.invCellSize);
      const result = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = cellX + dx & 65535;
          const ny = cellY + dy & 65535;
          const key = nx << 16 | ny;
          const cell = this.cells.get(key);
          if (cell) {
            for (const other of cell) {
              if (other !== body) {
                result.push(other);
              }
            }
          }
        }
      }
      return result;
    }
    /**
     * Query bodies within a radius (for larger entities that span multiple cells).
     */
    queryRadius(x, y, radius) {
      const cellRadius = Math.ceil(radius * this.invCellSize);
      const cellX = Math.floor(x * this.invCellSize);
      const cellY = Math.floor(y * this.invCellSize);
      const result = [];
      const seen = /* @__PURE__ */ new Set();
      for (let dx = -cellRadius; dx <= cellRadius; dx++) {
        for (let dy = -cellRadius; dy <= cellRadius; dy++) {
          const nx = cellX + dx & 65535;
          const ny = cellY + dy & 65535;
          const key = nx << 16 | ny;
          const cell = this.cells.get(key);
          if (cell) {
            for (const body of cell) {
              if (!seen.has(body)) {
                seen.add(body);
                result.push(body);
              }
            }
          }
        }
      }
      return result;
    }
    /**
     * Iterate over potential collision pairs, calling the callback for each.
     * Each pair is visited exactly once. No Set or deduplication needed -
     * the algorithm structure guarantees uniqueness.
     */
    forEachPair(callback) {
      for (const [key, cell] of this.cells) {
        for (let i = 0; i < cell.length; i++) {
          for (let j = i + 1; j < cell.length; j++) {
            callback(cell[i], cell[j]);
          }
        }
        const cellX = key >> 16 & 65535;
        const cellY = key & 65535;
        const neighbors = [
          (cellX + 1 & 65535) << 16 | cellY,
          // Right (+x)
          cellX << 16 | cellY + 1 & 65535,
          // Below (+y)
          (cellX + 1 & 65535) << 16 | cellY + 1 & 65535
          // Below-right (+x,+y)
        ];
        for (const neighborKey of neighbors) {
          if (neighborKey <= key)
            continue;
          const neighborCell = this.cells.get(neighborKey);
          if (!neighborCell)
            continue;
          for (const a of cell) {
            for (const b of neighborCell) {
              callback(a, b);
            }
          }
        }
        const belowLeftKey = (cellX - 1 & 65535) << 16 | cellY + 1 & 65535;
        const belowLeftCell = this.cells.get(belowLeftKey);
        if (belowLeftCell) {
          for (const a of cell) {
            for (const b of belowLeftCell) {
              callback(a, b);
            }
          }
        }
      }
      const oversized = this.oversized;
      const allRegular = this.allRegular;
      for (let i = 0; i < oversized.length; i++) {
        for (let j = i + 1; j < oversized.length; j++) {
          callback(oversized[i], oversized[j]);
        }
      }
      for (const big of oversized) {
        for (const small of allRegular) {
          callback(big, small);
        }
      }
    }
    /**
     * Get potential collision pairs as an array.
     * For large body counts, prefer forEachPair() to avoid array allocation.
     */
    getPotentialPairs() {
      const pairs = [];
      this.forEachPair((a, b) => pairs.push([a, b]));
      return pairs;
    }
    /**
     * Get statistics for debugging.
     */
    getStats() {
      let maxPerCell = 0;
      let totalBodies = 0;
      for (const cell of this.cells.values()) {
        maxPerCell = Math.max(maxPerCell, cell.length);
        totalBodies += cell.length;
      }
      return {
        cellCount: this.cells.size,
        maxPerCell,
        avgPerCell: this.cells.size > 0 ? totalBodies / this.cells.size : 0,
        oversizedCount: this.oversized.length
      };
    }
  };

  // ../../engine/src/plugins/physics2d/world.ts
  var GRAVITY_2D = { x: 0, y: toFixed(-30) };
  var LINEAR_DAMPING = toFixed(0.1);
  var ANGULAR_DAMPING = toFixed(0.1);
  var SLEEP_THRESHOLD = toFixed(0.12);
  var SLEEP_FRAMES_REQUIRED = 20;
  var DEFAULT_CELL_SIZE = 64;
  function createWorld2D(dt = 1 / 60) {
    const world = {
      bodies: [],
      gravity: { x: GRAVITY_2D.x, y: GRAVITY_2D.y },
      dt: toFixed(dt),
      step() {
        stepWorld2D(world);
      }
    };
    return world;
  }
  function addBody2D(world, body) {
    world.bodies.push(body);
  }
  function removeBody2D(world, body) {
    const index = world.bodies.indexOf(body);
    if (index >= 0) {
      world.bodies.splice(index, 1);
    }
  }
  function stepWorld2D(world) {
    const { gravity, dt } = world;
    const contacts = [];
    const triggerOverlaps = [];
    const collisionPairs = [];
    const bodies = [...world.bodies].sort((a, b) => a.label.localeCompare(b.label));
    for (const body of bodies) {
      if (body.type !== 2 /* Dynamic */)
        continue;
      if (body.isSleeping)
        continue;
      body.linearVelocity = vec2Add2(body.linearVelocity, vec2Scale2(gravity, dt));
      const linearDamp = FP_ONE - LINEAR_DAMPING;
      const angularDamp = FP_ONE - ANGULAR_DAMPING;
      body.linearVelocity = vec2Scale2(body.linearVelocity, linearDamp);
      body.angularVelocity = fpMul(body.angularVelocity, angularDamp);
    }
    const spatialHash = new SpatialHash2D(DEFAULT_CELL_SIZE);
    spatialHash.insertAll(bodies);
    spatialHash.forEachPair((bodyA, bodyB) => {
      if (bodyA.type === 0 /* Static */ && bodyB.type === 0 /* Static */)
        return;
      if (!shouldCollide(bodyA.filter, bodyB.filter))
        return;
      const aabbA = computeAABB2D(bodyA);
      const aabbB = computeAABB2D(bodyB);
      if (!aabb2DOverlap(aabbA, aabbB))
        return;
      const contact = detectCollision2D(bodyA, bodyB);
      if (!contact)
        return;
      const entityA = bodyA.userData;
      const entityB = bodyB.userData;
      if (entityA || entityB) {
        collisionPairs.push({
          entityA,
          entityB,
          labelA: bodyA.label,
          labelB: bodyB.label
        });
      }
      if (bodyA.isSensor || bodyB.isSensor) {
        if (bodyA.isSensor)
          triggerOverlaps.push({ trigger: bodyA, other: bodyB });
        if (bodyB.isSensor)
          triggerOverlaps.push({ trigger: bodyB, other: bodyA });
        return;
      }
      contacts.push(contact);
      if (world.contactListener)
        world.contactListener.onContact(bodyA, bodyB);
      resolveCollision2D(contact);
    });
    collisionPairs.sort((a, b) => {
      const cmp = a.labelA.localeCompare(b.labelA);
      return cmp !== 0 ? cmp : a.labelB.localeCompare(b.labelB);
    });
    for (const pair of collisionPairs) {
      if (pair.entityA?.active === false || pair.entityB?.active === false)
        continue;
      if (world.physics2d?.handleCollision?.(pair.entityA, pair.entityB)) {
        continue;
      }
      if (pair.entityA?.onCollision) {
        pair.entityA.onCollision(pair.entityB);
      }
      if (pair.entityB?.onCollision) {
        pair.entityB.onCollision(pair.entityA);
      }
    }
    for (const body of bodies) {
      if (body.type === 0 /* Static */)
        continue;
      if (body.isSleeping)
        continue;
      const linearClamp = toFixed(0.05);
      const angularClamp = toFixed(0.01);
      if (fpAbs(body.linearVelocity.x) < linearClamp)
        body.linearVelocity.x = 0;
      if (fpAbs(body.linearVelocity.y) < linearClamp)
        body.linearVelocity.y = 0;
      if (fpAbs(body.angularVelocity) < angularClamp)
        body.angularVelocity = 0;
      body.position = vec2Add2(body.position, vec2Scale2(body.linearVelocity, dt));
      if (!body.lockRotation && body.angularVelocity !== 0) {
        body.angle = body.angle + fpMul(body.angularVelocity, dt);
      }
      const speedSq = vec2LengthSq2(body.linearVelocity);
      const angSpeedSq = fpMul(body.angularVelocity, body.angularVelocity);
      const sleepThreshSq = fpMul(SLEEP_THRESHOLD, SLEEP_THRESHOLD);
      if (speedSq < sleepThreshSq && angSpeedSq < sleepThreshSq) {
        body.sleepFrames++;
        if (body.sleepFrames >= SLEEP_FRAMES_REQUIRED) {
          body.isSleeping = true;
          body.linearVelocity = vec2Zero2();
          body.angularVelocity = 0;
        }
      } else {
        body.sleepFrames = 0;
        body.isSleeping = false;
      }
    }
    return { contacts, triggers: triggerOverlaps };
  }

  // ../../engine/src/plugins/physics2d/system.ts
  var Physics2DSystem = class {
    /**
     * Create a Physics2D system.
     *
     * @param gameOrConfig - Game instance (plugin mode) or config (standalone mode)
     * @param config - Config when using plugin mode
     */
    constructor(gameOrConfig, config) {
      /** ECS World reference */
      this.world = null;
      /** Map entity ID to physics body */
      this.entityToBody = /* @__PURE__ */ new Map();
      /** Map body ID to entity ID */
      this.bodyToEntity = /* @__PURE__ */ new Map();
      /** Collision handlers by type pair */
      this.collisionHandlers = /* @__PURE__ */ new Map();
      /** Entities pending body creation */
      this.pendingEntities = /* @__PURE__ */ new Set();
      let actualConfig;
      let game2 = null;
      if (gameOrConfig && "world" in gameOrConfig) {
        game2 = gameOrConfig;
        actualConfig = config ?? {};
      } else {
        actualConfig = gameOrConfig ?? {};
      }
      this.physicsWorld = createWorld2D(actualConfig.dt ?? 1 / 60);
      if (actualConfig.gravity) {
        this.physicsWorld.gravity = {
          x: toFixed(actualConfig.gravity.x),
          y: toFixed(actualConfig.gravity.y)
        };
      }
      const system = this;
      this.physicsWorld.contactListener = {
        onContact(bodyA, bodyB) {
          system.handleCollision(bodyA, bodyB);
        }
      };
      this.physicsWorld.physics2d = {
        handleCollision: (entityA, entityB) => {
          return this.handleCollisionByType(entityA, entityB);
        }
      };
      if (game2) {
        this.attach(game2.world);
        game2.physics = this;
      }
    }
    /**
     * Attach to an ECS World.
     * Registers prePhysics and physics systems.
     */
    attach(world) {
      this.world = world;
      world.addSystem(() => this.syncBodiesToPhysics(), { phase: "prePhysics", order: 0 });
      world.addSystem(() => this.step(), { phase: "physics", order: 0 });
      world.addSystem(() => this.syncPhysicsToComponents(), { phase: "postPhysics", order: 0 });
      return this;
    }
    /**
     * Register collision handler for two entity types.
     *
     * For different types (e.g., 'cell', 'food'), the handler is called once
     * with arguments in the registered order.
     *
     * For same types (e.g., 'cell', 'cell'), the handler is called twice -
     * once as (A, B) and once as (B, A). This lets you write "first acts on second"
     * logic without manually checking both directions.
     *
     * @example
     * // Cell eats food - called once per collision
     * physics.onCollision('cell', 'food', (cell, food) => {
     *     food.destroy();
     * });
     *
     * // Cell eats smaller cell - called twice, just check if first > second
     * physics.onCollision('cell', 'cell', (eater, prey) => {
     *     if (eater.get(Sprite).radius > prey.get(Sprite).radius * 1.2) {
     *         prey.destroy();
     *     }
     * });
     */
    onCollision(typeA, typeB, handler) {
      const key1 = `${typeA}:${typeB}`;
      const key2 = `${typeB}:${typeA}`;
      this.collisionHandlers.set(key1, handler);
      if (typeA !== typeB) {
        this.collisionHandlers.set(key2, (a, b) => handler(b, a));
      }
      return this;
    }
    /**
     * Set gravity.
     */
    setGravity(x, y) {
      this.physicsWorld.gravity = { x: toFixed(x), y: toFixed(y) };
      return this;
    }
    /**
     * Create or get physics body for entity.
     */
    ensureBody(entity) {
      const eid = entity.eid;
      let body = this.entityToBody.get(eid);
      if (body)
        return body;
      if (!entity.has(Transform2D) || !entity.has(Body2D)) {
        return null;
      }
      const transform = entity.get(Transform2D);
      const bodyData = entity.get(Body2D);
      let bodyType;
      switch (bodyData.bodyType) {
        case BODY_STATIC:
          bodyType = 0 /* Static */;
          break;
        case BODY_KINEMATIC:
          bodyType = 1 /* Kinematic */;
          break;
        default:
          bodyType = 2 /* Dynamic */;
      }
      let shape;
      if (bodyData.shapeType === SHAPE_CIRCLE || bodyData.radius > 0) {
        shape = createCircle(bodyData.radius || 10);
      } else {
        shape = createBox2DFromSize(bodyData.width || 10, bodyData.height || 10);
      }
      body = createBody2D(bodyType, shape, transform.x, transform.y);
      body.angle = toFixed(transform.angle);
      body.linearVelocity = { x: toFixed(bodyData.vx), y: toFixed(bodyData.vy) };
      body.isSensor = bodyData.isSensor;
      body.isSleeping = false;
      body.sleepFrames = 0;
      body.userData = entity;
      body.label = eid.toString();
      addBody2D(this.physicsWorld, body);
      this.entityToBody.set(eid, body);
      this.bodyToEntity.set(body.id, eid);
      return body;
    }
    /**
     * Remove physics body for entity.
     */
    removeBody(entity) {
      const eid = entity.eid;
      const body = this.entityToBody.get(eid);
      if (body) {
        removeBody2D(this.physicsWorld, body);
        this.entityToBody.delete(eid);
        this.bodyToEntity.delete(body.id);
      }
    }
    /**
     * Sync component data to physics bodies (prePhysics).
     */
    syncBodiesToPhysics() {
      if (!this.world)
        return;
      for (const entity of this.world.query(Body2D)) {
        const body = this.ensureBody(entity);
        if (!body)
          continue;
        const bodyData = entity.get(Body2D);
        if (bodyData.bodyType === BODY_KINEMATIC || bodyData.bodyType === BODY_STATIC) {
          const transform = entity.get(Transform2D);
          body.position.x = toFixed(transform.x);
          body.position.y = toFixed(transform.y);
          body.angle = toFixed(transform.angle);
        }
        if (bodyData.impulseX !== 0 || bodyData.impulseY !== 0) {
          bodyData.vx += bodyData.impulseX;
          bodyData.vy += bodyData.impulseY;
          bodyData.impulseX = 0;
          bodyData.impulseY = 0;
        }
        if (bodyData.forceX !== 0 || bodyData.forceY !== 0) {
          bodyData.vx += bodyData.forceX;
          bodyData.vy += bodyData.forceY;
          bodyData.forceX = 0;
          bodyData.forceY = 0;
        }
        if (bodyData.damping > 0) {
          const damp = 1 - bodyData.damping;
          bodyData.vx *= damp;
          bodyData.vy *= damp;
        }
        const newVelX = toFixed(bodyData.vx);
        const newVelY = toFixed(bodyData.vy);
        body.linearVelocity.x = newVelX;
        body.linearVelocity.y = newVelY;
        if (newVelX !== 0 || newVelY !== 0) {
          body.isSleeping = false;
          body.sleepFrames = 0;
        }
        if (body.shape.type === 0) {
          const currentRadius = body.shape.radius;
          const newRadius = toFixed(bodyData.radius);
          if (currentRadius !== newRadius) {
            body.shape.radius = newRadius;
          }
        }
      }
      for (const [eid, body] of this.entityToBody) {
        if (this.world.isDestroyed(eid)) {
          removeBody2D(this.physicsWorld, body);
          this.entityToBody.delete(eid);
          this.bodyToEntity.delete(body.id);
        }
      }
    }
    /**
     * Step physics simulation.
     */
    step() {
      stepWorld2D(this.physicsWorld);
    }
    /**
     * Sync physics results back to components (postPhysics).
     */
    syncPhysicsToComponents() {
      for (const [eid, body] of this.entityToBody) {
        const entity = this.world?.getEntity(eid);
        if (!entity || entity.destroyed)
          continue;
        const transform = entity.get(Transform2D);
        const bodyData = entity.get(Body2D);
        transform.x = toFloat(body.position.x);
        transform.y = toFloat(body.position.y);
        transform.angle = toFloat(body.angle);
        bodyData.vx = toFloat(body.linearVelocity.x);
        bodyData.vy = toFloat(body.linearVelocity.y);
      }
    }
    /**
     * Handle collision between two bodies.
     */
    handleCollision(bodyA, bodyB) {
      const entityA = bodyA.userData;
      const entityB = bodyB.userData;
      if (!entityA || !entityB)
        return;
      if (entityA.destroyed || entityB.destroyed)
        return;
      this.handleCollisionByType(entityA, entityB);
    }
    /**
     * Handle collision by entity types. Returns true if a handler was found.
     * Used by physics world for both regular and sensor collisions.
     */
    handleCollisionByType(entityA, entityB) {
      if (!entityA || !entityB)
        return false;
      if (entityA.destroyed || entityB.destroyed)
        return false;
      const key = `${entityA.type}:${entityB.type}`;
      const handler = this.collisionHandlers.get(key);
      if (handler) {
        handler(entityA, entityB);
        if (entityA.type === entityB.type && !entityA.destroyed && !entityB.destroyed) {
          handler(entityB, entityA);
        }
        return true;
      }
      return false;
    }
    /**
     * Get body for entity (for advanced use).
     */
    getBody(entity) {
      return this.entityToBody.get(entity.eid);
    }
    /**
     * Get entity for body (for advanced use).
     */
    getEntityForBody(body) {
      const eid = this.bodyToEntity.get(body.id);
      if (eid === void 0)
        return null;
      return this.world?.getEntity(eid) ?? null;
    }
    /**
     * Clear all physics state.
     * Used during snapshot restoration to ensure fresh physics state.
     */
    clear() {
      for (const body of this.entityToBody.values()) {
        removeBody2D(this.physicsWorld, body);
      }
      this.entityToBody.clear();
      this.bodyToEntity.clear();
      resetBody2DIdCounter();
    }
    /**
     * Wake all physics bodies.
     * Used after snapshot load/send to ensure deterministic state.
     * Without this, existing clients have sleeping bodies while late joiners
     * have awake bodies, causing physics divergence.
     */
    wakeAllBodies() {
      for (const body of this.physicsWorld.bodies) {
        body.isSleeping = false;
        body.sleepFrames = 0;
      }
    }
  };

  // ../../engine/src/plugins/physics3d/layers.ts
  var Layers2 = {
    NONE: 0,
    DEFAULT: 1 << 0,
    // 1
    PLAYER: 1 << 1,
    // 2
    ENEMY: 1 << 2,
    // 4
    PROJECTILE: 1 << 3,
    // 8
    ITEM: 1 << 4,
    // 16
    TRIGGER: 1 << 5,
    // 32
    WORLD: 1 << 6,
    // 64
    PROP: 1 << 7,
    // 128
    // Layers 8-15 reserved for game-specific use
    CUSTOM_1: 1 << 8,
    CUSTOM_2: 1 << 9,
    CUSTOM_3: 1 << 10,
    CUSTOM_4: 1 << 11,
    CUSTOM_5: 1 << 12,
    CUSTOM_6: 1 << 13,
    CUSTOM_7: 1 << 14,
    CUSTOM_8: 1 << 15,
    ALL: 65535
    // All layers
  };
  var DEFAULT_FILTER3 = {
    layer: Layers2.DEFAULT,
    mask: Layers2.ALL
  };

  // ../../engine/src/plugins/physics3d/rigid-body.ts
  var RESTITUTION_DEFAULT2 = toFixed(0);
  var FRICTION_DEFAULT2 = toFixed(0.5);

  // ../../engine/src/plugins/physics3d/collision.ts
  var POSITION_CORRECTION = toFixed(0.6);
  var SLOP = toFixed(0.05);
  var WAKE_VELOCITY_THRESHOLD = toFixed(1.5);

  // ../../engine/src/plugins/physics3d/world.ts
  var GRAVITY = { x: 0, y: toFixed(-30), z: 0 };
  var LINEAR_DAMPING2 = toFixed(0.1);
  var ANGULAR_DAMPING2 = toFixed(0.1);
  var SLEEP_THRESHOLD2 = toFixed(0.12);

  // src/constants.ts
  var WORLD_WIDTH = 4e3;
  var WORLD_HEIGHT = 4e3;
  var SPEED = 8;
  var BOOST_SPEED = 18;
  var BOOST_COST_FRAMES = 10;
  var MIN_BOOST_LENGTH = 10;
  var TURN_SPEED = 0.15;
  var BASE_HEAD_RADIUS = 16;
  var BASE_SEGMENT_RADIUS = 14;
  var INITIAL_LENGTH = 15;
  var SEGMENT_SPAWN_INTERVAL = 1;
  var SIZE_GROWTH_RATE = 0.02;
  var MAX_SIZE_MULTIPLIER = 3;
  var FOOD_COUNT = 100;
  var MAX_FOOD = 200;
  var FOOD_SPAWN_CHANCE = 0.03;
  var MIN_ZOOM = 0.3;
  var MAX_ZOOM = 1;
  var ZOOM_SPEED = 0.02;
  var COLORS = [
    "#ff6b6b",
    "#4dabf7",
    "#69db7c",
    "#ffd43b",
    "#da77f2",
    "#ff8e72",
    "#38d9a9",
    "#748ffc",
    "#f783ac",
    "#a9e34b",
    "#3bc9db",
    "#9775fa"
  ];

  // src/entities.ts
  var SnakeHead = defineComponent("SnakeHead", {
    length: INITIAL_LENGTH,
    dirX: 1,
    dirY: 0,
    prevDirX: 1,
    prevDirY: 0,
    lastSpawnFrame: 0,
    boostFrames: 0,
    boosting: 0
  });
  var SnakeSegment = defineComponent("SnakeSegment", {
    ownerId: 0,
    spawnFrame: 0
  });
  function defineEntities(game2) {
    game2.defineEntity("snake-head").with(Transform2D).with(Sprite, { shape: SHAPE_CIRCLE, radius: BASE_HEAD_RADIUS, layer: 2 }).with(Body2D, { shapeType: SHAPE_CIRCLE, radius: BASE_HEAD_RADIUS, bodyType: BODY_KINEMATIC, isSensor: true }).with(Player).with(SnakeHead).register();
    game2.defineEntity("snake-segment").with(Transform2D).with(Sprite, { shape: SHAPE_CIRCLE, radius: BASE_SEGMENT_RADIUS, layer: 1 }).with(Body2D, { shapeType: SHAPE_CIRCLE, radius: BASE_SEGMENT_RADIUS, bodyType: BODY_KINEMATIC, isSensor: true }).with(SnakeSegment).register();
    game2.defineEntity("food").with(Transform2D).with(Sprite, { shape: SHAPE_CIRCLE, radius: 10, layer: 0 }).with(Body2D, { shapeType: SHAPE_CIRCLE, radius: 10, bodyType: BODY_STATIC }).register();
    game2.defineEntity("camera").with(Camera2D, { smoothing: 0.15 }).syncNone().register();
  }

  // src/systems.ts
  function getClientIdStr(game2, numericId) {
    return game2.getClientIdString(numericId) || "";
  }
  function compareStrings(a, b) {
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  }
  function getSizeMultiplier(length) {
    const growth = 1 + (length - INITIAL_LENGTH) * SIZE_GROWTH_RATE;
    return Math.min(growth, MAX_SIZE_MULTIPLIER);
  }
  function getTargetZoom(length) {
    const sizeMultiplier = getSizeMultiplier(length);
    return Math.max(MIN_ZOOM, MAX_ZOOM / sizeMultiplier);
  }
  function killSnake(game2, clientId) {
    const head = game2.world.getEntityByClientId(clientId);
    if (!head || head.destroyed)
      return;
    const segments = [...game2.query("snake-segment")].sort((a, b) => a.eid - b.eid);
    for (const seg of segments) {
      if (seg.get(SnakeSegment).ownerId === clientId) {
        seg.destroy();
      }
    }
    head.destroy();
  }
  function spawnSnake(game2, clientId) {
    const color = game2.internString("color", COLORS[dRandom() * COLORS.length | 0]);
    const startX = 200 + dRandom() * (WORLD_WIDTH - 400) | 0;
    const startY = 200 + dRandom() * (WORLD_HEIGHT - 400) | 0;
    game2.spawn("snake-head", {
      x: startX,
      y: startY,
      clientId,
      color,
      length: INITIAL_LENGTH,
      lastSpawnFrame: game2.frame
    });
  }
  function spawnFood(game2, x, y, color) {
    const foodColor = color ?? game2.internString("color", COLORS[dRandom() * COLORS.length | 0]);
    const foodX = x ?? 50 + dRandom() * (WORLD_WIDTH - 100) | 0;
    const foodY = y ?? 50 + dRandom() * (WORLD_HEIGHT - 100) | 0;
    game2.spawn("food", {
      x: foodX,
      y: foodY,
      color: foodColor
    });
  }
  function setupCollisions(game2, physics2) {
    physics2.onCollision("snake-head", "snake-segment", (head, segment) => {
      if (head.destroyed || segment.destroyed)
        return;
      const headClientId = head.get(Player).clientId;
      const segOwnerId = segment.get(SnakeSegment).ownerId;
      if (segOwnerId === headClientId)
        return;
      killSnake(game2, headClientId);
    });
    physics2.onCollision("snake-head", "food", (head, food) => {
      if (food.destroyed)
        return;
      head.get(SnakeHead).length++;
      food.destroy();
    });
  }
  function setupSystems(game2) {
    game2.addSystem(() => {
      const playerHeads = /* @__PURE__ */ new Map();
      const allHeads = [...game2.query("snake-head")].sort((a, b) => a.eid - b.eid);
      for (const head of allHeads) {
        if (head.destroyed)
          continue;
        const clientId = head.get(Player).clientId;
        if (clientId === void 0 || clientId === null)
          continue;
        playerHeads.set(clientId, head);
      }
      const sortedPlayers = [...playerHeads.entries()].sort(
        (a, b) => compareStrings(getClientIdStr(game2, a[0]), getClientIdStr(game2, b[0]))
      );
      for (const [clientId, head] of sortedPlayers) {
        if (head.destroyed)
          continue;
        const playerInput = game2.world.getInput(clientId);
        const sh = head.get(SnakeHead);
        const t = head.get(Transform2D);
        sh.prevDirX = sh.dirX;
        sh.prevDirY = sh.dirY;
        if (playerInput?.target) {
          const dx = playerInput.target.x - t.x;
          const dy = playerInput.target.y - t.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 1) {
            const dist = dSqrt(distSq);
            const desiredX = dx / dist;
            const desiredY = dy / dist;
            let newDirX = sh.dirX + (desiredX - sh.dirX) * TURN_SPEED;
            let newDirY = sh.dirY + (desiredY - sh.dirY) * TURN_SPEED;
            const newLenSq = newDirX * newDirX + newDirY * newDirY;
            const newLen = dSqrt(newLenSq);
            if (newLen > 1e-3) {
              sh.dirX = newDirX / newLen;
              sh.dirY = newDirY / newLen;
            }
          }
        }
        const boostPressed = playerInput?.boost === true || playerInput?.boost?.pressed || playerInput?.boost > 0;
        const isBoosting = boostPressed && sh.length > MIN_BOOST_LENGTH;
        const currentSpeed = isBoosting ? BOOST_SPEED : SPEED;
        sh.boosting = isBoosting ? 1 : 0;
        if (isBoosting) {
          sh.boostFrames++;
          if (sh.boostFrames >= BOOST_COST_FRAMES) {
            sh.length--;
            sh.boostFrames = 0;
            game2.spawn("food", {
              x: t.x - sh.dirX * 30 | 0,
              y: t.y - sh.dirY * 30 | 0,
              color: head.get(Sprite).color
            });
          }
        } else {
          sh.boostFrames = 0;
        }
        const vx = sh.dirX * currentSpeed * 60;
        const vy = sh.dirY * currentSpeed * 60;
        head.setVelocity(vx, vy);
        const radius = head.get(Sprite).radius;
        if (t.x - radius < 0 || t.x + radius > WORLD_WIDTH || t.y - radius < 0 || t.y + radius > WORLD_HEIGHT) {
          killSnake(game2, clientId);
          continue;
        }
        const frameDiff = game2.frame - sh.lastSpawnFrame;
        if (frameDiff >= SEGMENT_SPAWN_INTERVAL) {
          const color = head.get(Sprite).color;
          game2.spawn("snake-segment", {
            x: t.x,
            y: t.y,
            color,
            ownerId: clientId,
            spawnFrame: game2.frame
          });
          sh.lastSpawnFrame = game2.frame;
        }
      }
    }, { phase: "update" });
    game2.addSystem(() => {
      const headMaxAge = /* @__PURE__ */ new Map();
      const allHeads = [...game2.query("snake-head")].sort((a, b) => a.eid - b.eid);
      for (const head of allHeads) {
        if (head.destroyed)
          continue;
        const clientId = head.get(Player).clientId;
        const maxLength = head.get(SnakeHead).length;
        headMaxAge.set(clientId, game2.frame - maxLength * SEGMENT_SPAWN_INTERVAL);
      }
      const allSegments = [...game2.query("snake-segment")].sort((a, b) => a.eid - b.eid);
      for (const seg of allSegments) {
        if (seg.destroyed)
          continue;
        const segData = seg.get(SnakeSegment);
        const oldestAllowed = headMaxAge.get(segData.ownerId);
        if (oldestAllowed !== void 0 && segData.spawnFrame < oldestAllowed) {
          seg.destroy();
        }
      }
    }, { phase: "update" });
    game2.addSystem(() => {
      if (game2.getEntitiesByType("food").length < MAX_FOOD && dRandom() < FOOD_SPAWN_CHANCE) {
        spawnFood(game2);
      }
    }, { phase: "update" });
    game2.addSystem(() => {
      const ownerLengths = /* @__PURE__ */ new Map();
      const allHeads = [...game2.query("snake-head")].sort((a, b) => a.eid - b.eid);
      for (const head of allHeads) {
        if (head.destroyed)
          continue;
        const clientId = head.get(Player).clientId;
        const length = head.get(SnakeHead).length;
        const sizeMult = getSizeMultiplier(length);
        ownerLengths.set(clientId, sizeMult);
        const headRadius = BASE_HEAD_RADIUS * sizeMult;
        head.get(Sprite).radius = headRadius;
        head.get(Body2D).radius = headRadius;
      }
      const allSegments = [...game2.query("snake-segment")].sort((a, b) => a.eid - b.eid);
      for (const seg of allSegments) {
        if (seg.destroyed)
          continue;
        const ownerId = seg.get(SnakeSegment).ownerId;
        const sizeMult = ownerLengths.get(ownerId) || 1;
        const segRadius = BASE_SEGMENT_RADIUS * sizeMult;
        seg.get(Sprite).radius = segRadius;
        seg.get(Body2D).radius = segRadius;
      }
    }, { phase: "update" });
  }
  function updateCamera(game2, cameraEntity2, getLocalClientId2) {
    const localId = getLocalClientId2();
    if (localId === null)
      return;
    const head = game2.world.getEntityByClientId(localId);
    if (!head || head.destroyed)
      return;
    const t = head.get(Transform2D);
    const length = head.get(SnakeHead).length;
    const camera = cameraEntity2.get(Camera2D);
    const targetZoom = getTargetZoom(length);
    camera.zoom += (targetZoom - camera.zoom) * ZOOM_SPEED;
    camera.x += (t.x - camera.x) * camera.smoothing;
    camera.y += (t.y - camera.y) * camera.smoothing;
  }

  // src/render.ts
  function createRenderer(game2, renderer2, getCameraEntity, canvas2, minimapCanvas2, statsLength2, statsRank2, getLocalClientIdFn) {
    const canvasCtx = renderer2.context;
    const minimapCtx = minimapCanvas2.getContext("2d");
    const width = canvas2.width;
    const height = canvas2.height;
    function renderWithCamera() {
      const cameraEntity2 = getCameraEntity();
      const alpha = game2.getRenderAlpha();
      const camera = cameraEntity2.get(Camera2D);
      updateCamera(game2, cameraEntity2, getLocalClientIdFn);
      canvasCtx.fillStyle = "#111";
      canvasCtx.fillRect(0, 0, width, height);
      const camX = camera.x;
      const camY = camera.y;
      canvasCtx.save();
      canvasCtx.translate(width / 2, height / 2);
      canvasCtx.scale(camera.zoom, camera.zoom);
      canvasCtx.translate(-camX, -camY);
      canvasCtx.strokeStyle = "#333";
      canvasCtx.lineWidth = 4 / camera.zoom;
      canvasCtx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      canvasCtx.strokeStyle = "#1a1a1a";
      canvasCtx.lineWidth = 1 / camera.zoom;
      const gridSize = 200;
      for (let x = 0; x <= WORLD_WIDTH; x += gridSize) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(x, 0);
        canvasCtx.lineTo(x, WORLD_HEIGHT);
        canvasCtx.stroke();
      }
      for (let y = 0; y <= WORLD_HEIGHT; y += gridSize) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, y);
        canvasCtx.lineTo(WORLD_WIDTH, y);
        canvasCtx.stroke();
      }
      for (const food of game2.query("food")) {
        if (food.destroyed)
          continue;
        food.interpolate(alpha);
        const x = food.render?.interpX ?? food.get(Transform2D).x;
        const y = food.render?.interpY ?? food.get(Transform2D).y;
        const sprite = food.get(Sprite);
        canvasCtx.fillStyle = game2.getString("color", sprite.color) || "#fff";
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, sprite.radius, 0, Math.PI * 2);
        canvasCtx.fill();
      }
      for (const seg of game2.query("snake-segment")) {
        if (seg.destroyed)
          continue;
        seg.interpolate(alpha);
        const x = seg.render?.interpX ?? seg.get(Transform2D).x;
        const y = seg.render?.interpY ?? seg.get(Transform2D).y;
        const sprite = seg.get(Sprite);
        canvasCtx.fillStyle = game2.getString("color", sprite.color) || "#fff";
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, sprite.radius, 0, Math.PI * 2);
        canvasCtx.fill();
      }
      for (const head of game2.query("snake-head")) {
        if (head.destroyed)
          continue;
        head.interpolate(alpha);
        const x = head.render?.interpX ?? head.get(Transform2D).x;
        const y = head.render?.interpY ?? head.get(Transform2D).y;
        const sprite = head.get(Sprite);
        const sh = head.get(SnakeHead);
        const sizeMult = getSizeMultiplier(sh.length);
        const colorStr = game2.getString("color", sprite.color) || "#fff";
        if (sh.boosting) {
          canvasCtx.save();
          canvasCtx.shadowColor = colorStr;
          canvasCtx.shadowBlur = 30;
          canvasCtx.fillStyle = colorStr;
          canvasCtx.globalAlpha = 0.4;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, sprite.radius * 2.5, 0, Math.PI * 2);
          canvasCtx.fill();
          canvasCtx.globalAlpha = 0.6;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, sprite.radius * 1.8, 0, Math.PI * 2);
          canvasCtx.fill();
          canvasCtx.restore();
        }
        canvasCtx.fillStyle = colorStr;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, sprite.radius, 0, Math.PI * 2);
        canvasCtx.fill();
        const dirX = sh.prevDirX + (sh.dirX - sh.prevDirX) * alpha;
        const dirY = sh.prevDirY + (sh.dirY - sh.prevDirY) * alpha;
        const eyeOffset = 6 * sizeMult;
        const eyeRadius = 5 * sizeMult;
        const pupilRadius = 2 * sizeMult;
        const perpX = -dirY, perpY = dirX;
        for (const side of [-1, 1]) {
          const ex = x + dirX * eyeOffset + perpX * eyeOffset * side;
          const ey = y + dirY * eyeOffset + perpY * eyeOffset * side;
          canvasCtx.fillStyle = "#fff";
          canvasCtx.beginPath();
          canvasCtx.arc(ex, ey, eyeRadius, 0, Math.PI * 2);
          canvasCtx.fill();
          canvasCtx.fillStyle = "#000";
          canvasCtx.beginPath();
          canvasCtx.arc(ex + dirX * pupilRadius, ey + dirY * pupilRadius, pupilRadius, 0, Math.PI * 2);
          canvasCtx.fill();
        }
      }
      canvasCtx.restore();
      drawMinimap(camera);
      updateStats();
    }
    function updateStats() {
      const localId = getLocalClientIdFn();
      if (localId === null)
        return;
      const localHead = game2.world.getEntityByClientId(localId);
      if (!localHead || localHead.destroyed) {
        statsLength2.textContent = "0";
        statsRank2.textContent = "- of -";
        return;
      }
      const myLength = localHead.get(SnakeHead).length;
      statsLength2.textContent = String(myLength);
      const snakes = [];
      for (const head of game2.query("snake-head")) {
        if (head.destroyed)
          continue;
        snakes.push({
          clientId: head.get(Player).clientId,
          length: head.get(SnakeHead).length
        });
      }
      snakes.sort((a, b) => b.length - a.length);
      const rank = snakes.findIndex((s) => s.clientId === localId) + 1;
      statsRank2.textContent = `${rank} of ${snakes.length}`;
    }
    function drawMinimap(camera) {
      const camX = camera.x;
      const camY = camera.y;
      const mmW = minimapCanvas2.width;
      const mmH = minimapCanvas2.height;
      const scaleX = mmW / WORLD_WIDTH;
      const scaleY = mmH / WORLD_HEIGHT;
      minimapCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
      minimapCtx.fillRect(0, 0, mmW, mmH);
      minimapCtx.strokeStyle = "#444";
      minimapCtx.lineWidth = 1;
      minimapCtx.strokeRect(0, 0, mmW, mmH);
      minimapCtx.fillStyle = "#555";
      for (const food of game2.query("food")) {
        if (food.destroyed)
          continue;
        const t = food.get(Transform2D);
        const mx = t.x * scaleX;
        const my = t.y * scaleY;
        minimapCtx.fillRect(mx - 1, my - 1, 2, 2);
      }
      const localId = getLocalClientIdFn();
      for (const head of game2.query("snake-head")) {
        if (head.destroyed)
          continue;
        const t = head.get(Transform2D);
        const sprite = head.get(Sprite);
        const color = game2.getString("color", sprite.color) || "#fff";
        const clientId = head.get(Player).clientId;
        const isLocal = clientId === localId;
        minimapCtx.fillStyle = color;
        const mx = t.x * scaleX;
        const my = t.y * scaleY;
        minimapCtx.beginPath();
        minimapCtx.arc(mx, my, isLocal ? 4 : 3, 0, Math.PI * 2);
        minimapCtx.fill();
        if (isLocal) {
          minimapCtx.strokeStyle = "#fff";
          minimapCtx.lineWidth = 1;
          minimapCtx.beginPath();
          minimapCtx.arc(mx, my, 6, 0, Math.PI * 2);
          minimapCtx.stroke();
        }
      }
      const viewW = width / camera.zoom * scaleX;
      const viewH = height / camera.zoom * scaleY;
      const viewX = camX * scaleX - viewW / 2;
      const viewY = camY * scaleY - viewH / 2;
      minimapCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      minimapCtx.lineWidth = 1;
      minimapCtx.strokeRect(viewX, viewY, viewW, viewH);
    }
    return renderWithCamera;
  }

  // src/game.ts
  var game;
  var renderer;
  var physics;
  var input;
  var cameraSystem;
  var cameraEntity;
  var canvas;
  var minimapCanvas;
  var statsLength;
  var statsRank;
  var WIDTH;
  var HEIGHT;
  var mouseX;
  var mouseY;
  var mouseDown = false;
  function getLocalClientId() {
    const clientId = game.localClientId;
    if (!clientId || typeof clientId !== "string")
      return null;
    return game.internClientId(clientId);
  }
  function setupInput(getCameraEntity) {
    mouseX = WIDTH / 2;
    mouseY = HEIGHT / 2;
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0)
        mouseDown = true;
    });
    canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0)
        mouseDown = false;
    });
    canvas.addEventListener("mouseleave", () => {
      mouseDown = false;
    });
    input.action("target", {
      type: "vector",
      bindings: [() => {
        const cam = getCameraEntity().get(Camera2D);
        const worldX = (mouseX - WIDTH / 2) / cam.zoom + cam.x;
        const worldY = (mouseY - HEIGHT / 2) / cam.zoom + cam.y;
        return { x: worldX, y: worldY };
      }]
    });
    input.action("boost", { type: "button", bindings: [() => mouseDown] });
  }
  function initGame() {
    canvas = document.getElementById("game");
    minimapCanvas = document.getElementById("minimap");
    statsLength = document.querySelector("#stats .length");
    statsRank = document.getElementById("rank-text");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    game = createGame();
    renderer = game.addPlugin(Simple2DRenderer, canvas);
    physics = game.addPlugin(Physics2DSystem, { gravity: { x: 0, y: 0 } });
    input = game.addPlugin(InputPlugin, canvas);
    cameraSystem = game.addPlugin(CameraSystem);
    window.game = game;
    defineEntities(game);
    setupCollisions(game, physics);
    setupSystems(game);
    cameraEntity = game.spawn("camera");
    const cam = cameraEntity.get(Camera2D);
    cam.x = WORLD_WIDTH / 2;
    cam.y = WORLD_HEIGHT / 2;
    renderer.camera = cameraEntity;
    function ensureCameraEntity() {
      if (!cameraEntity || cameraEntity.destroyed || !cameraEntity.has(Camera2D)) {
        cameraEntity = game.spawn("camera");
        const cam2 = cameraEntity.get(Camera2D);
        cam2.x = WORLD_WIDTH / 2;
        cam2.y = WORLD_HEIGHT / 2;
        renderer.camera = cameraEntity;
      }
      return cameraEntity;
    }
    setupInput(ensureCameraEntity);
    renderer.render = createRenderer(
      game,
      renderer,
      ensureCameraEntity,
      canvas,
      minimapCanvas,
      statsLength,
      statsRank,
      getLocalClientId
    );
    game.connect("snake-v34", {
      onRoomCreate() {
        for (let i = 0; i < FOOD_COUNT; i++)
          spawnFood(game);
      },
      onConnect(clientId) {
        spawnSnake(game, clientId);
        if (clientId === game.localClientId) {
          const player = game.getEntityByClientId(clientId);
          if (player) {
            const t = player.get(Transform2D);
            const cam2 = ensureCameraEntity().get(Camera2D);
            cam2.x = t.x;
            cam2.y = t.y;
          }
        }
      },
      onDisconnect(clientId) {
        killSnake(game, game.internClientId(clientId));
      }
    });
    enableDebugUI(game);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
  } else {
    initGame();
  }
  return __toCommonJS(game_exports);
})();
//# sourceMappingURL=game.js.map
