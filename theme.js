// ============================================================
//  COMILÁ — theme.js
//  Gestão de tema (claro/escuro) PARTILHADA por todas as páginas.
//  Importar este ficheiro em todos os <head> ANTES dos outros scripts.
// ============================================================

const CHAVE_TEMA = 'comila_tema';

/**
 * Lê o tema guardado e aplica o atributo data-theme ao <html>.
 * Deve correr o mais cedo possível para evitar o "flash" de tema errado.
 */
function inicializarTema() {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA) || 'light';
    document.documentElement.setAttribute('data-theme', temaSalvo);
}

/**
 * Alterna entre 'light' e 'dark', persiste no localStorage
 * e atualiza todos os ícones e toggles da página.
 * @returns {string} O novo tema aplicado.
 */
function alternarTema() {
    const atual = document.documentElement.getAttribute('data-theme') || 'light';
    const novo   = atual === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', novo);
    localStorage.setItem(CHAVE_TEMA, novo);
    _atualizarControlosTema(novo);
    return novo;
}

/** Sincroniza os ícones de tema (🌙/☀️) e o checkbox da página de settings. */
function _atualizarControlosTema(tema) {
    document.querySelectorAll('.theme-icon').forEach(el => {
        el.textContent = tema === 'dark' ? '☀️' : '🌙';
    });
    const toggleInput = document.getElementById('dark-mode-toggle');
    if (toggleInput) toggleInput.checked = (tema === 'dark');
}

// ── Mostra um toast de notificação flutuante ────────────────
let _toastTimer = null;

/**
 * @param {string} mensagem Texto a mostrar no toast.
 * @param {number} [duracao=2800] Milissegundos visível.
 */
function mostrarToast(mensagem, duracao = 2800) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensagem;
    toast.classList.add('visivel');

    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => toast.classList.remove('visivel'), duracao);
}

// ── Marca o link ativo na sidebar com base na URL atual ─────
function marcarLinkAtivo() {
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === pagina);
    });
}

// ── Inicialização automática ─────────────────────────────────
// Aplica o tema imediatamente (antes do DOMContentLoaded)
inicializarTema();

// Liga eventos após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    // Ícone de tema na sidebar
    const btnTema = document.getElementById('theme-toggle-sidebar');
    if (btnTema) btnTema.addEventListener('click', alternarTema);

    // Atualiza ícones com o tema atual
    _atualizarControlosTema(
        document.documentElement.getAttribute('data-theme') || 'light'
    );

    // Sidebar: link ativo
    marcarLinkAtivo();
});
