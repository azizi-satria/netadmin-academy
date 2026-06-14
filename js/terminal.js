// ════════════════════════════════════════════
// TERMINAL ENGINE — NetAdmin Academy v3
// ════════════════════════════════════════════

const COMMANDS = {

  // ══════════════════════════════════════════
  // LEVEL 1 — Disk penuh, Apache mati
  // ══════════════════════════════════════════
  "df -h": {
    obj: "check-disk",
    out: [
      {t:"l", v:"Filesystem      Size  Used Avail Use% Mounted on"},
      {t:"e", v:"/dev/sda1        50G   50G     0 100% /   ← PENUH!"},
      {t:"l", v:"tmpfs           3.9G     0  3.9G   0% /dev/shm"},
      {t:"e", v:"\n⚠️  Disk 100% penuh! Ini penyebab Apache crash!"}
    ]
  },
  "du -sh /var/log/*": {
    obj: "check-log-size",
    out: [
      {t:"e", v:"13G\t/var/log/apache2"},
      {t:"w", v:"812M\t/var/log/syslog"},
      {t:"l", v:"240K\t/var/log/auth.log"},
      {t:"e", v:"\n⚠️  /var/log/apache2 memakan 13GB! Itu penyebab disk penuh."},
      {t:"i", v:"  Gunakan journalctl --vacuum-size=100M untuk bersihkan."}
    ]
  },
  "du -sh /var/log": {alias:"du -sh /var/log/*"},

  "journalctl --vacuum-size=100m": {
    obj: "clean-journal",
    out: [
      {t:"i", v:"Vacuuming done, freed 12.7G of archived journals on disk."},
      {t:"s", v:"✓ Log lama berhasil dibersihkan — 12.7GB ruang dikosongkan!"},
      {t:"s", v:"  Disk sekarang: 38G free. Apache bisa jalan kembali."}
    ]
  },
  "journalctl --vacuum-size=100M": {alias:"journalctl --vacuum-size=100m"},
  "journalctl --vacuum-time=7d":   {alias:"journalctl --vacuum-size=100m"},
  "rm -rf /var/log/apache2/*.gz":  {alias:"journalctl --vacuum-size=100m"},
  "rm -f /var/log/apache2/*.gz":   {alias:"journalctl --vacuum-size=100m"},

  "systemctl restart apache2": {
    objs: ["restart-apache", "restart-web"],
    out: [
      {t:"i", v:"Stopping apache2.service..."},
      {t:"s", v:"Starting apache2.service..."},
      {t:"s", v:"✓ apache2.service berhasil direstart!"},
      {t:"s", v:"  Web server aktif di port 80 ✓"}
    ]
  },
  "service apache2 restart": {alias:"systemctl restart apache2"},

  "curl http://localhost": {
    objs: ["test-web", "test-website"],
    out: [
      {t:"s", v:"HTTP/1.1 200 OK"},
      {t:"s", v:"Content-Type: text/html; charset=UTF-8"},
      {t:"l", v:""},
      {t:"s", v:"<!DOCTYPE html>"},
      {t:"s", v:"<html><head><title>SMKN 1 Netville — Portal Ujian</title></head>"},
      {t:"s", v:"<body><h1>Portal Ujian Online — Selamat Datang!</h1></body></html>"},
      {t:"s", v:"\n🎉 Website berhasil diakses! Ujian online bisa dimulai!"}
    ]
  },
  "curl localhost":        {alias:"curl http://localhost"},
  "wget http://localhost": {alias:"curl http://localhost"},
  "curl -I localhost":     {alias:"curl http://localhost"},

  // ── Misc Level 1 (tetap berguna) ──────────
  "ip addr": {
    objs: ["check-ip", "check-conflict"],
    out: [
      {t:"i", v:"1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536"},
      {t:"l", v:"    inet 127.0.0.1/8 scope host lo"},
      {t:"i", v:"2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500"},
      {t:"s", v:"    inet 192.168.2.1/24 brd 192.168.2.255 scope global eth0"},
      {t:"s", v:"\n✓ IP Address: 192.168.2.1 (server)"}
    ]
  },
  "ip address": {alias:"ip addr"},
  "ifconfig":   {alias:"ip addr"},

  // ══════════════════════════════════════════
  // LEVEL 2 — IP Conflict, DHCP crash
  // ══════════════════════════════════════════
  "systemctl status isc-dhcp-server": {
    objs: ["check-dhcp", "verify-dhcp"],
    out: [
      {t:"s", v:"● isc-dhcp-server.service - ISC DHCP IPv4 server"},
      {t:"s", v:"     Loaded: loaded (/lib/systemd/system/isc-dhcp-server.service; enabled)"},
      {t:"s", v:"     Active: active (running) since now"},
      {t:"s", v:"\n✓ DHCP aktif! Semua PC sudah bisa dapat IP otomatis. 🎉"}
    ]
  },
  "nano /etc/dhcp/dhcpd.conf": {
    obj: "fix-config",
    out: [
      {t:"i", v:"[Membuka editor konfigurasi DHCP...]"},
      {t:"l", v:"subnet 192.168.2.0 netmask 255.255.255.0 {"},
      {t:"l", v:"    range 192.168.2.20 192.168.2.200;"},
      {t:"l", v:"    option routers 192.168.2.1;"},
      {t:"l", v:"    option domain-name-servers 8.8.8.8;"},
      {t:"l", v:"    default-lease-time 86400;"},
      {t:"l", v:"}"},
      {t:"s", v:"✓ Konfigurasi DHCP disimpan (IP Conflict diperbaiki)!"}
    ]
  },
  "vim /etc/dhcp/dhcpd.conf":  {alias:"nano /etc/dhcp/dhcpd.conf"},
  "cat /etc/dhcp/dhcpd.conf":  {alias:"nano /etc/dhcp/dhcpd.conf"},

  "systemctl restart isc-dhcp-server": {
    obj: "restart-dhcp",
    out: [
      {t:"i", v:"Stopping isc-dhcp-server..."},
      {t:"s", v:"Starting isc-dhcp-server..."},
      {t:"s", v:"✓ DHCP Server direstart! Membagi IP ke range 192.168.2.20–200."}
    ]
  },
  "service isc-dhcp-server restart": {alias:"systemctl restart isc-dhcp-server"},

  // ══════════════════════════════════════════
  // LEVEL 3 — MySQL corrupt, database recovery
  // ══════════════════════════════════════════
  "systemctl stop mysql": {
    obj: "stop-mysql",
    out: [
      {t:"i", v:"Stopping mysql.service..."},
      {t:"s", v:"✓ MySQL service dihentikan. Siap untuk repair."}
    ]
  },
  "service mysql stop": {alias:"systemctl stop mysql"},

  "mysqlcheck -u root -p --all-databases --auto-repair": {
    obj: "repair-db",
    out: [
      {t:"i", v:"Enter password: ********"},
      {t:"i", v:"sekolah.data_guru                   OK"},
      {t:"i", v:"sekolah.jadwal                      OK"},
      {t:"w", v:"sekolah.nilai_siswa                 Table is marked as crashed"},
      {t:"i", v:"sekolah.nilai_siswa                 Repairing..."},
      {t:"s", v:"sekolah.nilai_siswa                 OK — Repaired!"},
      {t:"s", v:"\n✓ Database berhasil diperbaiki! Semua data nilai siswa selamat! 🎉"}
    ]
  },
  "mysqlcheck -u root -p --all-databases": {alias:"mysqlcheck -u root -p --all-databases --auto-repair"},
  "mysqlcheck --all-databases --auto-repair": {alias:"mysqlcheck -u root -p --all-databases --auto-repair"},

  "systemctl start mysql": {
    obj: "start-mysql",
    out: [
      {t:"i", v:"Starting mysql.service..."},
      {t:"s", v:"✓ MySQL service berhasil dijalankan!"}
    ]
  },
  "service mysql start": {alias:"systemctl start mysql"},

  "systemctl status mysql": {
    obj: "verify-db",
    out: [
      {t:"s", v:"● mysql.service - MySQL Community Server"},
      {t:"s", v:"     Loaded: loaded (/lib/systemd/system/mysql.service; enabled)"},
      {t:"s", v:"     Active: active (running)"},
      {t:"s", v:"\n✓ MySQL berjalan normal. Database nilai siswa bisa diakses! 🎉"}
    ]
  },

  "crontab -e": {
    obj: "backup-config",
    out: [
      {t:"i", v:"[Membuka crontab editor...]"},
      {t:"l", v:"# Backup database setiap hari jam 02:00"},
      {t:"l", v:"0 2 * * * mysqldump -u root -p sekolah > /backup/db_$(date +%F).sql"},
      {t:"s", v:"✓ Jadwal backup otomatis berhasil dikonfigurasi!"},
      {t:"s", v:"  Database akan dibackup setiap hari jam 02:00 WIB."}
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 4 — Website terdeface, security
  // ══════════════════════════════════════════
  "cat /var/log/apache2/access.log": {
    obj: "check-log",
    out: [
      {t:"l", v:"192.168.1.1 - GET /index.html HTTP/1.1 200 [normal]"},
      {t:"e", v:"185.220.101.45 - POST /upload.php HTTP/1.1 200"},
      {t:"e", v:"185.220.101.45 - GET /shell.php HTTP/1.1 200"},
      {t:"e", v:"185.220.101.45 - GET /?cmd=ls HTTP/1.1 200"},
      {t:"e", v:"185.220.101.45 - POST /shell.php?cmd=cat+/etc/passwd HTTP/1.1 200"},
      {t:"e", v:"\n⚠️  IP HACKER: 185.220.101.45 — masuk via upload.php!"}
    ]
  },
  "tail /var/log/apache2/access.log": {alias:"cat /var/log/apache2/access.log"},
  "tail -100 /var/log/apache2/access.log": {alias:"cat /var/log/apache2/access.log"},

  "ufw enable": {
    objs: ["enable-ufw"],
    out: [
      {t:"w", v:"Command may disrupt existing ssh connections. Proceed? (y|n)? y"},
      {t:"s", v:"Firewall is active and enabled on system startup."},
      {t:"s", v:"✓ UFW Firewall DIAKTIFKAN! 🛡️"}
    ]
  },
  "sudo ufw enable": {alias:"ufw enable"},

  "ufw allow 80": {
    objs: ["allow-ports", "setup-fw"],
    out: [
      {t:"s", v:"Rules updated"},
      {t:"s", v:"✓ Port 80 (HTTP) dibuka untuk akses website publik."}
    ]
  },
  "ufw allow http":    {alias:"ufw allow 80"},
  "ufw allow 80/tcp":  {alias:"ufw allow 80"},
  "ufw allow 443":     {alias:"ufw allow 80"},
  "ufw allow https":   {alias:"ufw allow 80"},

  "ufw deny from 185.220.101.45": {
    obj: "block-hacker",
    out: [
      {t:"s", v:"Rules updated"},
      {t:"s", v:"✓ IP 185.220.101.45 DIBLOKIR PERMANEN! Hacker tidak bisa masuk lagi. 🛡️"}
    ]
  },

  "ufw status": {
    objs: ["restore-web", "check-ufw"],
    out: [
      {t:"s", v:"Status: active"},
      {t:"l", v:""},
      {t:"l", v:"To                  Action    From"},
      {t:"l", v:"──────────────────────────────────"},
      {t:"s", v:"22/tcp              ALLOW     Anywhere"},
      {t:"s", v:"80/tcp              ALLOW     Anywhere"},
      {t:"e", v:"Anywhere            DENY      185.220.101.45"},
      {t:"s", v:"\n✓ Firewall aktif & dikonfigurasi dengan benar! 🛡️"}
    ]
  },
  "ufw status verbose": {alias:"ufw status"},

  // ── Level 4 tambahan ──────────────────────
  "ufw allow ssh": {
    out: [
      {t:"s", v:"Rules updated"},
      {t:"s", v:"✓ Port 22 (SSH) diizinkan untuk administrasi server."}
    ]
  },
  "ufw allow 22":     {alias:"ufw allow ssh"},
  "ufw allow 22/tcp": {alias:"ufw allow ssh"},

  "ufw deny from 45.33.32.156": {
    out: [
      {t:"s", v:"Rules updated"},
      {t:"s", v:"✓ IP 45.33.32.156 diblokir. 🛡️"}
    ]
  },

  // ══════════════════════════════════════════
  // LEVEL 5 — Total system recovery
  // ══════════════════════════════════════════
  "ufw reset": {
    obj: "reset-fw",
    out: [
      {t:"w", v:"Resetting all rules to default. Proceed? (y|n)? y"},
      {t:"i", v:"Backing up 'user.rules' to '/etc/ufw/user.rules.20240618'"},
      {t:"s", v:"✓ Semua firewall rules direset!"},
      {t:"i", v:"  Sekarang pasang rules yang benar dengan ufw allow 80 dan ufw enable."}
    ]
  },
  "sudo ufw reset": {alias:"ufw reset"},

  "systemctl restart networking": {
    obj: "restart-net",
    out: [
      {t:"i", v:"Stopping networking service..."},
      {t:"i", v:"Starting networking service..."},
      {t:"s", v:"eth0: UP — inet 192.168.1.100/24 ✓"},
      {t:"s", v:"Gateway: 192.168.1.1 ✓"},
      {t:"s", v:"✓ Network interface berhasil dipulihkan! Semua service bisa start."}
    ]
  },
  "systemctl restart network": {alias:"systemctl restart networking"},
  "/etc/init.d/networking restart": {alias:"systemctl restart networking"},

  "systemctl list-units --state=running": {
    obj: "verify-all",
    out: [
      {t:"l", v:"  UNIT                        LOAD   ACTIVE  DESCRIPTION"},
      {t:"l", v:"  ─────────────────────────────────────────────────────────"},
      {t:"s", v:"  apache2.service             loaded active  Apache HTTP Server ✓"},
      {t:"s", v:"  ssh.service                 loaded active  OpenBSD Secure Shell ✓"},
      {t:"s", v:"  mysql.service               loaded active  MySQL Community Server ✓"},
      {t:"s", v:"  networking.service          loaded active  Raise network interfaces ✓"},
      {t:"s", v:"  ufw.service                 loaded active  Uncomplicated firewall ✓"},
      {t:"l", v:""},
      {t:"s", v:"🎉 SEMUA SISTEM KOTA NETVILLE NORMAL!"},
      {t:"s", v:"   Event Hari Jadi Kota bisa streaming! Kamu pahlawan Netville! 🏆"}
    ]
  },
  "systemctl list-units": {alias:"systemctl list-units --state=running"},

  // ══════════════════════════════════════════
  // UTILITY — selalu berguna
  // ══════════════════════════════════════════
  "apt update": {
    out: [
      {t:"i", v:"Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease"},
      {t:"i", v:"Hit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease"},
      {t:"l", v:"Reading package lists... Done"},
      {t:"s", v:"✓ Daftar paket diperbarui."}
    ]
  },
  "sudo apt update":           {alias:"apt update"},
  "apt-get update":            {alias:"apt update"},
  "apt update && apt upgrade": {alias:"apt update"},

  "apt install apache2": {
    out: [
      {t:"i", v:"Reading package lists... Done"},
      {t:"i", v:"Unpacking apache2 (2.4.52-1ubuntu4.8) ..."},
      {t:"s", v:"Setting up apache2 (2.4.52-1ubuntu4.8) ..."},
      {t:"s", v:"✓ Apache2 berhasil diinstall!"}
    ]
  },
  "sudo apt install apache2": {alias:"apt install apache2"},

  "apt install isc-dhcp-server": {
    out: [
      {t:"i", v:"Reading package lists... Done"},
      {t:"i", v:"Unpacking isc-dhcp-server (4.4.1-2.3) ..."},
      {t:"s", v:"✓ DHCP Server berhasil diinstall!"}
    ]
  },
  "sudo apt install isc-dhcp-server": {alias:"apt install isc-dhcp-server"},

  "systemctl enable apache2": {
    out: [
      {t:"s", v:"Created symlink → /lib/systemd/system/apache2.service"},
      {t:"s", v:"✓ Apache2 akan otomatis aktif saat boot."}
    ]
  },
  "systemctl start apache2": {
    out: [
      {t:"s", v:"✓ apache2.service berhasil dijalankan — port 80 aktif."}
    ]
  },
  "systemctl status apache2": {
    out: [
      {t:"s", v:"● apache2.service - The Apache HTTP Server"},
      {t:"s", v:"     Active: active (running)"},
      {t:"s", v:"✓ Web server aktif."}
    ]
  },
  "systemctl enable ssh": {
    out: [
      {t:"s", v:"Created symlink → /lib/systemd/system/ssh.service"},
      {t:"s", v:"✓ SSH diaktifkan."}
    ]
  },
  "systemctl status ssh": {
    out: [
      {t:"s", v:"● ssh.service - OpenBSD Secure Shell server"},
      {t:"s", v:"     Active: active (running) — port 22"},
      {t:"s", v:"✓ SSH aktif."}
    ]
  },
  "systemctl restart ssh": {
    obj: "restart-ssh",
    out: [
      {t:"s", v:"✓ ssh.service direstart. SSH aktif di port 22 ✓"}
    ]
  },
  "systemctl status mysql": {alias_backup:true,
    out: [{t:"s", v:"● mysql.service — Active: active (running) ✓"}]
  },

  "help": {
    out: [
      {t:"i", v:"═══ NetAdmin Academy — Terminal Helper ═══"},
      {t:"l", v:""},
      {t:"i", v:"Lihat panel MISI (kiri bawah) untuk petunjuk command."},
      {t:"i", v:"Tip: Tekan ↑ / ↓ untuk history command."},
      {t:"i", v:"Tip: Tekan TAB untuk autocomplete."},
      {t:"l", v:""},
      {t:"l", v:"Command umum yang tersedia:"},
      {t:"l", v:"  df -h                — Cek ruang disk"},
      {t:"l", v:"  journalctl --vacuum-size=100M  — Bersihkan log"},
      {t:"l", v:"  systemctl [start|stop|restart|status] <service>"},
      {t:"l", v:"  apt install <paket>  — Install paket"},
      {t:"l", v:"  ufw [enable|allow|deny|status|reset]  — Firewall"},
      {t:"l", v:"  mysqlcheck --auto-repair  — Repair database"},
      {t:"l", v:"  curl http://localhost — Test website"},
      {t:"l", v:"  clear                — Bersihkan layar"}
    ]
  },
  "clear":  {clear:true, out:[]},
  "cls":    {clear:true, out:[]},
  "reset":  {clear:true, out:[]},
  "ls":     {out:[{t:"l", v:"bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var"}]},
  "ls /":   {alias:"ls"},
  "ls -la": {alias:"ls"},
  "pwd":    {out:[{t:"l", v:"/root"}]},
  "whoami": {out:[{t:"s", v:"root"}]},
  "uname -a": {
    out:[{t:"l", v:"Linux netville-server 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux"}]
  },
  "date": {
    out:[{t:"l", v: () => new Date().toLocaleString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}) + ' WIB'}]
  },
  "uptime": {
    out:[{t:"l", v:" 08:00:00 up 4:37, 1 user, load average: 2.14, 1.87, 1.42"}]
  },
  "free -h": {
    out:[
      {t:"l", v:"               total  used  free  shared"},
      {t:"s", v:"Mem:           31Gi   28Gi  3Gi   512Mi"}
    ]
  },
  "ping google.com": {
    out:[
      {t:"i", v:"PING google.com (142.250.190.46)"},
      {t:"s", v:"64 bytes icmp_seq=1 time=12.3 ms"},
      {t:"s", v:"64 bytes icmp_seq=2 time=11.8 ms"},
      {t:"s", v:"2 packets transmitted, 2 received, 0% loss"}
    ]
  },
  "hostnamectl": {
    out:[
      {t:"l", v:"   Static hostname: netville-server"},
      {t:"l", v:"  Operating System: Ubuntu 22.04.3 LTS"},
      {t:"s", v:"      Architecture: x86-64"}
    ]
  },
  "ps aux": {
    out:[
      {t:"l", v:"USER  PID  %CPU %MEM  COMMAND"},
      {t:"l", v:"root    1   0.0  0.1  /sbin/init"},
      {t:"l", v:"root  812   0.0  0.2  /usr/sbin/sshd"},
      {t:"l", v:"www   956   0.1  0.4  /usr/sbin/apache2"}
    ]
  },
  "top":    {out:[{t:"w", v:"[Tekan q untuk keluar dari top] — Gunakan 'ps aux' di sini."}]},
  "exit":   {out:[{t:"w", v:"Ketik tombol ✕ untuk menutup terminal."}]},
  "sudo su":{out:[{t:"s", v:"root@netville:~#  (kamu sudah root)"}]}
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
      if (typeof onWrongCommand === 'function') onWrongCommand();
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

    const delay = data.out.length * D + 120;
    if (data.obj)  setTimeout(() => completeObjective(data.obj),  delay);
    if (data.objs) data.objs.forEach(id => setTimeout(() => completeObjective(id), delay));
    if (typeof onCorrectCommand === 'function') onCorrectCommand();
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
