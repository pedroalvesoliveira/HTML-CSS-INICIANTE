const todoList = document.getElementById('todoList');
const completedCount = document.getElementById('completedCount');
const resetButton = document.getElementById('resetButton');
const submitButton = document.getElementById('submitButton');
const dayDate = document.getElementById('dayDate');
const savedDaysCount = document.getElementById('savedDaysCount');
const historyList = document.getElementById('historyList');
const historyMessage = document.getElementById('historyMessage');
const STORAGE_KEY = 'checklistDailyRecords';
const totalTasks = 5;

function updateSummary() {
    const checkboxes = todoList.querySelectorAll('input[type="checkbox"]');
    const completed = Array.from(checkboxes).filter(input => input.checked).length;
    completedCount.textContent = completed;
}

function loadRecords() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateHistory() {
    const records = loadRecords();
    savedDaysCount.textContent = records.length;
    historyList.innerHTML = '';

    if (records.length === 0) {
        historyMessage.textContent = 'Os dados de cada dia serão salvos aqui.';
        return;
    }

    historyMessage.textContent = 'Toque em Enviar para salvar o resumo do dia atual.';

    records.slice().reverse().forEach(record => {
        const item = document.createElement('li');
        item.className = 'history-item';
        item.innerHTML = `
            <span><strong>Dia:</strong> ${formatDate(record.date)}</span>
            <span><strong>Realizadas:</strong> ${record.completed} de ${record.total}</span>
            <span><strong>Itens:</strong> ${record.items.join(', ')}</span>
        `;
        historyList.appendChild(item);
    });
}

function getCurrentRecord() {
    const dateValue = dayDate.value || new Date().toISOString().slice(0, 10);
    const checkboxInputs = todoList.querySelectorAll('input[type="checkbox"]');
    const completed = Array.from(checkboxInputs).filter(input => input.checked).length;
    const items = Array.from(checkboxInputs)
        .filter(input => input.checked)
        .map(input => input.value);

    return {
        date: dateValue,
        completed,
        total: totalTasks,
        items,
    };
}

function saveTodayRecord() {
    const record = getCurrentRecord();
    const records = loadRecords();
    const existingIndex = records.findIndex(item => item.date === record.date);

    if (existingIndex >= 0) {
        records[existingIndex] = record;
    } else {
        records.push(record);
    }

    saveRecords(records);
    updateHistory();
}

todoList.addEventListener('change', event => {
    if (event.target.matches('input[type="checkbox"]')) {
        updateSummary();
    }
});

resetButton.addEventListener('click', () => {
    const checkboxes = todoList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(input => input.checked = false);
    updateSummary();
});

submitButton.addEventListener('click', () => {
    if (!dayDate.value) {
        dayDate.value = new Date().toISOString().slice(0, 10);
    }
    saveTodayRecord();
});

(function init() {
    updateSummary();
    updateHistory();
    if (!dayDate.value) {
        dayDate.value = new Date().toISOString().slice(0, 10);
    }
})();
