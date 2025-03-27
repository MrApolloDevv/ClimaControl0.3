document.addEventListener("DOMContentLoaded", function() {
    fetch("./assets/components/navbar/navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
    });
});


async function buscarClima(cidade) {
    const apiKey = '974a7e233470a29e37ab43fb50a78430';

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`);
        let data = await response.json();

        if (data.cod === 200) { 
            let temperatura = data.main.temp;
            let iconeClima = data.weather[0].icon; 
            let descricaoClima = data.weather[0].description; 

            // Atualizando os spans no HTML
            document.getElementById("cidade").innerText = `${cidade},`;
            document.getElementById("estado").innerText = data.sys.country;
            document.getElementById("temperatura").innerText = `${temperatura}°C`;
            
            document.getElementById("status-img").innerHTML = `
                <img src="https://openweathermap.org/img/wn/${iconeClima}@2x.png" alt="${descricaoClima}" title="${descricaoClima}">
            `;
        } else {
            console.error("Cidade não encontrada:", data.message);
        }
    } catch (error) {
        console.error("Erro ao buscar o clima:", error);
    }
}

buscarClima("Uruaçu");
