import historicoInflacao from '../dados/dados.js';


export function obterHistoricoCompleto() {
    return historicoInflacao;
}

export function filtrarPorAno(ano) {
    return historicoInflacao.filter(dado => dado.ano === ano);
}


export function calcularMediaAnual(ano) {
    const dadosAno = filtrarPorAno(ano);
    const soma = dadosAno.reduce((acc, dado) => acc + dado.ipca, 0);
    return dadosAno.length > 0 ? (soma / dadosAno.length).toFixed(2) : 0;
}


export function calcularReajuste(valor, mesInicial, anoInicial, mesFinal, anoFinal, dados) {
    
    const ipcaInicial = dados.find(dado => dado.ano === anoInicial && dado.mes === mesInicial);
    const ipcaFinal = dados.find(dado => dado.ano === anoFinal && dado.mes === mesFinal);

    if (!ipcaInicial || !ipcaFinal) {
        return null;  
    }

   
    const ipcaTotal = dados
        .filter(dado => (dado.ano > anoInicial || (dado.ano === anoInicial && dado.mes >= mesInicial)) &&
                        (dado.ano < anoFinal || (dado.ano === anoFinal && dado.mes <= mesFinal)))
        .reduce((acc, dado) => acc + dado.ipca, 0);

  
    const valorReajustado = valor * (1 + ipcaTotal / 100);
    return valorReajustado.toFixed(2);  
}