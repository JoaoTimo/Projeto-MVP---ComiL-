// ============================================================
//  COMILÁ — historico.js  (Histórico / historico.html)
//  Responsabilidades:
//   1. Ler o histórico salvo em localStorage (comila_historico)
//   2. Montar uma DataTable com: ID, Data, Restaurante, Cidade, Status
//   3. Permitir favoritar/desfavoritar cada item (comila_favoritos)
//   4. Permitir remover itens do histórico
//   5. Filtrar para mostrar apenas os favoritos
// ============================================================

const CHAVE_HISTORICO = 'comila_historico';
const CHAVE_FAVORITOS = 'comila_favoritos';

let tabela; // referência para a instância da DataTable

// ── Helpers de LocalStorage ──────────────────────────────────
function obterHistorico() {
    return JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || '[]');
}

function salvarHistorico(historico) {
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
}

function obterFavoritos() {
    return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) || '[]');
}

function salvarFavoritos(favoritos) {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

function ehFavorito(id) {
    return obterFavoritos().includes(id);
}

/** Mostra o toast definido em theme.js (com fallback caso não exista). */
function notificar(mensagem) {
    if (typeof mostrarToast === 'function') {
        mostrarToast(mensagem);
    } else {
        console.log(mensagem);
    }
}


// ============================================================
//  MONTAGEM DA TABELA
// ============================================================
function inicializarTabela() {
    const historico = obterHistorico();

    tabela = $('#tabela-historico').DataTable({
        data: historico,
        columns: [
            { data: 'id', title: 'ID' },

            // "Data" exibe dataVisita, mas ordena pelo timestamp (id)
            {
                data: 'dataVisita',
                title: 'Data',
                render: (data, type, row) => (type === 'sort' || type === 'type') ? row.id : data
            },

            { data: 'nome', title: 'Restaurante' },
            { data: 'cidade', title: 'Cidade' },

            {
                data: 'status',
                title: 'Status',
                render: (status) => {
                    const classe = status === 'Aberto' ? 'status-aberto' : 'status-fechado';
                    return `<span class="status-pill ${classe}">${status}</span>`;
                }
            },

            // Coluna de favorito (botão estrela)
            {
                data: 'id',
                title: 'Favorito',
                orderable: false,
                className: 'col-favorito',
                render: (id) => {
                    const ativo  = ehFavorito(id) ? 'ativo' : '';
                    const icone  = ehFavorito(id) ? '★' : '☆';
                    return `<button class="btn-favorito ${ativo}" data-id="${id}" title="Favoritar / desfavoritar">${icone}</button>`;
                }
            },

            // Coluna de ações (remover do histórico)
            {
                data: 'id',
                title: 'Ações',
                orderable: false,
                className: 'col-acoes',
                render: (id) => `<button class="btn-remover-linha" data-id="${id}" title="Remover do histórico">🗑️</button>`
            }
        ],
        order: [[0, 'desc']], // mais recentes primeiro
        pageLength: 8,
        lengthMenu: [5, 8, 10, 25, 50],
        language: {
            search: 'Buscar:',
            lengthMenu: 'Mostrar _MENU_ registos',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ registos',
            infoEmpty: 'Nenhum registo encontrado',
            infoFiltered: '(filtrado de _MAX_ registos no total)',
            emptyTable: 'Nenhum restaurante no histórico ainda. Visite o Dashboard e clique num restaurante para adicioná-lo aqui.',
            zeroRecords: 'Nenhum registo corresponde à pesquisa',
            paginate: {
                first: 'Primeiro',
                previous: '‹',
                next: '›',
                last: 'Último'
            }
        }
    });

    registrarEventosDaTabela();
}


// ============================================================
//  EVENTOS (favoritar / remover)
// ============================================================
function registrarEventosDaTabela() {
    // Delegação de eventos: os botões são recriados a cada redraw da tabela
    $('#tabela-historico tbody').on('click', '.btn-favorito', function () {
        const id = Number(this.dataset.id);
        alternarFavorito(id, this);
    });

    $('#tabela-historico tbody').on('click', '.btn-remover-linha', function () {
        const id = Number(this.dataset.id);
        removerDoHistorico(id);
    });

    // Filtro "mostrar somente favoritos"
    document.getElementById('filtro-favoritos')
        .addEventListener('change', aplicarFiltroDeFavoritos);

    // Botão "limpar histórico"
    document.getElementById('btn-limpar-historico')
        .addEventListener('click', limparHistorico);
}

/** Adiciona ou remove um restaurante da lista de favoritos. */
function alternarFavorito(id, botao) {
    let favoritos = obterFavoritos();

    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        botao.classList.remove('ativo');
        botao.textContent = '☆';
        notificar('Removido dos favoritos');
    } else {
        favoritos.push(id);
        botao.classList.add('ativo');
        botao.textContent = '★';
        notificar('⭐ Adicionado aos favoritos!');
    }

    salvarFavoritos(favoritos);

    // Se o filtro "somente favoritos" estiver ativo, redesenha a tabela
    if (document.getElementById('filtro-favoritos').checked) {
        aplicarFiltroDeFavoritos();
    }
}

/** Remove um item do histórico (e dos favoritos, se estiver lá). */
function removerDoHistorico(id) {
    const historico = obterHistorico().filter(item => item.id !== id);
    salvarHistorico(historico);

    const favoritos = obterFavoritos().filter(f => f !== id);
    salvarFavoritos(favoritos);

    const linha = tabela.row(function (idx, data) {
        return data && data.id === id;
    });

    linha.remove().draw(false);
    notificar('Item removido do histórico');
}

/** Filtra a tabela para mostrar apenas os restaurantes favoritados. */
function aplicarFiltroDeFavoritos() {
    const somenteFavoritos = document.getElementById('filtro-favoritos').checked;
    const favoritos = obterFavoritos();

    // Remove qualquer filtro customizado anterior
    $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(
        fn => fn._comilaFiltroFavoritos !== true
    );

    if (somenteFavoritos) {
        const filtro = (settings, searchData, dataIndex, rowData) => favoritos.includes(rowData.id);
        filtro._comilaFiltroFavoritos = true;
        $.fn.dataTable.ext.search.push(filtro);
    }

    tabela.draw();
}

/** Limpa todo o histórico e os favoritos. */
function limparHistorico() {
    const historico = obterHistorico();
    if (historico.length === 0) return;

    const confirmar = confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.');
    if (!confirmar) return;

    salvarHistorico([]);
    salvarFavoritos([]);
    tabela.clear().draw();
    notificar('Histórico limpo com sucesso');
}


// ============================================================
//  INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', inicializarTabela);
