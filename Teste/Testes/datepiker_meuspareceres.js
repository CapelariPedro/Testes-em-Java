
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const calendar = document.getElementById('calendar');
const headerText = document.getElementById('header-text');
const calendarContent = document.getElementById('calendar-content');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const modeDayBtn = document.getElementById('mode-day');
const modeMonthBtn = document.getElementById('mode-month');
const modeYearBtn = document.getElementById('mode-year');
const calendarContainer = document.getElementById('calendar-container');

let currentDate = new Date();
let selectedStart = null;
let selectedEnd = null;
let activeInput = null;
let mode = 'day'; // 'day', 'month', 'year'

// Formata data para DD/MM/YYYY
function formatDate(date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
}

// Parse DD/MM/YYYY para Date
function parseDate(str) {
    const parts = str.split('/');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    if (date && date.getDate() === d && date.getMonth() === m && date.getFullYear() === y) {
        return date;
    }
    return null;
}

// Atualiza os inputs com as datas selecionadas
function updateInputs() {
    startInput.value = selectedStart ? formatDate(selectedStart) : '';
    endInput.value = selectedEnd ? formatDate(selectedEnd) : '';
}

// Exibe calendário baseado no modo atual
function renderCalendar() {
    calendarContent.innerHTML = ''; // limpa conteúdo
    if (mode === 'day') {
        renderDayView();
    } else if (mode === 'month') {
        renderMonthView();
    } else if (mode === 'year') {
        renderYearView();
    }
}

// Renderiza dias do mês
function renderDayView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Torna o texto do mês/ano clicável para alternar para modo mês
    headerText.innerHTML = `<span id="month-label" style="cursor:pointer;color:#004d00;font-weight:bold;">${monthName(month)}</span> <span id="year-label" style="cursor:pointer;color:#004d00;font-weight:bold;">${year}</span>`;

    // Adiciona eventos
    document.getElementById('month-label').onclick = () => {
        mode = 'month';
        renderCalendar();
    };
    document.getElementById('year-label').onclick = () => {
        mode = 'year';
        renderCalendar();
    };

    // Cabeçalho dias da semana
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');
    dayNames.forEach(day => {
        let th = document.createElement('th');
        th.textContent = day;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    // Dias do mês
    let tbody = document.createElement('tbody');

    // Primeiro dia do mês pegar qual dia da semana
    let firstDay = new Date(year, month, 1);
    let lastDay = new Date(year, month + 1, 0);
    let startDay = firstDay.getDay();
    let totalDays = lastDay.getDate();

    let dayCount = 1;
    for (let week = 0; week < 6; week++) {
        let tr = document.createElement('tr');
        for (let d = 0; d < 7; d++) {
            let td = document.createElement('td');
            if ((week === 0 && d < startDay) || dayCount > totalDays) {
                td.textContent = '';
                td.style.pointerEvents = 'none';
            } else {
                td.textContent = dayCount;

                const cellDate = new Date(year, month, dayCount);

                // Destaca início, fim e range
                if (selectedStart && isSameDate(cellDate, selectedStart)) {
                    td.classList.add('selected-start');
                }
                if (selectedEnd && isSameDate(cellDate, selectedEnd)) {
                    td.classList.add('selected-end');
                }
                if (selectedStart && selectedEnd && cellDate > selectedStart && cellDate < selectedEnd) {
                    td.classList.add('in-range');
                }

                td.addEventListener('click', () => {
                    onDateClick(cellDate);
                });
                dayCount++;
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);

        if (dayCount > totalDays) break; // Não criar linhas extras desnecessárias
    }
    table.appendChild(tbody);
    calendarContent.appendChild(table);

    // Adiciona botão "Hoje"
    let hojeBtn = document.createElement('button');
    hojeBtn.textContent = 'Hoje';
    hojeBtn.style.marginTop = '10px';
    hojeBtn.style.width = '100%';
    hojeBtn.style.padding = '8px';
    hojeBtn.style.background = '#004d00';
    hojeBtn.style.color = '#fff';
    hojeBtn.style.border = 'none';
    hojeBtn.style.borderRadius = '6px';
    hojeBtn.style.fontWeight = 'bold';
    hojeBtn.style.cursor = 'pointer';

    hojeBtn.onclick = () => {
        const hoje = new Date();
        if (activeInput === startInput) {
            selectedStart = hoje;
        } else if (activeInput === endInput) {
            selectedEnd = hoje;
        }
        updateInputs();
        renderCalendar();
    };

    calendarContent.appendChild(hojeBtn);
}

// Renderiza seleção de meses
function renderMonthView() {
    const year = currentDate.getFullYear();
    // Torna o texto do ano clicável para alternar para modo ano
    headerText.innerHTML = `<span id="year-label" style="cursor:pointer;color:#004d00;font-weight:bold;">${year}</span>`;

    document.getElementById('year-label').onclick = () => {
        mode = 'year';
        renderCalendar();
    };

    let months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    for (let i = 0; i < 3; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            let index = i * 4 + j;
            let td = document.createElement('td');
            td.textContent = months[index];
            td.style.cursor = 'pointer';

            // Destaque se dentro do intervalo selecionado
            const cellDate = new Date(year, index, 1);

            if (selectedStart && selectedEnd && cellDate >= firstDayOfMonth(selectedStart) && cellDate <= firstDayOfMonth(selectedEnd)) {
                td.classList.add('in-range');
            }
            if (selectedStart && isSameMonthYear(cellDate, selectedStart)) {
                td.classList.add('selected-start');
            }
            if (selectedEnd && isSameMonthYear(cellDate, selectedEnd)) {
                td.classList.add('selected-end');
            }

            td.addEventListener('click', () => {
                // Ao clicar no mês, muda para modo dia e atualiza o mês
                currentDate.setMonth(index);
                mode = 'day';
                setModeButtons();
                renderCalendar();
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    calendarContent.appendChild(table);
}

// Renderiza seleção de anos
function renderYearView() {
    let year = currentDate.getFullYear();
    let startYear = year - (year % 12);

    // Torna o texto do intervalo de anos clicável para voltar ao modo dia
    headerText.innerHTML = `<span id="years-label" style="cursor:pointer;color:#004d00;font-weight:bold;">${startYear} - ${startYear + 11}</span>`;

    document.getElementById('years-label').onclick = () => {
        mode = 'day';
        renderCalendar();
    };

    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    for (let i = 0; i < 3; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            let y = startYear + i * 4 + j;
            let td = document.createElement('td');
            td.textContent = y;
            td.style.cursor = 'pointer';

            if (selectedStart && selectedEnd && y >= selectedStart.getFullYear() && y <= selectedEnd.getFullYear()) {
                td.classList.add('in-range');
            }
            if (selectedStart && selectedStart.getFullYear() === y) {
                td.classList.add('selected-start');
            }
            if (selectedEnd && selectedEnd.getFullYear() === y) {
                td.classList.add('selected-end');
            }

            td.addEventListener('click', () => {
                currentDate.setFullYear(y);
                mode = 'month';
                setModeButtons();
                renderCalendar();
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    calendarContent.appendChild(table);
}

// Função auxiliar para verificar mesma data
function isSameDate(d1, d2) {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

// Mesma checagem para mês e ano
function isSameMonthYear(d1, d2) {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth();
}

// Primeiro dia do mês (para comparação no mês)
function firstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Obtém nome do mês
function monthName(monthIndex) {
    const names = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return names[monthIndex];
}

// Ação ao clicar numa data (dia)
function onDateClick(date) {
    if (!selectedStart || (selectedStart && selectedEnd)) {
        selectedStart = date;
        selectedEnd = null;
    } else if (date >= selectedStart) {
        selectedEnd = date;
    } else {
        // Se selecionar data antes do início, redefine início e limpa fim
        selectedStart = date;
        selectedEnd = null;
    }
    updateInputs();
    renderCalendar();
}

// Alternar entre 'startDate' e 'endDate' quando clicar
function onInputClick(e) {
    activeInput = e.target;
    // Seta data atual do calendário baseado no valor do input
    const date = parseDate(activeInput.value);
    if (date) {
        currentDate = new Date(date);
    } else if (selectedStart) {
        currentDate = new Date(selectedStart);
    } else {
        currentDate = new Date();
    }
    calendar.style.display = 'block';
    renderCalendar();
}

// Navegação de meses ou anos
prevBtn.addEventListener('click', () => {
    if (mode === 'day') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (mode === 'month') {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (mode === 'year') {
        currentDate.setFullYear(currentDate.getFullYear() - 12);
    }
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    if (mode === 'day') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (mode === 'month') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
    } else if (mode === 'year') {
        currentDate.setFullYear(currentDate.getFullYear() + 12);
    }
    renderCalendar();
});

// Toggle de modos dia, mês e ano
function setModeButtons() {
    modeDayBtn.classList.toggle('active', mode === 'day');
    modeMonthBtn.classList.toggle('active', mode === 'month');
    modeYearBtn.classList.toggle('active', mode === 'year');
}



startInput.addEventListener('click', onInputClick);
endInput.addEventListener('click', onInputClick);

/*
// Fecha calendário ao clicar fora
document.addEventListener('click', (e) => {
    if (!calendar.contains(e.target) && e.target !== startInput && e.target !== endInput) {
        calendar.style.display = 'none';
        activeInput = null;
    }
});
*/

calendar.addEventListener('mouseleave', () => {
    calendar.style.display = 'none';
});



// Atualiza data quando input perde foco (opcional)
startInput.addEventListener('blur', () => {
    if (startInput.value === '') selectedStart = null;
});
endInput.addEventListener('blur', () => {
    if (endInput.value === '') selectedEnd = null;
});

// Botão limpar
const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
    selectedStart = null;
    selectedEnd = null;
    updateInputs();
    renderCalendar();
});

