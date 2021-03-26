// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { observer } from "mobx-react";
import * as React from "react";
import { updateScoreBoardRowCount } from "../../actions/SummaryActions";
import getStore, { MyGameScore } from "../../store/SummaryStore";
import { Constants } from "../../utils/Constants";
import { Localizer } from "../../utils/Localizer";
import "./SummaryPage.scss";

/**
 * <MyScoreBoard> component for score board on summary page
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */
@observer
export class MyScoreBoard extends React.Component<any> {
    private scores: MyGameScore[];
    private store = getStore();
    constructor(props) {
        super(props);
        this.scores = this.store.scoreBoard;
    }

    render() {
        return (
            // preparing score board
            this.scores && this.scores.length > 0 ?
                <>
                    <div className="timeline">
                        {
                            this.scores.slice(0, this.store.scoreBoardRowCount).map((score, index) => (
                                this.renderTimelineElement(score.score, score.timeStamp, index)
                            ))
                        }
                    </div>
                    {
                        this.scores.length > Constants.DEFAULT_NUMBER_OF_RECORD && this.scores.length > this.store.scoreBoardRowCount ?
                            <span className="link my-score-link" onClick={() => {
                                updateScoreBoardRowCount(this.store.leaderBoardRowCount + Constants.DEFAULT_NUMBER_OF_RECORD);
                            }}>+ {Localizer.getString("LoadMore")}</span>
                            :
                            <div></div>
                    }
                </>
                :
                <div className="content">
                    <label>
                        {this.props.youHaveNotResponded}
                    </label>
                </div>
        );
    }

    /**
    * Helper method to render the score board row
    * @param score score
    * @param timeStamp timeStamp
    * @param index index
    */
    renderTimelineElement(score: string, timeStamp: string, index: number): JSX.Element {
        return (
            <div className="container right">
                <div className="content" key={index}>
                    <strong>{score}</strong>
                    <span className="pull-right">{timeStamp}</span>
                </div>
            </div>
        );
    }
}
