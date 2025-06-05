
const ORS_API_KEY = "5b3ce3597851110001cf6248615f32ba700946d9b4eb594c34e8c87f"; 

const map = L.map("map").setView([-22.951912, -43.210487], 13); 

let dataTrail;

// Adiciona a camada de tiles do OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
}).addTo(map);

let routeLayer = null; // To store the route layer

// --- Track Data (simulated as JSON) ---




async function loadTrailsData() {
    try {
        let data = [];
        const response = await fetch(`../json/hiking-map.json`);
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading trails data:", error);
    }
}



// --- Functions for the Tracks Combo Box ---

// Fills the combo box with the tracks from the JSON
async function populateTrailSelect(trailsData) {
    const selectElement = document.getElementById("trailSelect");
    selectElement.innerHTML = `<option value="">-- Select a track --</option>`; 

    trailsData.forEach(trail => {
        const option = document.createElement("option");
        option.value = trail.id;       // The option's VALUE will now be the numeric ID
        option.textContent = trail.name; // The visible TEXT will be the track name
        selectElement.appendChild(option);
    });
    return trailsData;
}

// Load the selected track in the source and destination fields (now only internal) and search for the route
async function loadSelectedTrail(trailsData) {
    const selectElement = document.getElementById("trailSelect");
    const selectedTrailId = selectElement.value; // Get the ID (number) which is now the value
    
    const errorMessageDiv = document.getElementById("errorMessage");
    const loader = document.getElementById("loader");

    errorMessageDiv.textContent = ""; 
    loader.style.display = "block"; 

    if (routeLayer) { 
        map.removeLayer(routeLayer);
        routeLayer = null;
    }

    if (selectedTrailId === "") { 
        loader.style.display = "none";
        return; 
    }

  // Search for the track by ID, but we need the start/end points (which are in the 'name')  
    const selectedTrail = trailsData.find(trail => trail.id === selectedTrailId);

    if (selectedTrail) {
        findRoute(selectedTrail.start, selectedTrail.end); 
    } else {
        errorMessageDiv.textContent = "Erro: Trilha selecionada não encontrada nos dados.";
        loader.style.display = "none";
    }
}

async function getCoordinates(placeName) {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;

    const response = await fetch(nominatimUrl, {
        headers: {
            "User-Agent": "MinhaAplicacaoDeHiking/1.0 (seu.email@exemplo.com)"
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching coordinates for "${placeName}": ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lon, lat]; // OpenRouteService expects [longitude, latitude]
    } else {
        throw new Error(`Location not found: ${placeName}`);
    }
}
// --- Main logic to fetch the route (now with parameters) ---
async function findRoute(startPointName, endPointName) {
    const errorMessageDiv = document.getElementById("errorMessage");
    const loader = document.getElementById("loader"); // Loader should already be visible here

    try {
        // Function to get coordinates using the Nominatim API
        

        let startCoords = null;
        let endCoords = null;

        // Attempt to get coordinates from provided start and end point names
        if (startPointName && endPointName) {
            try {
                startCoords = await getCoordinates(startPointName);
                endCoords = await getCoordinates(endPointName);
            } catch (error) {
                console.warn(`Could not find route by start/end points: ${error.message}. Attempting to search by trail name.`);
            }
        }

        

        if (!startCoords || !endCoords) {
            throw new Error("Could not get coordinates for one or both locations after attempting by points and trail name.");
        }

        // OpenRouteService API URL for hiking routing
        const url = "https://api.openrouteservice.org/v2/directions/foot-hiking/geojson";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json, application/geo+json, application/gpx+xml, application/polyline",
                "Content-Type": "application/json",
                "Authorization": ORS_API_KEY
            },
            body: JSON.stringify({
                coordinates: [startCoords, endCoords],
                profile: "foot-hiking", // Routing profile for hiking
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenRouteService API Error: ${response.status} - ${errorData.error ? errorData.error.message : "Unknown error"}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const route = data.features[0].geometry.coordinates;
            const leafletCoords = route.map(coord => [coord[1], coord[0]]); // Leaflet needs [latitude, longitude]

            // Add the route to the map
            routeLayer = L.polyline(leafletCoords, {
                color: "blue",
                weight: 5,
                opacity: 0.7
            }).addTo(map);

            // Adjust map zoom to route
            map.fitBounds(routeLayer.getBounds());

            // Add start and end markers
            L.marker(leafletCoords[0]).addTo(map)
                .bindPopup(`Partida: ${startPointName}`).openPopup(); // Use the location name
            L.marker(leafletCoords[leafletCoords.length - 1]).addTo(map)
                .bindPopup(`Destination: ${endPointName}`).openPopup(); // Use the location name

            // Display the distance and estimated time (if available in the ORS response)
            const summary = data.features[0].properties.summary;
            if (summary) {
                const distanceKm = (summary.distance / 1000).toFixed(2);
                const durationMinutes = (summary.duration / 60).toFixed(0);
                errorMessageDiv.textContent = `Distance: ${distanceKm} km, Estimated Duration: ${durationMinutes} minutes (approx.)`;
                errorMessageDiv.style.color = "green";
            }

        } else {
            errorMessageDiv.textContent = "No routes found for the given points.";
            errorMessageDiv.style.color = "orange";
        }

    } catch (error) {
        console.error("Error fetching route:", error);
        errorMessageDiv.textContent = `Error: ${error.message}`;
        errorMessageDiv.style.color = "red";
    } finally {
        loader.style.display = "none"; // Hide the loader
    }
}

function loadMap(){
    dataTrail = loadTrailsData();
    loadSelectedTrail(dataTrail);
}



window.loadMap = loadMap;