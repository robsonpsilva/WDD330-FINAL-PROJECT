async function loadData(place) {
    try {
      const select = document.getElementById('trailSelect');
      select.value = place;
      const adjustedPlace = place - 1;

      const response = await fetch('./data/hiking-details.json'); // Caminho para o arquivo JSON
      const trailInfo = await response.json();
      
      // Seleciona os primeiros dados do array
      const data = trailInfo[adjustedPlace];

      // Preenche os campos no HTML
      document.getElementById('imageofplace').src = data.image;
      document.getElementById('imageofplace').alt = `Image of ${data.name}`;
      document.getElementById('type').textContent = data.type;
      document.getElementById('region').textContent = data.region;
      document.getElementById('duration').textContent = data.duration;
     document.getElementById('detail').textContent = data.detail;
    } catch (error) {
      localStorage.setItem("Err", error);
    }
  }
  function  updateTrailDetails() {
    const select = document.getElementById('trailSelect');
    const place = select.value;
    loadData(place);
  }

  function equipmentPurchaseRent() {
    // URL da página de interesse
    var url = "./sell.html";
    
    // Abre a URL no navegador
    window.open(url, '_blank');
}

function schedule(){
  const select = document.getElementById('trailSelect');
  const place = select.value;
  window.location.href = `schedule.html?number=${place}`;
}

  // Executa a função ao carregar a página
  const params = new URLSearchParams(window.location.search);
  const place = params.get("number")
  window.onload = loadData(place);