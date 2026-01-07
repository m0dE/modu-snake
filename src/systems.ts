/**
 * Snake Game Systems
 *
 * All game systems, collision handlers, and helper functions.
 * Build auto-transforms: Math.sqrt() -> dSqrt(), Math.random() -> dRandom()
 */

import {
    Game,
    Entity,
    Transform2D,
    Body2D,
    Player,
    Sprite,
    Camera2D,
    Physics2DSystem,
    toFixed,
    toFloat,
    fpMul,
    fpDiv,
    fpSqrt,
    FP_ONE,
} from 'modu-engine';

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    SPEED,
    BOOST_SPEED,
    BOOST_COST_FRAMES,
    MIN_BOOST_LENGTH,
    BASE_HEAD_RADIUS,
    BASE_SEGMENT_RADIUS,
    INITIAL_LENGTH,
    SEGMENT_SPAWN_INTERVAL,
    MAX_FOOD,
    FOOD_SPAWN_CHANCE,
    COLORS,
    MIN_ZOOM,
    MAX_ZOOM,
    ZOOM_SPEED,
} from './constants';

import { SnakeHead, SnakeSegment, DIR_SCALE } from './entities';

// Fixed-point constants
const TURN_SPEED_FP = toFixed(0.15);  // Turn speed as fixed-point

// ============================================
// Helper Functions
// ============================================

/**
 * Get local client's numeric ID
 */
export function getLocalClientId(game: Game): number | null {
    const clientId = game.localClientId;
    if (!clientId || typeof clientId !== 'string') return null;
    return game.internClientId(clientId);
}

/**
 * Get string form of a numeric client ID
 */
export function getClientIdStr(game: Game, numericId: number): string {
    return game.getClientIdString(numericId) || '';
}

/**
 * Compare strings for deterministic sorting
 */
function compareStrings(a: string, b: string): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

/**
 * Calculate size multiplier based on snake length.
 * Returns a fixed-point value scaled by 100 (e.g., 100 = 1.0x, 150 = 1.5x, 300 = 3.0x).
 * Uses integer math for determinism.
 */
export function getSizeMultiplier(length: number): number {
    // SIZE_GROWTH_RATE is 0.02, so multiply by 2 per length unit above INITIAL_LENGTH
    // Base is 100 (representing 1.0x multiplier)
    // Formula: 100 + (length - INITIAL_LENGTH) * 2
    const growth = 100 + (length - INITIAL_LENGTH) * 2;
    // MAX_SIZE_MULTIPLIER is 3, so cap at 300
    const maxScaled = 300; // MAX_SIZE_MULTIPLIER * 100
    return growth < maxScaled ? growth : maxScaled;
}

/**
 * Calculate target zoom based on snake length.
 * This is render-only (camera zoom), so float math is acceptable here.
 */
export function getTargetZoom(length: number): number {
    // getSizeMultiplier returns scaled by 100, so divide by 100 to get actual multiplier
    const sizeMultiplier = getSizeMultiplier(length) / 100;
    return Math.max(MIN_ZOOM, MAX_ZOOM / sizeMultiplier);
}

/**
 * Kill a snake and all its segments
 */
export function killSnake(game: Game, clientId: number): void {
    const head = game.world.getEntityByClientId(clientId);
    if (!head || head.destroyed) return;

    // Sort segments before destroying for deterministic order
    const segments = [...game.query('snake-segment')].sort((a, b) => a.eid - b.eid);
    for (const seg of segments) {
        if (seg.get(SnakeSegment).ownerId === clientId) {
            seg.destroy();
        }
    }
    head.destroy();
}

/**
 * Spawn a new snake for a client
 */
export function spawnSnake(game: Game, clientId: string): void {
    const color = game.internString('color', COLORS[(Math.random() * COLORS.length) | 0]);
    const startX = 200 + (Math.random() * (WORLD_WIDTH - 400)) | 0;
    const startY = 200 + (Math.random() * (WORLD_HEIGHT - 400)) | 0;

    game.spawn('snake-head', {
        x: startX, y: startY, clientId, color,
        length: INITIAL_LENGTH,
        lastSpawnFrame: game.frame
    });
}

/**
 * Spawn food at a random or specified location
 */
export function spawnFood(game: Game, x?: number, y?: number, color?: number): void {
    const foodColor = color ?? game.internString('color', COLORS[(Math.random() * COLORS.length) | 0]);
    const foodX = x ?? (50 + (Math.random() * (WORLD_WIDTH - 100)) | 0);
    const foodY = y ?? (50 + (Math.random() * (WORLD_HEIGHT - 100)) | 0);

    game.spawn('food', {
        x: foodX,
        y: foodY,
        color: foodColor
    });
}

// ============================================
// Collision Handlers
// ============================================

export function setupCollisions(game: Game, physics: Physics2DSystem): void {
    // Head hits segment (die if not own)
    physics.onCollision('snake-head', 'snake-segment', (head, segment) => {
        if (head.destroyed || segment.destroyed) return;
        const headClientId = head.get(Player).clientId;
        const segOwnerId = segment.get(SnakeSegment).ownerId;
        if (segOwnerId === headClientId) return;
        killSnake(game, headClientId);
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

export function setupSystems(game: Game): void {
    // Movement system - MUST process players in deterministic order
    game.addSystem(() => {
        // Group heads by client ID, then sort by client ID string for deterministic order
        const playerHeads = new Map<number, Entity>();
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.eid - b.eid);

        for (const head of allHeads) {
            if (head.destroyed) continue;
            const clientId = head.get(Player).clientId;
            if (clientId === undefined || clientId === null) continue;
            playerHeads.set(clientId, head);
        }

        // Sort by client ID string for deterministic processing order
        const sortedPlayers = [...playerHeads.entries()].sort((a, b) =>
            compareStrings(getClientIdStr(game, a[0]), getClientIdStr(game, b[0]))
        );

        for (const [clientId, head] of sortedPlayers) {
            if (head.destroyed) continue;

            const playerInput = game.world.getInput(clientId);
            const sh = head.get(SnakeHead);
            const t = head.get(Transform2D);

            sh.prevDirX = sh.dirX;
            sh.prevDirY = sh.dirY;

            if (playerInput?.target) {
                // === FULLY DETERMINISTIC DIRECTION CALCULATION ===
                // Round input to integers first to ensure identical values on client/server
                const targetX = Math.round(playerInput.target.x);
                const targetY = Math.round(playerInput.target.y);

                // All math in fixed-point (16.16 format)
                const dxFp = toFixed(targetX) - toFixed(t.x);
                const dyFp = toFixed(targetY) - toFixed(t.y);
                const distSqFp = fpMul(dxFp, dxFp) + fpMul(dyFp, dyFp);

                // Only turn if target is far enough (> 1 unit)
                if (distSqFp > FP_ONE) {
                    const distFp = fpSqrt(distSqFp);

                    // Desired direction (normalized, scaled by FP_ONE)
                    const desiredXFp = fpDiv(dxFp, distFp);
                    const desiredYFp = fpDiv(dyFp, distFp);

                    // Current direction converted from DIR_SCALE to FP
                    // sh.dirX is scaled by 1000, FP_ONE is 65536
                    // To convert: (dirX * FP_ONE) / DIR_SCALE
                    const curDirXFp = ((sh.dirX * FP_ONE) / DIR_SCALE) | 0;
                    const curDirYFp = ((sh.dirY * FP_ONE) / DIR_SCALE) | 0;

                    // Interpolate: newDir = curDir + (desired - curDir) * turnSpeed
                    let newDirXFp = curDirXFp + fpMul(desiredXFp - curDirXFp, TURN_SPEED_FP);
                    let newDirYFp = curDirYFp + fpMul(desiredYFp - curDirYFp, TURN_SPEED_FP);

                    // Normalize the new direction
                    const newLenSqFp = fpMul(newDirXFp, newDirXFp) + fpMul(newDirYFp, newDirYFp);
                    if (newLenSqFp > 0) {
                        const newLenFp = fpSqrt(newLenSqFp);
                        if (newLenFp > 0) {
                            newDirXFp = fpDiv(newDirXFp, newLenFp);
                            newDirYFp = fpDiv(newDirYFp, newLenFp);
                        }
                    }

                    // Convert back to DIR_SCALE format for storage
                    // (dirFp * DIR_SCALE) / FP_ONE
                    sh.dirX = ((newDirXFp * DIR_SCALE) / FP_ONE) | 0;
                    sh.dirY = ((newDirYFp * DIR_SCALE) / FP_ONE) | 0;
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
                    // Food spawn position using integer math
                    // t.x - (dirX * 30) / DIR_SCALE
                    const foodX = t.x - ((sh.dirX * 30) / DIR_SCALE) | 0;
                    const foodY = t.y - ((sh.dirY * 30) / DIR_SCALE) | 0;
                    game.spawn('food', {
                        x: foodX,
                        y: foodY,
                        color: head.get(Sprite).color
                    });
                }
            } else {
                sh.boostFrames = 0;
            }

            // === DETERMINISTIC VELOCITY ===
            // Velocity = (direction / DIR_SCALE) * speed * 60
            // Using integer math: (dirX * speed * 60) / DIR_SCALE
            // But we need float output for physics, so convert at end
            const vxInt = (sh.dirX * currentSpeed * 60) / DIR_SCALE;
            const vyInt = (sh.dirY * currentSpeed * 60) / DIR_SCALE;
            // Round to ensure determinism
            head.setVelocity(Math.round(vxInt), Math.round(vyInt));

            // Boundary check (using integer comparison)
            const radius = head.get(Sprite).radius | 0;
            const posX = t.x | 0;
            const posY = t.y | 0;
            if (posX - radius < 0 || posX + radius > WORLD_WIDTH ||
                posY - radius < 0 || posY + radius > WORLD_HEIGHT) {
                killSnake(game, clientId);
                continue; // Skip segment spawning for dead snake
            }

            // Segment spawning
            const frameDiff = game.frame - sh.lastSpawnFrame;
            if (frameDiff >= SEGMENT_SPAWN_INTERVAL) {
                const color = head.get(Sprite).color;
                const seg = game.spawn('snake-segment', {
                    x: posX,
                    y: posY,
                    color: color
                });
                // Manually set SnakeSegment fields to ensure they're applied
                const segData = seg.get(SnakeSegment);
                segData.ownerId = clientId;
                segData.spawnFrame = game.frame;
                sh.lastSpawnFrame = game.frame;
            }
        }
    }, { phase: 'update' });

    // Tail cleanup - process in deterministic order
    game.addSystem(() => {
        const headMaxAge = new Map<number, number>();

        // Sort heads before building the map
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.eid - b.eid);
        for (const head of allHeads) {
            if (head.destroyed) continue;
            const clientId = head.get(Player).clientId;
            const maxLength = head.get(SnakeHead).length;
            headMaxAge.set(clientId, game.frame - (maxLength * SEGMENT_SPAWN_INTERVAL));
        }

        // Sort segments before destroying
        const allSegments = [...game.query('snake-segment')].sort((a, b) => a.eid - b.eid);
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
        if (game.getEntitiesByType('food').length < MAX_FOOD && Math.random() < FOOD_SPAWN_CHANCE) {
            spawnFood(game);
        }
    }, { phase: 'update' });

    // Size update - process in deterministic order
    // Uses integer math: getSizeMultiplier returns scale * 100, so we compute
    // radius = (BASE_RADIUS * sizeMultScaled) / 100 using integer division
    game.addSystem(() => {
        const ownerLengths = new Map<number, number>();

        // Sort heads before processing
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.eid - b.eid);
        for (const head of allHeads) {
            if (head.destroyed) continue;
            const clientId = head.get(Player).clientId;
            const length = head.get(SnakeHead).length;
            const sizeMultScaled = getSizeMultiplier(length); // Returns 100-300 (scaled by 100)
            ownerLengths.set(clientId, sizeMultScaled);

            // Integer division: (16 * 150) / 100 = 24
            const headRadius = ((BASE_HEAD_RADIUS * sizeMultScaled) / 100) | 0;
            head.get(Sprite).radius = headRadius;
            head.get(Body2D).radius = headRadius;
        }

        // Sort segments before processing
        const allSegments = [...game.query('snake-segment')].sort((a, b) => a.eid - b.eid);
        for (const seg of allSegments) {
            if (seg.destroyed) continue;
            const ownerId = seg.get(SnakeSegment).ownerId;
            const sizeMultScaled = ownerLengths.get(ownerId) || 100; // Default to 100 (1.0x)
            // Integer division: (14 * 150) / 100 = 21
            const segRadius = ((BASE_SEGMENT_RADIUS * sizeMultScaled) / 100) | 0;
            seg.get(Sprite).radius = segRadius;
            seg.get(Body2D).radius = segRadius;
        }
    }, { phase: 'update' });
}

/**
 * Update camera to follow local player
 * Called from render function (client-side only)
 */
export function updateCamera(
    game: Game,
    cameraEntity: Entity,
    getLocalClientId: () => number | null
): void {
    const localId = getLocalClientId();
    if (localId === null) return;

    const head = game.world.getEntityByClientId(localId);
    if (!head || head.destroyed) return;

    const t = head.get(Transform2D);
    const length = head.get(SnakeHead).length;
    const camera = cameraEntity.get(Camera2D);

    // Update zoom based on snake size
    const targetZoom = getTargetZoom(length);
    camera.zoom += (targetZoom - camera.zoom) * ZOOM_SPEED;

    // Smooth camera follow
    camera.x += (t.x - camera.x) * camera.smoothing;
    camera.y += (t.y - camera.y) * camera.smoothing;
}
