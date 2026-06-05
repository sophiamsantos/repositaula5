// =============================================================
// CineList - Aplicação principal (TP2)
// Front-end consumindo a API REST do JSON Server
//   Recursos: /titulos /categorias /usuarios /favoritos /aluno
// =============================================================

// Base da API. Como o JSON Server serve a pasta /public, a origem
// é a mesma do site; usamos caminhos relativos.
const API = "";

// Chave usada na sessionStorage para guardar o usuário logado
const SESSION_KEY = "cinelist_usuario";

// =============================================================
// Camada de acesso à API (fetch)
// =============================================================

async function apiGet(rota) {
    const resp = await fetch(`${API}${rota}`);
    if (!resp.ok) throw new Error(`Falha ao buscar ${rota} (${resp.status})`);
    return resp.json();
}

async function apiPost(rota, corpo) {
    const resp = await fetch(`${API}${rota}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    });
    if (!resp.ok) throw new Error(`Falha ao inserir em ${rota} (${resp.status})`);
    return resp.json();
}

async function apiPut(rota, corpo) {
    const resp = await fetch(`${API}${rota}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    });
    if (!resp.ok) throw new Error(`Falha ao atualizar ${rota} (${resp.status})`);
    return resp.json();
}

async function apiDelete(rota) {
    const resp = await fetch(`${API}${rota}`, { method: "DELETE" });
    if (!resp.ok) throw new Error(`Falha ao excluir ${rota} (${resp.status})`);
    return resp.json();
}

// =============================================================
// Sessão do usuário (sessionStorage)
// =============================================================

function getUsuarioLogado() {
    const bruto = sessionStorage.getItem(SESSION_KEY);
    return bruto ? JSON.parse(bruto) : null;
}

function setUsuarioLogado(usuario) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
}

// =============================================================
// Helpers gerais
// =============================================================

function getQueryParam(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
}

function escapeHtml(texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Cache simples carregado uma vez por página
let CATEGORIAS = [];
function getCategoriaNome(idCat) {
    const c = CATEGORIAS.find(c => c.id === idCat);
    return c ? c.nome : "";
}
function getCategoriaCor(idCat) {
    const c = CATEGORIAS.find(c => c.id === idCat);
    return c ? c.cor : "#e94560";
}

// =============================================================
// MENU dinâmico (login / logout / favoritos / cadastro)
// =============================================================

function renderMenu() {
    const alvo = document.getElementById("menuDinamico");
    if (!alvo) return;

    const usuario = getUsuarioLogado();
    let html = "";

    if (usuario && usuario.admin) {
        html += `<a href="cadastro_itens.html" class="header__nav-link">Cadastro</a>`;
    }
    if (usuario) {
        html += `<a href="favoritos.html" class="header__nav-link">Favoritos</a>`;
        html += `<span class="header__usuario">Olá, ${escapeHtml(usuario.nome.split(" ")[0])}</span>`;
        html += `<button type="button" class="header__btn-logout" id="btnLogout">Logout</button>`;
    } else {
        html += `<a href="login.html" class="header__nav-link header__nav-link--destaque">Login</a>`;
    }

    alvo.innerHTML = html;

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) btnLogout.addEventListener("click", logout);
}

// =============================================================
// FAVORITOS - estado e ações
// =============================================================

// Mapa tituloId -> registro do favorito (apenas do usuário logado)
let FAVORITOS_USER = new Map();

async function carregarFavoritosUsuario() {
    FAVORITOS_USER = new Map();
    const usuario = getUsuarioLogado();
    if (!usuario) return;
    const lista = await apiGet(`/favoritos?usuarioId=${encodeURIComponent(usuario.id)}`);
    lista.forEach(f => FAVORITOS_USER.set(Number(f.tituloId), f));
}

function isFavorito(tituloId) {
    return FAVORITOS_USER.has(Number(tituloId));
}

// Alterna favorito; retorna o novo estado (true = favoritado)
async function alternarFavorito(tituloId) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        if (confirm("Você precisa estar logado para favoritar. Ir para a tela de login?")) {
            window.location.href = "login.html";
        }
        return null;
    }
    tituloId = Number(tituloId);

    if (FAVORITOS_USER.has(tituloId)) {
        const reg = FAVORITOS_USER.get(tituloId);
        await apiDelete(`/favoritos/${reg.id}`);
        FAVORITOS_USER.delete(tituloId);
        return false;
    } else {
        const novo = await apiPost(`/favoritos`, { usuarioId: usuario.id, tituloId });
        FAVORITOS_USER.set(tituloId, novo);
        return true;
    }
}

// HTML do botão de coração (vazado / preenchido)
function botaoFavoritoHtml(tituloId) {
    const ativo = isFavorito(tituloId);
    return `
        <button type="button"
                class="fav-btn ${ativo ? "fav-btn--ativo" : ""}"
                data-fav="${tituloId}"
                aria-label="${ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
                title="${ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
            <span class="fav-btn__icon">${ativo ? "&#10084;" : "&#9825;"}</span>
        </button>`;
}

// Liga os cliques dos corações dentro de um container
function ligarBotoesFavorito(container) {
    container.querySelectorAll("[data-fav]").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute("data-fav");
            const estado = await alternarFavorito(id);
            if (estado === null) return;
            btn.classList.toggle("fav-btn--ativo", estado);
            const icone = btn.querySelector(".fav-btn__icon");
            if (icone) icone.innerHTML = estado ? "&#10084;" : "&#9825;";
            btn.setAttribute("title", estado ? "Remover dos favoritos" : "Adicionar aos favoritos");
            // Na página de favoritos, remover o card ao desfavoritar
            if (document.getElementById("favoritosGrid") && estado === false) {
                renderFavoritos();
            }
        });
    });
}

// =============================================================
// HOME-PAGE
// =============================================================

let TODOS_TITULOS = [];   // cache dos títulos para pesquisa

async function initHome() {
    if (!document.getElementById("catalogoGrid")) return;

    try {
        const [cats, titulos] = await Promise.all([
            apiGet("/categorias"),
            apiGet("/titulos")
        ]);
        CATEGORIAS = cats;
        TODOS_TITULOS = titulos;

        await carregarFavoritosUsuario();

        renderCarrossel(titulos);
        renderCatalogo(titulos);
        renderGrafico(titulos);
        await renderAluno();
        ligarPesquisa();
    } catch (err) {
        mostrarErroConexao(document.getElementById("catalogoGrid"), err);
    }
}

function renderCarrossel(titulos) {
    const indicadores = document.getElementById("carrosselIndicadores");
    const slides = document.getElementById("carrosselSlides");
    if (!indicadores || !slides) return;

    const destaques = titulos.filter(t => t.destaque);

    indicadores.innerHTML = destaques.map((item, index) => `
        <button type="button" data-bs-target="#carrosselDestaques" data-bs-slide-to="${index}"
                class="${index === 0 ? "active" : ""}" aria-label="Slide ${index + 1}"
                ${index === 0 ? 'aria-current="true"' : ""}></button>
    `).join("");

    slides.innerHTML = destaques.map((item, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <a href="detalhes.html?id=${item.id}" class="carrossel__link">
                <div class="carrossel__bg" style="background-image: url('${escapeHtml(item.imagem_principal)}');"></div>
                <img src="${escapeHtml(item.imagem_principal)}" class="carrossel__img"
                     alt="${escapeHtml(item.nome)}">
                <div class="carousel-caption carrossel__caption">
                    <span class="carrossel__tag">${escapeHtml(getCategoriaNome(item.categoria))} &middot; ${escapeHtml(item.tipo)}</span>
                    <h3 class="carrossel__titulo">${escapeHtml(item.nome)}</h3>
                    <p class="carrossel__descricao">${escapeHtml(item.descricao)}</p>
                    <span class="carrossel__nota">&#9733; ${Number(item.nota).toFixed(1)}</span>
                </div>
            </a>
        </div>
    `).join("");
}

function cardHtml(item) {
    return `
        <div class="categoria__card">
            <div class="card h-100 catalogo__card">
                <div class="catalogo__card-img-wrap">
                    <a href="detalhes.html?id=${item.id}" class="catalogo__card-imglink">
                        <img src="${escapeHtml(item.imagem_principal)}" class="card-img-top catalogo__card-img"
                             alt="${escapeHtml(item.nome)}">
                    </a>
                    <span class="catalogo__card-badge">&#9733; ${Number(item.nota).toFixed(1)}</span>
                    ${botaoFavoritoHtml(item.id)}
                </div>
                <a href="detalhes.html?id=${item.id}" class="card-link">
                    <div class="card-body">
                        <h5 class="card-title catalogo__card-title">${escapeHtml(item.nome)}</h5>
                        <p class="card-text catalogo__card-genero">${escapeHtml(item.genero)} &middot; ${escapeHtml(item.ano)}</p>
                        <p class="card-text catalogo__card-desc">${escapeHtml(item.descricao)}</p>
                    </div>
                    <div class="card-footer">
                        <span class="catalogo__card-link">Ver detalhes &rarr;</span>
                    </div>
                </a>
            </div>
        </div>
    `;
}

function renderCatalogo(titulos) {
    const container = document.getElementById("catalogoGrid");
    if (!container) return;

    if (!titulos.length) {
        container.innerHTML = `
            <div class="catalogo__vazio">
                <p>Nenhum título encontrado para a sua pesquisa.</p>
            </div>`;
        return;
    }

    container.innerHTML = CATEGORIAS.map(cat => {
        const filmes = titulos.filter(t => t.categoria === cat.id);
        if (!filmes.length) return "";
        return `
            <section class="categoria" id="categoria-${cat.id}">
                <header class="categoria__header" style="--cat-cor: ${cat.cor};">
                    <h3 class="categoria__titulo">${escapeHtml(cat.nome)}</h3>
                    <p class="categoria__descricao">${escapeHtml(cat.descricao)} <span class="categoria__contagem">${filmes.length} títulos</span></p>
                </header>
                <div class="categoria__row">
                    ${filmes.map(cardHtml).join("")}
                </div>
            </section>
        `;
    }).join("");

    ligarBotoesFavorito(container);
}

// ----------- Pesquisa -----------
function ligarPesquisa() {
    const form = document.getElementById("formPesquisa");
    const campo = document.getElementById("campoPesquisa");
    const limpar = document.getElementById("btnLimparPesquisa");
    if (!form || !campo) return;

    function aplicar() {
        const termo = campo.value.trim().toLowerCase();
        if (!termo) {
            renderCatalogo(TODOS_TITULOS);
            return;
        }
        const filtrados = TODOS_TITULOS.filter(t =>
            (t.nome && t.nome.toLowerCase().includes(termo)) ||
            (t.descricao && t.descricao.toLowerCase().includes(termo))
        );
        renderCatalogo(filtrados);
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); aplicar(); });
    campo.addEventListener("input", aplicar);
    if (limpar) {
        limpar.addEventListener("click", () => {
            campo.value = "";
            renderCatalogo(TODOS_TITULOS);
            campo.focus();
        });
    }
}

// ----------- Gráfico (visualização avançada) -----------
let graficoInstancia = null;
function renderGrafico(titulos) {
    const canvas = document.getElementById("graficoCategorias");
    if (!canvas || typeof Chart === "undefined") return;

    const labels = CATEGORIAS.map(c => c.nome);
    const quantidades = CATEGORIAS.map(c => titulos.filter(t => t.categoria === c.id).length);
    const medias = CATEGORIAS.map(c => {
        const ts = titulos.filter(t => t.categoria === c.id);
        if (!ts.length) return 0;
        return +(ts.reduce((s, t) => s + Number(t.nota), 0) / ts.length).toFixed(2);
    });
    const cores = CATEGORIAS.map(c => c.cor);

    if (graficoInstancia) graficoInstancia.destroy();

    graficoInstancia = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Qtd. de títulos",
                    data: quantidades,
                    backgroundColor: cores,
                    borderRadius: 8,
                    yAxisID: "y"
                },
                {
                    label: "Nota média",
                    data: medias,
                    type: "line",
                    borderColor: "#181a2c",
                    backgroundColor: "#181a2c",
                    tension: 0.3,
                    yAxisID: "y1"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                title: { display: false }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Quantidade" }, ticks: { stepSize: 1 } },
                y1: {
                    beginAtZero: true, max: 10, position: "right",
                    title: { display: true, text: "Nota média" },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// ----------- Informações do(a) aluno(a) -----------
async function renderAluno() {
    const box = document.getElementById("alunoInfo");
    if (!box) return;

    let a;
    try {
        a = await apiGet("/aluno");
    } catch (e) {
        return;
    }

    const redes = a.redes || {};
    box.innerHTML = `
        <div class="row g-4 align-items-center">
            <div class="col-md-3 text-center">
                <img src="${escapeHtml(a.avatar)}" alt="Foto de ${escapeHtml(a.nome)}" class="aluno__avatar">
            </div>
            <div class="col-md-5">
                <h6 class="aluno__subtitulo">Sobre o projeto</h6>
                <p class="aluno__texto">${escapeHtml(a.sobre)}</p>
                <ul class="aluno__lista">
                    <li><span>Aluna</span><strong>${escapeHtml(a.nome)}</strong></li>
                    <li><span>Matrícula</span><strong>${escapeHtml(a.matricula)}</strong></li>
                </ul>
            </div>
            <div class="col-md-4">
                <h6 class="aluno__subtitulo">Autoria</h6>
                <ul class="aluno__lista">
                    <li><span>Curso</span><strong>${escapeHtml(a.curso)}</strong></li>
                    <li><span>Turma</span><strong>${escapeHtml(a.turma)}</strong></li>
                </ul>

            </div>
        </div>
    `;
}

// =============================================================
// PÁGINA DE DETALHES
// =============================================================

async function initDetalhes() {
    const container = document.getElementById("detalheConteudo");
    if (!container) return;

    const id = parseInt(getQueryParam("id"), 10);
    try {
        const [cats, item] = await Promise.all([
            apiGet("/categorias"),
            apiGet(`/titulos/${id}`).catch(() => null)
        ]);
        CATEGORIAS = cats;
        await carregarFavoritosUsuario();

        if (!item || !item.id) {
            container.innerHTML = `
                <div class="alert alert-warning text-center my-5">
                    <h4>Título não encontrado</h4>
                    <p>O item solicitado não existe no catálogo.</p>
                    <a href="index.html" class="btn btn-danger">Voltar para a Home</a>
                </div>`;
            return;
        }

        renderDetalhes(item);
    } catch (err) {
        mostrarErroConexao(container, err);
    }
}

function renderDetalhes(item) {
    const container = document.getElementById("detalheConteudo");
    document.title = item.nome + " - CineList";
    const fotos = item.fotos || [];

    container.innerHTML = `
        <section class="detalhe__info">
            <div class="detalhe__topo">
                <h2 class="detalhe__secao-titulo">Informações Gerais</h2>
                ${botaoFavoritoHtml(item.id)}
            </div>
            <div class="row g-4 detalhe__info-grid">
                <div class="col-12 col-md-5">
                    <div class="detalhe__poster">
                        <img src="${escapeHtml(item.imagem_principal)}" alt="${escapeHtml(item.nome)}">
                        <span class="detalhe__poster-nota">&#9733; ${Number(item.nota).toFixed(1)}</span>
                    </div>
                </div>
                <div class="col-12 col-md-7">
                    <span class="detalhe__tag">${escapeHtml(getCategoriaNome(item.categoria))} &middot; ${escapeHtml(item.tipo)}</span>
                    <h1 class="detalhe__titulo">${escapeHtml(item.nome)}</h1>
                    <p class="detalhe__descricao">${escapeHtml(item.descricao)}</p>

                    <div class="detalhe__ficha">
                        <div class="detalhe__ficha-item"><span class="detalhe__ficha-label">Gênero</span><span class="detalhe__ficha-valor">${escapeHtml(item.genero)}</span></div>
                        <div class="detalhe__ficha-item"><span class="detalhe__ficha-label">Ano</span><span class="detalhe__ficha-valor">${escapeHtml(item.ano)}</span></div>
                        <div class="detalhe__ficha-item"><span class="detalhe__ficha-label">Duração</span><span class="detalhe__ficha-valor">${escapeHtml(item.duracao)}</span></div>
                        <div class="detalhe__ficha-item"><span class="detalhe__ficha-label">Direção</span><span class="detalhe__ficha-valor">${escapeHtml(item.diretor)}</span></div>
                        <div class="detalhe__ficha-item"><span class="detalhe__ficha-label">Idioma</span><span class="detalhe__ficha-valor">${escapeHtml(item.idioma)}</span></div>
                        <div class="detalhe__ficha-item"><span class="detalhe__ficha-label">Classificação</span><span class="detalhe__ficha-valor">${escapeHtml(item.classificacao)}</span></div>
                    </div>

                    <div class="detalhe__elenco">
                        <h6>Elenco principal</h6>
                        <p>${escapeHtml(item.elenco)}</p>
                    </div>

                    <div class="detalhe__sinopse">
                        <h6>Sinopse</h6>
                        <p>${escapeHtml(item.conteudo)}</p>
                    </div>

                    <a href="index.html" class="btn detalhe__voltar">&larr; Voltar para o catálogo</a>
                </div>
            </div>
        </section>

        ${fotos.length ? `
        <section class="detalhe__fotos">
            <h2 class="detalhe__secao-titulo">Fotos do Título</h2>
            <div class="row g-3">
                ${fotos.map(foto => `
                    <div class="col-6 col-md-4 col-lg-3">
                        <div class="card detalhe__foto-card h-100">
                            <img src="${escapeHtml(foto.imagem)}" class="card-img-top detalhe__foto-img" alt="${escapeHtml(foto.titulo)}">
                            <div class="card-body p-2 text-center">
                                <p class="card-text detalhe__foto-titulo">${escapeHtml(foto.titulo)}</p>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </section>` : ""}
    `;

    ligarBotoesFavorito(container);
}

// =============================================================
// PÁGINA DE FAVORITOS
// =============================================================

async function initFavoritos() {
    const grid = document.getElementById("favoritosGrid");
    if (!grid) return;

    const usuario = getUsuarioLogado();
    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    try {
        const [cats, titulos] = await Promise.all([
            apiGet("/categorias"),
            apiGet("/titulos")
        ]);
        CATEGORIAS = cats;
        TODOS_TITULOS = titulos;
        await carregarFavoritosUsuario();
        renderFavoritos();
    } catch (err) {
        mostrarErroConexao(grid, err);
    }
}

function renderFavoritos() {
    const grid = document.getElementById("favoritosGrid");
    if (!grid) return;

    const favoritos = TODOS_TITULOS.filter(t => isFavorito(t.id));

    const contador = document.getElementById("favoritosContador");
    if (contador) contador.textContent = `${favoritos.length} ${favoritos.length === 1 ? "título" : "títulos"}`;

    if (!favoritos.length) {
        grid.innerHTML = `
            <div class="favoritos__vazio">
                <div class="favoritos__vazio-icone">&#9825;</div>
                <h4>Você ainda não tem favoritos</h4>
                <p>Explore o catálogo e toque no coração dos títulos que mais gostar.</p>
                <a href="index.html#catalogo" class="btn detalhe__voltar">Explorar catálogo</a>
            </div>`;
        return;
    }

    grid.innerHTML = `<div class="favoritos__row">${favoritos.map(cardHtml).join("")}</div>`;
    ligarBotoesFavorito(grid);
}

// =============================================================
// PÁGINA DE CADASTRO DE ITENS (CRUD - somente admin)
// =============================================================

function initCrud() {
    const form = document.getElementById("formItem");
    if (!form) return;

    const usuario = getUsuarioLogado();
    const guard = document.getElementById("crudGuard");
    const conteudo = document.getElementById("crudConteudo");

    if (!usuario || !usuario.admin) {
        if (guard) guard.classList.remove("d-none");
        if (conteudo) conteudo.classList.add("d-none");
        return;
    }
    if (guard) guard.classList.add("d-none");
    if (conteudo) conteudo.classList.remove("d-none");

    carregarCategoriasNoSelect();
    carregarListagemItens();

    form.addEventListener("submit", salvarItem);

    const btnLimpar = document.getElementById("btnLimparItem");
    if (btnLimpar) btnLimpar.addEventListener("click", limparFormItem);
}

async function carregarCategoriasNoSelect() {
    const select = document.getElementById("itemCategoria");
    if (!select) return;
    try {
        CATEGORIAS = await apiGet("/categorias");
        select.innerHTML = CATEGORIAS.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join("");
    } catch (e) { /* ignore */ }
}

function lerFormItem() {
    const id = document.getElementById("itemId").value;
    const imagem = document.getElementById("itemImagem").value.trim();
    return {
        id: id ? Number(id) : undefined,
        nome: document.getElementById("itemNome").value.trim(),
        categoria: document.getElementById("itemCategoria").value,
        tipo: document.getElementById("itemTipo").value.trim() || "Filme",
        genero: document.getElementById("itemGenero").value.trim(),
        ano: Number(document.getElementById("itemAno").value) || 0,
        duracao: document.getElementById("itemDuracao").value.trim(),
        diretor: document.getElementById("itemDiretor").value.trim(),
        elenco: document.getElementById("itemElenco").value.trim(),
        idioma: document.getElementById("itemIdioma").value.trim(),
        classificacao: document.getElementById("itemClassificacao").value.trim(),
        nota: Number(document.getElementById("itemNota").value) || 0,
        destaque: document.getElementById("itemDestaque").checked,
        descricao: document.getElementById("itemDescricao").value.trim(),
        conteudo: document.getElementById("itemConteudo").value.trim(),
        imagem_principal: imagem,
        fotos: [{ id: 1, titulo: "Pôster oficial", imagem }]
    };
}

async function salvarItem(e) {
    e.preventDefault();
    const msg = document.getElementById("itemMsg");
    msg.textContent = "";
    const item = lerFormItem();

    try {
        if (item.id) {
            // Preserva fotos existentes ao editar
            const atual = await apiGet(`/titulos/${item.id}`).catch(() => null);
            if (atual && atual.fotos && atual.fotos.length) {
                item.fotos = atual.fotos;
                item.fotos[0] = { ...item.fotos[0], imagem: item.imagem_principal };
            }
            await apiPut(`/titulos/${item.id}`, item);
            msg.textContent = "Item atualizado com sucesso!";
        } else {
            delete item.id;
            await apiPost("/titulos", item);
            msg.textContent = "Item inserido com sucesso!";
        }
        msg.className = "form-auth__msg form-auth__msg--ok";
        limparFormItem();
        carregarListagemItens();
    } catch (err) {
        msg.textContent = "Erro ao salvar o item.";
        msg.className = "form-auth__msg form-auth__msg--erro";
    }
}

function limparFormItem() {
    const form = document.getElementById("formItem");
    if (form) form.reset();
    document.getElementById("itemId").value = "";
    const titulo = document.getElementById("crudFormTitulo");
    if (titulo) titulo.textContent = "Novo Item";
    const btn = document.getElementById("btnSalvarItem");
    if (btn) btn.textContent = "Inserir";
}

async function carregarListagemItens() {
    const tbody = document.getElementById("itensTbody");
    if (!tbody) return;
    try {
        const titulos = await apiGet("/titulos");
        tbody.innerHTML = titulos.map(t => `
            <tr>
                <td>${t.id}</td>
                <td>
                    <div class="crud__item-nome">
                        <img src="${escapeHtml(t.imagem_principal)}" alt="" class="crud__item-thumb">
                        <span>${escapeHtml(t.nome)}</span>
                    </div>
                </td>
                <td>${escapeHtml(getCategoriaNome(t.categoria))}</td>
                <td>${escapeHtml(t.ano)}</td>
                <td>&#9733; ${Number(t.nota).toFixed(1)}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-primary" data-editar="${t.id}">Editar</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-excluir="${t.id}">Excluir</button>
                </td>
            </tr>
        `).join("");

        tbody.querySelectorAll("[data-editar]").forEach(b =>
            b.addEventListener("click", () => editarItem(Number(b.getAttribute("data-editar")))));
        tbody.querySelectorAll("[data-excluir]").forEach(b =>
            b.addEventListener("click", () => excluirItem(Number(b.getAttribute("data-excluir")), b.closest("tr"))));
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center py-4">Erro ao carregar itens. O JSON Server está rodando?</td></tr>`;
    }
}

async function editarItem(id) {
    try {
        const t = await apiGet(`/titulos/${id}`);
        document.getElementById("itemId").value = t.id;
        document.getElementById("itemNome").value = t.nome || "";
        document.getElementById("itemCategoria").value = t.categoria || "";
        document.getElementById("itemTipo").value = t.tipo || "";
        document.getElementById("itemGenero").value = t.genero || "";
        document.getElementById("itemAno").value = t.ano || "";
        document.getElementById("itemDuracao").value = t.duracao || "";
        document.getElementById("itemDiretor").value = t.diretor || "";
        document.getElementById("itemElenco").value = t.elenco || "";
        document.getElementById("itemIdioma").value = t.idioma || "";
        document.getElementById("itemClassificacao").value = t.classificacao || "";
        document.getElementById("itemNota").value = t.nota || "";
        document.getElementById("itemDestaque").checked = !!t.destaque;
        document.getElementById("itemDescricao").value = t.descricao || "";
        document.getElementById("itemConteudo").value = t.conteudo || "";
        document.getElementById("itemImagem").value = t.imagem_principal || "";

        document.getElementById("crudFormTitulo").textContent = `Editando: ${t.nome}`;
        document.getElementById("btnSalvarItem").textContent = "Alterar";
        document.getElementById("formItem").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) { /* ignore */ }
}

async function excluirItem(id, linha) {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    try {
        await apiDelete(`/titulos/${id}`);
        if (linha) linha.remove();
        const msg = document.getElementById("itemMsg");
        if (msg) {
            msg.textContent = "Item excluído com sucesso!";
            msg.className = "form-auth__msg form-auth__msg--ok";
        }
    } catch (err) {
        alert("Erro ao excluir o item.");
    }
}

// =============================================================
// Utilidades de erro
// =============================================================

function mostrarErroConexao(container, err) {
    if (!container) return;
    container.innerHTML = `
        <div class="alert alert-danger my-4">
            <h5 class="mb-2">Não foi possível conectar à API</h5>
            <p class="mb-1">Verifique se o JSON Server está em execução. No terminal, na pasta do projeto:</p>
            <pre class="mb-2"><code>npm install
npm start</code></pre>
            <p class="mb-0">Depois acesse <a href="http://localhost:3000">http://localhost:3000</a>.
            <small class="text-muted d-block mt-2">${escapeHtml(err && err.message)}</small></p>
        </div>`;
}

// =============================================================
// Inicialização
// =============================================================

document.addEventListener("DOMContentLoaded", function () {
    renderMenu();

    initHome();
    initDetalhes();
    initFavoritos();
    initCrud();

    // Toggle do menu hambúrguer
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("headerNav");
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("header__nav--open");
        });
    }
});
