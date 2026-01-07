"use strict";
var SnakeGame = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // cdn-global:modu-engine
  var require_modu_engine = __commonJS({
    "cdn-global:modu-engine"(exports, module) {
      module.exports = window.Modu;
    }
  });

  // src/game.ts
  var game_exports = {};
  __export(game_exports, {
    initGame: () => initGame
  });
  var import_modu_engine = __toESM(require_modu_engine());
  var WORLD_WIDTH = 4e3;
  var WORLD_HEIGHT = 4e3;
  var SPEED = 8;
  var BOOST_SPEED = 18;
  var BOOST_COST_FRAMES = 10;
  var MIN_BOOST_LENGTH = 10;
  var BASE_HEAD_RADIUS = 16;
  var BASE_SEGMENT_RADIUS = 14;
  var INITIAL_LENGTH = 15;
  var FOOD_COUNT = 100;
  var MAX_FOOD = 200;
  var FOOD_SPAWN_CHANCE = 0.03;
  var SEGMENT_SPAWN_INTERVAL = 1;
  var TURN_SPEED = 0.15;
  var MIN_ZOOM = 0.3;
  var MAX_ZOOM = 1;
  var ZOOM_SPEED = 0.02;
  var SIZE_GROWTH_RATE = 0.02;
  var MAX_SIZE_MULTIPLIER = 3;
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
  var game;
  var renderer;
  var physics;
  var input;
  var canvas;
  var minimapCanvas;
  var minimapCtx;
  var statsLength;
  var statsRank;
  var WIDTH;
  var HEIGHT;
  var camera = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    zoom: 1,
    targetZoom: 1
  };
  var mouseX;
  var mouseY;
  var mouseDown = false;
  var isInCatchUp = false;
  var SnakeHead = (0, import_modu_engine.defineComponent)("SnakeHead", {
    length: INITIAL_LENGTH,
    dirX: 1,
    dirY: 0,
    prevDirX: 1,
    prevDirY: 0,
    lastSpawnFrame: 0,
    boostFrames: 0,
    boosting: 0
  });
  var SnakeSegment = (0, import_modu_engine.defineComponent)("SnakeSegment", {
    ownerId: 0,
    spawnFrame: 0
  });
  function getLocalClientId() {
    const clientId = game.localClientId;
    if (!clientId || typeof clientId !== "string")
      return null;
    return game.internClientId(clientId);
  }
  function getClientIdStr(numericId) {
    return game.getClientIdString(numericId) || "";
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
  function killSnake(clientId) {
    const head = game.world.getEntityByClientId(clientId);
    if (!head || head.destroyed)
      return;
    const segments = [...game.query("snake-segment")].sort((a, b) => a.id - b.id);
    for (const seg of segments) {
      if (seg.get(SnakeSegment).ownerId === clientId) {
        seg.destroy();
      }
    }
    head.destroy();
  }
  function spawnSnake(clientId) {
    const color = game.internString("color", COLORS[(0, import_modu_engine.dRandom)() * COLORS.length | 0]);
    const startX = 200 + (0, import_modu_engine.dRandom)() * (WORLD_WIDTH - 400) | 0;
    const startY = 200 + (0, import_modu_engine.dRandom)() * (WORLD_HEIGHT - 400) | 0;
    const numericClientId = game.internClientId(clientId);
    const existingHead = game.world.getEntityByClientId(numericClientId);
    if (existingHead && !existingHead.destroyed) {
      console.log(`[spawnSnake] Snake already exists for client ${clientId.slice(0, 8)}, skipping spawn`);
      return;
    }
    game.spawn("snake-head", {
      x: startX,
      y: startY,
      clientId,
      color,
      length: INITIAL_LENGTH,
      lastSpawnFrame: game.frame + 10
    });
  }
  function spawnFood(skipSpawn = false) {
    const color = game.internString("color", COLORS[(0, import_modu_engine.dRandom)() * COLORS.length | 0]);
    const x = 50 + (0, import_modu_engine.dRandom)() * (WORLD_WIDTH - 100) | 0;
    const y = 50 + (0, import_modu_engine.dRandom)() * (WORLD_HEIGHT - 100) | 0;
    if (!skipSpawn) {
      game.spawn("food", { x, y, color });
    }
  }
  function defineEntities() {
    game.defineEntity("snake-head").with(import_modu_engine.Transform2D).with(import_modu_engine.Sprite, { shape: import_modu_engine.SHAPE_CIRCLE, radius: BASE_HEAD_RADIUS, layer: 2 }).with(import_modu_engine.Body2D, { shapeType: import_modu_engine.SHAPE_CIRCLE, radius: BASE_HEAD_RADIUS, bodyType: import_modu_engine.BODY_KINEMATIC, isSensor: true }).with(import_modu_engine.Player).with(SnakeHead).register();
    game.defineEntity("snake-segment").with(import_modu_engine.Transform2D).with(import_modu_engine.Sprite, { shape: import_modu_engine.SHAPE_CIRCLE, radius: BASE_SEGMENT_RADIUS, layer: 1 }).with(import_modu_engine.Body2D, { shapeType: import_modu_engine.SHAPE_CIRCLE, radius: BASE_SEGMENT_RADIUS, bodyType: import_modu_engine.BODY_KINEMATIC, isSensor: true }).with(SnakeSegment).register();
    game.defineEntity("food").with(import_modu_engine.Transform2D).with(import_modu_engine.Sprite, { shape: import_modu_engine.SHAPE_CIRCLE, radius: 10, layer: 0 }).with(import_modu_engine.Body2D, { shapeType: import_modu_engine.SHAPE_CIRCLE, radius: 10, bodyType: import_modu_engine.BODY_STATIC }).register();
  }
  function setupCollisions() {
    physics.onCollision("snake-head", "snake-segment", (head, segment) => {
      if (head.destroyed || segment.destroyed)
        return;
      const headClientId = head.get(import_modu_engine.Player).clientId;
      const segOwnerId = segment.get(SnakeSegment).ownerId;
      if (segOwnerId === headClientId)
        return;
      killSnake(headClientId);
    });
    physics.onCollision("snake-head", "food", (head, food) => {
      if (food.destroyed)
        return;
      head.get(SnakeHead).length++;
      food.destroy();
    });
  }
  function setupSystems() {
    game.addSystem(() => {
      const playerHeads = /* @__PURE__ */ new Map();
      const allHeads = [...game.query("snake-head")].sort((a, b) => a.id - b.id);
      for (const head of allHeads) {
        if (head.destroyed)
          continue;
        const clientId = head.get(import_modu_engine.Player).clientId;
        if (clientId === void 0 || clientId === null)
          continue;
        playerHeads.set(clientId, head);
      }
      const sortedPlayers = [...playerHeads.entries()].sort(
        (a, b) => compareStrings(getClientIdStr(a[0]), getClientIdStr(b[0]))
      );
      for (const [clientId, head] of sortedPlayers) {
        if (head.destroyed)
          continue;
        const playerInput = game.world.getInput(clientId);
        const sh = head.get(SnakeHead);
        const t = head.get(import_modu_engine.Transform2D);
        sh.prevDirX = sh.dirX;
        sh.prevDirY = sh.dirY;
        if (playerInput?.target) {
          const dx = playerInput.target.x - t.x;
          const dy = playerInput.target.y - t.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 1) {
            const dist = (0, import_modu_engine.dSqrt)(distSq);
            const desiredX = dx / dist;
            const desiredY = dy / dist;
            let newDirX = sh.dirX + (desiredX - sh.dirX) * TURN_SPEED;
            let newDirY = sh.dirY + (desiredY - sh.dirY) * TURN_SPEED;
            const newLenSq = newDirX * newDirX + newDirY * newDirY;
            const newLen = (0, import_modu_engine.dSqrt)(newLenSq);
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
            if (!isInCatchUp || game.isAuthority()) {
              game.spawn("food", {
                x: t.x - sh.dirX * 30 | 0,
                y: t.y - sh.dirY * 30 | 0,
                color: head.get(import_modu_engine.Sprite).color
              });
            }
          }
        } else {
          sh.boostFrames = 0;
        }
        const body = head.get(import_modu_engine.Body2D);
        body.vx = sh.dirX * currentSpeed * 60;
        body.vy = sh.dirY * currentSpeed * 60;
        const radius = head.get(import_modu_engine.Sprite).radius;
        if (t.x - radius < 0 || t.x + radius > WORLD_WIDTH || t.y - radius < 0 || t.y + radius > WORLD_HEIGHT) {
          killSnake(clientId);
          continue;
        }
        const frameDiff = game.frame - sh.lastSpawnFrame;
        if (frameDiff >= SEGMENT_SPAWN_INTERVAL) {
          if (!isInCatchUp || game.isAuthority()) {
            const color = head.get(import_modu_engine.Sprite).color;
            const segment = game.spawn("snake-segment", {
              x: t.x,
              y: t.y,
              color,
              ownerId: clientId,
              spawnFrame: game.frame
            });
            if (game.frame % 100 === 0) {
              console.log(`[Spawn] frame=${game.frame} segId=${segment.id} owner=${clientId} isAuth=${game.isAuthority()} catchUp=${isInCatchUp}`);
            }
          }
          sh.lastSpawnFrame = game.frame;
        }
      }
    }, { phase: "update" });
    game.addSystem(() => {
      const headMaxAge = /* @__PURE__ */ new Map();
      const allHeads = [...game.query("snake-head")].sort((a, b) => a.id - b.id);
      for (const head of allHeads) {
        if (head.destroyed)
          continue;
        const clientId = head.get(import_modu_engine.Player).clientId;
        const maxLength = head.get(SnakeHead).length;
        headMaxAge.set(clientId, game.frame - maxLength * SEGMENT_SPAWN_INTERVAL);
      }
      const allSegments = [...game.query("snake-segment")].sort((a, b) => a.id - b.id);
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
    game.addSystem(() => {
      const shouldSpawn = (0, import_modu_engine.dRandom)() < FOOD_SPAWN_CHANCE;
      if (game.getEntitiesByType("food").length < MAX_FOOD && shouldSpawn) {
        const skipSpawn = isInCatchUp && !game.isAuthority();
        spawnFood(skipSpawn);
      }
    }, { phase: "update" });
    game.addSystem(() => {
      const ownerLengths = /* @__PURE__ */ new Map();
      const allHeads = [...game.query("snake-head")].sort((a, b) => a.id - b.id);
      for (const head of allHeads) {
        if (head.destroyed)
          continue;
        const clientId = head.get(import_modu_engine.Player).clientId;
        const length = head.get(SnakeHead).length;
        const sizeMult = getSizeMultiplier(length);
        ownerLengths.set(clientId, sizeMult);
        const headRadius = BASE_HEAD_RADIUS * sizeMult;
        head.get(import_modu_engine.Sprite).radius = headRadius;
        head.get(import_modu_engine.Body2D).radius = headRadius;
      }
      const allSegments = [...game.query("snake-segment")].sort((a, b) => a.id - b.id);
      for (const seg of allSegments) {
        if (seg.destroyed)
          continue;
        const ownerId = seg.get(SnakeSegment).ownerId;
        const sizeMult = ownerLengths.get(ownerId) || 1;
        const segRadius = BASE_SEGMENT_RADIUS * sizeMult;
        seg.get(import_modu_engine.Sprite).radius = segRadius;
        seg.get(import_modu_engine.Body2D).radius = segRadius;
      }
    }, { phase: "update" });
    game.addSystem(() => {
      const localId = getLocalClientId();
      if (localId === null)
        return;
      const head = game.world.getEntityByClientId(localId);
      if (!head || head.destroyed)
        return;
      const t = head.get(import_modu_engine.Transform2D);
      const length = head.get(SnakeHead).length;
      camera.targetZoom = getTargetZoom(length);
      camera.zoom += (camera.targetZoom - camera.zoom) * ZOOM_SPEED;
      camera.x = t.x;
      camera.y = t.y;
    }, { phase: "update" });
  }
  function renderWithCamera() {
    const ctx = renderer.context;
    const alpha = game.getRenderAlpha();
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    let camX = camera.x, camY = camera.y;
    const localId = getLocalClientId();
    const localHead = localId ? game.world.getEntityByClientId(localId) : null;
    if (localHead && !localHead.destroyed) {
      localHead.interpolate(alpha);
      const t = localHead.get(import_modu_engine.Transform2D);
      camX = localHead.render?.interpX ?? t.x;
      camY = localHead.render?.interpY ?? t.y;
    }
    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camX, -camY);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4 / camera.zoom;
    ctx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1 / camera.zoom;
    const gridSize = 200;
    for (let x = 0; x <= WORLD_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD_WIDTH, y);
      ctx.stroke();
    }
    for (const food of game.query("food")) {
      if (food.destroyed)
        continue;
      food.interpolate(alpha);
      const x = food.render?.interpX ?? food.get(import_modu_engine.Transform2D).x;
      const y = food.render?.interpY ?? food.get(import_modu_engine.Transform2D).y;
      const sprite = food.get(import_modu_engine.Sprite);
      ctx.fillStyle = game.getString("color", sprite.color) || "#fff";
      ctx.beginPath();
      ctx.arc(x, y, sprite.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const seg of game.query("snake-segment")) {
      if (seg.destroyed)
        continue;
      seg.interpolate(alpha);
      const x = seg.render?.interpX ?? seg.get(import_modu_engine.Transform2D).x;
      const y = seg.render?.interpY ?? seg.get(import_modu_engine.Transform2D).y;
      const sprite = seg.get(import_modu_engine.Sprite);
      ctx.fillStyle = game.getString("color", sprite.color) || "#fff";
      ctx.beginPath();
      ctx.arc(x, y, sprite.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const head of game.query("snake-head")) {
      if (head.destroyed)
        continue;
      head.interpolate(alpha);
      const x = head.render?.interpX ?? head.get(import_modu_engine.Transform2D).x;
      const y = head.render?.interpY ?? head.get(import_modu_engine.Transform2D).y;
      const sprite = head.get(import_modu_engine.Sprite);
      const sh = head.get(SnakeHead);
      const sizeMult = getSizeMultiplier(sh.length);
      const colorStr = game.getString("color", sprite.color) || "#fff";
      if (sh.boosting) {
        ctx.save();
        ctx.shadowColor = colorStr;
        ctx.shadowBlur = 30;
        ctx.fillStyle = colorStr;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(x, y, sprite.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, sprite.radius * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = colorStr;
      ctx.beginPath();
      ctx.arc(x, y, sprite.radius, 0, Math.PI * 2);
      ctx.fill();
      const dirX = sh.prevDirX + (sh.dirX - sh.prevDirX) * alpha;
      const dirY = sh.prevDirY + (sh.dirY - sh.prevDirY) * alpha;
      const eyeOffset = 6 * sizeMult;
      const eyeRadius = 5 * sizeMult;
      const pupilRadius = 2 * sizeMult;
      const perpX = -dirY, perpY = dirX;
      for (const side of [-1, 1]) {
        const ex = x + dirX * eyeOffset + perpX * eyeOffset * side;
        const ey = y + dirY * eyeOffset + perpY * eyeOffset * side;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(ex, ey, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(ex + dirX * pupilRadius, ey + dirY * pupilRadius, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    drawMinimap(camX, camY);
    updateStats();
  }
  function updateStats() {
    const localId = getLocalClientId();
    if (!localId)
      return;
    const localHead = game.world.getEntityByClientId(localId);
    if (!localHead || localHead.destroyed) {
      statsLength.textContent = "0";
      statsRank.textContent = "- of -";
      return;
    }
    const myLength = localHead.get(SnakeHead).length;
    statsLength.textContent = String(myLength);
    const snakes = [];
    for (const head of game.query("snake-head")) {
      if (head.destroyed)
        continue;
      snakes.push({
        clientId: head.get(import_modu_engine.Player).clientId,
        length: head.get(SnakeHead).length
      });
    }
    snakes.sort((a, b) => b.length - a.length);
    const rank = snakes.findIndex((s) => s.clientId === localId) + 1;
    statsRank.textContent = `${rank} of ${snakes.length}`;
  }
  function drawMinimap(camX, camY) {
    const mmW = minimapCanvas.width;
    const mmH = minimapCanvas.height;
    const scaleX = mmW / WORLD_WIDTH;
    const scaleY = mmH / WORLD_HEIGHT;
    minimapCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
    minimapCtx.fillRect(0, 0, mmW, mmH);
    minimapCtx.strokeStyle = "#444";
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(0, 0, mmW, mmH);
    minimapCtx.fillStyle = "#555";
    for (const food of game.query("food")) {
      if (food.destroyed)
        continue;
      const t = food.get(import_modu_engine.Transform2D);
      const mx = t.x * scaleX;
      const my = t.y * scaleY;
      minimapCtx.fillRect(mx - 1, my - 1, 2, 2);
    }
    for (const head of game.query("snake-head")) {
      if (head.destroyed)
        continue;
      const t = head.get(import_modu_engine.Transform2D);
      const sprite = head.get(import_modu_engine.Sprite);
      const color = game.getString("color", sprite.color) || "#fff";
      const clientId = head.get(import_modu_engine.Player).clientId;
      const isLocal = clientId === getLocalClientId();
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
    const viewW = WIDTH / camera.zoom * scaleX;
    const viewH = HEIGHT / camera.zoom * scaleY;
    const viewX = camX * scaleX - viewW / 2;
    const viewY = camY * scaleY - viewH / 2;
    minimapCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(viewX, viewY, viewW, viewH);
  }
  function setupInput() {
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
      bindings: [() => ({
        x: Math.round(camera.x + (mouseX - WIDTH / 2) / camera.zoom),
        y: Math.round(camera.y + (mouseY - HEIGHT / 2) / camera.zoom)
      })]
    });
    input.action("boost", { type: "button", bindings: [() => mouseDown] });
  }
  function initGame() {
    canvas = document.getElementById("game");
    minimapCanvas = document.getElementById("minimap");
    minimapCtx = minimapCanvas.getContext("2d");
    statsLength = document.querySelector("#stats .length");
    statsRank = document.getElementById("rank-text");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      WIDTH = canvas.width;
      HEIGHT = canvas.height;
    });
    game = (0, import_modu_engine.createGame)();
    renderer = game.addPlugin(import_modu_engine.Simple2DRenderer, canvas);
    physics = game.addPlugin(import_modu_engine.Physics2DSystem, { gravity: { x: 0, y: 0 } });
    input = game.addPlugin(import_modu_engine.InputPlugin, canvas);
    window.game = game;
    defineEntities();
    setupCollisions();
    setupSystems();
    setupInput();
    renderer.render = renderWithCamera;
    game.connect("snake-v36", {
      onRoomCreate() {
        for (let i = 0; i < FOOD_COUNT; i++)
          spawnFood();
      },
      onConnect(clientId) {
        spawnSnake(clientId);
      },
      onDisconnect(clientId) {
        killSnake(game.internClientId(clientId));
      },
      onSnapshot(entities) {
        isInCatchUp = true;
        const snapshotFrame = game.frame;
        console.log(`[onSnapshot] Entering catch-up mode at frame ${snapshotFrame}, ${entities.length} entities`);
        const maxSpawnFrameByOwner = /* @__PURE__ */ new Map();
        for (const entity of entities) {
          if (entity.type === "snake-segment" && !entity.destroyed) {
            const seg = entity.get(SnakeSegment);
            const current = maxSpawnFrameByOwner.get(seg.ownerId) ?? 0;
            if (seg.spawnFrame > current) {
              maxSpawnFrameByOwner.set(seg.ownerId, seg.spawnFrame);
            }
          }
        }
        for (const entity of entities) {
          if (entity.type === "snake-head" && !entity.destroyed) {
            const clientId = entity.get(import_modu_engine.Player).clientId;
            const sh = entity.get(SnakeHead);
            const maxSegFrame = maxSpawnFrameByOwner.get(clientId);
            if (maxSegFrame !== void 0 && maxSegFrame > sh.lastSpawnFrame) {
              console.log(`[onSnapshot] Snake ${clientId}: syncing lastSpawnFrame ${sh.lastSpawnFrame} -> ${maxSegFrame}`);
              sh.lastSpawnFrame = maxSegFrame;
            }
          }
        }
        setTimeout(() => {
          console.log(`[onSnapshot] Exiting catch-up mode at frame ${game.frame}`);
          isInCatchUp = false;
        }, 0);
      }
    });
    (0, import_modu_engine.enableDebugUI)(game);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
  } else {
    initGame();
  }
  return __toCommonJS(game_exports);
})();
//# sourceMappingURL=game.js.map
