# Frank

A virtual creature for Interaction Logic, week 5.

![Frank grumpy in the dark, and content in full sun](images/frank-dark-and-sun.png)

Frank is a grumpy little monster who really just wants some sun. He stands in a beam of light, and the stronger the light, the better his mood. In the dark his brows drop and he frowns. Bring him the light and he slowly comes around: his lids lift, he smiles, leans back, blushes a little, and gazes up at the sun.

**[Play with Frank](https://cstandifer.github.io/hello-world-week-5/)** · **[frank-sees-the-light in the p5 editor](https://editor.p5js.org/cstandifer/sketches/wrgvZmocd)** · **[Frank's Field Guide](https://cstandifer.github.io/hello-world-week-5/field-guide.html)**

## How Frank got here

I'll admit I got a little carried away. When this assignment came out, I built Frank a whole forest, with a cave, a sunbeam, glowing mushrooms, and a happy blob of a buddy named Frazzle who floats around and tries to hug him. That version lives in its own repo now: **[Frank & Frazzle](https://github.com/cstandifer/frank-and-frazzle)**.

It was fun to make, but it grew well past what I could explain line by line, and the point of this week is understanding classes. So for class I reined it in. I took Frank out of his environment, put him on a plain white background, and gave him one simple thing to respond to: light. He keeps his look from the forest version, and the new work here is his class, his mood logic, and connecting him to a real light sensor.

Frank also lives on my website, **[caitlinstandifer.com](https://www.caitlinstandifer.com)**. He wanders into the corner of the homepage, where you can poke him or rest your cursor on him for a hug, and he's the one who greets you on my 404 page. He checked the whole cave and couldn't find the page either, and he's not thrilled about being asked.

## How to play

| | How |
|---|---|
| **No Arduino** | Drag the slider under the canvas. Left is dark, right is full sun. |
| **With an Arduino** | Wire up the photoresistor (below), upload `arduino/frank_light`, close the Arduino Serial Monitor, then click **Connect Arduino** in Chrome and pick your board. Cover the sensor and he sulks. Shine a light on it and he perks up. |

Web Serial only works in Chrome or Edge.

## Wiring

Arduino Uno R3, a photoresistor, and a 10k resistor. The full breadboard diagram is in the [field guide](https://cstandifer.github.io/hello-world-week-5/field-guide.html#job4).

| Wire or part | From | To |
|---|---|---|
| Red | Arduino `5V` | Breadboard `+` rail |
| Black | Arduino `GND` | Breadboard `−` rail |
| Red jumper | `+` rail | `j10` |
| Photoresistor | `g10` | `g13` |
| 10k resistor | `h13` | `h18` |
| Black jumper | `j18` | `−` rail |
| Yellow | `i13` | Arduino `A0` |

In my lab room the sensor read in the 300s, under 100 when I covered it with a finger, and over 800 with my phone light right up close. Frank uses 100 to 800 as his range.

## How it's built

| File | What's in it |
|---|---|
| `frank.js` | The `Frank` class. The constructor sets up his properties, `update(light)` changes his mood each frame, and `display()` draws him from those numbers. A small `Blinker` class decides when he blinks. |
| `sketch.js` | Makes Frank and the sunbeam, reads the light from the slider or the Arduino, and asks Frank to update and draw himself. Also holds the small `Sunbeam` class. |
| `arduino/frank_light/` | The Arduino code: reads the photoresistor with `analogRead()` and sends the number over serial. |
| `field-guide.html` | My study guide (see below). |

His whole mood is one number, `anger`, from 1 (annoyed) to -1 (content). The light sets the mood he should be in with `map()`, and `lerp()` eases him toward it a little every frame, so he warms up gradually instead of snapping.

Serial in p5 uses the [p5.webserial](https://github.com/gohai/p5.webserial) library.

## Working with Claude

I used Claude as a partner on this one, mostly to help me understand what I was building. Since Frank's look came out of a pretty ambitious first version, I wanted to be able to explain the code I was turning in, not just have it work. Claude helped me break down the code, explained what each change I was typing actually did, and walked me through connecting a p5 sketch to an Arduino over serial. I typed the new pieces in myself, step by step.

**[Frank's Field Guide](https://cstandifer.github.io/hello-world-week-5/field-guide.html)** came out of that. It has a live Frank you can take apart, explanations of each part of the code, and my own notes and questions along the way.

### Prompts that mattered

> Let's move the Frank and Frazzle thing to its own repository and work on either Frank or Frazzle outside of their forest environment. I'd love to bring in the Arduino somehow. But it needs to be code that doesn't go beyond the basics I've been exploring so far. I need to be able to explain and understand what I'm doing.

> We are taking Frank out of his environment to a white background. The sunbeam won't move. Let's drop the mushroom for now. I think the photoresistor is enough.

> Do we need the slider? That's not a function I know, unless this is a basic thing I can pull from the references page on the p5.js site.

> I want to keep his look, but I need detailed help to understand how this works.

> I don't think we need trust for this. It's a little too complicated.
