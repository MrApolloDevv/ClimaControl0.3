document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("weather-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const city = document.getElementById("city").value.trim();
        const country = document.getElementById("country").value.trim();
        
        if (city && country) {
            console.log("Cidade:", city);
            console.log("País:", country);
            await buscarClima(city);
        } else {
            console.log("Por favor, preencha ambos os campos.");
        }
    });
});

async function buscarClima(cidade) {
    const apiKey = '974a7e233470a29e37ab43fb50a78430';
    const temperaturaEl = document.getElementById("temperatura");
    const umidadeEl = document.getElementById("umidade");
    
    if (!temperaturaEl || !umidadeEl) {
        console.error("Elementos de temperatura ou umidade não encontrados no DOM.");
        return;
    }
    
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`);
        let data = await response.json();

        if (data.cod === 200) { 
            temperaturaEl.innerText = `${data.main.temp} °C`;
            umidadeEl.innerText = `${data.main.humidity}%`;
        } else {
            console.error("Cidade não encontrada:", data.message);
        }
    } catch (error) {
        console.error("Erro ao buscar o clima:", error);
    }
}
