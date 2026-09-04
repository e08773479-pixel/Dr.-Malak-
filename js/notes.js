document.addEventListener('DOMContentLoaded', () => {
  const notesArea = document.getElementById('notesArea');
  const saveStatus = document.getElementById('saveStatus');
  const clearNotesBtn = document.getElementById('clearNotesBtn');

  const savedNotes = localStorage.getItem('dr_malak_notes');
  if (savedNotes !== null && notesArea) {
    notesArea.value = savedNotes;
  }

  notesArea?.addEventListener('input', () => {
    localStorage.setItem('dr_malak_notes', notesArea.value);
    saveStatus.textContent = 'تم الحفظ تلقائياً ✓';
    setTimeout(() => {
      saveStatus.textContent = 'يتم الحفظ تلقائياً';
    }, 2000);
  });

  clearNotesBtn?.addEventListener('click', () => {
    if (confirm('هل أنتِ متأكدة من مسح جميع الملاحظات؟')) {
      notesArea.value = '';
      localStorage.removeItem('dr_malak_notes');
      saveStatus.textContent = 'تم مسح الملاحظات';
    }
  });
});
