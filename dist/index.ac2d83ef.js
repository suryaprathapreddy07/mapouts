"use strict";const form=document.querySelector(".form"),containerWorkouts=document.querySelector(".workouts"),inputType=document.querySelector(".form__input--type"),inputDistance=document.querySelector(".form__input--distance"),inputDuration=document.querySelector(".form__input--duration"),inputCadence=document.querySelector(".form__input--cadence"),inputElevation=document.querySelector(".form__input--elevation");class Workout{date=new Date;id=(Date.now()+"").slice(-10);constructor(t,e,o){this.distance=t,this.duration=e,this.coords=o}_setDescription(){this.description=`${this.type[0].toUpperCase()}${this.type.slice(1)} on ${["January","February","March","April","May","June","July","August","September","October","November","December"][this.date.getMonth()]} ${this.date.getDate()}`}}class Running extends Workout{type="running";constructor(t,e,o,s){super(t,e,o),this.cadence=s,this.calcPace(),this._setDescription()}calcPace(){this.pace=this.duration/this.distance}}class Cycling extends Workout{type="cycling";constructor(t,e,o,s){super(t,e,o),this.elevationGain=s,this.calcSpeed(),this._setDescription()}calcSpeed(){this.speed=this.distance/(this.duration/60)}}class App{#t;#e;#o=[];clicks=0;constructor(){this._getPosition(),this._getLocalStorage(),form.addEventListener("submit",this._newWorkout.bind(this)),inputType.addEventListener("change",this._toggleElevationField.bind(this)),containerWorkouts.addEventListener("click",this._moveToPopup.bind(this))}_getPosition(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),(function(){alert("could not get your position")}))}_loadMap(t){const e=[t.coords.latitude,t.coords.longitude];this.#t=L.map("map").setView(e,13),L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.#t),this.#t.on("click",this._showForm.bind(this)),this.#o.forEach((t=>this.renderWorkoutMarker(t)))}_showForm(t){form.classList.remove("hidden"),inputDistance.focus(),this.#e=t}_hideForm(){inputCadence.value=inputDistance.value=inputDuration.value=inputElevation.value="",form.style.display="none",form.classList.add("hidden"),setTimeout((()=>form.style.display="grid"),1e3)}_toggleElevationField(){inputCadence.closest(".form__row").classList.toggle("form__row--hidden"),inputElevation.closest(".form__row").classList.toggle("form__row--hidden")}_newWorkout(t){let e;t.preventDefault();const o=(...t)=>t.every((t=>Number.isFinite(t))),s=(...t)=>t.every((t=>t>0)),n=inputType.value,i=+inputDistance.value,a=+inputDuration.value,{lat:r,lng:c}=this.#e.latlng,u=[r,c];if("running"==n){const t=+inputCadence.value;if(!o(i,a,t)||!s(i,a,t))return alert("The inputs must be a positive integers ");e=new Running(i,a,u,t)}if("cycling"==n){const t=+inputElevation.value;if(!o(i,a)||!s(i,a))return alert("the inputs must be a positive integers ");e=new Cycling(i,a,u,t)}this.#o.push(e),this.renderWorkout(e),this.renderWorkoutMarker(e),this._hideForm(),this._setLocalStorage()}renderWorkoutMarker(t){L.marker(t.coords,{riseOnHover:!0}).addTo(this.#t).bindPopup(L.popup({maxWidth:200,maxHeight:30,autoClose:!1,closeOnClick:!1,className:`${t.type}-popup`})).setPopupContent(`${t.description}`).openPopup()}renderWorkout(t){let e=` <li class="workout workout--${t.type}" data-id="${t.id}">\n        <h2 class="workout__title">${t.description}</h2>\n        <div class="workout__details">\n          <span class="workout__icon">${"running"===t.type?"🏃‍♂️":"🚴‍♀️"}</span>\n          <span class="workout__value">${t.distance}</span>\n          <span class="workout__unit">km</span>\n        </div>\n        <div class="workout__details">\n          <span class="workout__icon">⏱</span>\n          <span class="workout__value">${t.duration}</span>\n          <span class="workout__unit">min</span>\n        </div>`;"running"===t.type&&(e+=` <div class="workout__details">\n            <span class="workout__icon">⚡️</span>\n            <span class="workout__value">${t.pace}</span>\n            <span class="workout__unit">min/km</span>\n          </div>\n          <div class="workout__details">\n            <span class="workout__icon">🦶🏼</span>\n            <span class="workout__value">17${t.cadence}</span>\n            <span class="workout__unit">spm</span>\n          </div>\n        </li>`),"cycling"===t.type&&(e+=`<div class="workout__details">\n            <span class="workout__icon">⚡️</span>\n            <span class="workout__value">${t.speed}</span>\n            <span class="workout__unit">km/h</span>\n          </div>\n          <div class="workout__details">\n            <span class="workout__icon">⛰</span>\n            <span class="workout__value">${t.elevationGain}</span>\n            <span class="workout__unit">m</span>\n          </div>\n        </li>`),form.insertAdjacentHTML("afterend",e)}_moveToPopup(t){if(!this.#t)return;const e=t.target.closest(".workout");if(!e)return;const o=this.#o.find((t=>t.id===e.dataset.id));this.#t.setView(o.coords,"13",{animation:!0,pan:{duration:1}}),this._countClicks()}_countClicks(){this.clicks++,console.log(this.clicks)}_setLocalStorage(){localStorage.setItem("workouts",JSON.stringify(this.#o))}_getLocalStorage(){const t=JSON.parse(localStorage.getItem("workouts"));console.log(t),t&&(this.#o=t,this.#o.forEach((t=>{this.renderWorkout(t)})))}}const app=new App;
//# sourceMappingURL=index.ac2d83ef.js.map
