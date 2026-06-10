// ════════════════════════════════════════════
// TERMINAL ENGINE — NetAdmin Academy v3
// ════════════════════════════════════════════

const COMMANDS = {
  // ── Level 1 ──────────────────────────────
  "ip addr": {
    obj: "check-ip",
    out: [
      {t:"i", v:"1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536"},
      {t:"l", v:"    inet 127.0.0.1/8 scope host lo"},
      {t:"i", v:"2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500"},
      {t:"s", v:"    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0"},
      {t:"s", v:"\n✓ IP Address: 192.168.1.100"}
    ]
  },
  "ip address": {alias:"ip addr"},
  "ifconfig":   {alias:"ip addr"},

  "hostnamectl set-hostname netville-server": {
    obj: "set-hostname",
    out: [
      {t:"s", v:"✓ Hostname diubah → netville-server"},
      {t:"l", v:"  Verifikasi: ketik 'hostnamectl'"}
    ]
  },
  "hostnamectl": {
    out: [
      {t:"l", v:"   Static hostname: netville-server"},
      {t:"l", v:"  Operating System: Ubuntu 22.04.3 LTS"},
      {t:"s", v:"      Architecture: x86-64"}
    ]
  },

  "apt update": {
    obj: "update-system",
    out: [
      {t:"i", v:"Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease"},
      {t:"i", v:"Hit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease"},
      {t:"l", v:"Reading package lists... Done"},
      {t:"s", v:"✓ Sistem sudah up-to-date!"}
    ]
  },
  "sudo apt update":           {alias:"apt update"},
  "apt-get update":            {alias:"apt update"},
  "apt update && apt upgrade": {alias:"apt update"},

  "systemctl enable ssh": {
    obj: "enable-ssh",
    out: [
      {t:"i", v:"Synchronizing state of ssh.service..."},
      {t:"s", v:"Created symlink → /lib/systemd/system/ssh.service"},
      {t:"s", v:"✓ SSH diaktifkan — akan otomatis jalan saat boot"}
    ]
  },
  "systemctl enable sshd": {alias:"systemctl enable ssh"},

  "systemctl status ssh": {
    obj: "check-ssh",
    out: [
      {t:"s", v:"● ssh.service - OpenBSD Secure Shell server"},
      {t:"s", v:"     Loaded: loaded (/lib/systemd/system/ssh.service; enabled)"},
      {t:"s", v:"     Active: active (running) since Mon 2024-01-15 08:00:00 WIB"},
      {t:"l", v:"   Main PID: 1234 (sshd)"},
      {t:"s", v:"✓ SSH aktif di port 22"}
    ]
  },
  "systemctl status sshd": {alias:"systemctl status ssh"},

  // ── Level 2 ──────────────────────────────
  "apt install apache2": {
    obj: "install-apache",
    out: [
      {t:"i", v:"Reading package lists... Done"},
      {t:"i", v:"The following NEW packages will be installed: apache2"},
      {t:"i", v:"Unpacking apache2 (2.4.52-1ubuntu4.8) ..."},
      {t:"s", v:"Setting up apache2 (2.4.52-1ubuntu4.8) ..."},
      {t:"s", v:"✓ Apache2 berhasil diinstall!"}
    ]
  },
  "sudo apt install apache2": {alias:"apt install apache2"},

  "systemctl start apache2": {
    obj: "start-apache",
    out: [
      {t:"s", v:"✓ apache2.service berhasil dijalankan"},
      {t:"s", v:"  Web server berjalan di port 80"}
    ]
  },
  "systemctl enable apache2": {
    obj: "enable-apache",
    out: [
      {t:"s", v:"Created symlink → /lib/systemd/system/apache2.service"},
      {t:"s", v:"✓ Apache2 akan otomatis aktif saat server booting"}
    ]
  },
  "systemctl status apache2": {
    obj: "check-apache",
    out: [
      {t:"s", v:"● apache2.service - The Apache HTTP Server"},
      {t:"s", v:"     Loaded: loaded (/lib/systemd/system/apache2.service; enabled)"},
      {t:"s", v:"     Active: active (running) since Mon 2024-01-15 09:30:00 WIB"},
      {t:"l", v:"   Main PID: 5679 (apache2)"},
      {t:"s", v:"✓ Web server aktif di port 80 & 443"}
    ]
  },
  "curl http://localhost": {
    obj: "test-website",
    out: [
      {t:"s", v:"<!DOCTYPE html>"},
      {t:"s", v:"<html><head><title>SMK Netville — Pendaftaran Siswa Baru</title></head>"},
      {t:"s", v:"<body><h1>Selamat Datang di SMK Netville!</h1>"},
      {t:"s", v:"  <p>Pendaftaran siswa baru. Deadline: hari ini!</p>"},
      {t:"s", v:"</body></html>"},
      {t:"s", v:"\n✓ Website berhasil diakses! 🎉"}
    ]
  },
  "curl localhost":       {alias:"curl http://localhost"},
  "wget http://localhost":{alias:"curl http://localhost"},

  // ── Level 3 ──────────────────────────────
  "apt install isc-dhcp-server": {
    obj: "install-dhcp",
    out: [
      {t:"i", v:"Reading package lists... Done"},
      {t:"i", v:"The following NEW packages will be installed: isc-dhcp-server"},
      {t:"i", v:"Unpacking isc-dhcp-server (4.4.1-2.3) ..."},
      {t:"s", v:"✓ DHCP Server berhasil diinstall!"}
    ]
  },
  "sudo apt install isc-dhcp-server": {alias:"apt install isc-dhcp-server"},

  "nano /etc/dhcp/dhcpd.conf": {
    obj: "config-dhcp",
    out: [
      {t:"i", v:"[Membuka editor konfigurasi DHCP...]"},
      {t:"l", v:"subnet 192.168.10.0 netmask 255.255.255.0 {"},
      {t:"l", v:"    range 192.168.10.100 192.168.10.200;"},
      {t:"l", v:"    option routers 192.168.10.1;"},
      {t:"l", v:"    option domain-name-servers 8.8.8.8;"},
      {t:"l", v:"    default-lease-time 86400;"},
      {t:"l", v:"}"},
      {t:"s", v:"✓ Konfigurasi DHCP berhasil disimpan!"}
    ]
  },
  "vim /etc/dhcp/dhcpd.conf": {alias:"nano /etc/dhcp/dhcpd.conf"},
  "cat /etc/dhcp/dhcpd.conf": {alias:"nano /etc/dhcp/dhcpd.conf"},

  "systemctl restart isc-dhcp-server": {
    obj: "restart-dhcp",
    out: [
      {t:"s", v:"✓ isc-dhcp-server berhasil direstart"},
      {t:"s", v:"  DHCP aktif — membagi IP ke range 192.168.10.100-200"}
    ]
  },
  "apt install bind9": {
    obj: "install-dns",
    out: [
      {t:"i", v:"Reading package lists... Done"},
      {t:"i", v:"Unpacking bind9 (1:9.18.18-0ubuntu0.22.04.1) ..."},
      {t:"s", v:"✓ BIND9 DNS Server berhasil diinstall!"}
    ]
  },
  "sudo apt install bind9": {alias:"apt install bind9"},
  "systemctl status isc-dhcp-server": {
    obj: "check-dhcp",
    out: [
      {t:"s", v:"● isc-dhcp-server.service - ISC DHCP IPv4 server"},
      {t:"s", v:"     Active: active (running)"},
      {t:"s", v:"✓ DHCP aktif! PC lab sudah bisa dapat IP otomatis 🎉"}
    ]
  },

  // ── Level 4 ──────────────────────────────
  "cat /var/log/auth.log": {
    obj: "check-log",
    out: [
      {t:"w", v:"sshd: Failed password for root from 45.33.32.156 port 49832"},
      {t:"w", v:"sshd: Failed password for admin from 45.33.32.156 port 49833"},
      {t:"w", v:"sshd: Failed password for ubuntu from 45.33.32.156 port 49834"},
      {t:"e", v:"... (total 1.247 baris dari IP yang sama!)"},
      {t:"e", v:"\n⚠️ IP PENYERANG: 45.33.32.156 — Brute Force Attack!"}
    ]
  },
  "tail -f /var/log/auth.log":   {alias:"cat /var/log/auth.log"},
  "grep Failed /var/log/auth.log":{alias:"cat /var/log/auth.log"},

  "ufw enable": {
    obj: "enable-ufw",
    out: [
      {t:"w", v:"Command may disrupt existing ssh connections. Proceed? (y|n)? y"},
      {t:"s", v:"Firewall is active and enabled on system startup."},
      {t:"s", v:"✓ UFW Firewall DIAKTIFKAN!"}
    ]
  },
  "sudo ufw enable": {alias:"ufw enable"},

  "ufw allow ssh": {
    obj: "allow-ssh",
    out: [
      {t:"s", v:"Rules updated"},
      {t:"s", v:"✓ Port 22 (SSH) diizinkan untuk koneksi yang sah"}
    ]
  },
  "ufw allow 22":     {alias:"ufw allow ssh"},
  "ufw allow 22/tcp": {alias:"ufw allow ssh"},

  "ufw deny from 45.33.32.156": {
    obj: "block-attacker",
    out: [
      {t:"s", v:"Rules updated"},
      {t:"s", v:"✓ IP 45.33.32.156 DIBLOKIR! Penyerang tidak bisa masuk. 🛡️"}
    ]
  },
  "ufw status": {
    obj: "check-ufw",
    out: [
      {t:"s", v:"Status: active"},
      {t:"l", v:"To                  Action    From"},
      {t:"s", v:"22/tcp              ALLOW     Anywhere"},
      {t:"e", v:"Anywhere            DENY      45.33.32.156"},
      {t:"s", v:"\n✓ Firewall aktif. Penyerang diblokir! 🛡️"}
    ]
  },

  // ── Level 5 ──────────────────────────────
  "systemctl restart networking": {
    obj: "restart-net",
    out: [
      {t:"i", v:"Restarting network..."},
      {t:"s", v:"eth0: UP — IP: 192.168.1.100 ✓"},
      {t:"s", v:"Gateway: 192.168.1.1 ✓"},
      {t:"s", v:"✓ Network berhasil dipulihkan!"}
    ]
  },
  "systemctl restart network": {alias:"systemctl restart networking"},

  "systemctl restart apache2": {
    obj: "restart-web",
    out: [
      {t:"s", v:"✓ apache2.service direstart"},
      {t:"s", v:"  Web server aktif di port 80 ✓"}
    ]
  },

  "systemctl list-units --state=running": {
    obj: "verify-all",
    out: [
      {t:"l", v:"  UNIT                        LOAD   ACTIVE  DESCRIPTION"},
      {t:"l", v:"  ─────────────────────────────────────────────────────"},
      {t:"s", v:"  apache2.service             loaded active  Apache HTTP Server ✓"},
      {t:"s", v:"  ssh.service                 loaded active  OpenBSD Secure Shell ✓"},
      {t:"s", v:"  networking.service          loaded active  Raise network interfaces ✓"},
      {t:"s", v:"  ufw.service                 loaded active  Uncomplicated firewall ✓"},
      {t:"s", v:"  isc-dhcp-server.service     loaded active  ISC DHCP IPv4 server ✓"},
      {t:"s", v:"\n🎉 SEMUA SERVICE NORMAL! Server pulih 100%!"},
      {t:"s", v:"   Ujian nasional bisa dimulai! Kamu menyelamatkan hari ini! 🏆"}
    ]
  },

  // ── Utility ───────────────────────────────
  "help": {
    out: [
      {t:"i", v:"═══ NetAdmin Academy — Terminal Helper ═══"},
      {t:"l", v:""},
      {t:"l", v:"Lihat panel OBJEKTIF untuk petunjuk command."},
      {t:"i", v:"Tip: Tekan ↑↓ untuk history command."},
      {t:"i", v:"Tip: Tekan TAB untuk autocomplete."},
      {t:"l", v:""},
      {t:"l", v:"Command umum:"},
      {t:"l", v:"  ip addr          — Cek IP address"},
      {t:"l", v:"  systemctl ...    — Kelola service"},
      {t:"l", v:"  apt install ...  — Install paket"},
      {t:"l", v:"  ufw ...          — Kelola firewall"},
      {t:"l", v:"  clear            — Bersihkan terminal"}
    ]
  },
  "clear": {clear:true, out:[]},
  "cls":   {clear:true, out:[]},
  "ls":    {out:[{t:"l", v:"bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var"}]},
  "ls /":  {alias:"ls"},
  "pwd":   {out:[{t:"l", v:"/root"}]},
  "whoami":{out:[{t:"s", v:"root"}]},
  "uname -a": {
    out:[{t:"l", v:"Linux netville-server 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux"}]
  },
  "date": {
    out:[{t:"l", v: () => new Date().toLocaleString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}) + ' WIB'}]
  },
  "uptime": {
    out:[{t:"l", v:" 08:00:00 up 2:00,  1 user,  load average: 0.08, 0.05, 0.01"}]
  },
  "df -h": {
    out:[
      {t:"l", v:"Filesystem   Size  Used Avail Use% Mounted on"},
      {t:"l", v:"/dev/sda1     50G  8.2G   39G  18% /"},
      {t:"s", v:"Disk usage normal."}
    ]
  },
  "free -h": {
    out:[
      {t:"l", v:"               total  used  free"},
      {t:"l", v:"Mem:           7.7Gi 1.2Gi 5.8Gi"},
      {t:"s", v:"RAM usage normal."}
    ]
  },
  "ping google.com": {
    out:[
      {t:"i", v:"PING google.com (142.250.190.46) 56 bytes"},
      {t:"s", v:"64 bytes from 142.250.190.46: icmp_seq=1 time=12.3 ms"},
      {t:"s", v:"64 bytes from 142.250.190.46: icmp_seq=2 time=11.8 ms"},
      {t:"s", v:"2 packets transmitted, 2 received, 0% packet loss"}
    ]
  },
  "exit": {out:[{t:"w", v:"Ketik tombol ✕ untuk menutup terminal."}]}
};

// ── Terminal singleton ─────────────────────
const Terminal = (() => {
  let cmdHistory = [];
  let histIdx    = -1;
  let booted     = false;

  function init() {
    const input = document.getElementById('trm-in');
    if (!input) return;
    input.addEventListener('keydown', onKey);
  }

  function onKey(e) {
    const input = document.getElementById('trm-in');
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      if (!raw) return;
      cmdHistory.unshift(raw);
      if (cmdHistory.length > 50) cmdHistory.pop();
      histIdx = -1;
      printLine('root@netville:~# ' + raw, 'p');
      runCmd(raw);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) input.value = cmdHistory[++histIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdx > 0 ? input.value = cmdHistory[--histIdx] : (histIdx = -1, input.value = '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.toLowerCase();
      if (!partial) return;
      const match = Object.keys(COMMANDS).find(c => c.startsWith(partial) && c !== partial);
      if (match) input.value = match;
    }
  }

  function runCmd(raw) {
    const key  = raw.trim().toLowerCase();
    let data   = COMMANDS[key];
    if (data && data.alias) data = COMMANDS[data.alias.toLowerCase()];

    if (!data) {
      printLine(`bash: ${raw}: command not found`, 'e');
      printLine("Ketik 'help' untuk bantuan.", 'w');
      return;
    }

    if (data.clear) {
      document.getElementById('trm-out').innerHTML = '';
      return;
    }

    const D = 65;
    data.out.forEach((line, i) => {
      setTimeout(() => {
        const v = typeof line.v === 'function' ? line.v() : line.v;
        printLine(v, line.t);
      }, i * D);
    });

    if (data.obj) {
      setTimeout(() => completeObjective(data.obj), data.out.length * D + 120);
    }
  }

  function printLine(text, type) {
    const out = document.getElementById('trm-out');
    const div = document.createElement('div');
    const cls = {l:'tl', e:'te', w:'tw', i:'ti', s:'ts', p:'tp'}[type] || 'tl';
    div.className = cls;
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function boot() {
    if (booted) return;
    booted = true;
    printLine('NetAdmin Academy — Terminal Virtual', 'i');
    printLine('Ubuntu Server 22.04.3 LTS', 'l');
    printLine("Ketik 'help' untuk daftar perintah.", 'i');
    printLine('', 'l');
  }

  function reset() {
    document.getElementById('trm-out').innerHTML = '';
    booted = false;
    cmdHistory = [];
    histIdx = -1;
  }

  return { init, boot, reset, printLine, runCmd };
})();

// Init terminal input listener on DOM ready
document.addEventListener('DOMContentLoaded', () => Terminal.init());
