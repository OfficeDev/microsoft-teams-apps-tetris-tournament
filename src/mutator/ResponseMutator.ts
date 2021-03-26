// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mutator } from "satcheljs";
import getStore from "../store/ResponseStore";
import {
    setContext,
    shouldValidateUI,
    setProgressState,
    setActionInstance,
    fetchActionInstanceRowsForCurrentUser,
    updateTimerId,
    updateTetrisGameBoard,
    updateShadowPiece,
    updateGameScore,
    updateRotation,
    updateXYCoordinateOfActiveBlock,
    updateGameLevel,
    updateActiveBlockNumber,
    updatedInstructionPageView,
    setGameStatus
} from "../actions/ResponseAction";
import * as actionSDK from "@microsoft/m365-action-sdk";

/**
 * Update view mutators to modify store data on which update view relies
 */
mutator(setProgressState, (msg) => {
    const store = getStore();
    store.progressState = {
        ...getStore().progressState,
        ...msg.status,
    };
});

mutator(setContext, (msg) => {
    const store = getStore();
    let context: actionSDK.ActionSdkContext = msg.context;
    store.context = context;
});

mutator(setActionInstance, (msg) => {
    const store = getStore();
    store.actionInstance = msg.actionInstance;
});

mutator(fetchActionInstanceRowsForCurrentUser, (msg) => {
    const store = getStore();
    store.actionInstanceRowsForCurrentUser = msg.actionInstanceRow;
    if(store.actionInstanceRowsForCurrentUser.length > 0) {
        store.playerPrevScore = store.actionInstanceRowsForCurrentUser[0].columnValues["1"];
        const isMultiPlayAllowed = store.actionInstance.dataTables[0].canUserAddMultipleRows;
        if(isMultiPlayAllowed) {
            store.shouldPlayerPlay = true;
        } else {
            store.shouldPlayerPlay = false;
        }
    } else {
        store.shouldPlayerPlay = true;
    }
});

mutator(shouldValidateUI, (msg) => {
    const store = getStore();
    store.shouldValidate = msg.shouldValidate;
});

mutator(setGameStatus, (msg) => {
    const store = getStore();
    store.gameStatus = msg.status;
});

mutator(updateTimerId, (msg) => {
    const store = getStore();
    store.timerId = msg.id;
});

mutator(updateTetrisGameBoard, (msg) => {
    const store = getStore();
    store.tetrisGameBoard = msg.board;
});

mutator(updateShadowPiece, (msg) => {
    const store = getStore();
    store.shadowPiece = msg.piece;
});

mutator(updateGameScore, (msg) => {
    const store = getStore();
    store.gameScore = msg.score;
});

mutator(updateRotation, (msg) => {
    const store = getStore();
    store.blockRotationNumber = msg.rotation;
});

mutator(updateXYCoordinateOfActiveBlock, (msg) => {
    const store = getStore();
    store.xCoordinateOfActiveBlock = msg.xCoordinate;
    store.yCoordinateOfActiveBlock = msg.yCoordinate;
});

mutator(updateGameLevel, (msg) => {
    const store = getStore();
    store.gameLevel = msg.level;
});

mutator(updateActiveBlockNumber, (msg) => {
    const store = getStore();
    store.activeBlockNumber = msg.blockNumber;
});

mutator(updatedInstructionPageView, () => {
    const store = getStore();
    store.isGameInstructionPageVisible = !store.isGameInstructionPageVisible;
});
