// Firebase'den fiyatları yükle
async function loadPricesFromFirebase() {
    const prices = await loadFromDatabase('menuPrices') || {};
    Object.keys(prices).forEach(itemId => {
        const item = menuItems.find(m => m.id == itemId);
        if (item) {
            item.price = Number(prices[itemId]);
        }
    });
}

// Firebase'den menü öğelerini yükle
async function loadMenuItemsFromFirebase() {
    const firebaseItems = await loadFromDatabase('menuItems');
    if (firebaseItems) {
        // Firebase object'ini array'e çevir
        const itemsArray = Object.values(firebaseItems);
        if (itemsArray.length > 0) {
            menuItems.length = 0;
            menuItems.push(...itemsArray);
        }
    }
    // Fiyatları da yükle
    await loadPricesFromFirebase();
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async function() {
    await loadMenuItemsFromFirebase();
    showCategories();
});

// Tarayıcı geri tuşu desteği
window.addEventListener('popstate', function(event) {
    if (event.state) {
        if (event.state.view === 'categories') {
            showCategories();
        } else if (event.state.view === 'alcohol-subcategories') {
            showAlcoholSubcategories();
        } else if (event.state.view === 'products') {
            showProducts(event.state.categoryId);
        }
    } else {
        showCategories();
    }
});

// Kategorileri göster
function showCategories() {
    window.scrollTo(0, 0);
    currentView = 'categories';
    history.pushState({view: 'categories'}, '', '#categories');
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';
    
    categories.forEach(cat => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'menu-item';
        categoryCard.style.cursor = 'pointer';
        categoryCard.onclick = () => {
            if (cat.hasSubcategories) {
                showAlcoholSubcategories();
            } else {
                showProducts(cat.id);
            }
        };
        categoryCard.innerHTML = `
            <div class="menu-item-image">
                <img src="${cat.image}" alt="${cat.name}" onerror="this.parentElement.innerHTML='📷 ${cat.name}'">
            </div>
            <div class="menu-item-content">
                <h3>${cat.name}</h3>
            </div>
        `;
        menuContainer.appendChild(categoryCard);
    });
}

// Alkol alt kategorilerini göster
function showAlcoholSubcategories() {
    window.scrollTo(0, 0);
    currentView = 'alcohol-subcategories';
    history.pushState({view: 'alcohol-subcategories'}, '', '#alcohol');
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '<button onclick="showCategories()" style="position: fixed; top: 20px; left: 20px; padding: 8px 12px; font-size: 0.85em; z-index: 1000;">← Geri</button>';
    
    alcoholSubcategories.forEach(subcat => {
        const subcategoryCard = document.createElement('div');
        subcategoryCard.className = 'menu-item';
        subcategoryCard.style.cursor = 'pointer';
        subcategoryCard.onclick = () => showProducts(subcat.id);
        subcategoryCard.innerHTML = `
            <div class="menu-item-image">
                <img src="${subcat.image}" alt="${subcat.name}" onerror="this.parentElement.innerHTML='📷 ${subcat.name}'">
            </div>
            <div class="menu-item-content">
                <h3>${subcat.name}</h3>
            </div>
        `;
        menuContainer.appendChild(subcategoryCard);
    });
}

// Ürünleri göster
async function showProducts(categoryId) {
    window.scrollTo(0, 0);
    currentView = 'products';
    selectedCategory = categoryId;
    history.pushState({view: 'products', categoryId: categoryId}, '', '#products-' + categoryId);
    const menuContainer = document.getElementById('menu-items');
    
    // Firebase'den güncel menü öğelerini ve fiyatları yükle
    await loadMenuItemsFromFirebase();
    
    const filteredItems = menuItems.filter(item => item.category === categoryId);
    
    menuContainer.innerHTML = '<button onclick="showCategories()" style="position: fixed; top: 20px; left: 20px; padding: 8px 12px; font-size: 0.85em; z-index: 1000;">← Kategorilere Dön</button>';
    
    if (filteredItems.length === 0) {
        menuContainer.innerHTML += '<p style="text-align: center; color: #666; padding: 40px;">Bu kategoride henüz ürün bulunmamaktadır.</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='📷 ${item.name}'">
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <div class="description">${item.description}</div>
                <div class="menu-item-footer">
                    <span class="price">${item.price}₺</span>
                </div>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}
