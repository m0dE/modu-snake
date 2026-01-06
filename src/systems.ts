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
} from 'modu-engine';

import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    SPEED,
    BOOST_SPEED,
    BOOST_COST_FRAMES,
    MIN_BOOST_LENGTH,
    TURN_SPEED,
    BASE_HEAD_RADIUS,
    BASE_SEGMENT_RADIUS,
    INITIAL_LENGTH,
    SEGMENT_SPAWN_INTERVAL,
    SIZE_GROWTH_RATE,
    MAX_SIZE_MULTIPLIER,
    MAX_FOOD,
    FOOD_SPAWN_CHANCE,
    COLORS,
    MIN_ZOOM,
    MAX_ZOOM,
    ZOOM_SPEED,
} from './constants';

import { SnakeHead, SnakeSegment } from './entities';

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
 * Calculate size multiplier based on snake length
 */
export function getSizeMultiplier(length: number): number {
    const growth = 1 + (length - INITIAL_LENGTH) * SIZE_GROWTH_RATE;
    return Math.min(growth, MAX_SIZE_MULTIPLIER);
}

/**
 * Calculate target zoom based on snake length
 */
export function getTargetZoom(length: number): number {
    const sizeMultiplier = getSizeMultiplier(length);
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
                    game.spawn('food', {
                        x: (t.x - sh.dirX * 30) | 0,
                        y: (t.y - sh.dirY * 30) | 0,
                        color: head.get(Sprite).color
                    });
                }
            } else {
                sh.boostFrames = 0;
            }

            // Use velocity-based movement (physics handles determinism)
            const vx = sh.dirX * currentSpeed * 60;
            const vy = sh.dirY * currentSpeed * 60;
            head.setVelocity(vx, vy);

            // Boundary check
            const radius = head.get(Sprite).radius;
            if (t.x - radius < 0 || t.x + radius > WORLD_WIDTH ||
                t.y - radius < 0 || t.y + radius > WORLD_HEIGHT) {
                killSnake(game, clientId);
                continue; // Skip segment spawning for dead snake
            }

            // Segment spawning
            const frameDiff = game.frame - sh.lastSpawnFrame;
            if (frameDiff >= SEGMENT_SPAWN_INTERVAL) {
                const color = head.get(Sprite).color;
                game.spawn('snake-segment', {
                    x: t.x, y: t.y,
                    color: color,
                    ownerId: clientId,
                    spawnFrame: game.frame
                });
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
    game.addSystem(() => {
        const ownerLengths = new Map<number, number>();

        // Sort heads before processing
        const allHeads = [...game.query('snake-head')].sort((a, b) => a.eid - b.eid);
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
        const allSegments = [...game.query('snake-segment')].sort((a, b) => a.eid - b.eid);
        for (const seg of allSegments) {
            if (seg.destroyed) continue;
            const ownerId = seg.get(SnakeSegment).ownerId;
            const sizeMult = ownerLengths.get(ownerId) || 1;
            const segRadius = BASE_SEGMENT_RADIUS * sizeMult;
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
