// Funcionalidade para ratings
document.querySelectorAll('.rating-group').forEach(group => {
    group.addEventListener('click', (e) => {
        if (e.target.classList.contains('rating-option')) {
            // Remove seleção anterior
            group.querySelectorAll('.rating-option').forEach(option => {
                option.classList.remove('selected');
            });
            // Adiciona nova seleção
            e.target.classList.add('selected');
        }
    });
});

function salvarRelatorio() {
    // Coleta todos os dados do formulário
    const dados = {
        informacoes_gerais: {
            data: document.getElementById('data').value,
            vendedor: document.getElementById('vendedor').value,
            cliente: document.getElementById('cliente').value,
            contato: document.getElementById('contato').value,
            segmento: document.getElementById('segmento').value,
            porte: document.getElementById('porte').value
        },
        feedback: {
            atendimento: document.querySelector('[data-rating="atendimento"] .selected')?.dataset.value || '',
            feedback_atendimento: document.getElementById('feedback-atendimento').value,
            variedade: document.querySelector('[data-rating="variedade"] .selected')?.dataset.value || '',
            feedback_variedade: document.getElementById('feedback-variedade').value,
            entrega: document.querySelector('[data-rating="entrega"] .selected')?.dataset.value || '',
            feedback_entrega: document.getElementById('feedback-entrega').value
        },
        oportunidades: {
            produtos_nossos: Array.from(document.querySelectorAll('input[name="produtos-nossos"]:checked')).map(cb => cb.value),
            volume_atual: document.getElementById('volume-atual').value,
            motivo_nao_compra: document.getElementById('motivo-nao-compra').value,
            oportunidades: Array.from(document.querySelectorAll('input[name="oportunidades"]:checked')).map(cb => cb.value),
            detalhes_oportunidades: document.getElementById('detalhes-oportunidades').value,
            interesse_expansao: document.querySelector('[data-rating="interesse-expansao"] .selected')?.dataset.value || ''
        },
        reclamacoes: {
            tem_reclamacao: document.querySelector('[data-rating="tem-reclamacao"] .selected')?.dataset.value || '',
            tipo_reclamacao: Array.from(document.querySelectorAll('input[name="tipo-reclamacao"]:checked')).map(cb => cb.value),
            detalhes_reclamacao: document.getElementById('detalhes-reclamacao').value,
            gravidade_reclamacao: document.querySelector('[data-rating="gravidade-reclamacao"] .selected')?.dataset.value || '',
            acao_imediata: document.getElementById('acao-imediata').value,
            solucao_proposta: document.getElementById('solucao-proposta').value,
            satisfacao_solucao: document.querySelector('[data-rating="satisfacao-solucao"] .selected')?.dataset.value || ''
        },
        observacoes: {
            observacoes: document.getElementById('observacoes').value,
            proximos_passos: document.getElementById('proximos-passos').value,
            prioridade: document.querySelector('[data-rating="prioridade"] .selected')?.dataset.value || ''
        }
    };

    // Gera o relatório em texto
    let relatorio = `=== RELATÓRIO DE VISITA TÉCNICA - PSR EMBALAGENS ===\n\n`;
    
    relatorio += `📋 INFORMAÇÕES GERAIS\n`;
    relatorio += `Data: ${dados.informacoes_gerais.data}\n`;
    relatorio += `Vendedor/Técnico: ${dados.informacoes_gerais.vendedor}\n`;
    relatorio += `Cliente: ${dados.informacoes_gerais.cliente}\n`;
    relatorio += `Contato: ${dados.informacoes_gerais.contato}\n`;
    relatorio += `Segmento: ${dados.informacoes_gerais.segmento}\n`;
    relatorio += `Porte: ${dados.informacoes_gerais.porte}\n\n`;

    relatorio += `⭐ FEEDBACK DO CLIENTE\n`;
    relatorio += `Atendimento: ${dados.feedback.atendimento}\n`;
    relatorio += `Comentários Atendimento: ${dados.feedback.feedback_atendimento}\n`;
    relatorio += `Variedade: ${dados.feedback.variedade}\n`;
    relatorio += `Comentários Variedade: ${dados.feedback.feedback_variedade}\n`;
    relatorio += `Entrega: ${dados.feedback.entrega}\n`;
    relatorio += `Comentários Entrega: ${dados.feedback.feedback_entrega}\n\n`;

    relatorio += `💼 OPORTUNIDADES DE NEGÓCIO\n`;
    relatorio += `Produtos nossos que utiliza: ${dados.oportunidades.produtos_nossos.join(', ')}\n`;
    relatorio += `Volume atual: ${dados.oportunidades.volume_atual}\n`;
    relatorio += `Motivo não compra outros: ${dados.oportunidades.motivo_nao_compra}\n`;
    relatorio += `Oportunidades identificadas: ${dados.oportunidades.oportunidades.join(', ')}\n`;
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

    alert('Relatório salvo com sucesso!');
}

// Define a data atual por padrão
document.getElementById('data').valueAsDate = new Date();