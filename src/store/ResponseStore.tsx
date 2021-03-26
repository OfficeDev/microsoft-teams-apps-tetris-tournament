// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import "../mutator/ResponseMutator";
import "../orchestrators/ResponseOrchestrator";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ProgressState } from "../utils/SharedEnum";
import { Constants } from "../utils/Constants";
import { initializeGameBoard } from "../components/Response/GameUtils/TetrisUtils";

/**
 * Response store containing all data required when user play the game.
 */

// This represents the various stages of Tetris game in response view
export enum GameStatus {
    NotStarted,
    InProgress,
    End,
    Paused,
    Expired
}

export interface ResponseProgressStatus {
    actionInstance: ProgressState;
    currentContext: ProgressState;
    settingInstance: ProgressState;
    currentUserDataInstance: ProgressState;
    localizationInstance: ProgressState;
    addScoreInstance: ProgressState;
}

interface IGameResponseStore {
    context: actionSDK.ActionSdkContext;
    actionInstance: actionSDK.Action;
    actionInstanceRowsForCurrentUser: actionSDK.ActionDataRow[];
    shouldValidate: boolean;
    progressState: ResponseProgressStatus;
    isActionDeleted: boolean;
    shouldPlayerPlay: boolean; // Flag to check if an user is allowed to play the game or not
    playerPrevScore: string; // user's privous match score
    playerCurrentScore: number;
    gameStatus: GameStatus; // This represents the various stages of Tetris game in response view
    xCoordinateOfActiveBlock: number;  // X value from the top left corner
    yCoordinateOfActiveBlock: number; // Y value from the top left corner
    activeBlockNumber: number; // reresents a number
    blockRotationNumber: number;
    gameScore: number;
    gameLevel: number; // game level represents the level of the game in terms of cleared number of rows
    blockCount: number; // represents number of blocks which has been placed in the game board
    tetrisGameBoard: number[][]; // this represents the
    timerId: number;
    blocks: number[][][][]; // collection of all the seven blocks(square, I(2), L(2), Z(2)) which we are supporting for this game
    shadowPiece: any[]; // It carries the projection/shadow coordinates of the active blocks
    isGameInstructionPageVisible: boolean;
}

const store: IGameResponseStore = {
    context: null,
    shouldValidate: false,
    actionInstance: null,
    actionInstanceRowsForCurrentUser: null,
    progressState: {
        actionInstance: ProgressState.NotStarted,
        currentContext: ProgressState.NotStarted,
        settingInstance: ProgressState.NotStarted,
        currentUserDataInstance: ProgressState.NotStarted,
        localizationInstance: ProgressState.NotStarted,
        addScoreInstance: ProgressState.NotStarted
    },
    isActionDeleted: false,
    shouldPlayerPlay: true,
    playerPrevScore: null,
    playerCurrentScore: 0,
    gameStatus: GameStatus.NotStarted,
    xCoordinateOfActiveBlock: Math.floor(Constants.BOARD_WIDTH / 2) - 1,
    yCoordinateOfActiveBlock: 2,
    activeBlockNumber: Math.floor(Math.random() * Constants.NUMBER_OF_BLOCK + 1),
    blockRotationNumber: 0,
    gameLevel: 1,
    gameScore: 0,
    blockCount: 0,
    blocks: Constants.BLOCKS,
    shadowPiece: null,
    tetrisGameBoard: initializeGameBoard(),
    timerId: 0,
    isGameInstructionPageVisible: false,
};

export default createStore<IGameResponseStore>("ResponseStore", store);