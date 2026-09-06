let user = {
    male: "",
    age: 0,
    weight: 0,
    activity: 0,
}

function getMale() {
    user.male = document.querySelector('.male-button-pressed').textContent
    console.log(user.male)
}

function getActivity() {
    const activityButtonPressed = document.querySelector('.activity-btn-pressed')
    user.activity = parseFloat(activityButtonPressed.dataset.coeff)
    console.log(user.activity)
}
