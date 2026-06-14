
// Dark Mode Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Initialize Theme
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    rootElement.setAttribute('data-theme', 'dark');
    if(themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = rootElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            rootElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            rootElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Trigger chart update if charts exist
        if(typeof updateChartTheme === 'function') {
            updateChartTheme();
        }
    });
}
