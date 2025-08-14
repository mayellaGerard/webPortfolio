document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const locationElement = document.getElementById('location');
    const tempElement = document.getElementById('temp');
    const descriptionElement = document.getElementById('description');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    const errorElement = document.getElementById('error');

    const apiKey = '90ebc9dae79ec3f7ee5d33e505cd5dee'; 

    // Fungsi untuk mendapatkan cuaca berdasarkan kota
    async function getWeatherByCity(city) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=id`
            );
            
            if (!response.ok) {
                throw new Error('Kota tidak ditemukan');
            }
            
            const data = await response.json();
            displayWeather(data);
            errorElement.style.display = 'none';
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }

    // Fungsi untuk mendapatkan cuaca berdasarkan lokasi
    async function getWeatherByLocation(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=id`
            );
            
            if (!response.ok) {
                throw new Error('Gagal mendapatkan data cuaca');
            }
            
            const data = await response.json();
            displayWeather(data);
            errorElement.style.display = 'none';
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }

    // Fungsi untuk menampilkan data cuaca
    function displayWeather(data) {
        locationElement.textContent = `${data.name}, ${data.sys.country}`;
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionElement.textContent = data.weather[0].description;
        humidityElement.textContent = data.main.humidity;
        windElement.textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    }

    // Event listener untuk tombol cari
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    });

    // Event listener untuk tombol lokasi
    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    getWeatherByLocation(latitude, longitude);
                },
                error => {
                    errorElement.textContent = 'Izin lokasi ditolak atau tidak tersedia';
                    errorElement.style.display = 'block';
                }
            );
        } else {
            errorElement.textContent = 'Geolocation tidak didukung di browser Anda';
            errorElement.style.display = 'block';
        }
    });

    // Memungkinkan pencarian dengan menekan Enter
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeatherByCity(city);
            }
        }
    });
});