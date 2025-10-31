document.addEventListener('DOMContentLoaded', () => {
    
    const hamburguerBtn = document.getElementById('menu-hamburguer');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburguerBtn && navMenu) {
        hamburguerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const validationFields = [
        { id: 'cpf', regex: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, msg: 'CPF inválido. Use o formato 000.000.000-00.' },
        { id: 'telefone', regex: /^\(\d{2}\) \d{4,5}-\d{4}$/, msg: 'Telefone inválido. Use o formato (00) 00000-0000.' },
        { id: 'cep', regex: /^\d{5}-?\d{3}$/, msg: 'CEP inválido. Use o formato 00000-000.' }
    ];

    function showFeedback(input, message, isError) {
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('validation-feedback')) {
            feedback = document.createElement('small');
            feedback.classList.add('validation-feedback');
            input.parentNode.insertBefore(feedback, input.nextElementSibling);
        }

        feedback.textContent = message;
        input.classList.toggle('error', isError);
        input.classList.toggle('success', !isError);
        
        feedback.style.color = isError ? 'var(--color-error)' : 'var(--color-success)'; 
        feedback.style.display = 'block';
    }

    function validateField(input) {
        const fieldConfig = validationFields.find(f => f.id === input.id);
        if (!fieldConfig) return true;

        if (!fieldConfig.regex.test(input.value)) {
            showFeedback(input, fieldConfig.msg, true);
            return false;
        }

        showFeedback(input, 'Preenchimento correto!', false);
        return true;
    }

    function setupFormValidation(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
        });
        
        form.addEventListener('submit', function(event) {
            let isFormValid = true;
            inputs.forEach(i => {
                if (!validateField(i)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                event.preventDefault(); 
                alert('Atenção: Por favor, corrija os erros nos campos antes de enviar.');
            } else {
                event.preventDefault(); 
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                localStorage.setItem('cadastro_mao_amiga', JSON.stringify(data));
                
                alert('Cadastro realizado e salvo no LocalStorage! (Simulação)');
                form.reset();
            }
        });
    }

    setupFormValidation('cadastro-form');

    const PROJECTS_DATA = [
        { id: 1, title: 'SOS Enchentes', description: 'Resposta imediata a desastres naturais, fornecendo abrigo e suprimentos essenciais.', impact: '1.200 famílias', badgeText: 'Emergencial', badgeClass: 'badge-urgente', image: 'imagens/projetos-voluntariado.jpg' },
        { id: 2, title: 'Kits Dignidade', description: 'Distribuição contínua de kits de higiene, cobertores e agasalhos para pessoas em situação de rua.', impact: '5.000 kits/ano', badgeText: 'Contínuo', badgeClass: 'badge-projeto', image: 'imagens/kit-dignidade.jpg' },
        { id: 3, title: 'Formação Brigadistas', description: 'Capacitação de líderes comunitários em primeiros socorros e gestão de abrigos para resposta local a crises.', impact: '150 líderes treinados', badgeText: 'Capacitação', badgeClass: 'badge-projeto', image: 'imagens/formacao-brigadistas.jpg' },
    ];
    
    function getProjectTemplate(project) {
        return `
            <article class="col-12 card-projeto-sm-6 card-projeto-md-4 card" data-id="${project.id}">
                <img src="${project.image}" alt="${project.title}">
                <div class="card-body">
                    <span class="badge ${project.badgeClass}">${project.badgeText}</span>
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 70)}...</p>
                    <a href="#view-project/${project.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
                </div>
            </article>
        `;
    }

    const mainContent = document.querySelector('main.container');

    function loadHomeContent() {
        return `
            <div class="layout-homepage">
                <section id="sobre" aria-labelledby="titulo-sobre">
                    <h2 id="titulo-sobre">🤝 Nossa Missão e História</h2>
                    <p>Conteúdo estático sobre a ONG, focado em Ajuda Humanitária. (Clique em "Projetos Dinâmicos" para ver o SPA em ação).</p>
                    <a href="#projects" class="btn btn-primary">Ver Projetos Dinâmicos (SPA)</a>
                    <figure style="margin-top: var(--space-md);">
                        <img src="imagens/missao-vision.jpg" alt="Equipe de voluntários" width="600" height="400">
                    </figure>
                </section>
                <section id="contato" aria-labelledby="titulo-contato">
                    <h2 id="titulo-contato">📞 Fale Conosco</h2>
                    <address>
                        <p><strong>Sede:</strong> Av. Solidariedade, 456 - São Paulo - SP</p>
                        <p><strong>Telefone:</strong> (11) 3333-4444</p>
                        <p><strong>E-mail:</strong> contato@maoamiga.org</p>
                    </address>
                </section>
            </div>
        `;
    }

    function loadProjectsContent() {
        let projectsHTML = PROJECTS_DATA.map(getProjectTemplate).join('');

        return `
            <section id="projetos-dinamicos" aria-labelledby="titulo-projetos-dinamicos">
                <h2 id="titulo-projetos-dinamicos">Projetos Ativos (Carregamento Dinâmico)</h2>
                <div class="alert alert-success">Estes cards foram gerados via **Template JavaScript** e DOM Manipulation.</div>
                <div class="grid-container">
                    ${projectsHTML}
                </div>
                <a href="#home" class="btn btn-primary" style="margin-top: var(--space-md);">Voltar para Início</a>
            </section>
        `;
    }

    function loadViewProjectContent(projectId) {
        const project = PROJECTS_DATA.find(p => p.id == projectId);
        if (!project) {
            return `<p class="alert alert-error">Projeto não encontrado.</p><a href="#projects" class="btn btn-primary">Voltar</a>`;
        }
        
        return `
            <section>
                <h2 style="margin-bottom: var(--space-sm);">${project.title}</h2>
                <p class="alert alert-success">Esta é a **Single Page View**, carregada dinamicamente via JavaScript.</p>
                <img src="${project.image}" alt="${project.title}" style="max-height: 400px; object-fit: cover; margin-bottom: var(--space-md);">
                
                <p><strong>Descrição Completa:</strong> ${project.description}</p>
                <p><strong>Impacto Estimado:</strong> ${project.impact}</p>
                <p><strong>Categoria:</strong> <span class="badge ${project.badgeClass}">${project.badgeText}</span></p>
                <a href="#projects" class="btn btn-primary" style="margin-top: var(--space-md);">Voltar para Projetos</a>
            </section>
        `;
    }

    function handleRoute() {
        if (!mainContent) return; 

        const hash = window.location.hash.slice(1);
        let content = '';

        if (!hash || hash === 'home') {
            content = loadHomeContent();
        } else if (hash === 'projects') {
            content = loadProjectsContent();
        } else if (hash.startsWith('view-project/')) {
            const projectId = hash.split('/')[1];
            content = loadViewProjectContent(projectId);
        } else {
             content = `<p class="alert alert-error">Página não encontrada. <a href="#home">Voltar</a></p>`;
        }
        
        mainContent.innerHTML = content;
    }
    
    if (document.body.id === 'index-page') {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }
});
