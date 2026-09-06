let currentScreen = 1;

function switchToScreen(step) {
    // для 2 и 3 экрана: если нету кнопки с классом pressed на экране,
    // то не переходим на следующее окно
    if (step == 3) {
        const hasSelection = document.querySelector('.male-button-pressed')
        if (!hasSelection) return;
    }
    if (step == 4) {
        const hasSelection = document.querySelector('.activity-btn-pressed')
        if (!hasSelection) return;
    }
    
    // Убираем active с текущего экрана
    const currentScreenElement = document.querySelector(`.screen[data-step="${currentScreen}"]`);
    if (currentScreenElement) {
        currentScreenElement.classList.remove('active');
    }
    
    // Добавляем active на новый экран
    const nextScreenElement = document.querySelector(`.screen[data-step="${step}"]`);
    if (nextScreenElement) {
        nextScreenElement.classList.add('active');
        currentScreen = step;
        
        // Инициализируем пикер для текущего экрана
        initPickerForScreen(step);
    }
}

function initPickerForScreen(step) {
    if (step === 4) {
        initWeightPicker();
    } else if (step === 5) {
        initHeightPicker();
    } else if (step === 6) {
        initAgePicker();
    } else if (step === 7) {
        initDesiredWeightPicker();
    }
}

document.addEventListener('click', (e) => {
    // СПЕРВА: специальный случай — последняя стрелка
    if (e.target.closest('.arrow-right-desired-weight')) {
        e.preventDefault();
        setDesiredWeight();      // Получаем значение из пикера
        calculateNutrition();    // Считаем, сохраняем в localStorage, редиректим
        return; // ВАЖНО: выходим, чтобы не выполнялся общий код ниже
    }
    
    // ОБЩИЙ СЛУЧАЙ: все остальные кнопки "вперед"
    if (e.target.closest('.next') || 
        e.target.closest('.arrow-right') ||
        e.target.closest('.arrow-right-activity') || 
        e.target.closest('.arrow-right-weight') ||
        e.target.closest('.arrow-right-height') ||
        e.target.closest('.arrow-right-age')) {
        
        e.preventDefault();
        const nextScreen = currentScreen + 1;
        if (document.querySelector(`.screen[data-step="${nextScreen}"]`)) {
            switchToScreen(nextScreen);
        }
    }
    
    // Кнопки "назад" (без изменений)
    else if (e.target.closest('.prev') || e.target.closest('.arrow-left')) {
        e.preventDefault();
        const prevScreen = currentScreen - 1;
        if (prevScreen >= 1) {
            switchToScreen(prevScreen);
        }
    }
});