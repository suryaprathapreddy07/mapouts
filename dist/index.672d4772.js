'use strict';
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
//creating workout
//creating parent workout class
class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(distance, duration, coords){
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
    }
    _setDescription() {
        // prettier-ignore
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
            'December'
        ];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}
//creating child class (running)
class Running extends Workout {
    type = 'running';
    constructor(distance, duration, coords, cadence){
        super(distance, duration, coords);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }
    calcPace() {
        this.pace = this.duration / this.distance;
    }
}
//creating chhild class  (Cycling)
class Cycling extends Workout {
    type = 'cycling';
    constructor(distance, duration, coords, elevationGain){
        super(distance, duration, coords);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
    }
}
///////////Refactoring project architecture
//create a class called 'App
class App {
    #map;
    #mapEvent;
    #workouts = [];
    clicks = 0;
    constructor(){
        this._getPosition();
        this._getLocalStorage();
        form.addEventListener('submit', this._newWorkout.bind(this));
        //implementing change in inputs 
        inputType.addEventListener('change', this._toggleElevationField.bind(this));
        //implementing moving to marker when we clicked on workout
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }
    //methods
    _getPosition() {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
            alert('could not get your position');
        });
    }
    _loadMap(position) {
        //displaying map
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const cords = [
            latitude,
            longitude
        ];
        // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);//link to my current loction in google maps.
        // console.log(latitude, longitude);
        this.#map = L.map('map').setView(cords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this));
        this.#workouts.forEach((work)=>this.renderWorkoutMarker(work)
        );
    }
    _showForm(mapE) {
        //creating marker on click
        form.classList.remove('hidden');
        inputDistance.focus();
        this.#mapEvent = mapE;
    }
    _hideForm() {
        inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(()=>form.style.display = 'grid'
        , 1000);
    }
    _toggleElevationField() {
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout(e) {
        e.preventDefault();
        let workout;
        //create helper functions for validations
        const validInputs = (...inputs)=>inputs.every((ele)=>Number.isFinite(ele)
            )
        ;
        const positiveInuts = (...inputs)=>inputs.every((ele)=>ele > 0
            )
        ;
        //get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat , lng  } = this.#mapEvent.latlng;
        const coords = [
            lat,
            lng
        ];
        //if activity is running create runnning object
        if (type == 'running') {
            const type = 'running';
            const cadence = +inputCadence.value;
            //check data is valid
            if (!validInputs(distance, duration, cadence) || !positiveInuts(distance, duration, cadence)) return alert('The inputs must be a positive integers ');
            workout = new Running(distance, duration, coords, cadence);
        }
        //if activity is cycling create cycling object
        if (type == 'cycling') {
            const type = 'cycling';
            const elevationGain = +inputElevation.value;
            if (!validInputs(distance, duration) || !positiveInuts(distance, duration)) return alert('the inputs must be a positive integers ');
            workout = new Cycling(distance, duration, coords, elevationGain);
        }
        //Add new object to workout array
        this.#workouts.push(workout);
        //invoking renderWorkout method
        this.renderWorkout(workout);
        this.renderWorkoutMarker(workout);
        //hide form and clear input fields 
        this._hideForm();
        //invoke local storage data
        this._setLocalStorage();
    }
    renderWorkoutMarker(workout) {
        //render workout on map as a markeer
        L.marker(workout.coords, {
            riseOnHover: true
        }).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 200,
            maxHeight: 30,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`
        })).setPopupContent(`${workout.description}`).openPopup();
    }
    //Render workout on list 
    renderWorkout(workout) {
        let html = ` <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;
        //implementing cadence and elevation
        if (workout.type === 'running') html += ` <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">17${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
        if (workout.type === 'cycling') html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
        form.insertAdjacentHTML("afterend", html);
    }
    //_moveToPopup method
    _moveToPopup(e) {
        if (!this.#map) return;
        const workoutEl = e.target.closest('.workout');
        // console.log(workoutEl);
        if (!workoutEl) return;
        const workout = this.#workouts.find((work)=>work.id === workoutEl.dataset.id
        );
        this.#map.setView(workout.coords, '13', {
            animation: true,
            pan: {
                duration: 1
            }
        });
        this._countClicks();
    }
    _countClicks() {
        this.clicks++;
        console.log(this.clicks);
    }
    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }
    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));
        console.log(data);
        if (!data) return;
        this.#workouts = data;
        this.#workouts.forEach((work)=>{
            this.renderWorkout(work);
        });
    }
}
const app = new App(); //End of project

//# sourceMappingURL=index.672d4772.js.map
