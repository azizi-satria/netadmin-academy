// ════════════════════════════════════════════
// LEVEL DATA — NetAdmin Academy
// ════════════════════════════════════════════
// posX: 0.0 (kiri penuh) → 1.0 (kanan penuh)
// posY: persentase dari atas layar

const LEVELS = [
  // ══════════════════════════════════════════
  // LEVEL 1 — Instalasi & Konfigurasi Dasar
  // ══════════════════════════════════════════
  {
    id: 1,
    title: "Server Baru, Mulai dari Nol",
    mission: "Konfigurasi Dasar Server",
    badge: "🔧 System Builder",
    bgColor: "radial-gradient(ellipse at 30% 40%, #0d1a2e 0%, #06060f 70%)",
    ambientColor: "rgba(6,182,212,0.06)",

    objects: [
      {
        id: "server-box",
        emoji: "📦", label: "Kotak Server",
        posX: 0.06, posY: 0.28,
        inspect: {
          icon: "📦", title: "Kotak Server Dell PowerEdge",
          status: "warn", statusText: "Belum dikonfigurasi",
          body: "Server Dell PowerEdge R720. Instalasi Ubuntu Server 22.04 sudah selesai.\nPerlu dikonfigurasi sebelum bisa digunakan.",
          theory: "Server adalah komputer yang menyediakan layanan untuk komputer lain dalam jaringan. Server membutuhkan OS (Operating System) khusus seperti Ubuntu Server yang ringan dan stabil.",
          triggerTerminal: false
        }
      },
      {
        id: "monitor-black",
        emoji: "🖥", label: "Monitor Server",
        posX: 0.22, posY: 0.22,
        inspect: {
          icon: "🖥", title: "Monitor — Terminal Aktif",
          status: "warn", statusText: "Perlu konfigurasi",
          body: "Terminal Ubuntu Server siap digunakan.\nLogin: root\nTugas pertama: cek IP address, set hostname, update sistem, dan aktifkan SSH.",
          theory: "SSH (Secure Shell) adalah protokol untuk mengakses server dari jarak jauh secara aman. Port default SSH adalah 22.",
          triggerTerminal: true
        }
      },
      {
        id: "usb-drive",
        emoji: "💾", label: "USB Bootable",
        posX: 0.40, posY: 0.45,
        inspect: {
          icon: "💾", title: "USB Flash Drive — Ubuntu 22.04",
          status: "ok", statusText: "Instalasi selesai",
          body: "USB berisi Ubuntu Server 22.04 LTS. Proses instalasi OS sudah selesai!\nSistem sudah bisa diakses via terminal.",
          theory: "Ubuntu Server adalah distribusi Linux yang populer untuk server karena ringan, stabil, dan banyak dukungan komunitas.",
          triggerTerminal: false
        }
      },
      {
        id: "sticky-note",
        emoji: "📝", label: "Catatan Pak Rudi",
        posX: 0.58, posY: 0.50,
        inspect: {
          icon: "📝", title: "Catatan — Checklist Konfigurasi",
          status: "ok", statusText: "📋 Petunjuk",
          body: "Checklist dari Pak Rudi:\n• ip addr → cek IP address\n• hostnamectl set-hostname netville-server\n• apt update → update sistem\n• systemctl enable ssh → aktifkan SSH\n• systemctl status ssh → verifikasi",
          theory: "",
          triggerTerminal: false
        }
      },
      {
        id: "router",
        emoji: "📡", label: "Router Jaringan",
        posX: 0.76, posY: 0.30,
        inspect: {
          icon: "📡", title: "Router — Jaringan Aktif",
          status: "ok", statusText: "Online",
          body: "Router terhubung ke internet.\nIP Gateway: 192.168.1.1\nServer perlu dikonfigurasi agar bisa berkomunikasi melalui router ini.",
          theory: "Router adalah perangkat yang menghubungkan jaringan lokal (LAN) ke internet (WAN) dan mengatur lalu lintas data antar jaringan.",
          triggerTerminal: false
        }
      },
      {
        id: "calendar",
        emoji: "📅", label: "Deadline!",
        posX: 0.90, posY: 0.35,
        inspect: {
          icon: "📅", title: "Deadline Hari Ini!",
          status: "err", statusText: "🚨 Urgent",
          body: "Pak Rudi meninggalkan catatan:\n\"Server harus online dan bisa diakses via SSH sebelum jam 5 sore hari ini. Klien akan mulai menggunakan server besok pagi!\"",
          theory: "",
          triggerTerminal: false
        }
      }
    ],

    dialogs: [
      { avatar:"👨‍💼", name:"Pak Rudi", text:"Selamat datang di Netville IT Solutions! Kamu adalah junior sysadmin baru kami. Senang bertemu denganmu!" },
      { avatar:"👨‍💼", name:"Pak Rudi", text:"Server baru perusahaan baru tiba hari ini. Instalasi Ubuntu Server sudah beres. Sekarang tugasmu mengkonfigurasi dasarnya." },
      { avatar:"👩‍💻", name:"Sari", text:"Hei! Aku Sari, senior admin di sini. Jelajahi ruangan dulu — geser kiri/kanan — klik objek untuk dapat info. Ada catatan petunjuk di meja! 👀" }
    ],

    objectives: [
      { id:"check-ip",      text:"Cek IP address server",        cmd:"ip addr" },
      { id:"set-hostname",  text:"Set hostname server",           cmd:"hostnamectl set-hostname netville-server" },
      { id:"update-system", text:"Update sistem (apt update)",    cmd:"apt update" },
      { id:"enable-ssh",    text:"Aktifkan SSH service",          cmd:"systemctl enable ssh" },
      { id:"check-ssh",     text:"Verifikasi SSH berjalan",       cmd:"systemctl status ssh" }
    ],

    hints: [
      "Coba ketik 'ip addr' di terminal untuk cek IP address.",
      "Untuk set hostname: hostnamectl set-hostname netville-server",
      "Aktifkan SSH dengan: systemctl enable ssh && systemctl start ssh"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 2 — Apache Web Server
  // ══════════════════════════════════════════
  {
    id: 2,
    title: "Website Sekolah Harus Hidup!",
    mission: "Setup Apache Web Server",
    badge: "🌐 Web Master",
    bgColor: "radial-gradient(ellipse at 50% 30%, #0a1f0a 0%, #06060f 70%)",
    ambientColor: "rgba(16,185,129,0.05)",

    objects: [
      {
        id: "server-running",
        emoji: "🖥️", label: "Server Ubuntu",
        posX: 0.08, posY: 0.25,
        inspect: {
          icon: "🖥️", title: "Server Ubuntu — Apache Belum Ada",
          status: "warn", statusText: "Apache not found",
          body: "Server berjalan normal.\nOS: Ubuntu Server 22.04 LTS\nApache2: NOT INSTALLED ❌\n\nWeb server perlu diinstall agar website bisa diakses.",
          theory: "Apache HTTP Server adalah web server open-source paling populer di dunia. Fungsinya: menerima request dari browser dan mengirimkan halaman web sebagai respons.",
          triggerTerminal: true
        }
      },
      {
        id: "browser-error",
        emoji: "🌐", label: "Browser Error",
        posX: 0.28, posY: 0.20,
        inspect: {
          icon: "🌐", title: "Browser — ERR_CONNECTION_REFUSED",
          status: "err", statusText: "Cannot connect",
          body: "Mencoba akses: http://192.168.1.100\nError: ERR_CONNECTION_REFUSED\n\nTidak ada service yang mendengarkan di port 80.\nApache perlu diinstall dan dijalankan.",
          theory: "Port 80 adalah port default untuk HTTP (web). Browser mengirim request ke port 80, lalu web server (Apache/Nginx) merespons dengan halaman HTML.",
          triggerTerminal: false
        }
      },
      {
        id: "phone-kepala",
        emoji: "📱", label: "Pesan Darurat",
        posX: 0.50, posY: 0.35,
        inspect: {
          icon: "📱", title: "Pesan dari Bu Kepala Sekolah",
          status: "err", statusText: "🚨 URGENT!",
          body: "\"Halo! Website pendaftaran siswa baru tidak bisa dibuka! DEADLINE 2 JAM LAGI. Ada 200 calon siswa yang menunggu. Tolong segera!!!\" 😤",
          theory: "",
          triggerTerminal: false
        }
      },
      {
        id: "html-folder",
        emoji: "📁", label: "File Website",
        posX: 0.68, posY: 0.45,
        inspect: {
          icon: "📁", title: "/var/www/html — File Siap",
          status: "ok", statusText: "File tersedia",
          body: "Folder web root sudah berisi:\n✓ index.html\n✓ style.css\n✓ images/\n\nTinggal aktifkan Apache-nya dan website langsung online!",
          theory: "Document root Apache defaultnya di /var/www/html/. Semua file di folder ini bisa diakses via browser setelah Apache aktif.",
          triggerTerminal: true
        }
      },
      {
        id: "network-cable",
        emoji: "🔌", label: "Kabel Jaringan",
        posX: 0.84, posY: 0.32,
        inspect: {
          icon: "🔌", title: "Kabel Ethernet — Terhubung",
          status: "ok", statusText: "Link up",
          body: "Koneksi jaringan aktif.\nSpeed: 1Gbps\nStatus: UP\n\nServer sudah terhubung ke jaringan, tinggal aktifkan layanannya.",
          theory: "",
          triggerTerminal: false
        }
      }
    ],

    dialogs: [
      { avatar:"👩‍💻", name:"Sari", text:"Ada situasi darurat! Website sekolah mitra kita down total. Bu Kepala Sekolah sudah panik telepon-telepon!" },
      { avatar:"👩‍💻", name:"Sari", text:"Ternyata Apache web server belum pernah diinstall! File website sudah ada di /var/www/html, tapi tidak ada yang 'serving'-nya ke browser." },
      { avatar:"👨‍💼", name:"Pak Rudi", text:"Tugasmu: install Apache, jalankan servicenya, dan pastikan website bisa dibuka. Deadline 2 jam! Kami andalkan kamu. 💪" }
    ],

    objectives: [
      { id:"install-apache", text:"Install Apache2",             cmd:"apt install apache2" },
      { id:"start-apache",   text:"Jalankan Apache service",     cmd:"systemctl start apache2" },
      { id:"enable-apache",  text:"Enable Apache saat boot",     cmd:"systemctl enable apache2" },
      { id:"check-apache",   text:"Cek status Apache",           cmd:"systemctl status apache2" },
      { id:"test-website",   text:"Test website (curl)",         cmd:"curl http://localhost" }
    ],

    hints: [
      "Install Apache dengan: apt install apache2",
      "Jalankan Apache: systemctl start apache2",
      "Test apakah website bisa diakses: curl http://localhost"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 3 — DHCP & DNS
  // ══════════════════════════════════════════
  {
    id: 3,
    title: "Semua Komputer Tidak Dapat IP!",
    mission: "Konfigurasi DHCP & DNS Server",
    badge: "🔌 Network Architect",
    bgColor: "radial-gradient(ellipse at 70% 50%, #1a0f0a 0%, #06060f 70%)",
    ambientColor: "rgba(245,158,11,0.04)",

    objects: [
      {
        id: "lab-computers",
        emoji: "💻", label: "30 Komputer Lab",
        posX: 0.07, posY: 0.28,
        inspect: {
          icon: "💻", title: "Lab Komputer — No IP!",
          status: "err", statusText: "169.254.x.x (APIPA)",
          body: "30 komputer di lab tidak bisa dapat IP address.\nSemua menampilkan: 169.254.x.x\n\nIni berarti tidak ada DHCP server yang merespons!\nPraktikum terhenti total.",
          theory: "DHCP (Dynamic Host Configuration Protocol) adalah protokol yang secara otomatis memberikan konfigurasi IP kepada perangkat yang terhubung ke jaringan. Tanpa DHCP, setiap komputer harus dikonfigurasi manual.",
          triggerTerminal: false
        }
      },
      {
        id: "dhcp-status",
        emoji: "🔴", label: "DHCP Server",
        posX: 0.26, posY: 0.22,
        inspect: {
          icon: "🔴", title: "DHCP Server — Not Found!",
          status: "err", statusText: "Not installed",
          body: "$ systemctl status isc-dhcp-server\nUnit isc-dhcp-server.service could not be found.\n\nDHCP server belum terinstall!\nPerlu install isc-dhcp-server.",
          theory: "isc-dhcp-server adalah paket DHCP server paling umum di Linux. Setelah install, perlu dikonfigurasi: range IP, gateway, dan DNS yang akan dibagikan ke client.",
          triggerTerminal: true
        }
      },
      {
        id: "angry-teacher",
        emoji: "😤", label: "Pak Guru TIK",
        posX: 0.48, posY: 0.30,
        inspect: {
          icon: "😤", title: "Pak Guru TIK — Marah!",
          status: "err", statusText: "Menunggu solusi",
          body: "\"Lab komputer tidak bisa dipakai! Siswa kelas XI TKJ mau praktikum jaringan tapi internet mati semua. Ini sudah 1 JAM! Kapan beres?!\"",
          theory: "",
          triggerTerminal: false
        }
      },
      {
        id: "network-diagram",
        emoji: "🗺️", label: "Diagram Jaringan",
        posX: 0.66, posY: 0.42,
        inspect: {
          icon: "🗺️", title: "Diagram Jaringan Lab — Petunjuk IP",
          status: "ok", statusText: "📋 Konfigurasi",
          body: "Network  : 192.168.10.0/24\nServer IP: 192.168.10.1\nDHCP Range: 192.168.10.100–200\nGateway  : 192.168.10.1\nDNS      : 8.8.8.8\nLease    : 86400 detik",
          theory: "Subnet /24 berarti 256 alamat IP tersedia (192.168.10.0–255). Range DHCP menentukan IP mana yang boleh dibagikan secara otomatis.",
          triggerTerminal: false
        }
      },
      {
        id: "switch",
        emoji: "🔀", label: "Network Switch",
        posX: 0.84, posY: 0.28,
        inspect: {
          icon: "🔀", title: "Network Switch — 24 Port",
          status: "warn", statusText: "Aktif tapi no DHCP",
          body: "Switch 24 port aktif.\nSemua komputer lab terhubung melalui switch ini.\nSwitch normal — masalahnya di DHCP server yang belum ada.",
          theory: "Switch bekerja di Layer 2 (Data Link) dan menghubungkan perangkat dalam satu LAN. Switch tidak menyediakan IP — itu tugas DHCP server.",
          triggerTerminal: false
        }
      }
    ],

    dialogs: [
      { avatar:"👨‍💼", name:"Pak Rudi", text:"Pak Guru TIK baru telepon! Lab komputer chaos — 30 PC tidak bisa dapat IP. Semua praktikum terhenti!" },
      { avatar:"👩‍💻", name:"Sari", text:"DHCP server belum ada di jaringan itu. Kita perlu install isc-dhcp-server dan konfigurasi range IP-nya. Cek diagram jaringan di dinding dulu!" },
      { avatar:"👨‍💼", name:"Pak Rudi", text:"Setelah DHCP beres, install juga bind9 untuk DNS. Guru TIK tidak sabar. Cepat!" }
    ],

    objectives: [
      { id:"install-dhcp",  text:"Install isc-dhcp-server",      cmd:"apt install isc-dhcp-server" },
      { id:"config-dhcp",   text:"Konfigurasi file DHCP",        cmd:"nano /etc/dhcp/dhcpd.conf" },
      { id:"restart-dhcp",  text:"Restart DHCP service",         cmd:"systemctl restart isc-dhcp-server" },
      { id:"install-dns",   text:"Install bind9 (DNS)",          cmd:"apt install bind9" },
      { id:"check-dhcp",    text:"Verifikasi DHCP aktif",        cmd:"systemctl status isc-dhcp-server" }
    ],

    hints: [
      "Install DHCP server: apt install isc-dhcp-server",
      "Edit konfigurasi: nano /etc/dhcp/dhcpd.conf — isi sesuai diagram jaringan",
      "Restart service: systemctl restart isc-dhcp-server"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 4 — Firewall & Security
  // ══════════════════════════════════════════
  {
    id: 4,
    title: "Ada yang Mencoba Masuk!",
    mission: "Firewall & Keamanan Server",
    badge: "🛡️ Security Guardian",
    bgColor: "radial-gradient(ellipse at 50% 50%, #1a0505 0%, #06060f 70%)",
    ambientColor: "rgba(239,68,68,0.06)",

    objects: [
      {
        id: "alert-screen",
        emoji: "🚨", label: "Security Alert!",
        posX: 0.05, posY: 0.18,
        inspect: {
          icon: "🚨", title: "INTRUSION DETECTED!",
          status: "err", statusText: "🔴 SERANGAN AKTIF",
          body: "⚠️ SECURITY ALERT ⚠️\nIP Penyerang: 45.33.32.156\nTarget: Port 22 (SSH)\nJenis: Brute Force Attack\nPercobaan: 1.247x dalam 5 menit!\nStatus: ONGOING",
          theory: "Brute Force Attack adalah teknik menyerang dengan mencoba ribuan kombinasi username/password secara otomatis. Firewall dapat memblokir IP yang mencurigakan.",
          triggerTerminal: true
        }
      },
      {
        id: "firewall-off",
        emoji: "🔥", label: "Firewall (OFF)",
        posX: 0.26, posY: 0.25,
        inspect: {
          icon: "🔥", title: "UFW Firewall — INACTIVE!",
          status: "err", statusText: "Firewall OFF",
          body: "$ ufw status\nStatus: inactive\n\nFirewall tidak aktif!\nSemua port terbuka tanpa filter.\nServer sangat rentan diserang saat ini.",
          theory: "UFW (Uncomplicated Firewall) adalah tool manajemen firewall di Ubuntu. UFW memudahkan konfigurasi iptables untuk mengontrol traffic masuk dan keluar.",
          triggerTerminal: true
        }
      },
      {
        id: "hacker-icon",
        emoji: "🦹", label: "IP Mencurigakan",
        posX: 0.48, posY: 0.32,
        inspect: {
          icon: "🦹", title: "Aktivitas Mencurigakan",
          status: "err", statusText: "⚠️ THREAT",
          body: "IP 45.33.32.156 terus mencoba login SSH dengan berbagai kombinasi username dan password.\n\nIni serangan Brute Force klasik!\nHarus diblokir sebelum berhasil masuk ke server.",
          theory: "Untuk melindungi dari brute force: aktifkan firewall, blokir IP mencurigakan, dan pertimbangkan mengubah port SSH dari 22 ke port lain.",
          triggerTerminal: false
        }
      },
      {
        id: "auth-log",
        emoji: "📋", label: "File Auth Log",
        posX: 0.67, posY: 0.40,
        inspect: {
          icon: "📋", title: "/var/log/auth.log — Penuh Serangan",
          status: "warn", statusText: "Mencurigakan",
          body: "sshd: Failed password for root from 45.33.32.156\nsshd: Failed password for admin from 45.33.32.156\nsshd: Failed password for ubuntu from 45.33.32.156\n... (1.247 baris serupa!)\n\nGunakan: cat /var/log/auth.log",
          theory: "Log auth.log menyimpan semua aktivitas autentikasi di server Linux. Menganalisis log ini penting untuk mendeteksi serangan dan aktivitas mencurigakan.",
          triggerTerminal: true
        }
      },
      {
        id: "server-stressed",
        emoji: "😰", label: "Server Terancam",
        posX: 0.85, posY: 0.25,
        inspect: {
          icon: "😰", title: "Server — Dalam Ancaman!",
          status: "err", statusText: "High CPU usage",
          body: "CPU usage: 89% (akibat serangan!)\nSSH attempts/min: 249\nServer mulai melambat karena memproses ribuan percobaan login.\n\nSegera amankan sekarang!",
          theory: "",
          triggerTerminal: false
        }
      }
    ],

    dialogs: [
      { avatar:"👨‍💼", name:"Pak Rudi", text:"DARURAT! Sistem monitoring mendeteksi serangan aktif ke server kita! Ada yang terus brute force SSH kita!" },
      { avatar:"👩‍💻", name:"Sari", text:"Firewall sama sekali belum aktif! Kamu harus: cek log untuk tahu IP penyerang, aktifkan UFW, lalu blokir IP tersebut!" },
      { avatar:"👨‍💼", name:"Pak Rudi", text:"Setiap detik penting. Kalau berhasil masuk, data seluruh klien kita bisa bocor. Lindungi server kita sekarang!" }
    ],

    objectives: [
      { id:"check-log",      text:"Cek log serangan",            cmd:"cat /var/log/auth.log" },
      { id:"enable-ufw",     text:"Aktifkan UFW firewall",       cmd:"ufw enable" },
      { id:"allow-ssh",      text:"Izinkan koneksi SSH sah",     cmd:"ufw allow ssh" },
      { id:"block-attacker", text:"Blokir IP penyerang",         cmd:"ufw deny from 45.33.32.156" },
      { id:"check-ufw",      text:"Verifikasi aturan firewall",  cmd:"ufw status" }
    ],

    hints: [
      "Cek log dulu: cat /var/log/auth.log — cari IP yang sering muncul",
      "Aktifkan firewall: ufw enable, lalu izinkan SSH: ufw allow ssh",
      "Blokir penyerang: ufw deny from 45.33.32.156"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 5 — BOSS LEVEL
  // ══════════════════════════════════════════
  {
    id: 5,
    title: "BOSS: Malam Sebelum Ujian!",
    mission: "Troubleshooting Total — Server Down!",
    badge: "🏆 NetAdmin Hero",
    bgColor: "radial-gradient(ellipse at 50% 50%, #050520 0%, #020208 80%)",
    ambientColor: "rgba(124,58,237,0.08)",

    objects: [
      {
        id: "server-dead",
        emoji: "💀", label: "Server DOWN!",
        posX: 0.07, posY: 0.20,
        inspect: {
          icon: "💀", title: "CRITICAL — SERVER DOWN TOTAL!",
          status: "err", statusText: "🔴 ALL SERVICES FAILED",
          body: "apache2 .service    : FAILED ❌\nssh.service         : INACTIVE ❌\nnetworking          : ERROR ❌\nisc-dhcp-server     : STOPPED ❌\nufw.service         : INACTIVE ❌\n\nUptime: 0 detik",
          theory: "Saat troubleshooting server down, mulai dari layer paling bawah: network → system services → application services.",
          triggerTerminal: true
        }
      },
      {
        id: "crying-principal",
        emoji: "😭", label: "Kepala Sekolah",
        posX: 0.25, posY: 0.25,
        inspect: {
          icon: "😭", title: "Kepala Sekolah — PANIK!",
          status: "err", statusText: "🆘 SOS!",
          body: "\"TOLONG!! Ujian online nasional mulai 30 MENIT LAGI! 500 siswa tidak bisa login ke sistem ujian! Ini menyangkut masa depan anak-anak!! HELP!!!\"",
          theory: "",
          triggerTerminal: false
        }
      },
      {
        id: "news-screen",
        emoji: "📰", label: "Breaking News",
        posX: 0.45, posY: 0.30,
        inspect: {
          icon: "📰", title: "Breaking News — Berita Darurat",
          status: "warn", statusText: "Reputasi taruhan!",
          body: "\"SERVER SEKOLAH LUMPUH MENJELANG UJIAN NASIONAL\"\n\nDiduga akibat serangan siber dan miskonfigurasi sistem. Identitas teknisi sedang diselidiki...\n\n⚠️ Nama kamu bisa masuk koran kalau tidak segera beres!",
          theory: "",
          triggerTerminal: false
        }
      },
      {
        id: "emergency-guide",
        emoji: "✅", label: "Emergency Guide",
        posX: 0.64, posY: 0.38,
        inspect: {
          icon: "✅", title: "Emergency Recovery Guide",
          status: "ok", statusText: "📋 Panduan Pemulihan",
          body: "Urutan recovery yang benar:\n1. systemctl restart networking\n2. systemctl restart apache2\n3. systemctl restart ssh\n4. ufw status verbose\n5. systemctl list-units --state=running",
          theory: "Dalam emergency recovery: selalu mulai dari layer jaringan (networking), baru lanjut ke aplikasi (apache, ssh). Jika network tidak beres, service lain tidak akan bisa komunikasi.",
          triggerTerminal: true
        }
      },
      {
        id: "countdown",
        emoji: "⏰", label: "Countdown!",
        posX: 0.83, posY: 0.22,
        inspect: {
          icon: "⏰", title: "30 MENIT TERSISA!",
          status: "err", statusText: "Waktu habis!",
          body: "Ujian nasional dimulai dalam 30 menit.\n500 siswa menunggu.\nSemua guru sudah di lab.\n\nKamu adalah satu-satunya harapan. Tidak ada waktu untuk panik — action sekarang!",
          theory: "",
          triggerTerminal: false
        }
      }
    ],

    dialogs: [
      { avatar:"👨‍💼", name:"Pak Rudi", text:"INI DARURAT LEVEL MERAH!! Server sekolah mati total malam sebelum ujian nasional. Tim senior tidak bisa dihubungi!" },
      { avatar:"👩‍💻", name:"Sari", text:"Kamu satu-satunya yang bisa menyelesaikan ini. Pakai semua skill dari level 1 sampai 4. Ada emergency guide di ruangan — cari dulu!" },
      { avatar:"👨‍💼", name:"Pak Rudi", text:"30 menit. Mulai dari jaringan dulu, baru services. Kami percaya kamu bisa! 🔥 Ini saatnya jadi NetAdmin Hero!" }
    ],

    objectives: [
      { id:"restart-network", text:"Pulihkan network",           cmd:"systemctl restart networking" },
      { id:"restart-apache2", text:"Restart web server",         cmd:"systemctl restart apache2" },
      { id:"restart-ssh2",    text:"Restart SSH service",        cmd:"systemctl restart ssh" },
      { id:"check-ufw2",      text:"Cek firewall tidak block",   cmd:"ufw status verbose" },
      { id:"test-all",        text:"Verifikasi semua service",   cmd:"systemctl list-units --state=running" }
    ],

    hints: [
      "Mulai dari jaringan: systemctl restart networking",
      "Lanjut services: systemctl restart apache2 && systemctl restart ssh",
      "Cek semua: systemctl list-units --state=running"
    ]
  }
];
