// Get current day and time
const d = new Date();

// Week day arr
let weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat",];


// checkDay function
function checkDay(day) {
    if(day +d.getDay() > 6) {
        return day +d.getDay()-7;
    }
    else {
        return day +d.getDay();
    }
}

for(let i = 0; i < 5; i++) {
    let day = document.querySelectorAll('.day')[i]
    day.innerHTML = weekday[checkDay(i)]
}

// destrcuturing time values
let actualDay = d.toString().split(' ')[0]
let exactDate = d.toString().split(' ')[2]
let currentMonth = d.toString().split(' ')[1]
let currentTime = d.toString().split(' ')[4]

// convert to 12hrs and AM/PM 
let timeString = currentTime;
let H = +timeString.substr(0, 2);
let h = H % 12 || 12
let ampm = (H < 12 || H === 24) ? " AM" : " PM";
timeString = h + timeString.substr(2, 3) + ampm;


// Fetch DOM elements
let searchButton = document.querySelector('.searchButton');
let errorSection = document.querySelector('.errorSection');
let locationHeading = document.querySelector('.locationHeading');
let currentDate = document.querySelector('.currentDate');
let tempConverted = document.querySelector('.tempConverted');
let descriptionWeather = document.querySelector('.descriptionWeather');
let feelsLike = document.querySelector('.feelsLike');
let max = document.querySelector('.max');
let min = document.querySelector('.min');
let mainIcon = document.querySelector('.mainIcon');


// Mainipulate DOM elements before fetch

// Location Heading
locationHeading.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>

                            <i>
                            <b>City | State,</b>
                            </i>
                            <span class="fs-6">Country</span>
                            `
// currentDate
currentDate.innerHTML = `${actualDay}, ${exactDate} ${currentMonth} ${timeString}`

// Main Description
descriptionWeather.innerHTML = `Description`;


// Add event listeners
searchButton.addEventListener('click', getWeather);

// fetch API 
async function getWeather(e) {
    e.preventDefault();
    
    // Fetch input DOM element
    let inputText = document.querySelector('.input').value.trim();

    if(inputText) {
        // First call
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputText}&appid=648419bbaa6b3630ec2f245e7ee1d887`)
        .then((res) => res.json())
        .then((data) => {
            if(data.name) {
                let {name, sys: {country}, weather:[{ description, icon}], main: {temp, feels_like, pressure, humidity}} = data;
                let tempToCelcius = (temp -273.15).toFixed();
                locationHeading.innerHTML = `
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                                </svg>

                                                <i>
                                                <b>${name},</b>
                                                </i>
                                                <span class="fs-6">${country}</span>
                                                `
                descriptionWeather.innerHTML = `${description}`
                mainIcon.innerHTML = `<img src = 'http://openweathermap.org/img/wn/${icon}@2x.png' class = 'img-fluid clouds'>`

                let load = 0;
                let int = setInterval(incrementVal, 90)

                function incrementVal() {
                    load ++;
                    if(load == tempToCelcius) {
                        clearInterval(int)
                    }
                    tempConverted.innerHTML = `<i>${load}</i><sup class="fw-light">° </sup>`;
                    feelsLike.innerHTML = `<i>feels like ${load}<sup class="fs-6">°</sup></i>`;
            }
            max.innerHTML = `mb: ${pressure}`
            min.innerHTML = `HUM: ${humidity}`


            }
            else {
                errorSection.style.display = 'block'
                errorSection.innerHTML = `Location doesn\'t exist`;
                setTimeout(() => {
                    errorSection.style.display = 'none';
                }, 2000);
            }
        })

        // Five days forecast
        .then(
            await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inputText}&appid=648419bbaa6b3630ec2f245e7ee1d887`)
            .then((res2) => res2.json())
            .then((data) => {
                let {list, list: [{main: {temp_min, temp_max }}]} = data;

                // Get min tempeature
                for(let i = 0; i < 5; i++) {
                    let minTemp = document.querySelectorAll('.min-temp')[i]
                    minTemp.innerHTML = `${Number(list[i].main.temp_min -273.15).toFixed(1)}°`
                }

                // Get max temperature
                for(let i = 0; i < 5; i++) {
                    let maxTemp = document.querySelectorAll('.max-temp')[i]
                    maxTemp.innerHTML = `${Number(list[i].main.temp_max -273.15).toFixed(1)}°`
                }

                // Get icons
                for(let i = 0; i < 5; i++) {

                    // All icons
                    let presentIcon = document.querySelectorAll('.weatherIcon')[i].innerHTML = `<img src = 'http://openweathermap.org/img/wn/${list[i].weather[0].icon}.png' class = 'img-fluid'>`
                }
            })
        )
        .catch((err) => console.error(err))
        
    }
    else {
        errorSection.style.display = 'block';
        errorSection.innerHTML = `Kindly type in a City, State or Country`;
        setTimeout(() => {
            errorSection.style.display = 'none';
        }, 2000);
    }
}