/**
 * Snake Game Types
 *
 * TypeScript interfaces for type safety across modules.
 */

/**
 * Options for spawning a snake
 */
export interface SpawnSnakeOptions {
    clientId: string;
}

/**
 * Options for spawning food
 */
export interface SpawnFoodOptions {
    x?: number;
    y?: number;
    color?: number;
}

/**
 * Ranking entry for leaderboard
 */
export interface RankEntry {
    clientId: number;
    length: number;
}
