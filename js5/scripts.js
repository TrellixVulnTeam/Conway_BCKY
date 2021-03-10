"use strict";

window.addEventListener("load", function () {
    var boardSize = 1;
    var clickable = [];
    var timerReference = undefined;
    var boardStyle = "style4";
    var currentStatus = [];
    var nextStatus = [];

    function stateBoard() {
        for (var i = 0; i < boardSize * 12; i++) {
            currentStatus[i] = [];
            nextStatus[i] = [];
            for (var j = 0; j < boardSize * 12; j++) {
                currentStatus[i][j] = "dead";
                nextStatus[i][j] = "dead";
            }
        }
    }

    function drawBoard() {
        var boardContainer = document.createElement("div");
        boardContainer.classList.add("container");
        boardContainer.setAttribute('id', 'boardContainer');
        for (var i = 0; i < boardSize; i++) {
            var boardUnit = document.createElement("div");
            boardUnit.classList.add("row");
            boardUnit = drawBoardUnit(boardUnit, i);
            boardContainer.append(boardUnit);
        }
        $("#board").append(boardContainer);
        addCellListener();
        console.log(currentStatus);
        console.log(nextStatus);
    }

    /* A boardUnit contains a row of cellContainers. */
    function drawBoardUnit(boardUnit, boardUnitIndex) {

        var newBoardUnit = boardUnit;
        for (var i = 0; i < boardSize; i++) {
            var cellContainer = document.createElement("div");
            cellContainer.classList.add("container");
            cellContainer.classList.add("col-" + 12 / Number(boardSize));
            cellContainer = drawCellContainer(boardUnitIndex, i, cellContainer);
            newBoardUnit.append(cellContainer);
        }
        return newBoardUnit;
    }

    /* A cellContainer contains 12 rows of cells. */
    function drawCellContainer(BoardUnitIndex, cellContainerIndex, cellContainer) {
        var newCellContainer = cellContainer;
        for (var i = 0; i < 12; i++) {
            var cellRow = document.createElement("div");
            cellRow.classList.add("row");
            cellRow = drawCellRow(BoardUnitIndex, cellContainerIndex, i, cellRow);
            newCellContainer.append(cellRow);
        }
        return newCellContainer;
    }

    /* A cellRow contains 12 cells. */
    function drawCellRow(BoardUnitIndex, cellContainerIndex, cellRowIndex, cellRow) {
        var newCellRow = cellRow;
        for (var i = 0; i < 12; i++) {
            var cellContainer = document.createElement("div");
            cellContainer.classList.add("cellContainer");

            cellContainer.classList.add("col-1");
            var cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("dead");
            cell.classList.add(boardStyle);
            cell = getCellCoord(BoardUnitIndex, cellContainerIndex, cellRowIndex, i, cell);
            cellContainer.append(cell);
            newCellRow.append(cellContainer);
        }
        return newCellRow;
    }

    function getCellCoord(boardUnitIndex, cellContainerIndex, cellRowIndex, cellIndex, cell) {
        var newCell = cell;
        var cellCoordX = 12 * cellContainerIndex + cellIndex;
        var cellCoordY = 12 * boardUnitIndex + cellRowIndex;
        newCell.setAttribute("coordx", cellCoordX);
        newCell.setAttribute("coordy", cellCoordY);
        return newCell;
    }

    function addCellListener() {
        $(".cell").click(function () {
            if ($(this).hasClass("dead")) {
                $(this).removeClass("dead");
                $(this).addClass("alive");
                var coordx = Number($(this).attr("coordx"));
                var coordy = Number($(this).attr("coordy"));
                currentStatus[coordx][coordy] = "alive";
                nextStatus[coordx][coordy] = "alive";
            } else if ($(this).hasClass("alive")) {
                $(this).removeClass("alive");
                $(this).addClass("dead");
                var _coordx = $(this).attr("coordx");
                var _coordy = $(this).attr("coordy");
                currentStatus[_coordx][_coordy] = "dead";
                nextStatus[_coordx][_coordy] = "alive";
            }
        });
    }

    $("#run").click(function () {
        run();
    });

    function run() {
        if (timerReference === undefined) {
            timerReference = setInterval(run, 500);
        }
        clickable.forEach(function (element, index) {
            if (element.classList.contains("btn")) {
                element.style.display = "none";
            } else {
                element.style.pointerEvents = "none";
            }
        });
        $("#stop").show();

        checkNeighbors();
        stateColor();
    }

    function collectClickables() {
        clickable.push(document.querySelector("#run"));
        clickable.push(document.querySelector("#beauty"));
        clickable.push(document.querySelector("#random"));
        clickable.push(document.querySelector("#sizeButton"));
        clickable.push(document.querySelector("#colorButton"));
        clickable.push(document.querySelector("#boardContainer"));
    }

    function checkNeighbors() {
        for (var i = 0; i < boardSize * 12; i++) {
            for (var j = 0; j < boardSize * 12; j++) {
                var aliveNeighborNum = 0;
                for (var k = Math.max(i - 1, 0); k < Math.min(i + 2, boardSize * 12); k++) {
                    for (var m = Math.max(j - 1, 0); m < Math.min(j + 2, boardSize * 12); m++) {
                        if (currentStatus[k][m] === "alive" && !(i === k && j === m)) {
                            aliveNeighborNum++;
                        }
                    }
                }
                if (aliveNeighborNum < 2 || aliveNeighborNum > 3) {
                    nextStatus[i][j] = "dead";
                } else if (aliveNeighborNum === 3) {
                    nextStatus[i][j] = "alive";
                }
            }
        }
    }

    function stateColor() {
        for (var i = 0; i < boardSize * 12; i++) {
            for (var j = 0; j < boardSize * 12; j++) {
                if (currentStatus[i][j] === "dead" && nextStatus[i][j] === "alive") {
                    var cell = document.querySelector("[coordx=\"" + i + "\"][coordy=\"" + j + "\"]");
                    cell.classList.remove("dead");
                    cell.classList.add("alive");
                } else if (currentStatus[i][j] === "alive" && nextStatus[i][j] === "dead") {
                    var _cell = document.querySelector("[coordx=\"" + i + "\"][coordy=\"" + j + "\"]");
                    _cell.classList.remove("alive");
                    _cell.classList.add("dead");
                }
                currentStatus[i][j] = nextStatus[i][j];
            }
        }
    }

    $("#stop").click(function () {
        $("#stop").hide();
        clickable.forEach(function (element, index) {
            element.style.pointerEvents = "all";
            element.style.display = "block";
        });
        clearInterval(timerReference);
        timerReference = undefined;
    });

    $("#beauty").click(function () {
        clearBoard();

        var aliveCells = [];

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                currentStatus[5 + i * 12][5 + j * 12] = "alive";
                currentStatus[4 + i * 12][6 + j * 12] = "alive";
                currentStatus[5 + i * 12][6 + j * 12] = "alive";
                currentStatus[6 + i * 12][6 + j * 12] = "alive";

                nextStatus[5 + i * 12][5 + j * 12] = "alive";
                nextStatus[4 + i * 12][6 + j * 12] = "alive";
                nextStatus[5 + i * 12][6 + j * 12] = "alive";
                nextStatus[6 + i * 12][6 + j * 12] = "alive";

                aliveCells.push(document.querySelector("[coordx=\"" + (5 + i * 12) + "\"][coordy=\"" + (5 + j * 12) + "\"]"));
                aliveCells.push(document.querySelector("[coordx=\"" + (4 + i * 12) + "\"][coordy=\"" + (6 + j * 12) + "\"]"));
                aliveCells.push(document.querySelector("[coordx=\"" + (5 + i * 12) + "\"][coordy=\"" + (6 + j * 12) + "\"]"));
                aliveCells.push(document.querySelector("[coordx=\"" + (6 + i * 12) + "\"][coordy=\"" + (6 + j * 12) + "\"]"));
            }
        }
        born(aliveCells);
        run();
    });

    $("#random").click(function () {
        clearBoard();

        var aliveCells = [];
        for (var i = 0; i < boardSize * 48; i++) {
            var j = getRandomInt();
            var k = getRandomInt();
            aliveCells.push(document.querySelector("[coordx=\"" + j + "\"][coordy=\"" + k + "\"]"));
            currentStatus[j][k] = "alive";
            nextStatus[j][k] = "alive";
        }
        born(aliveCells);
        run();
    });

    function getRandomInt() {
        return Math.floor(Math.random() * boardSize * 12);
    }

    function born(aliveCells) {
        aliveCells.forEach(function (cell, index) {
            cell.classList.remove("dead");
            cell.classList.add("alive");
        });
    }

    function clearBoard() {
        for (var i = 0; i < boardSize * 12; i++) {
            for (var j = 0; j < boardSize * 12; j++) {
                if (currentStatus[i][j] === "alive" || nextStatus[i][j] === "alive") {
                    currentStatus[i][j] = "dead";
                    nextStatus[i][j] = "dead";
                    var cell = document.querySelector("[coordx=\"" + i + "\"][coordy=\"" + j + "\"]");
                    cell.classList.remove("alive");
                    cell.classList.add("dead");
                }
            }
        }
    }

    $("#board1").click(function () {
        $("#board").empty();
        boardSize = 1;
        stateBoard();
        drawBoard();
    });

    $("#board2").click(function () {
        $("#board").empty();
        boardSize = 2;
        stateBoard();
        drawBoard();
    });

    $("#board3").click(function () {
        $("#board").empty();
        boardSize = 3;
        stateBoard();
        drawBoard();
    });

    $("#board4").click(function () {
        $("#board").empty();
        boardSize = 4;
        stateBoard();
        drawBoard();
    });

    $("#om").click(function () {
        boardStyle = "style1";
        changeColor("#92ddc4");
    });

    $("#ct").click(function () {
        boardStyle = "style2";
        changeColor("tan");
    });

    $("#ic").click(function () {
        boardStyle = "style3";
        changeColor("rgb(185, 185, 230)");
    });
    $("#gp").click(function () {
        boardStyle = "style4";
        changeColor("pink");
    });

    function changeColor(color) {
        $("footer").css("background", color);
        $(".jumbotron").css("background", color);
        $(".cell").removeClass(function (index, className) {
            return (className.match(/(^|\s)style\S+/g) || []).join(' ');
        });
        $(".cell").addClass(boardStyle);
    }

    stateBoard();
    drawBoard();
    collectClickables();
});