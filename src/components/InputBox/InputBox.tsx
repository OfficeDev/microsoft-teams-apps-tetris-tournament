// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import "./InputBox.scss";
import { Input, InputProps, Text, Flex } from "@fluentui/react-northstar";
import { Utils } from "../../utils/Utils";

export interface IInputBoxProps extends InputProps {
    multiline?: boolean;
    prefixJSX?: JSX.Element;
    showError?: boolean;
    errorText?: string;
}

enum RenderAs {
    Input,
    TextArea
}

/**
 * Input component supporting multiline input also
 */
export class InputBox extends React.Component<IInputBoxProps> {

    private renderAs: RenderAs = RenderAs.Input;
    private inputElement: HTMLElement;
    private incomingInputRef = null;

    private bottomBorderWidth: number = -1;

    componentDidUpdate() {
        this.autoAdjustHeight();
    }

    componentDidMount() {
        if (this.renderAs == RenderAs.TextArea && (!Utils.isEmpty(this.props.value) || !Utils.isEmpty(this.props.defaultValue))) {
            // Updating height only in case when there is some text in input box becasue if there is no text then rows=1 will show only 1 line.
            // There might be some senario in which element is not completely painted to get their scroll height. Refer https://stackoverflow.com/questions/26556436/react-after-render-code
            // In such cases the height of input box become wrong(looks very large or very small), which usaully occurs on very first load.
            // To solve this, trying to adjust the height after window has resize which supposed to be called once load and rendering is done.
            this.autoAdjustHeight();
            window.addEventListener("resize", () => {
                this.autoAdjustHeight();
            });
        }
    }

    render() {
        if (this.props.multiline) {
            this.renderAs = RenderAs.TextArea;
        }
        return (
            <Flex column>
                <Flex role="group"
                    aria-label="gameTitle"
                    column gap="gap.smaller">
                    {(this.props.showError && !Utils.isEmpty(this.props.errorText)) &&
                        <Text error className = "input-alert-setting">
                            {this.props.errorText}
                        </Text>}
                </Flex>
                {this.props.prefixJSX ? this.getInputItem() : this.getInput()}
            </Flex>
        );
    }
    public focus() {
        if (this.inputElement) {
            this.inputElement.focus();
        }
    }

    private getInputItem(): JSX.Element {
        return (
            <Flex gap="gap.smaller">
                {this.props.prefixJSX}
                {this.getInput()}
            </Flex>
        );
    }

    private getInput(): JSX.Element {
        return (<Input
            {...this.getInputProps()}
            onChange={(event, data) => {
                this.autoAdjustHeight();
                if (this.props.onChange) {
                    this.props.onChange(event, data);
                }
            }}
            onClick={this.props.disabled ? null : (event) => {
                // Adjusting height if by any reason wrong height get applied in componentDidMount.
                this.autoAdjustHeight();
                if (this.props.onClick) {
                    this.props.onClick(event);
                }
            }}
        />);
    }

    /**
     * Method to adjust height in case of multiline input
     */
    private autoAdjustHeight() {
        if (this.renderAs == RenderAs.TextArea) {
            this.inputElement.style.height = "";

            if (this.bottomBorderWidth == -1) {
                this.bottomBorderWidth = parseFloat(getComputedStyle(this.inputElement).getPropertyValue("border-bottom-width"));
            }
            this.inputElement.style.height = this.inputElement.scrollHeight + this.bottomBorderWidth + "px";
        }
    }

    private getInputProps(): InputProps {

        this.incomingInputRef = this.props.inputRef;
        let inputRef = (input) => {
            this.inputElement = input;
            if (this.incomingInputRef) {
                if (typeof this.incomingInputRef === "function") {
                    this.incomingInputRef(input);
                } else if (typeof this.incomingInputRef === "object") {
                    this.incomingInputRef.current = input;
                }
            }
        };

        let input: {} = this.props.input;
        if (this.renderAs == RenderAs.TextArea) {
            input = {
                ...input,
                as: "textarea",
                rows: 1
            };
        }

        let classNames: string[] = ["multiline-input-box"];
        if (this.props.className) {
            classNames.push(this.props.className);
        }
        if (this.props.showError) {
            classNames.push("invalid");
        }

        return {
            ...{
                ...this.props,
                multiline: undefined
            },
            className: classNames.join(" "),
            inputRef: inputRef,
            input: input
        };
    }
}
