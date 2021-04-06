// CSS Tricks converter
function hexAToRGBA(h) {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (h.length == 5) {
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];
    a = '0x' + h[4] + h[4];
  } else if (h.length == 9) {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
    a = '0x' + h[7] + h[8];
  }
  a = +(a / 255).toFixed(3);

  return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + a + ')';
}

function RGBAToHex(rgba) {
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
  let newColor;

  if (color2[7] == undefined || (color2[7] == 'f' && color2[8] == 'f')) {
    return color2;
  } else {
    let r1 = +('0x' + color1[1] + color1[2]);
    let g1 = +('0x' + color1[3] + color1[4]);
    let b1 = +('0x' + color1[5] + color1[6]);
    let a1 = +('0x' + color1[7] + color1[8]);

    let r2 = +('0x' + color2[1] + color2[2]);
    let g2 = +('0x' + color2[3] + color2[4]);
    let b2 = +('0x' + color2[5] + color2[6]);
    let a2 = +('0x' + color2[7] + color2[8]);

    a1 = (a1 / 255).toFixed(2);
    a2 = (a2 / 255).toFixed(2);

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
    console.log(mix);
    // define here how the color are added (?)
    // const opacityPercent = +(a2 / 255).toFixed(3);
    // let a3 = 1 - (1 - +a2) * (1 - +a1);
    // let r3 = Math.round((+r2 * +a2) / +a3 + (+r1 * +a1 * (1 - +a2)) / +a3);
    // let g3 = Math.round((+g2 * +a2) / +a3 + (+g1 * +a1 * (1 - +a2)) / +a3);
    // let b3 = Math.round((+b2 * +a2) / +a3 + (+b1 * +a1 * (1 - +a2)) / +a3);
    // // let r3 = Math.round(+r1 + +r2 * opacityPercent);
    // // let g3 = Math.round(+g1 + +g2 * opacityPercent);
    // // let b3 = Math.round(+b1 + +b2 * opacityPercent);
    // // let a3 = +a2;
    // if (r3 > 255) r3 = r3 - 255;
    // if (g3 > 255) g3 = g3 - 255;
    // if (b3 > 255) b3 = b3 - 255;
    // // if (a3 > 255) a3 = 255;

    newColor =
      '#' +
      mix[0].toString(16) +
      mix[1].toString(16) +
      mix[2].toString(16) +
      Math.round(mix[3] * 255).toString(16);

    return newColor;
  }
}

const cellCreation = (colIndex, rowIndex) => {
  let cell = document.createElement('div');
  cell.style.backgroundColor = '#ffffff00';
  cell.style.gridColumn = colIndex;
  cell.style.gridRow = rowIndex;
  ['mouseover', 'mousedown'].forEach((event) =>
    cell.addEventListener(event, (e) => {
      if (e.buttons == 1) {
        const precColor = RGBAToHex(e.target.style.backgroundColor);

        const resultColor = addHexColor(precColor, color);
        console.log(precColor, color, resultColor);
        e.target.style.backgroundColor = resultColor;
      }
      if (e.buttons == 2) {
        e.target.style.backgroundColor = '#ffffff00';
      }
    })
  );
  return cell;
};

const gridCreation = (gridUnit) => {
  const grid = document.querySelector('#grid');
  grid.style.gridTemplateColumns = `repeat(${gridUnit}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridUnit}, 1fr)`;
  grid.addEventListener('contextmenu', (e) => e.preventDefault());

  let col = 1;
  let row = 1;
  for (i = 1; i <= gridUnit ** 2; i++) {
    const newCell = cellCreation(col, row);
    grid.appendChild(newCell);
    col++;
    if (col > gridUnit) {
      row++;
      col -= gridUnit;
    }
  }
};

const GenerateNewGrid = (newGridUnit) => {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  gridCreation(newGridUnit);
};

const createNewGridForm = () => {
  const form = document.createElement('form');
  form.id = 'new-grid-form';

  const rangeLabel = document.createElement('label');
  rangeLabel.setAttribute('for', 'new-grid-size-input');
  const rangeInput = document.createElement('input');
  rangeInput.type = 'range';
  rangeInput.min = '4';
  rangeInput.max = '100';
  rangeInput.value = '50';
  rangeInput.id = 'new-grid-size-input';
  rangeInput.name = 'new-grid-size-input';
  const rangeP = document.createElement('p');
  rangeP.textContent = rangeInput.value;
  rangeInput.addEventListener('input', () => {
    rangeP.textContent = rangeInput.value;
  });
  rangeLabel.append('Grid size:', rangeP, rangeInput);

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
    newGridForm.replaceWith(newGridBtn);
  });
  newGridBtn.replaceWith(newGridForm);
};

const populateHistoryPalette = (colorValue) => {
  const colorCell = document.createElement('div');
  colorCell.classList.add('used-color');
  colorCell.style.background = colorValue;
  colorCell.addEventListener('click', (e) => {
    // the color from background style is in RGB, color input need an Hex color
    // console.log(e.target.style.backgroundColor);
    color = RGBAToHex(e.target.style.backgroundColor);
    // apply current opacity to the color
    // changeOpacity();
    // or reset opacityRange value
    opacityRange.value = 100;
    colorPicker.value = color.substr(0, 7);
    // console.log(color);
  });
  if (historyPalette.children.length >= 21) {
    historyPalette.removeChild(historyPalette.lastElementChild);
  }
  historyPalette.prepend(colorCell);
};

const changeOpacity = () => {
  const opacityValue = opacityRange.value / 100;

  let hexValue = Math.round(+opacityValue * 255).toString(16);
  if (hexValue.length == 1) hexValue = '0' + hexValue;

  if (color.length > 7) {
    color = color.substring(0, 7);
  }
  color += hexValue;
};

const newGridBtn = document.querySelector('#new-grid-btn');
newGridBtn.addEventListener('click', displayNewGridForm);

const colorPicker = document.querySelector('#color-picker');
const historyPalette = document.querySelector('#history-palette');
colorPicker.addEventListener('change', (e) => {
  color = e.target.value;
  populateHistoryPalette(color);
});

const opacityRange = document.querySelector('#opacityRange');
opacityRange.addEventListener('change', changeOpacity);

// default values
let color = colorPicker.value;
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
