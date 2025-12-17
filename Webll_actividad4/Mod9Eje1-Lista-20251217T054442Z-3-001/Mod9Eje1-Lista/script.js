const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");
const itemCount = document.getElementById("itemCount");
const clearAllBtn = document.getElementById("clearAllBtn");

const confirmBox = document.getElementById("confirmBox");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

let pendingItem = "";

/* 🔒 OCULTAR MENSAJE AL CARGAR */
confirmBox.classList.add("hidden");

/* 👉 Al presionar AÑADIR */
addBtn.addEventListener("click", () => {
    const value = itemInput.value.trim();
    if (value === "") return;

    pendingItem = value;
    confirmBox.classList.remove("hidden");
});

/* 👉 CONFIRMAR */
confirmBtn.addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = pendingItem;
    itemList.appendChild(li);

    pendingItem = "";
    itemInput.value = "";
    confirmBox.classList.add("hidden");

    updateCount();
});

/* 👉 CANCELAR */
cancelBtn.addEventListener("click", () => {
    pendingItem = "";
    confirmBox.classList.add("hidden");
});

/* 👉 LIMPIAR TODO */
clearAllBtn.addEventListener("click", () => {
    itemList.innerHTML = "";
    updateCount();
});

/* 👉 CONTADOR */
function updateCount() {
    itemCount.textContent = itemList.children.length;
}
