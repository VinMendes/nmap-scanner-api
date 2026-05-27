
// evita que os links com "#" recarreguem ou levem a página para o topo.
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

// microinteração para as linhas da tabela.
document.querySelectorAll("tbody tr").forEach((row) => {
  row.addEventListener("click", () => {
    console.log("Detalhes da linha solicitados.");
  });
});

// efeito simples de clique nos botões.
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("mousedown", () => {
    button.classList.add("is-pressed");
  });

  button.addEventListener("mouseup", () => {
    button.classList.remove("is-pressed");
  });

  button.addEventListener("mouseleave", () => {
    button.classList.remove("is-pressed");
  });
});

// TODO: substituir os valores fixos da tabela por dados vindos da API