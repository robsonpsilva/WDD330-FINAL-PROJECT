document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const experience = document.getElementById("experience").value.trim();

        // Mensagem de erro
        let errorMessage = "";

        if (name.length < 2) {
            errorMessage += "The name must be at least 2 characters long.<br>";
        }
        if (phone.length < 7) {
            errorMessage += "The phone number must be at least 7 characters long.<br>";
        }
        if (address.length < 10) {
            errorMessage += "The address must be at least 10 characters long.<br>";
        }

        if (errorMessage) {
            // Exibe overlay de erro
            const errorOverlay = document.getElementById("error-overlay");
            errorOverlay.innerHTML = `<div class = "join-overlay-content"> <p>${errorMessage}</p> </div>`;
            errorOverlay.style.display = "flex";

            // Oculta o overlay após alguns segundos
            setTimeout(() => {
                errorOverlay.style.display = "none";
            }, 5000);
        } else {
            // Constrói a URL com os dados como parâmetros
            const thankYouUrl = `./thanks.html?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&experience=${encodeURIComponent(experience)}`;

            // Exibe overlay de sucesso
            document.getElementById("successOverlay").style.display = "flex";

            // Oculta o overlay após alguns segundos e redireciona
            setTimeout(function () {
                document.getElementById("successOverlay").style.display = "none";
                document.getElementById("registrationForm").reset(); // Limpa o formulário
                window.location.href = thankYouUrl; // Redireciona para a página de agradecimento
            }, 5000);
        }
    });
});









// document.addEventListener("DOMContentLoaded", function() {
//     const registrationForm = document.getElementById("registrationForm");
//     registrationForm.addEventListener("submit", function(event) {
//         event.preventDefault(); // Prevent the default form submission

//         const name = document.getElementById("name").value;
//         const address = document.getElementById("address").value;
//         const phone = document.getElementById("phone").value;
//         const email = document.getElementById("email").value;
//         const experience = document.getElementById("experience").value;

//         // Construct the URL with the data as parameters
//         const thankYouUrl = `./thanks.html?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&experience=${encodeURIComponent(experience)}`;

//         // Simulate successful submission and show the overlay
//         document.getElementById("successOverlay").style.display = "flex";

        
//         // Hide the overlay after a few seconds (optional)
//         setTimeout(function() {
//             document.getElementById("successOverlay").style.display = "none";
//             document.getElementById("registrationForm").reset(); // Clear the form
//             // Redirect to the thanks.html page
//             window.location.href = thankYouUrl;
//         }, 2000);
        
//     });
// });