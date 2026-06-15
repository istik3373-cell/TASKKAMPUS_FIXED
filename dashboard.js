// ============================================================
// INIT: ambil role dari localStorage
// ============================================================
const role = localStorage.getItem("role") || "mahasiswa";

// Tugas default (jika localStorage kosong)
const defaultTugas = [
  { judul: "Laporan Observasi",       matkul: "Evaluasi Pembelajaran", deadline: "2026-06-15", status: "pending" },
  { judul: "Sistem Manajemen Belajar",matkul: "DTI RPL",               deadline: "2026-06-20", status: "pending" },
  { judul: "Review Jurnal",           matkul: "Sistem Operasi",        deadline: "2026-06-25", status: "pending" },
  { judul: "Perancangan ERD",         matkul: "Basis Data",            deadline: "2026-06-30", status: "pending" },
  { judul: "Laporan Packet Tracer",   matkul: "Komunikasi Data",       deadline: "2026-06-18", status: "selesai" },
];

// Pesan default
const defaultPesan = [
  { pengirim: "dosen",    nama: "Mr. Jae",         teks: "Jangan lupa mengumpulkan Laporan Observasi sebelum tanggal 15 Juni 2026." },
  { pengirim: "mahasiswa",nama: "Nur Istikomah",   teks: "Baik Mr, laporan sedang saya kerjakan dan akan segera saya upload." },
  { pengirim: "dosen",    nama: "Mr. Jae",         teks: "Baik, pastikan format laporan sesuai dengan ketentuan yang sudah diberikan." },
  { pengirim: "mahasiswa",nama: "Nur Istikomah",   teks: "Siap Mr, terima kasih atas informasinya." },
];

// ============================================================
// HELPER: baca/tulis localStorage
// ============================================================
function getTugas() {
  const raw = localStorage.getItem("tugasList");
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultTugas));
}
function saveTugas(arr) {
  localStorage.setItem("tugasList", JSON.stringify(arr));
}
function getUploadedTugas() {
  const raw = localStorage.getItem("uploadedTugas");
  return raw ? JSON.parse(raw) : [];
}
function saveUploadedTugas(arr) {
  localStorage.setItem("uploadedTugas", JSON.stringify(arr));
}
function getPesan() {
  const raw = localStorage.getItem("pesanList");
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(defaultPesan));
}
function savePesan(arr) {
  localStorage.setItem("pesanList", JSON.stringify(arr));
}

// ============================================================
// INISIALISASI default data (sekali saja)
// ============================================================
if (!localStorage.getItem("tugasList")) {
  saveTugas(defaultTugas);
}
if (!localStorage.getItem("pesanList")) {
  savePesan(defaultPesan);
}

// ============================================================
// SETUP TAMPILAN BERDASARKAN ROLE
// ============================================================
function setupRole() {
  if (role === "dosen") {
    document.getElementById("welcomeText").innerHTML = "Selamat Datang, Mr. Jae 👋";
    document.getElementById("profile-name").innerHTML = "Mr. Jae";
    document.getElementById("profile-prodi").innerHTML = "Dosen Pengampu";
    document.getElementById("profile-info").innerHTML = "TaskKampus";
    document.getElementById("avatar").src = "images/Dosen.jpg";

    // Sembunyikan menu mahasiswa, tampilkan menu dosen
    document.getElementById("menuUpload").style.display = "none";
    document.getElementById("menuMonitoring").style.display = "none";

    // Tampilkan cards dosen
    document.getElementById("cardsDosen").style.display = "grid";
    document.getElementById("monitoringDosen").style.display = "block";

    updateDashboardDosen();
  } else {
    document.getElementById("welcomeText").innerHTML = "Selamat Datang, Nur Istikomah 👋";
    document.getElementById("profile-name").innerHTML = "Nur Istikomah";
    document.getElementById("profile-prodi").innerHTML = "Pendidikan Teknologi Informasi";
    document.getElementById("profile-info").innerHTML = "Semester 4";
    document.getElementById("avatar").src = "images/Mahasiswa.jpg";

    // Sembunyikan menu dosen
    document.getElementById("menuKelola").style.display = "none";

    // Tampilkan cards & progress mahasiswa
    document.getElementById("cardsMahasiswa").style.display = "grid";
    document.getElementById("progressMahasiswa").style.display = "block";

    updateDashboardMahasiswa();
  }
}

// ============================================================
// UPDATE DASHBOARD MAHASISWA
// ============================================================
function updateDashboardMahasiswa() {
  const tugas = getTugas();
  const uploaded = getUploadedTugas();

  // Tugas yang sudah upload dianggap selesai
  const selesaiSet = new Set(uploaded.map(u => u.judul));
  const total = tugas.length;
  let selesai = 0;
  tugas.forEach(t => {
    if (t.status === "selesai" || selesaiSet.has(t.judul)) selesai++;
  });
  const belum = total - selesai;
  const persen = total > 0 ? Math.round((selesai / total) * 100) : 0;

  // Cards
  document.getElementById("totalTugasCard").textContent = total;
  document.getElementById("selesaiCard").textContent = selesai;
  document.getElementById("belumSelesaiCard").textContent = belum;
  document.getElementById("persentaseCard").textContent = persen + "%";

  // Progress bar
  const pb = document.getElementById("progressBar");
  if (pb) pb.style.width = persen + "%";
  const pt = document.getElementById("progressText");
  if (pt) pt.textContent = selesai + " dari " + total + " tugas telah diselesaikan.";
}

// ============================================================
// UPDATE DASHBOARD DOSEN
// ============================================================
function updateDashboardDosen() {
  const tugas = getTugas();
  const uploaded = getUploadedTugas();

  // Total tugas dibuat dosen
  document.getElementById("totalTugasDosenCard").textContent = tugas.length;

  // Hitung pengumpulan unik per judul tugas
  const tugasYangDikumpul = new Set(uploaded.map(u => u.judul));
  const selesai = tugasYangDikumpul.size;
  const belum = tugas.length - selesai;
  const persen = tugas.length > 0 ? Math.round((selesai / tugas.length) * 100) : 0;

  document.getElementById("mahasiswaSelesaiCard").textContent = selesai;
  document.getElementById("mahasiswaBelumCard").textContent = Math.max(0, belum);
  document.getElementById("persentaseDosenCard").textContent = persen + "%";

  // Tabel monitoring: siapa yang sudah mengumpulkan
  const tbody = document.getElementById("bodyMonitoringDosen");
  tbody.innerHTML = "";

  if (uploaded.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;">Belum ada mahasiswa yang mengumpulkan tugas.</td></tr>';
    return;
  }

  uploaded.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.namaMahasiswa || "Nur Istikomah"}</td>
      <td>${u.matkul}</td>
      <td>${u.judul}</td>
      <td><span class="status selesai">Sudah Mengumpulkan ✅</span></td>
      <td>${u.waktu || "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
// DAFTAR TUGAS MAHASISWA
// ============================================================
function renderDaftarTugas() {
  const tugas = getTugas();
  const uploaded = getUploadedTugas();
  const selesaiSet = new Set(uploaded.map(u => u.judul));

  const tbody = document.getElementById("bodyDaftarTugas");
  tbody.innerHTML = "";
  tugas.forEach(t => {
    const sudahUpload = selesaiSet.has(t.judul) || t.status === "selesai";
    const statusClass = sudahUpload ? "selesai" : "pending";
    const statusText  = sudahUpload ? "Selesai ✅" : "Pending";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.matkul}</td>
      <td>${t.judul}</td>
      <td>${formatDate(t.deadline)}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
// UPLOAD TUGAS (Mahasiswa)
// ============================================================
function renderPilihTugas() {
  const tugas = getTugas();
  const select = document.getElementById("pilihTugasUpload");
  if (!select) return;
  select.innerHTML = '<option value="">-- Pilih Tugas --</option>';
  tugas.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${t.matkul} - ${t.judul}`;
    select.appendChild(opt);
  });
}

function renderRiwayatUpload() {
  const uploaded = getUploadedTugas();
  const tbody = document.getElementById("riwayatUpload");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (uploaded.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;">Belum ada tugas yang diupload.</td></tr>';
    return;
  }
  uploaded.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.matkul}</td>
      <td>${u.judul}</td>
      <td>${u.waktu}</td>
      <td><span class="status selesai">Sudah Upload ✅</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function doUploadTugas() {
  const idx = document.getElementById("pilihTugasUpload").value;
  const fileEl = document.getElementById("fileUpload");
  const pesan  = document.getElementById("pesanUpload");

  if (idx === "") { pesan.style.color="#ef4444"; pesan.textContent = "⚠️ Pilih tugas terlebih dahulu!"; return; }
  if (!fileEl.files || fileEl.files.length === 0) { pesan.style.color="#ef4444"; pesan.textContent = "⚠️ Pilih file terlebih dahulu!"; return; }

  const tugas = getTugas();
  const t = tugas[parseInt(idx)];

  // Tandai sebagai selesai di list tugas
  tugas[parseInt(idx)].status = "selesai";
  saveTugas(tugas);

  // Simpan ke riwayat upload
  const uploaded = getUploadedTugas();
  // Cek duplikat
  const alreadyUploaded = uploaded.find(u => u.judul === t.judul);
  if (!alreadyUploaded) {
    uploaded.push({
      judul: t.judul,
      matkul: t.matkul,
      namaMahasiswa: "Nur Istikomah",
      waktu: new Date().toLocaleString("id-ID"),
      fileName: fileEl.files[0].name
    });
    saveUploadedTugas(uploaded);
  }

  pesan.style.color = "#22c55e";
  pesan.textContent = "✅ Tugas \"" + t.judul + "\" berhasil diupload!";
  fileEl.value = "";

  // Refresh semua tampilan
  renderRiwayatUpload();
  updateDashboardMahasiswa();
  renderDaftarTugas();
  renderMonitoringMahasiswa();
}

// ============================================================
// KELOLA TUGAS (Dosen)
// ============================================================
function tambahTugas() {
  const judul    = document.getElementById("judulTugas").value.trim();
  const matkul   = document.getElementById("matkulTugas").value.trim();
  const deadline = document.getElementById("deadlineTugas").value;
  const pesan    = document.getElementById("pesanKelola");

  if (!judul || !matkul || !deadline) {
    pesan.style.color = "#ef4444";
    pesan.textContent = "⚠️ Lengkapi semua field!";
    return;
  }

  const tugas = getTugas();
  tugas.push({ judul, matkul, deadline, status: "pending" });
  saveTugas(tugas);

  document.getElementById("judulTugas").value    = "";
  document.getElementById("matkulTugas").value   = "";
  document.getElementById("deadlineTugas").value = "";

  pesan.style.color = "#22c55e";
  pesan.textContent = "✅ Tugas \"" + judul + "\" berhasil ditambahkan!";

  renderKelolaTugas();
  updateDashboardDosen();
  renderPilihTugas(); // agar mahasiswa langsung bisa lihat tugas baru
}

function hapusTugas(idx) {
  const tugas = getTugas();
  tugas.splice(idx, 1);
  saveTugas(tugas);
  renderKelolaTugas();
  updateDashboardDosen();
}

function renderKelolaTugas() {
  const tugas = getTugas();
  const tbody = document.getElementById("dataTugasDosen");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (tugas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;">Belum ada tugas.</td></tr>';
    return;
  }
  tugas.forEach((t, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.matkul}</td>
      <td>${t.judul}</td>
      <td>${formatDate(t.deadline)}</td>
      <td><button onclick="hapusTugas(${i})" style="background:#ef4444;padding:8px 14px;">🗑 Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
// MONITORING (Mahasiswa)
// ============================================================
function renderMonitoringMahasiswa() {
  const tugas    = getTugas();
  const uploaded = getUploadedTugas();
  const selesaiSet = new Set(uploaded.map(u => u.judul));

  const total   = tugas.length;
  let selesai   = 0;
  tugas.forEach(t => { if (t.status === "selesai" || selesaiSet.has(t.judul)) selesai++; });
  const belum   = total - selesai;
  const persen  = total > 0 ? Math.round((selesai / total) * 100) : 0;

  const el = (id) => document.getElementById(id);
  if (el("monTotalTugas"))  el("monTotalTugas").textContent  = total;
  if (el("monSelesai"))     el("monSelesai").textContent     = selesai;
  if (el("monBelum"))       el("monBelum").textContent       = belum;
  if (el("monPersen"))      el("monPersen").textContent      = persen + "%";
  if (el("monProgressBar")) el("monProgressBar").style.width = persen + "%";
  if (el("monProgressText")) el("monProgressText").textContent = selesai + " dari " + total + " tugas telah diselesaikan.";

  const tbody = document.getElementById("monDetailTugas");
  if (!tbody) return;
  tbody.innerHTML = "";
  tugas.forEach(t => {
    const done = t.status === "selesai" || selesaiSet.has(t.judul);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.matkul}</td>
      <td>${t.judul}</td>
      <td>${formatDate(t.deadline)}</td>
      <td><span class="status ${done ? "selesai" : "pending"}">${done ? "Selesai ✅" : "Pending"}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
// PESAN
// ============================================================
function renderPesan() {
  const pesanList = getPesan();
  const chatBox = document.getElementById("chatBox");
  if (!chatBox) return;
  chatBox.innerHTML = "";
  pesanList.forEach(p => {
    const div = document.createElement("div");
    div.className = "message " + (p.pengirim === "dosen" ? "dosen" : "mahasiswa");
    div.innerHTML = `<strong>${p.nama} :</strong><br>${p.teks}`;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function kirimPesan() {
  const input = document.getElementById("inputPesan");
  const teks  = input.value.trim();
  if (!teks) return;

  const pesanList = getPesan();
  const pengirim  = role;
  const nama      = role === "dosen" ? "Mr. Jae" : "Nur Istikomah";

  pesanList.push({ pengirim, nama, teks });
  savePesan(pesanList);
  input.value = "";
  renderPesan();
}

// Enter untuk kirim pesan
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputPesan");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        kirimPesan();
      }
    });
  }
});

// ============================================================
// NAVIGASI HALAMAN
// ============================================================
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");

  // Render data saat halaman dibuka
  if (page === "tugas")      renderDaftarTugas();
  if (page === "upload")     { renderPilihTugas(); renderRiwayatUpload(); }
  if (page === "kelola")     renderKelolaTugas();
  if (page === "monitoring") renderMonitoringMahasiswa();
  if (page === "pesan")      renderPesan();
  if (page === "dashboard") {
    if (role === "dosen")    updateDashboardDosen();
    else                     updateDashboardMahasiswa();
  }
}

// ============================================================
// LOGOUT
// ============================================================
function logout() {
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

// ============================================================
// HELPER: format tanggal
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  const bulan = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  return `${parseInt(d)} ${bulan[parseInt(m)]} ${y}`;
}

// ============================================================
// JALANKAN
// ============================================================
setupRole();
