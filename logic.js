const cellCreation = (colIndex, rowIndex) => {
  let cell = document.createElement('div');
  cell.style.backgroundColor = 'white';
  cell.style.gridColumn = colIndex;
  cell.style.gridRow = rowIndex;
  ['mouseover', 'mousedown'].forEach((event) =>
    cell.addEventListener(event, (e) => {
      if (e.buttons == 1) {
        e.target.style.backgroundColor = color;
      }
      if (e.buttons == 2) {
        e.target.style.backgroundColor = 'white';
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

// CSS Tricks converter
function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(')')[0].split(sep);

  // Convert %s to 0–255
  for (let R in rgb) {
    let r = rgb[R];
    if (r.indexOf('%') > -1)
      rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
  }

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return '#' + r + g + b;
}

const populateHistoryPalette = (colorValue) => {
  const colorCell = document.createElement('div');
  colorCell.classList.add('used-color');
  colorCell.style.background = colorValue;
  colorCell.addEventListener('click', (e) => {
    // the color from background style is in RGB, color input need an Hex color
    color = RGBToHex(e.target.style.backgroundColor);
    colorPicker.value = color;
  });
  if (historyPalette.children.length >= 21) {
    historyPalette.removeChild(historyPalette.lastElementChild);
  }
  historyPalette.prepend(colorCell);
};

let gridUnit = 16;
gridCreation(gridUnit);

// clear and create new grid
const newGridBtn = document.querySelector('#new-grid-btn');
newGridBtn.addEventListener('click', displayNewGridForm);

const colorPicker = document.querySelector('#color-picker');
const historyPalette = document.querySelector('#history-palette');
let color = colorPicker.value;
colorPicker.addEventListener('change', (e) => {
  color = e.target.value;
  populateHistoryPalette(e.target.value);
});

// default color palette
[
  '#eb4034',
  '#ebc934',
  '#49eb34',
  '#34b1eb',
  '#6b34eb',
  '#ffffff',
  '#000000',
].forEach((color) => populateHistoryPalette(color));
