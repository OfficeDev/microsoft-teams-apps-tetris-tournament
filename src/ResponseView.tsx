// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import * as ReactDom from "react-dom";
import GamePage from "./components/Response/GamePage";
import { initialize } from "./actions/ResponseAction";
import { ActionRootView } from "./components/ActionRootView";

initialize();
ReactDom.render(
    <ActionRootView>
        <GamePage />
    </ActionRootView>,
    document.getElementById("root"));
