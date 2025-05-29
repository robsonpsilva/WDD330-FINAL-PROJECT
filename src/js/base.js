const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.comp_nav');
const listaItens = document.querySelectorAll('.comp_nav_a');


hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', () => {
    listaItens.forEach(item => {
        item.addEventListener('click', () => {
            tWayFinder(item)
        });
    });
});

function tWayFinder(item){
	listaItens.forEach(elem => {
		if (elem.textContent.trim() !== item.textContent.trim()) {
			elem.classList.remove('active');
		}
		else{
			elem.classList.add('active');
		}
	})
}

fetch('./data/hiking-places.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const cardsContainer = document.getElementById('cards-container');

    // Create cards dynamically
    let i = 1;
    data.forEach(item => {
      const card = document.createElement('article');
      card.classList.add('card');
      card.classList.add(`card${i}`);
      card.classList.add('image-container');

      card.innerHTML = `
        <h2>${item.name}</h2>
        <figure>
          <img src="${item.image}" alt="${item.name}" loading="lazy" width = "270" height = "200">
        </figure>
        <address>${item.address}</address>
        <br>
        <p class = "justified">${item.description}</p>
        <br>
        <button class = "learnmorebtn"  onclick="goToDetail(${i})">Learn More</button>
      `;
      i++;
      cardsContainer.appendChild(card);
    });
  })
  .catch(error => {
    localStorage.setItem("Err", error);
  });

  function goToDetail(number) {
    // Redireciona para a página detail com o parâmetro na URL
    window.location.href = `details.html?number=${encodeURIComponent(number)}`;
  }

  function goToJoin() {
    // Redireciona para a página detail com o parâmetro na URL
    window.location.href = `join.html`;
  }

