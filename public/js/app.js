const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const weatherType = document.getElementById("weatherType");

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;
    const selectedWeatherType = weatherType.options[weatherType.selectedIndex].id;

    messageOne.textContent = 'Loading';
    messageTwo.textContent = '';

    fetch('/weather?address=' + location + '&weathertype=' + selectedWeatherType).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
            } else {
                messageOne.textContent = data.messageOne;
                messageTwo.textContent = data.messageTwo
            }
        });
    });
})