async function loadData(p) {
    try {
      const select = document.getElementById("trailSelect");
      select.value = p;
      const adjustedPlace = p - 1;

      //const response = await fetch("../json/hiking-details.json"); // Caminho para o arquivo JSON
      const response = await fetch("../netlify/functions/get-hiking-details");
      console.log(response);
      const trailInfo = await response.json();
      
      // Seleciona os primeiros dados do array
      const data = trailInfo[adjustedPlace];

      // Preenche os campos no HTML
      document.getElementById("imageofplace").src = data.image;
      document.getElementById("imageofplace").alt = `Image of ${data.name}`;
      document.getElementById("type").textContent = data.type;
      document.getElementById("region").textContent = data.region;
      document.getElementById("duration").textContent = data.duration;
     document.getElementById("detail").textContent = data.detail;
    } catch (error) {
      localStorage.setItem("Err", error);
    }
  }
  function  updateTrailDetails() {
    const select = document.getElementById("trailSelect");
    const p = select.value;
    loadData(p);
  }

  function equipmentPurchaseRent() {
    // URL da página de interesse
    var url = "../cart/sell.html";
    
    // Abre a URL no navegador
    window.location.href = url;
}

function schedule(){
  const select = document.getElementById("trailSelect");
  const p = select.value;
  window.location.href = `../schedule/schedule.html?number=${p}`;
}

function viewMap() {
    const selectedTrailName = document.getElementById("trailSelect").value;
    
    if (selectedTrailName) {
        // Encode the trail name to be safe in the URL
        const encodedTrailName = encodeURIComponent(selectedTrailName);
        // Redirect to hiking-map.html, passing the trail name as a query parameter
        window.location.href = `../hiking-map/hiking-map.html?trail=${encodedTrailName}`;
    } else {
        alert("Please select a trail to view its map!");
    }
}

  // Executa a função ao carregar a página
  const params = new URLSearchParams(window.location.search);
  const place = params.get("number")
  window.onload = loadData(place);

  window.updateTrailDetails = updateTrailDetails;
  window.equipmentPurchaseRent = equipmentPurchaseRent;
  window.viewMap = viewMap;
  window.schedule = schedule;