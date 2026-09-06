let user = {
    male: "",
    age: 0,
    weight: 0,
    height: 0,
    activity: 0,
    desiredWeight: 0,

    // необходимый КБЖУ
    requiredCalories: 0,
    requiredCarbohydrates: 0,
    requiredFats: 0,
    requiredProteins: 0
}

function setMale() {
    user.male = document.querySelector('.male-button-pressed').textContent
    console.log(user.male)
}
function setActivity() {
    const activityButtonPressed = document.querySelector('.activity-btn-pressed')
    user.activity = parseFloat(activityButtonPressed.dataset.coeff)
    console.log(user.activity)
}
function setWeight() {
    user.weight = getSelectedValue();
    console.log(user.weight)
}
function setHeight() {
    user.height = getSelectedValue();
    console.log(user.height)
}
function setAge() {
    user.age = getSelectedValue();
    console.log(user.age)
}
function setDesiredWeight() {
    user.desiredWeight = getSelectedValue();
    console.log(user.desiredWeight)
}

function calculateNutrition() {
    // Расчёт базового обмена веществ (BMR) по формуле Миффлина-Сан Жеора
    let BMR;
    if (user.male === "Мужской") {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }

    // Общие энергетические затраты (TDEE)
    let TDEE = BMR * user.activity;

    let calories, proteins, fats, carbohydrates;

    // Если набор веса
    if (user.weight < user.desiredWeight) {
        // Добавляем 10-15% к TDEE для набора массы
        calories = TDEE * 1.15;
        
        // Соотношение БЖУ для набора: 25% белки, 25% жиры, 50% углеводы
        proteins = calories * 0.25 / 4;  // 1г белка = 4 ккал
        fats = calories * 0.25 / 9;      // 1г жира = 9 ккал
        carbohydrates = calories * 0.50 / 4;  // 1г углевода = 4 ккал
    }
    // Если похудение
    else if (user.weight > user.desiredWeight) {
        // Уменьшаем на 15-20% от TDEE для дефицита
        calories = TDEE * 0.80;
        
        // Соотношение БЖУ для похудения: 40% белки, 25% жиры, 35% углеводы
        proteins = calories * 0.40 / 4;
        fats = calories * 0.25 / 9;
        carbohydrates = calories * 0.35 / 4;
    }
    // Если поддержание веса
    else {
        calories = TDEE;
        
        // Соотношение БЖУ для поддержания: 30% белки, 30% жиры, 40% углеводы
        proteins = calories * 0.30 / 4;
        fats = calories * 0.30 / 9;
        carbohydrates = calories * 0.40 / 4;
    }

    // Округляем значения
    user.requiredCalories = Math.round(calories);
    user.requiredProteins = Math.round(proteins);
    user.requiredFats = Math.round(fats);
    user.requiredCarbohydrates = Math.round(carbohydrates);
    localStorage.setItem('userTrackerData', JSON.stringify(user));
    window.location.replace('./mainPage.html');
    return user;
}

