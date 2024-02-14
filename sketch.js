
let particles = [];
let cycle = 0; // Track the time since the start of the cycle

function setup() {
  createCanvas(500, 500);
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 25);
  cycle = (cycle + 1) % (60 * 10); // Complete cycle in 10 seconds (5 seconds in, 5 seconds out)

  for (let particle of particles) {
    particle.behave();
    particle.update();
    particle.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxspeed = 5;
    this.maxforce = 1;
    this.pickNewTarget();
  }

  pickNewTarget() {
    if (cycle < 300) { // First 5 seconds moving into the heart shape
      this.target = this.heartPosition(random(TWO_PI));
    } else { // Next 5 seconds moving out
      this.target = createVector(random(width), random(height));
    }
  }

  heartPosition(angle) {
    // Adjusted parametric heart equation for higher peaks
    let x = 16 * pow(sin(angle), 3);
    let y = -(13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle) - 0.5 * angle);
    // Scale and center the heart shape
    return createVector(x * 8 + width / 2, y * 7 + height / 3); // Adjusted for clearer shape
  }

  behave() {
    // Every 5 seconds, pick a new behavior (target position)
    if (cycle % 300 == 0) {
      this.pickNewTarget();
    }
  }

  update() {
    let steer = p5.Vector.sub(this.target, this.pos);
    steer.limit(this.maxforce);
    this.acc.add(steer);
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration
  }

  show() {
    stroke(255, 0, 100);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
  }
}
