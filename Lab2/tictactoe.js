let hideResultTimeout,
    playerOnHold,
    playerMarker,
    computerMarker;

const horizontalWinningFields = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ],
    verticalWinningFields = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ],
    diagonalWinningFields = [
        [0, 4, 8],
        [2, 4, 6]
    ];

const COMPUTER_RESPONSE_TIME = 1000;

const MARKERS = {
    nought: `<svg><circle r='25' cx='50' cy='50'/></svg>`,
    cross: `<svg>
                <line x1="25" y1="25" x2="75" y2="75"></line>
                <line x1="25" y1="75" x2="75" y2="25"></line>
            </svg>`
};

const BOARD = {
    theFields: Array.from(document.getElementsByClassName('cell')),
    fields: Array.from(Array(9).keys()),
    winningFields: [
        ...horizontalWinningFields,
        ...verticalWinningFields,
        ...diagonalWinningFields
    ],
    theFieldSetup: (field) => (field.title = "Wybierz marker!", field.innerHTML = ''),
    theFieldsSetup: function() {
        this.theFields.forEach(this.theFieldSetup);
    },
    fieldsSetup: function() {
        this.fields = Array.from(Array(9).keys())
    },
    markersReset: () => {
        playerMarker = computerMarker = null;
        applyToElement("nought", (markerPicker) => markerPicker.style.backgroundColor = "transparent");
        applyToElement("cross", (markerPicker) => markerPicker.style.backgroundColor = "transparent");
        document.getElementById("marker-picker").style.pointerEvents = "auto";
    },
    prepareBoard: function() {
        this.fieldsSetup();
        this.theFieldsSetup();
        this.enableMarkerPick();
        this.markersReset();
    },
    setMarkerListener: (marker) => {
        applyToElement(marker, (markerElement) => markerElement.addEventListener('click', () => {
            for (let prop in MARKERS) {
                prop === marker ? playerMarker = MARKERS[marker] : computerMarker = MARKERS[prop];
            }
            markerElement.style.backgroundColor = "lightgreen";
            document.getElementById("marker-picker").style.pointerEvents = "none";
            BOARD.new();
        }, {once: true}, false));
    },
    enableMarkerPick: function() {
        this.setMarkerListener("nought");
        this.setMarkerListener("cross");
    },
    new: function() {
        this.theFields.forEach(field => {
            field.title = "";
            field.addEventListener('click', fieldClicked, false)
        })
    },
    removeEventListeners: function() {
        this.theFields.forEach(field => field.removeEventListener('click', fieldClicked, false));
    },
};

function getMarkedFields(fields, marker) {
    return fields.reduce((acc,curr, i) => curr == marker ? acc.concat(i) : acc, []);
}

function getNotMarkedFields(fields) {
    return fields.filter(item => typeof item === 'number');
}

let tiePredicate = (fields) => {
    return !getNotMarkedFields(fields).length;
};

function tieCheck(fields) {
    return tiePredicate(fields);
}

let winPredicate = (winningFields, markedFields) => (winningFields.find( fieldPack => {
    return fieldPack.every(field => markedFields.indexOf(field) !== -1);
}));

function winCheck(fields, marker)  {
    return winPredicate(BOARD.winningFields, getMarkedFields(fields, marker)) ? marker : undefined;
}

function begin() {
    BOARD.prepareBoard();
    hideResult();
}

function fieldClicked(e) {
    const { id: fieldId } = e.target;
    if (typeof BOARD.fields[fieldId] === 'number' && !playerOnHold) {
        markField(fieldId, playerMarker);
        if (!tieCheck(BOARD.fields)) {
            playerOnHold = true;
            setTimeout(() => {
                markField(computerTurn(), computerMarker);
                playerOnHold = false;
            }, COMPUTER_RESPONSE_TIME);
        } else {
            showResult('Remis!');
        }
    }
}

function markField(fieldId, marker) {
    BOARD.fields[fieldId] = marker;
    document.getElementById(fieldId).innerHTML = marker;
    let winner = winCheck(BOARD.fields, marker);
    if (winner) {
        finishGame(winner);
    }
}

function finishGame(marker) {
    BOARD.removeEventListeners();
    showResult((marker === playerMarker) ? 'Wygrałeś zwyciezco!' : 'Przegrałeś!');
}

function computerTurn() {
    return minmax(BOARD.fields, computerMarker).index;
}

function showResult(message) {
    applyToElement("toast__message", (toastMessage) => toastMessage.innerText = message);
    applyToElement("toast", (toast) => {
        toast.className = "toast show";
        hideResultTimeout = setTimeout(() => hideResult(), 3000);
    });
}

function hideResult() {
    clearTimeout(hideResultTimeout);
    applyToElement("toast", (toast) => toast.className = "toast");
}

function applyToElement(elementId, callback) {
    const element = document.getElementById(elementId);
    callback(element);
}

function minmax(fields, marker) {
    let notMarkedFields = getNotMarkedFields(fields);

    if (winCheck(fields, playerMarker)) {
        return { score: -10 }
    } else if (winCheck(fields, computerMarker)) {
        return { score: 10 }
    } else if (notMarkedFields.length === 0) {
        return { score: 0 }
    }

    let moves = [];

    notMarkedFields.forEach( field => {
        let move = {};
        move.index = fields[field];
        fields[field] = marker;

        if (marker === computerMarker) {
            let result = minmax(fields, playerMarker);
            move.score = result.score;
        } else {
            let result = minmax(fields, computerMarker);
            move.score = result.score;
        }

        fields[field] = move.index;
        moves.push(move);
    });

    let movePredicate = (prev, curr) => (marker === computerMarker) ? prev.score > curr.score : prev.score < curr.score;
    let moveIndex = moves.indexOf(moves.reduce((prev, curr) => movePredicate(prev, curr) ? prev : curr));

    return moves[moveIndex];
}

begin();