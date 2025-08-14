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

    // API 
    const apiKey = '90ebc9dae79ec3f7ee5d33e505cd5dee'; 

    async function getWeatherByCity(city) {
        try {
            errorElement.style.display = 'none';
            
            // Normalisasi input kota
            const normalizedCity = city.trim()
                .toLowerCase()
                .replace(/\b\w/g, l => l.toUpperCase()); // Kapitalisasi setiap kata
            
            console.log(`Mencari cuaca untuk: ${normalizedCity}`);
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${apiKey}&lang=id`
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error dari API:', errorData);
                
                // Coba alternatif pencarian tanpa negara jika gagal
                if (errorData.message.includes('not found')) {
                    const cityOnly = normalizedCity.split(',')[0].trim();
                    if (cityOnly !== normalizedCity) {
                        console.log(`Mencoba tanpa kode negara: ${cityOnly}`);
                        return getWeatherByCity(cityOnly);
                    }
                }
                
                throw new Error(errorData.message || 'Kota tidak ditemukan');
            }
            
            const data = await response.json();
            console.log('Data diterima:', data);
            
            // Validasi data penting ada
            if (!data.main || !data.weather || !data.weather[0]) {
                throw new Error('Data cuaca tidak lengkap');
            }
            
            displayWeather(data);
        } catch (error) {
            console.error('Error:', error);
            errorElement.textContent = getFriendlyErrorMessage(error.message);
            errorElement.style.display = 'block';
        }
    }

    function getFriendlyErrorMessage(apiMessage) {
        const messages = {
            'city not found': 'Kota tidak ditemukan',
            'nothing to geocode': 'Nama kota tidak valid',
            'invalid API key': 'API key tidak valid',
            '401': 'API key tidak valid atau expired',
            '404': 'Kota tidak ditemukan',
            '429': 'Terlalu banyak permintaan, coba lagi nanti'
        };
        
        return messages[apiMessage.toLowerCase()] || 
               messages[apiMessage] || 
               'Gagal mengambil data cuaca. Coba kota lain atau coba lagi nanti.';
    }

    function displayWeather(data) {
        const cityName = data.name || 'Lokasi tidak diketahui';
        const country = data.sys?.country || '';
        
        locationElement.textContent = `${cityName}${country ? ', ' + country : ''}`;
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionElement.textContent = data.weather[0].description;
        humidityElement.textContent = data.main.humidity;
        windElement.textContent = Math.round(data.wind.speed * 3.6); // m/s to km/h
    }

    // Event listeners tetap sama
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        } else {
            showError('Silakan masukkan nama kota');
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
                    showError('Izin lokasi ditolak atau tidak tersedia');
                }
            );
        } else {
            showError('Geolocation tidak didukung di browser Anda');
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                getWeatherByCity(city);
            } else {
                showError('Silakan masukkan nama kota');
            }
        }
    });

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
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
            showError(error.message);
        }
    }
});