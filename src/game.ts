/**
 * Snake Game - Slither.io style multiplayer
 *
 * Build auto-transforms: Math.sqrt() -> dSqrt(), Math.random() -> dRandom()
 */

import {
    createGame,
    Game,
    Entity,
    Transform2D,
    Body2D,
    Player,
    Sprite,
    BODY_KINEMATIC,
    BODY_STATIC,
    SHAPE_CIRCLE,
    Simple2DRenderer,
    Physics2DSystem,
    InputPlugin,
    enableDebugUI,
    defineComponent,
} from 'modu-engine';

// ============================================
// Constants
// ============================================

const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 4000;

const SPEED = 8;
const BOOST_SPEED = 18;
const BOOST_COST_FRAMES = 10;
const MIN_BOOST_LENGTH = 10;
const BASE_HEAD_RADIUS = 16;
const BASE_SEGMENT_RADIUS = 14;
const INITIAL_LENGTH = 15;
const FOOD_COUNT = 100;
const MAX_FOOD = 200;
const FOOD_SPAWN_CHANCE = 0.03;
const SEGMENT_SPAWN_INTERVAL = 1;
const TURN_SPEED = 0.15;

// Camera settings
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.0;
const ZOOM_SPEED = 0.02;

// Size scaling
const SIZE_GROWTH_RATE = 0.02;
const MAX_SIZE_MULTIPLIER = 3;

const COLORS = [
    '#ff6b6b', '#4dabf7', '#69db7c', '#ffd43b', '#da77f2', '#ff8e72',
    '#38d9a9', '#748ffc', '#f783ac', '#a9e34b', '#3bc9db', '#9775fa'
];

// ============================================
// Types
// ============================================

interface Camera {
    x: number;
    y: number;
    zoom: number;
    targetZoom: number;
}

// ============================================
// Game State
// ============================================

let game: Game;
let renderer: Simple2DRenderer;
let physics: Physics2DSystem;
let input: InputPlugin;

let canvas: HTMLCanvasElement;
let minimapCanvas: HTMLCanvasElement;
let minimapCtx: CanvasRenderingContext2D;
let statsLength: HTMLElement;
let statsRank: HTMLElement;
let WIDTH: number;
let HEIGHT: number;

const camera: Camera = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    zoom: 1.0,
    targetZoom: 1.0
};

let mouseX: number;
let mouseY: number;
let mouseDown = false;

// Track catch-up state to skip segment spawning during late joiner catch-up.
// When a client joins late, they receive a snapshot and must "catch up" by
// simulating frames that the authority has already processed. During this
// catch-up, we skip segment spawning because:
// 1. Those segments were already spawned by the authority with specific entity IDs
// 2. If we spawn them again, we'll get different entity IDs (divergence)
// 3. The next snapshot from authority will include all the correct segments
//
// We set this to true in onSnapshot and false after the first real tick.
// The catch-up runs synchronously before the game loop starts, so the first
// tick after onSnapshot will be a real tick (not catch-up).
let isInCatchUp = false;

// ============================================
// Components (all fields default to i32/fixed-point for determinism)
// ============================================

const SnakeHead = defineComponent('SnakeHead', {
    length: INITIAL_LENGTH,
    dirX: 1,
    dirY: 0,
    prevDirX: 1,
    prevDirY: 0,
    lastSpawnFrame: 0,
    boostFrames: 0,
    boosting: 0
});

const SnakeSegment = defineComponent('SnakeSegment', {
    ownerId: 0,
    spawnFrame: 0
});

// ============================================
// Helper Functions
// ============================================

function getLocalClientId(): number | null {
    const clientId = game.localClientId;
    if (!clientId || typeof clientId !== 'string') return null;
    return game.internClientId(clientId);
}

function getClientIdStr(numericId: number): string {
    return game.getClientIdString(numericId) || '';
}

function compareStrings(a: string, b: string): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function getSizeMultiplier(length: number): number {
    const growth = 1 + (length - INITIAL_LENGTH) * SIZE_GROWTH_RATE;
    return Math.min(growth, MAX_SIZE_MULTIPLIER);
}

function getTargetZoom(length: number): number {
    const sizeMultiplier = getSizeMultiplier(length);
    return Math.max(MIN_ZOOM, MAX_ZOOM / sizeMultiplier);
}

function killSnake(clientId: number): void {
    const head = game.world.getEntityByClientId(clientId);
    if (!head || head.destroyed) return;

    // Sort segments before destroying for deterministic order
    const segments = [...game.query('snake-segment')].sort((a, b) => a.id - b.id);
    for (const seg of segments) {
        if (seg.get(SnakeSegment).ownerId === clientId) {
            seg.destroy();
        }
    }
    head.destroy();
}

function spawnSnake(clientId: string): void {
    // CRITICAL: Always consume random values to maintain RNG synchronization,
    // even if we end up not spawning the snake (due to duplicate detection).
    // The engine isolates RNG in onConnect, but we should still be consistent.
    const color = game.internString('color', COLORS[(Math.random() * COLORS.length) | 0]);
    const startX = 200 + (Math.random() * (WORLD_WIDTH - 400)) | 0;
    const startY = 200 + (Math.random() * (WORLD_HEIGHT - 400)) | 0;

    // Check if snake already exists for this client AFTER consuming random values.
    // This prevents duplicate spawns due to network race conditions where
    // onConnect might be called multiple times (e.g., once from snapshot
    // restoration and again from a late-arriving join input).
    const numericClientId = game.internClientId(clientId);
    const existingHead = game.world.getEntityByClientId(numericClientId);
    if (existingHead && !existingHead.destroyed) {
        console.log(`[spawnSnake] Snake already exists for client ${clientId.slice(0, 8)}, skipping spawn`);
        return;
    }

    // Set lastSpawnFrame to current frame + 10 to delay segment spawning.
    // This gives late joiners time to fully synchronize before spawning segments,
    // preventing entity ID allocation mismatches during catch-up simulation.
    game.spawn('snake-head', {
        x: startX, y: startY, clientId, color,
        length: INITIAL_LENGTH,
        lastSpawnFrame: game.frame + 10
    });
}

function spawnFood(skipSpawn = false): void {
    // Always consume random values to keep RNG in sync across all clients
    const color = game.internString('color', COLORS[(Math.random() * COLORS.length) | 0]);
    const x = 50 + (Math.random() * (WORLD_WIDTH - 100)) | 0;
    const y = 50 + (Math.random() * (WORLD_HEIGHT - 100)) | 0;

    if (!skipSpawn) {
        game.spawn('food', { x, y, color });
    }
}

// ============================================
// Entity Definitions
// ============================================

function defineEntities(): void {
    game.defineEntity('snake-head')
        .with(Transform2D)
        .with(Sprite, { shape: SHAPE_CIRCLE, radius: BASE_HEAD_RADIUS, layer: 2 })
        .with(Body2D, { shapeType: SHAPE_CIRCLE, radius: BASE_HEAD_RADIUS, bodyType: BODY_KINEMATIC, isSensor: true })
        .with(Player)
        .with(SnakeHead)
        .register();

    game.defineEntity('snake-segment')
        .with(Transform2D)
        .with(Sprite, { shape: SHAPE_CIRCLE, radius: BASE_SEGMENT_RADIUS, layer: 1 })
        .with(Body2D, { shapeType: SHAPE_CIRCLE, radius: BASE_SEGMENT_RADIUS, bodyType: BODY_KINEMATIC, isSensor: true })
        .with(SnakeSegment)
        .register();

    game.defineEntity('food')
        .with(Transform2D)
        .with(Sprite, { shape: SHAPE_CIRCLE, radius: 10, layer: 0 })
        .with(Body2D, { shapeType: SHAPE_CIRCLE, radius: 10, bodyType: BODY_STATIC })
        .register();
}

// ============================================
// Collision Handlers
// ============================================

function setupCollisions(): void {
    // Head hits segment (die if not own)
    physics.onCollision('snake-head', 'snake-segment', (head, segment) => {
        if (head.destroyed || segment.destroyed) return;
        const headClientId = head.get(Player).clientId;
        const segOwnerId = segment.get(SnakeSegment).ownerId;
        if (segOwnerId === headClientId) return;
        killSnake(headClientId);
    });

    // Head eats food
    physics.onCollision('snake-head', 'food', (head, food) => {
        if (food.destroyed) return;
        head.get(SnakeHead).length++;
        food.destroy();
    });
}

// ============================================
// Systems
// ============================================

function setupSystems(): void {
    // Movement system - MUST process players in deterministic order
    game.addSystem(() => {
        // Group heads by client ID, then sort by client ID string for deterministic order
        const playerHeads = new Map<number, Entity>();
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.id - b.id);

        for (const head of allHeads) {
            if (head.destroyed) continue;
            const clientId = head.get(Player).clientId;
            if (clientId === undefined || clientId === null) continue;
            playerHeads.set(clientId, head);
        }

        // Sort by client ID string for deterministic processing order
        const sortedPlayers = [...playerHeads.entries()].sort((a, b) =>
            compareStrings(getClientIdStr(a[0]), getClientIdStr(b[0]))
        );

        for (const [clientId, head] of sortedPlayers) {
            if (head.destroyed) continue;

            const playerInput = game.world.getInput(clientId);
            const sh = head.get(SnakeHead);
            const t = head.get(Transform2D);

            sh.prevDirX = sh.dirX;
            sh.prevDirY = sh.dirY;

            if (playerInput?.target) {
                // Direction calculation - Math.sqrt auto-transforms to dSqrt
                const dx = playerInput.target.x - t.x;
                const dy = playerInput.target.y - t.y;
                const distSq = dx * dx + dy * dy;

                if (distSq > 1) {
                    const dist = Math.sqrt(distSq);
                    const desiredX = dx / dist;
                    const desiredY = dy / dist;

                    let newDirX = sh.dirX + (desiredX - sh.dirX) * TURN_SPEED;
                    let newDirY = sh.dirY + (desiredY - sh.dirY) * TURN_SPEED;

                    const newLenSq = newDirX * newDirX + newDirY * newDirY;
                    const newLen = Math.sqrt(newLenSq);
                    if (newLen > 0.001) {
                        sh.dirX = newDirX / newLen;
                        sh.dirY = newDirY / newLen;
                    }
                }
            }

            // Boost
            const boostPressed = playerInput?.boost === true || (playerInput?.boost as any)?.pressed || playerInput?.boost > 0;
            const isBoosting = boostPressed && sh.length > MIN_BOOST_LENGTH;
            const currentSpeed = isBoosting ? BOOST_SPEED : SPEED;
            sh.boosting = isBoosting ? 1 : 0;

            if (isBoosting) {
                sh.boostFrames++;
                if (sh.boostFrames >= BOOST_COST_FRAMES) {
                    sh.length--;
                    sh.boostFrames = 0;
                    // Skip food spawning during catch-up for non-authority
                    if (!isInCatchUp || game.isAuthority()) {
                        game.spawn('food', {
                            x: (t.x - sh.dirX * 30) | 0,
                            y: (t.y - sh.dirY * 30) | 0,
                            color: head.get(Sprite).color
                        });
                    }
                }
            } else {
                sh.boostFrames = 0;
            }

            // Use velocity-based movement (physics handles determinism)
            const body = head.get(Body2D);
            body.vx = sh.dirX * currentSpeed * 60;
            body.vy = sh.dirY * currentSpeed * 60;

            // Boundary check
            const radius = head.get(Sprite).radius;
            if (t.x - radius < 0 || t.x + radius > WORLD_WIDTH ||
                t.y - radius < 0 || t.y + radius > WORLD_HEIGHT) {
                killSnake(clientId);
                continue; // Skip segment spawning for dead snake
            }

            // Segment spawning
            // During catch-up, we skip spawning because:
            // 1. The authority has already spawned segments for frames after the snapshot
            // 2. Those segments have specific entity IDs that we can't reproduce
            // 3. The next snapshot will include the correct segments
            //
            // The onSnapshot callback adjusts lastSpawnFrame to prevent attempting
            // spawns for segments that already exist in the snapshot.
            const frameDiff = game.frame - sh.lastSpawnFrame;
            if (frameDiff >= SEGMENT_SPAWN_INTERVAL) {
                // Skip spawning during catch-up for non-authority clients
                if (!isInCatchUp || game.isAuthority()) {
                    const color = head.get(Sprite).color;
                    const segment = game.spawn('snake-segment', {
                        x: t.x, y: t.y,
                        color: color,
                        ownerId: clientId,
                        spawnFrame: game.frame
                    });
                    // Debug: log segment spawning to help diagnose issues
                    if (game.frame % 100 === 0) {
                        console.log(`[Spawn] frame=${game.frame} segId=${segment.id} owner=${clientId} isAuth=${game.isAuthority()} catchUp=${isInCatchUp}`);
                    }
                }
                sh.lastSpawnFrame = game.frame;
            }
        }
    }, { phase: 'update' });

    // Tail cleanup - process in deterministic order
    game.addSystem(() => {
        const headMaxAge = new Map<number, number>();

        // Sort heads before building the map
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.id - b.id);
        for (const head of allHeads) {
            if (head.destroyed) continue;
            const clientId = head.get(Player).clientId;
            const maxLength = head.get(SnakeHead).length;
            headMaxAge.set(clientId, game.frame - (maxLength * SEGMENT_SPAWN_INTERVAL));
        }

        // Sort segments before destroying
        const allSegments = [...game.query('snake-segment')].sort((a, b) => a.id - b.id);
        for (const seg of allSegments) {
            if (seg.destroyed) continue;
            const segData = seg.get(SnakeSegment);
            const oldestAllowed = headMaxAge.get(segData.ownerId);
            if (oldestAllowed !== undefined && segData.spawnFrame < oldestAllowed) {
                seg.destroy();
            }
        }
    }, { phase: 'update' });

    // Food spawning
    game.addSystem(() => {
        // Skip random food spawning during catch-up for non-authority
        // spawnFood still consumes random values to keep RNG in sync
        const shouldSpawn = Math.random() < FOOD_SPAWN_CHANCE;
        if (game.getEntitiesByType('food').length < MAX_FOOD && shouldSpawn) {
            const skipSpawn = isInCatchUp && !game.isAuthority();
            spawnFood(skipSpawn);
        }
    }, { phase: 'update' });

    // Size update - process in deterministic order
    game.addSystem(() => {
        const ownerLengths = new Map<number, number>();

        // Sort heads before processing
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.id - b.id);
        for (const head of allHeads) {
            if (head.destroyed) continue;
            const clientId = head.get(Player).clientId;
            const length = head.get(SnakeHead).length;
            const sizeMult = getSizeMultiplier(length);
            ownerLengths.set(clientId, sizeMult);

            const headRadius = BASE_HEAD_RADIUS * sizeMult;
            head.get(Sprite).radius = headRadius;
            head.get(Body2D).radius = headRadius;
        }

        // Sort segments before processing
        const allSegments = [...game.query('snake-segment')].sort((a, b) => a.id - b.id);
        for (const seg of allSegments) {
            if (seg.destroyed) continue;
            const ownerId = seg.get(SnakeSegment).ownerId;
            const sizeMult = ownerLengths.get(ownerId) || 1;
            const segRadius = BASE_SEGMENT_RADIUS * sizeMult;
            seg.get(Sprite).radius = segRadius;
            seg.get(Body2D).radius = segRadius;
        }
    }, { phase: 'update' });

    // Camera update (client-side only, doesn't affect simulation)
    game.addSystem(() => {
        const localId = getLocalClientId();
        if (localId === null) return;

        const head = game.world.getEntityByClientId(localId);
        if (!head || head.destroyed) return;

        const t = head.get(Transform2D);
        const length = head.get(SnakeHead).length;

        camera.targetZoom = getTargetZoom(length);
        camera.zoom += (camera.targetZoom - camera.zoom) * ZOOM_SPEED;
        camera.x = t.x;
        camera.y = t.y;
    }, { phase: 'update' });
}

// ============================================
// Rendering
// ============================================

function renderWithCamera(): void {
    const ctx = renderer.context;
    const alpha = game.getRenderAlpha();

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    let camX = camera.x, camY = camera.y;
    const localId = getLocalClientId();
    const localHead = localId ? game.world.getEntityByClientId(localId) : null;

    if (localHead && !localHead.destroyed) {
        localHead.interpolate(alpha);
        const t = localHead.get(Transform2D);
        camX = localHead.render?.interpX ?? t.x;
        camY = localHead.render?.interpY ?? t.y;
    }

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camX, -camY);

    // World bounds
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4 / camera.zoom;
    ctx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Grid
    ctx.strokeStyle = '#1a1a1a';
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

    // Food (render order doesn't matter for visuals)
    for (const food of game.query('food')) {
        if (food.destroyed) continue;
        food.interpolate(alpha);
        const x = food.render?.interpX ?? food.get(Transform2D).x;
        const y = food.render?.interpY ?? food.get(Transform2D).y;
        const sprite = food.get(Sprite);
        ctx.fillStyle = game.getString('color', sprite.color) || '#fff';
        ctx.beginPath();
        ctx.arc(x, y, sprite.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Segments
    for (const seg of game.query('snake-segment')) {
        if (seg.destroyed) continue;
        seg.interpolate(alpha);
        const x = seg.render?.interpX ?? seg.get(Transform2D).x;
        const y = seg.render?.interpY ?? seg.get(Transform2D).y;
        const sprite = seg.get(Sprite);
        ctx.fillStyle = game.getString('color', sprite.color) || '#fff';
        ctx.beginPath();
        ctx.arc(x, y, sprite.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Heads
    for (const head of game.query('snake-head')) {
        if (head.destroyed) continue;
        head.interpolate(alpha);
        const x = head.render?.interpX ?? head.get(Transform2D).x;
        const y = head.render?.interpY ?? head.get(Transform2D).y;
        const sprite = head.get(Sprite);
        const sh = head.get(SnakeHead);
        const sizeMult = getSizeMultiplier(sh.length);
        const colorStr = game.getString('color', sprite.color) || '#fff';

        // Glow when boosting
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

        // Eyes
        const dirX = sh.prevDirX + (sh.dirX - sh.prevDirX) * alpha;
        const dirY = sh.prevDirY + (sh.dirY - sh.prevDirY) * alpha;
        const eyeOffset = 6 * sizeMult;
        const eyeRadius = 5 * sizeMult;
        const pupilRadius = 2 * sizeMult;
        const perpX = -dirY, perpY = dirX;

        for (const side of [-1, 1]) {
            const ex = x + dirX * eyeOffset + perpX * eyeOffset * side;
            const ey = y + dirY * eyeOffset + perpY * eyeOffset * side;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ex, ey, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(ex + dirX * pupilRadius, ey + dirY * pupilRadius, pupilRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
    drawMinimap(camX, camY);
    updateStats();
}

function updateStats(): void {
    const localId = getLocalClientId();
    if (!localId) return;

    const localHead = game.world.getEntityByClientId(localId);
    if (!localHead || localHead.destroyed) {
        statsLength.textContent = '0';
        statsRank.textContent = '- of -';
        return;
    }

    const myLength = localHead.get(SnakeHead).length;
    statsLength.textContent = String(myLength);

    const snakes: { clientId: number; length: number }[] = [];
    for (const head of game.query('snake-head')) {
        if (head.destroyed) continue;
        snakes.push({
            clientId: head.get(Player).clientId,
            length: head.get(SnakeHead).length
        });
    }
    snakes.sort((a, b) => b.length - a.length);

    const rank = snakes.findIndex(s => s.clientId === localId) + 1;
    statsRank.textContent = `${rank} of ${snakes.length}`;
}

function drawMinimap(camX: number, camY: number): void {
    const mmW = minimapCanvas.width;
    const mmH = minimapCanvas.height;
    const scaleX = mmW / WORLD_WIDTH;
    const scaleY = mmH / WORLD_HEIGHT;

    minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    minimapCtx.fillRect(0, 0, mmW, mmH);

    minimapCtx.strokeStyle = '#444';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(0, 0, mmW, mmH);

    minimapCtx.fillStyle = '#555';
    for (const food of game.query('food')) {
        if (food.destroyed) continue;
        const t = food.get(Transform2D);
        const mx = t.x * scaleX;
        const my = t.y * scaleY;
        minimapCtx.fillRect(mx - 1, my - 1, 2, 2);
    }

    for (const head of game.query('snake-head')) {
        if (head.destroyed) continue;
        const t = head.get(Transform2D);
        const sprite = head.get(Sprite);
        const color = game.getString('color', sprite.color) || '#fff';
        const clientId = head.get(Player).clientId;
        const isLocal = clientId === getLocalClientId();

        minimapCtx.fillStyle = color;
        const mx = t.x * scaleX;
        const my = t.y * scaleY;
        minimapCtx.beginPath();
        minimapCtx.arc(mx, my, isLocal ? 4 : 3, 0, Math.PI * 2);
        minimapCtx.fill();

        if (isLocal) {
            minimapCtx.strokeStyle = '#fff';
            minimapCtx.lineWidth = 1;
            minimapCtx.beginPath();
            minimapCtx.arc(mx, my, 6, 0, Math.PI * 2);
            minimapCtx.stroke();
        }
    }

    const viewW = (WIDTH / camera.zoom) * scaleX;
    const viewH = (HEIGHT / camera.zoom) * scaleY;
    const viewX = camX * scaleX - viewW / 2;
    const viewY = camY * scaleY - viewH / 2;

    minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(viewX, viewY, viewW, viewH);
}

// ============================================
// Input Setup
// ============================================

function setupInput(): void {
    mouseX = WIDTH / 2;
    mouseY = HEIGHT / 2;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', (e) => { if (e.button === 0) mouseDown = true; });
    canvas.addEventListener('mouseup', (e) => { if (e.button === 0) mouseDown = false; });
    canvas.addEventListener('mouseleave', () => { mouseDown = false; });

    input.action('target', {
        type: 'vector',
        bindings: [() => ({
            x: Math.round(camera.x + (mouseX - WIDTH / 2) / camera.zoom),
            y: Math.round(camera.y + (mouseY - HEIGHT / 2) / camera.zoom)
        })]
    });

    input.action('boost', { type: 'button', bindings: [() => mouseDown] });
}

// ============================================
// Main Entry Point
// ============================================

export function initGame(): void {
    canvas = document.getElementById('game') as HTMLCanvasElement;
    minimapCanvas = document.getElementById('minimap') as HTMLCanvasElement;
    minimapCtx = minimapCanvas.getContext('2d')!;
    statsLength = document.querySelector('#stats .length') as HTMLElement;
    statsRank = document.getElementById('rank-text') as HTMLElement;

    // Set canvas to fullscreen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
    });

    game = createGame();
    renderer = game.addPlugin(Simple2DRenderer, canvas);
    physics = game.addPlugin(Physics2DSystem, { gravity: { x: 0, y: 0 } });
    input = game.addPlugin(InputPlugin, canvas);

    (window as any).game = game;

    defineEntities();
    setupCollisions();
    setupSystems();
    setupInput();

    renderer.render = renderWithCamera;

    game.connect('snake-v36', {
        onRoomCreate() {
            for (let i = 0; i < FOOD_COUNT; i++) spawnFood();
        },
        onConnect(clientId: string) {
            spawnSnake(clientId);
        },
        onDisconnect(clientId: string) {
            killSnake(game.internClientId(clientId));
        },
        onSnapshot(entities: Entity[]) {
            // Mark that we're in catch-up mode
            // The catch-up simulation runs synchronously after onSnapshot,
            // so isInCatchUp will be true during all catch-up ticks.
            isInCatchUp = true;
            const snapshotFrame = game.frame;
            console.log(`[onSnapshot] Entering catch-up mode at frame ${snapshotFrame}, ${entities.length} entities`);

            // Find the maximum spawnFrame for each snake owner from existing segments
            // This tells us the actual latest segment that exists in the snapshot
            const maxSpawnFrameByOwner = new Map<number, number>();
            for (const entity of entities) {
                if (entity.type === 'snake-segment' && !entity.destroyed) {
                    const seg = entity.get(SnakeSegment);
                    const current = maxSpawnFrameByOwner.get(seg.ownerId) ?? 0;
                    if (seg.spawnFrame > current) {
                        maxSpawnFrameByOwner.set(seg.ownerId, seg.spawnFrame);
                    }
                }
            }

            // Update each snake head's lastSpawnFrame based on actual segments
            // This prevents duplicate spawning during catch-up by ensuring we
            // only spawn segments that don't already exist.
            for (const entity of entities) {
                if (entity.type === 'snake-head' && !entity.destroyed) {
                    const clientId = entity.get(Player).clientId;
                    const sh = entity.get(SnakeHead);
                    const maxSegFrame = maxSpawnFrameByOwner.get(clientId);

                    // If we have segments, set lastSpawnFrame to the latest one
                    // This ensures we don't re-spawn segments during catch-up
                    if (maxSegFrame !== undefined && maxSegFrame > sh.lastSpawnFrame) {
                        console.log(`[onSnapshot] Snake ${clientId}: syncing lastSpawnFrame ${sh.lastSpawnFrame} -> ${maxSegFrame}`);
                        sh.lastSpawnFrame = maxSegFrame;
                    }
                }
            }

            // Schedule clearing the catch-up flag after current call stack completes.
            // This works because catch-up runs synchronously, and setTimeout
            // will execute after all synchronous code (including catch-up) finishes.
            setTimeout(() => {
                console.log(`[onSnapshot] Exiting catch-up mode at frame ${game.frame}`);
                isInCatchUp = false;
            }, 0);
        }
    });

    enableDebugUI(game);
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
