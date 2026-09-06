let user = null;
function loadUserData() {
    const savedData = localStorage.getItem('userTrackerData');
    if (savedData) {
        user = JSON.parse(savedData);
    } else {
        console.warn("Данные анкеты не найдены!");
    }
}

let currentDate = new Date();
let daysData = {};

const radii = { carbs: 160, protein: 130, fats: 100 };
const circumferences = {
    carbs: 2 * Math.PI * radii.carbs,
    protein: 2 * Math.PI * radii.protein,
    fats: 2 * Math.PI * radii.fats
};

function initCircles() {
    ['carbs', 'protein', 'fats'].forEach(m => {
        const el = document.getElementById(`circle-${m}`);
        if (el) {
            el.style.strokeDasharray = circumferences[m];
            el.style.strokeDashoffset = circumferences[m];
        }
    });
}

function updateUI() {
    if (!user) return;
    const key = currentDate.toISOString().split('T')[0];
    const meals = daysData[key] || [];
    
    let totals = { carbs: 0, protein: 0, fats: 0, calories: 0 };
    meals.forEach(m => {
        totals.carbs += m.carbs;
        totals.protein += m.protein;
        totals.fats += m.fats;
        totals.calories += m.calories;
    });

    const setRing = (id, cur, req, circ) => {
        const targetReq = req || 1; 
        const offset = circ - (Math.min(cur / targetReq, 1) * circ);
        const el = document.getElementById(id);
        if (el) el.style.strokeDashoffset = offset;
    };

    setRing('circle-carbs', totals.carbs, user.requiredCarbohydrates, circumferences.carbs);
    setRing('circle-protein', totals.protein, user.requiredProteins, circumferences.protein);
    setRing('circle-fats', totals.fats, user.requiredFats, circumferences.fats);

    document.getElementById('main-cal-display').textContent = Math.round(totals.calories);
    document.getElementById('stat-carbs').textContent = `${Math.round(totals.carbs)}г / ${user.requiredCarbohydrates}г`;
    document.getElementById('stat-protein').textContent = `${Math.round(totals.protein)}г / ${user.requiredProteins}г`;
    document.getElementById('stat-fats').textContent = `${Math.round(totals.fats)}г / ${user.requiredFats}г`;
    
    const left = user.requiredCalories - totals.calories;
    document.getElementById('text-left').textContent = `Осталось: ${Math.max(Math.round(left), 0)} ккал`;
    
    const options = { day: 'numeric', month: 'long' };
    document.getElementById('date-title').textContent = currentDate.toLocaleDateString('ru-RU', options);

    renderFoodList(meals);
}

function renderFoodList(meals) {
    const container = document.getElementById('food-items-container');
    if (meals.length === 0) {
        container.innerHTML = `<div class="empty-placeholder"><p>Дневник пуст</p></div>`;
    } else {
        container.innerHTML = meals.map(m => `
            <div class="food-item">
                <div>
                    <div style="font-weight:700; font-size:18px;">${m.name}</div>
                    <div style="font-size:14px; color:gray;">Б ${m.protein}г · Ж ${m.fats}г · У ${m.carbs}г</div>
                </div>
                <div style="font-size:20px; font-weight:800; color:green;">${m.calories} ккал</div>
            </div>
        `).join('');
    }
}

// ОСНОВНАЯ ФУНКЦИЯ: Добавление еды через ИИ или вручную
document.getElementById('btn-save').onclick = async () => {
    const btnSave = document.getElementById('btn-save');
    const name = document.getElementById('input-name').value;
    let c = parseFloat(document.getElementById('input-carbs').value);
    let p = parseFloat(document.getElementById('input-protein').value);
    let f = parseFloat(document.getElementById('input-fats').value);

    if (!name) return alert("Введите название блюда");

    // Если поля БЖУ пусты, запрашиваем их у сервера
    if (isNaN(c) || isNaN(p) || isNaN(f)) {
        btnSave.textContent = "Считаем...";
        btnSave.disabled = true;

        try {
            const response = await fetch('/get-nutrition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: name })
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            p = data.protein;
            f = data.fats;
            c = data.carbs;
        } catch (error) {
            alert("Ошибка ИИ: " + error.message);
            btnSave.textContent = "Добавить в дневник";
            btnSave.disabled = false;
            return;
        }
    }

    const cal = (c * 4) + (p * 4) + (f * 9);
    const key = currentDate.toISOString().split('T')[0];
    
    if(!daysData[key]) daysData[key] = [];
    daysData[key].push({ name, carbs: c, protein: p, fats: f, calories: Math.round(cal) });
    
    btnSave.textContent = "Добавить в дневник";
    btnSave.disabled = false;
    document.getElementById('modal').classList.remove('active');
    document.querySelectorAll('input').forEach(i => i.value = '');
    updateUI();
};

// Инициализация
loadUserData();
initCircles();
updateUI();

document.getElementById('btn-prev').onclick = () => { currentDate.setDate(currentDate.getDate() - 1); updateUI(); };
document.getElementById('btn-next').onclick = () => { currentDate.setDate(currentDate.getDate() + 1); updateUI(); };
document.getElementById('btn-add').onclick = () => document.getElementById('modal').classList.add('active');
document.getElementById('btn-cancel').onclick = () => document.getElementById('modal').classList.remove('active');