function sortThemes() {
    const themeOptions = document.getElementById('themeOptions');

    if(!themeOptions) return;

    const options = [...themeOptions.children];

    options
        .sort((a, b) => {
            const aText = a.querySelector('h3').textContent;
            const bText = b.querySelector('h3').textContent;
            return aText.localeCompare(bText);
        })
        .forEach(i => themeOptions.appendChild(i));
}

// Run once on initial load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sortThemes);
} else {
    sortThemes();
}