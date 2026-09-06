const maleButtons = document.querySelectorAll('.male-button')
const nextButton = document.querySelector('.arrow-right')

maleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        maleButtons.forEach(btnForRemoveClass => {
            btnForRemoveClass.classList.remove('male-button-pressed')
        })
          btn.classList.toggle('male-button-pressed')
          nextButton.classList.add('next')
    })
});