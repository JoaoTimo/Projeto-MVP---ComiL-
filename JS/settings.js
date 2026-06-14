// ============================================================
//  COMILÁ — settings.js  (Página: Configurações)
//  Responsabilidades:
//   1. Carregar e guardar o perfil do utilizador no localStorage
//   2. Sincronizar o toggle de Dark Mode com o tema atual
//   3. Limpar o histórico de visitas
// ============================================================

const CHAVE_HISTORICO = 'comila_historico';
const CHAVE_NOME      = 'comila_nome';
const CHAVE_EMAIL     = 'comila_email';
const CHAVE_CIDADE    = 'comila_cidade_fav';

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Carregar perfil guardado ─────────────────────────
    const inputNome   = document.getElementById('input-nome');
    const inputEmail  = document.getElementById('input-email');
    const inputCidade = document.getElementById('input-cidade');

    inputNome.value   = localStorage.getItem(CHAVE_NOME)   || '';
    inputEmail.value  = localStorage.getItem(CHAVE_EMAIL)  || '';
    inputCidade.value = localStorage.getItem(CHAVE_CIDADE) || '';


    // ── 2. Sincronizar toggle de Dark Mode ──────────────────
    //    O estado real do tema vem do theme.js (que já correu).
    //    Aqui apenas ligamos o evento 'change' do checkbox.
    const toggleDark = document.getElementById('dark-mode-toggle');
    const temaAtual  = document.documentElement.getAttribute('data-theme') || 'light';
    toggleDark.checked = (temaAtual === 'dark');

    toggleDark.addEventListener('change', () => {
        // alternarTema() está disponível globalmente via theme.js
        alternarTema();
    });


    // ── 3. Guardar perfil ────────────────────────────────────
    const btnSalvar = document.getElementById('btn-salvar');
    btnSalvar.addEventListener('click', () => {
        const nome   = inputNome.value.trim();
        const email  = inputEmail.value.trim();
        const cidade = inputCidade.value.trim();

        // Validação mínima
        if (!nome && !email) {
            mostrarToast('⚠️ Preenche pelo menos o nome ou o email.');
            return;
        }

        localStorage.setItem(CHAVE_NOME,   nome);
        localStorage.setItem(CHAVE_EMAIL,  email);
        localStorage.setItem(CHAVE_CIDADE, cidade);

        mostrarToast('✅ Perfil guardado com sucesso!');
    });


    // ── 4. Limpar histórico ──────────────────────────────────
    const btnLimpar = document.getElementById('btn-limpar-historico');
    btnLimpar.addEventListener('click', () => {
        const historico = JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || '[]');

        if (historico.length === 0) {
            mostrarToast('ℹ️ O histórico já está vazio.');
            return;
        }

        // Confirmação antes de apagar
        const confirmado = confirm(
            `Tens a certeza que queres apagar ${historico.length} restaurante(s) do histórico? Esta ação não pode ser desfeita.`
        );

        if (confirmado) {
            localStorage.removeItem(CHAVE_HISTORICO);
            mostrarToast('🗑️ Histórico apagado com sucesso!');
        }
    });
});
