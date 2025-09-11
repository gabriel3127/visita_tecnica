// Configuração do Supabase
let supabaseUrl, supabaseKey;
let supabaseClient;

// Função para carregar configurações
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) {
            throw new Error('Falha ao carregar configurações');
        }
        const config = await response.json();
        supabaseUrl = config.supabaseUrl;
        supabaseKey = config.supabaseKey;
        
        // Verificar se as configurações foram carregadas
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Configurações do Supabase não encontradas');
        }
        
        // Inicializar Supabase após carregar as configurações
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
            console.log('Supabase conectado com sucesso');
        }
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        alert('Erro ao conectar com o banco de dados. Verifique sua conexão e tente novamente.');
        // Não usar fallback com credenciais expostas
        supabaseClient = null;
    }
}

// Carregar configurações quando a página carregar
loadConfig();

        // Funcionalidade para ratings - CORRIGIDA
        document.addEventListener('DOMContentLoaded', function() {
            // Define a data atual por padrão
            const dataInput = document.getElementById('data');
            if (dataInput) {
                dataInput.valueAsDate = new Date();
            }

            // Funcionalidade dos ratings
            document.querySelectorAll('.rating-group').forEach(group => {
                group.addEventListener('click', (e) => {
                    if (e.target.classList.contains('rating-option')) {
                        // Remove seleção anterior no mesmo grupo
                        group.querySelectorAll('.rating-option').forEach(option => {
                            option.classList.remove('selected');
                        });
                        // Adiciona nova seleção
                        e.target.classList.add('selected');
                        console.log('Rating selecionado:', e.target.dataset.value);
                    }
                });
            });

            // Event listener para o botão salvar
            const btnSalvar = document.getElementById('btnSalvar');
            if (btnSalvar) {
                btnSalvar.addEventListener('click', salvarRelatorio);
            }
        });

        // Função para gerar arquivo local (backup)
        function gerarArquivoLocal(dados) {
            // Gera o relatório em texto
            let relatorio = `=== RELATÓRIO DE VISITA TÉCNICA - PSR EMBALAGENS ===\n\n`;
            
            relatorio += `📋 INFORMAÇÕES GERAIS\n`;
            relatorio += `Data: ${dados.informacoes_gerais.data}\n`;
            relatorio += `Consultor: ${dados.informacoes_gerais.consultor}\n`;
            relatorio += `Cliente: ${dados.informacoes_gerais.cliente}\n`;
            relatorio += `Contato: ${dados.informacoes_gerais.contato}\n`;
            relatorio += `Segmento: ${dados.informacoes_gerais.segmento}\n`;
            relatorio += `Porte: ${dados.informacoes_gerais.porte}\n\n`;

            relatorio += `⭐ FEEDBACK DO CLIENTE\n`;
            relatorio += `Atendimento: ${dados.feedback.atendimento}\n`;
            relatorio += `Variedade: ${dados.feedback.variedade}\n`;
            relatorio += `Entrega: ${dados.feedback.entrega}\n`;
            relatorio += `Comentários: ${dados.feedback.comentario}\n\n`;

            relatorio += `💼 OPORTUNIDADES DE NEGÓCIO\n`;
            relatorio += `Produtos nossos que utiliza: ${dados.oportunidades.produtos_nossos.join(', ')}\n`;
            relatorio += `Volume atual: ${dados.oportunidades.volume_atual}\n`;
            relatorio += `Motivo não compra outros: ${dados.oportunidades.motivo_nao_compra}\n`;
            relatorio += `Detalhes das oportunidades: ${dados.oportunidades.detalhes_oportunidades}\n`;
            relatorio += `Interesse em expansão: ${dados.oportunidades.interesse_expansao}\n\n`;

            relatorio += `⚠️ RECLAMAÇÕES DO CLIENTE\n`;
            relatorio += `Teve reclamação: ${dados.reclamacoes.tem_reclamacao}\n`;
            relatorio += `Tipo de reclamação: ${dados.reclamacoes.tipo_reclamacao.join(', ')}\n`;
            relatorio += `Detalhes da reclamação: ${dados.reclamacoes.detalhes_reclamacao}\n`;
            relatorio += `Gravidade: ${dados.reclamacoes.gravidade_reclamacao}\n`;
            relatorio += `Ação imediata: ${dados.reclamacoes.acao_imediata}\n`;
            relatorio += `Solução proposta: ${dados.reclamacoes.solucao_proposta}\n`;
            relatorio += `Satisfação com solução: ${dados.reclamacoes.satisfacao_solucao}\n\n`;

            relatorio += `📝 OBSERVAÇÕES E PRÓXIMOS PASSOS\n`;
            relatorio += `Observações gerais: ${dados.observacoes.observacoes}\n`;
            relatorio += `Próximos passos: ${dados.observacoes.proximos_passos}\n`;
            relatorio += `Prioridade: ${dados.observacoes.prioridade}\n`;

            // Cria e baixa o arquivo
            const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Relatorio_Visita_${dados.informacoes_gerais.cliente.replace(/\s+/g, '_')}_${dados.informacoes_gerais.data}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Função principal - CORRIGIDA
        async function salvarRelatorio() {
            console.log('Iniciando salvamento do relatório...');
            
            const btnSalvar = document.getElementById('btnSalvar');
            if (btnSalvar) {
                btnSalvar.classList.add('loading');
                btnSalvar.textContent = '💾 Salvando...';
                btnSalvar.disabled = true;
            }

            try {
                // Coleta todos os dados do formulário
                const dados = {
                    informacoes_gerais: {
                        data: document.getElementById('data')?.value || '',
                        consultor: document.getElementById('consultor')?.value || '',
                        cliente: document.getElementById('cliente')?.value || '',
                        contato: document.getElementById('contato')?.value || '',
                        segmento: document.getElementById('segmento')?.value || '',
                        porte: document.getElementById('porte')?.value || ''
                    },
                    feedback: {
                        atendimento: document.querySelector('[data-rating="atendimento"] .selected')?.dataset.value || '',
                        variedade: document.querySelector('[data-rating="variedade"] .selected')?.dataset.value || '',
                        entrega: document.querySelector('[data-rating="entrega"] .selected')?.dataset.value || '',
                        comentario: document.getElementById('comentario')?.value || ''
                    },
                    oportunidades: {
                        produtos_nossos: Array.from(document.querySelectorAll('input[name="produtos-nossos"]:checked')).map(cb => cb.value),
                        volume_atual: document.querySelector('[data-rating="volume-atual"] .selected')?.dataset.value || '',
                        motivo_nao_compra: document.getElementById('motivo-nao-compra')?.value || '',
                        detalhes_oportunidades: document.getElementById('detalhes-oportunidades')?.value || '',
                        interesse_expansao: document.querySelector('[data-rating="interesse-expansao"] .selected')?.dataset.value || ''
                    },
                    reclamacoes: {
                        tem_reclamacao: document.querySelector('[data-rating="tem-reclamacao"] .selected')?.dataset.value || '',
                        tipo_reclamacao: Array.from(document.querySelectorAll('input[name="tipo-reclamacao"]:checked')).map(cb => cb.value),
                        detalhes_reclamacao: document.getElementById('detalhes-reclamacao')?.value || '',
                        gravidade_reclamacao: document.querySelector('[data-rating="gravidade-reclamacao"] .selected')?.dataset.value || '',
                        acao_imediata: document.getElementById('acao-imediata')?.value || '',
                        solucao_proposta: document.getElementById('solucao-proposta')?.value || '',
                        satisfacao_solucao: document.querySelector('[data-rating="satisfacao-solucao"] .selected')?.dataset.value || ''
                    },
                    observacoes: {
                        observacoes: document.getElementById('observacoes')?.value || '',
                        proximos_passos: document.getElementById('proximos-passos')?.value || '',
                        prioridade: document.querySelector('[data-rating="prioridade"] .selected')?.dataset.value || ''
                    }
                };

                console.log('Dados coletados:', dados);

                // Validação básica
                if (!dados.informacoes_gerais.data || !dados.informacoes_gerais.cliente || !dados.informacoes_gerais.consultor) {
                    alert('Preencha pelo menos a data, nome do cliente e consultor.');
                    return;
                }

                // Preparar dados para Supabase (estrutura achatada)
                const dadosSupabase = {
                    // Informações gerais
                    data_visita: dados.informacoes_gerais.data,
                    consultor: dados.informacoes_gerais.consultor,
                    cliente: dados.informacoes_gerais.cliente,
                    contato: dados.informacoes_gerais.contato,
                    segmento: dados.informacoes_gerais.segmento,
                    porte: dados.informacoes_gerais.porte,
                    
                    // Feedback
                    avaliacao_atendimento: dados.feedback.atendimento,
                    avaliacao_variedade: dados.feedback.variedade,
                    avaliacao_entrega: dados.feedback.entrega,
                    comentarios_feedback: dados.feedback.comentario,
                    
                    // Oportunidades
                    produtos_utilizados: dados.oportunidades.produtos_nossos,
                    volume_atual: dados.oportunidades.volume_atual,
                    motivo_nao_compra: dados.oportunidades.motivo_nao_compra,
                    detalhes_oportunidades: dados.oportunidades.detalhes_oportunidades,
                    interesse_expansao: dados.oportunidades.interesse_expansao,
                    
                    // Reclamações
                    tem_reclamacao: dados.reclamacoes.tem_reclamacao,
                    tipos_reclamacao: dados.reclamacoes.tipo_reclamacao,
                    detalhes_reclamacao: dados.reclamacoes.detalhes_reclamacao,
                    gravidade_reclamacao: dados.reclamacoes.gravidade_reclamacao,
                    acao_imediata: dados.reclamacoes.acao_imediata,
                    solucao_proposta: dados.reclamacoes.solucao_proposta,
                    satisfacao_solucao: dados.reclamacoes.satisfacao_solucao,
                    
                    // Observações
                    observacoes_gerais: dados.observacoes.observacoes,
                    proximos_passos: dados.observacoes.proximos_passos,
                    prioridade: dados.observacoes.prioridade,
                    
                    // Metadados
                    created_at: new Date().toISOString()
                };

                console.log('Dados para Supabase:', dadosSupabase);

                // Tentar salvar no Supabase
                if (supabaseClient) {
                    const { data, error } = await supabaseClient
                        .from('relatorios_visita')
                        .insert([dadosSupabase]);

                    if (error) {
                        console.error('Erro ao salvar no Supabase:', error);
                        throw error;
                    }

                    console.log('Relatório salvo no Supabase:', data);
                    alert('Relatório salvo com sucesso no banco de dados!');
                } else {
                    console.warn('Supabase não disponível, salvando apenas localmente');
                    alert('Banco de dados não disponível. Salvando apenas arquivo local.');
                }
                
                // Gerar arquivo local como backup
                gerarArquivoLocal(dados);
                
                // Opcional: limpar formulário
                if (confirm('Deseja limpar o formulário para uma nova visita?')) {
                    document.querySelectorAll('input[type="text"], input[type="date"], select, textarea').forEach(field => {
                        if (field.id !== 'data') { // Manter a data atual
                            field.value = '';
                        }
                    });
                    
                    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                        cb.checked = false;
                    });
                    
                    document.querySelectorAll('.rating-option.selected').forEach(option => {
                        option.classList.remove('selected');
                    });
                }
                
            } catch (error) {
                console.error('Erro ao salvar:', error);
                
                // Em caso de erro, ainda gera arquivo local
                try {
                    const dadosBackup = {
                        informacoes_gerais: {
                            data: document.getElementById('data')?.value || '',
                            consultor: document.getElementById('consultor')?.value || '',
                            cliente: document.getElementById('cliente')?.value || '',
                            contato: document.getElementById('contato')?.value || '',
                            segmento: document.getElementById('segmento')?.value || '',
                            porte: document.getElementById('porte')?.value || ''
                        },
                        feedback: {
                            atendimento: document.querySelector('[data-rating="atendimento"] .selected')?.dataset.value || '',
                            variedade: document.querySelector('[data-rating="variedade"] .selected')?.dataset.value || '',
                            entrega: document.querySelector('[data-rating="entrega"] .selected')?.dataset.value || '',
                            comentario: document.getElementById('comentario')?.value || ''
                        },
                        oportunidades: {
                            produtos_nossos: Array.from(document.querySelectorAll('input[name="produtos-nossos"]:checked')).map(cb => cb.value),
                            volume_atual: document.querySelector('[data-rating="volume-atual"] .selected')?.dataset.value || '',
                            motivo_nao_compra: document.getElementById('motivo-nao-compra')?.value || '',
                            detalhes_oportunidades: document.getElementById('detalhes-oportunidades')?.value || '',
                            interesse_expansao: document.querySelector('[data-rating="interesse-expansao"] .selected')?.dataset.value || ''
                        },
                        reclamacoes: {
                            tem_reclamacao: document.querySelector('[data-rating="tem-reclamacao"] .selected')?.dataset.value || '',
                            tipo_reclamacao: Array.from(document.querySelectorAll('input[name="tipo-reclamacao"]:checked')).map(cb => cb.value),
                            detalhes_reclamacao: document.getElementById('detalhes-reclamacao')?.value || '',
                            gravidade_reclamacao: document.querySelector('[data-rating="gravidade-reclamacao"] .selected')?.dataset.value || '',
                            acao_imediata: document.getElementById('acao-imediata')?.value || '',
                            solucao_proposta: document.getElementById('solucao-proposta')?.value || '',
                            satisfacao_solucao: document.querySelector('[data-rating="satisfacao-solucao"] .selected')?.dataset.value || ''
                        },
                        observacoes: {
                            observacoes: document.getElementById('observacoes')?.value || '',
                            proximos_passos: document.getElementById('proximos-passos')?.value || '',
                            prioridade: document.querySelector('[data-rating="prioridade"] .selected')?.dataset.value || ''
                        }
                    };
                    
                    gerarArquivoLocal(dadosBackup);
                    alert('Erro ao salvar online, mas arquivo local foi gerado como backup. Erro: ' + error.message);
                } catch (backupError) {
                    console.error('Erro ao gerar backup:', backupError);
                    alert('Erro ao salvar dados. Tente novamente.');
                }
            } finally {
                // Restaurar botão
                if (btnSalvar) {
                    btnSalvar.classList.remove('loading');
                    btnSalvar.textContent = '💾 Salvar Relatório';
                    btnSalvar.disabled = false;
                }
            }
        }