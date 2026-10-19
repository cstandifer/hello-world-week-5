// Frank: a grumpy little monster who just wants some sun.
// His look is carried over from Frank & Frazzle. The cave, walking, poking,
// mushrooms, and hugs are gone: here he just stands, breathes, and blinks.

class Frank {
  constructor(x, y) {
    this.x = x;         // center between his feet
    this.y = y;         // the ground he stands on
    this.size = 120;    // everything scales from this

    // mood: 1 = annoyed, 0 = indifferent, -1 = content
    this.anger = 0;

    // idle life
    this.breath = 0;                       // -1 to 1, slowly in and out
    this.blinker = new Blinker(2500, 6000);
    this.lookX = 0;                        // where his pupils point, -1 to 1
    this.lookY = 0;

    this.bodyColor = color(190, 60, 55);
    this.darkColor = color(120, 30, 30);
    this.lidColor = color(160, 45, 42);
    this.lipColor = color(140, 35, 45);
    this.bellyColor = color(215, 115, 90);

    // All shapes below are [x, y] as fractions of his size, measured from
    // the bottom of his body. He faces right: +x is his front.

    // plump body: rounded top that's highest toward the back (a slight
    // slouch), and a front that curves smoothly around his belly
    this.bodyPts = [
      [0.08, 0], [0.4, -0.08], [0.5, -0.3], [0.48, -0.56],
      [0.41, -0.8], [0.25, -1.0], [0.0, -1.09], [-0.26, -1.02],
      [-0.42, -0.78], [-0.45, -0.44], [-0.37, -0.12], [-0.17, -0.01],
    ];

    // spikes along his back: [x, y, length]
    this.spikes = [
      [-0.08, -1.08, 0.07], [-0.18, -1.05, 0.09], [-0.28, -1.0, 0.09],
      [-0.38, -0.86, 0.08], [-0.43, -0.72, 0.07], [-0.45, -0.52, 0.05],
    ];

    // messy hair: [rootX, lean, length, curl], rooted at the top of his head
    this.hairRoot = [0.15, -1.01];
    this.hair = [
      [-0.07, -0.7, 0.14, 0.5],
      [-0.04, -0.3, 0.2, -0.6],
      [-0.01, -0.05, 0.24, 0.7],
      [0.02, 0.25, 0.18, -0.5],
      [0.05, 0.6, 0.16, 0.6],
      [0.08, 0.95, 0.11, -0.4],
      [0.0, 0.45, 0.13, 0.8],
    ];

    // scales: rows of little arcs over his back, skipping his face and belly
    this.scales = [];
    for (let row = 0; row < 16; row++) {
      let y = -1.12 + row * 0.065;
      let offset = (row % 2) * 0.045;
      for (let x = -0.55 + offset; x < 0.35; x += 0.09) {
        let onFace = dist(x, y, 0.17, -0.72) < 0.28;
        let onBelly = dist(x, y, 0.25, -0.28) < 0.26;
        if (!onFace && !onBelly) this.scales.push([x, y]);
      }
    }
  }

  // LOGIC: changes the numbers, once every frame.
  // light comes from sketch.js: 100 = dark, 800 = full sun
  update(light) {
    // dark (100) makes him annoyed, full sun (800) makes him content
    let targetAnger = map(light, 100, 800, 0.8, -1, true);

    // ease toward that a little every frame, so his mood shifts gradually
    this.anger = lerp(this.anger, targetAnger, 0.03);

    this.blinker.update();

    // slow, heavy breathing (one breath about every 3.5 seconds)
    this.breath = sin(millis() * 0.0018);

    // his eyes follow the mouse, but when he's content he gazes up at the sun
    let goalX;
    let goalY;
    if (this.anger < -0.4) {
      goalX = 0.6;
      goalY = -1;
    } else {
      let headY = this.y - this.size;
      goalX = constrain((mouseX - this.x) / 160, -1, 1);
      goalY = constrain((mouseY - headY) / 160, -1, 1);
    }
    this.lookX = lerp(this.lookX, goalX, 0.12);
    this.lookY = lerp(this.lookY, goalY, 0.12);
  }

  // DRAWING: uses the numbers to draw him
  display() {
    let s = this.size;
    let legH = s * 0.18;
    let bottom = -legH;   // y of the bottom of his body

    push();
    translate(this.x, this.y);   // (0, 0) is now the spot between his feet

    // soft shadow on the ground
    noStroke();
    fill(0, 0, 0, 45);
    ellipse(s * 0.03, 0, s * 0.8, s * 0.1);

    // order matters: legs first so the body covers their tops
    this.drawLegs(s, legH);

    // breathing: everything above his legs gets a little taller and narrower
    // as he breathes in. When he's content, he leans back toward the light.
    let bliss = max(0, -this.anger);   // 0 to 1, how content he is
    push();
    translate(0, bottom);
    rotate(-0.12 * bliss);
    scale(1 - 0.012 * this.breath, 1 + 0.022 * this.breath);
    translate(0, -bottom);

    this.drawSpikes(s, bottom);
    this.drawHair(s, bottom);

    // body, then everything that sits on its surface
    noStroke();
    fill(this.bodyColor);
    this.bodyOutline(s, bottom);

    push();
    // clip to the body so belly, scales, and face never spill past his edges
    beginClip();
    this.bodyOutline(s, bottom);
    endClip();
    this.drawBelly(s, bottom);
    this.drawScales(s, bottom);
    this.drawFace(s, bottom);
    pop();

    pop(); // end of breathing
    pop();
  }

  bodyOutline(s, bottom) {
    let pts = this.bodyPts;
    beginShape();
    // curveVertex needs to wrap past the start to close the shape smoothly
    for (let i = -1; i <= pts.length + 1; i++) {
      let [x, y] = pts[(i + pts.length) % pts.length];
      curveVertex(x * s, bottom + y * s);
    }
    endShape();
  }

  drawLegs(s, legH) {
    let legW = s * 0.11;
    // far leg (behind, a bit darker), then near leg
    let legs = [
      [-s * 0.1, lerpColor(this.darkColor, color(0), 0.25)],
      [s * 0.17, this.darkColor],
    ];
    for (let [lx, c] of legs) {
      let hipY = -legH - s * 0.06;   // hidden under his body
      let ankleY = -s * 0.04;
      stroke(c);
      strokeWeight(legW);
      line(lx, hipY, lx, ankleY);

      // foot, toes forward
      noStroke();
      fill(c);
      ellipse(lx + legW * 0.4, ankleY + s * 0.005, legW * 2, s * 0.07);

      // two little claws
      fill(240, 230, 210);
      let toeX = lx + legW * 1.3;
      for (let cy of [-s * 0.055, -s * 0.02]) {
        triangle(
          toeX - s * 0.02, cy - s * 0.015,
          toeX - s * 0.02, cy + s * 0.015,
          toeX + s * 0.03, cy + s * 0.01
        );
      }
    }
  }

  drawSpikes(s, bottom) {
    noStroke();
    fill(this.darkColor);
    for (let [x, y, len] of this.spikes) {
      // point each spike away from the middle of his body
      let n = createVector(x, y + 0.55).normalize();
      let side = createVector(-n.y, n.x).mult(0.045);
      let base = createVector(x, y).sub(n.copy().mult(0.04));
      let tip = createVector(x, y).add(n.copy().mult(len));
      triangle(
        (base.x + side.x) * s, bottom + (base.y + side.y) * s,
        (base.x - side.x) * s, bottom + (base.y - side.y) * s,
        tip.x * s, bottom + tip.y * s
      );
    }
  }

  drawHair(s, bottom) {
    stroke(this.darkColor);
    strokeWeight(s * 0.035);
    noFill();
    let [hx, hy] = this.hairRoot;
    let i = 0;
    for (let [rootX, lean, len, curl] of this.hair) {
      // each strand sways a tiny bit, a little out of step with the others
      lean += 0.06 * sin(millis() * 0.002 + i);
      i++;
      let x1 = (hx + rootX) * s;
      let y1 = bottom + hy * s;
      // tip of the strand, pointing in the direction it leans
      let x4 = x1 + sin(lean) * len * s;
      let y4 = y1 - cos(lean) * len * s;
      // control points: halfway up, then pulled sideways to curl the tip
      let x2 = x1 + sin(lean) * len * s * 0.5;
      let y2 = y1 - cos(lean) * len * s * 0.5;
      let x3 = x4 + cos(lean) * curl * len * s;
      let y3 = y4 + sin(lean) * curl * len * s;
      bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    }
  }

  drawBelly(s, bottom) {
    let cx = s * 0.25;
    let cy = bottom - s * 0.28;
    let w = s * 0.46;
    let h = s * 0.44;
    noStroke();
    fill(this.bellyColor);
    ellipse(cx, cy, w, h);

    // curved lines across the belly, like reptile belly plates
    stroke(this.darkColor);
    strokeWeight(s * 0.012);
    noFill();
    for (let k of [-0.1, 0, 0.1]) {
      let plateW = w * sqrt(1 - sq(k / (h / s / 2))) * 0.9;
      arc(cx, cy + k * s, plateW, s * 0.08, 0, PI);
    }
  }

  drawScales(s, bottom) {
    stroke(red(this.darkColor), green(this.darkColor), blue(this.darkColor), 140);
    strokeWeight(s * 0.012);
    noFill();
    for (let [x, y] of this.scales) {
      arc(x * s, bottom + y * s, s * 0.09, s * 0.08, 0, PI);
    }
  }

  drawFace(s, bottom) {
    // three-quarter view: the near eye is bigger and closer to the middle,
    // the far eye is smaller and squished toward the front edge
    this.drawEye(s * 0.03, bottom - s * 0.8, s * 0.19, s * 0.19, 1, s);
    this.drawEye(s * 0.24, bottom - s * 0.8, s * 0.12, s * 0.16, -1, s);
    this.drawMouth(s * 0.18, bottom - s * 0.6, s * 0.3, s);

    // a soft blush on his cheeks when he's content
    let blush = max(0, -this.anger);
    if (blush > 0.01) {
      noStroke();
      fill(255, 160, 170, 90 * blush);
      ellipse(-s * 0.02, bottom - s * 0.66, s * 0.14, s * 0.07);
      ellipse(s * 0.32, bottom - s * 0.67, s * 0.08, s * 0.06);
    }
  }

  // inward: which direction (+1 or -1) points to the space between his eyes
  drawEye(cx, cy, w, h, inward, s) {
    // eyeball and pupil (lookX and lookY slide the pupil around)
    noStroke();
    fill(255);
    ellipse(cx, cy, w, h);
    fill(30);
    let px = cx + w * (0.05 + 0.2 * this.lookX);
    let py = cy + h * (0.12 + 0.15 * this.lookY);
    ellipse(px, py, w * 0.42, h * 0.42);

    // heavy eyelid: a slice off the top of the eye, with a slanted edge
    // that sits lower toward the middle of his face. When he's content
    // the lid relaxes: it lifts up and levels out so he can gaze at the sun.
    let bliss = max(0, -this.anger);
    let start = inward > 0 ? PI + 0.35 : PI - 0.15;
    let stop = inward > 0 ? TWO_PI + 0.15 : TWO_PI - 0.35;
    start = lerp(start, PI + 0.6, bliss);
    stop = lerp(stop, TWO_PI - 0.6, bliss);
    fill(this.lidColor);
    stroke(this.darkColor);
    strokeWeight(s * 0.015);
    arc(cx, cy, w, h, start, stop, CHORD);

    // blinking: a lid slides down over the eye
    let b = this.blinker.amount();
    if (b > 0) {
      let k = lerp(-0.25, HALF_PI, b);
      arc(cx, cy, w, h, PI - k, TWO_PI + k, CHORD);
    }

    // brow, slanting down toward the middle: steeper when he's annoyed,
    // nearly flat when he's content
    let a = this.anger;
    strokeWeight(s * 0.05);
    line(
      cx - inward * w * 0.55, cy - h * (0.8 + 0.1 * a),
      cx + inward * w * 0.45, cy - h * (0.5 - 0.15 * a)
    );
  }

  drawMouth(cx, mouthY, w, s) {
    // corners droop down into a frown, deeper when he's annoyed. When he's
    // content they turn up and the middle dips, into a small smile.
    let annoyed = max(0, this.anger);
    let bliss = max(0, -this.anger);
    let cornerY = mouthY + s * (0.05 + 0.03 * annoyed - 0.08 * bliss);
    let peakY = mouthY - s * (0.04 + 0.015 * annoyed - 0.06 * bliss);

    push();
    translate(cx, 0);
    noStroke();
    fill(this.lipColor);

    // top lip: its top edge, then back along where the lips meet
    beginShape();
    vertex(-w / 2, cornerY);
    bezierVertex(-w * 0.2, peakY - s * 0.1, w * 0.2, peakY - s * 0.1, w / 2, cornerY);
    bezierVertex(w * 0.2, peakY, -w * 0.2, peakY, -w / 2, cornerY);
    endShape(CLOSE);

    // bottom lip: where the lips meet, then back along its bottom edge
    beginShape();
    vertex(-w / 2, cornerY);
    bezierVertex(-w * 0.2, peakY, w * 0.2, peakY, w / 2, cornerY);
    bezierVertex(w * 0.2, peakY + s * 0.13, -w * 0.2, peakY + s * 0.13, -w / 2, cornerY);
    endShape(CLOSE);

    // finds the y of the line where his lips meet at a given x, by searching
    // along the curve until its x matches (bezier x and t aren't evenly spaced)
    let lipLineY = (x) => {
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 20; i++) {
        let mid = (lo + hi) / 2;
        if (bezierPoint(-w / 2, -w * 0.2, w * 0.2, w / 2, mid) < x) lo = mid;
        else hi = mid;
      }
      return bezierPoint(cornerY, peakY, peakY, cornerY, lo);
    };

    // pointy bottom tooth: its base sits right on the lip line,
    // and its tip pokes up over his top lip
    let toothX = w * 0.18;
    let tw = s * 0.075;
    let th = s * 0.1;
    let leftX = toothX - tw / 2;
    let rightX = toothX + tw / 2;
    fill(250, 245, 225);
    triangle(
      leftX, lipLineY(leftX),
      rightX, lipLineY(rightX),
      toothX, lipLineY(toothX) - th
    );

    // the line where his lips meet (drawn last so it neatly covers
    // the bottom edge of the tooth)
    stroke(80, 15, 25);
    strokeWeight(s * 0.02);
    noFill();
    bezier(-w / 2, cornerY, -w * 0.2, peakY, w * 0.2, peakY, w / 2, cornerY);

    pop();
  }
}

// A small helper class: decides when Frank blinks.
class Blinker {
  constructor(minGap, maxGap) {
    this.minGap = minGap;      // shortest wait between blinks (milliseconds)
    this.maxGap = maxGap;      // longest wait
    this.duration = 160;       // how long one blink takes
    this.startedAt = -1000;
    this.nextAt = millis() + random(minGap, maxGap);
  }

  update() {
    if (millis() > this.nextAt) {
      this.startedAt = millis();
      // now and then, a quick double blink
      if (random() < 0.2) this.nextAt = millis() + 260;
      else this.nextAt = millis() + random(this.minGap, this.maxGap);
    }
  }

  // 0 = eyes open, 1 = fully shut
  amount() {
    let t = (millis() - this.startedAt) / this.duration;
    if (t < 0 || t > 1) return 0;
    return sin(t * PI);   // closes, then opens again
  }
}
