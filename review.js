// ============================================================
//  COMILÁ — review.js  (Página: Reviews)
//  Responsabilidades:
//   1. Ler os restaurantes do histórico (localStorage)
//   2. Gerar avaliações fictícias aleatórias para cada um
//   3. Renderizar os cards de review no layout horizontal
// ============================================================

const CHAVE_HISTORICO = 'comila_historico';

// ── Banco de avaliações fictícias ─────────────────────────────
const REVIEWS_FICTICIOS = [
    {
        autor: "Maria S.",
        avatar: "👩",
        nota: 5,
        texto: "Absolutamente incrível! O ambiente é perfeito para jantar em casal. A comida chegou quente e bem apresentada. Voltarei com certeza!"
    },
    {
        autor: "João P.",
        avatar: "👨",
        nota: 4,
        texto: "Muito bom! O atendimento foi atencioso e a comida estava deliciosa. Apenas o tempo de espera foi um pouco longo, mas valeu a pena."
    },
    {
        autor: "Ana L.",
        avatar: "👩‍💼",
        nota: 5,
        texto: "Uma experiência gastronômica inesquecível. Os sabores são autênticos e o chef claramente tem muito talento. Recomendo a todos!"
    },
    {
        autor: "Carlos M.",
        avatar: "🧑",
        nota: 3,
        texto: "Razoável. A comida é boa mas nada extraordinário. O preço é justo pelo que entregam. Talvez eu volte para experimentar outros pratos."
    },
    {
        autor: "Sofia R.",
        avatar: "👱‍♀️",
        nota: 5,
        texto: "Melhor restaurante que já visitei! Cada prato é uma obra de arte. O serviço é exemplar e o ambiente muito aconchegante."
    },
    {
        autor: "Rafael B.",
        avatar: "👨‍🦱",
        nota: 4,
        texto: "Ótima opção para almoços de trabalho. Cardápio variado, ambiente tranquilo e serviço rápido. A sobremesa é de outro nível!"
    },
    {
        autor: "Beatriz F.",
        avatar: "👩‍🦰",
        nota: 5,
        texto: "Fui pela primeira vez e já quero voltar. A entrada de carpaccio foi divinal e o risoto estava perfeitamente al dente. 10/10!"
    },
    {
        autor: "Tiago N.",
        avatar: "👨‍🦳",
        nota: 4,
        texto: "Excelente relação qualidade-preço. O espaço é bonito e o staff muito simpático. Recomendo o prato do dia — vale muito a pena."
    }
];


// ── Utilitários ───────────────────────────────────────────────

/** Lê o histórico do localStorage. */
function lerHistorico() {
    return JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || '[]');
}

/**
 * Retorna uma string de estrelas cheias e vazias.
 * @param {number} nota Número de estrelas (0–5).
 */
function gerarEstrelas(nota) {
    return '⭐'.repeat(nota) + '☆'.repeat(5 - nota);
}

/**
 * Seleciona N reviews aleatórias do banco fictício.
 * @param {number} n Quantidade desejada.
 */
function selecionarReviews(n) {
    return [...REVIEWS_FICTICIOS]
        .sort(() => Math.random() - 0.5)
        .slice(0, n);
}


// ── Renderização ─────────────────────────────────────────────

/**
 * Gera o HTML de um único item de review dentro do card.
 * @param {Object} review Item de avaliação fictícia.
 */
function gerarReviewItem(review) {
    return `
        <div class="review-item">
            <div class="review-header">
                <span class="review-avatar">${review.avatar}</span>
                <div>
                    <strong class="review-autor">${review.autor}</strong>
                    <span class="review-estrelas">${gerarEstrelas(review.nota)}</span>
                </div>
            </div>
            <p class="review-texto">"${review.texto}"</p>
        </div>
    `;
}

/**
 * Gera o HTML completo de um card de review.
 * @param {Object} visita Item do histórico (restaurante visitado).
 */
function gerarCardReview(visita) {
    // Cada restaurante recebe entre 2 e 3 avaliações aleatórias
    const qtd     = 2 + Math.floor(Math.random() * 2);
    const reviews = selecionarReviews(qtd);

    const reviewsHtml = reviews.map(gerarReviewItem).join('');

    return `
        <div class="card-review">

            <!-- Imagem lateral -->
            <div class="card-review-img">
                <img src="${visita.imagem}" alt="${visita.nome}" loading="lazy">
            </div>

            <!-- Corpo do card -->
            <div class="card-review-body">
                <div class="card-review-info">
                    <h3>${visita.nome}</h3>
                    <p class="card-tipo">${visita.tipo} · 📍 ${visita.cidade}</p>
                    <p class="card-nota-global">${visita.nota}</p>
                </div>

                <div class="reviews-lista">
                    <p class="reviews-titulo">O que dizem os clientes</p>
                    ${reviewsHtml}
                </div>
            </div>

        </div>
    `;
}

/**
 * Lê o localStorage e renderiza todos os cards de review.
 * Exibe estado vazio se não houver histórico.
 */
function renderizarReviews() {
    const container = document.getElementById('reviews-container');
    const historico  = lerHistorico();

    if (historico.length === 0) {
        container.innerHTML = `
            <div class="estado-vazio">
                <span class="estado-vazio-icon">⭐</span>
                <h3>Nenhum restaurante para avaliar</h3>
                <p>Visita restaurantes no Dashboard para ver as reviews aqui.</p>
                <a href="index.html" class="btn-primario">Explorar Restaurantes</a>
            </div>
        `;
        return;
    }

    container.innerHTML = historico.map(gerarCardReview).join('');
}


// ── Inicialização ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', renderizarReviews);
