let currentScreen = 1;

function switchToScreen(step) {
    const currentScreenElement = document.querySelector(`.screen[data-step="${currentScreen}"]`);
    if (currentScreenElement) {
        currentScreenElement.classList.remove('active');
    }
    const otherScreenElement = document.querySelector(`.screen[data-step="${step}"]`);
    if (otherScreenElement) {
        otherScreenElement.classList.add('active');
        currentScreen = step;
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.next') || e.target.closest('.arrow-right-activity')) {
        e.preventDefault();
        switchToScreen(currentScreen + 1);

    }
    else if(e.target.closest('.prev')) {
        e.preventDefault();
        switchToScreen(currentScreen - 1);
    }
});