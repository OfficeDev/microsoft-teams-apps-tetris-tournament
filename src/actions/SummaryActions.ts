// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { action } from "satcheljs";
import { SummaryProgressStatus } from "../store/SummaryStore";
import * as actionSDK from "@microsoft/m365-action-sdk";

export enum GameSummaryAction {
    initialize = "initialize",
    setContext = "setContext",
    setDueDate = "setDueDate",
    setGameTitle = "SetGameTitle",
    showMoreOptions = "showMoreOptions",
    setProgressStatus = "setProgressStatus",
    goBack = "goBack",
    fetchUserDetails = "fetchUserDetails",
    fetchActionInstanceRows = "fetchActionInstanceRows",
    fetchActionInstanceSummary = "fetchActionInstanceSummary",
    fetchLocalization = "fetchLocalization",
    setActionInstance = "setActionInstance",
    fetchMyScore = "fetchMyScore",
    fetchLeaderBoard = "fetchLeaderBoard",
    setGameStatus = "setGameStatus",
    setLeaderboardVisibilityFlag = "setLeaderboardVisibilityFlag",
    setIsActionDeleted = "setIsActionDeleted",
    gameCloseAlertOpen = "gameCloseAlertOpen",
    gameExpiryChangeAlertOpen = "gameExpiryChangeAlertOpen",
    gameDeleteAlertOpen = "gameDeleteAlertOpen",
    updateDueDate = "updateDueDate",
    closeGame = "closeGame",
    deleteGame = "deleteGame",
    updateActionInstance = "updateActionInstance",
    updateScoreBoardRowCount = "updateScoreBoardRowCount",
    updateLeaderBoardRowCount = "updateLeaderBoardRowCount"
}

export let initialize = action(GameSummaryAction.initialize);

export let fetchUserDetails = action(GameSummaryAction.fetchUserDetails, (userIds: string[]) => ({
    userIds: userIds
}));

export let setGameStatus = action(GameSummaryAction.setGameStatus, (status: actionSDK.ActionStatus) => ({
    status: status
}));

export let setLeaderboardVisibilityFlag = action(GameSummaryAction.setLeaderboardVisibilityFlag);

export let fetchActionInstanceRows = action(GameSummaryAction.fetchActionInstanceRows);

export let fetchMyScore = action(GameSummaryAction.fetchMyScore, (myScore: actionSDK.ActionDataRow[]) => ({
    myScore: myScore
}));

export let fetchLeaderBoard = action(GameSummaryAction.fetchLeaderBoard, (scores: actionSDK.ActionDataRow[]) => ({
    scores: scores
}));

export let fetchLocalization = action(GameSummaryAction.fetchLocalization);

export let setProgressStatus = action(GameSummaryAction.setProgressStatus, (status: Partial<SummaryProgressStatus>) => ({
    status: status
}));

export let setContext = action(GameSummaryAction.setContext, (context: actionSDK.ActionSdkContext) => ({
    context: context
}));

export let setDueDate = action(GameSummaryAction.setDueDate, (date: number) => ({
    date: date
}));

export let setGameTitle = action(GameSummaryAction.setGameTitle, (title: string) => ({
    title: title
}));

export let showMoreOptions = action(GameSummaryAction.showMoreOptions, (showMoreOptions: boolean) => ({
    showMoreOptions: showMoreOptions
}));

export let setActionInstance = action(GameSummaryAction.setActionInstance, (actionInstance: actionSDK.Action) => ({
    actionInstance: actionInstance
}));

export let gameCloseAlertOpen = action(GameSummaryAction.gameCloseAlertOpen, (open: boolean) => ({
    open: open
}));

export let gameExpiryChangeAlertOpen = action(GameSummaryAction.gameExpiryChangeAlertOpen, (open: boolean) => ({
    open: open
}));

export let gameDeleteAlertOpen = action(GameSummaryAction.gameDeleteAlertOpen, (open: boolean) => ({
    open: open
}));

export let setIsActionDeleted = action(GameSummaryAction.setIsActionDeleted, (isActionDeleted: boolean) => ({
    isActionDeleted: isActionDeleted
}));

export let updateDueDate = action(GameSummaryAction.updateDueDate, (dueDate: number) => ({
    dueDate: dueDate
}));

export let closeGame = action(GameSummaryAction.closeGame);

export let deleteGame = action(GameSummaryAction.deleteGame);

export let updateActionInstance = action(GameSummaryAction.updateActionInstance, (actionInstance: actionSDK.Action) => ({
    actionInstance: actionInstance
}));

export let updateScoreBoardRowCount = action(GameSummaryAction.updateScoreBoardRowCount, (count: number) => ({
    count: count
}));

export let updateLeaderBoardRowCount = action(GameSummaryAction.updateLeaderBoardRowCount, (count: number) => ({
    count: count
}));
