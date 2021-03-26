// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mutator } from "satcheljs";
import {
    setContext,
    setSendingFlag,
    updateTitle,
    updateSettings,
    shouldValidateUI,
    setProgressState,
    validateGameTitle
} from "./../actions/CreationActions";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Utils } from "../utils/Utils";
import getStore from "../store/CreationStore";

/**
 * Creation view mutators to modify store data on which create view relies
 */

mutator(setContext, (msg) => {
    const store = getStore();
    store.context = msg.context;
    if (!Utils.isEmpty(store.context.lastSessionData)) {
        const lastSessionData = store.context.lastSessionData;
        const actionInstance: actionSDK.Action = lastSessionData.action;
        getStore().title = actionInstance.displayName;
        getStore().settings.resultVisibility = (actionInstance.dataTables[0].rowsVisibility === actionSDK.Visibility.Sender) ?
            true : false;
        getStore().settings.isMultiResponseAllowed = actionInstance.dataTables[0].canUserAddMultipleRows;
        getStore().settings.dueDate = actionInstance.expiryTime;
        getStore().settings.locale = msg.context.locale;
    }
});

mutator(setSendingFlag, () => {
    const store = getStore();
    store.sendingAction = true;
});

mutator(shouldValidateUI, (msg) => {
    const store = getStore();
    store.shouldValidate = msg.shouldValidate;
});

mutator(updateTitle, (msg) => {
    const store = getStore();
    store.title = msg.title;
});

mutator(updateSettings, (msg) => {
    const store = getStore();
    store.settings = msg.settingProps;
});

mutator(setProgressState, (msg) => {
    const store = getStore();
    store.progressState = msg.state;
});

mutator(validateGameTitle, (msg) => {
    const store = getStore();
    if(msg.title.length > 0) {
        store.isValidGameTitle = true;
    } else {
        store.isValidGameTitle = false;
    }
});
