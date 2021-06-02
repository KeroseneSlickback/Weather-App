/*

- Search for locations
- Toggle between F and C

- Change styles based on weather, also icons

- (optional) loading animations between fetches

Overall project:
A weather app that takes in two different locations
Pretty much split between the page, so no need to wire both; separate Classes and output for each side
Two search bars for each side
Displays: Locations, temperature, time, wind, humidity, precipitation
Sides change colors depending on the weather displayed

Pseudo-code: 

First start out easy:

	Fetch info from API and find the info wanted
	First try in basic promises,
	then finalize in async/await

	Create a search field to actively retrieve this info

Second:

	Use a Class
	Append this information into HTML and display correctly
	Toggle F/C

Third: 

	Weather conditions point => Image
	If Error
	Set corresponding styles and images for each weather type into their own sections
Loading animation
Make it look really good!

*/

const leftForm = document.getElementById('left-form');
const rightForm = document.getElementById('right-form');
const leftDegree = document.getElementById('left-degree');
const rightDegree = document.getElementById('right-degree');

class Weather {
	constructor(city, degree, container) {
		this.city = city;
		this.degree = degree;
		this.container = container;
	}

	set setCity(newCity) {
		let setCity;

		if (newCity.indexOf(' ') !== -1) {
			setCity = newCity.replace(' ', '%20');
		} else {
			setCity = newCity;
		}
		this.city = setCity;
	}

	set setDegree(newDegree) {
		this.degree = newDegree;
	}

	set setContainer(container) {
		this.container = container;
	}

	handleError() {
		const getDiv = document.getElementById(this.container);
		getDiv.innerText = '';
		const warning = document.createElement('h1');
		warning.classList.add('cityH1');
		warning.innerText = `Sorry couldn't find the city`;
		getDiv.appendChild(warning);
	}

	async getWeather() {
		const apiKey = 'f607d6cff65361bce0a424ea465c4eeb';
		try {
			const response = await fetch(
				`http://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apiKey}`,
				{ mode: 'cors' }
			);
			const sorted = await response.json();
			this.calculateNums(sorted);
			console.log(sorted);
		} catch (error) {
			this.handleError();
		}
	}

	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	calculateNums(data) {
		let city = data.name;
		let temp;
		let weather = this.capitalize(data.weather[0].description);
		let rawDeg = parseInt(data.wind.deg);
		let windDirec;
		let windSpeed;
		let windSpeedRating;
		let humidity = data.main.humidity;
		let weatherCond = data.weather[0].main;

		let celsius = parseInt(data.main.temp - 273.15);
		let countryDeterm = data.sys.country;

		if (this.degree === 'F') {
			temp = Math.round(celsius * (9 / 5) + 32);
		} else if (this.degree === 'C') {
			temp = Math.round(celsius);
		}

		if (rawDeg > 337 && rawDeg < 22) {
			windDirec = 'N';
		} else if (rawDeg > 22 && rawDeg < 67) {
			windDirec = 'NE';
		} else if (rawDeg > 67 && rawDeg < 112) {
			windDirec = 'E';
		} else if (rawDeg > 112 && rawDeg < 157) {
			windDirec = 'SE';
		} else if (rawDeg > 157 && rawDeg < 202) {
			windDirec = 'S';
		} else if (rawDeg > 202 && rawDeg < 247) {
			windDirec = 'SW';
		} else if (rawDeg > 247 && rawDeg < 297) {
			windDirec = 'W';
		} else if (rawDeg > 297 && rawDeg < 337) {
			windDirec = 'NW';
		}

		if (countryDeterm === 'US') {
			windSpeed = Math.round(parseInt(data.wind.speed));
			windSpeedRating = 'mph';
		} else {
			windSpeed = Math.round(parseInt(data.wind.speed * 1.61));
			windSpeedRating = 'kmh';
		}

		this.createSections(
			city,
			temp,
			weather,
			windDirec,
			windSpeed,
			windSpeedRating,
			humidity,
			weatherCond
		);
	}

	createSections(
		city,
		temp,
		weather,
		windDirec,
		windSpeed,
		windSpeedRating,
		humidity,
		weatherCond
	) {
		const getDiv = document.getElementById(this.container);
		getDiv.innerText = '';

		const cityH1 = document.createElement('h1');
		cityH1.classList.add('locations');
		cityH1.innerText = city;
		getDiv.appendChild(cityH1);

		const weatherPic = document.createElement('img');
		weatherPic.classList.add('imgs');
		if (weatherCond === 'Clear') {
			weatherPic.src = 'imgs/sun.png';
		} else if (weatherCond === 'Clouds') {
			weatherPic.src = 'imgs/cloudy.png';
		} else if (weatherCond === 'Rainy') {
			weatherPic.src = 'imgs/rainy.png';
		} else if (weatherCond === 'Snow') {
			weatherPic.src = 'imgs/snowy.png';
		} else {
			weatherPic.src = 'imgs/summer.png';
		}
		getDiv.appendChild(weatherPic);

		const tempH2 = document.createElement('h2');
		tempH2.classList.add('temperatures');
		tempH2.innerText = `${temp}° ${this.degree}`;
		getDiv.appendChild(tempH2);

		const weatherH3 = document.createElement('h3');
		weatherH3.classList.add('descriptions');
		weatherH3.innerText = weather;
		getDiv.appendChild(weatherH3);

		const windP = document.createElement('p');
		windP.classList.add('winds');
		windP.innerText = `Wind: ${windDirec} ${windSpeed} ${windSpeedRating}`;
		getDiv.appendChild(windP);

		const humidP = document.createElement('p');
		humidP.classList.add('humiditys');
		humidP.innerText = `Humidity: ${humidity}%`;
		getDiv.appendChild(humidP);
	}
}

leftForm.addEventListener('submit', e => {
	e.preventDefault();
	const city = document.getElementById('left-search').value;
	const firstCity = new Weather();
	firstCity.setCity = city;
	firstCity.setDegree = leftDegree.innerText;
	firstCity.setContainer = 'container1';
	firstCity.getWeather();
	leftForm.reset();
});

rightForm.addEventListener('submit', e => {
	e.preventDefault();
	const city = document.getElementById('right-search').value;
	const secondCity = new Weather();
	secondCity.setCity = city;
	secondCity.setDegree = rightDegree.innerText;
	secondCity.setContainer = 'container2';
	secondCity.getWeather();
	rightForm.reset();
});

leftDegree.addEventListener('click', e => {
	if (leftDegree.innerText === 'F') {
		leftDegree.innerText = 'C';
		leftDegree.classList.remove('F');
		leftDegree.classList.add('C');
	} else if (leftDegree.innerText === 'C') {
		leftDegree.innerText = 'F';
		leftDegree.classList.remove('C');
		leftDegree.classList.add('F');
	}
});

rightDegree.addEventListener('click', e => {
	if (rightDegree.innerText === 'F') {
		rightDegree.innerText = 'C';
		rightDegree.classList.remove('F');
		rightDegree.classList.add('C');
	} else if (rightDegree.innerText === 'C') {
		rightDegree.innerText = 'F';
		rightDegree.classList.remove('C');
		rightDegree.classList.add('F');
	}
});

function startUp() {
	leftDegree.innerText = 'C';
	leftDegree.classList.add('C');
	const firstCity = new Weather();
	firstCity.setCity = 'Yamagata';
	firstCity.setDegree = leftDegree.innerText;
	firstCity.setContainer = 'container1';
	firstCity.getWeather();

	rightDegree.innerText = 'F';
	rightDegree.classList.add('F');
	const secondCity = new Weather();
	secondCity.setCity = 'Las Vegas';
	secondCity.setDegree = rightDegree.innerText;
	secondCity.setContainer = 'container2';
	secondCity.getWeather();
}

startUp();
