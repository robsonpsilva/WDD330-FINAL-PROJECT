// ------------------loadData()-------------------------------------
//The following function loads the data from the hiking-details.json 
// file and, from there, builds the screen, loading this data onto the screen.
async function loadData(p) {
    try {
      const select = document.getElementById("trailSelect");
      select.value = p;
      const adjustedPlace = p - 1;

      const response = await fetch("../json/hiking-details.json"); // Path to JSON file
      const trailInfo = await response.json();
      
      // Selects the first data from the array
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
    // URL of the page of interest
    var url = "../cart/sell.html";
    
    // Open the URL in the browser
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

  // Run the function when the page loads
  const params = new URLSearchParams(window.location.search);
  const place = params.get("number")
  window.onload = loadData(place);

  window.updateTrailDetails = updateTrailDetails;
  window.equipmentPurchaseRent = equipmentPurchaseRent;
  window.viewMap = viewMap;
  window.schedule = schedule;