let selectedTableNumber = null;
let reservedTables = {};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async function() {
    await loadReservedTables();
    setupTableSelection();
    setupForm();
    setMinDate();
});

// Firebase'den dolu masaları yükle
async function loadReservedTables() {
    try {
        const snapshot = await database.ref('reservations').once('value');
        const allReservations = snapshot.val() || {};
        
        // Bugünün tarihini al
        const today = new Date().toISOString().split('T')[0];
        
        // Bugün için rezervasyonları filtrele
        Object.values(allReservations).forEach(reservation => {
            if (reservation.date === today && reservation.status !== 'cancelled') {
                reservedTables[reservation.tableNumber] = true;
            }
        });
        
        // Dolu masaları işaretle
        updateTableStatus();
    } catch (error) {
        console.error('Rezervasyonlar yüklenemedi:', error);
    }
}

// Masa durumlarını güncelle
function updateTableStatus() {
    document.querySelectorAll('.table').forEach(table => {
        const tableNumber = table.dataset.table;
        if (reservedTables[tableNumber]) {
            table.classList.add('reserved');
        }
    });
}

// Masa seçimi
function setupTableSelection() {
    document.querySelectorAll('.table').forEach(table => {
        table.addEventListener('click', function() {
            if (this.classList.contains('reserved')) {
                alert('Bu masa dolu. Lütfen başka bir masa seçin.');
                return;
            }
            
            // Önceki seçimi kaldır
            document.querySelectorAll('.table').forEach(t => t.classList.remove('selected'));
            
            // Yeni seçim
            this.classList.add('selected');
            selectedTableNumber = this.dataset.table;
            const capacity = this.dataset.capacity;
            
            document.getElementById('selectedTable').value = `Masa ${selectedTableNumber} (${capacity} Kişilik)`;
            document.getElementById('guestCount').max = capacity;
        });
    });
}

// Form işlemleri
function setupForm() {
    document.getElementById('reservationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!selectedTableNumber) {
            alert('Lütfen bir masa seçin!');
            return;
        }
        
        const formData = {
            tableNumber: selectedTableNumber,
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            date: document.getElementById('reservationDate').value,
            time: document.getElementById('reservationTime').value,
            guestCount: document.getElementById('guestCount').value,
            note: document.getElementById('note').value,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        try {
            // Firebase'e kaydet
            await database.ref('reservations').push(formData);
            
            alert('✅ Rezervasyonunuz başarıyla oluşturuldu!\n\nMasa: ' + selectedTableNumber + '\nTarih: ' + formData.date + '\nSaat: ' + formData.time);
            
            // Formu temizle
            document.getElementById('reservationForm').reset();
            document.getElementById('selectedTable').value = '';
            document.querySelectorAll('.table').forEach(t => t.classList.remove('selected'));
            selectedTableNumber = null;
            
            // Rezervasyonları yeniden yükle
            reservedTables = {};
            await loadReservedTables();
            
        } catch (error) {
            console.error('Rezervasyon hatası:', error);
            alert('❌ Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.');
        }
    });
}

// Minimum tarih ayarla (bugün)
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').min = today;
    document.getElementById('reservationDate').value = today;
}

// Tarih değiştiğinde dolu masaları güncelle
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('reservationDate')?.addEventListener('change', async function() {
        const selectedDate = this.value;
        
        try {
            const snapshot = await database.ref('reservations').once('value');
            const allReservations = snapshot.val() || {};
            
            // Seçilen tarih için rezervasyonları filtrele
            reservedTables = {};
            Object.values(allReservations).forEach(reservation => {
                if (reservation.date === selectedDate && reservation.status !== 'cancelled') {
                    reservedTables[reservation.tableNumber] = true;
                }
            });
            
            // Masa durumlarını güncelle
            document.querySelectorAll('.table').forEach(table => {
                table.classList.remove('reserved', 'selected');
                const tableNumber = table.dataset.table;
                if (reservedTables[tableNumber]) {
                    table.classList.add('reserved');
                }
            });
            
            // Seçimi temizle
            selectedTableNumber = null;
            document.getElementById('selectedTable').value = '';
            
        } catch (error) {
            console.error('Rezervasyonlar yüklenemedi:', error);
        }
    });
});
