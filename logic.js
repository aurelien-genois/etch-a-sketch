function RGBAToHex(rgba) {
  // adapt from CSS Tricks converter : https://css-tricks.com/converting-color-spaces-in-javascript/
  // Choose correct separator
  let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
  let startSubstr = rgba.indexOf('rgba') > -1 ? 5 : 4;
  // Turn "rgba(r,g,b,a)" into [r,g,b,a] or "rgb(r,g,b)" into [r,g,b]
  rgba = rgba.substr(startSubstr).split(')')[0].split(sep);
  // prevent RGB color
  // if 'a' does'nt exist, replace if with '1'
  if (rgba[3] == undefined) {
    rgba.push('1');
  }
  // Strip the slash if using space-separated syntax
  if (rgba.indexOf('/') > -1) rgba.splice(3, 1);
  // Convert %s to 0–255
  for (let R in rgba) {
    let r = rgba[R];
    if (r.indexOf('%') > -1) {
      let p = r.substr(0, r.length - 1) / 100;

      if (R < 3) {
        rgba[R] = Math.round(p * 255);
      } else {
        rgba[R] = p;
      }
    }
  }
  let r = (+rgba[0]).toString(16),
    g = (+rgba[1]).toString(16),
    b = (+rgba[2]).toString(16),
    a = Math.round(+rgba[3] * 255).toString(16);
  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  if (a.length == 1) a = '0' + a;

  return '#' + r + g + b + a;
}

function addHexColor(color1, color2) {
  if (color2[7] == undefined || (color2[7] == 'f' && color2[8] == 'f')) {
    // if no transparency, return directly the color added
    return color2;
  } else {
    // if transparency, combine the two colors
    // convert hex to rgb values
    let r1 = +('0x' + color1[1] + color1[2]);
    let g1 = +('0x' + color1[3] + color1[4]);
    let b1 = +('0x' + color1[5] + color1[6]);
    let a1 = +('0x' + color1[7] + color1[8]);

    let r2 = +('0x' + color2[1] + color2[2]);
    let g2 = +('0x' + color2[3] + color2[4]);
    let b2 = +('0x' + color2[5] + color2[6]);
    let a2 = +('0x' + color2[7] + color2[8]);

    a1 = (a1 / 255).toFixed(3);
    a2 = (a2 / 255).toFixed(3);

    // a solution thanks to: https://gist.github.com/JordanDelcros/518396da1c13f75ee057
    var base = [r1, g1, b1, a1];
    var added = [r2, g2, b2, a2];

    var mix = [];
    mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
    mix[0] = Math.round(
      (added[0] * added[3]) / mix[3] +
        (base[0] * base[3] * (1 - added[3])) / mix[3]
    ); // red
    mix[1] = Math.round(
      (added[1] * added[3]) / mix[3] +
        (base[1] * base[3] * (1 - added[3])) / mix[3]
    ); // green
    mix[2] = Math.round(
      (added[2] * added[3]) / mix[3] +
        (base[2] * base[3] * (1 - added[3])) / mix[3]
    ); // blue

    // convert back rgb to hex values
    let r3 = mix[0].toString(16);
    let g3 = mix[1].toString(16);
    let b3 = mix[2].toString(16);
    let a3 = Math.round(mix[3] * 255).toString(16);

    if (r3.length == 1) r3 = '0' + r3;
    if (g3.length == 1) g3 = '0' + g3;
    if (b3.length == 1) b3 = '0' + b3;
    if (a3.length == 1) a3 = '0' + a3;

    return '#' + r3 + g3 + b3 + a3;
  }
}

const includesArray = (data, arr) => {
  return data.some(
    (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
  );
};

const getAdjacentCells = (x, y) => {
  const allCells = [...grid.children];

  const topCell = [x, y - 1];
  const bottomCell = [x, y + 1];
  const leftCell = [x - 1, y];
  const rightCell = [x + 1, y];

  // need to get the cells (array of Ids) around the target
  // adjacent ids = target col -1/+1, target row -1/+1
  // target col = grid-column-start; target row = grid-row-start:
  const aroundCellsIds = [topCell, bottomCell, leftCell, rightCell];

  return allCells.filter((cell) =>
    includesArray(aroundCellsIds, [
      +cell.style.gridRowStart,
      +cell.style.gridColumnStart,
    ])
  );
};

const paint = (e) => {
  switch (mode) {
    case 'pen':
      if (e.buttons == 1) {
        const precColor = RGBAToHex(e.target.style.backgroundColor);
        const resultColor = addHexColor(precColor, color);
        e.target.style.backgroundColor = resultColor;
      }
      if (e.buttons == 2) {
        e.target.style.backgroundColor = '#ffffffff';
      }
      break;
    case 'fill':
      if (e.buttons == 1) {
        // let cellsToCheck = [e.target];
        const clickedTargetColor = e.target.style.backgroundColor;

        let aroundCells = getAdjacentCells(
          +e.target.style.gridRowStart,
          +e.target.style.gridColumnStart
        );

        // at the start, aroundCells of e.target are the only cells to check
        let cellsToCheck = [...aroundCells];
        // then add aroundCells for each cell to check

        if (
          RGBAToHex(clickedTargetColor).substring(0, 7) == color.substring(0, 7)
        ) {
          console.log('same color');

          cellsToCheck = [];
        }
        // const precColor = RGBAToHex(cell.style.backgroundColor);
        const precColor = RGBAToHex(clickedTargetColor);
        const resultColor = addHexColor(precColor, color);
        let count = 0;
        while (cellsToCheck.length > 0) {
          aroundCells.forEach((cell) => {
            if (clickedTargetColor == cell.style.backgroundColor) {
              cell.style.backgroundColor = resultColor;
              let adjacentCells = getAdjacentCells(
                +cell.style.gridRowStart,
                +cell.style.gridColumnStart
              );
              for (var i = 0; i < cellsToCheck.length; i++) {
                for (var j = 0; j < adjacentCells.length; j++) {
                  if (
                    RGBAToHex(adjacentCells[j].style.backgroundColor) ==
                    resultColor
                  ) {
                    // remove adjacent cell if already the same color as color
                    adjacentCells.splice(j, 1);
                  }
                  if (cellsToCheck[i] === adjacentCells[j]) {
                    // remove adjacent cell if already in cellToCheck
                    adjacentCells.splice(j, 1);
                  }
                }
                if (cellsToCheck[i] === cell) {
                  // remove this cell from cellsToCheck
                  cellsToCheck.splice(i, 1);
                }
              }
              // add this cell adjacents cells to cellsToCheck
              cellsToCheck.push(...adjacentCells);
            } else {
              for (var i = 0; i < cellsToCheck.length; i++) {
                if (cellsToCheck[i] === cell) {
                  // remove this cell from cellsToCheck
                  cellsToCheck.splice(i, 1);
                }
              }
            }
            // check adjacent cells only if this cell is the same color e.target
          });
          aroundCells = [...cellsToCheck];
          if (cellsToCheck.length > 0) {
            count++;
          }
          // prevent an infinite loop if to much fill
          if (count > 1000) {
            cellsToCheck = [];
            break;
          }
          console.log('count', count);
        }

        e.target.style.backgroundColor = resultColor;
      }
      if (e.buttons == 2) {
        e.target.style.backgroundColor = '#ffffffff';
      }
      break;
  }
};

const cellCreation = (colIndex, rowIndex) => {
  let cell = document.createElement('div');
  cell.style.backgroundColor = '#ffffffff';
  cell.style.gridColumn = colIndex;
  cell.style.gridRow = rowIndex;
  ['mouseover', 'mousedown'].forEach((event) =>
    cell.addEventListener(event, paint)
  );
  return cell;
};

const gridCreation = (gridUnitSize) => {
  grid.style.gridTemplateColumns = `repeat(${gridUnitSize}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridUnitSize}, 1fr)`;
  grid.addEventListener('contextmenu', (e) => e.preventDefault());

  let col = 1;
  let row = 1;
  for (i = 1; i <= gridUnitSize ** 2; i++) {
    const newCell = cellCreation(col, row);
    grid.appendChild(newCell);
    col++;
    if (col > gridUnitSize) {
      row++;
      col -= gridUnitSize;
    }
  }
};

const GenerateNewGrid = (newGridUnit) => {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  gridCreation(newGridUnit);
  gridUnit = newGridUnit;
};

const createNewGridForm = () => {
  const form = document.createElement('form');
  form.id = 'new-grid-form';

  const rangeLabel = document.createElement('label');
  rangeLabel.id = 'new-grid-label';
  rangeLabel.setAttribute('for', 'new-grid-size-input');
  const rangeInput = document.createElement('input');
  rangeInput.type = 'range';
  rangeInput.min = '4';
  rangeInput.max = '50';
  rangeInput.value = '20';
  rangeInput.id = 'new-grid-size-input';
  rangeInput.name = 'new-grid-size-input';
  const rangeP = document.createElement('p');
  rangeP.id = 'new-grid-size';
  rangeP.textContent = rangeInput.value;
  rangeInput.addEventListener('input', () => {
    rangeP.textContent = rangeInput.value;
  });
  const warningMsg = document.createElement('p');
  warningMsg.id = 'new-grid-warning-msg';
  warningMsg.textContent = 'This will clear and replace the current grid!';
  rangeLabel.append('Grid size:', rangeP, rangeInput, warningMsg);

  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Create';
  submit.title = 'This will clear and replace the current grid!';
  submit.id = 'new-grid-submit';

  form.append(rangeLabel, submit);
  return form;
};

const displayNewGridForm = () => {
  const newGridForm = createNewGridForm();
  newGridForm.addEventListener('submit', (e) => {
    const data = new FormData(e.target);
    const newGridSize = data.get('new-grid-size-input');
    e.preventDefault();
    GenerateNewGrid(newGridSize);

    document.querySelector('#new-grid-label').style.height = '0px';
    document.querySelector('#new-grid-label').style.opacity = '0';
    setTimeout(() => {
      newGridForm.replaceWith(newGridZone);
    }, 1000);
  });
  newGridZone.replaceWith(newGridForm);
};

const populateHistoryPalette = (colorValue) => {
  const colorCell = document.createElement('div');
  colorCell.classList.add('used-color');
  colorCell.style.background = colorValue;
  colorCell.addEventListener('click', (e) => {
    // the color from background style is in RGB, color input need an Hex color
    color = RGBAToHex(e.target.style.backgroundColor);
    // apply current opacity to the color
    // or reset opacityRange value
    // opacityRange.value = 100;
    colorPicker.value = color.substr(0, 7);
    changeOpacity();
  });
  if (historyPalette.children.length >= 21) {
    historyPalette.removeChild(historyPalette.lastElementChild);
  }
  historyPalette.prepend(colorCell);
};

const updateColorPreview = () => {
  const colorPreview = document.querySelector('#color-preview');
  colorPreview.style.backgroundColor = color;
};

const changeOpacity = () => {
  const opacityValue = opacityRange.value / 100;

  let opacityHexValue = Math.round(+opacityValue * 255).toString(16);
  if (opacityHexValue.length == 1) opacityHexValue = '0' + opacityHexValue;

  if (color.length > 7) {
    // if already an hex opacity, remove it
    color = color.substring(0, 7);
  }
  color += opacityHexValue;
  updateColorPreview();
};

const grid = document.querySelector('#grid');
grid.addEventListener('mouseover', (e) => {
  // to update the cursor
  if (mode === 'fill') {
    grid.style.cursor = "url('fill.png') 0 50, pointer";
  } else {
    switch (e.buttons) {
      case 1:
      case 0:
        grid.style.cursor = "url('pen.png') 0 50, pointer";
        break;
      case 2:
        grid.style.cursor = "url('eraser.png') 0 50, pointer";
    }
  }
});

const newGridBtn = document.querySelector('#new-grid-btn');
const newGridZone = document.querySelector('#new-grid-zone');
newGridBtn.addEventListener('click', displayNewGridForm);

const colorPicker = document.querySelector('#color-picker');
const historyPalette = document.querySelector('#history-palette');
colorPicker.addEventListener('change', (e) => {
  color = e.target.value;
  populateHistoryPalette(color);
  changeOpacity();
});

const opacityRange = document.querySelector('#opacity-range');
opacityRange.addEventListener('change', changeOpacity);

let mode = 'pen';

const paintModeSwitch = document.querySelector('#paint-mode-switch');
const paintModeSwitchText = document.querySelector('#paint-mode-switch-text');
paintModeSwitch.checked = false;
paintModeSwitch.addEventListener('click', () => {
  if (mode === 'fill') {
    // strangely, the checkbox is not really checked (maybe because the onclick="return false" on its parent label)
    paintModeSwitch.checked = false;
    paintModeSwitchText.textContent = 'Pen';
    mode = 'pen';
  } else {
    paintModeSwitch.checked = true;
    paintModeSwitchText.textContent = 'Fill';
    mode = 'fill';
  }
});

// default values
let color = colorPicker.value + 'ff';
updateColorPreview();
opacityRange.value = 100;

let gridUnit = 16;
gridCreation(gridUnit);

[
  '#eb4034',
  '#ebc934',
  '#49eb34',
  '#34b1eb',
  '#6b34eb',
  '#ffffff',
  '#000000',
].forEach((color) => populateHistoryPalette(color));
