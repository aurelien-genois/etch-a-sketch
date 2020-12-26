function cellCreation(colIndex, rowIndex) {
    let cell = document.createElement('div');
    cell.style.backgroundColor = 'white';
    cell.style.gridColumn = colIndex;
    cell.style.gridRow = rowIndex;
    grid.appendChild(cell);
}
function gridCreation(gridUnit) {
    const grid = document.querySelector('#grid');
    grid.style.gridTemplateColumns = `repeat(${gridUnit}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gridUnit}, 1fr)`;
    grid.addEventListener('contextmenu', e => e.preventDefault());
    
    let col = 1;
    let row = 1;
    for(i = 1; i <= gridUnit**2; i++) {
        cellCreation(col,row);
        col++;
        if(col>gridUnit) {
            row++;
            col-=gridUnit;
        }
    };

    const cells = Array.from(grid.children);
    // test for activate pen on click
    // let activePen = false;

    // cells.forEach(cell => 
    // cell.addEventListener('click', () => {
    //     if(activePen) {
    //         activePen = false;
    //         return;
    //     }
    //     activePen = true;}
    // ));
    cells.forEach(cell => 
    cell.addEventListener('mouseover', (e) => {
        if(e.buttons == 1) {
            e.target.style.backgroundColor = color;
        }
        if(e.buttons == 2) {
            e.target.style.backgroundColor = 'white';
        }
        }
        ));
}
function GenerateNewGrid() {
    const newGridUnit = Number(prompt('Choose a new grid unit\n between 0 and 100'));
    if(newGridUnit > 100 || newGridUnit < 1) {
        alert('too great or negative number, or 0');
        return;
    } else if(!newGridUnit) {
        alert('not a number');
        return;
    }
    while (grid.firstChild) {    
        grid.removeChild(grid.firstChild);}
    gridCreation(newGridUnit);
}

let gridUnit = 16;
gridCreation(gridUnit);

// clear and create new grid
const clearButton = document.querySelector('#clearButton');
clearButton.addEventListener('click', GenerateNewGrid);

const colorPicker = document.querySelector('#colorPicker');
let color = colorPicker.value;
colorPicker.addEventListener('change', (e) => {
    color = e.target.value;
})
