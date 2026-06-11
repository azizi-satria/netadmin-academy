// ════════════════════════════════════════════
// LEVEL & SCENE DATA — NetAdmin Academy v5
// Cerita: Andi, Siswa SMK TKJ yang magang di
// Dinas IT Kota Netville — dan jadi pahlawan!
// ════════════════════════════════════════════

const LEVELS = [

  // ══════════════════════════════════════════
  // LEVEL 1 — Hari Pertama Magang, Langsung Krisis!
  // ══════════════════════════════════════════
  {
    id: 1,
    title: "Hari Pertama Magang",
    mission: "Server web sekolah down — ujian online terancam!",
    badge: "🔧 Magang Heroik",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT Kota Netville — Lantai 3",
        doorSign: "SERVER ROOM A",
        chars: [
          { id: "pak-heri", name: "Pak Heri" },
          { id: "kak-sari", name: "Kak Sari" }
        ],
        dialogOnEnter: "intro"
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room A — Netville",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        dialogOnEnter: "enter_sr",
        objects: [
          { id: "server-rack",   label: "Server Rack" },
          { id: "monitor",       label: "Monitor Terminal" },
          { id: "sticky-note",   label: "Catatan Pak Heri" },
          { id: "router",        label: "Router Jaringan" },
          { id: "usb-log",       label: "USB Log Error" }
        ]
      }
    },

    dialogs: {
      intro: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Bismillah... hari pertama magang di Dinas IT Kota Netville. Semoga tidak ada yang aneh-aneh hari ini..." },
        { avatar: "😱", name: "Pak Heri", text: "ANDI! Kamu sudah datang! Syukurlah! Ada KRISIS besar! Server web SMKN 1 Netville DOWN dari tadi pagi!" },
        { avatar: "😱", name: "Pak Heri", text: "Ujian online semester genap mulai 2 jam lagi! 800 siswa tidak bisa akses platform ujian! Wali Kota sudah telepon 3 kali!!" },
        { avatar: "😎", name: "Kak Sari", text: "Santai Pak Heri. Andi, aku Sari — senior sysadmin di sini. Sudah aku diagnosa: SSH server aktif tapi web service Apache-nya mati." },
        { avatar: "😎", name: "Kak Sari", text: "Disk server penuh karena log tidak pernah dibersihkan. Apache tidak bisa jalan. Masuk server room — kita beresin bareng. Santai aja!" },
        { avatar: "😅", name: "Andi (Kamu)", text: "Hari pertama magang langsung krisis... ini pasti ujian dari guru PKL-ku. Oke, let's go!" }
      ],
      enter_sr: [
        { avatar: "😎", name: "Kak Sari", text: "Nah, ini dia server room-nya. Klik setiap perangkat buat inspect dulu, kumpulin info sebanyak mungkin." },
        { avatar: "😎", name: "Kak Sari", text: "Setelah paham masalahnya, buka terminal dan ketik command yang benar. Aku yakin kamu bisa!" }
      ],
      char_pak_heri: [
        { avatar: "😱", name: "Pak Heri", text: "ANDI! Wali Kota baru telepon lagi! Katanya kalau ujian sampai gagal, dia akan evaluasi anggaran Dinas IT kita!" },
        { avatar: "😱", name: "Pak Heri", text: "Tolong cepat ya! Aku percaya sama kamu dan Sari!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Cek dulu sticky note di meja — Pak Heri nulis checklist kasar di sana. Lumayan buat panduan." },
        { avatar: "😎", name: "Kak Sari", text: "Intinya: bersihkan disk dulu biar Apache bisa jalan, lalu verifikasi website bisa diakses." }
      ]
    },

    items: {
      "server-rack": {
        icon: "🖥️", title: "Server Dell PowerEdge — Apache MATI",
        status: "err", statusText: "Disk 100% — Apache Crash",
        body: "Status server:\n• Ubuntu Server 22.04 ✓\n• CPU: normal\n• RAM: 4GB / 8GB (OK)\n• Disk /: 100% PENUH ❌\n\nApache tidak bisa tulis log → service crash!\nHarus bersihkan disk sebelum restart Apache.",
        theory: "Disk 100% adalah salah satu penyebab server down yang paling umum. Service seperti Apache membutuhkan ruang untuk menulis log. Jika disk penuh, service crash. Solusi: hapus log lama dengan journalctl --vacuum-size atau hapus file di /var/log/.",
        triggerTerm: true
      },
      "monitor": {
        icon: "🖥", title: "Monitor — Apache Error Log",
        status: "err", statusText: "Failed to write log",
        body: "Error terakhir di /var/log/apache2/error.log:\n\n[ALERT] No space left on device!\n[ERROR] apache2: could not open error log file\n[ERROR] AH00015: Unable to open logs\n\nKonfirmasi: disk penuh = Apache mati.",
        theory: "Apache menyimpan log di /var/log/apache2/. Jika disk penuh, Apache tidak bisa tulis log dan langsung crash. Perintah untuk cek: df -h (disk usage) dan du -sh /var/log/* (ukuran tiap folder log).",
        triggerTerm: true
      },
      "sticky-note": {
        icon: "📝", title: "Catatan Pak Heri — Tempel di Meja",
        status: "ok", statusText: "📋 Petunjuk Darurat",
        body: "Langkah darurat (tulis tadi malam):\n1. df -h → cek penggunaan disk\n2. du -sh /var/log/* → cari file terbesar\n3. journalctl --vacuum-size=100M → bersihkan log sistem\n4. rm -f /var/log/apache2/*.gz → hapus log Apache lama\n5. systemctl restart apache2\n6. curl http://localhost → test!\n\n— Heri",
        theory: "",
        triggerTerm: false
      },
      "router": {
        icon: "📡", title: "Router — Jaringan Normal",
        status: "ok", statusText: "Link UP ✓",
        body: "Router berjalan normal:\n• Uptime: 47 hari\n• WAN: terhubung ke internet ✓\n• LAN: 192.168.1.1/24\n• Server IP: 192.168.1.100\n\nJaringan bukan masalahnya — masalah di server!",
        theory: "Langkah troubleshooting: selalu pisahkan dulu masalah jaringan vs masalah server. Jika ping ke server berhasil tapi website tidak bisa dibuka, berarti masalah di server (service, disk, config), bukan di jaringan.",
        triggerTerm: false
      },
      "usb-log": {
        icon: "💾", title: "USB — Backup Log Error Kemarin",
        status: "warn", statusText: "Log backup 3 bulan lalu",
        body: "Isi USB:\n• error_log_backup_jan.tar.gz (4.2 GB!)\n• error_log_backup_feb.tar.gz (3.8 GB)\n• error_log_backup_mar.tar.gz (5.1 GB)\n\nTOTAL: 13 GB log yang belum pernah dibersihkan!\nIni penyebab disk penuh.",
        theory: "Log server bisa sangat besar jika tidak dikelola. Best practice: konfigurasi logrotate untuk otomatis kompres dan hapus log lama. File konfigurasi: /etc/logrotate.conf",
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
    title: "Kantor Lurah Gelap Jaringannya",
    mission: "Jaringan 30 PC kantor lurah putus mendadak!",
    badge: "🔌 Network Fixer",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — Laporan Masuk Lagi",
        doorSign: "SERVER ROOM B",
        chars: [
          { id: "pak-heri", name: "Pak Heri" },
          { id: "pak-lurah", name: "Pak Lurah" }
        ],
        dialogOnEnter: "intro"
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room B — Kelurahan Cempaka",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        dialogOnEnter: "enter_sr",
        objects: [
          { id: "switch",      label: "Network Switch" },
          { id: "dhcp-server", label: "DHCP Server" },
          { id: "pc-lab",      label: "PC Staf Kantor" },
          { id: "ip-diagram",  label: "Diagram IP Kantor" },
          { id: "error-ticket", label: "Tiket Trouble" }
        ]
      }
    },

    dialogs: {
      intro: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Hari kedua magang. Semoga lebih tenang dari kemarin... *notifikasi masuk*" },
        { avatar: "😱", name: "Pak Heri", text: "ANDI! Pak Lurah telepon! Seluruh jaringan kantor kelurahan mati! Semua staf tidak bisa kerja, antrian warga numpuk!" },
        { avatar: "😤", name: "Pak Lurah", text: "Ini parah sekali! Kami sedang proses administrasi KTP massal — 200 warga sudah ngantri sejak pagi! Harus beres sebelum jam 12!" },
        { avatar: "😱", name: "Pak Heri", text: "Andi, kamu pergi ke server room kantor kelurahan. Sari sudah di sana duluan. Cepat ya!!" },
        { avatar: "😅", name: "Andi (Kamu)", text: "Siap, Pak! *dalam hati: dag-dig-dug lagi nih...*" }
      ],
      enter_sr: [
        { avatar: "😎", name: "Kak Sari", text: "Nah, kamu datang juga. Oke, situasinya: semua PC dapat IP 169.254.x.x — itu tanda DHCP server tidak merespons." },
        { avatar: "😎", name: "Kak Sari", text: "Ada dua kemungkinan: DHCP service mati, atau ada IP conflict. Cek switch dan server dulu, ya. Diagram IP ada di sudut sana." }
      ],
      char_pak_lurah: [
        { avatar: "😤", name: "Pak Lurah", text: "Bagaimana ini? Warga sudah marah-marah di depan. Sistem e-KTP tidak bisa diakses sama sekali!" },
        { avatar: "😤", name: "Pak Lurah", text: "Kalau tidak beres sampai jam 12, saya laporkan ke Wali Kota!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Lihat tiket trouble di meja — ada history-nya. Sepertinya kemarin ada yang iseng ganti IP statis di salah satu PC dan bentrok sama range DHCP." },
        { avatar: "😎", name: "Kak Sari", text: "Solusinya: restart DHCP server, dan kalau perlu perbaiki konfigurasi range IP-nya." }
      ]
    },

    items: {
      "switch": {
        icon: "🔀", title: "Switch 24-Port — Aktif tapi Aneh",
        status: "warn", statusText: "IP Conflict terdeteksi",
        body: "Switch log terakhir:\n⚠ IP Conflict: 192.168.2.50\n  → PC-Staf-03 vs DHCP Pool\n\nSemua port hijau (koneksi fisik OK).\nMasalah bukan kabel — ada konflik IP di jaringan!\n\nDHCP server perlu di-restart dan config dicek.",
        theory: "IP Conflict terjadi ketika dua perangkat menggunakan IP yang sama. Switch modern bisa mendeteksi ini. Solusinya: pastikan IP statis di luar range DHCP, atau pindahkan perangkat yang konflik ke IP lain.",
        triggerTerm: false
      },
      "dhcp-server": {
        icon: "🖥️", title: "DHCP Server — Service Crash",
        status: "err", statusText: "isc-dhcp-server: FAILED",
        body: "$ systemctl status isc-dhcp-server\n● isc-dhcp-server.service — FAILED\n   Active: failed (Result: exit-code)\n\nLog error:\nERROR: IP Conflict detected on 192.168.2.50\nERROR: Cannot allocate IP — pool exhausted or conflict\nAborted.\n\nDHCP crash karena konflik IP!",
        theory: "DHCP server bisa crash jika ada konflik di jaringan. Setelah mengatasi konflik, service perlu di-restart. Konfigurasi DHCP ada di /etc/dhcp/dhcpd.conf — pastikan range tidak bertabrakan dengan IP statis.",
        triggerTerm: true
      },
      "pc-lab": {
        icon: "💻", title: "PC Staf-03 — IP Conflict!",
        status: "err", statusText: "IP Statis Bertabrakan",
        body: "PC milik Staf Keuangan:\nIP dikonfigurasi manual: 192.168.2.50 (statis)\n\nMasalah: IP 192.168.2.50 ada di dalam range DHCP!\nRange DHCP: 192.168.2.20 – 192.168.2.200\n\nSolusi: ganti IP statis PC ini ke 192.168.2.5 (di luar range), lalu restart DHCP server.",
        theory: "Aturan penting: IP statis HARUS berada di luar range DHCP pool. Contoh: jika DHCP range 192.168.1.100–200, maka IP statis gunakan 192.168.1.2–99 atau 201–254.",
        triggerTerm: false
      },
      "ip-diagram": {
        icon: "🗺️", title: "Diagram IP Kantor Kelurahan",
        status: "ok", statusText: "📋 Referensi Konfigurasi",
        body: "Konfigurasi jaringan kantor:\n\nNetwork   : 192.168.2.0/24\nServer IP : 192.168.2.1 (statis)\nGateway   : 192.168.2.1\nDHCP Range: 192.168.2.20 – 192.168.2.200\nDNS       : 8.8.8.8 & 8.8.4.4\nIP Printer: 192.168.2.5 (statis, di luar range)\n\nIP statis HARUS di luar range DHCP!",
        theory: "Desain jaringan yang baik: pisahkan zona IP statis (server, printer) dan zona dinamis (DHCP). Contoh: .1–.19 untuk statis, .20–.200 untuk DHCP, .201–.254 cadangan.",
        triggerTerm: false
      },
      "error-ticket": {
        icon: "📋", title: "Tiket Trouble #2024-042",
        status: "warn", statusText: "Laporan kemarin",
        body: "Dilaporkan oleh: Staf Keuangan\nWaktu: kemarin 16:32\n\n\"Saya ganti IP komputer saya sendiri ke .50 biar lebih mudah diingat. Setelah itu jaringan kantor jadi error semua. Maaf.\"\n\n— Root cause ketemu!",
        theory: "",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "check-dhcp",    text: "Cek status DHCP server",          cmd: "systemctl status isc-dhcp-server" },
      { id: "check-conflict", text: "Identifikasi IP conflict",       cmd: "ip addr" },
      { id: "fix-config",    text: "Edit konfigurasi DHCP",           cmd: "nano /etc/dhcp/dhcpd.conf" },
      { id: "restart-dhcp",  text: "Restart DHCP service",            cmd: "systemctl restart isc-dhcp-server" },
      { id: "verify-dhcp",   text: "Verifikasi DHCP berjalan normal", cmd: "systemctl status isc-dhcp-server" }
    ],

    hints: [
      "Cek status DHCP: systemctl status isc-dhcp-server — lihat error log-nya.",
      "Penyebab crash: IP conflict. Edit config: nano /etc/dhcp/dhcpd.conf.",
      "Setelah fix config, restart: systemctl restart isc-dhcp-server"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 3 — Database Nilai Siswa Korup
  // ══════════════════════════════════════════
  {
    id: 3,
    title: "Nilai Raport Hilang Semua!",
    mission: "Database nilai siswa korup — raport tidak bisa dicetak!",
    badge: "🗄️ Database Savior",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — Situasi Makin Serius",
        doorSign: "SERVER ROOM C",
        chars: [
          { id: "pak-heri", name: "Pak Heri" },
          { id: "bu-guru", name: "Bu Retno" }
        ],
        dialogOnEnter: "intro"
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room C — Database Center",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        dialogOnEnter: "enter_sr",
        objects: [
          { id: "db-server",    label: "Database Server" },
          { id: "monitor-err",  label: "Monitor Error" },
          { id: "backup-drive", label: "Harddisk Backup" },
          { id: "mysql-log",    label: "MySQL Error Log" },
          { id: "recovery-usb", label: "USB Recovery Tools" }
        ]
      }
    },

    dialogs: {
      intro: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Seminggu magang, sudah selesaikan 2 krisis. Hari ini semoga---" },
        { avatar: "😭", name: "Bu Retno", text: "ANDI! Database nilai siswa HILANG! Hari ini jadwal cetak raport untuk 1.200 siswa! Data semester genap tidak bisa dibuka!" },
        { avatar: "😱", name: "Pak Heri", text: "MySQL server crash semalam karena mati lampu mendadak! Dan ternyata backup otomatis sudah tidak jalan selama 2 minggu! Aduh..." },
        { avatar: "😅", name: "Andi (Kamu)", text: "Tenang Bu, tenang Pak. Selama ada harddisk backup, pasti bisa recover. Aku cek dulu ke server room." },
        { avatar: "😭", name: "Bu Retno", text: "Orang tua siswa sudah antri dari pagi! Tolong ya, Andi... kamu satu-satunya harapan kami sekarang!" }
      ],
      enter_sr: [
        { avatar: "😎", name: "Kak Sari", text: "Oke, situasinya: MySQL corrupt karena mati lampu tiba-tiba. InnoDB table-nya rusak." },
        { avatar: "😎", name: "Kak Sari", text: "Kabar baiknya: ada harddisk backup dari 2 minggu lalu. Kita bisa repair table dulu — kalau gagal, restore dari backup. Cek semua perangkat dulu ya." }
      ],
      char_bu_guru: [
        { avatar: "😭", name: "Bu Retno", text: "Andi, nilai-nilai itu hasil kerja keras guru-guru selama satu semester... jangan sampai hilang ya." },
        { avatar: "😭", name: "Bu Retno", text: "Kalau berhasil recover, aku pastikan kamu dapat nilai PKL tertinggi!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Coba mysqlcheck dulu untuk repair — biasanya bisa recover. Kalau tidak, baru restore backup." },
        { avatar: "😎", name: "Kak Sari", text: "Command-nya ada di recovery USB. Jangan panik, MySQL recovery biasanya berhasil!" }
      ]
    },

    items: {
      "db-server": {
        icon: "🗄️", title: "MySQL Server — InnoDB Corrupt",
        status: "err", statusText: "Table corrupt — cannot open",
        body: "Status MySQL:\n● mysql.service — FAILED\nError: InnoDB corruption detected!\n\nDatabase yang bermasalah:\n• nilai_siswa → CORRUPTED ❌\n• data_guru → OK ✓\n• jadwal → OK ✓\n\nHanya tabel nilai_siswa yang corrupt.",
        theory: "InnoDB adalah storage engine MySQL default. Saat server mati mendadak (tanpa shutdown proper), InnoDB bisa corrupt karena transaksi yang belum selesai. Solusi: mysqlcheck untuk repair, atau restore backup.",
        triggerTerm: true
      },
      "monitor-err": {
        icon: "🖥", title: "Monitor — MySQL Error Detail",
        status: "err", statusText: "Crash log terlihat",
        body: "MySQL error log (/var/log/mysql/error.log):\n\n[ERROR] InnoDB: Corruption in the InnoDB tablespace\n[ERROR] Table './sekolah/nilai_siswa' is marked as crashed\n[ERROR] Attempting automatic repair...\n[ERROR] Repair failed. Manual repair needed.\n\nPerlu: mysqlcheck atau restore backup.",
        theory: "MySQL menyimpan error log di /var/log/mysql/error.log. Selalu cek log ini saat troubleshooting MySQL. Perintah: tail -100 /var/log/mysql/error.log",
        triggerTerm: false
      },
      "backup-drive": {
        icon: "💽", title: "Harddisk Backup — 2 Minggu Lalu",
        status: "warn", statusText: "Backup tersedia — agak lama",
        body: "Isi harddisk backup:\n• backup_nilai_siswa_2024-06-01.sql (856 MB)\n• backup_nilai_siswa_2024-05-15.sql (812 MB)\n\nBackup terakhir: 2 minggu lalu.\nData 2 minggu terakhir mungkin hilang jika harus restore.\n\nCoba repair dulu sebelum restore!",
        theory: "Best practice backup: jadwalkan minimal harian dengan cron job. Perintah backup MySQL: mysqldump -u root -p nama_db > backup.sql. Untuk restore: mysql -u root -p nama_db < backup.sql",
        triggerTerm: true
      },
      "mysql-log": {
        icon: "📋", title: "MySQL Log — Riwayat Crash",
        status: "warn", statusText: "PLN byar-pet kemarin",
        body: "Rekonstruksi kejadian:\n\n21:47 — PLN mati mendadak\n21:47 — Server shutdown tidak normal\n21:47 — MySQL tidak sempat flush data\n22:15 — Listrik kembali, server auto-restart\n22:16 — MySQL gagal start: InnoDB corrupt\n22:17 — Alert ke monitoring (tidak ada yang lihat)\n\nRoot cause: shutdown mendadak tanpa UPS.",
        theory: "UPS (Uninterruptible Power Supply) adalah perangkat WAJIB di server room untuk mencegah kerusakan akibat mati lampu. Tanpa UPS, server bisa corrupt database, kehilangan data, atau hardware rusak.",
        triggerTerm: false
      },
      "recovery-usb": {
        icon: "🔧", title: "USB Recovery Tools",
        status: "ok", statusText: "📋 Panduan Recovery MySQL",
        body: "Langkah recovery MySQL:\n\n1. systemctl stop mysql → stop dulu\n2. mysqlcheck -u root -p --all-databases --auto-repair → coba repair\n3. systemctl start mysql → coba jalankan\n4. mysql -u root -p -e \"SHOW TABLES\" sekolah → verifikasi\n5. (Jika gagal) mysql -u root -p sekolah < backup.sql → restore\n\nCoba repair dulu!",
        theory: "",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "stop-mysql",    text: "Stop MySQL service",                cmd: "systemctl stop mysql" },
      { id: "repair-db",     text: "Repair database yang corrupt",      cmd: "mysqlcheck -u root -p --all-databases --auto-repair" },
      { id: "start-mysql",   text: "Start MySQL service",               cmd: "systemctl start mysql" },
      { id: "verify-db",     text: "Verifikasi database bisa diakses",  cmd: "systemctl status mysql" },
      { id: "backup-config", text: "Setup backup otomatis (crontab)",   cmd: "crontab -e" }
    ],

    hints: [
      "Stop MySQL dulu sebelum repair: systemctl stop mysql",
      "Repair dengan: mysqlcheck -u root -p --all-databases --auto-repair",
      "Setelah repair, start ulang: systemctl start mysql"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 4 — Website Kota Kena Deface!
  // ══════════════════════════════════════════
  {
    id: 4,
    title: "Website Kota Netville Dihack!",
    mission: "Website resmi kota di-deface hacker — darurat keamanan!",
    badge: "🛡️ Security Guardian",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Dinas IT — SIAGA SATU!",
        doorSign: "SERVER ROOM KEAMANAN",
        chars: [
          { id: "pak-heri", name: "Pak Heri" },
          { id: "wali-kota", name: "Pak Wali Kota" }
        ],
        dialogOnEnter: "intro"
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Server Room — Security Center",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        dialogOnEnter: "enter_sr",
        objects: [
          { id: "defaced-web",  label: "Website Terdeface" },
          { id: "access-log",   label: "Apache Access Log" },
          { id: "firewall",     label: "UFW Firewall" },
          { id: "vuln-scan",    label: "Hasil Vulnerability Scan" },
          { id: "server-ssh",   label: "SSH Audit Report" }
        ]
      }
    },

    dialogs: {
      intro: [
        { avatar: "😱", name: "Pak Heri", text: "ANDI! DARURAT! Website netville.go.id di-deface! Tampilan diganti tulisan hacker! Sudah viral di Twitter!" },
        { avatar: "😤", name: "Pak Wali Kota", text: "INI MEMALUKAN! Website resmi kota penuh dengan tulisan 'HACKED BY XYZ'! Wartawan sudah menelepon! BERESIN SEKARANG!" },
        { avatar: "😱", name: "Pak Heri", text: "Andi, ini paling parah yang pernah kita alami. Firewall tidak aktif, ada file mencurigakan di server, website sudah diganti hacker." },
        { avatar: "😅", name: "Andi (Kamu)", text: "Baik Pak. Saya handle. Kak Sari, kita masuk server room — kita bersihkan dan amankan semuanya!" }
      ],
      enter_sr: [
        { avatar: "😎", name: "Kak Sari", text: "Oke, ini serius. Hacker masuk lewat celah di PHP yang tidak diupdate. Firewall memang belum aktif sejak migrasi server bulan lalu." },
        { avatar: "😎", name: "Kak Sari", text: "Langkah kita: identifikasi celah, bersihkan file hacker, aktifkan firewall, update sistem. Setiap detik penting — cek semua objek dulu." }
      ],
      char_wali_kota: [
        { avatar: "😤", name: "Pak Wali Kota", text: "Saya tidak mau tahu caranya. Saya mau website bersih dan sistem aman dalam 1 JAM. Mengerti?!" },
        { avatar: "😤", name: "Pak Wali Kota", text: "Dan saya ingin laporan tertulis — bagaimana ini bisa terjadi dan apa yang sudah dilakukan!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Prioritas: aktifkan UFW dulu, blokir IP hacker, baru bersihkan file defacement." },
        { avatar: "😎", name: "Kak Sari", text: "Setelah aman, update Apache dan PHP supaya celah yang sama tidak bisa dipakai lagi." }
      ]
    },

    items: {
      "defaced-web": {
        icon: "🌐", title: "Website netville.go.id — TERDEFACE",
        status: "err", statusText: "HACKED — Konten diganti",
        body: "Tampilan website saat ini:\n╔══════════════════════╗\n║  HACKED BY xX_N3T    ║\n║  SECURITY IS A JOKE  ║\n║  Defaced: 2024-06-18 ║\n║  Your firewall = 0   ║\n╚══════════════════════╝\n\nFile index.html sudah diganti!\nFile asli di: /var/www/html/index.html.bak",
        theory: "Website defacement adalah serangan di mana hacker mengganti tampilan website dengan pesan mereka. Biasanya lewat celah: SQL injection, RCE (Remote Code Execution), atau file upload vulnerability.",
        triggerTerm: true
      },
      "access-log": {
        icon: "📋", title: "Apache Access Log — Jejak Hacker",
        status: "err", statusText: "IP berbahaya teridentifikasi",
        body: "Log mencurigakan (/var/log/apache2/access.log):\n\n185.220.101.45 - POST /upload.php HTTP/1.1 200\n185.220.101.45 - GET /shell.php HTTP/1.1 200\n185.220.101.45 - GET /?cmd=ls HTTP/1.1 200\n185.220.101.45 - POST /shell.php HTTP/1.1 200\n\nIP Hacker: 185.220.101.45\nCelah masuk: file upload tidak terproteksi!",
        theory: "Apache access log menyimpan semua HTTP request. Ini adalah sumber forensik penting. Pola mencurigakan: banyak POST ke file .php tidak dikenal, atau request dengan parameter ?cmd=.",
        triggerTerm: false
      },
      "firewall": {
        icon: "🔥", title: "UFW Firewall — INACTIVE",
        status: "err", statusText: "Firewall OFF sejak migrasi",
        body: "$ ufw status\nStatus: inactive\n\nSemua 65,535 port terbuka!\nPort yang seharusnya ditutup:\n• 3306 (MySQL) — TERBUKA ❌\n• 8080 (Dev port) — TERBUKA ❌\n• Semua port lain — TERBUKA ❌\n\nHanya port 22 (SSH) dan 80 (HTTP) yang boleh terbuka!",
        theory: "Prinsip least privilege pada firewall: tutup SEMUA port, buka hanya yang diperlukan. Untuk web server publik: buka port 80 (HTTP), 443 (HTTPS), dan 22 (SSH) khusus IP admin.",
        triggerTerm: true
      },
      "vuln-scan": {
        icon: "🔍", title: "Vulnerability Scan — Hasil",
        status: "err", statusText: "3 celah kritis ditemukan",
        body: "Hasil scan (kemarin):\n\n[CRITICAL] PHP 7.2 — EOL, tidak dapat update keamanan\n[CRITICAL] upload.php tanpa validasi file type\n[HIGH]    Apache 2.4.29 — ada 4 CVE belum dipatch\n[MEDIUM]  Directory listing aktif di /var/www/html/\n\nRekomendasi: update semua, nonaktifkan upload.php",
        theory: "Vulnerability scan (menggunakan tool seperti Nikto, OpenVAS) menemukan celah keamanan. CVE (Common Vulnerabilities and Exposures) adalah database resmi kerentanan yang sudah diketahui publik.",
        triggerTerm: false
      },
      "server-ssh": {
        icon: "🔐", title: "SSH Audit — Konfigurasi Lemah",
        status: "warn", statusText: "SSH bisa dibrute-force",
        body: "Masalah konfigurasi SSH:\n• PermitRootLogin yes → berbahaya!\n• PasswordAuthentication yes → rentan brute-force\n• MaxAuthTries 6 → terlalu banyak\n• Port 22 → port default, mudah di-scan\n\nSudah ada 3,421 percobaan login gagal hari ini!",
        theory: "Best practice SSH: nonaktifkan login root (PermitRootLogin no), gunakan SSH key bukan password, ganti port default, dan batasi MaxAuthTries. Ini drastis mengurangi risiko brute-force.",
        triggerTerm: false
      }
    },

    objectives: [
      { id: "check-log",     text: "Analisis log untuk temukan IP hacker", cmd: "cat /var/log/apache2/access.log" },
      { id: "enable-ufw",    text: "Aktifkan UFW firewall",                cmd: "ufw enable" },
      { id: "allow-ports",   text: "Buka hanya port yang diperlukan",      cmd: "ufw allow 80" },
      { id: "block-hacker",  text: "Blokir IP hacker",                     cmd: "ufw deny from 185.220.101.45" },
      { id: "restore-web",   text: "Pulihkan file website asli",           cmd: "ufw status" }
    ],

    hints: [
      "Cek log dulu: cat /var/log/apache2/access.log — cari IP yang mencurigakan.",
      "Aktifkan firewall: ufw enable, lalu buka port 80: ufw allow 80.",
      "Blokir IP hacker: ufw deny from 185.220.101.45"
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 5 — BOSS: Datacenter Down Saat Event Kota!
  // ══════════════════════════════════════════
  {
    id: 5,
    title: "BOSS: Datacenter Lumpuh!",
    mission: "Semua sistem kota mati saat Event Hari Jadi Netville!",
    badge: "🏆 Master NetAdmin",
    startScene: "lobby",

    scenes: {
      lobby: {
        type: "corridor",
        label: "🏢 Datacenter Utama Kota Netville",
        doorSign: "MAIN DATACENTER — RESTRICTED",
        chars: [
          { id: "pak-heri", name: "Pak Heri" },
          { id: "wali-kota", name: "Pak Wali Kota" }
        ],
        dialogOnEnter: "intro"
      },
      serverroom: {
        type: "serverroom",
        label: "🖥️ Main Datacenter — BLACKOUT",
        chars: [
          { id: "kak-sari", name: "Kak Sari" }
        ],
        dialogOnEnter: "enter_sr",
        objects: [
          { id: "main-server",   label: "Server Utama Kota" },
          { id: "load-monitor",  label: "Load Monitor" },
          { id: "network-core",  label: "Core Network" },
          { id: "firewall-cfg",  label: "Firewall Config" },
          { id: "recovery-plan", label: "Disaster Recovery Plan" }
        ]
      }
    },

    dialogs: {
      intro: [
        { avatar: "😅", name: "Andi (Kamu)", text: "Hari terakhir magang. Pak Heri bilang ada Event Hari Jadi Kota — streaming langsung, 50.000 penonton online. Semoga lancar..." },
        { avatar: "🚨", name: "Pak Heri", text: "ANDI!!! DARURAT LEVEL MAXIMUM!! SEMUA SISTEM KOTA MATI!! E-government, CCTV kota, website streaming, semuanya DOWN!!" },
        { avatar: "😰", name: "Pak Wali Kota", text: "INI MEMALUKAN NASIONAL! Acara Hari Jadi Kota Netville ditonton LANGSUNG oleh Presiden! Dan sistemnya mati semua!!" },
        { avatar: "😰", name: "Pak Wali Kota", text: "Siapapun yang bisa beresin ini dalam 30 menit — dia adalah pahlawan kota Netville! SIAPA YANG BISA?!" },
        { avatar: "💪", name: "Andi (Kamu)", text: "Saya, Pak. Andi — siswa magang. Beri saya 30 menit, saya akan beresin semua sistem ini." },
        { avatar: "😎", name: "Kak Sari", text: "Keren Andi! Aku sudah diagnosa: traffic event overload firewall — salah rules. Ini challenging tapi kamu sudah handle 4 krisis sebelumnya. Kamu pasti bisa!" }
      ],
      enter_sr: [
        { avatar: "😎", name: "Kak Sari", text: "Situasinya: traffic 50K penonton streaming masuk serentak, firewall salah rules — DDoS protection-nya justru block traffic legit!" },
        { avatar: "😎", name: "Kak Sari", text: "Kita perlu: fix firewall rules, restart semua service berurutan, verifikasi semua sistem. Semua ilmu dari level 1-4 kamu butuhkan sekarang. GO!" }
      ],
      char_pak_heri: [
        { avatar: "😱", name: "Pak Heri", text: "Andi... aku yakin kamu bisa. Kamu sudah buktikan berkali-kali selama magang ini. Ini momen puncaknya!" },
        { avatar: "😱", name: "Pak Heri", text: "Presiden sedang nonton livestream yang error... tolong ya ANDI!!" }
      ],
      char_kak_sari: [
        { avatar: "😎", name: "Kak Sari", text: "Urutan perbaikan: 1) Perbaiki firewall rules, 2) Restart networking, 3) Restart semua service, 4) Verifikasi." },
        { avatar: "😎", name: "Kak Sari", text: "Setelah beres, kita juga perlu setup rate limiting supaya tidak overload lagi. Kamu sudah siap!" }
      ]
    },

    items: {
      "main-server": {
        icon: "💀", title: "Server Utama — SEMUA SERVICE DOWN",
        status: "err", statusText: "Total system failure",
        body: "Status semua service kota:\n• e-government.service  → FAILED ❌\n• streaming.service      → FAILED ❌\n• cctv-hub.service       → FAILED ❌\n• apache2.service        → FAILED ❌\n• mysql.service          → FAILED ❌\n• networking.service     → ERROR  ❌\n\nRoot cause: firewall rules salah blokir traffic internal!",
        theory: "Ketika semua service gagal sekaligus, selalu cari root cause di layer paling bawah: network. Jika network error, semua service di atasnya otomatis gagal karena tidak bisa bind ke interface.",
        triggerTerm: true
      },
      "load-monitor": {
        icon: "📊", title: "Load Monitor — Traffic Overload",
        status: "err", statusText: "50K request/detik",
        body: "Traffic saat ini:\n• Request/detik: 50,247 (EXTREME!)\n• Normal maksimum: 500 req/detik\n• CPU Load: 99.8%\n• RAM: 31.8 GB / 32 GB\n• Network: 9.8 Gbps / 10 Gbps\n\nFirewall DDoS protection aktif → tapi salah setting → block semua traffic termasuk yang legit!",
        theory: "Rate limiting dan DDoS protection harus dikonfigurasi dengan hati-hati. Jika threshold terlalu rendah, traffic normal pun terblokir (false positive). Gunakan UFW rate limiting: ufw limit ssh.",
        triggerTerm: false
      },
      "network-core": {
        icon: "🔌", title: "Core Network — Interface Error",
        status: "err", statusText: "eth0 DOWN — firewall block",
        body: "$ ip addr show eth0\neth0: <BROADCAST,MULTICAST> state DOWN\n\nPenyebab: firewall rules salah:\nufw deny from any → terlalu agresif!\nMemblokir SEMUA traffic termasuk loopback!\n\nHarus reset firewall rules dan konfigurasi ulang dengan benar.",
        theory: "Aturan firewall 'deny from any' tanpa exception akan memblokir seluruh traffic termasuk loopback (127.0.0.1) yang dibutuhkan sistem. Selalu test firewall rules di staging dulu!",
        triggerTerm: true
      },
      "firewall-cfg": {
        icon: "🔥", title: "UFW Config — Rules Salah Pasang",
        status: "err", statusText: "Rules terlalu restriktif",
        body: "Rules bermasalah yang terpasang:\n  ufw deny from any (SALAH!)\n  ufw deny to any   (SALAH!)\n\nRules yang BENAR seharusnya:\n  ufw allow 80/tcp     (HTTP)\n  ufw allow 443/tcp    (HTTPS)\n  ufw allow 22/tcp     (SSH)\n  ufw limit ssh        (rate limit brute force)\n  ufw deny from [IP hacker]\n\nReset dan pasang ulang!",
        theory: "UFW rules diproses dari atas ke bawah. 'deny from any' di awal akan memblokir segalanya. Urutan rules penting: taruh yang spesifik (allow) sebelum yang umum (deny).",
        triggerTerm: true
      },
      "recovery-plan": {
        icon: "📗", title: "Disaster Recovery Plan Kota Netville",
        status: "ok", statusText: "📋 Panduan Pemulihan Total",
        body: "EMERGENCY RECOVERY — 30 Menit:\n\n1. ufw reset → reset semua rules\n2. ufw allow 80 → HTTP\n3. ufw allow 22 → SSH\n4. ufw enable → aktifkan\n5. systemctl restart networking\n6. systemctl restart apache2\n7. systemctl restart mysql\n8. systemctl list-units --state=running → verifikasi\n\nTepuk dada — kamu Netville Hero!",
        theory: "Disaster Recovery Plan (DRP) adalah dokumen prosedur pemulihan saat terjadi bencana IT. DRP yang baik: tertulis jelas, dilatih berkala, dan mudah diikuti dalam kondisi panik sekalipun.",
        triggerTerm: true
      }
    },

    objectives: [
      { id: "reset-fw",      text: "Reset firewall rules yang salah",   cmd: "ufw reset" },
      { id: "setup-fw",      text: "Konfigurasi firewall dengan benar", cmd: "ufw allow 80" },
      { id: "restart-net",   text: "Pulihkan network interface",        cmd: "systemctl restart networking" },
      { id: "restart-web",   text: "Restart semua web services",        cmd: "systemctl restart apache2" },
      { id: "verify-all",    text: "Verifikasi semua sistem berjalan",  cmd: "systemctl list-units --state=running" }
    ],

    hints: [
      "Reset firewall dulu: ufw reset — hapus semua rules yang salah.",
      "Pasang rules yang benar: ufw allow 80, ufw allow 22, ufw enable.",
      "Lanjut restart services: systemctl restart networking → apache2 → mysql."
    ]
  }
];
