import "../scss/main.scss";

const X_IMAGE = "/x.93083e62.svg";

window.onload = () => {
  let t = new Date();
  const categoryAddBtn = document.querySelector(".category-add-btn");
  categoryAddBtn.addEventListener("click", addCategoryHandler);
  const modalSaveBtn = document.querySelector(".save-btn");
  modalSaveBtn.addEventListener("click", modalSaveHandler);
  const modalCancelBtn = document.querySelector(".cancel-btn");
  modalCancelBtn.addEventListener("click", closeModal);
  loadLocalStorage();
};

const closeModal = () => {
  const modal = document.querySelector(".modal-container");
  modal.classList.add("dp-none");
  const body = document.querySelector("body");
  body.classList.remove("stop-scroll");
};

const modalSaveHandler = () => {
  const selectCategory = document.querySelector(".category-select");
  const modalInput = document.querySelector(".modal input");
  const modalTextArea = document.querySelector(".modal textarea");
  const card = createCard(modalInput.value, modalTextArea.value);
  const columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    if (column.querySelector("input").value == selectCategory.value) {
      const category = column;
      category.appendChild(card);
    }
  });
  selectCategory.value = "";
  modalInput.value = "";
  modalTextArea.value = "";

  setLocalStorage();
  closeModal();
};
const createCard = (title, content) => {
  const card = document.createElement("div");
  card.classList.add("card");
  const deleteBtn = document.createElement("img");
  deleteBtn.src = X_IMAGE;
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", deleteCardHandler);
  const titleInput = document.createElement("input");
  titleInput.value = title;
  titleInput.classList.add("title");
  titleInput.addEventListener("change", changeContentHandler);
  const divider = document.createElement("div");
  divider.classList.add("divider");
  const contentTextarea = document.createElement("textarea");
  contentTextarea.value = content;
  contentTextarea.classList.add("description");
  contentTextarea.addEventListener("change", changeContentHandler);
  contentTextarea.addEventListener("input", autoTextarea);
  card.appendChild(deleteBtn);
  card.appendChild(titleInput);
  card.appendChild(divider);
  card.appendChild(contentTextarea);
  return card;
};
const autoTextarea = (event) => {
  event.target.style.height = event.target.scrollHeight + "px";
};
const deleteCardHandler = (e) => {
  e.path[1].remove();
  setLocalStorage();
};
const changeContentHandler = () => {
  setLocalStorage();
};
const addCategoryHandler = () => {
  const categoryTitle = document.querySelector(".category-title");
  if (categoryTitle.value == "") {
    alert("카테고리 내용이 없습니다!!");
    return;
  }

  const categories = document.querySelectorAll(".category");
  categories.forEach((e) => {
    if (e.value == categoryTitle.value) {
      alert(`이미 ${categoryTitle.value}이(가) 존재합니다.`);
    }
  });
  const column = createColumn(categoryTitle.value);
  const todoContainer = document.querySelector(".todo-container");
  todoContainer.appendChild(column);
  categoryTitle.value = "";
  setLocalStorage();
};

const showModalHandler = (event) => {
  const modal = document.querySelector(".modal-container");
  const body = document.querySelector("body");
  body.classList.add("stop-scroll");
  modal.style.top = `${window.scrollY}px`;
  modal.classList.remove("dp-none");
  updateSelectBox(event);
};

const updateSelectBox = (event) => {
  const categories = document.querySelectorAll(".category");
  const select = document.querySelector(".category-select");
  select.innerText = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.innerText = category.value;
    option.value = category.value;
    select.appendChild(option);
  });
  select.value = event.path[1].querySelector("input").value;
};

const createColumn = (categoryTitle) => {
  const column = document.createElement("div");
  column.classList.add("column");

  const todoCategory = document.createElement("div");
  todoCategory.classList.add("todo-category");

  const categoryInput = document.createElement("input");
  categoryInput.classList.add("category");
  categoryInput.value = categoryTitle;
  categoryInput.addEventListener("change", changeContentHandler);

  const addBtn = document.createElement("img");
  addBtn.classList.add("add-btn");
  addBtn.src = X_IMAGE;
  addBtn.addEventListener("click", showModalHandler);

  todoCategory.appendChild(categoryInput);
  todoCategory.appendChild(addBtn);
  column.appendChild(todoCategory);
  return column;
};

/* LocalStorage Load */
const loadLocalStorage = () => {
  var todoLists = localStorage.TODO_LISTS;
  if (todoLists) todoLists = JSON.parse(todoLists);

  for (var category in todoLists) {
    const todoList = todoLists[category];

    const column = createColumn(category);
    todoList.forEach((todo) => {
      const card = createCard(todo["title"], todo["description"]);
      column.appendChild(card);
    });

    const todoContainer = document.querySelector(".todo-container");
    todoContainer.appendChild(column);
  }
};
/* end: LocalStorage Load */
const setLocalStorage = () => {
  var todoLists = {};
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    const cateogoryTitle = column.querySelector(".category").value;
    const cards = column.querySelectorAll(".card");

    var todoList = [];
    cards.forEach((card) => {
      const title = card.querySelector(".title").value;
      const description = card.querySelector(".description").value;

      todoList.push({ title, description });
    });
    todoLists[cateogoryTitle] = todoList;
  });
  localStorage.TODO_LISTS = JSON.stringify(todoLists);
};
