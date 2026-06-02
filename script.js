// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. ACCORDION / SEÇÕES EXPANSÍVEIS
       ========================================================================== */
    const headers = document.querySelectorAll(".accordion-header");
    
    headers.forEach(header => {
        header.addEventListener("click", function() {
            const item = this.parentElement;
            
            // Alterna o estado do item clicado
            item.classList.toggle("active");
            
            // Gerenciamento de acessibilidade ARIA
            const isExpanded = item.classList.contains("active");
            this.setAttribute("aria-expanded", isExpanded);
        });
    });

    /* ==========================================================================
       2. INTERAÇÃO DE COMENTÁRIOS
       ========================================================================== */
    const formComentario = document.getElementById("form-comentario");
    const listaComentarios = document.getElementById("lista-comentarios");
    const txtComentario = document.getElementById("txt-comentario");

    formComentario.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        
        const texto = txtComentario.value.trim();
        if (texto) {
            // Criação do componente de comentário de forma dinâmica
            const novoComentario = document.createElement("div");
            novoComentario.classList.add("comentario-card");
            novoComentario.textContent = texto;
            
            // Adiciona ao topo da lista e limpa o campo
            listaComentarios.prepend(novoComentario);
            txtComentario.value = "";
        }
    });

    /* ==========================================================================
       3. FORMULÁRIO DE INSCRIÇÃO DO SEMINÁRIO
       ========================================================================== */
    const formSeminario = document.getElementById("form-seminario");
    
    formSeminario.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        
        // Simulação de sucesso
        alert(`Inscrição realizada com sucesso, ${nome}! Esperamos você no seminário.`);
        formSeminario.reset();
    });

    /* ==========================================================================
       4. ACESSIBILIDADE: CONTROLE DE FONTE E TEMA CLARO/ESCURO
       ========================================================================== */
    let tamanhoFonteAtual = 100; // Representa 100%
    const body = document.body;
    const btnAumentar = document.getElementById("btn-aumentar");
    const btnDiminuir = document.getElementById("btn-diminuir");
    const btnTema = document.getElementById("btn-tema");

    // Alterar tamanho da fonte globalmente de forma proporcional
    btnAumentar.addEventListener("click", () => {
        if (tamanhoFonteAtual < 130) { // Limite máximo seguro
            tamanhoFonteAtual += 10;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    btnDiminuir.addEventListener("click", () => {
        if (tamanhoFonteAtual > 80) { // Limite mínimo seguro
            tamanhoFonteAtual -= 10;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    // Alternador de modo Claro / Escuro
    btnTema.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
    });

    /* ==========================================================================
       5. ACESSIBILIDADE: LEITURA POR VOZ (SpeechSynthesis API)
       ========================================================================== */
    const btnVoz = document.getElementById("btn-voz");
    const btnPararVoz = document.getElementById("btn-parar-voz");
    let uttrance = null;

    btnVoz.addEventListener("click", () => {
        // Captura apenas o conteúdo de texto da tag principal e dos parágrafos, ignorando formulários e botões
        const conteudoParaLer = document.getElementById("conteudo-principal");
        
        if (!conteudoParaLer) return;

        // Limpa leituras anteriores em execução
        window.speechSynthesis.cancel();

        // Extrai texto ignorando os elementos internos não textuais (como botões e caixas de texto)
        const paragrafos = conteudoParaLer.querySelectorAll("p, h2, blockquote");
        let textoCompleto = "";
        
        paragrafos.forEach(el => {
            // Ignora o formulário de comentário que fica dentro da main
            if (!el.closest("#form-comentario")) {
                textoCompleto += el.textContent + " . ";
            }
        });

        if (textoCompleto.trim() === "") return;

        // Configuração do SpeechSynthesisUtterance
        uttrance = new SpeechSynthesisUtterance(textoCompleto);
        uttrance.lang = "pt-BR";
        uttrance.rate = 1.0; // Velocidade padrão

        // Eventos de controle de botões durante a fala
        uttrance.onstart = () => {
            btnPararVoz.disabled = false;
            btnVoz.textContent = "🗣️ Lendo...";
        };

        uttrance.onend = () => {
            btnPararVoz.disabled = true;
            btnVoz.textContent = "🔊 Ler";
        };

        uttrance.onerror = () => {
            btnPararVoz.disabled = true;
            btnVoz.textContent = "🔊 Ler";
        };

        // Dispara a leitura nativa
        window.speechSynthesis.speak(uttrance);
    });

    btnPararVoz.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        btnPararVoz.disabled = true;
        btnVoz.textContent = "🔊 Ler";
    });
});