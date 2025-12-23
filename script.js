
var btn = document.getElementById("add_btn");
var modal = document.getElementById("add_popup");
var closeBtn = document.getElementById("close");
var cancelBtn = document.getElementById("cancel");
var submitBtn = document.getElementById("submit");
var incometab = document.getElementById("income");
var expensetab = document.getElementById("expense");
var tablebody = document.getElementById("table-body");
var selectedType = "income";


// --------------------FILTER CATEGORY ------------------------

var selectedFilter = "all";
var filterRadios = document.querySelectorAll('input[name="filter"]');

filterRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
        selectedFilter = this.value;
        getData(); 
    });
});

// ------------------ POPUP OPEN / CLOSE ------------------

if (btn) {
    btn.addEventListener("click", function () {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });
}

if (modal) {
    modal.addEventListener("click", function (bg_click) {
        if (bg_click.target === modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });
}

// ------------------ TAB ------------------

if (incometab) {
    incometab.addEventListener("click", function (itab) {
        itab.preventDefault();

        selectedType = "income";

        incometab.classList.add("bg-blue-600", "text-white");
        incometab.classList.remove("text-black");

        if (expensetab) {
            expensetab.classList.remove("bg-blue-600", "text-white");
            expensetab.classList.add("text-black");
        }
    });
}

if (expensetab) {
    expensetab.addEventListener("click", function (etab) {
        etab.preventDefault();

        selectedType = "expense";

        expensetab.classList.add("bg-blue-600", "text-white");
        expensetab.classList.remove("text-black");

        if (incometab) {
            incometab.classList.remove("bg-blue-600", "text-white");
            incometab.classList.add("text-black");
        }
    });
}

// ------------------ POST DATA ------------------

async function postdata() {

    var description = document.getElementById("description").value;
    var amount = document.getElementById("amount").value;



    var Data = {
        description: description,
        amount: amount,
        type: selectedType,
    };

    try {
        await fetch("https://6948f4011ee66d04a450a0a4.mockapi.io/entries", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(Data)
        });

        await getData();   

        modal.classList.add("hidden");
        modal.classList.remove("flex");

        form.reset();

    } catch (error) {
    }
}

// ------------------ GET DATA ------------------

async function getData() {

    if (!tablebody) return;

    try {
        var finalData = await fetch("https://6948f4011ee66d04a450a0a4.mockapi.io/entries");
        var finalD = await finalData.json();


        if (selectedFilter !== "all") {
            finalD = finalD.filter(item => item.type === selectedFilter);
        }

        tablebody.innerHTML = "";

        finalD.forEach(function (final) {

            var tr = document.createElement("tr");
            tr.setAttribute("class", "hover:bg-gray-50 transition-colors")

            var descTd = document.createElement("td");
            descTd.setAttribute("class", "px-6 py-4 text-sm font-medium text-gray-900 truncate")
            descTd.innerText = final.description;

            var amtTd = document.createElement("td");
            amtTd.setAttribute("class", "px-6 py-4 text-sm font-medium text-gray-900 truncate")

            amtTd.innerText = final.amount;

            var typeTd = document.createElement("td");
            typeTd.setAttribute("class", "px-6 py-4");

            if (final.type === "income") {
                typeTd.setAttribute(
                    "class",
                    "inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md m-4 uppercase"
                );
            } else {
                typeTd.setAttribute(
                    "class",
                    "inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md m-4 uppercase"
                );
            }

            typeTd.innerText = final.type;

            var actionTd = document.createElement("td");
            actionTd.setAttribute("class", "px-6 py-4 flex gap-3");

            // -------- EDIT BUTTON --------
            var editBtn = document.createElement("button");
            editBtn.setAttribute(
                "class",
                "h-9 w-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
            );
            editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="h-4 w-4 text-gray-600">
                  <path
                    d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>`;

            editBtn.addEventListener("click", function () {
                openEditPopup(final);
            });

            // -------- DELETE BUTTON --------
            var deleteBtn = document.createElement("button");
            deleteBtn.setAttribute("class",
                "h-9 w-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
            );

            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="size-6 h-5 w-5 text-gray-600">
                  <path fill-rule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clip-rule="evenodd" />
                </svg>`;

            var deleteId = null;

            deleteBtn.addEventListener("click", function () {
                deleteId = final.id; // store row id

                var deletePopup = document.getElementById("delete_popup");
                deletePopup.classList.remove("hidden");
                deletePopup.classList.add("flex");
            });



            var deletePopup = document.getElementById("delete_popup");
            var cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

            if (cancelDeleteBtn) {
                cancelDeleteBtn.addEventListener("click", function () {
                    deleteId = null;
                    deletePopup.classList.add("hidden");
                    deletePopup.classList.remove("flex");
                });
            }

            var confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

            if (confirmDeleteBtn) {
                confirmDeleteBtn.addEventListener("click", async function () {

                    if (!deleteId) return;

                    try {
                        await fetch(
                            "https://6948f4011ee66d04a450a0a4.mockapi.io/entries/" + deleteId,
                            { method: "DELETE" }
                        );

                        deleteId = null;

                        deletePopup.classList.add("hidden");
                        deletePopup.classList.remove("flex");

                        await getData(); // refresh table

                    } catch (error) {
                        alert("Something went wrong");
                    }
                });
            }



            // FILTER CATEGORY

            
            actionTd.appendChild(editBtn);
            actionTd.appendChild(deleteBtn);
            tr.appendChild(descTd);
            tr.appendChild(typeTd);
            tr.appendChild(amtTd);
            tr.appendChild(actionTd);
            tablebody.appendChild(tr);
        });

    } catch (error) {
        alert("Something went wrong");
    }


    // -----------------UPDATE WIDGETS -------------------------

    async function updateWidgets() {

        const result = await fetch("https://6948f4011ee66d04a450a0a4.mockapi.io/entries");
        const data = await result.json();

        let income = 0;
        let expense = 0;

        data.forEach(item => {
            const amount = Number(item.amount);

            if (item.type === "income") {
                income += amount;
            } else if (item.type === "expense") {
                expense += amount;
            }
        });

        const netBalance = 30000 + income - expense;

        document.getElementById("incomeTotal").innerText = "₹" + income;
        document.getElementById("expenseTotal").innerText = "₹" + expense;
        document.getElementById("netBalance").innerText = "₹" + netBalance;
    }
    updateWidgets();
    
}

// -------- EDIT BUTTON --------

var editIncomeTab = document.getElementById("edit_income");
var editExpenseTab = document.getElementById("edit_expense");

if (editIncomeTab) {
    editIncomeTab.addEventListener("click", function () {
        selectedType = "income";

        editIncomeTab.classList.add("bg-blue-600", "text-white");
        editExpenseTab.classList.remove("bg-blue-600", "text-white");
        editExpenseTab.classList.add("text-black");
    });
}

if (editExpenseTab) {
    editExpenseTab.addEventListener("click", function () {
        selectedType = "expense";

        editExpenseTab.classList.add("bg-blue-600", "text-white");
        editIncomeTab.classList.remove("bg-blue-600", "text-white");
        editIncomeTab.classList.add("text-black");
    });
}


function openEditPopup(data) {

    editId = data.id;

    document.getElementById("edit_popup").classList.remove("hidden");
    document.getElementById("edit_popup").classList.add("flex");

    document.getElementById("edit_description").value = data.description;
    document.getElementById("edit_amount").value = data.amount;

    selectedType = data.type;

    if (data.type === "income") {
        editIncomeTab.classList.add("bg-blue-600", "text-white");
        editExpenseTab.classList.remove("bg-blue-600", "text-white");
    } else {
        editExpenseTab.classList.add("bg-blue-600", "text-white");
        editIncomeTab.classList.remove("bg-blue-600", "text-white");
    }
}



// --------------------UPDATE WIDGETS-------------

var updateBtn = document.getElementById("updateBtn");

if (updateBtn) {
    updateBtn.addEventListener("click", async function () {

        if (!editId) {
            console.log("NO EDIT ID");
            return;
        }

        var description = document.getElementById("edit_description").value;
        var amount = document.getElementById("edit_amount").value;

        var updatedData = {
            description: description,
            amount: amount,
            type: selectedType
        };

        console.log("UPDATING:", editId, updatedData);

        try {
            await fetch(
                "https://6948f4011ee66d04a450a0a4.mockapi.io/entries/" + editId,
                {
                    method: "PUT",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(updatedData)
                }
            );

            editId = null;

            document.getElementById("edit_popup").classList.add("hidden");
            document.getElementById("edit_popup").classList.remove("flex");

            await getData();

        } catch (error) {
            alert("Update failed");
        }
    });
}


getData();









