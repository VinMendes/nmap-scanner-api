// Evita que links com "#" recarreguem ou movam a página para o topo.
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
  });
});

// Exemplo simples de feedback visual nos botões principais.
// Depois, quando o backend estiver pronto, esses cliques podem virar navegação real.
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', () => {
    console.log(`Botão clicado: ${button.textContent.trim()}`);
  });
});