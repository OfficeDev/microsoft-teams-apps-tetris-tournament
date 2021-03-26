// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { Avatar, Card, Flex, Text, Checkbox, FlexItem, Button } from "@fluentui/react-northstar";
import "./GamePage.scss";
import { UxUtils } from "../../utils/UxUtils";
import TetrisGame from "./TetrisGame";
import { Constants } from "../../utils/Constants";
import getStore, { GameStatus } from "../../store/ResponseStore";
import { Localizer } from "../../utils/Localizer";
import { updatedInstructionPageView, setGameStatus } from "../../actions/ResponseAction";

/**
 * <InstructionView> component for game instruction view
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */

@observer
export default class InstructionView extends React.Component {
    private store = getStore();
    render() {
        return (
            this.store.gameStatus === GameStatus.InProgress ?
                <TetrisGame /> :
                <Flex className="body-container instruction" column gap="gap.medium">
                    {this.renderInstruction()}
                    {this.renderFooterSection()}
                </Flex>
        );
    }
    // Helper method to render the Instriuction view
    renderInstruction(): JSX.Element {
        return (
            <div>
                <Card aria-roledescription="gameInstruction" fluid className="instruction-card-background-color">
                    <Card.Header fitted>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Avatar image={Constants.GAME_LOGO_PATH} label="Tetris" name="Tetris" size="larger" />
                            </Flex>
                            <Flex column>
                                <Text content={Localizer.getString("HowToPlay")} weight="bold" size="large" />
                                <Text content={UxUtils.formateStringWithLineBreak(this.getInstructionContent())}
                                    className="instruction-content-padding" />
                            </Flex>
                        </Flex>
                    </Card.Header>
                </Card>
                <Checkbox className="checklist-checkbox  checkbox-top-padding"
                    label={Localizer.getString("DontShowTheGameInstruction")}
                    checked={this.store.isGameInstructionPageVisible}
                    onChange={
                        () => {
                            updatedInstructionPageView();
                        }
                    } />
            </div>
        );
    }

    // Helper method to render the footer section
    renderFooterSection(isMobileView?: boolean): JSX.Element {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        content={Localizer.getString("PlayButton")}
                        onClick={() => {
                            setGameStatus(GameStatus.InProgress);
                            UxUtils.setLocalStorge(this.store.isGameInstructionPageVisible);
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }

    // Helper method to fetch the instruction content based on the device
    getInstructionContent(): string {
        if (UxUtils.renderingForMobile()) {
            return Localizer.getString("HowToPlayForMobile");
        } else {
            return Localizer.getString("HowToPlayForDesktop");
        }
    }
}
