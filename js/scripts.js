window.addEventListener("load", function () {
    let boardSize = 1;
    let clickable = []
    let timerReference = undefined
    let boardStyle = "style4"

    function drawBoard(size) {
        let boardContainer = document.createElement("div")
        boardContainer.classList.add("container")
        boardContainer.setAttribute('id', 'boardContainer')
        for (let i = 0; i < size; i++) {
            let boardUnit = document.createElement("div")
            boardUnit.classList.add("row")
            boardUnit = drawBoardUnit(boardUnit, size, i)
            boardContainer.append(boardUnit)
        }
        $("#board").append(boardContainer)
        addCellListener();
    }

    /* A boardUnit contains a row of cellContainers. */
    function drawBoardUnit(boardUnit, boardSize, boardUnitIndex) {

        let newBoardUnit = boardUnit
        for (let i = 0; i < boardSize; i++) {
            let cellContainer = document.createElement("div")
            cellContainer.classList.add("container")
            cellContainer.classList.add(`col-${12 / Number(boardSize)}`)
            cellContainer = drawCellContainer(boardUnitIndex, i, cellContainer)
            newBoardUnit.append(cellContainer)
        }
        return newBoardUnit
    }

    /* A cellContainer contains 12 rows of cells. */
    function drawCellContainer(BoardUnitIndex, cellContainerIndex, cellContainer) {
        let newCellContainer = cellContainer
        for (let i = 0; i < 12; i++) {
            let cellRow = document.createElement("div")
            cellRow.classList.add("row")
            cellRow = drawCellRow(BoardUnitIndex, cellContainerIndex, i, cellRow)
            newCellContainer.append(cellRow)
        }
        return newCellContainer
    }

    /* A cellRow contains 12 cells. */
    function drawCellRow(BoardUnitIndex, cellContainerIndex, cellRowIndex, cellRow) {
        let newCellRow = cellRow
        for (let i = 0; i < 12; i++) {
            let cellContainer = document.createElement("div")
            cellContainer.classList.add("cellContainer")

            cellContainer.classList.add("col-1")
            let cell = document.createElement("div")
            cell.classList.add("cell")
            cell.classList.add("dead")
            cell.classList.add(boardStyle)
            cell = getCellCoord(BoardUnitIndex, cellContainerIndex, cellRowIndex, i, cell)
            cellContainer.append(cell)
            newCellRow.append(cellContainer)
        }
        return newCellRow
    }

    function getCellCoord(boardUnitIndex, cellContainerIndex, cellRowIndex, cellIndex, cell) {
        let newCell = cell
        let cellCoordX = 12 * cellContainerIndex + cellIndex;
        let cellCoordY = 12 * boardUnitIndex + cellRowIndex;
        newCell.setAttribute("coordx", cellCoordX)
        newCell.setAttribute("coordy", cellCoordY)
        return newCell

    }

    function addCellListener() {
        $(".cell").click(function () {
            if ($(this).hasClass("dead")) {
                $(this).removeClass("dead")
                $(this).addClass("alive")
            } else if ($(this).hasClass("alive")) {
                $(this).removeClass("alive")
                $(this).addClass("dead")
            }
        })
    }

    $("#board1").click(function () {
        $("#board").empty()
        drawBoard(1)
        boardSize = 1
    })

    $("#board2").click(function () {
        $("#board").empty()
        drawBoard(2)
        boardSize = 2
    })

    $("#board3").click(function () {
        $("#board").empty()
        drawBoard(3)
        boardSize = 3
    })

    $("#board4").click(function () {
        $("#board").empty()
        drawBoard(4)
        boardSize = 4
    })

    $("#run").click(() => {
        run()
    })

    function run() {
        if (timerReference === undefined) {
            timerReference = setInterval(run, 500)
        }
        clickable.forEach((element, index) => {
            if (element.classList.contains("btn")) {
                element.style.display = "none";
            } else {
                element.style.pointerEvents = "none"
            }
        })
        $("#stop").show()

        let cells = document.querySelectorAll(".cell")
        cells.forEach(checkNeighbors)
        cells.forEach(stateColor)

    }

    function collectClickables() {
        clickable.push(document.querySelector("#run"))
        clickable.push(document.querySelector("#beauty"))
        clickable.push(document.querySelector("#random"))
        clickable.push(document.querySelector("#sizeButton"))
        clickable.push(document.querySelector("#colorButton"))
        clickable.push(document.querySelector("#boardContainer"))
    }


    function checkNeighbors(cell, index) {
        let aliveNeighborNum = 0;
        let x = Number(cell.getAttribute("coordx"))
        let y = Number(cell.getAttribute("coordy"))

        for (i = Math.max(x - 1, 0); i < Math.min(x + 2, boardSize * 12); i++) {
            for (j = Math.max(y - 1, 0); j < Math.min(y + 2, boardSize * 12); j++) {
                if (document.querySelector(`[coordx="${i}"][coordy="${j}"]`).classList.contains("alive")
                    && !(i === x && j === y)) {
                    aliveNeighborNum++
                }
            }
        }

        if (aliveNeighborNum < 2 || aliveNeighborNum > 3) {
            cell.classList.add("die")
        } else if (aliveNeighborNum === 3) {
            cell.classList.add("born")
        } else {
            if (cell.classList.contains("alive")) {
                cell.classList.add("born")
            } else if (cell.classList.contains("dead")) {
                cell.classList.add("die")
            }
        }
    }

    function stateColor(cell, index) {
        if (cell.classList.contains("dead") && cell.classList.contains("die")) {
            cell.classList.remove("die")
        } else if (cell.classList.contains("alive") && cell.classList.contains("die")) {
            cell.classList.remove("die")
            cell.classList.remove("alive")
            cell.classList.add("dead")
        } else if (cell.classList.contains("alive") && cell.classList.contains("born")) {
            cell.classList.remove("born")
        } else if (cell.classList.contains("dead") && cell.classList.contains("born")) {
            cell.classList.remove("dead")
            cell.classList.remove("born")
            cell.classList.add("alive")
        }
    }

    $("#stop").click(() => {
        $("#stop").hide()
        clickable.forEach((element, index) => {
            element.style.pointerEvents = "all"
            element.style.display = "block"
        })
        clearInterval(timerReference)
        timerReference = undefined
    })

    $("#random").click(() => {
        clearBoard()

        let aliveCells = []
        for (let i = 0; i < boardSize * 48; i++) {
            let j = getRandomInt()
            let k = getRandomInt()
            aliveCells.push(document.querySelector(`[coordx="${j}"][coordy="${k}"]`))
        }

        born(aliveCells)
        run()
    })

    function getRandomInt() {
        return Math.floor(Math.random() * boardSize * 12)
    }

    function born(aliveCells) {
        aliveCells.forEach((cell, index) => {
            cell.classList.remove("dead")
            cell.classList.add("alive")
        })
    }

    $("#beauty").click(() => {
        clearBoard()

        let aliveCells = []
        let i = 5
        let j = 5

        for (let k = 0; k < boardSize; k++) {
            for (let m = 0; m < boardSize; m++) {
                aliveCells.push(document.querySelector(`[coordx="${i + m * 12}"][coordy="${j + k * 12}"]`))
                aliveCells.push(document.querySelector(`[coordx="${i - 1 + m * 12}"][coordy="${j + 1 + k * 12}"]`))
                aliveCells.push(document.querySelector(`[coordx="${i + m * 12}"][coordy="${j + 1 + k * 12}"]`))
                aliveCells.push(document.querySelector(`[coordx="${i + 1 + m * 12}"][coordy="${j + 1 + k * 12}"]`))
            }
        }
        born(aliveCells)
        run()

    })

    function clearBoard() {
        cells = document.querySelectorAll(".cell")
        cells.forEach((cell, index) => {
            if (cell.classList.contains("alive")) {
                cell.classList.remove("alive")
                cell.classList.add("dead")
            }
        })
    }

    $("#clear").click(() => {
        clearBoard()
    })

    $("#om").click(() => {
        boardStyle = "style1"
        changeColor("#92ddc4")
    })

    $("#ct").click(() => {
        boardStyle = "style2"
        changeColor("tan")
    })

    $("#ic").click(() => {
        boardStyle = "style3"
        changeColor("rgb(185, 185, 230)")
    })
    $("#gp").click(() => {
        boardStyle = "style4"
        changeColor("pink")
    })

    function changeColor(color) {
        console.log
        $("footer").css("background", color)
        $(".jumbotron").css("background", color)
        $(".cell").removeClass((index, className) => {
            return (className.match (/(^|\s)style\S+/g) || []).join(' ')
        })
        $(".cell").addClass(boardStyle)
    }

    drawBoard(boardSize)
    collectClickables()
})