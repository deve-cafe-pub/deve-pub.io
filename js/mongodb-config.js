// MongoDB API Client for Web Menu
const API_URL = 'http://localhost:3000/api';

// Fiyatları yükle
async function loadPricesFromDB() {
    try {
        const response = await fetch(`${API_URL}/menuPrices`);
        const prices = await response.json();
        
        if (prices && Object.keys(prices).length > 0) {
            menuItems.forEach(item => {
                if (prices[item.id]) {
                    item.price = prices[item.id];
                }
            });
        }
    } catch (error) {
        console.error('Fiyatlar yüklenemedi:', error);
    }
}

// Sayfa yüklendiğinde fiyatları çek
document.addEventListener('DOMContentLoaded', loadPricesFromDB);
