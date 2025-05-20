async function fetchTrails() {
  const lat = -23.5489; // Exemplo: São Paulo
  const lon = -46.6388;

  const res = await fetch(`/api/trails?lat=${lat}&lon=${lon}`);
  const data = await res.json();

  const container = document.getElementById('trail-list');
  container.innerHTML = data.trails.map(trail => `
    <div>
      <h3>${trail.name}</h3>
      <p>${trail.location}</p>
      <p>Dificuldade: ${trail.difficulty}</p>
    </div>
  `).join('');
}

fetchTrails();
