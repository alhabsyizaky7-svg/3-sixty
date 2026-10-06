const WHATSAPP_NUMBER = "6289535384848";
const PROMO_END_DAY = 15;

const products = [
  {id:1,name:"BLACK CODE",category:"Men",price:40000,normalPrice:45000,notes:"Fresh • Spicy • Warm • Misterius",description:"Aroma maskulin dengan perpaduan fresh, spicy, dan warm yang memberikan karakter misterius dan berani.",image:"https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=800&q=80",badge:"DISKON"},
  {id:2,name:"LADY CHARM",category:"Women",price:40000,normalPrice:45000,notes:"Fresh • Fruity • Floral • Playful",description:"Aroma feminin yang fresh dan playful dengan sentuhan fruity serta floral yang menyenangkan.",image:"https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",badge:"DISKON"},
  {id:3,name:"WHITE ORCHID",category:"Women",price:40000,normalPrice:45000,notes:"Floral • Oriental • Warm • Sensual",description:"Karakter floral yang elegan dengan sentuhan oriental dan warm untuk kesan mewah.",image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",badge:"DISKON"},
  {id:4,name:"ROYAL NIGHT",category:"Men",price:40000,normalPrice:45000,notes:"Woody • Spicy • Warm • Elegant",description:"Aroma woody yang hangat dan elegan, cocok untuk menemani aktivitas malam.",image:"https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=80",badge:"DISKON"},
  {id:5,name:"PURE BLOOM",category:"Women",price:40000,normalPrice:45000,notes:"Fresh • Floral • Soft • Clean",description:"Aroma lembut dan clean dengan karakter floral yang fresh untuk penggunaan sehari-hari.",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",badge:"DISKON"},
  {id:6,name:"SIGNATURE 360",category:"Unisex",price:40000,normalPrice:45000,notes:"Fresh • Woody • Warm • Modern",description:"Aroma modern yang versatile dengan perpaduan fresh, woody dan warm. Cocok digunakan siapa saja.",image:"https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=800&q=80",badge:"DISKON"}
];

let cart = JSON.parse(localStorage.getItem("threeSixtyCart") || "[]");

function rupiah(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}

function promoActive(){
  return new Date().getDate() <= PROMO_END_DAY;
}

function renderProducts(){
  const list=document.getElementById("productList");
  const search=document.getElementById("searchInput").value.toLowerCase();
  const category=document.getElementById("categoryFilter").value;

  const filtered=products.filter(p=>
    (p.name.toLowerCase().includes(search)||p.notes.toLowerCase().includes(search)) &&
    (category==="All"||p.category===category)
  );

  if(!filtered.length){
    list.innerHTML='<p style="grid-column:1/-1;text-align:center;color:#777;padding:35px">Parfum tidak ditemukan.</p>';
    return;
  }

  list.innerHTML=filtered.map(p=>`
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="badge">${p.badge}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="notes">${p.notes}</div>
        <div class="price">
          <span class="normal-price">${rupiah(promoActive()?p.normalPrice:p.price)}</span>
          <span class="sale-price">${rupiah(promoActive()?p.price:p.normalPrice)}</span>
        </div>
        ${promoActive()?'<div class="sale-label">🔥 PROMO SAMPAI TANGGAL 15</div>':''}
        <div class="actions">
          <button class="detail" onclick="showProduct(${p.id})">Detail</button>
          <button onclick="addToCart(${p.id})">+ Keranjang</button>
        </div>
      </div>
    </article>`).join("");
}

function filterCategory(category){
  document.getElementById("categoryFilter").value=category;
  renderProducts();
  document.getElementById("produk").scrollIntoView({behavior:"smooth"});
}

function showProduct(id){
  const p=products.find(x=>x.id===id);
  document.getElementById("productDetail").innerHTML=`
    <div class="detail-grid">
      <img src="${p.image}" alt="${p.name}">
      <div class="detail-copy">
        <small class="eyebrow">${p.category}</small>
        <h2>${p.name}</h2>
        <h3 style="color:#b33a3a">${rupiah(promoActive()?p.price:p.normalPrice)}</h3>
        ${promoActive()?`<p><s>${rupiah(p.normalPrice)}</s> • Promo sampai tanggal 15</p>`:""}
        <p><strong>Karakter Aroma:</strong><br>${p.notes}</p>
        <p>${p.description}</p>
        <button class="btn full" onclick="addToCart(${p.id});closeModal('productModal')">Tambahkan ke Keranjang</button>
      </div>
    </div>`;
  document.getElementById("productModal").classList.add("active");
}

function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++; else cart.push({id,qty:1});
  saveCart();showToast("Parfum ditambahkan ke keranjang");
}

function saveCart(){
  localStorage.setItem("threeSixtyCart",JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const box=document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML='<p style="text-align:center;color:#777;padding:30px">Keranjang masih kosong.</p>';
    document.getElementById("cartTotal").textContent="Rp0";
    return;
  }
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    const price=promoActive()?p.price:p.normalPrice;
    const sub=price*item.qty; total+=sub;
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}">
      <div class="cart-info"><h4>${p.name}</h4><small>${rupiah(price)}</small><br>
      <button class="remove" onclick="removeFromCart(${p.id})">Hapus</button></div>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=rupiah(total);
}

function changeQty(id,amount){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=amount;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();
}

function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart()}

function openCart(){updateCart();document.getElementById("cartModal").classList.add("active")}
function openCheckout(){
  if(!cart.length){showToast("Keranjang masih kosong");return}
  closeModal("cartModal");document.getElementById("checkoutModal").classList.add("active");
}
function closeModal(id){document.getElementById(id).classList.remove("active")}
function closeOnBackdrop(e,id){if(e.target.id===id)closeModal(id)}

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length){showToast("Keranjang masih kosong");return}
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const address=document.getElementById("customerAddress").value.trim();
  const note=document.getElementById("customerNote").value.trim();
  let total=0;
  let message="*PESANAN 3 SIXTY*%0A%0A";
  message+=`Nama: ${encodeURIComponent(name)}%0A`;
  message+=`No. WhatsApp: ${encodeURIComponent(phone)}%0A`;
  message+=`Alamat: ${encodeURIComponent(address)}%0A%0A`;
  message+="*DETAIL PESANAN*%0A";
  cart.forEach(item=>{
    const p=products.find(x=>x.id===item.id);
    const price=promoActive()?p.price:p.normalPrice;
    const sub=price*item.qty;total+=sub;
    message+=`• ${encodeURIComponent(p.name)} x${item.qty} — ${encodeURIComponent(rupiah(sub))}%0A`;
  });
  message+=`%0A*TOTAL: ${encodeURIComponent(rupiah(total))}*%0A`;
  if(promoActive())message+="🔥 Promo Rp40.000 sampai tanggal 15%0A";
  if(note)message+=`%0ACatatan: ${encodeURIComponent(note)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
});

function showToast(msg){
  const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

renderProducts();updateCart();
