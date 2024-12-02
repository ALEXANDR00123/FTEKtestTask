let cargoCounter = 0;

function generateCargoId() {
    const prefix = 'CARGO';
    cargoCounter++;
    return `${prefix}${cargoCounter.toString().padStart(3, "0")}`;
}

const cargoList = [
    {
        id: generateCargoId(),
        name: "Строительные материалы",
        status: "В пути",
        origin: "Москва",
        destination: "Казань",
        departureDate: "2024-11-24"
    },
    {
        id: generateCargoId(),
        name: "Хрупкий груз",
        status: "Ожидает отправки",
        origin: "Санкт-Петербург",
        destination: "Екатеринбург",
        departureDate: "2024-11-26"
    }
];

// Получить класс для статуса
function getStatusClass(status) {
    switch (status) {
        case "Ожидает отправки":
            return "status-ozhidayet"; 
        case "В пути":
            return "status-vputi";
        case "Доставлен":
            return "status-dostavlen";
        default:
            return "";
    }
}

// Обновление статуса
function updateCargoStatus(cargoId, newStatus) {
    const cargo = cargoList.find(c => c.id === cargoId);
    if (cargo) {
        const today = new Date();
        const departureDate = new Date(cargo.departureDate);

        if (newStatus === "Доставлен" && departureDate > today) {
            alert("Невозможно изменить статус на 'Доставлен', так как дата отправления еще в будущем.");
            return;
        }

        cargo.status = newStatus;
        populateTable();
    }
}

// Заполнение таблицы
function populateTable(statusFilter = "all") {
    const tableBody = $("#cargo-table-body");
    tableBody.empty();

    const filteredCargoList = cargoList.filter(cargo =>
        statusFilter === "all" || cargo.status === statusFilter
    );

    filteredCargoList.forEach((cargo) => {
        const statusClass = getStatusClass(cargo.status);

        const row = `
            <tr>
                <td>${cargo.id}</td>
                <td>${cargo.name}</td>
                <td class="status ${statusClass}">${cargo.status}</td>
                <td>${cargo.origin}</td>
                <td>${cargo.destination}</td>
                <td>${cargo.departureDate}</td>
                <td>
                    <select class="form-select status-select" data-id="${cargo.id}">
                        <option ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
                        <option ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
                        <option ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
                    </select>
                </td>
            </tr>
        `;
        tableBody.append(row);
        tableBody.find("tr:last").hide().fadeIn(500); 
    });
}

// Обработчик изменения статуса груза
$(document).on("change", ".status-select", function() {
    const cargoId = $(this).data("id");
    const newStatus = $(this).val();
    updateCargoStatus(cargoId, newStatus);
});

// Обработчик изменения фильтра
$("#statusFilter").on("change", function() {
    const statusFilter = $(this).val();
    populateTable(statusFilter);
});

// Обработчик добавления нового груза
$("#addCargoForm form").on("submit", function(e) {
    e.preventDefault();
    const cargoName = $("#cargoName").val();
    const origin = $("#origin").val();
    const destination = $("#destination").val();
    const departureDate = $("#departureDate").val();
    const status = $("#status").val();

    if (!cargoName || !origin || !destination || !departureDate || !status) {
        $("#formError").show();
    } else {
        $("#formError").hide();
        cargoList.push({
            id: generateCargoId(),
            name: cargoName,
            status: status,
            origin: origin,
            destination: destination,
            departureDate: departureDate
        });
        populateTable();
        $(this).trigger("reset");
    }
});

// добавления нового груза
$("#toggleFormBtn").on("click", function() {
    $("#addCargoForm").toggle();
    $(this).text($(this).text() === "Добавить новый груз" ? "Скрыть форму" : "Добавить новый груз");
});

// Инициализация таблицы
$(document).ready(function() {
    populateTable();
});
