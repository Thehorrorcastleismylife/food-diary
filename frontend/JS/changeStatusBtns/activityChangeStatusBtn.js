const activityButtons = document.querySelectorAll('.activity-btn')
const nextActivityBtn = document.querySelector('.arrow-right-activity')

activityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        activityButtons.forEach(btnForRemoveClass => {
            btnForRemoveClass.classList.remove('activity-btn-pressed')
        })
          btn.classList.toggle('activity-btn-pressed') 
          nextActivityBtn.classList.add('arrow-right-activity')
    })
});