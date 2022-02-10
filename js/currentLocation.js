// IMport DOM elements
let yourLocation = document.querySelector('.yourLocation');
let yourCountry = document.querySelector('.yourCountry');
let currentDegrees = document.querySelector('.currentDegrees');
let currentSvg = document.querySelector('.currentSvg');
let currentDescription = document.querySelector('.currentDescription');



window.addEventListener('load', currentLocation())

function currentLocation() {
    let lat;
    let long;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            console.log(`Lat: ${lat}, Long: ${long}`);

            // Make API call
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=648419bbaa6b3630ec2f245e7ee1d887`)
            .then((res) => res.json())
            .then((data) => {
                // Destructuring
                let {timezone, current: {temp, weather:[{ description, icon}]}} = data;

                console.log(`${timezone}, ${temp}`);
                console.log(`${description}, ${icon}`);

                // Manupulate DOM elements 
                yourLocation.innerHTML = `${timezone}`;
                yourCountry.innerHTML = ``;
                currentDegrees.innerHTML = `<h1 class="display-3">${(temp - 273.15).toFixed()}°</h1>`;
                currentSvg.innerHTML = `<img src = 'http://openweathermap.org/img/wn/${icon}@2x.png' class = 'img-fluid clouds'>`;
                currentDescription.innerHTML = `${description}`
            })
            .catch((err) => console.error(err))
        })
    }
    else {
        yourLocation.innerHTML = `GPS needed`;
        yourCountry.innerHTML = '';
        currentDescription.innerHTML = `Allow GPS first`;
    }
}