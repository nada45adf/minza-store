// مصفوفة المنتجات - عدلي البيانات هنا فقط
const products = [
    { 
        id: 1, 
        name: "حلق ميزا الذهبي", 
      price: 30,
      stock: 5,
        imgs: ["https://i.ibb.co/VYXwbP1X/IMG-20251216-073956-853.jpg", "https://i.ibb.co/p6c3G28d/p6c3G28d.jpg"] 
    },
    { 
        id: 2, 
        name: "خاتم ميزا الوردي", 
        price: 45, 
        stock: 5,
        imgs: ["https://i.ibb.co/GfDM27Qd/IMG-20251215-062629-978.jpg", "https://i.ibb.co/VYXwbP1X/IMG-20251216-073956-853.jpg"] 
    },
     { 
        id: 1, 
        name: "حلق ميزا الذهبي", 
        price: 30, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 2, 
        name: "خاتم ميزا الوردي", 
        price: 45, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 1, 
        name: "حلق ميزا الذهبي", 
        price: 30, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 2, 
        name: "خاتم ميزا الوردي", 
        price: 45, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 1, 
        name: "حلق ميزا الذهبي", 
        price: 30, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 2, 
        name: "خاتم ميزا الوردي", 
        price: 45, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 1, 
        name: "حلق ميزا الذهبي", 
        price: 30, 
        stock: 5,
        imgs: ["", ""] 
    },
    { 
        id: 2, 
        name: "خاتم ميزا الوردي", 
        price: 45, 
        stock: 5,
        imgs: ["", ""] 
    },
    // يمكنك إضافة حتى 100 منتج بنفس الطريقة هنا...
];

// --- 1. استعادة البيانات من الذاكرة ---
let cart = JSON.parse(localStorage.getItem('minza_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('minza_favs')) || [];

// عرض المنتجات في الواجهة
function init() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => {
        const isFav = favorites.some(f => f.id === p.id);
        
        // إنشاء صور المنتج مع وضع كلاس active للأولى فقط
        const imagesHtml = p.imgs.map((img, index) => 
            `<img src="${img}" class="${index === 0 ? 'active' : ''}" data-index="${index}">`
        ).join('');

return `
            <div class="card" id="product-${p.id}">
                <button class="wishlist-btn ${isFav ? 'active' : ''}" onclick="toggleFav(${p.id}, this)">
                    <i class="fas fa-heart"></i>
                </button>
                
                <div class="img-slider">
                    ${imagesHtml}
                    ${p.imgs.length > 1 ? `
                        <button class="slider-btn prev" onclick="changeImg(${p.id}, -1)">❮</button>
                        <button class="slider-btn next" onclick="changeImg(${p.id}, 1)">❯</button>
                    ` : ''}
                </div>

                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="price">${p.price} ر.س</p>
                    
                    <div class="stock-status">
                        ${p.stock > 0 
                            ? `<span style="color: green; font-size: 12px;">✅ متوفر: ${p.stock} قطعة</span>` 
                            : `<span style="color: red; font-size: 12px; font-weight: bold;">❌ نفدت الكمية</span>`
                        }
                    </div>

                    <button class="add-btn" 
                            onclick="addToCart(${p.id})" 
                            ${p.stock <= 0 ? 'disabled' : ''}>
                        ${p.stock > 0 ? 'أضف للحقيبة' : 'غير متوفر'}
                    </button>
                </div>
            </div>`;
    }).join('');
    updateCounters();
}

// دالة تقليب الصور
function changeImg(productId, direction) {
    const slider = document.querySelector(`#product-${productId} .img-slider`);
    const imgs = slider.querySelectorAll('img');
    let activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
    
    imgs[activeIdx].classList.remove('active');
    
    activeIdx += direction;
    if (activeIdx >= imgs.length) activeIdx = 0;
    if (activeIdx < 0) activeIdx = imgs.length - 1;
    
    imgs[activeIdx].classList.add('active');
}

// --- 2. وظائف الحفظ والتحديث ---
function updateStoreData() {
    localStorage.setItem('minza_cart', JSON.stringify(cart));
    localStorage.setItem('minza_favs', JSON.stringify(favorites));
    updateCounters();
}

function updateCounters() {
    const cartCount = document.getElementById('cart-count');
    const favCount = document.getElementById('fav-count');
    if (cartCount) cartCount.innerText = cart.length;
    if (favCount) favCount.innerText = favorites.length;
}

// --- 3. إدارة المفضلة (تم التعديل لتحديث الصفحة الجديدة) ---
function toggleFav(id, btn) {
    const idx = favorites.findIndex(f => f.id === id);
    if (idx === -1) {
        const p = products.find(p => p.id === id);
        favorites.push(p);
        if(btn) btn.classList.add('active');
    } else {
        favorites.splice(idx, 1);
        if(btn) btn.classList.remove('active');
    }
    updateStoreData();
    // إذا كانت صفحة المفضلة مفتوحة، نقوم بتحديثها فوراً
    if (!document.getElementById('favorites-page').classList.contains('hidden')) {
        renderFavorites();
    }
}

// فتح صفحة المفضلة كصفحة مستقلة
function openFav() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('checkout-page').classList.add('hidden');
    document.getElementById('favorites-page').classList.remove('hidden');
    renderFavorites();
}

// عرض المنتجات داخل صفحة المفضلة
function renderFavorites() {
    const list = document.getElementById('fav-items-list');
    if (!list) return;
    if (favorites.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:40px;">القائمة فارغة حالياً</p>';
        return;
    }
    list.innerHTML = '';
    favorites.forEach(item => {
        list.innerHTML += `
            <div style="display:flex; align-items:center; gap:15px; padding:12px; border-bottom:1px solid #eee; background:#fff; margin-bottom:10px; border-radius:10px;">
                <img src="${item.imgs[0]}" style="width:70px; height:70px; object-fit:cover; border-radius:8px;">
                <div style="flex-grow:1; text-align:right;">
                    <p style="font-weight:bold; margin:0; font-size:14px;">${item.name}</p>
                    <p style="color:#8e7f7f; margin:5px 0 0; font-size:13px;">${item.price} ريال</p>
                </div>
                <button onclick="toggleFav(${item.id})" style="color:red; border:none; background:none; font-size:18px; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;
    });
}

// --- 4. دارة السلة
function addToCart(id) {
    const p = products.find(product => product.id === id);
    if (p && p.stock > 0) {
        p.stock--; // تنقيص المخزون
        cart.push({...p}); // إضافة للمصفوفة
        
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.innerText = cart.length; // يغير الرقم لعدد الأغراض
        }

        renderProducts(); // تحديث شكل المنتجات (عشان كود 3)
        updateTotal();    // تحديث إجمالي السلة
        alert("تمت الإضافة للحقيبة ✅");
    } else {
        alert("عذراً، نفدت الكمية ❌");
    }
}
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = cart.length; // سيضع عدد المنتجات الموجودة في المصفوفة
    }
}
function removeFromCart(i) {
    cart.splice(i, 1);
    updateStoreData();
    updateTotal();
}

function updateTotal() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;
    let sub = 0; 
    list.innerHTML = '';
    cart.forEach((item, i) => {
        sub += item.price;
list.innerHTML += `
    <div style="display:flex; align-items:center; gap:10px; padding:12px; border-bottom:1px solid #eee;">
        <img src="${item.imgs[0]}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
        
        <div style="flex:1; display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:bold;">${item.name}</span>
            <span style="font-size:12px; color:#5d4037;">${item.price} ريال</span>
        </div>

        <button onclick="removeFromCart(${i})" 
                style="color:5d4037; border:none; background:none; cursor:pointer;">حذف</button>
    </div>`;
    });
    const finalTotal = document.getElementById('final-total');
    if (finalTotal) finalTotal.innerText = (sub > 0 ? sub + 25 : 0) + " ريال";
}

// --- 5. وظائف التنقل ---
function showCheckout() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('favorites-page').classList.add('hidden');
    document.getElementById('checkout-page').classList.remove('hidden');
    updateTotal();
}

function showHome() {
    document.getElementById('checkout-page').classList.add('hidden');
    document.getElementById('favorites-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
    init(); // إعادة تشغيل الرئيسية لتحديث حالة القلوب
}

function pay(type) {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const total = document.getElementById('final-total').innerText;
    if(!name || !address || cart.length === 0) return alert("يرجى تعبئة البيانات كاملة");
    
    const body = `طلب جديد من: ${name}\nالعنوان: ${address}\nالمجموع: ${total}\nالمنتجات:\n${cart.map(i => i.name).join('\n')}`;
    
    if(type === 'EMAIL') {
        window.location.href = `mailto:nada45adf@gmail.com?subject=طلب شراء جديد&body=${encodeURIComponent(body)}`;
    } else {
        window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=nada45adf@gmail.com&amount=${parseFloat(total)}&currency_code=SAR`);
    }
}

window.onload = init;
  // دالة تجلب رابط موقع الشخص وتضعه في الخانة تلقائياً
function getLocation() {
    if (navigator.geolocation) {
        alert("سيتم الآن تحديد موقعك، يرجى السماح للمتصفح بالوصول للموقع 📍");
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // إنشاء رابط Google Maps
            const url = `https://www.google.com/maps?q=${lat},${lon}`;
            document.getElementById('address').value = url;
            alert("تم تحديد موقعك بنجاح! ✅");
        }, () => {
            alert("تعذر تحديد الموقع، يرجى التأكد من تفعيل الـ GPS وكتابة العنوان يدوياً.");
        });
    } else {
        alert("متصفحك لا يدعم هذه الخاصية.");
    }
}
 function changeImg(productId, direction) {
    const slider = document.querySelector(`#product-${productId} .img-slider`);
    if (!slider) return;
    const imgs = slider.querySelectorAll('img');
    if (imgs.length <= 1) return;

    let activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
    imgs[activeIdx].classList.remove('active');

    activeIdx += direction;
    if (activeIdx >= imgs.length) activeIdx = 0;
    if (activeIdx < 0) activeIdx = imgs.length - 1;

    imgs[activeIdx].classList.add('active');
}

 
         

