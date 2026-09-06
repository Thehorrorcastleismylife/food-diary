function changeData() {
    // 1. Собираем новые данные из формы
    const newData = {
        age: parseFloat(document.getElementById('age').value) || 0,
        weight: parseFloat(document.getElementById('weight').value) || 0,
        height: parseFloat(document.getElementById('height').value) || 0,
        activity: parseFloat(document.getElementById('activity').value) || 0,
        desiredWeight: parseFloat(document.getElementById('desiredWeight').value) || 0
    };

    // 2. Загружаем текущий объект пользователя (там есть male и другие поля)
    const savedData = localStorage.getItem('userTrackerData');
    let userCurrent = JSON.parse(savedData);

    // 3. Обновляем изменённые поля
    Object.assign(userCurrent, newData);

    // 4. ПЕРЕСЧИТЫВАЕМ КБЖУ (важно!)
    const updatedUser = recalculateNutrition(userCurrent);

    // 5. Сохраняем в localStorage
    localStorage.setItem('userTrackerData', JSON.stringify(updatedUser));

    // 6. Переходим на главную страницу
    window.location.replace('./mainPage.html');
}

// Вынесенная функция пересчёта (можно подключить как модуль или продублировать)
function recalculateNutrition(user) {
    // BMR по Миффлину-Сан Жеору
    let BMR;
    if (user.male === "Мужской") {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    } else {
        BMR = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
    }

    let TDEE = BMR * user.activity;
    let calories, proteins, fats, carbohydrates;

    if (user.weight < user.desiredWeight) {
        calories = TDEE * 1.15;
        proteins = calories * 0.25 / 4;
        fats = calories * 0.25 / 9;
        carbohydrates = calories * 0.50 / 4;
    } else if (user.weight > user.desiredWeight) {
        calories = TDEE * 0.80;
        proteins = calories * 0.40 / 4;
        fats = calories * 0.25 / 9;
        carbohydrates = calories * 0.35 / 4;
    } else {
        calories = TDEE;
        proteins = calories * 0.30 / 4;
        fats = calories * 0.30 / 9;
        carbohydrates = calories * 0.40 / 4;
    }

    user.requiredCalories = Math.round(calories);
    user.requiredProteins = Math.round(proteins);
    user.requiredFats = Math.round(fats);
    user.requiredCarbohydrates = Math.round(carbohydrates);

    return user;
}