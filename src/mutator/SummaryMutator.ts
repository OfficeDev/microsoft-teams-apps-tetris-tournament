// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mutator } from "satcheljs";
import getStore, { LeaderBoard } from "./../store/SummaryStore";
import {
    setProgressStatus,
    setContext,
    setDueDate,
    setGameTitle,
    showMoreOptions,
    setActionInstance,
    fetchMyScore,
    fetchLeaderBoard,
    setGameStatus,
    setLeaderboardVisibilityFlag,
    setIsActionDeleted,
    gameCloseAlertOpen,
    gameExpiryChangeAlertOpen,
    gameDeleteAlertOpen,
    updateActionInstance,
    updateLeaderBoardRowCount,
    updateScoreBoardRowCount
} from "./../actions/SummaryActions";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { UxUtils } from "../utils/UxUtils";

/**
 * Summary view mutators to modify store data on which summmary view relies
 */

mutator(setProgressStatus, (msg) => {
    const store = getStore();
    store.progressStatus = {
        ...getStore().progressStatus,
        ...msg.status,
    };
});

mutator(setContext, (msg) => {
    const store = getStore();
    store.context = msg.context;
    store.local = msg.context.locale;
});

mutator(setActionInstance, (msg) => {
    const store = getStore();
    store.actionInstance = msg.actionInstance;
});

mutator(setDueDate, (msg) => {
    const store = getStore();
    store.dueDate = msg.date;
});

mutator(setGameTitle, (msg) => {
    const store = getStore();
    store.title = msg.title;
});

mutator(setGameStatus, (msg) => {
    const store = getStore();
    store.isGameExpired = msg.status === actionSDK.ActionStatus.Active ? false : true;
});

mutator(setLeaderboardVisibilityFlag, () => {
    const store = getStore();
    if (store.context && store.actionInstance) {
        const creatorId = store.actionInstance.creatorId;
        const currentUserId = store.context.userId;
        const datarowVisibility = store.actionInstance.dataTables[0].rowsVisibility;
        if (creatorId === currentUserId || datarowVisibility === actionSDK.Visibility.All) {
            getStore().isLeaderBoardVisible = true;
        } else {
            getStore().isLeaderBoardVisible = false;
        }
    }
});

mutator(fetchMyScore, (msg) => {

    let rows: actionSDK.ActionDataRow[] = msg.myScore;
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    if (rows && rows.length > 0) {
        rows.forEach(element => {
            getStore().scoreBoard.push(
                {
                    score: element.columnValues["1"],
                    timeStamp: UxUtils.formatDate(new Date(element.createTime), getStore().actionInstance.customProperties[0].value, options)
                }
            );
        });
    }
});

mutator(fetchLeaderBoard, (msg) => {
    let rows: actionSDK.ActionDataRow[] = msg.scores;
    let newRows: LeaderBoard[] = [];
    if (rows && rows.length > 0) {
        rows.forEach(element => {
            const player = newRows.find(p => p.playerId === element.creatorId);
            if (player) {
                if (Number(element.columnValues["1"]) > Number(player.score)) {
                    newRows.find(p => p.playerId === element.creatorId).score = element.columnValues["1"];
                }
            } else {
                newRows.push(
                    {
                        playerId: element.creatorId,
                        playerName: element.columnValues["2"],
                        score: element.columnValues["1"],
                    }
                );
            }
        });

        getStore().leaderBoard = newRows.sort(function (a, b) {
            return Number(b.score) - Number(a.score);
        });
    }
});

mutator(showMoreOptions, (msg) => {
    const store = getStore();
    store.showMoreOptionsList = msg.showMoreOptions;
});

mutator(updateActionInstance, (msg) => {
    const store = getStore();
    store.actionInstance = msg.actionInstance;
    store.dueDate = msg.actionInstance.expiryTime;
});

mutator(gameCloseAlertOpen, (msg) => {
    const store = getStore();
    store.isGameCloseBoxOpen = msg.open;
});

mutator(gameExpiryChangeAlertOpen, (msg) => {
    const store = getStore();
    store.isChangeExpiryBoxOpen = msg.open;
});

mutator(gameDeleteAlertOpen, (msg) => {
    const store = getStore();
    store.isDeleteGameBoxOpen = msg.open;
});

mutator(setIsActionDeleted, (msg) => {
    const store = getStore();
    store.isActionDeleted = msg.isActionDeleted;
});

mutator(updateScoreBoardRowCount, (msg) => {
    const store = getStore();
    store.scoreBoardRowCount = msg.count;
});

mutator(updateLeaderBoardRowCount, (msg) => {
    const store = getStore();
    store.leaderBoardRowCount = msg.count;
});
