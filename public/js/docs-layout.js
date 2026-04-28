/**
 * Simaju Docs Layout Engine
 * Menangani Sidebar dan Navigasi secara dinamis agar konsisten di semua halaman.
 */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const currentPath = window.location.pathname;

  const menu = [
    {
      title: 'Utama',
      links: [
        { name: '← Kembali ke Beranda', path: '/' }
      ]
    },
    {
      title: 'Pengenalan',
      links: [
        { name: 'Memulai Simaju', path: '/docs/intro' },
        { name: 'Instalasi', path: '/docs/intro#installation' },
        { name: 'Struktur Direktori', path: '/docs/intro#directory' }
      ]
    },
    {
      title: 'Arsitektur Modul',
      links: [
        { name: 'Membuat Modul', path: '/docs/modules-guide' },
        { name: 'Sistem Modul', path: '/docs/architecture' }
      ]
    },
    {
      title: 'Arsitektur Core',
      links: [
        { name: 'Arsitektur Inti', path: '/docs/architecture#core' }
      ]
    },
    {
      title: 'Dasar (Basics)',
      links: [
        { name: 'Routing', path: '/docs/basics' },
        { name: 'Controllers', path: '/docs/basics#controllers' },
        { name: 'Validation', path: '/docs/basics#validation' }
      ]
    },
    {
      title: 'Database',
      links: [
        { name: 'Simaju ORM', path: '/docs/database' },
        { name: 'Migrasi & Seeding', path: '/docs/database#migrations' },
        { name: 'Query Builder', path: '/docs/database#query-builder' }
      ]
    },
    {
      title: 'Keamanan',
      links: [
        { name: 'Otentikasi (Auth)', path: '/docs/security' },
        { name: 'Otorisasi (RBAC)', path: '/docs/security#rbac' },
        { name: 'Keamanan API', path: '/docs/security#api' }
      ]
    },
    {
      title: 'Lanjutan',
      links: [
        { name: 'Services & Logic', path: '/docs/advanced' },
        { name: 'Middlewares', path: '/docs/advanced#middlewares' },
        { name: 'Logging & Debug', path: '/docs/advanced#logging' }
      ]
    },
    {
      title: 'Sistem Plugin',
      links: [
        { name: 'Direktori Plugin', path: '/docs/plugins' },
        { name: 'Panduan Developer', path: '/docs/plugins-guide' }
      ]
    }
  ];

  let html = '';
  menu.forEach(group => {
    html += `
      <div class="sidebar-group">
        <div class="sidebar-title">${group.title}</div>
        <ul class="sidebar-links">
          ${group.links.map(link => `
            <li>
              <a href="${link.path}" class="${currentPath === link.path ? 'active' : ''}">
                ${link.name}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  sidebar.innerHTML = html;
});
