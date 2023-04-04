Workouts maps.
=======================================

html, css, javaScript, leaflet.

Main goal -> add workouts on map + localstorage.


* * *
### [Demo](https://cold-world.github.io/workout-maps/)

![Alt Text](https://i.ibb.co/yQpLtCm/2.gif)

* * *



### A piece of code

```
class Running extends Workout {
  constructor(distance, duration, coords, cadence, type) {
    super(distance, duration, coords, type);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
```

### Download & Installation

```shell 
git clone https://github.com/cold-world/workout-maps.git
```
