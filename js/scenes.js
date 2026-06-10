// ════════════════════════════════════════════
// LEVEL & SCENE DATA — NetAdmin Academy
// ════════════════════════════════════════════

const LEVELS = [

  // ══════════════════════════════════════════
  // LEVEL 1 — Instalasi & Konfigurasi Dasar
  // ══════════════════════════════════════════
  {
    id: 1, title: "Server Baru, Mulai dari Nol",
    mission: "Konfigurasi Dasar Server",
    badge: "🔧 System Builder",
    startScene: "lobby",

    scenes: {

      lobby: {
        type: "corridor", label: "🏢 Lobby Gedung Netville IT",
        doorSign: "SERVER ROOM A",
        navLeft: false, navRight: false, navBack: false,
        chars: [{
          id: "pak-rudi", emoji: "👨‍💼", name: "Pak Rudi",
          x: "68%", y: "28%",
          bubble: "Hei! Akhirnya kamu datang! 👋"
        }],
        dialogOnEnter: "intro"
      },

      serverroom: {
        type: "serverroom", label: "🖥️ Ruang Server A",
        navLeft: false, navRight: false, navBack: true,
        chars: [{
          id: "sari", emoji: "👩‍💻", name: "Sari",
          x: "72%", y: "30%",
          bubble: "Cek semua objek dulu ya!"
        }],
        objects: [
          { id:"server-rack",  emoji:"🖥️", label:"Server Rack",     x:"15%", y:"32%" },
          { id:"monitor",      emoji:"🖥",  label:"Monitor Terminal", x:"38%", y:"35%" },
          { id:"sticky-note",  emoji:"📝",  label:"Catatan Pak Rudi", x:"55%", y:"42%" },
          { id:"usb",          emoji:"💾",  label:"USB Bootable",     x:"22%", y:"52%" },
          { id:"router",       emoji:"📡",  label:"Router",           x:"65%", y:"38%" },
        ]
      }
    },

    dialogs: {
      intro: [
        { who:"👨‍💼", name:"Pak Rudi", text:"Selamat datang di Netville IT Solutions! Kamu junior sysadmin baru kami. Senang punya kamu di tim!" },
        { who:"👨‍💼", name:"Pak Rudi", text:"Ada masalah mendesak! Server baru baru tiba hari ini. Instalasi Ubuntu Server sudah selesai, tapi belum dikonfigurasi sama sekali." },
        { who:"👨‍💼", name:"Pak Rudi", text:"Server itu harus bisa diakses via SSH sebelum klien datang sore ini. Buka pintu server room itu dan mulai konfigurasinya!" },
        { who:"💡", name:"Tutorial", text:"Klik pintu untuk membukanya dan masuk ke ruang server. Di dalam, klik setiap objek untuk dapat informasi dan petunjuk." }
      ],
      sari_greet: [
        { who:"👩‍💻", name:"Sari", text:"Hei! Aku Sari, senior admin di sini. Senang kenal!" },
        { who:"👩‍💻", name:"Sari", text:"Server sudah terpasang tapi perlu dikonfigurasi. Klik setiap objek di ruangan untuk inspect — ada catatan petunjuk dari Pak Rudi juga lho!" },
        { who:"👩‍💻", name:"Sari", text:"Setelah dapat info yang cukup, buka terminal dan ketik command-nya. Aku di sini kalau butuh bantuan! 💪" }
      ]
    },

    items: {
      "server-rack": {
        icon:"🖥️", title:"Server Dell PowerEdge R720",
        status:"warn", statusText:"Belum dikonfigurasi",
        body:"Server baru. Ubuntu Server 22.04 LTS sudah terinstall.\nStatus: berjalan tapi belum ada konfigurasi jaringan atau SSH.\nPerlu: set hostname, cek IP, update sistem.",
        theory:"Server adalah komputer yang melayani permintaan dari komputer lain. Ubuntu Server adalah OS Linux populer untuk server karena ringan dan stabil. Command dasar: ip addr, hostname, systemctl.",
        triggerTerm: true
      },
      "monitor": {
        icon:"🖥", title:"Monitor — Terminal Aktif",
        status:"warn", statusText:"Perlu dikonfigurasi",
        body:"Terminal Ubuntu Server sudah aktif.\nLogin: root\nTugas: cek IP address, set hostname, update sistem, aktifkan SSH.\n\nGunakan terminal untuk mulai!",
        theory:"SSH (Secure Shell) memungkinkan akses remote ke server secara aman melalui jaringan. Default port: 22. Perintah: systemctl enable ssh untuk mengaktifkan.",
        triggerTerm: true
      },
      "sticky-note": {
        icon:"📝", title:"Catatan dari Pak Rudi",
        status:"ok", statusText:"📋 Petunjuk Konfigurasi",
        body:"Checklist server baru:\n1. ip addr → cek IP address\n2. hostnamectl set-hostname netville-server\n3. apt update → update paket\n4. systemctl enable ssh → aktifkan SSH\n5. systemctl status ssh → verifikasi",
        theory:"",
        triggerTerm: false
      },
      "usb": {
        icon:"💾", title:"USB Flash Drive — Ubuntu 22.04",
        status:"ok", statusText:"Instalasi selesai ✓",
        body:"USB bootable berisi Ubuntu Server 22.04 LTS.\nInstalasi OS sudah selesai!\nBisa dicabut — sekarang waktunya konfigurasi sistem.",
        theory:"Ubuntu Server 22.04 LTS (Long Term Support) didukung selama 5 tahun. Cocok untuk server produksi karena stabil dan dapat update keamanan jangka panjang.",
        triggerTerm: false
      },
      "router": {
        icon:"📡", title:"Router Jaringan — Online",
        status:"ok", statusText:"Link up",
        body:"Router terhubung ke internet. ✓\nIP Gateway: 192.168.1.1\nServer dapat IP: 192.168.1.100\nDNS: 8.8.8.8\n\nJaringan siap — tinggal konfigurasi server!",
        theory:"Router menghubungkan jaringan lokal (LAN) ke internet (WAN). Default gateway adalah IP router yang digunakan perangkat untuk mengirim data ke luar jaringan.",
        triggerTerm: false
      }
    },

    objectives: [
      { id:"check-ip",      text:"Cek IP address server",       cmd:"ip addr" },
      { id:"set-hostname",  text:"Set hostname server",          cmd:"hostnamectl set-hostname netville-server" },
      { id:"update-system", text:"Update sistem",                cmd:"apt update" },
      { id:"enable-ssh",    text:"Aktifkan SSH service",         cmd:"systemctl enable ssh" },
      { id:"check-ssh",     text:"Verifikasi SSH berjalan",      cmd:"systemctl status ssh" }
    ],

    hints: [
      "Ketik 'ip addr' di terminal untuk cek IP address server.",
      "Set hostname: hostnamectl set-hostname netville-server",
      "Aktifkan SSH: systemctl enable ssh lalu cek: systemctl status ssh"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 2 — Apache Web Server
  // ══════════════════════════════════════════
  {
    id: 2, title: "Website Sekolah Harus Hidup!",
    mission: "Setup Apache Web Server",
    badge: "🌐 Web Master",
    startScene: "lobby",

    scenes: {
      lobby: {
        type:"corridor", label:"🏢 Lobby — Situasi Darurat!",
        doorSign:"SERVER ROOM B",
        navLeft:false, navRight:false, navBack:false,
        chars:[{
          id:"kepala", emoji:"😰", name:"Bu Kepala Sekolah",
          x:"65%", y:"26%",
          bubble:"TOLONG! Website kami down! 😱"
        }],
        dialogOnEnter:"intro"
      },
      serverroom: {
        type:"serverroom", label:"🖥️ Ruang Server B",
        navLeft:false, navRight:false, navBack:true,
        chars:[{
          id:"sari", emoji:"👩‍💻", name:"Sari",
          x:"70%", y:"32%",
          bubble:"Apache belum diinstall nih!"
        }],
        objects:[
          { id:"server",      emoji:"🖥️", label:"Server Ubuntu",    x:"14%", y:"30%" },
          { id:"browser-err", emoji:"🌐",  label:"Browser Error",    x:"38%", y:"33%" },
          { id:"html-folder", emoji:"📁",  label:"File Website",     x:"55%", y:"40%" },
          { id:"php-manual",  emoji:"📗",  label:"Buku Manual",      x:"25%", y:"50%" },
          { id:"phone",       emoji:"📱",  label:"HP Kepala Sekolah",x:"64%", y:"36%" },
        ]
      }
    },

    dialogs: {
      intro:[
        { who:"😰", name:"Bu Kepala Sekolah", text:"Kamu dari Netville IT? SYUKURLAH! Website pendaftaran sekolah kami tidak bisa dibuka sama sekali!" },
        { who:"😰", name:"Bu Kepala Sekolah", text:"Deadline pendaftaran siswa baru tinggal 2 JAM LAGI! Ada 200 calon siswa yang tidak bisa daftar. Ini bencana!" },
        { who:"👩‍💻", name:"Sari", text:"Tenang Bu, kami handle. Aku sudah cek — Apache web server-nya belum terinstall. Kita yang baru ganti server minggu lalu lupa install ulang." },
        { who:"👩‍💻", name:"Sari", text:"Masuk ke server room, file website-nya sudah ada. Tinggal install Apache dan aktifkan. Ayo cepat!" }
      ],
      sari_greet:[
        { who:"👩‍💻", name:"Sari", text:"Oke, situasinya: file HTML website ada di /var/www/html, tapi Apache belum diinstall. Tanpa Apache, browser tidak bisa buka website kita." },
        { who:"👩‍💻", name:"Sari", text:"Inspect dulu semua objek di ruangan buat dapat gambaran lengkap, lalu buka terminal dan install Apache-nya." }
      ]
    },

    items: {
      "server":{ icon:"🖥️", title:"Server Ubuntu — Apache Missing",
        status:"warn", statusText:"Apache not found",
        body:"Server Ubuntu 22.04 berjalan normal.\nCPU: normal | RAM: normal | Disk: OK\nApache2: NOT INSTALLED ❌\n\nWeb server perlu diinstall agar website bisa melayani request browser.",
        theory:"Apache HTTP Server adalah web server #1 di dunia. Cara kerja: browser mengirim HTTP request → Apache menerima di port 80 → Apache merespons dengan file HTML dari /var/www/html/.",
        triggerTerm:true },
      "browser-err":{ icon:"🌐", title:"Browser — ERR_CONNECTION_REFUSED",
        status:"err", statusText:"Port 80 tertutup",
        body:"Mencoba: http://192.168.1.100\nError: ERR_CONNECTION_REFUSED\n\nTidak ada yang mendengarkan di port 80.\nSetelah Apache diinstall dan dijalankan, error ini akan hilang.",
        theory:"Port 80 adalah port default HTTP. Ketika browser request ke sebuah IP, ia menghubungi port 80. Jika tidak ada service di port itu, koneksi ditolak (refused).",
        triggerTerm:false },
      "html-folder":{ icon:"📁", title:"/var/www/html — File Siap",
        status:"ok", statusText:"File website tersedia",
        body:"Isi /var/www/html/:\n✓ index.html (halaman utama)\n✓ style.css\n✓ images/ (foto sekolah)\n\nFile sudah lengkap! Tinggal aktifkan Apache-nya.",
        theory:"Document Root Apache defaultnya /var/www/html/. Semua file di sini bisa diakses via browser setelah Apache aktif. Bisa diubah via konfigurasi virtual host.",
        triggerTerm:true },
      "php-manual":{ icon:"📗", title:"Buku Manual Apache2",
        status:"ok", statusText:"Referensi command",
        body:"Perintah Apache yang dibutuhkan:\n• apt install apache2 → install\n• systemctl start apache2 → jalankan\n• systemctl enable apache2 → aktif saat boot\n• systemctl status apache2 → cek status\n• curl http://localhost → test website",
        theory:"",
        triggerTerm:false },
      "phone":{ icon:"📱", title:"Pesan dari Bu Kepala Sekolah",
        status:"err", statusText:"🚨 URGENT!",
        body:"\"Halo, ini update: sekarang ada wartawan yang mau liput proses pendaftaran. Kalau website masih down ketika mereka tiba, nama sekolah kita bisa jelek di koran! TOLONG CEPAT!!\" 😰",
        theory:"",
        triggerTerm:false }
    },

    objectives:[
      { id:"install-apache", text:"Install Apache2",           cmd:"apt install apache2" },
      { id:"start-apache",   text:"Jalankan Apache",           cmd:"systemctl start apache2" },
      { id:"enable-apache",  text:"Enable Apache saat boot",   cmd:"systemctl enable apache2" },
      { id:"check-apache",   text:"Cek status Apache",         cmd:"systemctl status apache2" },
      { id:"test-website",   text:"Test website bisa diakses", cmd:"curl http://localhost" }
    ],
    hints:[
      "Install Apache dulu: apt install apache2",
      "Jalankan service-nya: systemctl start apache2",
      "Test website: curl http://localhost"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 3 — DHCP & DNS
  // ══════════════════════════════════════════
  {
    id:3, title:"Semua Komputer Tidak Dapat IP!",
    mission:"Konfigurasi DHCP & DNS",
    badge:"🔌 Network Architect",
    startScene:"lobby",

    scenes:{
      lobby:{
        type:"corridor", label:"🏢 Lobby Gedung SMK Netville",
        doorSign:"RUANG SERVER LAB",
        navLeft:false, navRight:false, navBack:false,
        chars:[{
          id:"guru-tik", emoji:"😤", name:"Pak Guru TIK",
          x:"64%", y:"28%",
          bubble:"Lab komputer semua mati! 30 PC!"
        }],
        dialogOnEnter:"intro"
      },
      serverroom:{
        type:"serverroom", label:"🖥️ Ruang Server Lab Komputer",
        navLeft:false, navRight:false, navBack:true,
        chars:[{
          id:"sari", emoji:"👩‍💻", name:"Sari",
          x:"71%", y:"31%",
          bubble:"DHCP server belum ada nih!"
        }],
        objects:[
          { id:"lab-pc",      emoji:"💻", label:"Komputer Lab",      x:"13%", y:"30%" },
          { id:"dhcp-status", emoji:"🔴", label:"DHCP Status",       x:"36%", y:"34%" },
          { id:"net-diagram", emoji:"🗺️", label:"Diagram Jaringan",  x:"53%", y:"40%" },
          { id:"switch",      emoji:"🔀", label:"Network Switch",    x:"24%", y:"50%" },
          { id:"angry-note",  emoji:"📋", label:"Catatan Insiden",   x:"63%", y:"36%" },
        ]
      }
    },

    dialogs:{
      intro:[
        { who:"😤", name:"Pak Guru TIK", text:"Kamu teknisi IT? Syukurlah! Lab komputer saya lumpuh total. 30 PC tidak bisa dapat IP address. Praktikum jaringan dibatalkan!" },
        { who:"😤", name:"Pak Guru TIK", text:"Ini sudah 2 jam! Siswa bengong semua di lab. Ini materi jaringan, ironis sekali — belajar jaringan tapi jaringannya mati!" },
        { who:"👩‍💻", name:"Sari", text:"Maaf Pak, saya Sari dari Netville IT. Kami handle sekarang. Diagnosisnya: DHCP server belum dikonfigurasi untuk lab ini." },
        { who:"👩‍💻", name:"Sari", text:"Masuk ke server room, ada diagram jaringan di sana untuk referensi. Kita install dan konfigurasi DHCP + DNS server sekarang." }
      ],
      sari_greet:[
        { who:"👩‍💻", name:"Sari", text:"Masalahnya jelas: tidak ada DHCP server. Semua PC dapat IP 169.254.x.x (APIPA) — itu tanda DHCP tidak merespons." },
        { who:"👩‍💻", name:"Sari", text:"Lihat diagram jaringan di ruangan untuk konfigurasi IP yang benar ya. Range, gateway, DNS — semuanya ada di sana." }
      ]
    },

    items:{
      "lab-pc":{ icon:"💻", title:"30 Komputer Lab — No IP",
        status:"err", statusText:"169.254.x.x (APIPA)",
        body:"Semua 30 komputer mendapat IP:\n169.254.x.x — ini APIPA (Automatic Private IP Addressing)\n\nArtinya: TIDAK ADA DHCP server yang merespons!\nSiswa tidak bisa internetan atau ping antar PC.",
        theory:"DHCP (Dynamic Host Configuration Protocol) secara otomatis memberikan IP address, subnet mask, gateway, dan DNS ke setiap perangkat yang terhubung. Tanpa DHCP, setiap PC harus dikonfigurasi manual.",
        triggerTerm:false },
      "dhcp-status":{ icon:"🔴", title:"DHCP Server — Not Found",
        status:"err", statusText:"Service not installed",
        body:"Memeriksa DHCP service...\n$ systemctl status isc-dhcp-server\nUnit isc-dhcp-server.service could not be found.\n\nDHCP server belum pernah diinstall di server ini!",
        theory:"isc-dhcp-server adalah paket DHCP server paling populer di Linux. Setelah install, kita konfigurasi /etc/dhcp/dhcpd.conf: tentukan range IP, gateway, dan DNS yang akan dibagikan ke client.",
        triggerTerm:true },
      "net-diagram":{ icon:"🗺️", title:"Diagram Jaringan Lab — Petunjuk",
        status:"ok", statusText:"📋 Konfigurasi IP",
        body:"Konfigurasi jaringan lab:\n\nNetwork   : 192.168.10.0/24\nServer IP : 192.168.10.1\nDHCP Range: 192.168.10.100 – 192.168.10.200\nGateway   : 192.168.10.1\nDNS       : 8.8.8.8\nLease Time: 86400 detik",
        theory:"Subnet /24 = 256 IP tersedia (0-255). DHCP range 100-200 berarti max 100 client bisa dapat IP otomatis. Sisanya bisa digunakan untuk IP statis server/printer.",
        triggerTerm:false },
      "switch":{ icon:"🔀", title:"Network Switch 24 Port",
        status:"warn", statusText:"Aktif — no DHCP",
        body:"Switch 24-port beroperasi normal.\nSemua 30 PC terhubung melalui switch ini.\nLampu port: hijau berkedip ✓\n\nSwitch bukan masalahnya — DHCP server yang belum ada.",
        theory:"Switch bekerja di Layer 2 (Data Link Layer) dan menghubungkan perangkat dalam satu LAN. Switch TIDAK menyediakan IP — itu tugas DHCP server atau konfigurasi manual.",
        triggerTerm:false },
      "angry-note":{ icon:"📋", title:"Catatan Insiden dari Guru TIK",
        status:"warn", statusText:"Laporan masalah",
        body:"\"Sejak server diganti minggu lalu, lab tidak pernah bisa dapat IP otomatis. Saya sudah restart switch, restart router, tapi tetap sama. Sepertinya DHCP server tidak pernah dikonfigurasi ulang setelah migrasi.\"",
        theory:"",
        triggerTerm:false }
    },

    objectives:[
      { id:"install-dhcp",  text:"Install isc-dhcp-server",     cmd:"apt install isc-dhcp-server" },
      { id:"config-dhcp",   text:"Konfigurasi file DHCP",       cmd:"nano /etc/dhcp/dhcpd.conf" },
      { id:"restart-dhcp",  text:"Restart DHCP service",        cmd:"systemctl restart isc-dhcp-server" },
      { id:"install-dns",   text:"Install DNS (bind9)",          cmd:"apt install bind9" },
      { id:"check-dhcp",    text:"Verifikasi DHCP aktif",       cmd:"systemctl status isc-dhcp-server" }
    ],
    hints:[
      "Install DHCP: apt install isc-dhcp-server",
      "Konfigurasi: nano /etc/dhcp/dhcpd.conf (gunakan info dari diagram jaringan)",
      "Restart service: systemctl restart isc-dhcp-server"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 4 — Firewall & Security
  // ══════════════════════════════════════════
  {
    id:4, title:"Ada yang Mencoba Masuk!",
    mission:"Firewall & Keamanan Server",
    badge:"🛡️ Security Guardian",
    startScene:"lobby",

    scenes:{
      lobby:{
        type:"corridor", label:"🏢 Lobby — Alert Keamanan!",
        doorSign:"SERVER ROOM (DARURAT)",
        navLeft:false, navRight:false, navBack:false,
        chars:[{
          id:"pak-rudi", emoji:"😱", name:"Pak Rudi",
          x:"63%", y:"27%",
          bubble:"Server kita diserang sekarang!!"
        }],
        dialogOnEnter:"intro"
      },
      serverroom:{
        type:"serverroom", label:"🖥️ Ruang Server — ALERT",
        navLeft:false, navRight:false, navBack:true,
        chars:[{
          id:"sari", emoji:"👩‍💻", name:"Sari",
          x:"70%", y:"32%",
          bubble:"Firewall off! Ini bahaya!"
        }],
        objects:[
          { id:"alert-mon",  emoji:"🚨", label:"Monitor Alert",    x:"13%", y:"28%" },
          { id:"fw-status",  emoji:"🔥", label:"Firewall Status",  x:"36%", y:"33%" },
          { id:"auth-log",   emoji:"📋", label:"File Log Auth",    x:"52%", y:"40%" },
          { id:"hacker-map", emoji:"🌏", label:"IP Tracer",        x:"23%", y:"50%" },
          { id:"server-cpu", emoji:"😰", label:"Server Overload",  x:"63%", y:"36%" },
        ]
      }
    },

    dialogs:{
      intro:[
        { who:"😱", name:"Pak Rudi", text:"Darurat! Monitoring sistem baru kirim alert — ada percobaan brute force ke SSH kita. Sudah lebih dari seribu kali dalam 5 menit!" },
        { who:"😱", name:"Pak Rudi", text:"Yang paling parah: firewall kita belum aktif sama sekali! Semua port terbuka lebar. Ini sangat berbahaya!" },
        { who:"👩‍💻", name:"Sari", text:"Kita harus bergerak cepat sebelum penyerang berhasil masuk. Masuk ke server room, cek log untuk identifikasi IP penyerang, lalu aktifkan firewall!" },
        { who:"💡", name:"Tutorial", text:"Klik objek di ruangan untuk dapat informasi. Mulai dari monitor alert dan file log untuk tahu IP penyerang, lalu gunakan terminal." }
      ],
      sari_greet:[
        { who:"👩‍💻", name:"Sari", text:"Situasi kritis! UFW (firewall) belum aktif. Cek log auth dulu untuk tahu IP penyerang, lalu blokir dan aktifkan firewall." },
        { who:"👩‍💻", name:"Sari", text:"Urutan: cek log → aktifkan ufw → izinkan SSH → blokir IP jahat → verifikasi. Cepat!" }
      ]
    },

    items:{
      "alert-mon":{ icon:"🚨", title:"SECURITY ALERT — Serangan Aktif!",
        status:"err", statusText:"🔴 ONGOING ATTACK",
        body:"⚠️  INTRUSION DETECTION ALERT  ⚠️\nSource IP   : 45.33.32.156\nTarget      : Port 22 (SSH)\nAttack Type : Brute Force\nAttempts    : 1,247 dalam 5 menit!\nStatus      : ONGOING — belum berhasil",
        theory:"Brute Force Attack adalah teknik menyerang dengan mencoba ribuan kombinasi username/password secara otomatis. Tool seperti Hydra bisa mencoba ratusan password per detik.",
        triggerTerm:true },
      "fw-status":{ icon:"🔥", title:"UFW Firewall — INACTIVE!",
        status:"err", statusText:"Firewall OFF",
        body:"$ ufw status\nStatus: inactive\n\n⚠️ Firewall TIDAK aktif!\nSemua 65,535 port terbuka tanpa filter.\nSiapa pun bisa mencoba konek ke port apa pun.",
        theory:"UFW (Uncomplicated Firewall) adalah antarmuka mudah untuk mengelola iptables di Ubuntu. Dengan UFW, kita bisa allow/deny port atau IP tertentu dengan perintah sederhana.",
        triggerTerm:true },
      "auth-log":{ icon:"📋", title:"/var/log/auth.log — Penuh Serangan",
        status:"warn", statusText:"1,247 baris mencurigakan",
        body:"Jan 15 23:45:01 sshd: Failed password for root from 45.33.32.156\nJan 15 23:45:02 sshd: Failed password for admin from 45.33.32.156\nJan 15 23:45:03 sshd: Failed password for ubuntu from 45.33.32.156\n... (1,247 baris serupa!)\n\nIP Penyerang: 45.33.32.156",
        theory:"Log /var/log/auth.log mencatat semua aktivitas autentikasi. Menganalisis log ini adalah langkah pertama investigasi keamanan. Perintah: cat /var/log/auth.log atau grep 'Failed' /var/log/auth.log",
        triggerTerm:true },
      "hacker-map":{ icon:"🌏", title:"IP Tracer — Lokasi Penyerang",
        status:"err", statusText:"IP asing teridentifikasi",
        body:"Hasil trace IP 45.33.32.156:\nNegara  : Unknown (VPN/Proxy)\nISP     : DigitalOcean LLC\nType    : Datacenter/Hosting\n\nIP ini milik server VPS sewaan yang digunakan sebagai platform serangan.",
        theory:"Penyerang sering menggunakan VPS (Virtual Private Server) sewaan atau VPN untuk menyembunyikan identitas asli. Walau demikian, kita tetap bisa blokir IP-nya.",
        triggerTerm:false },
      "server-cpu":{ icon:"😰", title:"Server — CPU Tinggi Akibat Serangan",
        status:"warn", statusText:"CPU 87%",
        body:"CPU Usage : 87% (tidak normal!)\nPenyebab  : memproses 249 koneksi SSH/menit\nMemori    : normal\nDisk I/O  : normal\n\nServer mulai melambat. Blokir serangan sekarang!",
        theory:"",
        triggerTerm:false }
    },

    objectives:[
      { id:"check-log",      text:"Cek log serangan auth",      cmd:"cat /var/log/auth.log" },
      { id:"enable-ufw",     text:"Aktifkan UFW firewall",      cmd:"ufw enable" },
      { id:"allow-ssh",      text:"Izinkan SSH yang sah",       cmd:"ufw allow ssh" },
      { id:"block-attacker", text:"Blokir IP penyerang",        cmd:"ufw deny from 45.33.32.156" },
      { id:"check-ufw",      text:"Verifikasi aturan firewall", cmd:"ufw status" }
    ],
    hints:[
      "Cek log: cat /var/log/auth.log — cari IP yang sering muncul",
      "Aktifkan firewall: ufw enable, lalu izinkan SSH: ufw allow ssh",
      "Blokir penyerang: ufw deny from 45.33.32.156"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 5 — BOSS LEVEL
  // ══════════════════════════════════════════
  {
    id:5, title:"BOSS: Malam Sebelum Ujian!",
    mission:"Emergency — Server Down Total!",
    badge:"🏆 NetAdmin Hero",
    startScene:"lobby",

    scenes:{
      lobby:{
        type:"corridor", label:"🏫 Sekolah — Malam Darurat",
        doorSign:"SERVER ROOM (MATI TOTAL)",
        navLeft:false, navRight:false, navBack:false,
        chars:[{
          id:"multi-char", emoji:"😭", name:"Kepala Sekolah",
          x:"60%", y:"25%",
          bubble:"Server mati! Ujian nasional 30 menit lagi!!"
        }],
        dialogOnEnter:"intro"
      },
      serverroom:{
        type:"serverroom", label:"🖥️ Ruang Server — BLACKOUT",
        navLeft:false, navRight:false, navBack:true,
        chars:[{
          id:"pak-rudi", emoji:"🤦", name:"Pak Rudi",
          x:"69%", y:"30%",
          bubble:"Semua service mati sekaligus!"
        }],
        objects:[
          { id:"dead-server",    emoji:"💀", label:"Server Down",      x:"14%", y:"28%" },
          { id:"err-monitor",    emoji:"🖥",  label:"Error Monitor",   x:"36%", y:"32%" },
          { id:"network-err",    emoji:"🔌",  label:"Network Error",   x:"52%", y:"40%" },
          { id:"recovery-guide", emoji:"📗",  label:"Recovery Guide",  x:"22%", y:"50%" },
          { id:"countdown",      emoji:"⏰",  label:"Countdown Ujian", x:"62%", y:"35%" },
        ]
      }
    },

    dialogs:{
      intro:[
        { who:"😭", name:"Kepala Sekolah", text:"TOLONG! Server sekolah mati total! Ujian online nasional dimulai 30 menit lagi! 500 siswa tidak bisa login ke platform ujian!" },
        { who:"😭", name:"Kepala Sekolah", text:"Tim IT kami sedang di luar kota untuk acara. Kamu satu-satunya yang bisa kami hubungi malam ini!" },
        { who:"🤦", name:"Pak Rudi", text:"Aku sudah cek sebentar — sepertinya ada serangan semalam yang bikin semua service mati sekaligus. Network, Apache, SSH, firewall — semua down." },
        { who:"🤦", name:"Pak Rudi", text:"Kamu harus pakai SEMUA skill yang sudah dipelajari dari level 1 sampai 4. Ada recovery guide di dalam. Masuk dan selamatkan ujian nasional ini! 🔥" }
      ],
      rudi_greet:[
        { who:"🤦", name:"Pak Rudi", text:"Kerusakannya parah tapi bisa diperbaiki. Urutan yang benar: network dulu, baru services satu per satu." },
        { who:"🤦", name:"Pak Rudi", text:"Cek recovery guide di ruangan — ada checklist urutannya. Kita punya waktu 30 menit. Mulai sekarang!" }
      ]
    },

    items:{
      "dead-server":{ icon:"💀", title:"Server — CRITICAL FAILURE",
        status:"err", statusText:"ALL SERVICES DEAD",
        body:"Status semua service:\napache2.service      : FAILED ❌\nssh.service          : INACTIVE ❌\nnetworking.service   : ERROR ❌\nisc-dhcp-server      : STOPPED ❌\nufw.service          : INACTIVE ❌\n\nUptime: 0 detik",
        theory:"Saat troubleshooting sistem yang benar-benar mati: selalu mulai dari layer paling bawah. Network → system services → application. Jika network mati, service lain tidak bisa komunikasi.",
        triggerTerm:true },
      "err-monitor":{ icon:"🖥", title:"Monitor — Error Cascade",
        status:"err", statusText:"System crash log",
        body:"Kernel log terakhir:\n[PANIC] Network interface down\n[ERROR] apache2: bind() failed\n[ERROR] sshd: cannot bind to port 22\n[CRITICAL] DHCP server halted\n\nSemua error disebabkan network down pertama kali.",
        theory:"Error cascade: satu kegagalan memicu kegagalan lain. Itu mengapa urutan perbaikan penting — fix root cause (network) dulu, baru bisa fix service yang bergantung padanya.",
        triggerTerm:false },
      "network-err":{ icon:"🔌", title:"Network Interface — DOWN",
        status:"err", statusText:"eth0: DOWN",
        body:"$ ip addr\neth0: <BROADCAST,MULTICAST> mtu 1500\nState: DOWN — tidak ada IP!\n\nIni root cause utama. Semua service mati karena network interface down.\nHarus restart networking service pertama kali!",
        theory:"",
        triggerTerm:true },
      "recovery-guide":{ icon:"📗", title:"Emergency Recovery Guide",
        status:"ok", statusText:"📋 Urutan Pemulihan",
        body:"EMERGENCY RECOVERY — Urutan Benar:\n\n1. systemctl restart networking\n2. systemctl restart apache2\n3. systemctl restart ssh\n4. ufw status verbose\n5. systemctl list-units --state=running\n\nJANGAN skip urutannya!",
        theory:"Emergency recovery membutuhkan urutan yang tepat karena service saling bergantung. Network harus berjalan sebelum service lain bisa start, karena mereka perlu bind ke interface jaringan.",
        triggerTerm:true },
      "countdown":{ icon:"⏰", title:"30 MENIT TERSISA!",
        status:"err", statusText:"⏰ Waktu terus berjalan",
        body:"Ujian nasional mulai dalam: 30 MENIT\nJumlah siswa menunggu: 500 orang\nGuru sudah siap di lab: 25 lab\nWartawan sudah di lokasi: 3 media\n\nKamu adalah satu-satunya harapan. Go!!",
        theory:"",
        triggerTerm:false }
    },

    objectives:[
      { id:"restart-net",  text:"Pulihkan network interface",  cmd:"systemctl restart networking" },
      { id:"restart-web",  text:"Restart web server",          cmd:"systemctl restart apache2" },
      { id:"restart-ssh",  text:"Restart SSH service",         cmd:"systemctl restart ssh" },
      { id:"check-fw",     text:"Cek firewall tidak block",    cmd:"ufw status verbose" },
      { id:"verify-all",   text:"Verifikasi semua service",    cmd:"systemctl list-units --state=running" }
    ],
    hints:[
      "Mulai dari network: systemctl restart networking",
      "Lanjut services: systemctl restart apache2 dan systemctl restart ssh",
      "Verifikasi semua: systemctl list-units --state=running"
    ]
  }
];
