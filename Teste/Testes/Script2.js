8let dados = []; // Agora será preenchido via API
let ordemAtual = 'asc';

// Função para popular o combo box com as chaves do JSON
function popularComboBoxComChaves(dados) {
    const select = document.getElementById("coluna-select");
    select.innerHTML = "";
    if (dados.length > 0) {
        Object.keys(dados[0]).forEach(chave => {
            const option = document.createElement("option");
            option.value = chave;
            option.textContent = chave.charAt(0).toUpperCase() + chave.slice(1);
            select.appendChild(option);
        });
    }
}

// Função para popular a tabela
function popularTabela() {
    const tabela = document.getElementById("tabela-meus-pareceres").getElementsByTagName('tbody')[0];
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

        checkbox.addEventListener('change', function() {
            linha.style.backgroundColor = checkbox.checked ? '#c6f7d0' : '';
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

// Função para ordenar e atualizar a tabela
function ordenarTabela(ordem) {
    ordemAtual = ordem;
    const coluna = document.getElementById("coluna-select").value;
    if (!coluna) return;

    dados.sort((a, b) => {
        if (a[coluna] < b[coluna]) return ordem === 'asc' ? -1 : 1;
        if (a[coluna] > b[coluna]) return ordem === 'asc' ? 1 : -1;
        return 0;
    });

    popularTabela();
}

// Buscar dados da API Flask ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:5000/api/dados') // Altere para a URL da sua API Flask
        .then(response => response.json())
        .then(json => {
            dados = json;
            popularComboBoxComChaves(dados);
            popularTabela();
        })
        .catch(error => {
            alert('Erro ao carregar dados da API!');
            console.error(error);
        });
    
    document.getElementById("ordem-crescente").addEventListener("click", function() {
        ordenarTabela('asc');
    });

    document.getElementById("ordem-decrescente").addEventListener("click", function() {
        ordenarTabela('desc');
    });

    document.getElementById("coluna-select").addEventListener("change", function() {
        ordenarTabela(ordemAtual);
    });
});



document.addEventListener("DOMContentLoaded", function () {
  const tabela = document.getElementById("minhaTabela");
  const select = document.getElementById("comboCabecalho");
  const btnAsc = document.getElementById("btnAsc");
  const btnDesc = document.getElementById("btnDesc");

  // Popula o combo com os cabeçalhos
  const cabecalhos = tabela.querySelectorAll("thead th");
  cabecalhos.forEach((th, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = th.textContent.trim();
    select.appendChild(option);
  });

  // Função de ordenação
  function ordenarTabela(indiceColuna, crescente = true) {
    const tbody = tabela.querySelector("tbody");
    const linhas = Array.from(tbody.querySelectorAll("tr"));

    linhas.sort((a, b) => {
      const textoA = a.children[indiceColuna].textContent.trim();
      const textoB = b.children[indiceColuna].textContent.trim();

      // Tenta converter para número se possível
      const valorA = isNaN(textoA) ? textoA : parseFloat(textoA);
      const valorB = isNaN(textoB) ? textoB : parseFloat(textoB);

      if (valorA < valorB) return crescente ? -1 : 1;
      if (valorA > valorB) return crescente ? 1 : -1;
      return 0;
    });

    // Reaplica as linhas ordenadas
    linhas.forEach(linha => tbody.appendChild(linha));
  }

  // Eventos de clique dos botões
  btnAsc.addEventListener("click", () => {
    const indice = parseInt(select.value, 10);
    ordenarTabela(indice, true);
  });

  btnDesc.addEventListener("click", () => {
    const indice = parseInt(select.value, 10);
    ordenarTabela(indice, false);
  });
});