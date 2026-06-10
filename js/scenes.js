// ============================================
// DATA LEVEL & SCENE — NetAdmin Academy
// ============================================

const LEVELS = [
  {
    id: 1,
    title: "Server Baru, Mulai dari Nol",
    mission: "Instalasi & Konfigurasi Dasar",
    badge: "🔧 System Builder",
    scene: {
      bg: "radial-gradient(ellipse at 30% 50%, #0d1a2e 0%, #0a0a0f 70%)",
      objects: [
        {
          id: "server-box",
          emoji: "📦",
          label: "Kotak Server",
          x: "12%", y: "28%",
          inspect: {
            title: "📦 Kotak Server Baru",
            body: "Server Dell PowerEdge R720. Baru tiba hari ini! Masih dalam kemasan.\nPerlu di-install OS Ubuntu Server 22.04 LTS.",
            status: "warn",
            statusText: "Belum diinstall"
          }
        },
        {
          id: "server-rack",
          emoji: "🖥️",
          label: "Server Rack",
          x: "38%", y: "18%",
          inspect: {
            title: "🖥️ Server Rack",
            body: "Rak server sudah terpasang. Server sudah terhubung ke listrik dan jaringan.\nSiap untuk proses instalasi OS.",
            status: "warn",
            statusText: "Menunggu OS"
          }
        },
        {
          id: "monitor",
          emoji: "🖥",
          label: "Monitor",
          x: "60%", y: "25%",
          inspect: {
            title: "🖥 Monitor Instalasi",
            body: "Layar hitam. Proses instalasi Ubuntu Server selesai.\nServer sudah bisa diakses via terminal.\nLogin: root",
            status: "warn",
            statusText: "Perlu konfigurasi"
          }
        },
        {
          id: "usb-flash",
          emoji: "💾",
          label: "USB Bootable",
          x: "76%", y: "42%",
          inspect: {
            title: "💾 USB Bootable",
            body: "USB Flash Drive berisi Ubuntu Server 22.04 LTS.\nInstalasi OS sudah selesai!\nSaatnya konfigurasi sistem.",
            status: "ok",
            statusText: "Instalasi selesai"
          }
        },
        {
          id: "sticky-note",
          emoji: "📝",
          label: "Catatan Pak Rudi",
          x: "22%", y: "52%",
          inspect: {
            title: "📝 Catatan dari Pak Rudi",
            body: "Checklist konfigurasi server:\n• Cek IP address: ip addr\n• Set hostname: hostnamectl set-hostname netville-server\n• Update sistem: apt update\n• Aktifkan SSH: systemctl enable ssh\n• Cek status SSH: systemctl status ssh",
            status: "ok",
            statusText: "📋 Petunjuk"
          }
        }
      ]
    },
    dialogs: [
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Selamat datang di Netville IT Solutions! Kamu adalah junior admin baru kami. Senang bertemu denganmu!"
      },
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Server baru perusahaan baru tiba hari ini. Instalasi OS sudah selesai. Sekarang tugasmu: konfigurasi dasar dan pastikan SSH aktif!"
      },
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Klik objek di ruangan untuk investigasi, lalu buka terminal dan ketik command-nya. Ada catatan di meja sebagai petunjuk. Semangat! ⚡"
      }
    ],
    objectives: [
      { id: "check-ip",      text: "Cek IP address server",       cmd: "ip addr" },
      { id: "set-hostname",  text: "Set hostname server",          cmd: "hostnamectl set-hostname netville-server" },
      { id: "update-system", text: "Update sistem (apt update)",   cmd: "apt update" },
      { id: "enable-ssh",    text: "Aktifkan SSH service",         cmd: "systemctl enable ssh" },
      { id: "check-ssh",     text: "Verifikasi SSH berjalan",      cmd: "systemctl status ssh" }
    ]
  },

  {
    id: 2,
    title: "Website Sekolah Harus Hidup!",
    mission: "Setup Apache Web Server",
    badge: "🌐 Web Master",
    scene: {
      bg: "radial-gradient(ellipse at 50% 30%, #0a1f0a 0%, #0a0a0f 70%)",
      objects: [
        {
          id: "server-running",
          emoji: "🖥️",
          label: "Server Ubuntu",
          x: "15%", y: "18%",
          inspect: {
            title: "🖥️ Server Ubuntu 22.04",
            body: "Server berjalan normal.\nOS: Ubuntu Server 22.04 LTS\nUptime: 2 jam\nApache2: NOT INSTALLED ❌",
            status: "warn",
            statusText: "Apache belum ada"
          }
        },
        {
          id: "browser",
          emoji: "🌐",
          label: "Browser Test",
          x: "50%", y: "22%",
          inspect: {
            title: "🌐 Hasil Browser",
            body: "Mencoba akses: http://192.168.1.100\nHasil: ERR_CONNECTION_REFUSED\n\nApache web server belum terinstall!\nTidak ada service yang mendengarkan di port 80.",
            status: "error",
            statusText: "Cannot connect"
          }
        },
        {
          id: "phone",
          emoji: "📱",
          label: "HP Kepala Sekolah",
          x: "74%", y: "35%",
          inspect: {
            title: "📱 Pesan Darurat!",
            body: "\"Halo! Website pendaftaran siswa baru tidak bisa dibuka sama sekali! Deadline pendaftaran 2 JAM LAGI. Ada 200 calon siswa yang menunggu. TOLONG SEGERA DIPERBAIKI!! 😤\"",
            status: "error",
            statusText: "🚨 URGENT!"
          }
        },
        {
          id: "folder-html",
          emoji: "📁",
          label: "File Website",
          x: "33%", y: "50%",
          inspect: {
            title: "📁 File Website Sekolah",
            body: "Lokasi: /var/www/html/\nFile index.html sudah ada ✓\nFile CSS dan gambar lengkap ✓\n\nTinggal aktifkan Apache-nya dan website langsung online!",
            status: "ok",
            statusText: "File siap"
          }
        }
      ]
    },
    dialogs: [
      {
        name: "Sari",
        avatar: "👩‍💻",
        text: "Hei! Ada situasi darurat nih. Website sekolah mitra kita down total. Kepala sekolahnya sudah panik!"
      },
      {
        name: "Sari",
        avatar: "👩‍💻",
        text: "Ternyata Apache web server-nya belum pernah diinstall! File website sudah ada, tapi tidak ada yang 'melayani'-nya ke browser."
      },
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Tugasmu: install Apache, jalankan, dan pastikan website bisa diakses. Deadline 2 jam! Kami andalkan kamu. 💪"
      }
    ],
    objectives: [
      { id: "install-apache", text: "Install Apache2",              cmd: "apt install apache2" },
      { id: "start-apache",   text: "Jalankan Apache service",      cmd: "systemctl start apache2" },
      { id: "enable-apache",  text: "Enable Apache saat boot",      cmd: "systemctl enable apache2" },
      { id: "check-apache",   text: "Cek status Apache",            cmd: "systemctl status apache2" },
      { id: "test-website",   text: "Test website (curl)",          cmd: "curl http://localhost" }
    ]
  },

  {
    id: 3,
    title: "Semua Komputer Tidak Dapat IP!",
    mission: "Konfigurasi DHCP & DNS Server",
    badge: "🔌 Network Architect",
    scene: {
      bg: "radial-gradient(ellipse at 70% 40%, #1a0a0a 0%, #0a0a0f 70%)",
      objects: [
        {
          id: "lab-pc",
          emoji: "💻",
          label: "Komputer Lab (x30)",
          x: "15%", y: "22%",
          inspect: {
            title: "💻 Komputer Lab",
            body: "30 komputer di lab komputer.\nStatus IP semua: 169.254.x.x (APIPA)\nArtinya: tidak ada DHCP server yang merespons!\nSiswa tidak bisa internetan sama sekali.",
            status: "error",
            statusText: "No IP Address"
          }
        },
        {
          id: "dhcp-server",
          emoji: "🔴",
          label: "DHCP Server",
          x: "48%", y: "18%",
          inspect: {
            title: "🔴 Status DHCP",
            body: "Memeriksa service DHCP...\n$ systemctl status isc-dhcp-server\nUnit isc-dhcp-server.service could not be found.\n\nDHCP server belum terinstall sama sekali!",
            status: "error",
            statusText: "Not installed"
          }
        },
        {
          id: "angry-teacher",
          emoji: "😤",
          label: "Pak Guru TIK",
          x: "72%", y: "32%",
          inspect: {
            title: "😤 Pak Guru TIK",
            body: "\"Lab komputer tidak bisa dipakai! Siswa kelas XI TKJ mau praktikum jaringan tapi internet mati semua. Ini sudah 1 jam! Kapan beres?!\"",
            status: "error",
            statusText: "Menunggu solusi"
          }
        },
        {
          id: "network-diagram",
          emoji: "🗺️",
          label: "Diagram Jaringan",
          x: "32%", y: "52%",
          inspect: {
            title: "🗺️ Konfigurasi Jaringan Lab",
            body: "Network Address : 192.168.10.0/24\nServer IP       : 192.168.10.1\nRange DHCP      : 192.168.10.100 – 192.168.10.200\nDefault Gateway : 192.168.10.1\nDNS Server      : 8.8.8.8\nLease Time      : 86400 detik (1 hari)",
            status: "ok",
            statusText: "📋 Petunjuk IP"
          }
        }
      ]
    },
    dialogs: [
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Baru dapat telepon dari sekolah! Lab komputer chaos. 30 PC tidak bisa dapat IP address, semua praktikum terhenti!"
      },
      {
        name: "Sari",
        avatar: "👩‍💻",
        text: "DHCP server belum ada di jaringan itu. Kita perlu install isc-dhcp-server dan konfigurasi range IP-nya. Ada diagram jaringan di papan, cek dulu!"
      },
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Setelah DHCP beres, install juga bind9 untuk DNS. Guru TIK sudah tidak sabar nunggu. Ayo cepat!"
      }
    ],
    objectives: [
      { id: "install-dhcp",  text: "Install isc-dhcp-server",       cmd: "apt install isc-dhcp-server" },
      { id: "config-dhcp",   text: "Konfigurasi file DHCP",         cmd: "nano /etc/dhcp/dhcpd.conf" },
      { id: "restart-dhcp",  text: "Restart DHCP service",          cmd: "systemctl restart isc-dhcp-server" },
      { id: "install-dns",   text: "Install bind9 (DNS server)",    cmd: "apt install bind9" },
      { id: "check-dhcp",    text: "Verifikasi DHCP berjalan",      cmd: "systemctl status isc-dhcp-server" }
    ]
  },

  {
    id: 4,
    title: "Ada yang Mencoba Masuk!",
    mission: "Firewall & Keamanan Server",
    badge: "🛡️ Security Guardian",
    scene: {
      bg: "radial-gradient(ellipse at 50% 50%, #1a0505 0%, #0a0a0f 70%)",
      objects: [
        {
          id: "alert-monitor",
          emoji: "🚨",
          label: "Security Alert!",
          x: "20%", y: "15%",
          inspect: {
            title: "🚨 INTRUSION DETECTED!",
            body: "⚠️ SECURITY ALERT ⚠️\nIP Address  : 45.33.32.156\nTarget Port : 22 (SSH)\nJenis Serangan : Brute Force\nPercobaan login: 1.247 kali dalam 5 menit!\nStatus: ONGOING ATTACK",
            status: "error",
            statusText: "🔴 BAHAYA!"
          }
        },
        {
          id: "firewall",
          emoji: "🔥",
          label: "Firewall Status",
          x: "54%", y: "22%",
          inspect: {
            title: "🔥 UFW Firewall",
            body: "$ ufw status\nStatus: inactive\n\nFirewall TIDAK aktif!\nSemua port terbuka tanpa filter.\nServer sangat rentan diserang saat ini.",
            status: "error",
            statusText: "Firewall OFF"
          }
        },
        {
          id: "hacker",
          emoji: "🦹",
          label: "IP Asing",
          x: "76%", y: "38%",
          inspect: {
            title: "🦹 Aktivitas Mencurigakan",
            body: "IP 45.33.32.156 terus-menerus mencoba login ke SSH server kita dengan berbagai kombinasi username dan password.\n\nIni adalah serangan Brute Force klasik!\nHarus segera diblokir sebelum berhasil masuk.",
            status: "error",
            statusText: "⚠️ THREAT"
          }
        },
        {
          id: "log-file",
          emoji: "📋",
          label: "File Auth Log",
          x: "32%", y: "52%",
          inspect: {
            title: "📋 /var/log/auth.log",
            body: "Jan 15 23:45:01 sshd: Failed password for root from 45.33.32.156\nJan 15 23:45:02 sshd: Failed password for admin from 45.33.32.156\nJan 15 23:45:03 sshd: Failed password for ubuntu from 45.33.32.156\n...\n(Total: 1247 baris serupa!)",
            status: "warn",
            statusText: "Log mencurigakan"
          }
        }
      ]
    },
    dialogs: [
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "DARURAT! Sistem monitoring kita mendeteksi serangan aktif ke server! Ada yang terus mencoba brute force SSH kita!"
      },
      {
        name: "Sari",
        avatar: "👩‍💻",
        text: "Firewall kita belum aktif sama sekali! Kamu harus: aktifkan UFW, cek log untuk tahu IP penyerang, lalu blokir IP tersebut segera!"
      },
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "Setiap detik sangat berharga. Kalau penyerang berhasil masuk, data seluruh klien kita bisa bocor. Lindungi server kita sekarang!"
      }
    ],
    objectives: [
      { id: "check-log",      text: "Cek log serangan",             cmd: "cat /var/log/auth.log" },
      { id: "enable-ufw",     text: "Aktifkan UFW firewall",        cmd: "ufw enable" },
      { id: "allow-ssh",      text: "Izinkan koneksi SSH sah",      cmd: "ufw allow ssh" },
      { id: "block-attacker", text: "Blokir IP penyerang",          cmd: "ufw deny from 45.33.32.156" },
      { id: "check-ufw",      text: "Verifikasi aturan firewall",   cmd: "ufw status" }
    ]
  },

  {
    id: 5,
    title: "BOSS: Malam Sebelum Ujian!",
    mission: "Troubleshooting Total — Server Down!",
    badge: "🏆 NetAdmin Hero",
    scene: {
      bg: "radial-gradient(ellipse at 50% 50%, #050515 0%, #0a0a0f 70%)",
      objects: [
        {
          id: "all-error",
          emoji: "💀",
          label: "Server DOWN!",
          x: "28%", y: "18%",
          inspect: {
            title: "💀 SERVER DOWN TOTAL!",
            body: "CRITICAL SYSTEM FAILURE\n\napache2.service  : FAILED ❌\nssh.service      : INACTIVE ❌\nnetworking       : ERROR ❌\nisc-dhcp-server  : STOPPED ❌\nufw.service      : INACTIVE ❌\n\nUptime: 0 detik",
            status: "error",
            statusText: "🔴 CRITICAL"
          }
        },
        {
          id: "crying-kepala",
          emoji: "😭",
          label: "Kepala Sekolah",
          x: "64%", y: "28%",
          inspect: {
            title: "😭 Kepala Sekolah Panik!",
            body: "\"TOLONG! Ujian online nasional mulai 30 MENIT LAGI!! 500 siswa tidak bisa login ke sistem ujian! Ini menyangkut masa depan anak-anak kami! PLEASE HELP!!! 😭\"",
            status: "error",
            statusText: "🆘 SOS!"
          }
        },
        {
          id: "news",
          emoji: "📰",
          label: "Breaking News",
          x: "18%", y: "52%",
          inspect: {
            title: "📰 Breaking News",
            body: "\"SERVER SEKOLAH LUMPUH MENJELANG UJIAN NASIONAL\"\n\nDiduga akibat serangan siber dan miskonfigurasi sistem. Nama teknisi yang bertanggung jawab belum diketahui...\n\n⚠️ Reputasimu dipertaruhkan!",
            status: "warn",
            statusText: "Reputasi taruhan!"
          }
        },
        {
          id: "checklist",
          emoji: "✅",
          label: "Emergency Guide",
          x: "58%", y: "52%",
          inspect: {
            title: "✅ Emergency Recovery Guide",
            body: "Urutan pemulihan yang disarankan:\n1. Restart networking (network dulu!)\n2. Restart apache2 (web server)\n3. Restart SSH (akses remote)\n4. Cek UFW tidak block traffic\n5. Verifikasi semua service running",
            status: "ok",
            statusText: "📋 Panduan"
          }
        }
      ]
    },
    dialogs: [
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "INI DARURAT LEVEL MERAH! Server sekolah mati total malam sebelum ujian nasional. Tim senior tidak bisa dihubungi!"
      },
      {
        name: "Sari",
        avatar: "👩‍💻",
        text: "Kamu satu-satunya harapan kami. Semua skill yang kamu pelajari dari level 1 sampai 4 harus dipakai sekarang sekaligus!"
      },
      {
        name: "Pak Rudi",
        avatar: "👨‍💼",
        text: "30 menit tersisa. Mulai dari yang paling kritis. Ada emergency guide di papan. Kami percaya padamu, NetAdmin! 🔥"
      }
    ],
    objectives: [
      { id: "restart-network", text: "Pulihkan konfigurasi network",  cmd: "systemctl restart networking" },
      { id: "restart-apache2", text: "Restart web server",            cmd: "systemctl restart apache2" },
      { id: "restart-ssh2",    text: "Restart SSH service",           cmd: "systemctl restart ssh" },
      { id: "check-ufw2",      text: "Verifikasi firewall tidak block",cmd: "ufw status verbose" },
      { id: "test-all",        text: "Cek semua service running",     cmd: "systemctl list-units --state=running" }
    ]
  }
];
