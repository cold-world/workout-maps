const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(distance, duration, coords, type) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.type = type;
  }
}

class Running extends Workout {
  constructor(distance, duration, coords, cadence, type) {
    super(distance, duration, coords, type);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(distance, duration, coords, elevationGain, type) {
    super(distance, duration, coords, type);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////////////////////////////////////
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
        alert('Could not get your position 😢');
      });
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);
    this.#map.on('click', this._showForm.bind(this));
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    form.classList.add('hidden');
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const validateForNaN = (...inputs) => {
      return inputs.every((item) => Number.isFinite(item));
    };
    const validateForAbsNum = (...inputs) => {
      return inputs.every((item) => item > 0);
    };

    const type = inputType.value;
    const cadence = +inputCadence.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const elevation = +inputElevation.value;
    let workout;
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];

    if (type === 'running') {
      if (
        !validateForNaN(cadence, distance, duration) ||
        !validateForAbsNum(cadence, distance, duration)
      ) {
        return alert('Only positive numbers please');
      }
      workout = new Running(distance, duration, coords, cadence, type);
    }

    if (type === 'cycling') {
      if (
        !validateForNaN(elevation, distance, duration) ||
        !validateForAbsNum(distance, duration)
      ) {
        return alert('Only positive numbers please, except elevation');
      }
      workout = new Cycling(distance, duration, coords, elevation, type);
    }
    this.#workouts.push(workout);
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    this._addMarker(workout.type, coords);
    this._hideForm();
  }
  _addMarker(type, coords) {
    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`,
        })
      )
      .setPopupContent(type.at(0).toUpperCase() + type.slice(1))
      .openPopup();
  }
}

const app = new App();
