// ════════════════════════════════════════════
// LEVEL & SCENE DATA — NetAdmin Academy v6
// Cerita: Andi, Siswa SMK TKJ yang magang —
// dari kikuk hari pertama sampai jadi pahlawan!
// ════════════════════════════════════════════

const LEVELS = [

  // ══════════════════════════════════════════
  // LEVEL 1 — Hari Pertama Magang
  // ══════════════════════════════════════════
  {
    id: 1,
    title: "Hari Pertama Magang",
    mission: "Selesaikan orientasi & tangani krisis server pertamamu",
    badge: "🔧 Magang Heroik",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Lantai 3 — Ruang Tunggu IT",
        doorSign: "SERVER ROOM A",
        chars: [
          { id: "pak-heri", name: "Pak Heri" }
        ]
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room A — Netville",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        objects: [
          { id: "server-rack",   label: "Server Rack Utama" },
          { id: "monitor",       label: "Monitor Error Log" },
          { id: "sticky-note",   label: "Catatan Pak Heri" },
          { id: "router",        label: "Router Jaringan" },
          { id: "usb-log",       label: "USB Backup Log" }
        ]
      }
    },

    dialogs: {
      char_pak_heri: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Bismillah... *tarik napas* Ini dia, Dinas IT Kota Netville. Hari pertama magang!" },
        { avatar: "😊", name: "Pak Heri", text: "Oh! Kamu pasti Andi dari SMK TKJ! Selamat datang! Aku Pak Heri, Kepala Divisi IT kota ini." },
        { avatar: "😊", name: "Pak Heri", text: "Di divisi kami, tugas kami menjaga seluruh infrastruktur IT kota — website pemerintah, database kependudukan, jaringan semua kantor..." },
        { avatar: "😊", name: "Pak Heri", text: "Kamu akan belajar banyak selama magang di sini. Oh ya, partnermu sudah menunggu di server room — namanya Kak Sari, senior sysadmin kita yang paling jago!" },
        { avatar: "😅", name: "Andi (Kamu)", text: "Wah, keren sekali, Pak! Saya siap belajar! Boleh langsung ke server room?" },
        { avatar: "😊", name: "Pak Heri", text: "Tentu! Pintu server room ada di ujung lorong ini. Kenalan dulu sama Sari — dia yang akan guide kamu selama magang. Selamat bekerja, Andi!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Eh, kamu pasti Andi? Halo! Aku Sari. Selamat datang di server room — ini 'jantungnya' IT kota!" },
        { avatar: "😎", name: "Kak Sari", text: "*menunjuk ke kiri* Di sisi sana — production servers. Handle web, database, email, semua layanan kota yang jalan 24/7." },
        { avatar: "😎", name: "Kak Sari", text: "LED yang blink-blink hijau itu tanda server aktif. Kalau ada yang merah atau mati, kita harus respons cepat." },
        { avatar: "😎", name: "Kak Sari", text: "*menunjuk ke kanan* Sisi ini — server backup dan test environment. Penting banget buat disaster recovery." },
        { avatar: "😎", name: "Kak Sari", text: "Di tengah ada workstation. Dari sini kita monitor semua server via command line Linux. Kamu familiar sama Linux?" },
        { avatar: "😅", name: "Andi (Kamu)", text: "Sedikit, Kak... di sekolah baru belajar dasarnya." },
        { avatar: "😎", name: "Kak Sari", text: "Bagus! Di sini kamu langsung praktek nyata. Oke, sekarang aku tunjukin cara kita kerja—" },
        { avatar: "📞", name: "[ ☎  TELPON MASUK — PAK HERI ]", text: "BRRINGGG!! BRRINGGG!! BRRINGGG!!" },
        { avatar: "😱", name: "Pak Heri (via telepon)", text: "SARI!! Server web SMKN 1 DOWN! Ujian online 800 siswa mulai 2 jam lagi! Disk penuh, Apache crash! Wali Kota sudah telepon 3 kali!!" },
        { avatar: "😎", name: "Kak Sari", text: "*tutup telepon, langsung serius* Oke Andi. Ini situasi NYATA. Kita harus bergerak sekarang." },
        { avatar: "😎", name: "Kak Sari", text: "Langkah pertama: INSPECT semua perangkat di ruangan ini. Klik setiap item dan baca infonya — kumpulin informasi dulu." },
        { avatar: "😎", name: "Kak Sari", text: "Setelah paham masalahnya, buka terminal dari tombol 💻 di panel Misi. Aku di sini kalau butuh bantuan. Let's go!" }
      ]
    },

    items: {
      "server-rack": {
        icon: "🖥️", title: "Server Dell PowerEdge — Apache MATI",
        status: "err", statusText: "Disk 100% — Apache Crash",
        body: "Status server:\n• Ubuntu Server 22.04 ✓\n• CPU: normal\n• RAM: 4GB / 8GB (OK)\n• Disk /: 100% PENUH ❌\n\nApache tidak bisa tulis log → service crash!\nHarus bersihkan disk sebelum restart Apache.",
        theory: "Disk 100% adalah salah satu penyebab server down yang paling umum. Service seperti Apache membutuhkan ruang untuk menulis log. Solusi: hapus log lama dengan journalctl --vacuum-size.",
        triggerTerm: true
      },
      "monitor": {
        icon: "🖥", title: "Monitor — Apache Error Log",
        status: "err", statusText: "Failed to write log",
        body: "Error terakhir di /var/log/apache2/error.log:\n\n[ALERT] No space left on device!\n[ERROR] apache2: could not open error log file\n[ERROR] AH00015: Unable to open logs\n\nKonfirmasi: disk penuh = Apache mati.",
        theory: "Apache menyimpan log di /var/log/apache2/. Jika disk penuh, Apache tidak bisa tulis log dan langsung crash. Cek: df -h (disk usage) dan du -sh /var/log/* (ukuran tiap folder).",
        triggerTerm: true
      },
      "sticky-note": {
        icon: "📝", title: "Catatan Pak Heri — Tempel di Meja",
        status: "ok", statusText: "📋 Petunjuk Darurat",
        body: "Langkah darurat:\n1. df -h → cek penggunaan disk\n2. du -sh /var/log/* → cari file terbesar\n3. journalctl --vacuum-size=100M → bersihkan log\n4. systemctl restart apache2\n5. curl http://localhost → test!\n\n— Heri",
        theory: "",
        triggerTerm: false
      },
      "router": {
        icon: "📡", title: "Router — Jaringan Normal",
        status: "ok", statusText: "Link UP ✓",
        body: "Router berjalan normal:\n• Uptime: 47 hari\n• WAN: terhubung ke internet ✓\n• LAN: 192.168.1.1/24\n• Server IP: 192.168.1.100\n\nJaringan bukan masalahnya — masalah di server!",
        theory: "Langkah troubleshooting: pisahkan dulu masalah jaringan vs masalah server. Jika ping berhasil tapi website tidak bisa dibuka, berarti masalah di server, bukan di jaringan.",
        triggerTerm: false
      },
      "usb-log": {
        icon: "💾", title: "USB — Backup Log Error",
        status: "warn", statusText: "Log 3 bulan tidak dibersihkan!",
        body: "Isi USB:\n• error_log_backup_jan.tar.gz (4.2 GB)\n• error_log_backup_feb.tar.gz (3.8 GB)\n• error_log_backup_mar.tar.gz (5.1 GB)\n\nTOTAL: 13 GB log tidak pernah dibersihkan!\nIni penyebab disk penuh.",
        theory: "Best practice: konfigurasi logrotate untuk otomatis kompres dan hapus log lama. File konfigurasi: /etc/logrotate.conf",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "check-disk",     text: "Cek penggunaan disk server",     cmd: "df -h" },
      { id: "check-log-size", text: "Cek ukuran file log",            cmd: "du -sh /var/log/*" },
      { id: "clean-journal",  text: "Bersihkan log sistem",           cmd: "journalctl --vacuum-size=100M" },
      { id: "restart-apache", text: "Restart Apache web server",      cmd: "systemctl restart apache2" },
      { id: "test-web",       text: "Verifikasi website bisa diakses", cmd: "curl http://localhost" }
    ],

    hints: [
      "Cek disk dulu: df -h — lihat partisi mana yang penuh.",
      "Bersihkan log sistem: journalctl --vacuum-size=100M",
      "Setelah disk lega, restart Apache: systemctl restart apache2"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 2 — Jaringan Kantor Lurah Putus
  // ══════════════════════════════════════════
  {
    id: 2,
    title: "Jaringan Mati di Kelurahan",
    mission: "DHCP error — 30 PC kantor lurah tidak dapat IP address!",
    badge: "🔌 Network Fixer",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — Laporan Darurat Masuk",
        doorSign: "SERVER ROOM B",
        chars: [
          { id: "pak-heri",  name: "Pak Heri" },
          { id: "pak-lurah", name: "Pak Lurah" }
        ]
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room B — Kelurahan Cempaka",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        objects: [
          { id: "switch",       label: "Network Switch" },
          { id: "dhcp-server",  label: "DHCP Server" },
          { id: "pc-lab",       label: "PC Staf Kantor" },
          { id: "ip-diagram",   label: "Diagram IP Kantor" },
          { id: "error-ticket", label: "Tiket Trouble" }
        ]
      }
    },

    dialogs: {
      char_pak_heri: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Hari kedua magang. Semoga lebih tenang dari kemarin... *notifikasi masuk*" },
        { avatar: "😱", name: "Pak Heri", text: "Andi! Pak Lurah sudah di sini dari tadi pagi. Ada masalah besar di kantor kelurahan!" },
        { avatar: "😤", name: "Pak Lurah", text: "Ini sangat mendesak! Seluruh jaringan kantor kelurahan MATI! 200 warga sudah antri buat KTP — staf tidak bisa akses sistem apapun!" },
        { avatar: "😱", name: "Pak Heri", text: "Sari sudah berangkat duluan ke server room. Andi, pergi sekarang ya! Ini darurat!" },
        { avatar: "😅", name: "Andi (Kamu)", text: "Siap Pak! Saya langsung ke server room! *dalam hati: dag-dig-dug lagi nih...*" }
      ],
      char_pak_lurah: [
        { avatar: "😤", name: "Pak Lurah", text: "Hei, kamu yang magang itu ya? Tolong cepat! Antrian warga sudah sangat panjang!" },
        { avatar: "😤", name: "Pak Lurah", text: "Kami tidak bisa proses KTP, surat keterangan, apa pun! Semua PC tidak bisa konek jaringan!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Andi! Bagus, kamu sudah datang. Aku sudah survey sebentar — masalahnya jelas: DHCP server error." },
        { avatar: "😎", name: "Kak Sari", text: "*tunjuk server* DHCP server ini yang kasih IP address ke semua PC di kantor. Kalau dia mati, semua PC tidak dapat IP — otomatis tidak bisa akses jaringan." },
        { avatar: "😎", name: "Kak Sari", text: "Coba lihat konfigurasinya — sepertinya ada typo atau syntax error di file dhcpd.conf yang buat service tidak bisa start." },
        { avatar: "😎", name: "Kak Sari", text: "Tugasmu: cek status DHCP, buka dan perbaiki file konfigurasinya, restart, dan pastikan PC sudah dapat IP lagi." },
        { avatar: "😎", name: "Kak Sari", text: "Inspect semua item dulu untuk paham situasinya, lalu buka terminal. Aku stand by di sini!" }
      ]
    },

    items: {
      "switch": {
        icon: "🔀", title: "Network Switch — Link OK",
        status: "ok", statusText: "Port aktif semua ✓",
        body: "Switch Cisco Catalyst 2960:\n• 24 port aktif ✓\n• Uptime: 120 hari\n• VLAN: 10 (staf), 20 (printer)\n• Jaringan fisik: NORMAL\n\nSwitch bukan masalahnya — cek DHCP server!",
        theory: "Network switch bertugas menghubungkan perangkat dalam satu jaringan lokal (LAN). Jika switch normal tapi PC tidak dapat IP, masalah ada di DHCP server.",
        triggerTerm: false
      },
      "dhcp-server": {
        icon: "🌐", title: "DHCP Server — SERVICE MATI",
        status: "err", statusText: "Service failed to start",
        body: "Status: isc-dhcp-server FAILED ❌\n\nError: /etc/dhcp/dhcpd.conf line 7: syntax error\n\nKonfigurasi salah → service tidak bisa start\n→ PC tidak dapat IP address\n→ Tidak bisa akses jaringan",
        theory: "DHCP (Dynamic Host Configuration Protocol) server secara otomatis memberikan IP address ke perangkat di jaringan. File konfigurasi: /etc/dhcp/dhcpd.conf. Jika ada syntax error, service tidak bisa start.",
        triggerTerm: true
      },
      "pc-lab": {
        icon: "💻", title: "PC Staf Kantor — No IP Address",
        status: "err", statusText: "169.254.x.x (APIPA)",
        body: "IP PC staf: 169.254.x.x (APIPA)\n\nIP 169.254.x.x artinya PC TIDAK dapat IP dari DHCP!\nPC pakai IP self-assigned yang tidak bisa komunikasi ke server.\n\nPastikan DHCP server aktif untuk fix ini.",
        theory: "APIPA (Automatic Private IP Addressing) = IP 169.254.x.x yang dipakai otomatis ketika perangkat tidak berhasil mendapat IP dari DHCP server. Solusi: perbaiki DHCP server.",
        triggerTerm: false
      },
      "ip-diagram": {
        icon: "📊", title: "Diagram IP Kantor Kelurahan",
        status: "ok", statusText: "Dokumentasi jaringan",
        body: "Rencana IP Kantor:\n• Router: 192.168.10.1\n• DHCP Range: 192.168.10.50 - 192.168.10.200\n• Subnet: 255.255.255.0\n• DNS: 8.8.8.8, 8.8.4.4\n\nConfig DHCP harus sesuai diagram ini!",
        theory: "Dokumentasi jaringan sangat penting! Selalu catat IP range, subnet mask, default gateway, dan DNS server untuk setiap jaringan yang dikelola.",
        triggerTerm: false
      },
      "error-ticket": {
        icon: "🎫", title: "Tiket Laporan — Staf IT Kelurahan",
        status: "warn", statusText: "Laporan jam 07:30",
        body: "Laporan: 07:30 WIB\nSemua PC tidak bisa browsing & akses server.\nSudah dicoba restart PC — tidak membantu.\nDicoba cabut-colok kabel — tetap tidak bisa.\n\nDiagnosa staf: 'Mungkin internet putus'\nDiagnosa benar: DHCP server mati!",
        theory: "Troubleshooting sistematis: selalu isolasi masalah. Kalau internet putus, semua lokasi terpengaruh. Kalau hanya satu kantor, masalahnya lokal — cek switch, DHCP, atau router lokal.",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "check-dhcp",    text: "Cek status DHCP server",         cmd: "systemctl status isc-dhcp-server" },
      { id: "edit-dhcp",     text: "Edit konfigurasi DHCP",          cmd: "nano /etc/dhcp/dhcpd.conf" },
      { id: "restart-dhcp",  text: "Restart DHCP server",            cmd: "systemctl restart isc-dhcp-server" }
    ],

    hints: [
      "Cek status: systemctl status isc-dhcp-server",
      "Edit konfigurasi: nano /etc/dhcp/dhcpd.conf",
      "Restart: systemctl restart isc-dhcp-server"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 3 — Database Kependudukan Error
  // ══════════════════════════════════════════
  {
    id: 3,
    title: "Database Kependudukan Rusak",
    mission: "MySQL crash — data kependudukan ribuan warga tidak bisa diakses!",
    badge: "💾 Database Hero",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — Laporan Disdukcapil",
        doorSign: "SERVER ROOM C",
        chars: [
          { id: "pak-heri",  name: "Pak Heri" },
          { id: "bu-retno",  name: "Bu Retno" }
        ]
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room C — Database Kota",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        objects: [
          { id: "db-server",    label: "Database Server MySQL" },
          { id: "backup-drive", label: "Hard Drive Backup" },
          { id: "error-log",    label: "Error Log MySQL" },
          { id: "cron-config",  label: "Konfigurasi Cron Job" },
          { id: "status-board", label: "Status Board IT" }
        ]
      }
    },

    dialogs: {
      char_pak_heri: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Hari ketiga magang. Mana-mana ada masalah terus di kota ini..." },
        { avatar: "😱", name: "Pak Heri", text: "Andi! Database sistem administrasi kota error besar! Bu Retno dari Disdukcapil sudah menunggu sejak pagi!" },
        { avatar: "😟", name: "Bu Retno", text: "Sistem kami tidak bisa akses database sejak semalam! Data kependudukan ratusan ribu warga — KTP, KK, akta kelahiran — semua tidak bisa diakses!" },
        { avatar: "😟", name: "Bu Retno", text: "Besok ada audit dari Kemendagri. Kalau data tidak bisa diakses, Dinas kami bisa kena sanksi berat!" },
        { avatar: "😱", name: "Pak Heri", text: "Sari sudah standby di server room database. Andi, kamu bantu Sari ya — ini sangat krusial!" },
        { avatar: "😅", name: "Andi (Kamu)", text: "Siap, Pak! Saya langsung ke server room!" }
      ],
      char_bu_retno: [
        { avatar: "😟", name: "Bu Retno", text: "Tolong ya, Andi. Data warga itu sangat penting. Besok ada audit dan semua dokumen harus bisa diakses." },
        { avatar: "😟", name: "Bu Retno", text: "Kami sudah tidak bisa kerja sejak tadi malam. Staf semua bingung mau ngapain tanpa akses database." }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Andi, masalah kali ini lebih serius dari sebelumnya. MySQL database crash karena ada korupsi data." },
        { avatar: "😎", name: "Kak Sari", text: "*tunjuk server besar* Ini database server utama. Berisi data kependudukan seluruh warga kota. Sekarang MySQL-nya error dan tidak bisa start normal." },
        { avatar: "😎", name: "Kak Sari", text: "Kita harus stop MySQL dulu, jalankan mysqlcheck untuk repair tabel yang corrupt, baru start lagi." },
        { avatar: "😎", name: "Kak Sari", text: "PENTING: jangan hapus data apapun! Kita repair, bukan reset. Setelah database normal, kita juga setup cron job untuk maintenance rutin." },
        { avatar: "😎", name: "Kak Sari", text: "Inspect semua item di sini dulu — terutama error log. Pahami kondisinya sebelum mulai. Hati-hati ya!" }
      ]
    },

    items: {
      "db-server": {
        icon: "🗄️", title: "Database Server — MySQL ERROR",
        status: "err", statusText: "InnoDB: corruption detected",
        body: "MySQL Server:\n• Versi: MySQL 8.0\n• Status: CRASHED ❌\n• Error: InnoDB table corruption\n• Database: kependudukan_kota\n• Tabel corrupt: tb_warga, tb_kk\n\nHarus: stop → repair → start",
        theory: "InnoDB corruption bisa terjadi karena power failure, disk error, atau bug. Cara repair: mysqlcheck --auto-repair --all-databases atau mysqlcheck -u root -p --auto-repair nama_db.",
        triggerTerm: true
      },
      "backup-drive": {
        icon: "💾", title: "Hard Drive Backup — 3 Hari Lalu",
        status: "warn", statusText: "Backup terakhir: 3 hari lalu",
        body: "Backup tersedia:\n• backup_kependudukan_2024-03-10.sql (12 GB)\n• backup_kependudukan_2024-03-08.sql (11.8 GB)\n\n⚠️ Backup 3 hari lalu — akan kehilangan data 3 hari!\nLebih baik coba repair dulu sebelum restore backup.",
        theory: "Backup rutin sangat penting! Best practice: backup harian otomatis dengan cron job. Contoh: 0 2 * * * mysqldump -u root -p[pass] nama_db > /backup/db_$(date +%F).sql",
        triggerTerm: false
      },
      "error-log": {
        icon: "📋", title: "Error Log MySQL",
        status: "err", statusText: "InnoDB: table corruption",
        body: "Log Error MySQL (/var/log/mysql/error.log):\n\n[ERROR] InnoDB: Table kependudukan_kota/tb_warga is marked as crashed\n[ERROR] MySQL: Got error 126 from storage engine\n[ERROR] Can't open file: './kependudukan_kota/tb_warga.MYI'\n\nDiagnosa: korupsi tabel InnoDB",
        theory: "Error log MySQL ada di /var/log/mysql/error.log (Ubuntu). Selalu cek log ini saat MySQL bermasalah. Error 126 berarti tabel corrupt dan perlu direpair.",
        triggerTerm: false
      },
      "cron-config": {
        icon: "⏰", title: "Konfigurasi Cron Job",
        status: "warn", statusText: "Tidak ada maintenance terjadwal!",
        body: "Cron job saat ini: (kosong)\n\nTidak ada jadwal maintenance database!\nTidak ada backup otomatis!\nTidak ada pembersihan log otomatis!\n\nIni penyebab masalah tidak terdeteksi dini.",
        theory: "Cron job adalah jadwal tugas otomatis di Linux. Format: menit jam hari bulan hari-minggu perintah. Contoh: '0 2 * * *' = setiap hari jam 02:00. Edit dengan: crontab -e",
        triggerTerm: true
      },
      "status-board": {
        icon: "📊", title: "Status Board — Monitoring Kota",
        status: "err", statusText: "Database: DOWN",
        body: "Status Layanan Kota (Real-time):\n✓ Website Kota — OK\n✓ Jaringan — OK\n❌ Database Kependudukan — DOWN\n❌ Sistem KTP Online — DOWN\n❌ Portal Layanan Warga — ERROR\n\nSemua layanan yang pakai database = mati!",
        theory: "Monitoring adalah kunci operasional IT. Tools monitoring populer: Nagios, Zabbix, Grafana. Untuk pemula, cukup pakai cron job + script bash + email alert.",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "stop-mysql",    text: "Hentikan MySQL service",          cmd: "systemctl stop mysql" },
      { id: "repair-db",     text: "Repair database yang corrupt",    cmd: "mysqlcheck --auto-repair" },
      { id: "start-mysql",   text: "Jalankan kembali MySQL",          cmd: "systemctl start mysql" },
      { id: "setup-cron",    text: "Setup cron job maintenance",      cmd: "crontab -e" }
    ],

    hints: [
      "Stop MySQL dulu: systemctl stop mysql",
      "Repair database: mysqlcheck --auto-repair --all-databases",
      "Setup cron: crontab -e"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 4 — Serangan Siber ke Website Kota
  // ══════════════════════════════════════════
  {
    id: 4,
    title: "Serangan Siber ke Kota",
    mission: "Website kota diserang! Aktifkan firewall dan blokir penyerang!",
    badge: "🛡️ Cyber Defender",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — Situasi Darurat Siber",
        doorSign: "SERVER ROOM D",
        chars: [
          { id: "pak-heri",     name: "Pak Heri" },
          { id: "pak-walikota", name: "Pak Wali Kota" }
        ]
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room D — Security Ops",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        objects: [
          { id: "access-log",  label: "Access Log Mencurigakan" },
          { id: "firewall",    label: "Firewall UFW" },
          { id: "ids-monitor", label: "Monitor IDS" },
          { id: "attack-map",  label: "Peta Serangan" },
          { id: "patch-notes", label: "Catatan Patch Security" }
        ]
      }
    },

    dialogs: {
      char_pak_heri: [
        { avatar: "😅", name: "Andi (Kamu)", text: "*lihat berita* 'Website pemerintah kota kena serangan siber'... ini nyata dan itu server kita?!" },
        { avatar: "😰", name: "Pak Heri", text: "ANDI! Kamu sudah lihat beritanya? Website kota sedang diserang sekarang! Traffic abnormal dari ratusan IP luar negeri!" },
        { avatar: "😤", name: "Pak Wali Kota", text: "Ini tidak bisa ditolerir! Website pemerintah kota HARUS aman! Ini masalah kepercayaan publik dan kedaulatan digital!" },
        { avatar: "😤", name: "Pak Wali Kota", text: "Saya minta penanganan profesional! Kalau dalam 2 jam belum selesai, saya evaluasi seluruh divisi IT!" },
        { avatar: "😰", name: "Pak Heri", text: "Sari sudah di server room security. Andi — ini misi terpenting sejauh ini. Tolong bantu Sari amankan server!" },
        { avatar: "😤", name: "Andi (Kamu)", text: "Siap, Pak! Saya ke server room sekarang! *dalam hati: ini yang namanya incident response nyata!*" }
      ],
      char_pak_walikota: [
        { avatar: "😤", name: "Pak Wali Kota", text: "Kamu yang magang itu ya? Aku dengar kamu cukup handal. Jangan kecewakan kota ini!" },
        { avatar: "😤", name: "Pak Wali Kota", text: "Keamanan digital kota adalah prioritas. Pastikan semua penyerang diblokir dan sistem aman!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Andi! Situasinya serius — ini serangan DDoS dan brute force sekaligus. Tapi kita bisa handle." },
        { avatar: "😎", name: "Kak Sari", text: "*tunjuk monitor* Lihat — traffic abnormal dari ratusan IP. Ini pola serangan terkoordinasi. Firewall kita belum aktif — makanya serangan bisa masuk." },
        { avatar: "😎", name: "Kak Sari", text: "Kita pakai UFW — Uncomplicated Firewall. Tools ini simpel tapi powerful. Kita aktifkan, buka port yang diperlukan, lalu blokir IP penyerang." },
        { avatar: "😎", name: "Kak Sari", text: "PENTING: jangan blokir sembarangan! Baca log dulu dengan teliti. Bedakan traffic normal vs serangan." },
        { avatar: "😎", name: "Kak Sari", text: "Inspect semua item di sini dulu — terutama access log dan attack map. Pahami polanya baru bertindak!" }
      ]
    },

    items: {
      "access-log": {
        icon: "📜", title: "Apache Access Log — Mencurigakan",
        status: "err", statusText: "2847 request/menit dari 1 IP!",
        body: "Access log mencurigakan:\n185.220.101.45 - 2847 req/mnt ❌\n185.220.101.46 - 1923 req/mnt ❌\n45.142.212.100 - 1456 req/mnt ❌\n\nNormal traffic: 50-100 req/mnt\nIni DDoS (Distributed Denial of Service)!\n\nIP target blokir: 185.220.101.45",
        theory: "DDoS attack membanjiri server dengan traffic palsu sehingga server kewalahan melayani user asli. Cek: cat /var/log/apache2/access.log | awk '{print $1}' | sort | uniq -c | sort -rn",
        triggerTerm: true
      },
      "firewall": {
        icon: "🔥", title: "UFW Firewall — BELUM AKTIF",
        status: "err", statusText: "Status: inactive",
        body: "UFW Firewall Status: INACTIVE ❌\n\nFirewall belum pernah dikonfigurasi!\nSemua traffic masuk = tidak ada filter\nSemua port = terbuka untuk umum\n\nIni kenapa serangan bisa masuk dengan mudah.",
        theory: "UFW (Uncomplicated Firewall) adalah antarmuka sederhana untuk iptables di Ubuntu. Perintah dasar: ufw enable, ufw allow 80, ufw deny from [IP], ufw status.",
        triggerTerm: true
      },
      "ids-monitor": {
        icon: "👁️", title: "IDS Monitor — Alert Aktif",
        status: "warn", statusText: "47 alert keamanan aktif",
        body: "Intrusion Detection System Alert:\n\n[HIGH] Port scan dari 185.220.101.45\n[HIGH] SQL injection attempt\n[MED] Brute force SSH dari 45.142.212.100\n[MED] XSS attempt pada form login\n[LOW] Directory traversal attempt\n\n→ Blokir IP yang HIGH priority dulu!",
        theory: "IDS (Intrusion Detection System) memantau traffic jaringan dan memberikan alert saat ada aktivitas mencurigakan. Tools populer: Snort, Suricata, OSSEC.",
        triggerTerm: false
      },
      "attack-map": {
        icon: "🗺️", title: "Peta Serangan — Sumber IP",
        status: "err", statusText: "Serangan dari 12 negara",
        body: "Sumber serangan (top 5):\n1. Rusia: 185.220.101.0/24 — 45%\n2. China: 45.142.212.0/24 — 23%\n3. Romania: 193.169.144.0/24 — 15%\n4. Brazil: 177.67.128.0/24 — 10%\n5. Lain-lain — 7%\n\nIP utama untuk diblokir:\n185.220.101.45, 45.142.212.100",
        theory: "Dalam incident response: identifikasi sumber → blokir IP → aktifkan proteksi → dokumentasi → report. Tools: fail2ban untuk auto-block IP yang brute force.",
        triggerTerm: false
      },
      "patch-notes": {
        icon: "📋", title: "Catatan Patch Keamanan",
        status: "warn", statusText: "38 patch belum diinstall!",
        body: "Security patches yang belum diinstall:\n• CVE-2024-0001: Apache critical\n• CVE-2024-0008: OpenSSL high\n• CVE-2024-0012: PHP medium\n...dan 35 lainnya\n\nServer tidak diupdate sejak 6 bulan lalu!\nIni membuka celah keamanan besar.",
        theory: "Update rutin adalah fondasi keamanan server. Perintah: apt update && apt upgrade -y. Best practice: aktifkan unattended-upgrades untuk security patch otomatis.",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "check-log",    text: "Baca access log mencurigakan",     cmd: "cat /var/log/apache2/access.log" },
      { id: "enable-ufw",   text: "Aktifkan firewall UFW",            cmd: "ufw enable" },
      { id: "allow-http",   text: "Izinkan traffic HTTP normal",      cmd: "ufw allow 80" },
      { id: "block-ip",     text: "Blokir IP penyerang utama",        cmd: "ufw deny from 185.220.101.45" },
      { id: "check-ufw",    text: "Verifikasi status firewall",       cmd: "ufw status" }
    ],

    hints: [
      "Cek log: cat /var/log/apache2/access.log",
      "Aktifkan firewall: ufw enable, lalu ufw allow 80",
      "Blokir IP: ufw deny from 185.220.101.45"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 5 — Misi Akhir: Full System Deployment
  // ══════════════════════════════════════════
  {
    id: 5,
    title: "Misi Akhir: Bangun Ulang Kota",
    mission: "Deploy ulang semua sistem IT kota — dari nol! Ini momen terbesarmu!",
    badge: "🏆 Master NetAdmin",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — Hari Terakhir PKL",
        doorSign: "SERVER ROOM UTAMA",
        chars: [
          { id: "pak-heri",     name: "Pak Heri" },
          { id: "pak-walikota", name: "Pak Wali Kota" }
        ]
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room Utama — Full Deployment",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        objects: [
          { id: "main-server",   label: "Server Utama Kota" },
          { id: "deploy-plan",   label: "Rencana Deployment" },
          { id: "network-core",  label: "Core Network Switch" },
          { id: "monitoring",    label: "Monitoring Dashboard" },
          { id: "checklist",     label: "Checklist Deployment" }
        ]
      }
    },

    dialogs: {
      char_pak_heri: [
        { avatar: "😅", name: "Andi (Kamu)", text: "*tarik napas panjang* Hari terakhir magang. Tidak menyangka sudah sejauh ini... dari yang panik-panik sampai bisa handle krisis sendiri." },
        { avatar: "😊", name: "Pak Heri", text: "Andi! Ini hari terakhir magang kamu sekaligus misi terbesar dan terpenting yang pernah ada di divisi ini!" },
        { avatar: "😊", name: "Pak Wali Kota", text: "Setelah semua insiden yang berhasil kamu tangani, aku percaya kamu mampu. Kita akan deploy ulang SELURUH infrastruktur IT kota — lebih kuat, lebih aman!" },
        { avatar: "😊", name: "Pak Wali Kota", text: "Ini investasi besar kota. Dan kamu, Andi dari SMK TKJ — akan jadi bagian dari sejarah ini!" },
        { avatar: "😊", name: "Pak Heri", text: "Sari sudah siapkan server room. Andi, ini momen paling epic dalam perjalanan magangmu. Buktikan semua yang sudah kamu pelajari!" },
        { avatar: "😤", name: "Andi (Kamu)", text: "*senyum mantap* Siap, Pak! Saya tidak akan mengecewakan kota ini. *dalam hati: dari siswa kikuk hari pertama... sampai di titik ini. Let's go!*" }
      ],
      char_pak_walikota: [
        { avatar: "😊", name: "Pak Wali Kota", text: "Andi, kota ini berterima kasih atas kerja kerasmu. Kamu membuktikan bahwa siswa SMK pun bisa jadi garda terdepan IT pemerintahan!" },
        { avatar: "😊", name: "Pak Wali Kota", text: "Setelah lulus nanti, ada tempat untukmu di sini. Sungguh." }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "*senyum bangga* Andi... kamu sudah jauh berkembang dari hari pertama. Sekarang, misi terakhir dan terbesar." },
        { avatar: "😎", name: "Kak Sari", text: "Kita akan deploy ulang seluruh sistem: firewall bersih, jaringan bersih, semua service distart ulang dari awal dengan konfigurasi yang benar." },
        { avatar: "😎", name: "Kak Sari", text: "*tunjuk whiteboard* Urutan deployment SANGAT penting: Reset firewall → Allow port yang diperlukan → Restart networking → Restart semua service → Verifikasi." },
        { avatar: "😎", name: "Kak Sari", text: "Kalau urutan salah, bisa ada layanan yang tertutup atau jaringan yang terputus. Hati-hati tapi percaya diri." },
        { avatar: "😎", name: "Kak Sari", text: "Inspect semua perangkat, pahami kondisi awal, lalu mulai deployment. Ini saat kamu tunjukkan semua yang sudah kamu pelajari. Aku percaya kamu!" }
      ]
    },

    items: {
      "main-server": {
        icon: "🖥️", title: "Server Utama Kota — Siap Deploy",
        status: "warn", statusText: "Konfigurasi lama — perlu fresh deploy",
        body: "Server Dell PowerEdge R740:\n• OS: Ubuntu Server 22.04 LTS ✓\n• RAM: 32GB ✓ | Disk: 2TB ✓\n• Status: Running dengan konfigurasi lama\n\nPerlu fresh deployment:\n• Firewall baru ✓\n• Service restart semua ✓\n• Network config baru ✓",
        theory: "Full deployment adalah proses install dan konfigurasi ulang semua komponen sistem. Urutan: network → security → services → verification. Dokumentasikan setiap langkah!",
        triggerTerm: true
      },
      "deploy-plan": {
        icon: "📋", title: "Rencana Deployment — Tahapan",
        status: "ok", statusText: "Dokumen resmi deployment",
        body: "RENCANA DEPLOYMENT KOTA:\n\nFase 1 — Security:\n• Reset & configure UFW\n• Allow hanya port yang diperlukan\n\nFase 2 — Network:\n• Restart networking service\n\nFase 3 — Services:\n• Start/restart semua service\n\nFase 4 — Verification:\n• Cek semua service running",
        theory: "Deployment plan adalah dokumen wajib sebelum melakukan perubahan besar di production. Tanpa plan, risiko outage dan kesalahan sangat tinggi.",
        triggerTerm: false
      },
      "network-core": {
        icon: "🔀", title: "Core Network Switch — HP Aruba",
        status: "ok", statusText: "All links UP ✓",
        body: "HP Aruba Core Switch:\n• 48 port aktif ✓\n• Uptime: 365 hari (!)\n• VLAN terconfig dengan benar\n• Bandwidth: 10Gbps ✓\n\nSwitch dalam kondisi prima.\nPastikan networking service di server juga di-restart!",
        theory: "Core switch adalah jantung jaringan. Best practice: jangan restart switch saat jam kerja. Selalu koordinasi dengan semua tim sebelum maintenance jaringan.",
        triggerTerm: false
      },
      "monitoring": {
        icon: "📊", title: "Dashboard Monitoring — Real-time",
        status: "warn", statusText: "5 service belum optimal",
        body: "Status Service Kota (Current):\n✓ MySQL Database — Running\n✓ Apache Web — Running\n⚠️ UFW Firewall — Konfigurasi lama\n⚠️ Networking — Perlu restart\n⚠️ SSH — Port default (risiko)\n⚠️ Cron Jobs — Belum optimal\n✓ DNS — Running",
        theory: "Monitoring dashboard memberikan overview real-time semua service. Tools: Zabbix, Nagios, Grafana + Prometheus. Untuk Linux: systemctl list-units --state=running",
        triggerTerm: true
      },
      "checklist": {
        icon: "✅", title: "Checklist Deployment Final",
        status: "ok", statusText: "Panduan langkah demi langkah",
        body: "CHECKLIST DEPLOYMENT:\n□ ufw reset — reset firewall\n□ ufw allow 80 — izinkan HTTP\n□ systemctl restart networking\n□ systemctl restart apache2\n□ systemctl list-units --state=running\n\nCentang satu per satu!\nJangan skip langkah apapun!",
        theory: "Checklist deployment mencegah human error. Di production environment, setiap langkah harus dicatat dengan timestamp dan siapa yang melakukan (change management).",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "reset-fw",      text: "Reset konfigurasi firewall",              cmd: "ufw reset" },
      { id: "allow-http",    text: "Izinkan traffic HTTP",                    cmd: "ufw allow 80" },
      { id: "restart-net",   text: "Restart networking service",              cmd: "systemctl restart networking" },
      { id: "restart-apache",text: "Restart Apache web server",               cmd: "systemctl restart apache2" },
      { id: "check-all",     text: "Verifikasi semua service berjalan",       cmd: "systemctl list-units --state=running" }
    ],

    hints: [
      "Reset firewall dulu: ufw reset, lalu ufw allow 80",
      "Restart networking: systemctl restart networking",
      "Cek semua: systemctl list-units --state=running"
    ]
  }

];
