const API_KEY = "AIzaSyDBo2MEzRVeq_DvAU7uv0FTGvZ0qgRK-t8";

async function getRes() {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=trending&maxResults=20&key=${API_KEY}`
  );
  const data = await res.json();
  books = data.items;
}

const booksContainer = document.querySelector(".books-grid");
getRes().then(() => {
  books.forEach((singleBook) => {
    let bookTitle = singleBook.volumeInfo.title;
    let bookCover = singleBook.volumeInfo.imageLinks.thumbnail;
    let bookPageCount = singleBook.volumeInfo.pageCount;
    let bookAuthor = singleBook.volumeInfo;

    renderBook(bookTitle, bookCover, bookPageCount);
  });
  searchBook(books);
});

async function renderBook(bookTitle, bookCover, bookPageCount) {
  booksContainer.innerHTML += ` <div class="book-card">
                    <div class="book-badge">Bestseller</div>
                    <div class="book-cover">
                        <img src="${bookCover}" alt="Book Cover">
                    </div>
                    <div class="book-details">
                        <h3 class="book-title">${bookTitle}</h3>
                        <p class="book-author">F. Scott Fitzgerald</p>
                        <p class="book-description"></p>
                        <div class="book-meta">
                            <div>
                                <div class="book-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                </div>
                                <div class="book-pages">
                                    <i class="fas fa-file"></i> ${bookPageCount}
                                </div>
                            </div>
                            <span class="book-status status-read">Read</span>
                        </div>
                    </div>
                    <div class="book-actions">
                        <button class="action-btn btn-read"><i class="fas fa-eye"></i> Read</button>
                        <button class="action-btn btn-favorite"><i class="far fa-bookmark"></i></button>
                    </div>
                </div>`;
}

async function searchBook(books) {
  const searchInput = document.querySelector(".search-input");
  const allBookCard = document.querySelectorAll(".book-card");
  const notFound = document.querySelector(".not-found");

  searchInput.addEventListener("input", async () => {
    let searchValue = searchInput.value.toLowerCase();
    // let found = false;
    if (searchValue == "") {
      // if input is empty, just show default trending books again
      getRes().then(() => {
        booksContainer.innerHTML = "";
        books.forEach((singleBook) => {
          let bookTitle = singleBook.volumeInfo.title;
          let bookCover = singleBook.volumeInfo.imageLinks?.thumbnail;
          let bookPageCount = singleBook.volumeInfo.pageCount;

          renderBook(bookTitle, bookCover, bookPageCount);
        });
      });
      return;
    }

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchValue}&maxResults=20&key=${API_KEY}`
    );

    const data = await res.json();
    books = data.items;

    booksContainer.innerHTML = "";
    books.forEach((singleBook) => {
      if (searchValue) {
        let bookTitle = singleBook.volumeInfo.title;
        let bookCover = singleBook.volumeInfo.imageLinks.thumbnail;
        let bookPageCount = singleBook.volumeInfo.pageCount;
        // let bookAuthor = singleBook.volumeInfo;
        renderBook(bookTitle, bookCover, bookPageCount);
      }
    });

    // allBookCard.forEach(async (card) => {
    //   const allBookTitles = card
    //     .querySelector(".book-title")
    //     .innerHTML.toLowerCase();

    //   if (allBookTitles.includes(searchValue)) {
    //     card.style.display = "block";
    //     found = true;
    //   } else {
    //     card.style.display = "none";
    //   }
    // });

    // if (found) {
    //   notFound.style.display = "none";
    // } else {
    //   notFound.style.display = "block";
    // }
  });
}
// Initialize Swiper for featured books
const swiper = new Swiper(".featured-slider", {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Simple interactivity for filter buttons
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");
  });
});

// Toggle favorite button state
document.querySelectorAll(".btn-favorite").forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.toggle("active");
    if (this.classList.contains("active")) {
      this.innerHTML = '<i class="fas fa-bookmark"></i>';
    } else {
      this.innerHTML = '<i class="far fa-bookmark"></i>';
    }
  });
});

// Toggle view options
document.querySelectorAll(".view-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");
  });
});

// Toggle read status
document.querySelectorAll(".btn-read").forEach((button) => {
  button.addEventListener("click", function () {
    const statusElement =
      this.closest(".book-card").querySelector(".book-status");
    if (statusElement.classList.contains("status-unread")) {
      statusElement.classList.remove("status-unread");
      statusElement.classList.add("status-reading");
      statusElement.textContent = "Reading";
    } else if (statusElement.classList.contains("status-reading")) {
      statusElement.classList.remove("status-reading");
      statusElement.classList.add("status-read");
      statusElement.textContent = "Read";
    } else {
      statusElement.classList.remove("status-read");
      statusElement.classList.add("status-unread");
      statusElement.textContent = "Unread";
    }
  });
});
