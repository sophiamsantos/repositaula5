// =============================================================
// CineList - Login e Cadastro de Usuário
// Usado nas telas login.html e cadastro-usuario.html
// Depende dos helpers definidos em app.js (apiGet, apiPost,
// getUsuarioLogado, setUsuarioLogado) — por isso app.js deve
// ser carregado ANTES deste arquivo.
// =============================================================

function initLogin() {
    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastroUsuario");
    if (!formLogin && !formCadastro) return;

    // Se já está logado, volta para a home
    if (getUsuarioLogado()) {
        window.location.href = "index.html";
        return;
    }

    // ---- Login ----
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const login = document.getElementById("loginUsuario").value.trim();
            const senha = document.getElementById("loginSenha").value;
            const msg = document.getElementById("loginMsg");
            msg.textContent = "";
            try {
                const achados = await apiGet(`/usuarios?login=${encodeURIComponent(login)}&senha=${encodeURIComponent(senha)}`);
                if (achados.length) {
                    setUsuarioLogado(achados[0]);
                    window.location.href = "index.html";
                } else {
                    msg.textContent = "Login ou senha incorretos.";
                    msg.className = "form-auth__msg form-auth__msg--erro";
                }
            } catch (err) {
                msg.textContent = "Erro de conexão com o servidor. O JSON Server está rodando?";
                msg.className = "form-auth__msg form-auth__msg--erro";
            }
        });
    }

    // ---- Cadastro de usuário ----
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();
            const msg = document.getElementById("cadastroMsg");
            msg.textContent = "";
            const novo = {
                login: document.getElementById("cadLogin").value.trim(),
                nome: document.getElementById("cadNome").value.trim(),
                email: document.getElementById("cadEmail").value.trim(),
                senha: document.getElementById("cadSenha").value,
                admin: false
            };
            try {
                const existentes = await apiGet(`/usuarios?login=${encodeURIComponent(novo.login)}`);
                if (existentes.length) {
                    msg.textContent = "Já existe um usuário com esse login.";
                    msg.className = "form-auth__msg form-auth__msg--erro";
                    return;
                }
                const criado = await apiPost("/usuarios", novo);
                setUsuarioLogado(criado);
                window.location.href = "index.html";
            } catch (err) {
                msg.textContent = "Erro ao cadastrar. O JSON Server está rodando?";
                msg.className = "form-auth__msg form-auth__msg--erro";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", initLogin);
