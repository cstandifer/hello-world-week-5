let frank;
let sun;
let lightSlider;
let port;
let connectButton;

function setup() {
  createCanvas(400, 400);
  sun = new Sunbeam();
  frank = new Frank(190, 360);

  // a stand-in for the photoresistor, using the same range it gave in the lab
  lightSlider = createSlider(100, 800, 300);

  // the Arduino connection, and a button to start it
  port = createSerial();
  connectButton = createButton("Connect Arduino");
  connectButton.mousePressed(connectArduino);
}

function draw() {
  background(255);

  // the sun's strength comes from the Arduino if it's connected,
  // otherwise from the slider
  if (port.opened()) {
    let reading = port.readUntil("\n");
    if (reading.length > 0) {
      sun.strength = int(reading);
    }
  } else {
    sun.strength = lightSlider.value();
  }

  sun.display();

  frank.update(sun.strength);
  frank.display();
}

// runs when the button is clicked
function connectArduino() {
  port.open("Arduino", 9600);
}

// The light pouring in from the top right corner. It never moves:
// only its strength changes.
class Sunbeam {
  constructor() {
    this.strength = 0;   // 100 = dark, 800 = full sun
  }

  display() {
    // stronger light = a more solid beam
    let alpha = map(this.strength, 100, 800, 10, 200, true);
    noStroke();
    fill(250, 199, 117, alpha);
    quad(260, 0, 400, 0, 275, 360, 85, 360);
  }
}
