/**
 * Snake Game Entity Definitions
 *
 * Components and entity type registrations for the snake game.
 */

import {
    Game,
    Transform2D,
    Body2D,
    Player,
    Sprite,
    Camera2D,
    BODY_KINEMATIC,
    BODY_STATIC,
    SHAPE_CIRCLE,
    defineComponent,
} from 'modu-engine';

import {
    BASE_HEAD_RADIUS,
    BASE_SEGMENT_RADIUS,
    INITIAL_LENGTH,
} from './constants';

// ============================================
// Components (all fields default to i32/fixed-point for determinism)
// ============================================

// Direction values are scaled by 1000 for fixed-point representation
// e.g., dirX=1000 means direction 1.0, dirX=-500 means direction -0.5
export const DIR_SCALE = 1000;

export const SnakeHead = defineComponent('SnakeHead', {
    length: INITIAL_LENGTH,
    dirX: DIR_SCALE,    // Start facing right: 1.0 * 1000 = 1000
    dirY: 0,            // 0.0 * 1000 = 0
    prevDirX: DIR_SCALE,
    prevDirY: 0,
    lastSpawnFrame: 0,
    boostFrames: 0,
    boosting: 0
});

export const SnakeSegment = defineComponent('SnakeSegment', {
    ownerId: 0,
    spawnFrame: 0
});

// ============================================
// Entity Definitions
// ============================================

export function defineEntities(game: Game): void {
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

    // Camera entity - client-only, excluded from snapshots entirely
    game.defineEntity('camera')
        .with(Camera2D, { smoothing: 0.15 })
        .syncNone()
        .register();
}
