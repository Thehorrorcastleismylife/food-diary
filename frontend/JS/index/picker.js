// ============================================
// Класс Picker
// ============================================
class Picker {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.data = data;
        this.options = {
            itemHeight: 72,
            initialIndex: options.initialIndex || 0,
            ...options
        };

        this.selectedIndex = this.options.initialIndex;

        this.pickerWrapper = document.getElementById(containerId);
        if (!this.pickerWrapper) {
            console.error(`Picker wrapper with id "${containerId}" not found`);
            return;
        }

        this.pickerContent = this.pickerWrapper.querySelector('.picker-content');
        if (!this.pickerContent) {
            console.error(`Picker content not found in "${containerId}"`);
            return;
        }

        this.init();
    }

    init() {
        this.renderItems();
        this.scrollToIndex(this.selectedIndex, false);
        this.updateSelectedState();
        this.setupScrollHandlers();
    }

    renderItems() {
        this.pickerContent.innerHTML = '';
        this.data.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'picker-item';
            div.dataset.index = index;
            div.innerHTML = `
                <span class="picker-item-label">${item.label}</span>
                <span class="picker-item-value">${item.value}</span>
            `;
            div.addEventListener('click', () => this.scrollToItem(index));
            this.pickerContent.appendChild(div);
        });
    }

    scrollToIndex(index, animate = true) {
        index = Math.max(0, Math.min(index, this.data.length - 1));
        this.selectedIndex = index;

        const offset = -(index * this.options.itemHeight) + (this.pickerWrapper.offsetHeight / 2) - (this.options.itemHeight / 2);

        this.pickerContent.style.transition = animate ? 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
        this.pickerContent.style.transform = `translateY(${offset}px)`;
        this.updateSelectedState();
    }

    scrollToItem(index) {
        this.scrollToIndex(index, true);
    }

    updateSelectedState() {
        const items = this.pickerContent.querySelectorAll('.picker-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }

    setupScrollHandlers() {
        let startY = 0;
        let isDragging = false;
        let startPos = 0;

        const startDrag = (e) => {
            isDragging = true;
            startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startPos = this.getTranslateY();
            this.pickerContent.style.transition = 'none';

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const newY = startPos + (currentY - startY);
            this.pickerContent.style.transform = `translateY(${newY}px)`;
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);

            const translateY = this.getTranslateY();
            const centerOffset = (this.pickerWrapper.offsetHeight / 2) - (this.options.itemHeight / 2);
            const newIndex = Math.round((centerOffset - translateY) / this.options.itemHeight);

            this.scrollToIndex(newIndex, true);
        };

        this.pickerWrapper.addEventListener('mousedown', startDrag);
        this.pickerWrapper.addEventListener('touchstart', startDrag, { passive: true });

        this.pickerWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            this.scrollToIndex(this.selectedIndex + delta, true);
        }, { passive: false });
    }

    getTranslateY() {
        const transform = this.pickerContent.style.transform;
        if (transform) {
            const match = transform.match(/translateY\((-?\d+\.?\d*)px\)/);
            if (match) return parseFloat(match[1]);
        }
        return 0;
    }

    getValue() {
        return this.data[this.selectedIndex].value;
    }
}

// ============================================
// Глобальные переменные для пикеров
// ============================================
let pickerWeight = null;
let pickerHeight = null;
let pickerAge = null;
let desiredWeight = null;

// ============================================
// Данные для пикеров
// ============================================
const weightData = Array.from({ length: 121 }, (_, i) => ({ label: 'КГ', value: i + 35 }));
const heightData = Array.from({ length: 121 }, (_, i) => ({ label: 'СМ', value: i + 100 }));
const ageData = Array.from({ length: 82 }, (_, i) => ({ label: 'ЛЕТ', value: i + 15 }));
const desiredWeightData = Array.from({ length: 121 }, (_, i) => ({ label: 'КГ', value: i + 36 }));
// ============================================
// Функция для получения значения активного пикера
// ============================================
function getSelectedValue() {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return null;

    const step = activeScreen.dataset.step;

    switch(step) {
        case '4':
            return pickerWeight ? pickerWeight.getValue() : null;
        case '5':
            return pickerHeight ? pickerHeight.getValue() : null;
        case '6':
            return pickerAge ? pickerAge.getValue() : null;
        case '7': 
            return desiredWeight ? desiredWeight.getValue() : null;
        default:
            return null;
    }
}

// ============================================
// Инициализация пикеров (вызывать при показе экрана)
// ============================================
function initWeightPicker() {
    if (!pickerWeight) {
        // Используем ID из HTML: pickerWrapper
        pickerWeight = new Picker('pickerWrapper', weightData, { initialIndex: 20 });
        console.log('Weight picker initialized:', pickerWeight);
    }
}

function initHeightPicker() {
    if (!pickerHeight) {
        pickerHeight = new Picker('pickerWrapperHeight', heightData, { initialIndex: 70 });
    }
}

function initAgePicker() {
    if (!pickerAge) {
        pickerAge = new Picker('pickerWrapperAge', ageData, { initialIndex: 12 });
    }
}
function initDesiredWeightPicker() {
    if (!desiredWeight) {
        desiredWeight = new Picker('pickerWrapperDesiredWeight', desiredWeightData, { initialIndex: 20 });
    }
}

// Экспортируем класс
window.Picker = Picker;