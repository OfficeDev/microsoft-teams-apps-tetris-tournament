// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createStore } from "satcheljs";
import * as actionSDK from "@microsoft/m365-action-sdk";
import { Utils } from "../utils/Utils";
import { IGameCreationComponentProps } from "../components/Creation/GameCreationView";
import { ProgressState } from "./../utils/SharedEnum";
import "./../orchestrators/CreationOrchestrator";
import "./../mutator/CreationMutator";

/**
 * Creation store containing all data required for creation view
 */
interface IGameCreationStore {
    context: actionSDK.ActionSdkContext;
    progressState: ProgressState;
    title: string;
    settings: IGameCreationComponentProps;
    shouldValidate: boolean;
    sendingAction: boolean;
    isValidGameTitle: boolean;
}

const store: IGameCreationStore = {
    context: null,
    title: "",
    settings: {
        resultVisibility: false,
        dueDate: Utils.getDefaultExpiry(7).getTime(),
        isMultiResponseAllowed: true,
        strings: null,
    },
    shouldValidate: false,
    sendingAction: false,
    progressState: ProgressState.NotStarted,
    isValidGameTitle: true
};

export default createStore<IGameCreationStore>("cerationStore", store);
