// ============================================
// 1. DYNAMIC LIST (DAFTAR DINAMIS)
// ============================================

// Mendapatkan elemen DOM yang diperlukan
const itemInput = document.getElementById('item-input');
const addItemBtn = document.getElementById('add-item-btn');
const itemList = document.getElementById('item-list');
const listCount = document.getElementById('list-count');

// Fungsi untuk menambah item baru ke dalam list
function addItemToList() {
    const itemText = itemInput.value.trim();
    
    // Validasi: input tidak boleh kosong
    if (itemText === '') {
        alert('Silakan masukkan teks untuk item baru!');
        itemInput.focus();
        return;
    }
    
    // 1. Membuat elemen li baru dengan document.createElement()
    const newItem = document.createElement('li');
    
    // 2. Menambahkan konten ke dalam elemen li
    newItem.textContent = itemText + ' ';
    
    // 3. Membuat tombol hapus
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.className = 'delete-btn';
    
    // Menambahkan ikon ke tombol hapus
    const trashIcon = document.createElement('i');
    trashIcon.className = 'fas fa-trash';
    deleteBtn.prepend(trashIcon);
    deleteBtn.prepend(' ');
    
    // 4. Menambahkan event listener untuk tombol hapus
    deleteBtn.addEventListener('click', function() {
        // Menghapus elemen dari DOM dengan remove()
        newItem.remove();
        updateListCount();
    });
    
    // 5. Menambahkan tombol hapus ke dalam item
    newItem.appendChild(deleteBtn);
    
    // 6. Menambahkan item baru ke dalam list dengan appendChild()
    itemList.appendChild(newItem);
    
    // Reset input
    itemInput.value = '';
    itemInput.focus();
    
    // Update jumlah item
    updateListCount();
    
    // Animasi untuk item baru
    newItem.style.opacity = '0';
    newItem.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        newItem.style.transition = 'all 0.3s ease';
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateY(0)';
    }, 10);
}

// Fungsi untuk mengupdate jumlah item dalam list
function updateListCount() {
    const count = itemList.children.length;
    listCount.textContent = `Jumlah item: ${count}`;
}

// Event listener untuk tombol "Tambah Item"
addItemBtn.addEventListener('click', addItemToList);

// Event listener untuk menambahkan item dengan tombol Enter
itemInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItemToList();
    }
});

// Menambahkan event listener untuk tombol hapus yang sudah ada di awal
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Menghapus parent li dari tombol yang diklik
        this.parentElement.remove();
        updateListCount();
    });
});

// ============================================
// 2. UBAH WARNA BACKGROUND
// ============================================

// Mendapatkan elemen tombol warna
const redBtn = document.getElementById('red-btn');
const greenBtn = document.getElementById('green-btn');
const blueBtn = document.getElementById('blue-btn');
const resetColorBtn = document.getElementById('reset-color-btn');
const currentColorText = document.getElementById('current-color-text');

// Array warna yang tersedia
const colors = {
    red: '#e74c3c',
    green: '#2ecc71',
    blue: '#3498db',
    default: '#f8f9fa'
};

// Fungsi untuk mengubah warna background
function changeBackgroundColor(colorName, colorCode) {
    // Mengubah properti style backgroundColor
    document.body.style.backgroundColor = colorCode;
    currentColorText.textContent = colorName;
    currentColorText.style.color = colorCode;
    currentColorText.style.backgroundColor = '#f1f1f1';
    currentColorText.style.padding = '3px 10px';
    currentColorText.style.borderRadius = '4px';
}

// Event listener untuk tombol merah
redBtn.addEventListener('click', function() {
    changeBackgroundColor('Merah', colors.red);
});

// Event listener untuk tombol hijau
greenBtn.addEventListener('click', function() {
    changeBackgroundColor('Hijau', colors.green);
});

// Event listener untuk tombol biru
blueBtn.addEventListener('click', function() {
    changeBackgroundColor('Biru', colors.blue);
});

// Event listener untuk tombol reset
resetColorBtn.addEventListener('click', function() {
    changeBackgroundColor('Putih', colors.default);
});

// ============================================
// 3. COUNTER DENGAN DOM MANIPULATION
// ============================================

// Mendapatkan elemen counter
const counterValue = document.getElementById('counter-value');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');

// Nilai counter awal
let count = 0;

// Fungsi untuk mengupdate tampilan counter
function updateCounter() {
    // Mengubah konten teks dengan textContent
    counterValue.textContent = count;
    
    // Mengubah warna berdasarkan nilai counter
    if (count > 0) {
        counterValue.style.color = '#2ecc71';
    } else if (count < 0) {
        counterValue.style.color = '#e74c3c';
    } else {
        counterValue.style.color = '#2c3e50';
    }
}

// Event listener untuk tombol tambah
incrementBtn.addEventListener('click', function() {
    count++;
    updateCounter();
});

// Event listener untuk tombol kurang
decrementBtn.addEventListener('click', function() {
    count--;
    updateCounter();
});

// Event listener untuk tombol reset
resetBtn.addEventListener('click', function() {
    count = 0;
    updateCounter();
});

// ============================================
// 4. TOGGLE SHOW/HIDE ELEMENT
// ============================================

// Mendapatkan elemen untuk toggle
const toggleBtn = document.getElementById('toggle-btn');
const toggleContent = document.getElementById('toggle-content');

// Status awal: konten tersembunyi
let isContentVisible = false;

// Fungsi untuk menampilkan/menyembunyikan konten
function toggleContentVisibility() {
    // Menggunakan classList.toggle() untuk menambah/hapus kelas 'hidden'
    toggleContent.classList.toggle('hidden');
    
    // Mengubah teks tombol berdasarkan status
    if (toggleContent.classList.contains('hidden')) {
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Tampilkan / Sembunyikan';
        isContentVisible = false;
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Tampilkan / Sembunyikan';
        isContentVisible = true;
    }
}

// Event listener untuk tombol toggle
toggleBtn.addEventListener('click', toggleContentVisibility);

// ============================================
// INISIALISASI DAN FUNGSI TAMBAHAN
// ============================================

// Fungsi untuk menginisialisasi aplikasi
function initializeApp() {
    console.log('Aplikasi Manipulasi DOM berhasil dimuat!');
    updateListCount();
    updateCounter();
    
    // Menampilkan pesan selamat datang di konsol
    console.log('Selamat datang di tugas manipulasi DOM!');
    console.log('Fitur yang tersedia:');
    console.log('1. Dynamic List - Menambah dan menghapus item dari daftar');
    console.log('2. Background Changer - Mengubah warna latar belakang halaman');
    console.log('3. Counter - Menambah, mengurangi, dan mereset nilai counter');
    console.log('4. Toggle Show/Hide - Menampilkan atau menyembunyikan konten');
}

// Memanggil fungsi inisialisasi saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', initializeApp);