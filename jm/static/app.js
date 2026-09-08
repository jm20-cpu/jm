async function getJSON(url){const r=await fetch(url);return r.json()}
function money(n){return "KSh "+Number(n).toLocaleString("en-KE")}
async function loadProducts(){
 const q=document.getElementById("search").value, category=document.getElementById("category").value;
 const d=await getJSON(`/api/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);
 document.getElementById("listingCount").textContent=d.stats.count;
 document.getElementById("resultLabel").textContent=q?`${d.stats.count} results for "${q}"`:"Featured listings";
 document.getElementById("marketSummary").textContent=d.stats.count?`Market average ${money(d.stats.average)} • ${new Date(d.updated_at).toLocaleTimeString()}`:"";
 const grid=document.getElementById("products");
 grid.innerHTML=d.products.map(p=>`<article class="product"><div class="product-img">${p.emoji}</div><div class="product-body"><div class="meta">${p.category} • ${p.location}</div><h3>${p.name}</h3><div class="price">${money(p.price)}</div><span class="market-badge">✓ ${p.condition} • ${p.rating}★</span><div class="meta" style="margin-top:8px">${p.seller}</div><button class="btn" onclick="showProduct(${p.id})">Compare price →</button></div></article>`).join("") || `<div class="empty">No matching listings. Try another search.</div>`;
}
async function loadMarkets(){
 const d=await getJSON("/api/market");
 document.getElementById("marketCards").innerHTML=d.data.map(x=>`<div class="market"><small>${x.symbol}</small><h3>Live indicative value</h3><strong>${x.value.toLocaleString()}</strong><div class="${x.change>=0?'up':'down'}">${x.change>=0?'▲':'▼'} ${Math.abs(x.change)}%</div></div>`).join("");
 document.getElementById("tickerTrack").innerHTML="● LIVE DATA "+d.data.map(x=>`<span>${x.symbol} ${x.value} ${x.change>=0?'▲':'▼'} ${Math.abs(x.change)}%</span>`).join(" • ");
 document.getElementById("updated").textContent=new Date(d.updated_at).toLocaleTimeString();
}
async function showProduct(id){
 const p=await getJSON("/api/product/"+id);
 openModal("product",p);
}
function openModal(type,data){
 const modal=document.getElementById("modal"), c=document.getElementById("modalContent");
 if(type==="product"){c.innerHTML=`<div class="eyebrow">PRICE INTELLIGENCE</div><h2>${data.emoji} ${data.name}</h2><p>${data.seller} • ${data.location} • ${data.condition}</p><div style="font-size:35px;font-weight:700;margin:20px 0">${money(data.price)}</div><p><b>Market average:</b> ${money(data.market_average)}<br><b>Price position:</b> ${data.price_position>0?'+':''}${data.price_position}% vs comparable listings</p><button class="btn primary" onclick="closeModal()">Done</button>`}
 else if(type==="sell"){c.innerHTML=`<div class="eyebrow">SELL ON J&M</div><h2>Publish a listing</h2><p>Add your product and let J&M price intelligence help buyers understand the market.</p><div class="form"><input placeholder="Product name"><input placeholder="Price (KSh)"><input placeholder="Location"><textarea placeholder="Description"></textarea><button class="btn primary" onclick="alert('Demo listing flow ready. Connect authentication and database for production publishing.')">Continue</button></div>`}
 else if(type==="login"){c.innerHTML=`<div class="eyebrow">ACCOUNT</div><h2>Welcome back</h2><p>Sign-in UI is ready for production authentication.</p><div class="form"><input placeholder="Email"><input type="password" placeholder="Password"><button class="btn primary" onclick="alert('Connect secure authentication to activate sign-in.')">Sign in</button></div>`}
 else {c.innerHTML=`<div class="eyebrow">J&M AI</div><h2>AI Assistant</h2><p>Ask about products, price comparisons, business analytics or supplied market data.</p><div class="form"><textarea placeholder="Example: Compare two laptops under KSh 70,000"></textarea><button class="btn primary" onclick="alert('AI endpoint ready to connect to your chosen model/API.')">Analyze</button></div>`}
 modal.classList.add("open")
}
function closeModal(){document.getElementById("modal").classList.remove("open")}
loadProducts();loadMarkets();setInterval(loadMarkets,15000);
