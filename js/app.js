document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.page-section');
  const pageTitle = document.getElementById('pageTitle');

  const titles = {
    home: 'الدكتورة ملك <span>♛</span>',
    sessions: 'جلسات المذاكرة <span>♡</span>',
    stats: 'الإحصائيات <span>▥</span>',
    tasks: 'مهام اليوم <span>✓</span>',
    notes: 'الملاحظات <span>▤</span>',
    prayer: 'الأذان الهادئ <span>☪</span>'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-section');

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(section => {
        if (section.id === target) {
          section.style.display = 'block';
          section.classList.add('active');
        } else {
          section.style.display = 'none';
          section.classList.remove('active');
        }
      });

      if (titles[target]) {
        pageTitle.innerHTML = titles[target];
      }
    });
  });
});
