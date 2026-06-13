// ============================================================
//  COMILÁ — script.js  (Dashboard / index.html)
//  Responsabilidades:
//   1. Mock de restaurantes por cidade
//   2. Autocomplete de cidades via API Ninjas + OpenStreetMap Nominatim
//   3. Renderização de cards
//   4. Guardar restaurante no histórico (localStorage) ao clicar
// ============================================================

// ── Constantes ───────────────────────────────────────────────
const CHAVE_HISTORICO = 'comila_historico';
const API_KEY_NINJAS  = 'ICLXhr2J4rCLDjQGPl4YbKLjtEYlFpyFNHBoxUFW';

// ── Elementos do DOM ─────────────────────────────────────────
const campoBusca      = document.getElementById('search-input');
const lista           = document.getElementById('results-list');
const telaRestaurantes = document.getElementById('restaurantes-tela');
const labelSecao      = document.getElementById('section-label');


// ============================================================
//  BANCO DE DADOS MOCK
// ============================================================
const bancoDeRestaurantes = {
    "Blumenau": [
        { nome: "Pizzaria da Nonna",  imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Italiana"     },
        { nome: "Burger Station",     imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", nota: "⭐⭐⭐⭐",   tipo: "Hamburgueria" },
        { nome: "Sushi do Vale",      imagem: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Japonesa"     },
        { nome: "Biergarten Alemão",  imagem: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Alemã"        },
        { nome: "Vila XV Café",       imagem: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500", nota: "⭐⭐⭐⭐",   tipo: "Cafeteria"    },
        { nome: "Churrascaria Rota",  imagem: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"       },
        { nome: "Tacos & Cia",        imagem: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500", nota: "⭐⭐⭐⭐",   tipo: "Mexicana"     },
        { nome: "Pastelaria do Centro",imagem: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500", nota: "⭐⭐⭐",    tipo: "Lanches"      },
        { nome: "Empório Verde",      imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Vegetariana"  },
        { nome: "Sabor do Sul",       imagem: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=500", nota: "⭐⭐⭐⭐",   tipo: "Comida Caseira"}
    ],
    "São Paulo": [
        { nome: "O maior de SP",   imagem: "https://thf.bing.com/th/id/OIP.Tzk5jyfMlP7FfYxeaeWHcAHaEo?w=263&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3", nota: "⭐⭐⭐⭐",   tipo: "Gigante"       },
        { nome: "Trattoria Paulista", imagem: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Italiana"      },
        { nome: "Bistrô Faria Lima",  imagem: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Contemporânea" },
        { nome: "Izakaya Liberdade",  imagem: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Japonesa"      },
        { nome: "Pizzaria Bixiga",    imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500", nota: "⭐⭐⭐⭐",   tipo: "Italiana"      },
        { nome: "Esfiha Tio Ali",     imagem: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500", nota: "⭐⭐⭐⭐",   tipo: "Árabe"         },
        { nome: "O Rei do Baião",     imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Nordestina"    },
        { nome: "Vegano SP",          imagem: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500", nota: "⭐⭐⭐⭐",   tipo: "Vegetariana"   },
        { nome: "Gelateria Paulistana",imagem: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Sobremesas"    },
        { nome: "Fogo de Chão SP",    imagem: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Carnes"        }
    ],
    "Rio de Janeiro": [
        { nome: "Maior do Rio",     imagem: "https://thf.bing.com/th/id/OIP.5NZaJuw1V1t7KRxf1aaiZAHaEK?w=317&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3", nota: "⭐⭐⭐⭐",   tipo: "Gigante da colina"      },
        { nome: "Sabor de Copacabana",imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Brasileira"    },
        { nome: "Maré Alta Frutos do Mar",imagem: "https://tse2.mm.bing.net/th/id/OIP.X51f5Hj-ljsZwScAVexB2wHaE8?cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3", nota: "⭐⭐⭐⭐⭐", tipo: "Frutos do Mar" },
        { nome: "Feijoada da Tia",    imagem: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Brasileira"    },
        { nome: "Açaí e Praia",       imagem: "https://images.unsplash.com/photo-1590004953392-5aba2e72269a?w=500", nota: "⭐⭐⭐⭐",   tipo: "Lanches"       },
        { nome: "Churrascaria Ipanema",imagem: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"        },
        { nome: "Bistrô Leblon",      imagem: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Contemporânea" },
        { nome: "Pastelaria Lapa",    imagem: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500", nota: "⭐⭐⭐",    tipo: "Lanches"       },
        { nome: "Cantina da Mamma",   imagem: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500", nota: "⭐⭐⭐⭐",   tipo: "Italiana"      },
        { nome: "Sushi Rio",          imagem: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Japonesa"      }
    ],
    "Belo Horizonte": [
        { nome: "Cantinho Mineiro",   imagem: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Mineira"       },
        { nome: "Pão de Queijo & Cia",imagem: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Cafeteria"     },
        { nome: "Mercado Central Grill",imagem: "https://images.unsplash.com/photo-1558030006-450675393462?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"        },
        { nome: "Fogão a Lenha",      imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Mineira"       },
        { nome: "Bar do Zé",          imagem: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500", nota: "⭐⭐⭐⭐",   tipo: "Petiscos"      },
        { nome: "Pizzaria Savassi",   imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", nota: "⭐⭐⭐⭐",   tipo: "Italiana"      },
        { nome: "Doce Sabor",         imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Cafeteria"     },
        { nome: "Trem Bom Burguer",   imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", nota: "⭐⭐⭐⭐",   tipo: "Hamburgueria"  },
        { nome: "Veggie Beagá",       imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", nota: "⭐⭐⭐⭐",   tipo: "Vegetariana"   },
        { nome: "Rota do Espeto",     imagem: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"        }
    ],
    "Curitiba": [
        { nome: "Cantina Santa Felicidade",imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Italiana"   },
        { nome: "Jardim Botânico Bistrô",imagem: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500", nota: "⭐⭐⭐⭐",   tipo: "Contemporânea" },
        { nome: "Pierogi & Cia",      imagem: "https://thf.bing.com/th/id/OIP.FcxaVwY7VHnoes0RsBgtaAHaHa?w=204&h=204&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3", nota: "⭐⭐⭐⭐⭐", tipo: "Polonesa"      },
        { nome: "Bar do Alemão",      imagem: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Alemã"         },
        { nome: "Café do Bosque",     imagem: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", nota: "⭐⭐⭐⭐",   tipo: "Cafeteria"     },
        { nome: "Churrascaria Gralha",imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"        },
        { nome: "Sopa Quente",        imagem: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500", nota: "⭐⭐⭐⭐",   tipo: "Sopas"         },
        { nome: "Batel Burger",       imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Hamburgueria"  },
        { nome: "Sushi CWB",          imagem: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", nota: "⭐⭐⭐⭐",   tipo: "Japonesa"      },
        { nome: "Empanadas Argentinas",imagem: "https://th.bing.com/th/id/R.bbeeb789247202a3bf8c403070d50245?rik=33HHAZFftqDkgA&pid=ImgRaw&r=0", nota: "⭐⭐⭐⭐",   tipo: "Lanches"       }
    ],
    "Padrao": [
        { nome: "Restaurante Local",  imagem: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", nota: "⭐⭐⭐⭐",   tipo: "Comida Caseira" },
        { nome: "Café da Praça",      imagem: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Cafeteria"      },
        { nome: "Churrascaria do Sul",imagem: "https://images.unsplash.com/photo-1544025162-81111420d4d8?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"         },
        { nome: "Ponto do Salgado",   imagem: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500", nota: "⭐⭐⭐",    tipo: "Lanches"        },
        { nome: "Sabor Caseiro",      imagem: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Comida Caseira" },
        { nome: "Esquina do Lanche",  imagem: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500", nota: "⭐⭐⭐⭐",   tipo: "Lanches"        },
        { nome: "Pizzaria Rápida",    imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500", nota: "⭐⭐⭐⭐",   tipo: "Italiana"       },
        { nome: "Cantinho do Sorvete",imagem: "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=500", nota: "⭐⭐⭐⭐⭐", tipo: "Sobremesas"     },
        { nome: "Grill & Cia",        imagem: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500", nota: "⭐⭐⭐⭐",   tipo: "Carnes"         },
        { nome: "Salada Fácil",       imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", nota: "⭐⭐⭐⭐",   tipo: "Saudável"       }
    ]
};

// ============================================================
//  FUNÇÕES DE RENDERIZAÇÃO
// ============================================================

/**
 * Gera o HTML de um único card de restaurante.
 * @param {Object} rest      Objeto do restaurante.
 * @param {string} cidade    Nome da cidade (para exibir e guardar).
 */
function gerarCardRestaurante(rest, cidade) {
    return `
        <div
            class="card-restaurante"
            role="button"
            tabindex="0"
            onclick="handleClickCard(this)"
            onkeydown="if(event.key==='Enter') handleClickCard(this)"
            data-nome="${rest.nome}"
            data-imagem="${rest.imagem}"
            data-nota="${rest.nota}"
            data-tipo="${rest.tipo}"
            data-cidade="${cidade}"
        >
            <img src="${rest.imagem}" alt="${rest.nome}" loading="lazy">
            <div class="card-restaurante-body">
                <h3>${rest.nome}</h3>
                <p class="card-tipo">${rest.tipo}</p>
                <p class="card-nota">${rest.nota}</p>
                <p class="card-cidade">📍 ${cidade}</p>
            </div>
        </div>
    `;
}

/** Mostra TODOS os restaurantes do mock (tela inicial). */
function mostrarTodosRestaurantes() {
    labelSecao.textContent = 'Todos os restaurantes';
    telaRestaurantes.innerHTML = '';

    for (let cidade in bancoDeRestaurantes) {
        if (cidade === 'Padrao') continue; // Ignora a lista padrão na home
        bancoDeRestaurantes[cidade].forEach(rest => {
            telaRestaurantes.innerHTML += gerarCardRestaurante(rest, cidade);
        });
    }
}

/** Mostra restaurantes de uma cidade específica (após selecionar na busca). */
function mostrarRestaurantes(nomeDaCidade) {
    labelSecao.textContent = `Restaurantes em ${nomeDaCidade}`;
    telaRestaurantes.innerHTML = '';

    const lista = bancoDeRestaurantes[nomeDaCidade] || bancoDeRestaurantes['Padrao'];
    lista.forEach(rest => {
        telaRestaurantes.innerHTML += gerarCardRestaurante(rest, nomeDaCidade);
    });
}


// ============================================================
//  LÓGICA DO HISTÓRICO (LocalStorage)
// ============================================================

/**
 * Chamado ao clicar num card.
 * Lê os dados do card via data-attributes e salva no localStorage.
 * @param {HTMLElement} card O elemento .card-restaurante clicado.
 */
function handleClickCard(card) {
    const restaurante = {
        id:          Date.now(),           // ID único para poder remover depois
        nome:        card.dataset.nome,
        imagem:      card.dataset.imagem,
        nota:        card.dataset.nota,
        tipo:        card.dataset.tipo,
        cidade:      card.dataset.cidade,
        dataVisita:  new Date().toLocaleDateString('pt-BR'),
        status:      Math.random() > 0.5 ? 'Aberto' : 'Fechado' // Status aleatório
    };

    // Lê o histórico existente, adiciona o novo item no início e guarda
    const historico = JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || '[]');
    historico.unshift(restaurante);
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));

    // Feedback visual ao utilizador
    mostrarToast(`✅ "${restaurante.nome}" adicionado ao histórico!`);
}


// ============================================================
//  AUTOCOMPLETE DE CIDADES (API Ninjas + OpenStreetMap Nominatim)
// ============================================================

/**
 * Busca cidades na API Ninjas.
 * Retorna sempre um array no formato { nome, pais, origem }.
 */
function buscarCidadesNinjas(texto) {
    return fetch(`https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(texto)}`, {
        method: 'GET',
        headers: { 'X-Api-Key': API_KEY_NINJAS }
    })
    .then(res => res.json())
    .then(dados => {
        if (!Array.isArray(dados)) return [];

        return dados.map(cidade => ({
            nome:   cidade.name,
            pais:   cidade.country,
            origem: 'API Ninjas'
        }));
    })
    .catch(err => {
        console.error('Erro na API Ninjas:', err);
        return [];
    });
}

/**
 * Busca cidades no OpenStreetMap Nominatim.
 * Retorna sempre um array no formato { nome, pais, origem }.
 * Documentação: https://nominatim.org/release-docs/latest/api/Search/
 */
function buscarCidadesNominatim(texto) {
    const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(texto)}&format=json&addressdetails=1&limit=5&accept-language=pt-BR`;

    return fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(dados => {
        if (!Array.isArray(dados)) return [];

        return dados
            // Mantém apenas resultados que representam uma cidade/município
            .filter(item => item.address && (
                item.address.city || item.address.town ||
                item.address.village || item.address.municipality
            ))
            .map(item => ({
                nome:   item.address.city || item.address.town ||
                        item.address.village || item.address.municipality,
                pais:   item.address.country || '',
                origem: 'OpenStreetMap'
            }));
    })
    .catch(err => {
        console.error('Erro na API Nominatim:', err);
        return [];
    });
}

/**
 * Junta os resultados das duas APIs, removendo cidades duplicadas
 * (mesmo nome, sem diferenciar maiúsculas/minúsculas).
 */
function combinarResultadosDeCidades(resultadosNinjas, resultadosNominatim) {
    const combinados = [...resultadosNinjas];

    resultadosNominatim.forEach(cidadeOsm => {
        const jaExiste = combinados.some(
            c => c.nome.toLowerCase() === cidadeOsm.nome.toLowerCase()
        );
        if (!jaExiste) combinados.push(cidadeOsm);
    });

    return combinados.slice(0, 8); // limita o tamanho da lista de sugestões
}

/** Renderiza a lista de sugestões de cidades (resultado combinado). */
function renderizarSugestoesDeCidades(cidades) {
    lista.innerHTML = '';

    cidades.forEach(cidade => {
        const li = document.createElement('li');

        li.innerHTML = `
            <span class="resultado-nome">${cidade.nome}${cidade.pais ? ' — ' + cidade.pais : ''}</span>
            <span class="resultado-origem">${cidade.origem}</span>
        `;

        li.addEventListener('click', () => {
            campoBusca.value    = cidade.nome;
            lista.innerHTML     = '';
            lista.style.display = 'none';
            mostrarRestaurantes(cidade.nome);
        });

        lista.appendChild(li);
    });

    lista.style.display = cidades.length ? 'block' : 'none';
}

/** Dispara a busca combinada nas duas APIs e renderiza o resultado. */
function buscarCidades(texto) {
    Promise.all([
        buscarCidadesNinjas(texto),
        buscarCidadesNominatim(texto)
    ])
    .then(([resultadosNinjas, resultadosNominatim]) => {
        const combinados = combinarResultadosDeCidades(resultadosNinjas, resultadosNominatim);
        renderizarSugestoesDeCidades(combinados);
    });
}

// Debounce: aguarda o utilizador parar de digitar antes de consultar as APIs.
// Evita disparar uma requisição a cada tecla (importante principalmente para
// respeitar o limite de uso do Nominatim, ~1 requisição por segundo).
let temporizadorBusca = null;

campoBusca.addEventListener('input', function () {
    const texto = campoBusca.value.trim();

    clearTimeout(temporizadorBusca);

    if (texto.length >= 3) {
        temporizadorBusca = setTimeout(() => buscarCidades(texto), 400);
    } else {
        // Campo vazio (ou muito curto) → fecha lista e restaura a home
        lista.innerHTML     = '';
        lista.style.display = 'none';
        mostrarTodosRestaurantes();
    }
});

// Fecha a lista ao clicar fora
document.addEventListener('click', e => {
    if (!e.target.closest('.search-box')) {
        lista.innerHTML     = '';
        lista.style.display = 'none';
    }
});


// ============================================================
//  INICIALIZAÇÃO
// ============================================================
mostrarTodosRestaurantes();
