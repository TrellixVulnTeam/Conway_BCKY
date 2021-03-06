"use strict";

window.addEventListener("load", function () {
    var boardSize = 1;
    var clickable = [];
    var timerReference = undefined;
    var boardStyle = "style4";

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
            } else if ($(this).hasClass("alive")) {
                $(this).removeClass("alive");
                $(this).addClass("dead");
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

        var cells = document.querySelectorAll(".cell");
        cells.forEach(checkNeighbors);
        cells.forEach(stateColor);
    }

    function collectClickables() {
        clickable.push(document.querySelector("#run"));
        clickable.push(document.querySelector("#beauty"));
        clickable.push(document.querySelector("#random"));
        clickable.push(document.querySelector("#sizeButton"));
        clickable.push(document.querySelector("#colorButton"));
        clickable.push(document.querySelector("#boardContainer"));
    }

    function checkNeighbors(cell, index) {
        var aliveNeighborNum = 0;
        var x = Number(cell.getAttribute("coordx"));
        var y = Number(cell.getAttribute("coordy"));

        for (var i = Math.max(x - 1, 0); i < Math.min(x + 2, boardSize * 12); i++) {
            for (var j = Math.max(y - 1, 0); j < Math.min(y + 2, boardSize * 12); j++) {
                if (document.querySelector("[coordx=\"" + i + "\"][coordy=\"" + j + "\"]").classList.contains("alive") && !(i === x && j === y)) {
                    aliveNeighborNum++;
                }
            }
        }

        if (aliveNeighborNum < 2 || aliveNeighborNum > 3) {
            cell.classList.add("die");
        } else if (aliveNeighborNum === 3) {
            cell.classList.add("born");
        } else {
            if (cell.classList.contains("alive")) {
                cell.classList.add("born");
            } else if (cell.classList.contains("dead")) {
                cell.classList.add("die");
            }
        }
    }

    function stateColor(cell, index) {
        if (cell.classList.contains("dead") && cell.classList.contains("die")) {
            cell.classList.remove("die");
        } else if (cell.classList.contains("alive") && cell.classList.contains("die")) {
            cell.classList.remove("die");
            cell.classList.remove("alive");
            cell.classList.add("dead");
        } else if (cell.classList.contains("alive") && cell.classList.contains("born")) {
            cell.classList.remove("born");
        } else if (cell.classList.contains("dead") && cell.classList.contains("born")) {
            cell.classList.remove("dead");
            cell.classList.remove("born");
            cell.classList.add("alive");
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
        var i = 5;
        var j = 5;

        for (var k = 0; k < boardSize; k++) {
            for (var m = 0; m < boardSize; m++) {
                aliveCells.push(document.querySelector("[coordx=\"" + (i + m * 12) + "\"][coordy=\"" + (j + k * 12) + "\"]"));
                aliveCells.push(document.querySelector("[coordx=\"" + (i - 1 + m * 12) + "\"][coordy=\"" + (j + 1 + k * 12) + "\"]"));
                aliveCells.push(document.querySelector("[coordx=\"" + (i + m * 12) + "\"][coordy=\"" + (j + 1 + k * 12) + "\"]"));
                aliveCells.push(document.querySelector("[coordx=\"" + (i + 1 + m * 12) + "\"][coordy=\"" + (j + 1 + k * 12) + "\"]"));
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
        var cells = document.querySelectorAll(".cell");
        cells.forEach(function (cell, index) {
            if (cell.classList.contains("alive")) {
                cell.classList.remove("alive");
                cell.classList.add("dead");
            }
        });
    }

    $("#board1").click(function () {
        $("#board").empty();
        boardSize = 1;
        drawBoard();
    });

    $("#board2").click(function () {
        $("#board").empty();
        boardSize = 2;
        drawBoard();
    });

    $("#board3").click(function () {
        $("#board").empty();
        boardSize = 3;
        drawBoard();
    });

    $("#board4").click(function () {
        $("#board").empty();
        boardSize = 4;
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
        console.log;
        $("footer").css("background", color);
        $(".jumbotron").css("background", color);
        $(".cell").removeClass(function (index, className) {
            return (className.match(/(^|\s)style\S+/g) || []).join(' ');
        });
        $(".cell").addClass(boardStyle);
    }

    drawBoard(boardSize);
    collectClickables();
});