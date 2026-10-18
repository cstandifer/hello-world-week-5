# My notes on Frank

Notes I'm keeping as I learn how this sketch works. Each one is my understanding,
with a short clarification underneath where I had something slightly off.

Study guide with a live Frank: Frank's Field Guide (Claude artifact).

## Classes

**Frank and frank.** Frank with a capital F comes from the `frank.js` file. Lowercase
`frank` is the Frank on this sketch.

> Clarified: `Frank` is the class, the recipe. `frank` is one Frank built from that
> recipe with `new Frank(190, 360)`. He gets the starting properties the constructor
> gives every Frank. The only things the sketch hands him are 190 and 360, which say
> where he stands. ("Properties" is the word for his attributes.)

My understanding now: he's the same Frank the recipe describes, just with a new position.

> Confirmed.

**Sunbeam.** Same idea as Frank: `Sunbeam` is the class, `sun` is the one sunbeam.

> Clarified: the `Sunbeam` class is at the bottom of `sketch.js`, not in `frank.js`.

**lightSlider.** New to this sketch.

> Clarified: it isn't a class. `createSlider()` is a p5 function (on the p5 reference
> under DOM) that makes a slider, and `lightSlider` is the variable that holds it.
> `lightSlider.value()` asks where it's set.

## setup() and draw()

**draw().** The example on the p5 reference uses a mouse click. I know alpha and
transparency from last week's homework, and that's what the sunbeam uses.

> Clarified: `draw()` runs over and over, about 60 times a second. The sunbeam's
> `fill(250, 199, 117, alpha)` uses the fourth number for transparency, and `map()`
> turns the light strength (0 to 1023) into that alpha.

**frank.update() and frank.display().** These come from the Frank class.

> Clarified: they're methods written inside the `Frank` class in `frank.js`.
> `sketch.js` calls them on its Frank every frame: first update his numbers, then
> draw him.

## Frank's mood

**anger.** The guide shows anger and annoyed, but my sketch doesn't make him change.

> Clarified: `this.anger` starts at 0 and nothing changes it yet, so he looks the
> same. Job 3 adds the code that lets the light change it. To see the idea now,
> change `this.anger = 0;` in `frank.js` to `1` or `-1`.

## Job 3: light becomes mood

**map().** Makes sense! It stretches the light (0 to 1023) onto his mood (0.8 to -1).
Around 800 he's already content, which is good because you don't have to push the
slider all the way over.

**lerp().** This is great. I hate snapping animation, so this is a good one to
remember. I changed the speed to 0.5 to really see the difference.

> Clarified: at 0.5 he covers half the remaining distance every frame, so he gets
> there in a few frames, close to a snap. Smaller numbers make him slower to change
> his mind (0.03 takes about a second, 0.005 takes several).

**Question for later:** how well will the photoresistor work?

> To check in job 5: real sensors rarely use the full 0 to 1023. We'll read its actual
> lowest and highest values in the room and use those in `map()` instead.

## Words that aren't p5

`class`, `constructor`, `new`, and `this` are JavaScript, not p5, so most of them
aren't on the p5 reference. The p5 reference mentions them under Foundation →
`class`, and MDN has a page for each.
