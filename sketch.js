let frank;
let sun;
let lightSlider;

function setup() {
  createCanvas(400, 400);
  sun = new Sunbeam();
  frank = new Frank(190, 360);

  // a stand-in for the photoresistor: 0 to 1023, the same range
  // the Arduino's analogRead() gives us
  lightSlider = createSlider(0, 1023, 300);
}

function draw() {
  background(255);

  sun.strength = lightSlider.value();
  sun.display();

  frank.update();
  frank.display();
}

// The light pouring in from the top right corner. It never moves:
// only its strength changes.
class Sunbeam {
  constructor() {
    this.strength = 0;   // 0 = dark, 1023 = full sun
  }

  display() {
    // stronger light = a more solid beam
    let alpha = map(this.strength, 0, 1023, 10, 200);
    noStroke();
    fill(250, 199, 117, alpha);
    quad(260, 0, 400, 0, 275, 360, 85, 360);
  }
}
