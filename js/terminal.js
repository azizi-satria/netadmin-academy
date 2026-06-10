// ============================================
// TERMINAL VIRTUAL ENGINE — NetAdmin Academy
// ============================================

const COMMANDS = {

  // ── LEVEL 1: Konfigurasi Dasar ──────────────

  "ip addr": {
    objective: "check-ip",
    output: [
      { t: "info",    v: "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue" },
      { t: "line",    v: "    inet 127.0.0.1/8 scope host lo" },
      { t: "info",    v: "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500" },
      { t: "success", v: "    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0" },
      { t: "success", v: "\n✓ IP Address ditemukan: 192.168.1.100" }
    ]
  },

  "ip address": {
    alias: "ip addr"
  },

  "ifconfig": {
    objective: "check-ip",
    output: [
      { t: "info",    v: "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500" },
      { t: "success", v: "      inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255" },
      { t: "line",    v: "      ether 08:00:27:12:34:56  txqueuelen 1000" },
      { t: "success", v: "\n✓ IP Address: 192.168.1.100" }
    ]
  },

  "hostnamectl set-hostname netville-server": {
    objective: "set-hostname",
    output: [
      { t: "success", v: "✓ Hostname berhasil diubah menjadi: netville-server" },
      { t: "line",    v: "  Ketik 'hostnamectl' untuk verifikasi." }
    ]
  },

  "hostnamectl": {
    output: [
      { t: "line",    v: "   Static hostname: netville-server" },
      { t: "line",    v: "         Icon name: computer-server" },
      { t: "line",    v: "  Operating System: Ubuntu 22.04.3 LTS" },
      { t: "line",    v: "            Kernel: Linux 5.15.0-91-generic" },
      { t: "success", v: "      Architecture: x86-64" }
    ]
  },

  "apt update": {
    objective: "update-system",
    output: [
      { t: "info",    v: "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease" },
      { t: "info",    v: "Hit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease" },
      { t: "info",    v: "Hit:3 http://archive.ubuntu.com/ubuntu jammy-updates InRelease" },
      { t: "line",    v: "Reading package lists... Done" },
      { t: "success", v: "Building dependency tree... Done" },
      { t: "success", v: "✓ Sistem sudah up-to-date!" }
    ]
  },

  "apt update && apt upgrade": { alias: "apt update" },
  "sudo apt update": { alias: "apt update" },
  "sudo apt-get update": { alias: "apt update" },

  "systemctl enable ssh": {
    objective: "enable-ssh",
    output: [
      { t: "info",    v: "Synchronizing state of ssh.service with SysV service script..." },
      { t: "success", v: "Created symlink /etc/systemd/system/sshd.service -> /lib/systemd/system/ssh.service" },
      { t: "success", v: "✓ SSH diaktifkan. Akan otomatis berjalan saat server dinyalakan." }
    ]
  },

  "systemctl enable sshd": { alias: "systemctl enable ssh" },

  "systemctl status ssh": {
    objective: "check-ssh",
    output: [
      { t: "success", v: "● ssh.service - OpenBSD Secure Shell server" },
      { t: "success", v: "     Loaded: loaded (/lib/systemd/system/ssh.service; enabled)" },
      { t: "success", v: "     Active: active (running) since Mon 2024-01-15 08:00:00 WIB; 2h ago" },
      { t: "line",    v: "   Main PID: 1234 (sshd)" },
      { t: "line",    v: "      Tasks: 1 (limit: 2220)" },
      { t: "success", v: "✓ SSH aktif dan berjalan di port 22" }
    ]
  },

  "systemctl status sshd": { alias: "systemctl status ssh" },

  // ── LEVEL 2: Apache Web Server ────────────────

  "apt install apache2": {
    objective: "install-apache",
    output: [
      { t: "info",    v: "Reading package lists... Done" },
      { t: "info",    v: "Building dependency tree... Done" },
      { t: "line",    v: "The following NEW packages will be installed:" },
      { t: "line",    v: "  apache2 apache2-data apache2-utils libapache2-mod-php" },
      { t: "info",    v: "Unpacking apache2 (2.4.52-1ubuntu4.8) ..." },
      { t: "success", v: "Setting up apache2 (2.4.52-1ubuntu4.8) ..." },
      { t: "success", v: "✓ Apache2 berhasil diinstall!" }
    ]
  },

  "sudo apt install apache2": { alias: "apt install apache2" },

  "systemctl start apache2": {
    objective: "start-apache",
    output: [
      { t: "success", v: "✓ apache2.service berhasil dijalankan." },
      { t: "success", v: "  Web server sekarang berjalan di port 80." }
    ]
  },

  "systemctl enable apache2": {
    objective: "enable-apache",
    output: [
      { t: "info",    v: "Synchronizing state of apache2.service..." },
      { t: "success", v: "Created symlink /etc/systemd/system/multi-user.target.wants/apache2.service" },
      { t: "success", v: "✓ Apache2 akan otomatis aktif saat server booting." }
    ]
  },

  "systemctl status apache2": {
    objective: "check-apache",
    output: [
      { t: "success", v: "● apache2.service - The Apache HTTP Server" },
      { t: "success", v: "     Loaded: loaded (/lib/systemd/system/apache2.service; enabled)" },
      { t: "success", v: "     Active: active (running) since Mon 2024-01-15 09:30:00 WIB; 5min ago" },
      { t: "line",    v: "    Process: 5678 ExecStart=/usr/sbin/apachectl start" },
      { t: "line",    v: "   Main PID: 5679 (apache2)" },
      { t: "success", v: "✓ Web server aktif di port 80 dan 443" }
    ]
  },

  "curl http://localhost": {
    objective: "test-website",
    output: [
      { t: "success", v: "<!DOCTYPE html>" },
      { t: "success", v: "<html><head><title>SMK Netville — Pendaftaran Siswa Baru</title></head>" },
      { t: "success", v: "<body>" },
      { t: "success", v: "  <h1>Selamat Datang di SMK Netville!</h1>" },
      { t: "success", v: "  <p>Pendaftaran siswa baru dibuka. Deadline: hari ini!</p>" },
      { t: "success", v: "</body></html>" },
      { t: "success", v: "\n✓ Website berhasil diakses! Apache berjalan normal 🎉" }
    ]
  },

  "curl localhost": { alias: "curl http://localhost" },
  "wget http://localhost": { alias: "curl http://localhost" },

  // ── LEVEL 3: DHCP & DNS ──────────────────────

  "apt install isc-dhcp-server": {
    objective: "install-dhcp",
    output: [
      { t: "info",    v: "Reading package lists... Done" },
      { t: "info",    v: "The following NEW packages will be installed: isc-dhcp-server" },
      { t: "info",    v: "Unpacking isc-dhcp-server (4.4.1-2.3) ..." },
      { t: "success", v: "Setting up isc-dhcp-server (4.4.1-2.3) ..." },
      { t: "success", v: "✓ DHCP Server berhasil diinstall!" }
    ]
  },

  "sudo apt install isc-dhcp-server": { alias: "apt install isc-dhcp-server" },

  "nano /etc/dhcp/dhcpd.conf": {
    objective: "config-dhcp",
    output: [
      { t: "info",    v: "[Membuka editor konfigurasi DHCP...]" },
      { t: "line",    v: "" },
      { t: "line",    v: "subnet 192.168.10.0 netmask 255.255.255.0 {" },
      { t: "line",    v: "    range 192.168.10.100 192.168.10.200;" },
      { t: "line",    v: "    option routers 192.168.10.1;" },
      { t: "line",    v: "    option domain-name-servers 8.8.8.8;" },
      { t: "line",    v: "    default-lease-time 86400;" },
      { t: "line",    v: "}" },
      { t: "line",    v: "" },
      { t: "success", v: "✓ Konfigurasi DHCP berhasil disimpan!" }
    ]
  },

  "vim /etc/dhcp/dhcpd.conf":  { alias: "nano /etc/dhcp/dhcpd.conf" },
  "cat /etc/dhcp/dhcpd.conf":  { alias: "nano /etc/dhcp/dhcpd.conf" },

  "systemctl restart isc-dhcp-server": {
    objective: "restart-dhcp",
    output: [
      { t: "success", v: "✓ isc-dhcp-server berhasil direstart." },
      { t: "success", v: "  DHCP aktif dan siap membagi IP ke range 192.168.10.100-200." }
    ]
  },

  "apt install bind9": {
    objective: "install-dns",
    output: [
      { t: "info",    v: "Reading package lists... Done" },
      { t: "info",    v: "The following NEW packages will be installed: bind9 bind9-utils dns-root-data" },
      { t: "info",    v: "Unpacking bind9 (1:9.18.18-0ubuntu0.22.04.1) ..." },
      { t: "success", v: "Setting up bind9 ..." },
      { t: "success", v: "✓ BIND9 DNS Server berhasil diinstall!" }
    ]
  },

  "sudo apt install bind9": { alias: "apt install bind9" },

  "systemctl status isc-dhcp-server": {
    objective: "check-dhcp",
    output: [
      { t: "success", v: "● isc-dhcp-server.service - ISC DHCP IPv4 server" },
      { t: "success", v: "     Loaded: loaded (/lib/systemd/system/isc-dhcp-server.service; enabled)" },
      { t: "success", v: "     Active: active (running) since Mon 2024-01-15 10:00:00 WIB" },
      { t: "success", v: "✓ DHCP Server aktif! Komputer lab sudah bisa dapat IP otomatis 🎉" }
    ]
  },

  // ── LEVEL 4: Firewall ────────────────────────

  "cat /var/log/auth.log": {
    objective: "check-log",
    output: [
      { t: "warn",  v: "Jan 15 23:45:01 netville sshd[9876]: Failed password for root from 45.33.32.156 port 49832" },
      { t: "warn",  v: "Jan 15 23:45:02 netville sshd[9876]: Failed password for admin from 45.33.32.156 port 49833" },
      { t: "warn",  v: "Jan 15 23:45:03 netville sshd[9876]: Failed password for ubuntu from 45.33.32.156 port 49834" },
      { t: "error", v: "... (total 1.247 baris dari IP yang sama!)" },
      { t: "error", v: "\n⚠️  IP PENYERANG TERIDENTIFIKASI: 45.33.32.156" },
      { t: "warn",  v: "   Jenis serangan: SSH Brute Force Attack" }
    ]
  },

  "tail -f /var/log/auth.log": { alias: "cat /var/log/auth.log" },
  "grep 'Failed' /var/log/auth.log": { alias: "cat /var/log/auth.log" },

  "ufw enable": {
    objective: "enable-ufw",
    output: [
      { t: "warn",    v: "Command may disrupt existing ssh connections. Proceed with operation (y|n)? y" },
      { t: "success", v: "Firewall is active and enabled on system startup." },
      { t: "success", v: "✓ UFW Firewall berhasil DIAKTIFKAN!" }
    ]
  },

  "sudo ufw enable": { alias: "ufw enable" },

  "ufw allow ssh": {
    objective: "allow-ssh",
    output: [
      { t: "success", v: "Rules updated" },
      { t: "success", v: "Rules updated (v6)" },
      { t: "success", v: "✓ Port 22 (SSH) diizinkan untuk koneksi yang sah." }
    ]
  },

  "ufw allow 22": { alias: "ufw allow ssh" },
  "ufw allow 22/tcp": { alias: "ufw allow ssh" },

  "ufw deny from 45.33.32.156": {
    objective: "block-attacker",
    output: [
      { t: "success", v: "Rules updated" },
      { t: "success", v: "✓ IP 45.33.32.156 berhasil DIBLOKIR! Penyerang tidak bisa masuk lagi." },
      { t: "success", v: "  Server aman dari serangan brute force ini. 🛡️" }
    ]
  },

  "ufw deny 45.33.32.156": { alias: "ufw deny from 45.33.32.156" },

  "ufw status": {
    objective: "check-ufw",
    output: [
      { t: "success", v: "Status: active" },
      { t: "line",    v: "" },
      { t: "line",    v: "To                         Action      From" },
      { t: "line",    v: "--                         ------      ----" },
      { t: "success", v: "22/tcp                     ALLOW       Anywhere" },
      { t: "error",   v: "Anywhere                   DENY        45.33.32.156" },
      { t: "success", v: "\n✓ Firewall aktif. Penyerang telah diblokir! 🛡️" }
    ]
  },

  // ── LEVEL 5: Boss Level ─────────────────────

  "systemctl restart networking": {
    objective: "restart-network",
    output: [
      { t: "info",    v: "Restarting network configuration..." },
      { t: "success", v: "eth0: UP — IP: 192.168.1.100 ✓" },
      { t: "success", v: "Gateway: 192.168.1.1 ✓" },
      { t: "success", v: "DNS: 8.8.8.8 ✓" },
      { t: "success", v: "✓ Network berhasil dipulihkan!" }
    ]
  },

  "systemctl restart network": { alias: "systemctl restart networking" },

  "systemctl restart apache2": {
    objective: "restart-apache2",
    output: [
      { t: "success", v: "✓ apache2.service berhasil direstart." },
      { t: "success", v: "  Web server aktif di port 80." }
    ]
  },

  "systemctl restart ssh": {
    objective: "restart-ssh2",
    output: [
      { t: "success", v: "✓ ssh.service berhasil direstart." },
      { t: "success", v: "  SSH aktif di port 22." }
    ]
  },

  "systemctl restart sshd": { alias: "systemctl restart ssh" },

  "ufw status verbose": {
    objective: "check-ufw2",
    output: [
      { t: "success", v: "Status: active" },
      { t: "line",    v: "Logging: on (low)" },
      { t: "line",    v: "Default: deny (incoming), allow (outgoing), disabled (routed)" },
      { t: "line",    v: "" },
      { t: "success", v: "     To                         Action      From" },
      { t: "success", v: "80/tcp                         ALLOW IN    Anywhere  ← HTTP ✓" },
      { t: "success", v: "443/tcp                        ALLOW IN    Anywhere  ← HTTPS ✓" },
      { t: "success", v: "22/tcp                         ALLOW IN    Anywhere  ← SSH ✓" },
      { t: "success", v: "\n✓ Semua port penting terbuka. Traffic ujian tidak terblokir!" }
    ]
  },

  "systemctl list-units --state=running": {
    objective: "test-all",
    output: [
      { t: "line",    v: "  UNIT                        LOAD   ACTIVE SUB     DESCRIPTION" },
      { t: "line",    v: "  ──────────────────────────────────────────────────────────────" },
      { t: "success", v: "  apache2.service             loaded active running The Apache HTTP Server ✓" },
      { t: "success", v: "  ssh.service                 loaded active running OpenBSD Secure Shell server ✓" },
      { t: "success", v: "  networking.service          loaded active running Raise network interfaces ✓" },
      { t: "success", v: "  ufw.service                 loaded active running Uncomplicated firewall ✓" },
      { t: "success", v: "  isc-dhcp-server.service     loaded active running ISC DHCP IPv4 server ✓" },
      { t: "success", v: "\n🎉 SEMUA SERVICE BERJALAN NORMAL! Server pulih 100%!" },
      { t: "success", v: "   Ujian nasional bisa dimulai! Kamu menyelamatkan hari ini!" }
    ]
  },

  // ── Utility Commands ────────────────────────

  "help": {
    output: [
      { t: "info",    v: "═══ NetAdmin Academy — Terminal Helper ═══" },
      { t: "line",    v: "" },
      { t: "line",    v: "Gunakan command Linux nyata untuk menyelesaikan misi." },
      { t: "info",    v: "Lihat panel OBJEKTIF di kanan untuk petunjuk command." },
      { t: "line",    v: "" },
      { t: "line",    v: "Command umum yang tersedia:" },
      { t: "line",    v: "  ip addr          — Cek IP address" },
      { t: "line",    v: "  systemctl ...    — Kelola service" },
      { t: "line",    v: "  apt install ...  — Install paket" },
      { t: "line",    v: "  ufw ...          — Kelola firewall" },
      { t: "line",    v: "  clear            — Bersihkan layar" },
      { t: "info",    v: "\n💡 Tips: Klik objek di scene untuk petunjuk tambahan!" }
    ]
  },

  "clear": { clear: true, output: [] },
  "cls":   { clear: true, output: [] },

  "ls": {
    output: [{ t: "line", v: "bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var" }]
  },

  "ls /": { alias: "ls" },
  "ls -la": {
    output: [
      { t: "line", v: "total 80" },
      { t: "line", v: "drwxr-xr-x  20 root root 4096 Jan 15 08:00 ." },
      { t: "line", v: "drwxr-xr-x   2 root root 4096 Jan 15 08:00 bin" },
      { t: "line", v: "drwxr-xr-x   5 root root 4096 Jan 15 08:00 etc" },
      { t: "line", v: "drwxr-xr-x   3 root root 4096 Jan 15 08:00 var" }
    ]
  },

  "pwd":    { output: [{ t: "line", v: "/root" }] },
  "whoami": { output: [{ t: "success", v: "root" }] },

  "uname -a": {
    output: [{ t: "line", v: "Linux netville-server 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux" }]
  },

  "date": {
    output: [{ t: "line", v: () => new Date().toLocaleString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) + ' WIB' }]
  },

  "uptime": {
    output: [{ t: "line", v: " 08:00:00 up 2:00,  1 user,  load average: 0.08, 0.05, 0.01" }]
  },

  "df -h": {
    output: [
      { t: "line", v: "Filesystem      Size  Used Avail Use% Mounted on" },
      { t: "line", v: "/dev/sda1        50G  8.2G   39G  18% /" },
      { t: "success", v: "Disk usage normal. Ruang cukup." }
    ]
  },

  "free -h": {
    output: [
      { t: "line", v: "               total        used        free" },
      { t: "line", v: "Mem:           7.7Gi       1.2Gi       5.8Gi" },
      { t: "success", v: "RAM usage normal." }
    ]
  },

  "ping google.com": {
    output: [
      { t: "info",    v: "PING google.com (142.250.190.46) 56(84) bytes of data." },
      { t: "success", v: "64 bytes from 142.250.190.46: icmp_seq=1 ttl=118 time=12.3 ms" },
      { t: "success", v: "64 bytes from 142.250.190.46: icmp_seq=2 ttl=118 time=11.8 ms" },
      { t: "success", v: "--- google.com ping statistics ---" },
      { t: "success", v: "2 packets transmitted, 2 received, 0% packet loss" }
    ]
  },

  "exit": {
    output: [{ t: "warn", v: "Logout dari terminal. Ketik perintah untuk masuk kembali." }]
  }
};

// ============================================
// TERMINAL FUNCTIONS
// ============================================

let commandHistory = [];
let historyIndex = -1;

function initTerminal() {
  const input = document.getElementById('terminal-input');
  input.addEventListener('keydown', handleTerminalKey);
}

function handleTerminalKey(e) {
  const input = document.getElementById('terminal-input');

  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (!cmd) return;
    commandHistory.unshift(cmd);
    historyIndex = -1;
    printToTerminal('root@netville:~# ' + cmd, 'prompt');
    processCommand(cmd);
    input.value = '';
    return;
  }

  // History navigation
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    }
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    } else {
      historyIndex = -1;
      input.value = '';
    }
    return;
  }

  // Tab autocomplete (basic)
  if (e.key === 'Tab') {
    e.preventDefault();
    const partial = input.value.toLowerCase();
    const match = Object.keys(COMMANDS).find(c => c.startsWith(partial) && c !== partial);
    if (match) input.value = match;
  }
}

function processCommand(rawCmd) {
  const cmd = rawCmd.trim().toLowerCase();
  let data = COMMANDS[cmd];

  // Resolve alias
  if (data && data.alias) {
    data = COMMANDS[data.alias.toLowerCase()];
  }

  if (!data) {
    printToTerminal(`bash: ${rawCmd}: command not found`, 'error');
    printToTerminal(`Ketik 'help' untuk daftar command yang tersedia.`, 'warn');
    return;
  }

  if (data.clear) {
    document.getElementById('terminal-output').innerHTML = '';
    return;
  }

  const delay = 70;
  data.output.forEach((line, i) => {
    setTimeout(() => {
      const text = typeof line.v === 'function' ? line.v() : line.v;
      printToTerminal(text, line.t || 'line');
    }, i * delay);
  });

  if (data.objective) {
    setTimeout(() => {
      completeObjective(data.objective);
    }, data.output.length * delay + 150);
  }
}

function printToTerminal(text, type = 'line') {
  const output = document.getElementById('terminal-output');
  const div = document.createElement('div');
  div.className = 't-' + type;
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function openTerminal() {
  const terminal = document.getElementById('terminal-area');
  terminal.classList.remove('hidden');
  document.getElementById('inspect-popup').classList.add('hidden');
  setTimeout(() => document.getElementById('terminal-input').focus(), 80);

  if (document.getElementById('terminal-output').children.length === 0) {
    printToTerminal('NetAdmin Academy — Terminal Virtual', 'info');
    printToTerminal('Ubuntu 22.04.3 LTS — netville-server', 'line');
    printToTerminal("Ketik 'help' untuk bantuan.\n", 'info');
  }
}

function closeTerminal() {
  document.getElementById('terminal-area').classList.add('hidden');
}
