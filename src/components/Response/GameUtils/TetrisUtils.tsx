// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import getStore from "../../../store/ResponseStore";
import { Constants } from "../../../utils/Constants";

// Helper method to get the coordinates for Shadow blocks
export function getShadowBlock(tetrisGameBoard: number[][]) {
    const store = getStore();
    // Find Projection or shadow block
    let currentBlock = [
        {
            xCord: store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][0][0],
            yCord: store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][0][1]
        },
        {
            xCord: store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][1][0],
            yCord: store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][1][1]
        },
        {
            xCord: store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][2][0],
            yCord: store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][2][1]
        },
        {
            xCord: store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][3][0],
            yCord: store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][3][1]
        },
    ];

    // sort the block with y coordinate
    const movingBlock = currentBlock.sort((first, second) => {
        return Number(second.yCord) - Number(first.yCord);
    });

    let cordinateMap = new Map<number, number[]>();
    for (let level of movingBlock) {
        if (!cordinateMap.has(level.yCord)) {
            cordinateMap.set(level.yCord, [level.xCord]);
        } else {
            let xCoordinates: number[] = cordinateMap.get(level.yCord) || [];
            xCoordinates.push(level.xCord);
            cordinateMap.set(level.yCord, xCoordinates);
        }
    }
    let shadowMap: any[] = [];
    // find it from lower level
    for (let row = Constants.BOARD_HEIGHT - 1; row >= 0; row--) {
        let isXValid = true;
        let level = 0;
        let tileHeight = cordinateMap.size;
        for (let key of cordinateMap.keys()) {
            // avoid collision
            if ((row - level - key) <= tileHeight) { break; }
            const xCoordinates = cordinateMap.get(key);
            // validate the Game Level
            let isLevelValid = true;
            for (let xCoordinate of xCoordinates) {
                for (let test = row - level; test >= 0; test--) {
                    if (tetrisGameBoard[test][xCoordinate] != 0) {
                        isLevelValid = false;
                        break;
                    }
                }
            }
            // If the levels are not cleared, start from new level
            if (!isLevelValid) { break; }
            for (let xCoordinate of xCoordinates) {
                if (tetrisGameBoard[row - level][xCoordinate] != 0) {
                    isXValid = false;
                    shadowMap = [];
                    break;
                } else {
                    shadowMap.push({ x: xCoordinate, y: (row - level) });
                }
            }
            level++;
            if (!isXValid) { break; }
        }
        if (level == cordinateMap.size && isXValid) {
            break;
        } else {
            shadowMap = [];
        }
    }
    return shadowMap;
}

// Helper method to initialized tetris Game board
export function initializeGameBoard() {
    let gameBoardGrid = [];
    // to generate rows and columns for the game board.
    for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
        let rowData = [];
        for (let column = 0; column < Constants.BOARD_WIDTH; column++) {
            rowData.push(0);
        }
        gameBoardGrid.push(rowData);
    }
    return gameBoardGrid;
}

// Helper Method to Find Width of current moving block
export function getWidthOfBlock(): number {
    const store = getStore();
    let xCoordinates =
        [
            store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][0][0],
            store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][1][0],
            store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][2][0],
            store.xCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][3][0]
        ];
    const sortedCoordinates = xCoordinates.sort();
    return (sortedCoordinates[3] - sortedCoordinates[0]) + 1;
}

// Helper method to find the height of the current moving block
export function getHeightOfBlock(): number {
    const store = getStore();
    let yCoordinates =
        [
            store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][0][1],
            store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][1][1],
            store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][2][1],
            store.yCoordinateOfActiveBlock + store.blocks[store.activeBlockNumber][store.blockRotationNumber][3][1]
        ];
    const sortedCoordinates = yCoordinates.sort();
    return (sortedCoordinates[3] - sortedCoordinates[0]) + 1;
}
