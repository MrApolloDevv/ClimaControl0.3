async function buscarClima(cidade, pais) {
    const apiKey = '974a7e233470a29e37ab43fb50a78430';
    const celsiusEl = document.querySelector(".celsius");
    const weatherDescEl = document.querySelector(".weather");
    const humidityEl = document.querySelector(".details");
    const errorContainer = document.querySelector(".weather-error");

    // Limpa antes de atualizar
    if (celsiusEl) celsiusEl.innerText = '';
    if (weatherDescEl) weatherDescEl.innerText = '';
    if (humidityEl) humidityEl.innerText = '';
    if (errorContainer) errorContainer.innerText = '';

    try {
        const query = encodeURIComponent(`${cidade},${pais}`);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric&lang=pt_br`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            if (celsiusEl) celsiusEl.innerText = `${data.main.temp.toFixed(0)} °C | `;
            if (weatherDescEl) weatherDescEl.innerText = `${data.weather[0].description}`;
            if (humidityEl) {
                humidityEl.innerHTML = `
                    Prob. de preciptação: ${data.clouds.all || 0}%<br/>
                    Humidade: ${data.main.humidity}%<br/>
                    Vento: ${data.wind.speed} km/h
                `;
            }
        } else {
            if (errorContainer) errorContainer.innerText = "Cidade não encontrada. Verifique os dados.";
        }
    } catch (error) {
        console.error("Erro ao buscar o clima:", error);
        if (errorContainer) errorContainer.innerText = "Erro ao buscar o clima. Tente novamente mais tarde.";
    }
}

async function buscarPrevisao(cidade, pais) {
    const apiKey = '974a7e233470a29e37ab43fb50a78430';
    const query = encodeURIComponent(`${cidade},${pais}`);
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
            console.error("Erro na previsão:", data.message);
            return;
        }

        const dias = {};

        data.list.forEach(item => {
            const dataHora = new Date(item.dt_txt);
            const dia = dataHora.toLocaleDateString("pt-BR", { weekday: 'short' });

            if (!dias[dia]) dias[dia] = [];

            dias[dia].push(item);
        });

        const diasPrevisao = Object.keys(dias).slice(1, 4); // 3 dias depois de hoje

        diasPrevisao.forEach((diaNome, index) => {
            const previsoes = dias[diaNome];
            const temps = previsoes.map(p => p.main.temp);
            const tempMin = Math.min(...temps).toFixed(0);
            const tempMax = Math.max(...temps).toFixed(0);

            const icone = previsoes[4]?.weather[0]?.icon || "01d";

            const diaCard = document.getElementById(`day${index + 1}`);
            if (diaCard) {
                diaCard.querySelector(".day").innerText = diaNome.charAt(0).toUpperCase() + diaNome.slice(1);
                diaCard.querySelector(".temp").innerText = `${tempMax}° | ${tempMin}°`;
                diaCard.querySelector(".icon img").src = `https://openweathermap.org/img/wn/${icone}@2x.png`;
                diaCard.querySelector(".icon img").alt = previsoes[0].weather[0].description;
            }
        });

    } catch (error) {
        console.error("Erro ao buscar previsão:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("weather-form");

    if (!form) {
        console.error("Formulário não encontrado.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const cidade = document.getElementById("city").value.trim();
        const pais = document.getElementById("country").value.trim();

        const errorContainer = document.querySelector(".weather-error");
        if (errorContainer) errorContainer.innerText = '';

        if (cidade && pais) {
            await buscarClima(cidade, pais);
            await buscarPrevisao(cidade, pais);
        } else {
            if (errorContainer) {
                errorContainer.innerText = "Preencha todos os campos!";
            }
        }
    });
});
