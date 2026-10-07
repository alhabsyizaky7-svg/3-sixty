const products = [
  {
    name: "AR–ONE",
    cat: "men",
    notes: "Fresh, maskulin, spicy, elegan",
    image: "assets/ar-one.png"
  },
  {
    name: "RS–ONE",
    cat: "men",
    notes: "Fruity, fresh, smoky, woody",
    image: "assets/ar-one.png"
  },
  {
    name: "MEN’S CLUB",
    cat: "men",
    notes: "Fresh, clean, manly, sedikit manis",
    image: "assets/ar-one.png"
  },
  {
    name: "BLACK CODE",
    cat: "men",
    notes: "Fresh, spicy, warm, misterius",
    image: "assets/black-code.png"
  },
  {
    name: "ROYAL MAN",
    cat: "men",
    notes: "Fresh, elegant, clean, woody",
    image: "assets/black-code.png"
  },
  {
    name: "BELLA",
    cat: "women",
    notes: "Floral, feminine, soft, elegant",
    image: "assets/lady-charm.png"
  },
  {
    name: "LADY CHARM",
    cat: "women",
    notes: "Fresh, fruity, floral, playful",
    image: "assets/lady-charm.png"
  },
  {
    name: "WHITE ORCHID",
    cat: "women",
    notes: "Floral, oriental, warm, sensual",
    image: "assets/white-orchid.png"
  }
];


const grid = document.getElementById("productGrid");
const aroma = document.getElementById("aroma");
const category = document.getElementById("category");


/* =========================
   TAMPILKAN PRODUK
========================= */

function renderProducts(filter = "all") {

  grid.innerHTML = products

    .filter(function(product) {

      return filter === "all" ||
             product.cat === filter;

    })

    .map(function(product) {

      return `
        <article class="card">

          <div class="card-media">

            <img
              src="${product.image}"
              alt="${product.name} — 3 SIXTY"
            >

          </div>


          <div class="card-body">

            <span class="tag">
              ${product.cat === "men" ? "MEN" : "WOMEN"}
            </span>


            <h3>
              ${product.name}
            </h3>


            <div class="notes">
              ${product.notes}
            </div>


            <div class="price">

              <s>Rp45.000</s>

              <strong>
                Rp40.000
              </strong>

            </div>


            <button
              class="choose"
              data-name="${product.name}"
              data-cat="${product.cat}"
            >
              Pilih aroma ini
            </button>

          </div>

        </article>
      `;

    })

    .join("");
}


renderProducts();


/* =========================
   FILTER MEN / WOMEN
========================= */

document
  .querySelectorAll(".filter")
  .forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        document
          .querySelectorAll(".filter")
          .forEach(function(btn) {

            btn.classList.remove("active");

          });


        button.classList.add("active");


        renderProducts(
          button.dataset.filter
        );

      }
    );

  });


/* =========================
   PILIHAN AROMA
========================= */

function populateAroma() {

  const selectedCategory =
    category.value;


  aroma.innerHTML = `
    <option value="" disabled selected>
      Pilih aroma
    </option>
  `;


  products

    .filter(function(product) {

      return !selectedCategory ||
             product.cat === selectedCategory;

    })

    .forEach(function(product) {

      const option =
        document.createElement("option");


      option.value =
        product.name;


      option.textContent =
        `${product.name} — ${product.notes}`;


      aroma.appendChild(option);

    });

}


category.addEventListener(
  "change",
  populateAroma
);


populateAroma();


/* =========================
   TOMBOL PILIH AROMA
========================= */

grid.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(".choose");


    if (!button) {
      return;
    }


    category.value =
      button.dataset.cat;


    populateAroma();


    aroma.value =
      button.dataset.name;


    document
      .getElementById("pesan")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


/* =========================
   FORM PEMESANAN WHATSAPP
========================= */

document
  .getElementById("orderForm")
  .addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const name =
        document
          .getElementById("customerName")
          .value
          .trim();


      const selectedCategory =
        category.value;


      const product =
        aroma.value;


      const quantity =
        Number(
          document
            .getElementById("quantity")
            .value
        );


      const notes =
        document
          .getElementById("notes")
          .value
          .trim();


      let total;


      if (quantity === 1) {

        total = 40000;

      } else if (quantity === 2) {

        total = 75000;

      } else {

        total = 105000;

      }


      const message =

`Halo 3 SIXTY, saya ingin memesan parfum.

Nama: ${name}
Kategori: ${selectedCategory === "men" ? "Men" : "Women"}
Aroma: ${product}
Jumlah: ${quantity} botol
Total promo: Rp${total.toLocaleString("id-ID")}
Catatan: ${notes || "-"}

Saya mengetahui promo berlaku sampai 15 Oktober 2026.`;


      const whatsappNumber =
        "62895353844848";


      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );
