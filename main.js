const canvas = document.querySelector("#draw");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 30;
ctx.strokeStyle = "#000000";
ctx.lineCap = "round";
let myLineWidth = 50;
ctx.lineWidth = myLineWidth;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let myColor;

/////      Color picker

const colorPicker = document.querySelectorAll(".color-picker");
const windowColor = document.querySelectorAll(".color-example");

colorPicker.forEach((element) => {
  let hue = Math.floor(Math.random() * 360);
  myPickerColor = hslToHex(hue, 50, 50);
  element.setAttribute("value", myPickerColor);
  element.previousElementSibling.style.backgroundColor = myPickerColor;
});
ctx.strokeStyle = colorPicker[0].value; //correct

colorPicker.forEach((element) => {
  element.oninput = function () {
    element.previousElementSibling.style.backgroundColor = this.value;
    myColor = this.value;
    updateSelectedPencil();
  };
});

windowColor.forEach((element) => {
  element.addEventListener("click", function () {
    myColor = element.style.backgroundColor;
    updateSelectedPencil();
  });
});
myColor = colorPicker[0].getAttribute("value"); // Set initial color to first Color picker
updateSelectedPencil();
// Convert HSL color to Hex
function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/////      Draw on canvas

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = myColor;
  ctx.lineWidth = myLineWidth;
  ctx.stroke();
  lastX = e.offsetX;
  lastY = e.offsetY;
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener("touchstart", (e) => {
  console.log(e);
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("mouseup", () => {
  console.log(myColor);
  isDrawing = false;
  console.log(myColor);
});
canvas.addEventListener("touchend", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));
canvas.addEventListener("click", (e) => {
  console.log("clicked");
  console.log(myColor);
  event.stopPropagation();
  ctx.beginPath();
  ctx.arc(e.offsetX, e.offsetY, 0, 0, 2 * Math.PI, false);
  ctx.fillStyle = myColor;
  ctx.fill();
  ctx.lineWidth = myLineWidth;
  ctx.strokeStyle = myColor;
  ctx.stroke();
});

/////   Size picker

function updateSelectedPencil() {
  const selected = document.querySelector(".selected");
  selected.style.border = `5px solid ${myColor}`;
}

const pencilSizeIcons = document.querySelectorAll(".pencil-size");

pencilSizeIcons.forEach((element) => {
  element.addEventListener("click", function () {
    myLineWidth = element.dataset.size;
    pencilSizeIcons.forEach((element) => {
      element.classList.remove("selected");
      element.style.border = "none";
    });
    element.classList.add("selected");
    updateSelectedPencil();
  });
});

/////   Clear canvas

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.clientHeight);
}

const clearButton = document.querySelector(".clear-canvas");
clearButton.addEventListener("click", clearCanvas);

///// Redraw canvas

function drawCanvas() {
  canvas.width = window.innerWidth - 30;
}

window.onresize = drawCanvas;
