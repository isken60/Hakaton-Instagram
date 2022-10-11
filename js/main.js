const API = "http://localhost:8000/posts";

// кнопка подписки
let btnFollow = document.getElementsByClassName("title__follow")[0];

// инпуты и кнопки для создания публикаций
let btnNewPost = document.querySelector("#newPost");
let inp__add_img = document.querySelector(".posts__add_img");
let inp__add_txt = document.querySelector(".posts__add_txt");
let posts__add_btn = document.querySelector(".posts__add_btn");
let showPost = document.querySelector(".posts__add");
let deleteId = "";

//инпуты и кнопки для редактирования
let mainModal = document.querySelector(".main-modal");
let inpEditImg = document.querySelector(".posts__edit_img");
let inpEditTxt = document.querySelector(".posts__edit_txt");
let btnEdit = document.querySelector(".posts__edit_btn");
let btnClose = document.querySelector(".posts__close_btn");

//див для отображения данных
let allPosts = document.getElementsByClassName("posts")[0];

//для кнопки подписаться
btnFollow.addEventListener("click", () => {
  btnFollow.style.backgroundColor = "white";
  btnFollow.innerText = "";
  btnFollow.innerText = "Подписки";
});

// поисковик инпут
let inpSearch = document.querySelector(".inp-search");
let searchValue = inpSearch.value;

// кнопки для пагинации
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let currentPage = 1;

// ! ===== Create Start =====
function createPost(obj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then(() => readPosts());
}

btnNewPost.addEventListener("click", () => {
  showPost.style.display = "block";
  posts__add_btn.addEventListener("click", () => {
    // проверка на заполненность полей
    if (!inp__add_img.value.trim() || !inp__add_txt.value.trim()) {
      alert("Заполните поле");
      return;
    }
    let obj = {
      image: inp__add_img.value,
      text: inp__add_txt.value,
    };
    createPost(obj);
    inp__add_img.value = "";
    inp__add_txt.value = "";
    readPosts();
  });
});

// ? ===== Create End =====

// ! ===== Read Start =====
function readPosts() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=8`)
    .then(res => res.json())
    .then(data => {
      allPosts.innerHTML = "";
      data.forEach(posts => {
        allPosts.innerHTML += `
  <div class="posts__img" style="margin-bottom: 20px; background-color: lightgrey">
  <img
    src="${posts.image}"
    style="width: 270px; height: 270px"
    alt=""
  />
<p>${posts.text}</p>
<div style="text-align: center">
<button style="background-color: yellow; width: 50px" onclick="handleEditPost(${posts.id})">Edit</button>
<button style="background-color: yellow; width: 50px" onclick="deletePosts(${posts.id})">Delete</button>
</div>
  `;
      });
    });
  pageTotal();
}
readPosts();
// ? ===== Read End =====

// ! ===== Delete Start ======
function deletePosts(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readPosts());
}
// ? ===== Delete End =====

// ! ===== Edit Start =====
function editPosts(id, editedObj) {
  if (!inpEditImg.value.trim() || !inpEditTxt.value.trim()) {
    alert("Заполните поле");
    return;
  }
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(editedObj),
  }).then(() => readPosts());
}

let editId = "";
function handleEditPost(id) {
  mainModal.style.display = "block";
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(postObj => {
      inpEditImg.value = postObj.image;
      inpEditTxt.value = postObj.text;
      editId = postObj.id;
    });
}

btnClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

btnEdit.addEventListener("click", () => {
  let editedObj = {
    image: inpEditImg.value,
    text: inpEditTxt.value,
  };
  editPosts(editId, editedObj);
  mainModal.style.display = "none";
});

// ? ===== Edit End =====

// ! ====== serch start =====
inpSearch.addEventListener("input", e => {
  searchValue = e.target.value;
  readPosts();
});
// ? ====== serch end =====

// ! ===== paginate start =====
let countPage = 1;
function pageTotal() {
  fetch(`${API}?q=${searchValue}`)
    .then(res => res.json())
    .then(data => {
      countPage = Math.ceil(data.length / 8);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readPosts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readPosts();
});
// ? ===== paginate end ==========
