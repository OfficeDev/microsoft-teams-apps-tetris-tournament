// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { DateTimePickerView } from "../DateTime";
import { Flex, Text, Checkbox } from "@fluentui/react-northstar";
import { Localizer } from "../../utils/Localizer";
import { InputBox } from "../InputBox";
import getStore from "../../store/CreationStore";
import { Constants } from "../../utils/Constants";
import {
    updateTitle,
    shouldValidateUI,
    updateSettings
} from "../../actions/CreationActions";

/**
 * Setting Props
*/
export interface IGameCreationComponentProps {
    dueDate: number;
    locale?: string;
    resultVisibility: boolean;
    renderForMobile?: boolean;
    isMultiResponseAllowed: boolean;
    strings: IGameCreationComponentStrings;
    shouldShowGametitleAlert?: boolean;
    renderDueBySection?: () => React.ReactElement<any>;
    renderResultVisibilitySection?: () => React.ReactElement<any>;
    onChange?: (props: IGameCreationComponentProps) => void;
    onMount?: () => void;
}

export interface IGameCreationComponentStrings {
    dueBy?: string;
    resultsVisibleTo?: string;
    resultsVisibleToAll?: string;
    resultsVisibleToSender?: string;
    datePickerPlaceholder?: string;
    timePickerPlaceholder?: string;
}

/**
 * <GameCreationView> GameCreationView component of creation view of game
 */

@observer
export class GameCreationView extends React.Component<IGameCreationComponentProps> {
    private settingProps: IGameCreationComponentProps;
    private inputTitleRef: HTMLElement;
    constructor(props: IGameCreationComponentProps) {
        super(props);
    }
    componentDidMount() {
        if (this.props.onMount) {
            this.props.onMount();
        }
    }
    componentDidUpdate() {
        // If user presses send/create button without filling title, focus should land on title edit field.
        if (this.inputTitleRef) {
            this.inputTitleRef.focus();
        }
    }
    render() {
        this.settingProps = {
            dueDate: this.props.dueDate,
            locale: this.props.locale,
            strings: this.props.strings,
            isMultiResponseAllowed: this.props.isMultiResponseAllowed,
            resultVisibility: this.props.resultVisibility,
            shouldShowGametitleAlert: this.props.shouldShowGametitleAlert
        };

        return (
            <Flex className="body-container" column
                gap="gap.medium">
                {this.renderSettings()}
            </Flex>
        );
    }

    /**
     * Common to render settings view for both mobile and web
     */
    private renderSettings() {
        return (
            <Flex column className="game-creation-settings">
                {this.renderGameTitleSection()}
                {this.renderDueBySection()}
                {this.renderAdditionalSettingsSection()}
            </Flex>
        );
    }

    /**
     * Rendering Enter Game Title section in cretion view
    **/
    private renderGameTitleSection() {
        return (
            <Flex className="settings-item-margin"
                role="group"
                aria-label="gameTitleSection"
                column gap="gap.smaller">
                <InputBox
                    fluid
                    maxLength={Constants.GAME_TITLE_MAX_LENGTH}
                    input={{
                        className: this.settingProps.shouldShowGametitleAlert ?
                            "item-content title-box in-t invalid-title invalid-error" :
                            "item-content title-box in-t"
                    }}
                    showError={this.settingProps.shouldShowGametitleAlert}
                    errorText={Localizer.getString("GameTitleErrorAlert")}
                    placeholder={Localizer.getString("TitlePlaceHoler")}
                    aria-placeholder={Localizer.getString("TitlePlaceHoler")}
                    value={getStore().title}
                    onChange={(e) => {
                        updateTitle((e.target as HTMLInputElement).value);
                        shouldValidateUI(false); // setting this flag to false to not validate input everytime value changes
                    }}
                />
            </Flex>
        );
    }
    /**
     * Rendering due date section in creation view
     **/
    private renderDueBySection() {

        return (
            <Flex role="group" aria-label={this.getString("dueBy")} column gap="gap.smaller">
                <label className="settings-item-title">{Localizer.getString("EndDate")}</label>
                <DateTimePickerView showTimePicker
                    minDate={new Date()}
                    locale={this.props.locale}
                    value={new Date(this.props.dueDate)}
                    placeholderDate={this.getString("datePickerPlaceholder")}
                    placeholderTime={this.getString("timePickerPlaceholder")}
                    renderForMobile={this.props.renderForMobile}
                    onSelect={(date: Date) => {
                        this.settingProps.dueDate = date.getTime();
                        this.props.onChange(this.settingProps);
                    }} />
            </Flex>
        );
    }
    /**
     * Rendering setting components with checkbox
     */
    private renderAdditionalSettingsSection() {

        return (
            <Flex role="group"
                aria-label="additionlsettings"
                column gap="gap.smaller"
                className="additinal-setting-container-padding" >
                {this.renderLeaderBoardVisibilitySettingSection()}
                {this.renderAllowMultiplePlaySettingSection()}
            </Flex>
        );
    }

    private getString(key: string): string {
        if (this.props.strings && this.props.strings.hasOwnProperty(key)) {
            return this.props.strings[key];
        }
        return key;
    }

    /**
    * helper method to render the multiple play setting checkbox in creation view
    */

    private renderAllowMultiplePlaySettingSection() {
        return (
            <Flex className="adjust-checkbox checkbox-gap additional-setting-paddig">
                <Checkbox labelPosition="start"
                    className="checklist-checkbox setting-check-box-padding"
                    aria-describedby={Localizer.getString("AllowMultipleTimePlay")}
                    checked={getStore().settings.isMultiResponseAllowed}
                    onClick={
                        () => {
                            this.settingProps.isMultiResponseAllowed = !this.settingProps.isMultiResponseAllowed;
                            //this.props.onChange(this.settingProps);
                            updateSettings(this.settingProps);
                        }
                    }
                />
                <Flex column>
                    <Text content={Localizer.getString("AllowMultipleTimePlay")} className="setting-header" />
                    <Text content={Localizer.getString("AllowMultipleTimePlaySubstring")} className="setting-sub-text" />
                </Flex>
            </Flex>
        );
    }

    /**
    * helper method to render the leaderboard visibility setting checkbox in creation view
    */

    private renderLeaderBoardVisibilitySettingSection() {
        return (
            <Flex
                className="adjust-checkbox checkbox-gap additional-setting-paddig">
                <Checkbox labelPosition="start"
                    className="checklist-checkbox setting-check-box-padding "
                    aria-describedby={Localizer.getString("LeaderBoardSetting")}
                    checked={getStore().settings.resultVisibility}
                    onClick={
                        () => {
                            this.settingProps.resultVisibility = !this.settingProps.resultVisibility;
                            updateSettings(this.settingProps);
                        }
                    }
                />
                <Flex column>
                    <Text content={Localizer.getString("LeaderBoardSetting")} className="setting-header" />
                    <Text content={Localizer.getString("LeaderBoardSettingSubstring")} className="setting-sub-text" />
                </Flex>
            </Flex>
        );
    }
}
