import express from 'express';
import historicoInflacao from './dados/dados.js';

const app = express();
const porta = 8080;

app.get('/historicoIPCA/calculo', (req, res) => {
    console.log('Rota de cálculo chamada com parâmetros:', req.query);

    const valorBase = parseFloat(req.query.valor);
    const mesInicio = parseInt(req.query.mesInicial);
    const anoInicio = parseInt(req.query.anoInicial);
    const mesFim = parseInt(req.query.mesFinal);
    const anoFim = parseInt(req.query.anoFinal);

    // Validação de parâmetros
    if (
        isNaN(valorBase) || isNaN(mesInicio) || isNaN(anoInicio) || 
        isNaN(mesFim) || isNaN(anoFim) ||
        mesInicio < 1 || mesInicio > 12 || 
        mesFim < 1 || mesFim > 12 || 
        anoInicio > anoFim || anoFim > 2024||
        anoFim > anoFim || anoInicio < 2015

    ) {
        return res.status(400).json({ erro: 'Parâmetros inválidos ou fora do intervalo permitido.' });
    }

    // Filtragem dos dados no período solicitado
    const periodoSelecionado = historicoInflacao.filter(registro => {
        return (
            (registro.ano > anoInicio || (registro.ano === anoInicio && registro.mes >= mesInicio)) &&
            (registro.ano < anoFim || (registro.ano === anoFim && registro.mes <= mesFim))
        );
    });

    if (periodoSelecionado.length === 0) {
        return res.status(404).json({ erro: 'Nada encontrado para o período especificado.' });
    }

    // Cálculo do valor ajustado
    let valorAjustado = valorBase;
    periodoSelecionado.forEach(registro => {
        valorAjustado *= (1 + registro.ipca / 100);
    });

    res.json({
        valorInicial: valorBase,
        valorReajustado: valorAjustado.toFixed(2),
    });
});

app.get('/historicoIPCA', (req, res) => {
    const anoPesquisa = parseInt(req.query.ano);

    if (!isNaN(anoPesquisa)) {
        const registrosAno = historicoInflacao.filter(registro => registro.ano === anoPesquisa);
        return registrosAno.length > 0
            ? res.json(registrosAno)
            : res.status(404).json({ erro: 'Nada encontrado para o ano especificado.' });
    }

    res.json(historicoInflacao);
});

app.get('/historicoIPCA/:id', (req, res) => {
    const identificador = parseInt(req.params.id);

    if (isNaN(identificador)) {
        return res.status(400).json({ erro: 'ID inválido.' });
    }

    const resultado = historicoInflacao.find(registro => registro.id === identificador);

    return resultado
        ? res.json(resultado)
        : res.status(404).json({ erro: 'Elemento não encontrado, ID incorreto.' });
});

app.listen(porta, () => {
    console.log(`API rodando na porta ${porta}`);
});