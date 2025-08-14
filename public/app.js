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

    // Ganti dengan API key Anda dari OpenWeatherMap
    const apiKey = '5d66a1e45e1a4a2a8a9a9a9a9a9a9a9'; // Contoh API key (ganti dengan milik Anda)

    async function getWeatherByCity(city) {
        try {
            // Sembunyikan pesan error sebelumnya
            errorElement.style.display = 'none';
            
            // Encode nama kota untuk URL
            const encodedCity = encodeURIComponent(city);
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${apiKey}&lang=id`
            );
            
            // Jika response tidak OK, lempar error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kota tidak ditemukan');
            }
            
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            // Tampilkan pesan error yang lebih spesifik
            errorElement.textContent = error.message.includes('404') ? 
                'Kota tidak ditemukan' : 
                'Gagal mengambil data cuaca. Coba lagi nanti.';
            errorElement.style.display = 'block';
            console.error('Error:', error);
        }
    }

    async function getWeatherByLocation(lat, lon) {
        try {
            errorElement.style.display = 'none';
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=id`
            );
            
            if (!response.ok) {
                throw new Error('Gagal mendapatkan data cuaca untuk lokasi Anda');
            }
            
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }

    function displayWeather(data) {
        locationElement.textContent = `${data.name}, ${data.sys.country}`;
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionElement.textContent = data.weather[0].description;
        humidityElement.textContent = data.main.humidity;
        windElement.textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    }

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        } else {
            errorElement.textContent = 'Silakan masukkan nama kota';
            errorElement.style.display = 'block';
        }
    });

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

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeatherByCity(city);
            } else {
                errorElement.textContent = 'Silakan masukkan nama kota';
                errorElement.style.display = 'block';
            }
        }
    });
});