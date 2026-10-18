let frank;

function setup() {
  createCanvas(400, 400);
  frank = new Frank(190, 360);
}

function draw() {
  background(255);
  frank.update();
  frank.display();
}
