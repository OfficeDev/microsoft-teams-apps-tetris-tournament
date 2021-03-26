// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { orchestrator } from "satcheljs";
import {
    initialize,
    setContext,
    setActionInstance,
    fetchActionInstanceRowsForCurrentUser,
    setProgressState,
    addScore,
    addScoreForSinglePlay
} from "../actions/ResponseAction";
import { Localizer } from "../utils/Localizer";
import { ProgressState } from "../utils/SharedEnum";
import { ActionSdkHelper } from "../helper/ActionSdkHelper";

/**
 * initialize(): instance of response view fetching action context, localization and setting details
*/
orchestrator(initialize, async () => {
    setProgressState({ currentContext: ProgressState.InProgress });
    setProgressState({ settingInstance: ProgressState.InProgress });
    let actionContext = await ActionSdkHelper.getActionContext();
    if (actionContext.success) {
        setContext(actionContext.context);
        setProgressState({ currentContext: ProgressState.Completed });

        setProgressState({ actionInstance: ProgressState.InProgress });
        setProgressState({ localizationInstance: ProgressState.InProgress });
        let actionInstance = await ActionSdkHelper.getAction(actionContext.context.actionId);
        let localizer = await Localizer.initialize();
        if (localizer && actionInstance.success) {
            setProgressState({ localizationInstance: ProgressState.Completed });

            setActionInstance(actionInstance.action);
            setProgressState({ actionInstance: ProgressState.Completed });

            setProgressState({ currentUserDataInstance: ProgressState.InProgress });
            const dataRow = await ActionSdkHelper.getActionDataRows(actionContext.context.actionId, actionContext.context.userId);
            if(dataRow.success) {

                fetchActionInstanceRowsForCurrentUser(dataRow.dataRows);
                setProgressState({ currentUserDataInstance: ProgressState.Completed });

            } else {
                setProgressState({ currentUserDataInstance: ProgressState.Failed });
            }
        } else {
            setProgressState({ localizationInstance: ProgressState.Failed });
            setProgressState({ currentContext: ProgressState.Failed });
        }
    } else {
        setProgressState({ currentContext: ProgressState.Failed });
    }
    setProgressState({ settingInstance: ProgressState.Completed });
});

/**
 * addScore(): add score and close the view
 */
orchestrator(addScore, async (msg) => {
    setProgressState({ addScoreInstance: ProgressState.InProgress });
    let response = await ActionSdkHelper.addScore(msg.score);
    if (response.success) {
        setProgressState({ addScoreInstance: ProgressState.Completed });
        await ActionSdkHelper.closeView();
    } else {
        setProgressState({ addScoreInstance: ProgressState.Failed });
    }
});

/**
 * addScoreForSinglePlay(): add score to data table for single response card
 */
orchestrator(addScoreForSinglePlay, async (msg) => {
    setProgressState({ addScoreInstance: ProgressState.InProgress });
    let response = await ActionSdkHelper.addScore(msg.score);
    if (response.success) {
        setProgressState({ addScoreInstance: ProgressState.Completed });
    } else {
        setProgressState({ addScoreInstance: ProgressState.Failed });
    }
});
