document.addEventListener("DOMContentLoaded", () => {
  const selects = document.querySelectorAll("select");
  const compareButton = document.getElementById("compare-button");
  const searchInput = document.getElementById("comparison-search");

  const resultCards = document.querySelectorAll(".result-card");
  const tableRows = document.querySelectorAll(".comparison-table tbody tr:not(.empty-row)");
  const emptyRow = document.getElementById("empty-comparison-row");

  // Normaliza o texto para busca.
  // Assim, "atenção" e "atencao" funcionam da mesma forma.
  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Efeito visual quando o usuário troca uma varredura.
  selects.forEach((select) => {
    select.addEventListener("change", () => {
      select.classList.add("changed");

      setTimeout(() => {
        select.classList.remove("changed");
      }, 1000);
    });
  });

  // Simula a ação de comparar.
  // Depois, quando tiver backend, essa parte pode chamar a API.
  if (compareButton) {
    compareButton.addEventListener("click", () => {
      compareButton.classList.add("loading");
      compareButton.innerHTML = `
        <span class="material-symbols-outlined">sync</span>
        Comparando...
      `;

      setTimeout(() => {
        compareButton.classList.remove("loading");
        compareButton.innerHTML = `
          <span class="material-symbols-outlined">compare</span>
          Comparar
        `;

        alert("Comparação realizada com sucesso!");
      }, 800);
    });
  }

  // Busca nos cards e na tabela.
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = normalizeText(searchInput.value.trim());

      let visibleTableRows = 0;

      resultCards.forEach((card) => {
        const cardText = normalizeText(card.dataset.search || card.textContent);
        const shouldShow = cardText.includes(searchTerm);

        card.style.display = shouldShow ? "" : "none";
      });

      tableRows.forEach((row) => {
        const rowText = normalizeText(row.dataset.search || row.textContent);
        const shouldShow = rowText.includes(searchTerm);

        row.style.display = shouldShow ? "" : "none";

        if (shouldShow) {
          visibleTableRows++;
        }
      });

      if (emptyRow) {
        emptyRow.style.display = visibleTableRows === 0 ? "table-row" : "none";
      }
    });
  }
});