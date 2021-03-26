// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import TetrisBoard from "./GameBoard";
import "./TetrisGame.scss";
import { Constants } from "../../utils/Constants";
import GameEndView from "./GameEndView";
import {
    setGameStatus,
    updateTetrisGameBoard,
    updateTimerId,
    updateGameScore,
    updateXYCoordinateOfActiveBlock,
    updateRotation,
    updateShadowPiece,
    updateGameLevel,
    updateActiveBlockNumber
} from "../../actions/ResponseAction";
import getStore, { GameStatus } from "../../store/ResponseStore";
import { Utils } from "../../utils/Utils";
import { getHeightOfBlock, getShadowBlock, getWidthOfBlock } from "./GameUtils/TetrisUtils";
import { Swipe } from "react-swipe-component";
import { UxUtils } from "../../utils/UxUtils";
import { PauseIcon, PlayIcon, Reaction } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";

/**
 * <TetrisGame> component for tetris game logic
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */

@observer
class TetrisGame extends React.Component<any> {
    private store = getStore();
    private initialXPosition = null;
    private initialYPosition = null;
    private diffX = null;
    private diffY = null;
    private timeDown = null;
    constructor(props: any) {
        super(props);
        setGameStatus(GameStatus.InProgress);
    }

    // Key Press Handler
    handleKeyDown = (event) => {
        const key = { ...Constants.KEY_MAP };
        switch (event.keyCode) {
            case key.UP:
                this.updateTetrisGameBoard("rotate");
                break;
            case key.DOWN:
                this.updateTetrisGameBoard("down");
                break;
            case key.LEFT:
                this.updateTetrisGameBoard("left");
                break;
            case key.RIGHT:
                this.updateTetrisGameBoard("right");
                break;
            case key.SPACE:
                if (this.store.gameStatus == GameStatus.Paused) {
                    setGameStatus(GameStatus.InProgress);
                } else {
                    setGameStatus(GameStatus.Paused);
                }
        }
    }

    // Event handle for start touch
    handleTouchStart = (event) => {
        this.initialXPosition = event.changedTouches[0].screenX;
        this.initialYPosition = event.changedTouches[0].screenY;
        this.timeDown = Date.now();
    }

    // Event handler for touch events like swipes(left, right, top and down)
    handleTouchMove = (event) => {
        event.preventDefault();
        if (this.initialXPosition === null) {
            return;
        }
        if (this.initialYPosition === null) {
            return;
        }
        let currentX = event.changedTouches[0].screenX;
        let currentY = event.changedTouches[0].screenY;
        this.diffX = this.initialXPosition - currentX;
        this.diffY = this.initialYPosition - currentY;
        const timeDiff = Date.now() - this.timeDown;

        if (Math.abs(this.diffX) > Math.abs(this.diffY)) {
            // Sliding horizontally
            if (Math.abs(this.diffX) < Constants.DELTA) {
                if (this.diffX > 0) {
                    // swiped left
                    this.updateTetrisGameBoard("left");
                } else {
                    // swiped right
                    this.updateTetrisGameBoard("right");
                }
            }

        } else if (Math.abs(this.diffX) < Math.abs(this.diffY)) {
            // Sliding vertically
            if (timeDiff < Constants.SWIP_DOWN_TIME_THRESHOLD) {
                if (this.diffY < 0) {
                    // swip down
                    this.updateTetrisGameBoard("down");
                }
            }
        }

        this.initialYPosition = null;
        this.diffY = null;
        this.initialXPosition = null;
        this.diffX = null;
    }

    componentDidMount() {
        let timerId;
        // here set Interval is required to update the tetris board with dropping blocks
        timerId = setInterval(
            () => this.updateTetrisGameBoard("down"),
            Constants.GAME_LOWEST_SPEED - (this.store.gameLevel > Constants.MAX_LEVEL ?
                Constants.GAME_HIGHEST_SPEED : this.store.gameLevel * 10)
        );
        updateTimerId(timerId);
        const tetrisElement = document.getElementById("tetrisBoard");
        window.addEventListener("keydown", this.handleKeyDown, false);
        tetrisElement.addEventListener("touchstart", this.handleTouchStart, false);
        tetrisElement.addEventListener("touchmove", this.handleTouchMove, false);
    }

    componentWillUnmount() {
        window.clearInterval(this.store.timerId);
        const tetrisElement = document.getElementById("tetrisBoard");
        window.removeEventListener("keydown", this.handleKeyDown);
        tetrisElement.removeEventListener("touchstart", this.handleTouchStart);
        tetrisElement.removeEventListener("touchmove", this.handleTouchMove);
    }

    /**
     * @description Handles board updates
     * @param {string} command
     * @memberof TetrisGame
     */
    updateTetrisGameBoard(direction: string) {
        // Do nothing if game ends, or is paused or document has no focus or Game Expired
        if (this.store.gameStatus === GameStatus.End ||
            this.store.gameStatus === GameStatus.Paused ||
            this.store.gameStatus === GameStatus.Expired ||
            !document.hasFocus()) {
            return;
        }

        let horizontalMoveCount = 0; // to manage the Left/Right movement block
        let verticalMoveCount = 0; // to manage the down movement of block
        let rotationCount = 0; // to manage the rotation of block
        let activeBlockNumber = this.store.activeBlockNumber;
        const noOfBlock = 4;

        // for left movement, set horizontalMoveCount to -1
        if (direction === "left") {
            horizontalMoveCount = -1;
        }
        // for right movement, set horizontalMoveCount to 1
        if (direction === "right") {
            horizontalMoveCount = 1;
        }
        // for rotation, set rotateAdd to 1
        if (direction === "rotate") {
            rotationCount = 1;
        }
        // If block should fall faster, set verticalMoveCount to 1
        if (direction === "down") {
            verticalMoveCount = 1;
        }

        // Get current x/y coordinates, active block, rotate and all blocks
        let tetrisGameGrid = Utils.cloneDeep(this.store.tetrisGameBoard);
        let xCoordinateOfActiveBlock = this.store.xCoordinateOfActiveBlock;
        let yCoordinateOfActiveBlock = this.store.yCoordinateOfActiveBlock;
        let rotate = this.store.blockRotationNumber;
        const blocks = this.store.blocks;

        // Remove actual block from field to test for new insert position
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] = 0;
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] = 0;
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] = 0;
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] = 0;

        // Check if the move can be executed on actual field
        let horizontalMoveCountIsValid = true;
        const shadowMap = getShadowBlock(tetrisGameGrid);
        // check if block should move horizontally
        if (horizontalMoveCount !== 0) {
            for (let block = 0; block < noOfBlock; block++) {
                // check if block can be moved without getting outside the board
                if (
                    xCoordinateOfActiveBlock + horizontalMoveCount + blocks[activeBlockNumber][rotate][block][0] >= 0
                    && xCoordinateOfActiveBlock + horizontalMoveCount + blocks[activeBlockNumber][rotate][block][0] < Constants.BOARD_WIDTH
                ) {
                    if (tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][block][1]][xCoordinateOfActiveBlock
                        + horizontalMoveCount + blocks[activeBlockNumber][rotate][block][0]] !== 0) {
                        // Prevent the move
                        horizontalMoveCountIsValid = false;
                    }
                } else {
                    // Prevent the move
                    horizontalMoveCountIsValid = false;
                }
            }
        }

        // If horizontal move is valid update x variable (move the block)
        if (horizontalMoveCountIsValid) {
            xCoordinateOfActiveBlock += horizontalMoveCount;
        }

        // Try to rotate the block
        const maximumRotation = 3;
        let newRotate = rotate + rotationCount > maximumRotation ? 0 : rotate + rotationCount;
        let rotateIsValid = true;
        let isLeftTouched = false;
        let isRightTouched = false;


        // Check if block should rotate
        if (rotationCount !== 0) {
            // Check if the Block is touching the left side of the board
            for (let block = 0; block < noOfBlock; block++) {
                if (xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0] == 0) {
                    isLeftTouched = true;
                    break;
                }
            }

            // Check if the Block is touching the right side of the board
            for (let block = 0; block < noOfBlock; block++) {
                if (xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0] == Constants.BOARD_WIDTH) {
                    isRightTouched = true;
                    break;
                }
            }

            for (let block = 0; block < noOfBlock; block++) {
                // Check if block can be rotated without getting outside the board
                if (
                    xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0] >= 0 &&
                    xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0] <= Constants.BOARD_WIDTH &&
                    yCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][1] >= 0 &&
                    yCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][1] <= Constants.BOARD_HEIGHT
                ) {
                    // check if block rotation is not blocked by other blocks
                    if (
                        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][1]]
                        [xCoordinateOfActiveBlock + blocks[activeBlockNumber][newRotate][block][0]] !== 0
                    ) {
                        // Prevent rotation
                        rotateIsValid = false;
                    }
                } else {
                    // Prevent rotation
                    rotateIsValid = false;
                }
            }

            if (isLeftTouched) {
                if (getHeightOfBlock() > getWidthOfBlock()) {
                    rotateIsValid = true;
                    xCoordinateOfActiveBlock += getWidthOfBlock();
                }
            }

            if (isRightTouched) {
                if (getHeightOfBlock() > getWidthOfBlock()) {
                    rotateIsValid = true;
                    xCoordinateOfActiveBlock -= getWidthOfBlock();
                    if (activeBlockNumber == 2) {
                        xCoordinateOfActiveBlock -= 1;
                    }
                }
            }
        }
        // If rotation is valid update rotate variable (rotate the block)
        if (rotateIsValid) {
            rotate = newRotate;
        }
        // Try to speed up the fall of the block
        let verticalMoveCountIsValid = true;

        // check if block should fall faster
        if (verticalMoveCount !== 0) {
            for (let i = 0; i < noOfBlock; i++) {
                // check if block can fall faster without getting outside the board
                if (
                    yCoordinateOfActiveBlock + verticalMoveCount + blocks[activeBlockNumber][rotate][i][1] >= 0 &&
                    yCoordinateOfActiveBlock + verticalMoveCount + blocks[activeBlockNumber][rotate][i][1] < Constants.BOARD_HEIGHT
                ) {
                    // Check if faster fall is not blocked by other blocks
                    if (
                        tetrisGameGrid[yCoordinateOfActiveBlock + verticalMoveCount + blocks[activeBlockNumber][rotate][i][1]][
                        xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][i][0]
                        ] !== 0
                    ) {
                        // Prevent faster fall
                        verticalMoveCountIsValid = false;
                    }
                } else {
                    // Prevent faster fall
                    verticalMoveCountIsValid = false;
                }
            }
        }

        // If speeding up the fall is valid (move the block down faster)
        if (verticalMoveCountIsValid) {
            yCoordinateOfActiveBlock += verticalMoveCount;
        }

        /*
            Render the block at new position
            tetrisGameGrid is n*n matrix and the algorithm is to place the current active block number at perfect place
            to achieve this we are using below variables-
            yCoordinateOfActiveBlock = 5
            xCoordinateOfActiveBlock = 3
            rotate = it's a number which which indicates that how my times the current block has been rotated.
            activeBlockNumber = it's a number which represent the current block number which should be rendered on the tetris game board
            blocks = blocks are basically array of block, current block is being randomly by
            Math.random from 1 - 7, Please check the utils/constant.tsx file for exact  data structure used for the block
            Step:1  Get the collection for active block number - blocks[activeBlockNumber],
            eg- if activeBlockNumber = 4, you will get the below collection
                [[0, 0], [-1, 0], [1, 0], [-1, -1]], => rotation = 0
                [[0, 0], [0, 1], [0, -1], [1, -1]],=> rotation = 1
                [[0, 0], [1, 0], [-1, 0], [1, 1]], => rotation = 2
                [[0, 0], [0, 1], [0, -1], [-1, 1]] =>  rotation = 3

            Step:2 Get the row for the perticular rotation
            eg. for rotate = 0, you will get the below row
            [0, 0], [-1, 0], [1, 0], [-1, -1]
            Step:3 now get the cell positions for the active block number by adding above cell coordinates with xCoordinateOfActiveBlock, yCoordinateOfActiveBlock
            eg. if xCoordinateOfActiveBlock = 5 and yCoordinateOfActiveBlock = 3, you will get the below mappings
            [5,3] [4,3] [6,3] [4,2]
            Step: 4 Assign the above coordinates with the active block number, active block number will be use to render the UI on response view
            eg. tetrisGameGrid[3,5] =  tetrisGameGrid[3,4] = tetrisGameGrid[3,6] = tetrisGameGrid[2,4] = 4
       */
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] = activeBlockNumber;
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] = activeBlockNumber;
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] = activeBlockNumber;
        tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] = activeBlockNumber;

        // If moving down is not possible, remove completed rows add score
        // and find next block and check if game is over
        if (!verticalMoveCountIsValid) {
            for (let row = Constants.BOARD_HEIGHT - 1; row >= 0; row--) {
                let isLineCompleted = true;

                // Check if row is completed
                for (let column = 0; column < Constants.BOARD_WIDTH; column++) {
                    if (tetrisGameGrid[row][column] === 0) {
                        isLineCompleted = false;
                    }
                }

                // Remove completed rows
                if (isLineCompleted) {
                    for (; row > 0; row--) {
                        for (let column = 0; column < Constants.BOARD_WIDTH; column++) {
                            tetrisGameGrid[row][column] = tetrisGameGrid[row - 1][column];
                        }
                    }

                    // Check if the row is the last
                    row = Constants.BOARD_HEIGHT;
                    // update score,  change level
                    // score : current score + increment fector * bonus factore(being decided with game speed/timerId)
                    updateGameScore(this.store.gameScore + Constants.SCORE_INCREMENT_FACTOR * Number(this.store.timerId) / 100);
                    updateGameLevel(this.store.gameLevel + 1);
                }
            }
            // Prepare new timer
            let timerId;
            // Reset the timer
            clearInterval(this.store.timerId);
            // Update new timer, now level will decide the timer
            timerId = setInterval(
                () => this.updateTetrisGameBoard("down"),
                Constants.GAME_LOWEST_SPEED - (this.store.gameLevel > Constants.MAX_LEVEL ?
                    Constants.GAME_HIGHEST_SPEED : this.store.gameLevel * 10)
            );
            // Update timer
            updateTimerId(timerId);
            // Create new Block
            activeBlockNumber = Math.floor(Math.random() * Constants.NUMBER_OF_BLOCK + 1);
            xCoordinateOfActiveBlock = Math.floor(Constants.BOARD_WIDTH / 2) - 1;
            yCoordinateOfActiveBlock = 1;
            rotate = 0;

            // Test if game is over - test if new block can't be placed in field
            if (
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] !== 0 ||
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] !== 0 ||
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] !== 0 ||
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] !== 0
            ) {
                setGameStatus(GameStatus.End);
            } else {
                // Otherwise, render new block and continue
                // Logic is already explained
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][0][0]] = activeBlockNumber;
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][1][0]] = activeBlockNumber;
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][2][0]] = activeBlockNumber;
                tetrisGameGrid[yCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][1]][xCoordinateOfActiveBlock + blocks[activeBlockNumber][rotate][3][0]] = activeBlockNumber;
            }
        }

        // update gameboard, active X and Y coordinates, rotation and active block
        updateTetrisGameBoard(tetrisGameGrid);
        updateXYCoordinateOfActiveBlock(xCoordinateOfActiveBlock, yCoordinateOfActiveBlock);
        updateRotation(rotate);
        updateActiveBlockNumber(activeBlockNumber);
        updateShadowPiece(shadowMap);
    }

    // Render Tetris Header with Play Pause action
    rederPlayPause() {
        return (
            <>
                <div className="tetris-header-box">
                    <p className="tetris-board-text">{Localizer.getString("Score")} {this.store.gameScore}</p>
                    <Reaction tabIndex={1}
                        onClick={
                            () => {
                                if (this.store.gameStatus == GameStatus.Paused) {
                                    setGameStatus(GameStatus.InProgress);
                                } else {
                                    setGameStatus(GameStatus.Paused);
                                }
                            }
                        }
                        icon={this.store.gameStatus === GameStatus.Paused ?
                            <PlayIcon size="large" className="action-button-color" /> :
                            <PauseIcon size="large" className="action-button-color" />
                        }
                    />
                </div>
                <div className="game-clear-both">
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="tetris body-container">
                { this.store.gameStatus === GameStatus.End ?
                    <GameEndView score={this.store.gameScore} onlyOneAttempt={false} /> :
                    <>
                        {this.rederPlayPause()}

                        <Swipe
                            nodeName="tetris"
                            onSwipingLeft={() => { this.updateTetrisGameBoard("left"); }}
                            onSwipingRight={() => { this.updateTetrisGameBoard("right"); }}
                            onSwipingDown={() => { this.updateTetrisGameBoard("down"); }}
                            detectTouch={true}
                            detectMouse={false}
                            delta={Constants.DELTA}
                        >
                            <div id="tetrisBoard" onClick={
                                () => {
                                    if (UxUtils.renderingForMobile()) {
                                        this.updateTetrisGameBoard("rotate");
                                    }
                                }
                            }>
                                <TetrisBoard />
                            </div>
                        </Swipe>
                    </>
                }
            </div>
        );
    }
}

export default TetrisGame;