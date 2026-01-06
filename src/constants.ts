/**
 * Snake Game Constants
 *
 * All game constants extracted for easy tuning and reuse across modules.
 */

// World dimensions
export const WORLD_WIDTH = 4000;
export const WORLD_HEIGHT = 4000;

// Movement
export const SPEED = 8;
export const BOOST_SPEED = 18;
export const BOOST_COST_FRAMES = 10;
export const MIN_BOOST_LENGTH = 10;
export const TURN_SPEED = 0.15;

// Snake sizing
export const BASE_HEAD_RADIUS = 16;
export const BASE_SEGMENT_RADIUS = 14;
export const INITIAL_LENGTH = 15;
export const SEGMENT_SPAWN_INTERVAL = 1;

// Size scaling
export const SIZE_GROWTH_RATE = 0.02;
export const MAX_SIZE_MULTIPLIER = 3;

// Food
export const FOOD_COUNT = 100;
export const MAX_FOOD = 200;
export const FOOD_SPAWN_CHANCE = 0.03;

// Camera settings
export const MIN_ZOOM = 0.3;
export const MAX_ZOOM = 1.0;
export const ZOOM_SPEED = 0.02;

// Snake colors
export const COLORS = [
    '#ff6b6b', '#4dabf7', '#69db7c', '#ffd43b', '#da77f2', '#ff8e72',
    '#38d9a9', '#748ffc', '#f783ac', '#a9e34b', '#3bc9db', '#9775fa'
];
