document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("historico-search");
  const tableRows = document.querySelectorAll(".history-table tbody tr:not(.empty-row)");
  const emptyRow = document.getElementById("empty-row");
  const historyCount = document.getElementById("history-count");
  const compareButtons = document.querySelectorAll(".compare-button");

  // Normaliza texto para facilitar a busca.
  // Exemplo: "Varredura" e "varredura" serão tratados do mesmo jeito.
  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Atualiza a quantidade de registros visíveis na tabela.
  function updateVisibleCount() {
    let visibleRows = 0;

    tableRows.forEach((row) => {
      if (row.style.display !== "none") {
        visibleRows++;
      }
    });

    if (historyCount) {
      historyCount.textContent = `Mostrando ${visibleRows} de 124 registros`;
    }

    if (emptyRow) {
      emptyRow.style.display = visibleRows === 0 ? "table-row" : "none";
    }
  }

  // Filtro de busca da tabela.
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = normalizeText(searchInput.value.trim());

      tableRows.forEach((row) => {
        const rowText = normalizeText(row.dataset.search || row.textContent);

        const shouldShow = rowText.includes(searchTerm);

        row.style.display = shouldShow ? "" : "none";
      });

      updateVisibleCount();
    });
  }

  // Ação dos botões "Comparar".
  compareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scanId = button.dataset.scanId;

      // Quando a tela de comparação estiver pronta,
      // esse link já leva o ID da varredura selecionada.
      window.location.href = `comparacao.html?scan=${encodeURIComponent(scanId)}`;
    });
  });

  updateVisibleCount();
});