const getLocation = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude

            getCurrentWeather(lat, lon)
            getWeeklyForecast(lat, lon)
        }, showError)
    }
    else {
        alert('Geolocation is not supported')
    }
}

const showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

const getCurrentWeather = async (lat, lon) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=181db3d6821703785b67e3da3cf06990`)
        const data = await response.json()
        console.log(data, 'current');

        if (data.cod != 404) {
            let city = data.name
            let country = data.sys.country
            let temperature = (data.main.temp - 273.15).toFixed(1)
            let feelsC = (data.main.feels_like - 273.15).toFixed(1)
            let humidity = data.main.humidity
            let pressure = data.main.pressure
            let wind = data.wind.speed

            let lat = data.coord.lat
            let lon = data.coord.lon

            getWeeklyForecast(lat, lon)
            let T = getTime()
            console.log(T);


            console.log(city, country, temperature, feelsC, humidity, pressure, wind);

            document.getElementById('location').innerText = `${city}, ${country}`
            document.getElementById('temperature').innerText = `${temperature} °C`
            document.getElementById('currentDate').innerText = T

            document.getElementById('feelLikeVal').innerText = `${feelsC} °C`
            document.getElementById('windVal').innerText = `${wind} Km/h`
            document.getElementById('humidityVal').innerText = `${humidity} %`
            document.getElementById('pressureVal').innerText = `${pressure} hPa`

        }




    } catch (error) {
        console.log("Error fetching current weather:", error)
    }
}


const getWeeklyForecast = async (lat, lon) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=181db3d6821703785b67e3da3cf06990&units=metric`);
        const data = await response.json()
        console.log(data, 'weekly')

        console.log(data.list);

        const dailyForecast = {}

        data.list.forEach((item) => {
            const date = new Date(item.dt_txt)
            const day = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
            console.log(day.slice(0, 3));
            const temperature = item.main.temp

            // console.log(temperature);

            if (!dailyForecast[day]) {
                dailyForecast[day] = {
                    temperature: temperature.toFixed(1),
                    weather: item.weather[0].main,
                    icon: item.weather[0].icon
                }
            }
        })

        const days = Object.keys(dailyForecast).slice(1,)
        console.log(days);

        let weekHtml = ''

        days.forEach(day => {
            const forecast = dailyForecast[day]
            // console.log(forecast);

            console.log(weatherImage[forecast.weather]);

            const imagePath = weatherImage[forecast.weather] || './image/sunny.png';
            // console.log(forecast);
            weekHtml += `
             <div class="weekday">
            <p>${day.slice(0, 3)}</p>
            <img src="${imagePath}" alt="${forecast.weather}">
            <p>${forecast.weather}</p>
            <p>${forecast.temperature}°C</p>
        </div>
        <hr>`
        })
        document.querySelector('.weekFor').innerHTML = weekHtml;

    } catch (error) {
        console.log("Error fetching current weather:", error);
    }
}

const search = async () => {
    let cityName = city.value
    // console.log(cityName);
    // let capCity = cityName.toUpperCase()
    // console.log(capCity);

    if (cityName) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=181db3d6821703785b67e3da3cf06990`)
        response.json().then((data) => {
            console.log(data);
            let cityCode = data.cod
            // console.log(cityCode);

            if (cityCode != 404) {
                let temperature = data.main.temp
                let tempC = (temperature - 273.15).toFixed(1)
                // console.log(`tempereture: ${temperature}, celcius: ${tempC}`);
                console.log(data);


                let feels_like = data.main.feels_like
                let feelsC = (feels_like - 273.15).toFixed(1)
                // console.log(`tempereture: ${feels_like}, celcius: ${feelsC}`);

                let pressure = data.main.pressure
                let humidity = data.main.humidity
                let wind = data.wind.speed

                let cityCap = data

                let country = data.sys.country

                let cloud_desc = data.weather[0].description
                console.log(cloud_desc);

                let cloudd = data.weather[0].main
                // console.log('clouddddd', cloudd);
                let weatherIcon = data.weather[0].icon;

                let lat = data.coord.lat
                let lon = data.coord.lon

                getWeeklyForecast(lat, lon)
                let currtime = getTime()

                const currentDate = getTime()

                document.getElementById('location').innerText = `${cityName}, ${country}`
                document.getElementById('temperature').innerText = `${tempC}°C`
                document.getElementById('currentDate').innerText = currtime
                document.getElementById('weatherImg').src = weatherImage[cloudd] || './image/sunny.png'

                document.getElementById('feelLikeVal').innerText = `${feelsC} °C `
                document.getElementById('windVal').innerText = `${wind} Km/h`
                document.getElementById('humidityVal').innerText = `${humidity} %`
                document.getElementById('pressureVal').innerText = `${pressure} hPa`
            }
            else {
                showAlert('No such city found')
            }
        })
    }
    else {
        showAlert('Enter a city to search')
    }
}

const weatherImage = {
    Sunny: './image/sunny.png',
    Rain: './image/dayrain.png',
    Snow: './image/snow.png',
    Mist: './image/mist.png',
    Haze: './image/mist.png',
    Drizzle: './image/drizzle.png',
    Clouds: './image/day.png',
    Thunderstorm: './image/sunthunder.png'
}

const getTime = () => {
    const currentDate = new Date()

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = days[currentDate.getDay()]
    const month = months[currentDate.getMonth()]
    const date = currentDate.getDate()
    const hours = currentDate.getHours()
    const minute = currentDate.getMinutes()
    const period = hours > 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minute < 10 ? '0' + minute : minute

    const currtime = `${day} ${month} ${date}, ${formattedHours}:${formattedMinutes} ${period}`
    return currtime
}

const showAlert = (message) => {
    let alertBox = document.getElementById("customAlertBox");
    let alert_Message_container = document.getElementById("alertMessage");
    let close_img = document.querySelector(".close");
    
    alert_Message_container.innerHTML = message; 
    alertBox.style.display = "block"; 

    close_img.addEventListener('click', function () {
        alertBox.style.display = "none"; 
    })
}


window.onload = getLocation