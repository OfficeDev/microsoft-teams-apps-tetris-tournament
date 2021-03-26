// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as actionSDK from "@microsoft/m365-action-sdk";
import { Constants } from "../utils/Constants";
import { Logger } from "./../utils/Logger";
export class ActionSdkHelper {

    /**
     * API to fetch current action context
     */
    public static async getActionContext() {
        let request = new actionSDK.GetContext.Request();
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetContext.Response;
            Logger.logInfo(`fetchCurrentContext success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, context: response.context };
        } catch (error) {
            Logger.logError(`fetchCurrentContext failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /**
     * API to fetch current user details
     */
    public static async getCurrentUser() {
        const actionContext = (await this.getActionContext()).context;
        let request = new actionSDK.GetSubscriptionMembers.Request(actionContext.subscription, [actionContext.userId]);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetSubscriptionMembers.Response;
            return { success: true, userId: response.members[0].id, userName: response.members[0].displayName };
        } catch (error) {
            return { success: false, error: error };
        }
    }

    /*
    * @desc Service Request to create new Action Instance
    * @param {actionSDK.Action} action instance which need to get created
    */
    public static async createActionInstance(action: actionSDK.Action) {
        let request = new actionSDK.CreateAction.Request(action);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetContext.Response;
            Logger.logInfo(`createActionInstance success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
        } catch (error) {
            Logger.logError(`createActionInstance failed, Error: ${error.category}, ${error.code}, ${error.message}`);
        }
    }

    /**
     * Function to get for data rows
     * @param actionId action instance id
     * @param createrId created id
     * @param continuationToken
     * @param pageSize
     */
    public static async getActionDataRows(actionId: string, creatorId?: string, continuationToken?: string, pageSize?: number) {
        let request = new actionSDK.GetActionDataRows.Request(actionId, creatorId, continuationToken, pageSize);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetActionDataRows.Response;
            Logger.logInfo(`getActionDataRows success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, dataRows: response.dataRows, continuationToken: response.continuationToken };
        } catch (error) {
            Logger.logError(`getActionDataRows failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /*
    * @desc Service API Request for fetching action instance
    * @param {actionId} action id for which we want to get details
    */
    public static async getAction(actionId?: string) {
        let request = new actionSDK.GetAction.Request(actionId);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetAction.Response;
            Logger.logInfo(`getAction success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, action: response.action };
        } catch (error) {
            Logger.logError(`getAction failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /**
     * Funtion to get action data summary
     * @param actionId action id
     * @param addDefaultAggregates
     */
    public static async getActionDataRowsSummary(actionId: string, addDefaultAggregates?: boolean) {
        let request = new actionSDK.GetActionDataRowsSummary.Request(actionId, addDefaultAggregates);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetActionDataRowsSummary.Response;
            Logger.logInfo(`getActionDataRowsSummary success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, summary: response.summary };
        } catch (error) {
            Logger.logError(`getActionDataRowsSummary failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /**
     * Method to get details of member of subscription
     * @param subscription subscription
     * @param userId user id to get details
     */
    public static async getSubscriptionMembers(subscription, userIds) {
        let request = new actionSDK.GetSubscriptionMembers.Request(subscription, userIds);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetSubscriptionMembers.Response;
            Logger.logInfo(`getSubscriptionMembers success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, members: response.members, memberIdsNotFound: response.memberIdsNotFound };
        } catch (error) {
            Logger.logError(`getSubscriptionMembers failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /**
     * Method to update action instance data
     * @param data object of data we want modify
     */
    public static async updateActionInstance(actionUpdateInfo: actionSDK.ActionUpdateInfo) {
        let request = new actionSDK.UpdateAction.Request(actionUpdateInfo);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.UpdateAction.Response;
            Logger.logInfo(`updateActionInstance success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, updateSuccess: response.success };
        } catch (error) {
            Logger.logError(`updateActionInstance failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /**
      * Method to update the data row
      * @param dataRow action data row
      */
    public static async addDataRow(dataRow: actionSDK.ActionDataRow) {
        let request = new actionSDK.AddActionDataRow.Request(dataRow);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.AddActionDataRow.Response;
            Logger.logInfo(`addDataRow success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, updateSuccess: response.success };
        } catch (error) {
            Logger.logError(`addDataRow failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /**
     * Method to add the score
     * @param score game score
     */
    public static async addScore(score: string) {
        const actionContext = (await this.getActionContext()).context;
        let data = {
            0: Date.now().toString(),
            1: score,
            2: (await this.getCurrentUser()).userName,
        };
        let actiondata: actionSDK.ActionDataRow = {
            dataTableName: Constants.GAME_DATA_TABLE_NAME,
            actionId: actionContext.actionId,
            columnValues: data,
            createTime: Date.now()
        };

        try {
            let response = await this.addDataRow(actiondata);
            Logger.logInfo(`addScore success - Request: ${JSON.stringify(actiondata)} Response: ${JSON.stringify(response)}`);
            return { success: true, response: response.success };

        } catch (error) {
            Logger.logInfo(`addScore failed - Request: ${error.category}, ${error.code}, ${error.message}`);
            return { success: true, error: error };
        }

    }

    // Helper method to fetch the scores for the current context
    public static async getScore() {
        const actionContext = (await this.getActionContext()).context;
        let request = new actionSDK.GetActionDataRows.Request(actionContext.actionId, null, null, 100, Constants.GAME_DATA_TABLE_NAME);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetActionDataRows.Response;
            Logger.logInfo(`getScore success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, status: response.success, dataRows: response.dataRows };
        } catch (error) {
            Logger.logError(`getScore failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }
    /**
     * API to close current view
     */
    public static async closeView() {
        let closeViewRequest = new actionSDK.CloseView.Request();
        await actionSDK.executeApi(closeViewRequest);
    }

    /**
     * Method to delete action instance
     * @param actionId action instance id
     */
    public static async deleteActionInstance(actionId) {
        let request = new actionSDK.DeleteAction.Request(actionId);
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.DeleteAction.Response;
            Logger.logInfo(`deleteActionInstance success - Request: ${JSON.stringify(request)} Response: ${JSON.stringify(response)}`);
            return { success: true, deleteSuccess: response.success };
        } catch (error) {
            Logger.logError(`deleteActionInstance failed, Error: ${error.category}, ${error.code}, ${error.message}`);
            return { success: false, error: error };
        }
    }

    /*
    * @desc Gets the localized strings in which the app is rendered
    */
    public static async getLocalizedStrings() {
        let request = new actionSDK.GetLocalizedStrings.Request();
        try {
            let response = await actionSDK.executeApi(request) as actionSDK.GetLocalizedStrings.Response;
            return { success: true, strings: response.strings };
        } catch (error) {
            Logger.logError(`fetchLocalization failed, Error: ${error.category}, ${error.code}, ${error.message}`);
        }
    }

    /**
     * Method to hide loading indicater
     */
    public static hideLoadingIndicator() {
        actionSDK.executeApi(new actionSDK.HideLoadingIndicator.Request());
    }
}
