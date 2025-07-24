function popularTabela() {

    const tabela = document.getElementById("tabela-meus-pareceres").getElementsByTagName('tbody')[0];
    const dados = [
        { id: 1, nome: "João", cnpj: 111111 },
        { id: 2, nome: "Maria", cnpj: 22222 },
        { id: 3, nome: "Pedro", cnpj: 33333 }
    ];

    tabela.innerHTML = "";

    dados.forEach(item => {
        const linha = tabela.insertRow();

        // Checkbox
        let tdCheckbox = linha.insertCell();
        tdCheckbox.setAttribute('data-label', '');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item.id;
        tdCheckbox.appendChild(checkbox);

        // Adiciona evento para mudar cor da linha ao selecionar
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                linha.style.backgroundColor = '#c6f7d0'; // verde claro
            } else {
                linha.style.backgroundColor = ''; // volta ao padrão
            }
        });

        // Código
        let td1 = linha.insertCell();
        td1.textContent = item.id;
        td1.setAttribute('data-label', 'Codigo');

        // Emitente
        let td2 = linha.insertCell();
        td2.textContent = item.nome;
        td2.setAttribute('data-label', 'Emitente');

        // CNPJ Tomador
        let td3 = linha.insertCell();
        td3.textContent = item.cnpj;
        td3.setAttribute('data-label', 'cnpj tomador');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    popularTabela();
});