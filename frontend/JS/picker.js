const pickerData = [
            { label: 'Today', value: 6 },
            { label: 'Today', value: 7 },
            { label: 'Today', value: 8 },
            { label: 'Today', value: 9 },
            { label: 'Today', value: 10 },
            { label: 'Today', value: 11 },
            { label: 'Today', value: 12 },
            { label: 'Today', value: 13 },
            { label: 'Today', value: 14 },
            { label: 'Today', value: 15 },
            { label: 'Today', value: 16 },
            { label: 'Today', value: 17 },
            { label: 'Today', value: 18 },
            { label: 'Today', value: 19 },
            { label: 'Today', value: 20 }
        ];

        // Переменные
        let selectedIndex = 3; // Индекс выбранного элемента (начинаем с 9)
        let selectedValue = null; // Переменная для хранения выбранного значения
        const itemHeight = 72; // Высота одного элемента
        const visibleItems = 3; // Количество видимых элементов (сверху и снизу)
        
        // DOM элементы
        const pickerContent = document.getElementById('pickerContent');
        const pickerWrapper = document.getElementById('pickerWrapper');
        const confirmBtn = document.getElementById('confirmBtn');
        const resultValue = document.getElementById('resultValue');

        // Инициализация пикера
        function initPicker() {
            // Создаем элементы
            pickerData.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'picker-item';
                div.dataset.index = index;
                div.innerHTML = `
                    <span class="picker-item-label">${item.label}</span>
                    <span class="picker-item-value">${item.value}</span>
                `;
                div.addEventListener('click', () => scrollToItem(index));
                pickerContent.appendChild(div);
            });

            // Устанавливаем начальную позицию
            scrollToIndex(selectedIndex, false);
            updateSelectedState();

            // Добавляем обработчики событий
            setupScrollHandlers();
        }

        // Прокрутка к элементу
        function scrollToIndex(index, animate = true) {
            // Ограничиваем индекс
            index = Math.max(0, Math.min(index, pickerData.length - 1));
            selectedIndex = index;
            
            const offset = -(index * itemHeight) + (pickerWrapper.offsetHeight / 2) - (itemHeight / 2);
            
            if (animate) {
                pickerContent.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
            } else {
                pickerContent.style.transition = 'none';
            }
            
            pickerContent.style.transform = `translateY(${offset}px)`;
            updateSelectedState();
        }

        function scrollToItem(index) {
            scrollToIndex(index, true);
        }

        // Обновление состояния выбранного элемента
        function updateSelectedState() {
            const items = document.querySelectorAll('.picker-item');
            items.forEach((item, index) => {
                if (index === selectedIndex) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }

        // Настройка обработчиков скролла
        function setupScrollHandlers() {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;
            let startPos = 0;

            pickerWrapper.addEventListener('mousedown', startDrag);
            pickerWrapper.addEventListener('touchstart', startDrag, { passive: true });

            function startDrag(e) {
                isDragging = true;
                startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                startPos = getTranslateY();
                
                pickerContent.style.transition = 'none';
                
                document.addEventListener('mousemove', drag);
                document.addEventListener('touchmove', drag, { passive: false });
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchend', endDrag);
            }

            function drag(e) {
                if (!isDragging) return;
                e.preventDefault();
                
                currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
                const deltaY = currentY - startY;
                const newY = startPos + deltaY;
                
                pickerContent.style.transform = `translateY(${newY}px)`;
            }

            function endDrag() {
                if (!isDragging) return;
                isDragging = false;
                
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchend', endDrag);
                
                // Определяем ближайший элемент
                const translateY = getTranslateY();
                const centerOffset = (pickerWrapper.offsetHeight / 2) - (itemHeight / 2);
                const newIndex = Math.round((centerOffset - translateY) / itemHeight);
                
                scrollToIndex(newIndex, true);
            }

            function getTranslateY() {
                const transform = pickerContent.style.transform;
                if (transform) {
                    const match = transform.match(/translateY\((-?\d+\.?\d*)px\)/);
                    if (match) return parseFloat(match[1]);
                }
                return 0;
            }

            // Поддержка колесика мыши
            pickerWrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 1 : -1;
                scrollToIndex(selectedIndex + delta, true);
            }, { passive: false });
        }

        // Обработчик кнопки подтверждения
        confirmBtn.addEventListener('click', () => {
            // Записываем значение в переменную
            selectedValue = pickerData[selectedIndex].value;
            
            // Отображаем результат
            resultValue.textContent = selectedValue;
            
            // Можно также вывести в консоль
            console.log('Выбранное значение:', selectedValue);
            console.log('Индекс:', selectedIndex);
            console.log('Полные данные:', pickerData[selectedIndex]);
            
            // Анимация кнопки
            confirmBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                confirmBtn.style.transform = 'scale(1)';
            }, 100);
        });

        // Функция для программного получения значения
        function getSelectedValue() {
            return {
                index: selectedIndex,
                value: pickerData[selectedIndex].value,
                label: pickerData[selectedIndex].label,
                fullData: pickerData[selectedIndex]
            };
        }

        // Функция для установки значения
        function setSelectedValue(value) {
            const index = pickerData.findIndex(item => item.value === value);
            if (index !== -1) {
                scrollToIndex(index, true);
            }
        }

        // Инициализация
        initPicker();

        // Делаем функции доступными глобально (опционально)
        window.iosPicker = {
            getValue: getSelectedValue,
            setValue: setSelectedValue,
            get selectedValue() {
                return selectedValue;
            }
        };