/* =====================================================
   e-Korespondensi DIY — Main Script
   Vanilla JavaScript | LocalStorage | No frameworks
   ===================================================== */

'use strict';

// =====================================================
// SECTION 1: CONSTANT DATA & INITIAL SEED
// =====================================================

/** Daftar instansi pemerintahan di DIY */
const INSTANSI_LIST = [
  { id: 'diskominfo',  nama: 'Dinas Komunikasi dan Informatika DIY' },
  { id: 'dikpora',     nama: 'Dinas Pendidikan, Pemuda, dan Olahraga DIY' },
  { id: 'dinkes',      nama: 'Dinas Kesehatan DIY' },
  { id: 'bappeda',     nama: 'Bappeda DIY' },
  { id: 'bpkad',       nama: 'BPKAD DIY' },
  { id: 'bkd',         nama: 'Badan Kepegawaian Daerah DIY' },
  { id: 'dpu',         nama: 'Dinas Pekerjaan Umum DIY' },
  { id: 'dishub',      nama: 'Dinas Perhubungan DIY' },
  { id: 'disnaker',    nama: 'Dinas Tenaga Kerja dan Transmigrasi DIY' },
  { id: 'setda',       nama: 'Sekretariat Daerah DIY' },
  { id: 'dprd',        nama: 'Sekretariat DPRD DIY' },
  { id: 'bpbd',        nama: 'BPBD DIY' },
  { id: 'dinsos',      nama: 'Dinas Sosial DIY' },
  { id: 'disbud',      nama: 'Dinas Kebudayaan DIY' },
  { id: 'disparpora',  nama: 'Dinas Pariwisata DIY' },
];

/**
 * Keyword → instansi mapping untuk fitur rekomendasi.
 * Saat pengguna mengetik perihal/isi, sistem mencocokkan keyword
 * dan menyarankan instansi tujuan yang relevan.
 */
const REKOMENDASI_RULES = [
  { keywords: ['it', 'teknologi', 'sistem', 'website', 'aplikasi', 'digital', 'data', 'server', 'jaringan', 'informatika'], instansi: ['diskominfo'] },
  { keywords: ['pendidikan', 'sekolah', 'guru', 'siswa', 'kurikulum', 'belajar', 'beasiswa', 'mahasiswa', 'olahraga', 'pemuda'], instansi: ['dikpora'] },
  { keywords: ['kesehatan', 'rumah sakit', 'puskesmas', 'obat', 'dokter', 'medis', 'vaksin', 'pasien', 'stunting'], instansi: ['dinkes'] },
  { keywords: ['anggaran', 'keuangan', 'apbd', 'dana', 'belanja', 'aset', 'keuangan daerah', 'pendapatan'], instansi: ['bpkad'] },
  { keywords: ['perencanaan', 'pembangunan', 'rencana kerja', 'rkpd', 'rpjmd', 'musrenbang', 'evaluasi pembangunan'], instansi: ['bappeda'] },
  { keywords: ['pegawai', 'pns', 'asn', 'kepegawaian', 'mutasi', 'pensiun', 'jabatan', 'formasi'], instansi: ['bkd'] },
  { keywords: ['jalan', 'infrastruktur', 'gedung', 'konstruksi', 'irigasi', 'drainase', 'bangunan'], instansi: ['dpu'] },
  { keywords: ['transportasi', 'lalu lintas', 'angkutan', 'terminal', 'parkir', 'kendaraan'], instansi: ['dishub'] },
  { keywords: ['tenaga kerja', 'buruh', 'upah', 'phk', 'transmigrasi', 'lowongan', 'ketenagakerjaan'], instansi: ['disnaker'] },
  { keywords: ['kebijakan', 'peraturan', 'administrasi', 'koordinasi', 'surat edaran', 'gubernur'], instansi: ['setda'] },
  { keywords: ['perda', 'legislasi', 'dprd', 'rapat paripurna', 'raperda', 'legislatif'], instansi: ['dprd'] },
  { keywords: ['bencana', 'darurat', 'banjir', 'gempa', 'tanah longsor', 'evakuasi', 'mitigasi'], instansi: ['bpbd'] },
  { keywords: ['sosial', 'kemiskinan', 'bansos', 'pks', 'lansia', 'disabilitas', 'panti'], instansi: ['dinsos'] },
  { keywords: ['budaya', 'seni', 'cagar budaya', 'museum', 'batik', 'keraton', 'warisan'], instansi: ['disbud'] },
  { keywords: ['pariwisata', 'wisata', 'hotel', 'destinasi', 'kuliner', 'event'], instansi: ['disparpora'] },
];

/** Data dummy pengguna (password di-hash sederhana untuk demo) */
const SEED_USERS = [
  { id: 'u1', nama: 'Administrator Pusat',     username: 'admin.pusat',       password: 'admin123', role: 'admin_pusat',    instansiId: 'setda' },
  { id: 'u2', nama: 'Admin Diskominfo',         username: 'admin.diskominfo',  password: 'admin123', role: 'admin_instansi', instansiId: 'diskominfo' },
  { id: 'u3', nama: 'Admin Bappeda',            username: 'admin.bappeda',     password: 'admin123', role: 'admin_instansi', instansiId: 'bappeda' },
  { id: 'u4', nama: 'Pengguna Eksternal',       username: 'eksternal.user',    password: 'user123',  role: 'eksternal',      instansiId: null },
  { id: 'u5', nama: 'Admin Dinkes',             username: 'admin.dinkes',      password: 'admin123', role: 'admin_instansi', instansiId: 'dinkes' },
];

/** Data dummy surat awal */
const SEED_SURAT = [
  {
    id: 's001',
    nomorSurat: '001/DISKOMINFO/XI/2026',
    perihal: 'Permohonan Pengembangan Aplikasi SIPD',
    kategori: 'permohonan',
    isi: 'Dalam rangka meningkatkan layanan digital Pemda DIY, kami memohon dukungan pengembangan Aplikasi SIPD (Sistem Informasi Pemerintahan Daerah) terintegrasi dengan data kependudukan.',
    tanggal: '2026-11-01',
    pengirimId: 'u2',
    pengirimNama: 'Admin Diskominfo',
    pengirimInstansi: 'Dinas Komunikasi dan Informatika DIY',
    tujuanInstansi: ['bappeda', 'setda'],
    prioritas: 'penting',
    lampiran: 'Proposal_SIPD_2026.pdf',
    status: 'diproses',
    history: [
      { status: 'dikirim',  waktu: '2026-11-01T08:00:00', keterangan: 'Surat dikirim oleh Admin Diskominfo', pelaku: 'Admin Diskominfo' },
      { status: 'diterima', waktu: '2026-11-01T09:15:00', keterangan: 'Surat diterima oleh Bappeda DIY', pelaku: 'Admin Bappeda' },
      { status: 'diproses', waktu: '2026-11-01T14:00:00', keterangan: 'Surat sedang dalam proses kajian teknis', pelaku: 'Admin Bappeda' },
    ],
  },
  {
    id: 's002',
    nomorSurat: '002/BAPPEDA/XI/2026',
    perihal: 'Undangan Rapat Musrenbang RKPD 2027',
    kategori: 'undangan',
    isi: 'Mengundang seluruh OPD untuk hadir dalam Rapat Musrenbang penyusunan RKPD Tahun 2027 pada tanggal 10 November 2026 di Aula Kepatihan.',
    tanggal: '2026-11-02',
    pengirimId: 'u3',
    pengirimNama: 'Admin Bappeda',
    pengirimInstansi: 'Bappeda DIY',
    tujuanInstansi: ['diskominfo', 'dinkes', 'dikpora', 'bpkad', 'bkd', 'dpu'],
    prioritas: 'segera',
    lampiran: 'Jadwal_Musrenbang_2027.pdf',
    status: 'diterima',
    history: [
      { status: 'dikirim',  waktu: '2026-11-02T07:30:00', keterangan: 'Surat undangan dikirim ke seluruh OPD terkait', pelaku: 'Admin Bappeda' },
      { status: 'diterima', waktu: '2026-11-02T08:45:00', keterangan: 'Undangan diterima', pelaku: 'Admin Diskominfo' },
    ],
  },
  {
    id: 's003',
    nomorSurat: '003/EKS/XI/2026',
    perihal: 'Laporan Pengaduan Jalan Rusak Wilayah Sleman',
    kategori: 'laporan',
    isi: 'Bersama surat ini kami melaporkan kondisi jalan rusak parah di Jalan Kaliurang KM 14, Sleman yang membahayakan pengguna jalan. Mohon penanganan segera.',
    tanggal: '2026-11-02',
    pengirimId: 'u4',
    pengirimNama: 'Pengguna Eksternal',
    pengirimInstansi: 'Masyarakat / Eksternal',
    tujuanInstansi: ['dpu', 'setda'],
    prioritas: 'segera',
    lampiran: 'Foto_Jalan_Rusak.zip',
    status: 'dikirim',
    history: [
      { status: 'dikirim', waktu: '2026-11-02T10:00:00', keterangan: 'Pengaduan dikirim oleh masyarakat', pelaku: 'Pengguna Eksternal' },
    ],
  },
  {
    id: 's004',
    nomorSurat: '004/DINKES/X/2026',
    perihal: 'Laporan Realisasi Program Kesehatan Q3 2026',
    kategori: 'laporan',
    isi: 'Dengan hormat, kami sampaikan laporan realisasi program kesehatan triwulan III Tahun 2026. Capaian vaksinasi mencapai 94% dari target, program stunting telah menjangkau 12 kabupaten/kota.',
    tanggal: '2026-10-28',
    pengirimId: 'u5',
    pengirimNama: 'Admin Dinkes',
    pengirimInstansi: 'Dinas Kesehatan DIY',
    tujuanInstansi: ['setda', 'bappeda'],
    prioritas: 'normal',
    lampiran: 'Laporan_Kesehatan_Q3_2026.pdf',
    status: 'selesai',
    history: [
      { status: 'dikirim',  waktu: '2026-10-28T09:00:00', keterangan: 'Laporan dikirim ke Setda dan Bappeda', pelaku: 'Admin Dinkes' },
      { status: 'diterima', waktu: '2026-10-28T10:30:00', keterangan: 'Laporan diterima Setda', pelaku: 'Administrator Pusat' },
      { status: 'diproses', waktu: '2026-10-29T08:00:00', keterangan: 'Laporan sedang diverifikasi', pelaku: 'Administrator Pusat' },
      { status: 'selesai',  waktu: '2026-10-30T14:00:00', keterangan: 'Laporan telah disetujui dan diarsipkan', pelaku: 'Administrator Pusat' },
    ],
  },
  {
    id: 's005',
    nomorSurat: '005/SETDA/XI/2026',
    perihal: 'Pengumuman Libur Nasional dan Cuti Bersama 2026',
    kategori: 'pengumuman',
    isi: 'Memberitahukan kepada seluruh OPD di lingkungan Pemerintah Daerah DIY tentang jadwal libur nasional dan cuti bersama tahun 2026 sesuai Keputusan Presiden.',
    tanggal: '2026-11-01',
    pengirimId: 'u1',
    pengirimNama: 'Administrator Pusat',
    pengirimInstansi: 'Sekretariat Daerah DIY',
    tujuanInstansi: ['diskominfo', 'dikpora', 'dinkes', 'bappeda', 'bpkad', 'bkd', 'dpu', 'dishub', 'disnaker'],
    prioritas: 'normal',
    lampiran: '',
    status: 'selesai',
    history: [
      { status: 'dikirim',  waktu: '2026-11-01T07:00:00', keterangan: 'Pengumuman diedarkan ke seluruh OPD', pelaku: 'Administrator Pusat' },
      { status: 'diterima', waktu: '2026-11-01T08:00:00', keterangan: 'Diterima oleh semua OPD tujuan', pelaku: 'Sistem' },
      { status: 'selesai',  waktu: '2026-11-01T08:05:00', keterangan: 'Pengumuman selesai didistribusikan', pelaku: 'Sistem' },
    ],
  },
];

// =====================================================
// SECTION 2: STATE MANAGEMENT
// =====================================================

/** State aplikasi yang aktif */
const state = {
  currentUser: null,     // Objek user yang sedang login
  currentPage: null,     // Nama halaman aktif
  editingSuratId: null,  // ID surat yang sedang diedit (null = buat baru)
  viewingSuratId: null,  // ID surat yang sedang ditampilkan di detail
  deleteCallback: null,  // Fungsi yang dipanggil saat konfirmasi hapus
  lastSuratPage: 'suratKeluar', // Untuk tombol "Kembali" di detail
};

// =====================================================
// SECTION 3: LOCALSTORAGE HELPERS
// =====================================================

/** Ambil daftar surat dari LocalStorage */
function getSuratList() {
  return JSON.parse(localStorage.getItem('ek_surat') || '[]');
}

/** Simpan daftar surat ke LocalStorage */
function saveSuratList(list) {
  localStorage.setItem('ek_surat', JSON.stringify(list));
}

/** Ambil daftar user dari LocalStorage */
function getUserList() {
  return JSON.parse(localStorage.getItem('ek_users') || '[]');
}

/** Simpan daftar user ke LocalStorage */
function saveUserList(list) {
  localStorage.setItem('ek_users', JSON.stringify(list));
}

/**
 * Inisialisasi data seed ke LocalStorage jika belum ada.
 * Dipanggil sekali saat halaman pertama kali dibuka.
 */
function initSeedData() {
  if (!localStorage.getItem('ek_users')) {
    saveUserList(SEED_USERS);
  }
  if (!localStorage.getItem('ek_surat')) {
    saveSuratList(SEED_SURAT);
  }
}

// =====================================================
// SECTION 4: AUTHENTICATION
// =====================================================

/**
 * Proses login: cocokkan username & password dari LocalStorage.
 * Simpan sesi user ke sessionStorage.
 */
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = getUserList();
  const found = users.find(u => u.username === username && u.password === password);

  if (!found) {
    const errEl = document.getElementById('loginError');
    errEl.textContent = 'Username atau password salah. Silakan coba lagi.';
    errEl.classList.remove('hidden');
    return;
  }

  // Simpan sesi
  sessionStorage.setItem('ek_session', JSON.stringify(found));
  startApp(found);
});

/** Keluar dan kembali ke halaman login */
function logout() {
  sessionStorage.removeItem('ek_session');
  state.currentUser = null;
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').classList.add('hidden');
}

// =====================================================
// SECTION 5: APP BOOTSTRAP
// =====================================================

/**
 * Inisialisasi app setelah login berhasil.
 * Set state user, tampilkan UI berdasarkan role, navigasi ke dashboard.
 */
function startApp(user) {
  state.currentUser = user;

  // Sembunyikan login, tampilkan app
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  // Isi info user di sidebar
  document.getElementById('sidebarUserName').textContent = user.nama;
  document.getElementById('sidebarUserRole').textContent = getRoleLabel(user.role);
  const instansi = INSTANSI_LIST.find(i => i.id === user.instansiId);
  document.getElementById('sidebarUserInstansi').textContent = instansi ? instansi.nama : 'Pengguna Eksternal';

  // Avatar header: inisial nama
  const initials = user.nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('headerAvatar').textContent = initials;
  document.getElementById('headerAvatar').title = user.nama;

  // Reset semua menu opsional dulu (penting jika login berganti user)
  document.getElementById('navSemuaSurat').classList.add('hidden');
  document.getElementById('navManajemenUser').classList.add('hidden');
  document.getElementById('navSuratMasuk') && document.getElementById('navSuratMasuk').classList.remove('hidden');

  // Tampilkan menu khusus admin
  if (user.role === 'admin_pusat' || user.role === 'admin_instansi') {
    document.getElementById('navSemuaSurat').classList.remove('hidden');
  }
  if (user.role === 'admin_pusat') {
    document.getElementById('navManajemenUser').classList.remove('hidden');
  }
  // Sembunyikan menu Surat Masuk untuk eksternal (tidak relevan)
  if (user.role === 'eksternal') {
    document.getElementById('navSuratMasuk').classList.add('hidden');
  }

  // Isi dropdown instansi untuk form user
  populateInstansiDropdown();

  navigateTo('dashboard');
}

/** Cek sesi yang masih aktif saat halaman dimuat ulang */
function checkSession() {
  initSeedData();
  const session = sessionStorage.getItem('ek_session');
  if (session) {
    startApp(JSON.parse(session));
  }
}

// =====================================================
// SECTION 6: NAVIGATION
// =====================================================

/** Peta nama halaman → elemen section & judul header */
const PAGE_MAP = {
  dashboard:      { el: 'pageDashboard',     title: 'Dashboard' },
  suratMasuk:     { el: 'pageSuratMasuk',    title: 'Surat Masuk' },
  suratKeluar:    { el: 'pageSuratKeluar',   title: 'Surat Keluar' },
  buatSurat:      { el: 'pageBuatSurat',     title: 'Buat Surat Baru' },
  semuaSurat:     { el: 'pageSemuaSurat',    title: 'Semua Surat' },
  detailSurat:    { el: 'pageDetailSurat',   title: 'Detail Surat' },
  manajemenUser:  { el: 'pageManajemenUser', title: 'Manajemen User' },
};

/**
 * Navigasi ke halaman tertentu.
 * Sembunyikan semua section, tampilkan yang diminta, render konten.
 */
function navigateTo(pageName) {
  // Tutup sidebar di mobile
  closeSidebarMobile();

  // Jika navigasi ke halaman surat dari detail, simpan halaman sebelumnya
  if (['suratMasuk', 'suratKeluar', 'semuaSurat'].includes(pageName)) {
    state.lastSuratPage = pageName;
  }

  // Reset form jika pindah ke buatSurat (bukan edit)
  if (pageName === 'buatSurat' && state.editingSuratId === null) {
    resetFormSurat();
  }

  state.currentPage = pageName;

  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  // Tampilkan halaman yang dipilih
  const pageInfo = PAGE_MAP[pageName];
  if (!pageInfo) return;
  const el = document.getElementById(pageInfo.el);
  if (el) el.classList.remove('hidden');

  // Update judul header
  document.getElementById('pageTitle').textContent = pageInfo.title;

  // Update active state di sidebar
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-nav="${pageName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Render konten halaman
  renderPage(pageName);
}

/**
 * Render isi setiap halaman sesuai nama.
 */
function renderPage(pageName) {
  switch (pageName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'suratMasuk':
      renderSuratList('masuk');
      break;
    case 'suratKeluar':
      renderSuratList('keluar');
      break;
    case 'semuaSurat':
      renderSuratList('semua');
      break;
    case 'buatSurat':
      renderFormSurat();
      break;
    case 'detailSurat':
      renderDetailSurat();
      break;
    case 'manajemenUser':
      renderUserList();
      break;
  }
}

// =====================================================
// SECTION 7: DASHBOARD
// =====================================================

/** Render statistik dan aktivitas terkini di dashboard */
function renderDashboard() {
  const user = state.currentUser;
  const allSurat = getSuratList();

  // Filter surat yang relevan dengan user
  const suratRelevan = getSuratRelevanUser(allSurat, user);

  // Hitung statistik
  const masuk    = suratRelevan.filter(s => s.tujuanInstansi.includes(user.instansiId) || user.role === 'admin_pusat').length;
  const keluar   = suratRelevan.filter(s => s.pengirimId === user.id).length;
  const diproses = suratRelevan.filter(s => s.status === 'diproses').length;
  const selesai  = suratRelevan.filter(s => s.status === 'selesai').length;

  // Hitung statistik sesuai peran
  let statMasuk, statKeluar;
  if (user.role === 'eksternal') {
    // Surat masuk eksternal = surat milik mereka yang sudah direspons (status bukan 'dikirim')
    statMasuk  = allSurat.filter(s => s.pengirimId === user.id && s.status !== 'dikirim').length;
    statKeluar = allSurat.filter(s => s.pengirimId === user.id).length;
  } else if (user.role === 'admin_instansi') {
    statMasuk  = allSurat.filter(s => s.tujuanInstansi.includes(user.instansiId)).length;
    statKeluar = allSurat.filter(s => s.pengirimId === user.id).length;
  } else {
    // admin_pusat: tampilkan statistik seluruh surat di sistem
    const sorted = allSurat.slice().sort((a, b) => new Date(getLatestHistoryTime(b)) - new Date(getLatestHistoryTime(a)));
    document.getElementById('statMasuk').textContent    = allSurat.length;
    document.getElementById('statKeluar').textContent   = allSurat.filter(s => s.pengirimId === user.id).length;
    document.getElementById('statDiproses').textContent = allSurat.filter(s => s.status === 'diproses').length;
    document.getElementById('statSelesai').textContent  = allSurat.filter(s => s.status === 'selesai').length;
    renderRecentActivity(sorted.slice(0, 8));
    return;
  }

  document.getElementById('statCardMasuk').classList.remove('hidden');
  document.getElementById('statMasuk').textContent    = statMasuk;
  document.getElementById('statKeluar').textContent   = statKeluar;
  document.getElementById('statDiproses').textContent = suratRelevan.filter(s => s.status === 'diproses').length;
  document.getElementById('statSelesai').textContent  = suratRelevan.filter(s => s.status === 'selesai').length;

  // Aktivitas terkini: 8 surat terbaru milik user ini
  const sorted = suratRelevan.slice().sort((a, b) => new Date(getLatestHistoryTime(b)) - new Date(getLatestHistoryTime(a))).slice(0, 8);
  renderRecentActivity(sorted);
}

/** Render item list di widget aktivitas terkini */
function renderRecentActivity(suratList) {
  const container = document.getElementById('recentActivity');
  if (suratList.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400 text-center py-8">Belum ada aktivitas.</p>';
    return;
  }
  container.innerHTML = suratList.map(s => `
    <div class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer"
         onclick="openDetailSurat('${s.id}', 'dashboard')">
      <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusBgClass(s.status)}">
        ${getStatusIcon(s.status)}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-800 truncate">${escHtml(s.perihal)}</p>
        <p class="text-xs text-gray-500 truncate">${escHtml(s.pengirimInstansi)} · ${formatDate(s.tanggal)}</p>
      </div>
      <span class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 badge-${s.status}">${getStatusLabel(s.status)}</span>
    </div>
  `).join('');
}

/** Waktu event terakhir di riwayat surat */
function getLatestHistoryTime(surat) {
  if (!surat.history || surat.history.length === 0) return surat.tanggal;
  return surat.history[surat.history.length - 1].waktu;
}

// =====================================================
// SECTION 8: SURAT LIST (Masuk / Keluar / Semua)
// =====================================================

/**
 * Render daftar surat sesuai tipe: 'masuk' | 'keluar' | 'semua'
 * Dengan filter status dan pencarian teks.
 */
function renderSuratList(tipe) {
  const user = state.currentUser;
  const allSurat = getSuratList();
  let list = [];

  if (tipe === 'masuk') {
    // Surat masuk: surat yang ditujukan ke instansi user
    if (user.role === 'admin_pusat') {
      // Admin pusat melihat SEMUA surat masuk ke seluruh instansi
      list = allSurat;
    } else if (user.role === 'admin_instansi') {
      list = allSurat.filter(s => s.tujuanInstansi.includes(user.instansiId));
    } else {
      // Eksternal: tidak ada surat masuk untuk mereka
      list = [];
    }
  } else if (tipe === 'keluar') {
    // Surat keluar: surat yang dikirim oleh user ini
    list = allSurat.filter(s => s.pengirimId === user.id);
  } else if (tipe === 'semua') {
    // Semua surat: hanya admin — eksternal dialihkan ke surat keluar mereka sendiri
    if (user.role === 'eksternal') {
      list = allSurat.filter(s => s.pengirimId === user.id);
    } else {
      list = allSurat;
    }
  }

  // Filter status
  const statusFilterId = tipe === 'masuk' ? 'filterStatusMasuk'
    : tipe === 'keluar' ? 'filterStatusKeluar' : 'filterStatusSemua';
  const statusFilter = document.getElementById(statusFilterId)?.value || '';
  if (statusFilter) {
    list = list.filter(s => s.status === statusFilter);
  }

  // Filter teks pencarian
  const searchId = tipe === 'masuk' ? 'searchMasuk'
    : tipe === 'keluar' ? 'searchKeluar' : 'searchSemua';
  const searchVal = (document.getElementById(searchId)?.value || '').toLowerCase().trim();
  if (searchVal) {
    list = list.filter(s =>
      s.perihal.toLowerCase().includes(searchVal) ||
      s.nomorSurat.toLowerCase().includes(searchVal) ||
      s.pengirimNama.toLowerCase().includes(searchVal) ||
      s.pengirimInstansi.toLowerCase().includes(searchVal)
    );
  }

  // Urutkan: terbaru dulu
  list.sort((a, b) => new Date(getLatestHistoryTime(b)) - new Date(getLatestHistoryTime(a)));

  // Update badge count surat masuk
  updateBadge(allSurat, user);

  // Target container
  const containerId = tipe === 'masuk' ? 'listSuratMasuk'
    : tipe === 'keluar' ? 'listSuratKeluar' : 'listSemuaSurat';
  const container = document.getElementById(containerId);

  if (list.length === 0) {
    container.innerHTML = `<div class="text-center py-12 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <p class="text-sm">Tidak ada surat ditemukan.</p>
    </div>`;
    return;
  }

  container.innerHTML = list.map(s => {
    const tujuanNama = s.tujuanInstansi.map(id => getInstansiNama(id)).join(', ');
    const canEdit   = canUserEditSurat(s);
    const canDelete = canUserDeleteSurat(s);
    return `
    <div class="surat-card bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer"
         onclick="openDetailSurat('${s.id}', '${tipe === 'masuk' ? 'suratMasuk' : tipe === 'keluar' ? 'suratKeluar' : 'semuaSurat'}')">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-1.5 mb-1">
            <span class="badge-${s.status} text-xs px-2 py-0.5 rounded-full font-medium">${getStatusLabel(s.status)}</span>
            <span class="badge-${s.prioritas} text-xs px-2 py-0.5 rounded-full font-medium">${getPrioritasLabel(s.prioritas)}</span>
            <span class="text-xs text-gray-400 capitalize">${s.kategori}</span>
          </div>
          <h4 class="text-sm font-semibold text-gray-800 truncate">${escHtml(s.perihal)}</h4>
          <p class="text-xs text-gray-500 mt-0.5">No: ${escHtml(s.nomorSurat)} · ${formatDate(s.tanggal)}</p>
        </div>
        <!-- Action buttons: stopPropagation agar tidak trigger openDetail -->
        <div class="flex items-center gap-1 flex-shrink-0" onclick="event.stopPropagation()">
          ${canEdit ? `<button onclick="editSurat('${s.id}')" title="Edit"
            class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg></button>` : ''}
          ${canDelete ? `<button onclick="confirmDeleteSurat('${s.id}')" title="Hapus"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg></button>` : ''}
        </div>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p class="text-xs text-gray-500 truncate">Tujuan: ${escHtml(tujuanNama)}</p>
      </div>
      <div class="mt-1 flex items-center gap-2">
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <p class="text-xs text-gray-500 truncate">Dari: ${escHtml(s.pengirimInstansi)}</p>
      </div>
    </div>`;
  }).join('');
}

/** Update badge count di sidebar nav item surat masuk */
function updateBadge(allSurat, user) {
  const badge = document.getElementById('badgeMasuk');
  let count = 0;
  if (user.role === 'admin_instansi') {
    count = allSurat.filter(s => s.tujuanInstansi.includes(user.instansiId) && s.status === 'dikirim').length;
  }
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// =====================================================
// SECTION 9: BUAT / EDIT SURAT
// =====================================================

/** Render form surat: buat baru atau edit */
function renderFormSurat() {
  // Judul form
  const isEdit = state.editingSuratId !== null;
  document.getElementById('formSuratTitle').textContent = isEdit ? 'Edit Surat' : 'Buat Surat Baru';
  document.querySelector('#pageBuatSurat button[type="submit"]').textContent = isEdit ? 'Simpan Perubahan' : 'Kirim Surat';
  document.getElementById('pageTitle').textContent = isEdit ? 'Edit Surat' : 'Buat Surat Baru';

  // Render checkbox instansi tujuan
  renderInstansiCheckboxes([]);

  if (isEdit) {
    const surat = getSuratList().find(s => s.id === state.editingSuratId);
    if (!surat) return;
    document.getElementById('suratId').value          = surat.id;
    document.getElementById('fNomor').value           = surat.nomorSurat;
    document.getElementById('fTanggal').value         = surat.tanggal;
    document.getElementById('fPerihal').value         = surat.perihal;
    document.getElementById('fKategori').value        = surat.kategori;
    document.getElementById('fIsi').value             = surat.isi;
    document.getElementById('fPrioritas').value       = surat.prioritas;
    document.getElementById('fLampiran').value        = surat.lampiran || '';
    // Set checkbox tujuan
    renderInstansiCheckboxes(surat.tujuanInstansi);
    updateRekomendasi();
  } else {
    // Isi tanggal default hari ini
    document.getElementById('fTanggal').value = getTodayISO();
    updateRekomendasi();
  }
}

/** Reset seluruh isi form surat */
function resetFormSurat() {
  state.editingSuratId = null;
  document.getElementById('formSurat').reset();
  document.getElementById('suratId').value = '';
  document.getElementById('fTanggal').value = getTodayISO();
}

/** Render checkbox daftar instansi, dengan yang dipilih sudah dicentang */
function renderInstansiCheckboxes(selectedIds) {
  const user = state.currentUser;
  const container = document.getElementById('instansiCheckboxes');
  // Tampilkan semua instansi kecuali instansi pengirim sendiri
  container.innerHTML = INSTANSI_LIST
    .filter(inst => inst.id !== user.instansiId)
    .map(inst => {
      const checked = selectedIds.includes(inst.id) ? 'checked' : '';
      return `
        <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 transition">
          <input type="checkbox" value="${inst.id}" ${checked}
            class="w-4 h-4 rounded border-gray-300 text-maroon focus:ring-maroon/30 accent-maroon" />
          <span class="text-sm text-gray-700">${escHtml(inst.nama)}</span>
        </label>`;
    }).join('');
}

/**
 * Submit form surat: buat baru atau update existing.
 * Validasi, bangun objek surat, simpan ke LocalStorage.
 */
function submitFormSurat(e) {
  e.preventDefault();
  const user = state.currentUser;

  // Kumpulkan instansi tujuan yang dicentang
  const checkedInstansi = Array.from(
    document.querySelectorAll('#instansiCheckboxes input[type="checkbox"]:checked')
  ).map(cb => cb.value);

  if (checkedInstansi.length === 0) {
    showToast('Pilih minimal satu instansi tujuan.', 'error');
    return;
  }

  const nomorSurat = document.getElementById('fNomor').value.trim();
  const tanggal    = document.getElementById('fTanggal').value;
  const perihal    = document.getElementById('fPerihal').value.trim();
  const kategori   = document.getElementById('fKategori').value;
  const isi        = document.getElementById('fIsi').value.trim();
  const prioritas  = document.getElementById('fPrioritas').value;
  const lampiran   = document.getElementById('fLampiran').value.trim();

  const list = getSuratList();

  if (state.editingSuratId) {
    // === UPDATE ===
    const idx = list.findIndex(s => s.id === state.editingSuratId);
    if (idx === -1) return;

    list[idx] = {
      ...list[idx],
      nomorSurat,
      tanggal,
      perihal,
      kategori,
      isi,
      prioritas,
      lampiran,
      tujuanInstansi: checkedInstansi,
    };

    // Tambah entri history perubahan
    list[idx].history.push({
      status: list[idx].status,
      waktu: new Date().toISOString(),
      keterangan: `Surat diperbarui oleh ${user.nama}`,
      pelaku: user.nama,
    });

    saveSuratList(list);
    showToast('Surat berhasil diperbarui.', 'success');
    state.editingSuratId = null;
    navigateTo('suratKeluar');

  } else {
    // === CREATE ===
    const instansiPengirim = INSTANSI_LIST.find(i => i.id === user.instansiId);
    const newSurat = {
      id: generateId('s'),
      nomorSurat,
      perihal,
      kategori,
      isi,
      tanggal,
      pengirimId: user.id,
      pengirimNama: user.nama,
      pengirimInstansi: instansiPengirim ? instansiPengirim.nama : 'Pengguna Eksternal',
      tujuanInstansi: checkedInstansi,
      prioritas,
      lampiran,
      status: 'dikirim',
      history: [
        {
          status: 'dikirim',
          waktu: new Date().toISOString(),
          keterangan: `Surat dikirim oleh ${user.nama}`,
          pelaku: user.nama,
        },
      ],
    };

    list.push(newSurat);
    saveSuratList(list);
    showToast('Surat berhasil dikirim!', 'success');
    navigateTo('suratKeluar');
  }
}

/**
 * Buka halaman edit untuk surat tertentu.
 * Hanya pengirim atau admin pusat yang bisa mengedit.
 */
function editSurat(id) {
  state.editingSuratId = id;
  navigateTo('buatSurat');
}

/**
 * Konfirmasi hapus surat.
 */
function confirmDeleteSurat(id) {
  const surat = getSuratList().find(s => s.id === id);
  if (!surat) return;
  document.getElementById('deleteModalMsg').textContent = `Hapus surat "${surat.perihal}"? Tindakan ini tidak dapat dibatalkan.`;
  state.deleteCallback = () => {
    const list = getSuratList().filter(s => s.id !== id);
    saveSuratList(list);
    closeDeleteModal();
    showToast('Surat berhasil dihapus.', 'success');
    renderPage(state.currentPage);
  };
  openDeleteModal();
}

// =====================================================
// SECTION 10: DETAIL SURAT
// =====================================================

/**
 * Buka halaman detail surat.
 * @param {string} id - ID surat
 * @param {string} fromPage - halaman asal untuk tombol kembali
 */
function openDetailSurat(id, fromPage) {
  state.viewingSuratId = id;
  if (fromPage) state.lastSuratPage = fromPage;
  navigateTo('detailSurat');
}

/** Render halaman detail surat */
function renderDetailSurat() {
  const id = state.viewingSuratId;
  if (!id) return;
  const surat = getSuratList().find(s => s.id === id);
  if (!surat) return;
  const user = state.currentUser;

  // Isi data detail
  document.getElementById('detailPerihal').textContent  = surat.perihal;
  document.getElementById('detailNomor').textContent    = `No. ${surat.nomorSurat}`;
  document.getElementById('detailPengirim').textContent = `${surat.pengirimNama} (${surat.pengirimInstansi})`;
  document.getElementById('detailTanggal').textContent  = formatDateFull(surat.tanggal);
  document.getElementById('detailKategori').textContent = surat.kategori;
  document.getElementById('detailLampiran').textContent = surat.lampiran || '-';
  document.getElementById('detailIsi').textContent      = surat.isi;

  // Badge status dan prioritas
  const badgeStatus = document.getElementById('detailBadgeStatus');
  badgeStatus.textContent  = getStatusLabel(surat.status);
  badgeStatus.className    = `text-xs px-2 py-0.5 rounded-full font-medium badge-${surat.status}`;

  const badgePrioritas = document.getElementById('detailBadgePrioritas');
  badgePrioritas.textContent = getPrioritasLabel(surat.prioritas);
  badgePrioritas.className   = `text-xs px-2 py-0.5 rounded-full font-medium badge-${surat.prioritas}`;

  // Chip instansi tujuan
  const tujuanEl = document.getElementById('detailTujuan');
  tujuanEl.innerHTML = surat.tujuanInstansi.map(instId => `
    <span class="bg-cream border border-brown-light text-sm text-brown-dark px-3 py-1 rounded-full font-medium">
      ${escHtml(getInstansiNama(instId))}
    </span>`).join('');

  // Tombol kembali
  document.getElementById('btnBackDetail').onclick = () => navigateTo(state.lastSuratPage);

  // Tombol aksi (edit/delete)
  const actionsEl = document.getElementById('detailActions');
  const canEdit   = canUserEditSurat(surat);
  const canDelete = canUserDeleteSurat(surat);
  actionsEl.innerHTML = '';
  if (canEdit) {
    actionsEl.innerHTML += `<button onclick="editSurat('${surat.id}')"
      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>Edit</button>`;
  }
  if (canDelete) {
    actionsEl.innerHTML += `<button onclick="confirmDeleteSurat('${surat.id}')"
      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>Hapus</button>`;
  }

  // Kotak update status: tampil jika admin instansi untuk surat yang ditujukan padanya
  const updateBox = document.getElementById('updateStatusBox');
  const canUpdateStatus = (
    (user.role === 'admin_instansi' && surat.tujuanInstansi.includes(user.instansiId)) ||
    user.role === 'admin_pusat'
  ) && surat.status !== 'selesai';

  if (canUpdateStatus) {
    updateBox.classList.remove('hidden');
    // Atur opsi sesuai status saat ini (tidak bisa mundur)
    const select = document.getElementById('newStatusSelect');
    const statusOrder = ['dikirim', 'diterima', 'diproses', 'selesai'];
    const currentIdx  = statusOrder.indexOf(surat.status);
    select.innerHTML  = statusOrder
      .filter((_, i) => i > currentIdx)
      .map(s => `<option value="${s}">${getStatusLabel(s)}</option>`)
      .join('');
  } else {
    updateBox.classList.add('hidden');
  }

  // Timeline riwayat
  renderTimeline(surat.history);
}

/** Render timeline riwayat proses surat */
function renderTimeline(history) {
  const container = document.getElementById('timelineContainer');
  const statusOrder = ['dikirim', 'diterima', 'diproses', 'selesai'];

  if (!history || history.length === 0) {
    container.innerHTML = '<p class="text-sm text-gray-400">Belum ada riwayat.</p>';
    return;
  }

  container.innerHTML = history.map((item, i) => {
    const isLast   = i === history.length - 1;
    const dotClass = isLast ? 'active' : 'done';
    return `
      <div class="timeline-item">
        <div class="timeline-dot ${dotClass}">
          ${isLast
            ? `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
               </svg>`
            : `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
               </svg>`}
        </div>
        <div class="pt-0.5">
          <p class="text-sm font-semibold text-gray-800">${getStatusLabel(item.status)}</p>
          <p class="text-xs text-gray-500 mt-0.5">${escHtml(item.keterangan)}</p>
          <p class="text-xs text-gray-400 mt-0.5">${formatDateTimeFull(item.waktu)} · oleh ${escHtml(item.pelaku)}</p>
        </div>
      </div>`;
  }).join('');
}

/** Update status surat dari halaman detail */
function updateStatusSurat() {
  const id     = state.viewingSuratId;
  const newSt  = document.getElementById('newStatusSelect').value;
  const user   = state.currentUser;
  const list   = getSuratList();
  const idx    = list.findIndex(s => s.id === id);
  if (idx === -1) return;

  list[idx].status = newSt;
  list[idx].history.push({
    status: newSt,
    waktu: new Date().toISOString(),
    keterangan: `Status diperbarui menjadi "${getStatusLabel(newSt)}"`,
    pelaku: user.nama,
  });

  saveSuratList(list);
  showToast(`Status diperbarui: ${getStatusLabel(newSt)}`, 'success');
  renderDetailSurat(); // re-render detail
}

// =====================================================
// SECTION 11: REKOMENDASI INSTANSI
// =====================================================

/**
 * Saat pengguna mengetik perihal/isi/kategori, sistem menganalisis
 * dan menampilkan saran instansi tujuan yang relevan.
 */
function updateRekomendasi() {
  const perihal  = (document.getElementById('fPerihal')?.value || '').toLowerCase();
  const isi      = (document.getElementById('fIsi')?.value || '').toLowerCase();
  const kategori = (document.getElementById('fKategori')?.value || '').toLowerCase();
  const combined = `${perihal} ${isi} ${kategori}`;

  if (combined.trim().length < 5) {
    document.getElementById('rekomendasiBox').classList.add('hidden');
    return;
  }

  const matches = new Set();
  REKOMENDASI_RULES.forEach(rule => {
    const hit = rule.keywords.some(kw => combined.includes(kw));
    if (hit) rule.instansi.forEach(id => matches.add(id));
  });

  // Filter keluar instansi user sendiri
  const user = state.currentUser;
  matches.delete(user.instansiId);

  const box = document.getElementById('rekomendasiBox');
  const listEl = document.getElementById('rekomendasiList');

  if (matches.size === 0) {
    box.classList.add('hidden');
    return;
  }

  box.classList.remove('hidden');
  listEl.innerHTML = Array.from(matches).map(id => {
    const nama = getInstansiNama(id);
    return `<span class="rekomendasi-tag border border-brown text-brown-dark text-xs px-2.5 py-1 rounded-full"
      onclick="centangInstansi('${id}')" title="Klik untuk memilih">${escHtml(nama)}</span>`;
  }).join('');
}

/** Centang checkbox instansi berdasarkan klik rekomendasi */
function centangInstansi(instansiId) {
  const cb = document.querySelector(`#instansiCheckboxes input[value="${instansiId}"]`);
  if (cb) {
    cb.checked = true;
    cb.closest('label').classList.add('bg-maroon/5');
  }
}

// =====================================================
// SECTION 12: MANAJEMEN USER (admin pusat)
// =====================================================

/** Render daftar user */
function renderUserList() {
  const users = getUserList();
  const container = document.getElementById('listUsers');

  if (users.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 py-8 text-sm">Tidak ada data user.</p>';
    return;
  }

  container.innerHTML = users.map(u => {
    const instansi = INSTANSI_LIST.find(i => i.id === u.instansiId);
    return `
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div class="w-10 h-10 bg-maroon rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          ${u.nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-gray-800">${escHtml(u.nama)}</p>
          <p class="text-xs text-gray-500">@${escHtml(u.username)}</p>
          <p class="text-xs text-gray-500 mt-0.5">${instansi ? instansi.nama : 'Tidak ada instansi'}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="role-${u.role} text-xs px-2.5 py-1 rounded-full font-medium">${getRoleLabel(u.role)}</span>
          <button onclick="openUserModal('${u.id}')" title="Edit"
            class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button onclick="confirmDeleteUser('${u.id}')" title="Hapus"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>`;
  }).join('');
}

/** Buka modal form user (tambah/edit) */
function openUserModal(userId) {
  const modal = document.getElementById('userModal');
  const title = document.getElementById('userModalTitle');
  const formUser = document.getElementById('formUser');
  formUser.reset();

  if (userId) {
    const u = getUserList().find(u => u.id === userId);
    if (!u) return;
    title.textContent = 'Edit User';
    document.getElementById('userId').value    = u.id;
    document.getElementById('uNama').value     = u.nama;
    document.getElementById('uUsername').value = u.username;
    document.getElementById('uRole').value     = u.role;
    document.getElementById('uInstansi').value = u.instansiId || '';
    toggleInstansiField();
  } else {
    title.textContent = 'Tambah User';
    document.getElementById('userId').value = '';
    toggleInstansiField();
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/** Tutup modal user */
function closeUserModal() {
  const modal = document.getElementById('userModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

/** Tampilkan/sembunyikan field instansi berdasarkan peran yang dipilih */
function toggleInstansiField() {
  const role = document.getElementById('uRole').value;
  const field = document.getElementById('instansiField');
  if (role === 'eksternal') {
    field.classList.add('hidden');
  } else {
    field.classList.remove('hidden');
  }
}

/** Isi dropdown instansi di form user */
function populateInstansiDropdown() {
  const sel = document.getElementById('uInstansi');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Pilih Instansi --</option>' +
    INSTANSI_LIST.map(i => `<option value="${i.id}">${escHtml(i.nama)}</option>`).join('');
}

/** Submit form user: tambah atau edit */
function submitFormUser(e) {
  e.preventDefault();
  const uid      = document.getElementById('userId').value;
  const nama     = document.getElementById('uNama').value.trim();
  const username = document.getElementById('uUsername').value.trim();
  const password = document.getElementById('uPassword').value;
  const role     = document.getElementById('uRole').value;
  const instansiId = document.getElementById('uInstansi').value || null;

  const users = getUserList();

  if (uid) {
    // === UPDATE USER ===
    const idx = users.findIndex(u => u.id === uid);
    if (idx === -1) return;
    users[idx].nama      = nama;
    users[idx].username  = username;
    users[idx].role      = role;
    users[idx].instansiId = instansiId;
    if (password) users[idx].password = password;
  } else {
    // === CREATE USER ===
    // Cek username unik
    if (users.some(u => u.username === username)) {
      showToast('Username sudah digunakan.', 'error');
      return;
    }
    if (!password) {
      showToast('Password wajib diisi untuk user baru.', 'error');
      return;
    }
    users.push({
      id: generateId('u'),
      nama,
      username,
      password,
      role,
      instansiId,
    });
  }

  saveUserList(users);
  closeUserModal();
  showToast('Data user berhasil disimpan.', 'success');
  renderUserList();
}

/** Konfirmasi hapus user */
function confirmDeleteUser(uid) {
  const users = getUserList();
  const u = users.find(u => u.id === uid);
  if (!u) return;
  // Cegah hapus user yang sedang login
  if (uid === state.currentUser.id) {
    showToast('Tidak dapat menghapus akun yang sedang aktif.', 'error');
    return;
  }
  document.getElementById('deleteModalMsg').textContent = `Hapus user "${u.nama}" (@${u.username})? Tindakan ini tidak dapat dibatalkan.`;
  state.deleteCallback = () => {
    const newList = users.filter(u => u.id !== uid);
    saveUserList(newList);
    closeDeleteModal();
    showToast('User berhasil dihapus.', 'success');
    renderUserList();
  };
  openDeleteModal();
}

// =====================================================
// SECTION 13: MODAL & TOAST
// =====================================================

function openDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('btnConfirmDelete').onclick = () => {
    if (state.deleteCallback) state.deleteCallback();
  };
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  state.deleteCallback = null;
}

let toastTimer = null;
/**
 * Tampilkan toast notifikasi.
 * @param {string} msg - Pesan yang ditampilkan
 * @param {'success'|'error'|'info'} type - Tipe notifikasi
 */
function showToast(msg, type = 'success') {
  const toast   = document.getElementById('toast');
  const content = document.getElementById('toastContent');

  const icons = {
    success: '<svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',
    error:   '<svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    info:    '<svg class="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  };

  content.innerHTML = `${icons[type] || ''}<span>${escHtml(msg)}</span>`;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => { toast.classList.add('hidden'); toast.classList.remove('hide'); }, 300);
  }, 3500);
}

// =====================================================
// SECTION 14: GLOBAL SEARCH
// =====================================================

/** Pencarian global: filter surat masuk/keluar berdasarkan input di header */
function handleGlobalSearch(val) {
  const v = val.toLowerCase().trim();
  if (!v) return;

  // Navigasi ke halaman yang sesuai dengan role, lalu terapkan filter
  const user = state.currentUser;
  if (user.role === 'admin_pusat' || user.role === 'admin_instansi') {
    navigateTo('semuaSurat');
    setTimeout(() => {
      const el = document.getElementById('searchSemua');
      if (el) { el.value = val; renderSuratList('semua'); }
    }, 50);
  } else {
    navigateTo('suratKeluar');
    setTimeout(() => {
      const el = document.getElementById('searchKeluar');
      if (el) { el.value = val; renderSuratList('keluar'); }
    }, 50);
  }
}

/**
 * Navigasi card "Surat Masuk" dari dashboard.
 * Eksternal diarahkan ke Surat Keluar (untuk lihat status tracking surat mereka).
 * Admin ke halaman Surat Masuk.
 */
function navigateToSuratMasuk() {
  const user = state.currentUser;
  if (user.role === 'eksternal') {
    navigateTo('suratKeluar');
  } else {
    navigateTo('suratMasuk');
  }
}

/**
 * Navigasi "Lihat semua" dari dashboard — arahkan ke halaman
 * yang sesuai role: admin ke semuaSurat, eksternal ke suratKeluar.
 */
function navigateToSuratList() {
  const user = state.currentUser;
  if (user.role === 'eksternal') {
    navigateTo('suratKeluar');
  } else {
    navigateTo('semuaSurat');
  }
}

// =====================================================
// SECTION 15: SIDEBAR (mobile toggle)
// =====================================================

function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const isOpen   = !sidebar.classList.contains('-translate-x-full');
  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
}

function closeSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

// =====================================================
// SECTION 16: PERMISSION HELPERS
// =====================================================

/** Apakah user bisa mengedit surat ini? */
function canUserEditSurat(surat) {
  const user = state.currentUser;
  if (user.role === 'admin_pusat') return true;
  // Pengirim bisa edit selama masih 'dikirim'
  if (surat.pengirimId === user.id && surat.status === 'dikirim') return true;
  return false;
}

/** Apakah user bisa menghapus surat ini? */
function canUserDeleteSurat(surat) {
  const user = state.currentUser;
  if (user.role === 'admin_pusat') return true;
  // Pengirim bisa hapus selama masih 'dikirim'
  if (surat.pengirimId === user.id && surat.status === 'dikirim') return true;
  return false;
}

/** Filter surat yang relevan dengan user */
function getSuratRelevanUser(allSurat, user) {
  if (user.role === 'admin_pusat') return allSurat;
  if (user.role === 'admin_instansi') {
    return allSurat.filter(s =>
      s.pengirimId === user.id ||
      s.tujuanInstansi.includes(user.instansiId)
    );
  }
  // eksternal: hanya surat miliknya
  return allSurat.filter(s => s.pengirimId === user.id);
}

// =====================================================
// SECTION 17: UTILITY FUNCTIONS
// =====================================================

/** Cari user berdasarkan ID */
function getUserById(id) {
  return getUserList().find(u => u.id === id) || null;
}

/** Cari nama instansi berdasarkan ID */
function getInstansiNama(id) {
  const inst = INSTANSI_LIST.find(i => i.id === id);
  return inst ? inst.nama : id;
}

/** Generate ID unik dengan prefix */
function generateId(prefix = 'id') {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

/** Escape HTML untuk mencegah XSS */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Format tanggal: "01 November 2026" */
function formatDateFull(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** Format tanggal singkat: "01 Nov 2026" */
function formatDate(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Format tanggal + jam: "01 Nov 2026, 08:00" */
function formatDateTimeFull(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Tanggal hari ini dalam format ISO (YYYY-MM-DD) */
function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Label status dalam Bahasa Indonesia */
function getStatusLabel(status) {
  const labels = { dikirim: 'Dikirim', diterima: 'Diterima', diproses: 'Diproses', selesai: 'Selesai' };
  return labels[status] || status;
}

/** Label prioritas dalam Bahasa Indonesia */
function getPrioritasLabel(prioritas) {
  const labels = { normal: 'Normal', penting: 'Penting', segera: 'Segera' };
  return labels[prioritas] || prioritas;
}

/** Label role dalam Bahasa Indonesia */
function getRoleLabel(role) {
  const labels = { admin_pusat: 'Admin Pusat', admin_instansi: 'Admin Instansi', eksternal: 'Pengguna Eksternal' };
  return labels[role] || role;
}

/** Warna background untuk ikon status di recent activity */
function getStatusBgClass(status) {
  const map = { dikirim: 'bg-blue-100', diterima: 'bg-green-100', diproses: 'bg-yellow-100', selesai: 'bg-purple-100' };
  return map[status] || 'bg-gray-100';
}

/** Ikon SVG kecil untuk status di recent activity */
function getStatusIcon(status) {
  const icons = {
    dikirim:  `<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`,
    diterima: `<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>`,
    diproses: `<svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    selesai:  `<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };
  return icons[status] || '';
}

// =====================================================
// SECTION 18: APP ENTRY POINT
// =====================================================

// Jalankan pengecekan sesi saat DOM siap
document.addEventListener('DOMContentLoaded', checkSession);
