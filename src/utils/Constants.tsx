// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DayOfWeek } from "office-ui-fabric-react/lib/Calendar";

export class Constants {
    // ASCII value for carriage return
    public static readonly CARRIAGE_RETURN_ASCII_VALUE = 13;
    public static readonly ESCAPE_ASCII_VALUE = 27;

    public static readonly ACTION_INSTANCE_INDEFINITE_EXPIRY = -1;

    // some OS doesn't support long filenames, so capping the action's title length to this number
    public static readonly ACTION_RESULT_FILE_NAME_MAX_LENGTH: number = 50;
    public static readonly GAME_TITLE_MAX_LENGTH: number = 240;

    // Game setting constants
    public static readonly GAME_DATA_TABLE_NAME = "TetrisTournamentDataTable";
    public static readonly GAME_LOGO_PATH = "images/appIcon.png";
    public static readonly GAME_CONGRATULATION_IMAGE_PATH = "images/trophy.png";
    public static readonly INSTRUCTION_PAGE_LOCALSTORAGE = "TetrisGameInstructionPageShow";
    public static readonly SLIDING_VELOCITY = 60;
    public static readonly GAME_LOWEST_SPEED = 510;
    public static readonly GAME_HIGHEST_SPEED = 300;
    public static readonly MAX_LEVEL = 20;
    public static readonly BOARD_HEIGHT = 20;
    public static readonly BOARD_WIDTH = 12;
    public static readonly DEFAULT_NUMBER_OF_RECORD = 3;
    public static readonly RECORD_INCREMENT_FACTOR = 3;
    public static readonly SCORE_INCREMENT_FACTOR = 100;
    public static readonly SWIP_DOWN_TIME_THRESHOLD = 150;
    public static readonly SWIP_HORIZONTAL_THRESHOLD = 130;
    public static readonly NUMBER_OF_BLOCK = 7;
    public static readonly DELTA = 80;
    public static readonly KEY_MAP = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32
    };

    // Here row in each block represents the rotation number, since a block can have maximum 4, it has only 4 rows (0, 1, 2, 3)
    // Here row secquence important, if you change the seq. rotation map will change/rotation will be unexpected
    public static readonly BLOCKS: any[] = [
        [
            // The default square
            // Block zero, I am just to handle the corner case
            [[0, 0], [0, 0], [0, 0], [0, 0]],
            [[0, 0], [0, 0], [0, 0], [0, 0]],
            [[0, 0], [0, 0], [0, 0], [0, 0]],
            [[0, 0], [0, 0], [0, 0], [0, 0]]
        ],
        [
            // The cube tile (block 2x2)
            // Block 1
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]]
        ],
        [
            // The I tile
            // Block 2
            [[-1, 0], [0, 0], [1, 0], [2, 0]],
            [[0, -1], [0, 0], [0, 1], [0, 2]],
            [[-1, 0], [0, 0], [1, 0], [2, 0]],
            [[0, -1], [0, 0], [0, 1], [0, 2]]
        ],
        [
            // The T tile
            // Block 3
            [[0, 0], [1, 0], [0, 1], [0, -1]],
            [[0, 0], [-1, 0], [1, 0], [0, 1]],
            [[0, 0], [-1, 0], [0, 1], [0, -1]],
            [[0, 0], [-1, 0], [1, 0], [0, -1]]
        ],
        [
            // The inverse L tile
            // Block 4
            [[0, 0], [0, 1], [0, -1], [1, -1]],
            [[0, 0], [1, 0], [-1, 0], [1, 1]],
            [[0, 0], [0, 1], [0, -1], [-1, 1]],
            [[0, 0], [-1, 0], [1, 0], [-1, -1]]
        ],
        [
            // The L tile
            // Block 5
            [[0, 0], [0, 1], [0, -1], [1, 1]],
            [[0, 0], [1, 0], [-1, 0], [-1, 1]],
            [[0, 0], [0, 1], [0, -1], [-1, -1]],
            [[0, 0], [1, 0], [-1, 0], [1, -1]],
        ],
        [
            // The Z tile
            // Block 6
            [[0, 0], [1, 0], [0, 1], [1, -1]],
            [[0, 0], [1, 0], [0, -1], [-1, -1]],
            [[0, 0], [1, 0], [0, 1], [1, -1]],
            [[0, 0], [1, 0], [0, -1], [-1, -1]]

        ],
        [
            // The inverse Z tile
            // Block 7
            [[0, 0], [0, -1], [1, 0], [1, 1]],
            [[0, 0], [-1, 0], [0, -1], [1, -1]],
            [[0, 0], [0, -1], [1, 0], [1, 1]],
            [[0, 0], [-1, 0], [0, -1], [1, -1]]
        ]
    ];

    public static readonly FOCUSABLE_ITEMS = {
        All: ["a[href]", "area[href]", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", "button:not([disabled])", '[tabindex="0"]'],
        LINK: "a[href]",
        AREA_LINK: "area[href]",
        INPUT: "input:not([disabled])",
        SELECT: "select:not([disabled])",
        TEXTAREA: "textarea:not([disabled])",
        BUTTON: "button:not([disabled])",
        TAB: '[tabindex="0"]'
    };

    // The following is a map of locales to their corresponding first day of the week.
    // This map only contains locales which do not have Sunday as their first day of the week.
    // The source for this data is moment-with-locales.js version 2.24.0
    // Note: The keys in this map should be in lowercase
    public static readonly LOCALE_TO_FIRST_DAY_OF_WEEK_MAP = {
        "af": DayOfWeek.Monday,
        "ar-ly": DayOfWeek.Saturday,
        "ar-ma": DayOfWeek.Saturday,
        "ar-tn": DayOfWeek.Monday,
        "ar": DayOfWeek.Saturday,
        "az": DayOfWeek.Monday,
        "be": DayOfWeek.Monday,
        "bg": DayOfWeek.Monday,
        "bm": DayOfWeek.Monday,
        "br": DayOfWeek.Monday,
        "bs": DayOfWeek.Monday,
        "ca": DayOfWeek.Monday,
        "cs": DayOfWeek.Monday,
        "cv": DayOfWeek.Monday,
        "cy": DayOfWeek.Monday,
        "da": DayOfWeek.Monday,
        "de-at": DayOfWeek.Monday,
        "de-ch": DayOfWeek.Monday,
        "de": DayOfWeek.Monday,
        "el": DayOfWeek.Monday,
        "en-sg": DayOfWeek.Monday,
        "en-au": DayOfWeek.Monday,
        "en-gb": DayOfWeek.Monday,
        "en-ie": DayOfWeek.Monday,
        "en-nz": DayOfWeek.Monday,
        "eo": DayOfWeek.Monday,
        "es-do": DayOfWeek.Monday,
        "es": DayOfWeek.Monday,
        "et": DayOfWeek.Monday,
        "eu": DayOfWeek.Monday,
        "fa": DayOfWeek.Saturday,
        "fi": DayOfWeek.Monday,
        "fo": DayOfWeek.Monday,
        "fr-ch": DayOfWeek.Monday,
        "fr": DayOfWeek.Monday,
        "fy": DayOfWeek.Monday,
        "ga": DayOfWeek.Monday,
        "gd": DayOfWeek.Monday,
        "gl": DayOfWeek.Monday,
        "gom-latn": DayOfWeek.Monday,
        "hr": DayOfWeek.Monday,
        "hu": DayOfWeek.Monday,
        "hy-am": DayOfWeek.Monday,
        "id": DayOfWeek.Monday,
        "is": DayOfWeek.Monday,
        "it-ch": DayOfWeek.Monday,
        "it": DayOfWeek.Monday,
        "jv": DayOfWeek.Monday,
        "ka": DayOfWeek.Monday,
        "kk": DayOfWeek.Monday,
        "km": DayOfWeek.Monday,
        "ku": DayOfWeek.Saturday,
        "ky": DayOfWeek.Monday,
        "lb": DayOfWeek.Monday,
        "lt": DayOfWeek.Monday,
        "lv": DayOfWeek.Monday,
        "me": DayOfWeek.Monday,
        "mi": DayOfWeek.Monday,
        "mk": DayOfWeek.Monday,
        "ms-my": DayOfWeek.Monday,
        "ms": DayOfWeek.Monday,
        "mt": DayOfWeek.Monday,
        "my": DayOfWeek.Monday,
        "nb": DayOfWeek.Monday,
        "nl-be": DayOfWeek.Monday,
        "nl": DayOfWeek.Monday,
        "nn": DayOfWeek.Monday,
        "pl": DayOfWeek.Monday,
        "pt": DayOfWeek.Monday,
        "ro": DayOfWeek.Monday,
        "ru": DayOfWeek.Monday,
        "sd": DayOfWeek.Monday,
        "se": DayOfWeek.Monday,
        "sk": DayOfWeek.Monday,
        "sl": DayOfWeek.Monday,
        "sq": DayOfWeek.Monday,
        "sr-cyrl": DayOfWeek.Monday,
        "sr": DayOfWeek.Monday,
        "ss": DayOfWeek.Monday,
        "sv": DayOfWeek.Monday,
        "sw": DayOfWeek.Monday,
        "tet": DayOfWeek.Monday,
        "tg": DayOfWeek.Monday,
        "tl-ph": DayOfWeek.Monday,
        "tlh": DayOfWeek.Monday,
        "tr": DayOfWeek.Monday,
        "tzl": DayOfWeek.Monday,
        "tzm-latn": DayOfWeek.Saturday,
        "tzm": DayOfWeek.Saturday,
        "ug-cn": DayOfWeek.Monday,
        "uk": DayOfWeek.Monday,
        "ur": DayOfWeek.Monday,
        "uz-latn": DayOfWeek.Monday,
        "uz": DayOfWeek.Monday,
        "vi": DayOfWeek.Monday,
        "x-pseudo": DayOfWeek.Monday,
        "yo": DayOfWeek.Monday,
        "zh-cn": DayOfWeek.Monday
    };

    public static readonly colors = {
        defaultBackgroundColor: "#fff",
        darkBackgroundColor: "#252423",
        contrastBackgroundColor: "black"
    };

}
