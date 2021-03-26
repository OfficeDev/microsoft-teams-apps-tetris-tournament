// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Localizer } from "../utils/Localizer";
import {
    initialize,
    setProgressStatus,
    setContext,
    fetchUserDetails,
    fetchMyScore,
    fetchLeaderBoard,
    setGameTitle,
    setGameStatus,
    setLeaderboardVisibilityFlag,
    setDueDate,
    setActionInstance,
    updateDueDate,
    gameExpiryChangeAlertOpen,
    closeGame,
    gameCloseAlertOpen,
    deleteGame,
    gameDeleteAlertOpen
} from "../actions/SummaryActions";
import { orchestrator } from "satcheljs";
import { ProgressState } from "../utils/SharedEnum";
import getStore from "../store/SummaryStore";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";

/**
* initialize(): instance instance to prepare the summary view
*/
orchestrator(initialize, async () => {
    let currentContext = getStore().progressStatus.currentContext;
    if (currentContext == ProgressState.NotStarted || currentContext == ProgressState.Failed) {
        setProgressStatus({ currentContext: ProgressState.InProgress });
        let actionContext = await ActionSdkHelper.getActionContext();
        if (actionContext.success) {
            let context = actionContext.context as actionSDK.ActionSdkContext;
            setContext(context);
            setProgressStatus({ currentContext: ProgressState.Completed });

            setProgressStatus({ actionInstance: ProgressState.InProgress });
            let actionInstance =  await ActionSdkHelper.getAction(context.actionId);
            setProgressStatus({ localizationInstance: ProgressState.InProgress });
            let response = await Localizer.initialize();

            if(actionInstance.success && response) {
                setProgressStatus({ localizationInstance: ProgressState.Completed });
                setActionInstance(actionInstance.action);
                setProgressStatus({ actionInstance: ProgressState.Completed });

                setProgressStatus({ settingInstance: ProgressState.InProgress });
                setGameTitle(actionInstance.action.displayName);
                setDueDate(actionInstance.action.expiryTime);
                setGameStatus(actionInstance.action.status);
                fetchUserDetails([context.userId]);
                setProgressStatus({ settingInstance: ProgressState.Completed });

                setProgressStatus({ myScoreDataInstance: ProgressState.InProgress });
                let myDataRows = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId, actionContext.context.userId);
                if(myDataRows.success) {
                    fetchMyScore(myDataRows.dataRows);
                    setProgressStatus({ myScoreDataInstance: ProgressState.Completed });
                } else {
                    setProgressStatus({ myScoreDataInstance: ProgressState.Failed });
                }

                setProgressStatus({ leaderboardDataAInstance: ProgressState.InProgress });
                let leaderBoardDataRows = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId);
                if(leaderBoardDataRows.success) {
                    fetchLeaderBoard(leaderBoardDataRows.dataRows);
                    setProgressStatus({ leaderboardDataAInstance: ProgressState.Completed });
                } else {
                    setProgressStatus({ leaderboardDataAInstance: ProgressState.Failed });
                }
                setLeaderboardVisibilityFlag();
                setProgressStatus({ currentContext: ProgressState.Completed });
            } else {
                setProgressStatus({ actionInstance: ProgressState.Failed });
                setProgressStatus({ localizationInstance: ProgressState.Failed });
            }
        } else {
            setProgressStatus({ currentContext: ProgressState.Failed });
        }
    }
});

/**
* updateDueDate(): Change the due date of game
*/

orchestrator(updateDueDate, async (actionMessage) => {
    if (getStore().progressStatus.updateActionInstance != ProgressState.InProgress) {
        let callback = (success: boolean) => {
            setProgressStatus({ updateActionInstance: success ? ProgressState.Completed : ProgressState.Failed });
        };
        setProgressStatus({ updateActionInstance: ProgressState.InProgress });
        let actionInstanceUpdateInfo: actionSDK.ActionUpdateInfo = {
            id: getStore().context.actionId,
            version: getStore().actionInstance.version,
            expiryTime: actionMessage.dueDate
        };
        try {
            let updateActionInstance = await ActionSdkHelper.updateActionInstance(actionInstanceUpdateInfo);
            if (updateActionInstance.success) {
                callback(true);
                gameExpiryChangeAlertOpen(false);
            } else {
                callback(false);
            }
        } catch (error) {
            callback(false);
        }
    }
});

/**
* closeGamey(): Close the game. Sbuscribers will no longer able to respond.
* This is available only for the creator of game
*/
orchestrator(closeGame, async () => {
    if (getStore().progressStatus.closeActionInstance != ProgressState.InProgress) {
        let failedCallback = () => {
            setProgressStatus({ closeActionInstance: ProgressState.Failed });
        };

        setProgressStatus({ closeActionInstance: ProgressState.InProgress });
        let actionInstanceUpdateInfo: actionSDK.ActionUpdateInfo = {
            id: getStore().context.actionId,
            version: getStore().actionInstance.version,
            status: actionSDK.ActionStatus.Closed
        };
        try {
            let updateActionInstance = await ActionSdkHelper.updateActionInstance(actionInstanceUpdateInfo);
            if (updateActionInstance.success) {
                gameCloseAlertOpen(false);
                await ActionSdkHelper.closeView();
            } else {
                failedCallback();
            }
        } catch (error) {
            failedCallback();
        }
    }
});

/**
* deleteGame(): Delete the game. This is available only for the creator of game
*/
orchestrator(deleteGame, async () => {
    if (getStore().progressStatus.deleteActionInstance != ProgressState.InProgress) {
        let failedCallback = () => {
            setProgressStatus({ deleteActionInstance: ProgressState.Failed });
        };

        setProgressStatus({ deleteActionInstance: ProgressState.InProgress });
        try {
            let deleteInstance = await ActionSdkHelper.deleteActionInstance(getStore().context.actionId);
            if (deleteInstance.success) {
                gameDeleteAlertOpen(false);
                await ActionSdkHelper.closeView();
            } else {
                failedCallback();
            }
        } catch (error) {
            failedCallback();
        }
    }
});
