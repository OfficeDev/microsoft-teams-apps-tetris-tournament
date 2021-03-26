// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import {
    callActionInstanceCreationAPI,
    updateSettings,
    validateGameTitle
} from "./../../actions/CreationActions";
import "./CreationPage.scss";
import "./GameCreationView.scss";
import getStore from "./../../store/CreationStore";
import { observer } from "mobx-react";
import { Flex, FlexItem, Button, Loader } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { ProgressState } from "./../../utils/SharedEnum";
import { ErrorView } from "../ErrorView";
import { UxUtils } from "./../../utils/UxUtils";
import {
    GameCreationView,
    IGameCreationComponentProps,
    IGameCreationComponentStrings
} from "./GameCreationView";
import { Constants } from "./../../utils/Constants";
import { ActionSdkHelper } from "../../helper/ActionSdkHelper";

/**
 * <CreationPage> component for create view of game app
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export default class CreationPage extends React.Component<any> {

    render() {
        let progressState = getStore().progressState;
        if (progressState === ProgressState.NotStarted || progressState === ProgressState.InProgress) {
            return <Loader />;
        } else if (progressState === ProgressState.Failed) {
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <ErrorView
                    title={Localizer.getString("GenericError")}
                    buttonTitle={Localizer.getString("Close")}
                />
            );
        } else {
            // Render View
            ActionSdkHelper.hideLoadingIndicator();
            return (
                <>
                    <Flex gap="gap.medium" column>
                        {this.renderGameCreationView()}
                    </Flex>
                    {this.renderFooterSection()}
                </>
            );
        }
    }

    // renderng seting page for the game
    renderGameCreationView() {
        let settingsProps: IGameCreationComponentProps = {
            ...this.getCommonGameCreationComponentProps(),
        };
        return <GameCreationView {...settingsProps} />;
    }

    /**
     * Helper function to provide footer for main page
     * @param isMobileView true or false based of whether its for mobile view or not
     */
    renderFooterSection(isMobileView?: boolean) {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        loading={getStore().sendingAction}
                        disabled={getStore().sendingAction}
                        content={Localizer.getString("SendGameRequest")}
                        onClick={() => {
                            validateGameTitle(getStore().title);
                            if(getStore().isValidGameTitle) {
                                callActionInstanceCreationAPI();
                            }
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }

    /**
     * Helper method to provide strings for settings view
     */
    getStringsForGameCreation(): IGameCreationComponentStrings {
        let settingsComponentStrings: IGameCreationComponentStrings = {
            dueBy: Localizer.getString("dueBy"),
            resultsVisibleTo: Localizer.getString("resultsVisibleTo"),
            resultsVisibleToAll: Localizer.getString("resultsVisibleToAll"),
            resultsVisibleToSender: Localizer.getString("resultsVisibleToSender"),
            datePickerPlaceholder: Localizer.getString("datePickerPlaceholder"),
            timePickerPlaceholder: Localizer.getString("timePickerPlaceholder"),
        };
        return settingsComponentStrings;
    }

    /**
     * Helper method to provide common settings props for both mobile and web view
     */
    getCommonGameCreationComponentProps() {
        return {
            resultVisibility: getStore().settings.resultVisibility,
            dueDate: getStore().settings.dueDate,
            locale: getStore().context.locale,
            renderForMobile: UxUtils.renderingForMobile(),
            strings: this.getStringsForGameCreation(),
            isMultiResponseAllowed: getStore().settings.isMultiResponseAllowed,
            shouldShowGametitleAlert: !getStore().isValidGameTitle,
            onChange: (props: IGameCreationComponentProps) => {
                updateSettings(props);
            },
            onMount: () => {
                UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
            },
        };
    }
}