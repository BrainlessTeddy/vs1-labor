function sortResultsList() {
    const ul = document.getElementById('discoveryResults');
    if (!ul) return;
    const li = [...ul.querySelectorAll('li')];
    if (li.length === 0) return;
    li.sort((a, b) => a.textContent.localeCompare(b.textContent))
      .forEach(item => ul.appendChild(item));
}

// Run once on initial load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sortResultsList);
} else {
    sortResultsList();
}

// Make it available globally for other scripts to call after updates
window.sortResultsList = sortResultsList;