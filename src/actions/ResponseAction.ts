// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { GameStatus, ResponseProgressStatus } from "../store/ResponseStore";

export enum GameResponseAction {
    initialize = "initialize",
    setContext = "setContext",
    setActionInstance = "setActionInstance",
    fetchActionInstance = "fetchActionInstance",
    fetchActionInstanceRowsForCurrentUser = "fetchActionInstanceRowsForCurrentUser",
    shouldValidateUI = "shouldValidateUI",
    setSendingFlag = "setSendingFlag",
    setProgressState = "setProgressState",
    setIsActionDeleted = "setIsActionDeleted",
    setPreviousScore = "setPreviousScore",
    addScore = "addScore",
    addScoreForSinglePlay = "addScoreForSinglePlay",
    setShouldPlayerPlay = "setShouldPlayerPlay",
    updateGameScore = "updateGameScore",
    updateShadowPiece = "updateShadowPiece",
    updateTimerId = "updateGameStatus",
    updateTetrisGameBoard = "updateTetrisGameBoard",
    updateRotation = "updateRotation",
    updateActiveBlockNumber = "updateActiveBlockNumber",
    updateXYCoordinateOfActiveBlock = "updateXYCoordinateOfActiveBlock",
    updateGameLevel = "updateGameLevel",
    updatedInstructionPageView = "updatedInstructionPageView",
    setGameStatus = "setGameStatus"
}

export let initialize = action(GameResponseAction.initialize);

export let setContext = action(GameResponseAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let setActionInstance = action(GameResponseAction.setActionInstance, (actionInstance: actionSDK.Action) => ({
    actionInstance: actionInstance
}));

export let setShouldPlayerPlay = action(GameResponseAction.setShouldPlayerPlay);
export let setPreviousScore = action(GameResponseAction.setPreviousScore);

export let fetchActionInstanceRowsForCurrentUser = action(GameResponseAction.fetchActionInstanceRowsForCurrentUser, (actionInstanceRow: actionSDK.ActionDataRow[]) => ({
    actionInstanceRow: actionInstanceRow
}));

export let shouldValidateUI = action(GameResponseAction.shouldValidateUI, (shouldValidate: boolean) => ({
    shouldValidate: shouldValidate
}));

export let setSendingFlag = action(GameResponseAction.setSendingFlag, (value: boolean) => ({
    value: value
}));

export let setProgressState = action(GameResponseAction.setProgressState, (status: Partial<ResponseProgressStatus>) => ({
    status: status
}));

export let setIsActionDeleted = action(GameResponseAction.setIsActionDeleted, (value: boolean) => ({
    value: value
}));

export let addScore = action(GameResponseAction.addScore, (score: string) => ({
    score: score
}));

export let addScoreForSinglePlay = action(GameResponseAction.addScoreForSinglePlay, (score: string) => ({
    score: score
}));

export let updateTimerId = action(GameResponseAction.updateTimerId, (id: any) => ({
    id: id
}));

export let updateTetrisGameBoard = action(GameResponseAction.updateTetrisGameBoard, (board: any[]) => ({
    board: board
}));

export let updateShadowPiece = action(GameResponseAction.updateShadowPiece, (piece: any[]) => ({
    piece: piece
}));

export let updateGameScore = action(GameResponseAction.updateGameScore, (score: number) => ({
    score: score
}));

export let updateRotation = action(GameResponseAction.updateRotation, (rotation: number) => ({
    rotation: rotation
}));

export let updateActiveBlockNumber = action(GameResponseAction.updateActiveBlockNumber, (blockNumber: number) => ({
    blockNumber: blockNumber
}));

export let updateXYCoordinateOfActiveBlock = action(GameResponseAction.updateXYCoordinateOfActiveBlock,
    (xCoordinate: number, yCoordinate: number) => ({
        xCoordinate: xCoordinate,
        yCoordinate: yCoordinate
    }));

export let updateGameLevel = action(GameResponseAction.updateGameLevel, (level: number) => ({
    level: level
}));

export let updatedInstructionPageView = action(GameResponseAction.updatedInstructionPageView);

export let setGameStatus = action(GameResponseAction.setGameStatus, (status: Partial<GameStatus>) => ({
    status: status
}));
