"user strict";
//////////////////////////////////////////////
//display current date and time to home screen

//elements
const currentTime = document.querySelector(".current_time");
const currentDate = document.querySelector(".main_date");

//clock
setInterval(() => {
  const todayDate = new Date().toDateString();
  let currentHr = new Date().getHours();
  let currentMin = new Date().getMinutes();

  if (currentHr < 10) currentHr = "0" + currentHr;

  if (currentMin < 10) currentMin = "0" + currentMin;
  currentTime.textContent = `${currentHr}:${currentMin}`;
  currentDate.textContent = todayDate;
}, 1);

///////////////////////////////////////////////////
//////weather App

//elements
const city = document.querySelector(".search_city");
const feelLike = document.querySelector(".feels_like-type");
const pressure = document.querySelector(".pressure_value");
const displayCurrentTemp = document.querySelector(".weather_temp");
const cityName = document.querySelector(".city_name");
const weatherType = document.querySelector(".weather_type");
const humidity = document.querySelector(".humidity_value");
const windSpeed = document.querySelector(".wind_speed-value");
const visibility = document.querySelector(".visibility-value");
const weatherImage = document.querySelector(".weather_img");
const displayErrorBox = document.querySelector(".displayError");
const currentLocationBtn = document.querySelector(".current_location_btn-img");
const IconUrl = `http://openweathermap.org/img/wn/10d@2x.png`;

//variables
let lat, lon;

//to get current user locationand display data to UI
navigator.geolocation.getCurrentPosition(
  function (position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
  },
  function () {
    displayErrorBox.textContent = `need location permission to use the app`;
  }
);

//display vlue to UI function
const displayValues = function (data) {
  //display current user city temprature
  displayCurrentTemp.textContent = Math.round(data.main.temp);
  //display current user city name
  cityName.textContent = data.name;

  // display current city weather type
  weatherType.textContent = data.weather[0].description;

  //display visibility
  const searchedVisibilityValue = data.visibility;
  visibility.textContent = searchedVisibilityValue / 1000;

  //display windspeed
  const seachedWindspeedValue = (data.wind.speed / 1000) * 3600;
  windSpeed.textContent = seachedWindspeedValue.toFixed(2);

  //display humidity
  humidity.textContent = data.main.humidity;

  //display feel like temp
  feelLike.textContent = data.main.feels_like;

  //display pressure
  pressure.textContent = data.main.pressure;

  //display weather image as per weather
  const newIcon = data.weather[0].icon;
  weatherImage.src = `http://openweathermap.org/img/wn/${newIcon}@2x.png`;
};

//get user current city weather data and display it to UI
const userData = async function (lat, lon) {
  try {
    const response1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=ca7e562f86a004cdc506abf7cfdc1cd4`
    );

    const userLocation = await response1.json();
    //display values to UI
    weatherImage.classList.remove("hidden");
    displayValues(userLocation);
    displayErrorBox.textContent = "";
  } catch (err) {
    displayErrorBox.textContent = `need location permission to display weather data`;
  }
};
userData(lat, lon);

///find weather data of search input city
city.addEventListener("change", function (e) {
  e.preventDefault();
  let searchCity = city.value;

  const getCityData = async function (city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ca7e562f86a004cdc506abf7cfdc1cd4`
      );
      const citydata = await response.json();

      //display values to UI
      displayValues(citydata);
      displayErrorBox.textContent = "";
    } catch (err) {
      displayErrorBox.textContent = `can't find ${searchCity}`;
    }
  };
  getCityData(searchCity);
  city.value = "";
});

//get user city data on click location img
currentLocationBtn.addEventListener("click", function (e) {
  e.preventDefault();
  userData(lat, lon);
  displayErrorBox.textContent = "";
});

/////////////////////////////////////////////////////
////////stopwatch

///elements
const hours = document.querySelector(".hour");
const minutes = document.querySelector(".minute");
const seconds = document.querySelector(".second");
const miliseconds = document.querySelector(".milisec");
//stopwatch buttons
const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");
const resetBtn = document.querySelector(".reset");

//variables
let hr = 0;
let min = 0;
let sec = 0;
let milisec = 0;
let timeravailable = true;
let timer;

//function to start stopwatch
let stopwatch = function () {
  milisec++;
  if (milisec == 100) {
    milisec = 0;
    sec++;
  }
  if (sec == 60) {
    sec = 0;
    min++;
  }
  if (min == 60) {
    sec = 0;
    min = 0;
    hr++;
  }

  //to add "0" before the number when they are below 10
  let hrString = hr;
  let minString = min;
  let secString = sec;
  let milisecString = milisec;

  if (hr < 10) {
    hrString = "0" + hrString;
  }
  if (min < 10) {
    minString = "0" + minString;
  }
  if (sec < 10) {
    secString = "0" + secString;
  }
  if (milisec < 10) {
    milisecString = "0" + milisecString;
  }

  hours.textContent = hrString;
  minutes.textContent = minString;
  seconds.textContent = secString;
  miliseconds.textContent = milisecString;
};

//function to stop the timer
const stopTimer = function () {
  clearInterval(timer);
  timeravailable = true;
  sec = 0;
  min = 0;
  hr = 0;
  milisec = 0;
  miliseconds.textContent = "00";
  seconds.textContent = "00";
  minutes.textContent = "00";
  hours.textContent = "00";
};

//start stopwatch
startBtn.addEventListener("click", function () {
  if (timeravailable) {
    timer = setInterval(stopwatch, 10);
    timeravailable = false;
  }
});

//stop stopwatch
stopBtn.addEventListener("click", function () {
  if (!timeravailable) {
    clearInterval(timer);
    timeravailable = true;
  }
});

// reset stopwatch
resetBtn.addEventListener("click", function () {
  stopTimer();
});

////////////////////////////////////////////////////////
/////calculator app function

//elements
const dot = document.querySelector(".add_dot");
const deleteLastinput = document.querySelector(".delete_last_value");
const clearAllinput = document.querySelector(".clearCalcBtn");
const calculator = document.querySelector(".calc_btns");
const btns = document.querySelectorAll(".calc_btns-num");
const operator = document.querySelectorAll(".calc_btns-operator");
let calcDisplay = document.querySelector(".display_calc");
let numPressed = "";
let saveNum;
let operatorPressed = "";
let result;
// operation function
const operation = function (operator) {
  if (operator === "+") result = saveNum + Number(numPressed);
  if (operator === "-") result = saveNum - Number(numPressed);
  if (operator === "/") result = saveNum / Number(numPressed);
  if (operator === "*") result = saveNum * Number(numPressed);
  if (operator === "%") result = saveNum % Number(numPressed);
};

//get number from btns and display
btns.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    numPressed += e.target.textContent;
    calcDisplay.textContent = numPressed;
  });
});

//get each operator and do operation
operator.forEach((operator) => {
  operator.addEventListener("click", function (e) {
    e.preventDefault();
    if (saveNum) {
      operation(operatorPressed);
      saveNum = 0;
      saveNum = result;
      calcDisplay.textContent = saveNum;
    }
    if (!result) saveNum = Number(numPressed);
    numPressed = "";
    operatorPressed = e.target.textContent;
  });
});

//display result on clicking equal btn
document.querySelector(".equal_btn").addEventListener("click", function (e) {
  e.preventDefault();
  operation(operatorPressed);
  saveNum = 0;
  saveNum = result;
  numPressed = "";
  calcDisplay.textContent = saveNum;
});

//delete last digit from the number
deleteLastinput.addEventListener("click", function (e) {
  e.preventDefault();
  if (!numPressed.includes(".")) {
    numPressed = Math.trunc(Number(numPressed) / 10);
    calcDisplay.textContent = numPressed;
  } else {
    numPressed = Math.trunc(Number(numPressed));
    calcDisplay.textContent = numPressed;
  }
});

//add dot to the number
dot.addEventListener("click", function (e) {
  e.preventDefault();
  if (!numPressed.includes(".")) numPressed += ".";
  calcDisplay.textContent = numPressed;
});

//clear all the operation and values
clearAllinput.addEventListener("click", function (e) {
  e.preventDefault();
  calcDisplay.textContent = "";
  operatorPressed = "";
  numPressed = "";
  saveNum = null;
  result = null;
});

//////////////////////////////////////////////////////
// notesApp/////////////////

//elements of notes App
const notesDescriptionBox = document.querySelector(".notesDescriptionBox");
const noteTitle = document.querySelector(".notesTitle");
const noteDescription = document.getElementById("notesDescription");
const notesContainer = document.querySelector(".notesContainer");
const submitNote = document.querySelector(".notesSubmitbtn");

//function to add/show notes
const addNote = function (note) {
  let html = ` <div class="note">
    <h1 class="note_title">${note.title}</h1>
    <p class="note_description">${note.description}</p>
    <button class="delete_note">&Cross;</button>
  </div>`;
  notesContainer.insertAdjacentHTML("beforeend", html);
};

//show current saved notes from localStorage
let storeNotes = [];
let storage = localStorage.getItem("notes");
if (!storage) storeNotes = [];
if (storage) storeNotes = JSON.parse(storage);
storeNotes.forEach((note) => {
  addNote(note);
});

//open input box when click on input
noteTitle.addEventListener("click", function () {
  notesDescriptionBox.classList.remove("hidden");
});

//submit a new note
submitNote.addEventListener("click", function (e) {
  e.preventDefault();
  if (noteTitle.value == "" && noteDescription.value == "") {
    return alert("please add title and description");
  }
  let newNote = {
    title: noteTitle.value,
    description: noteDescription.value,
  };
  storeNotes.push(newNote);

  //store note in localStorage
  localStorage.setItem("notes", JSON.stringify(storeNotes));
  addNote(newNote);

  //clear all values of input after submit the note and close input box
  noteTitle.value = "";
  noteDescription.value = "";
  notesDescriptionBox.classList.add("hidden");
});

///delete a Note
notesContainer.addEventListener("click", function (e) {
  //find the note which we want to delete
  let noteToDelete = e.target.closest(".delete_note");
  if (!noteToDelete) return;
  if (noteToDelete) {
    let noteToDeleteContent = noteToDelete.previousElementSibling.textContent;

    //delete the note from localStorage
    for (let i = 0; i < storeNotes.length; i++) {
      if (
        noteToDeleteContent === storeNotes[i].title ||
        noteToDeleteContent === storeNotes[i].description
      ) {
        storeNotes.splice(i, 1);
        localStorage.setItem("notes", JSON.stringify(storeNotes));
      }
    }
    noteToDelete.parentElement.remove();
  }
});

////////////////////////////////////////////////////////////
//open the apps from main screen

//elements
const weatherAppBtn = document.querySelector(".weatherbtn");
const stopwatchAppBtn = document.querySelector(".stopwatchbtn");
const notesAppBtn = document.querySelector(".notesbtn");
const calculatorAppBtn = document.querySelector(".calculatorbtn");
const closeMainAppbtns = document.querySelectorAll(".close_app");
const overlay = document.querySelector(".overlay");
const weatherApp = document.querySelector(".weatherApp");
const calculatorApp = document.querySelector(".calculatorApp");
const StopwatchApp = document.querySelector(".StopwatchApp");
const notesApp = document.querySelector(".notesApp");

// display weather app
weatherAppBtn.addEventListener("click", function (e) {
  e.preventDefault();
  userData(lat, lon);
  weatherApp.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

//display calculator app
calculatorAppBtn.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".allApps").classList.add("hidden");
  calculatorApp.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

//display stopwatch app
stopwatchAppBtn.addEventListener("click", function (e) {
  e.preventDefault();
  StopwatchApp.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

//display notes app
notesAppBtn.addEventListener("click", function (e) {
  e.preventDefault();
  notesApp.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

//close the apps by clicking outside of the app
// const closeAppByClickingOutside = document.querySelector(".overlay");
overlay.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".allApps").classList.remove("hidden");
  StopwatchApp.classList.add("hidden");
  calculatorApp.classList.add("hidden");
  notesApp.classList.add("hidden");
  weatherApp.classList.add("hidden");
  overlay.classList.add("hidden");
});

//close app by clicking on close(X) button
closeMainAppbtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".allApps").classList.remove("hidden");
    StopwatchApp.classList.add("hidden");
    calculatorApp.classList.add("hidden");
    notesApp.classList.add("hidden");
    weatherApp.classList.add("hidden");
    overlay.classList.add("hidden");
    notesDescriptionBox.classList.add("hidden");
    stopTimer();
  });
});
