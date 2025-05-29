document.addEventListener('DOMContentLoaded', () => {
	const locationSelect = document.getElementById('location');
	const scheduleForm = document.getElementById('schedule-form');
	const params = new URLSearchParams(window.location.search);
  	const place = params.get("number");

	const optionElement = document.getElementById('dummy');
	optionElement.value = ""; // Define o valor vazio
	optionElement.disabled = true; // Torna o option desabilitado
	optionElement.selected = true; // Define como selecionado inicialmente
	optionElement.textContent = "Select your trail"; // Texto do option
	  
	  // Adiciona o <option> ao <select>
	 locationSelect.appendChild(optionElement);
	let i = 1;
	// Load locations from JSON file
	fetch('./data/hiking-places.json')
	.then(response => response.json())
	.then(locations => {
		locations.forEach(location => {
			const option = document.createElement('option');
			option.value = i;
			i++
			option.textContent = location.name;
			locationSelect.appendChild(option);
		}
		);
		if (place !=0){
			locationSelect.value = place;
		}
		
	})
	.catch(error => console.error('Error loading locations:', error));

	// Handle form submission
	
scheduleForm.addEventListener('submit', event => {
	event.preventDefault();
	
	const selectedLocation = locationSelect.value;
	const date = document.getElementById('date').value;
	const time = document.getElementById('time').value;
	
	const schedule = {
		location: selectedLocation,
		date: date,
		time: time
	};
	
	// Salvar no localStorage
	localStorage.setItem('hikingSchedule', JSON.stringify(schedule));
	
	alert('Hiking successfully scheduled!');
	});
	
});

