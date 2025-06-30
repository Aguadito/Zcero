// Hacer las tarjetas más accesibles
document.querySelectorAll('.credit-type-card').forEach(card => {
  // Permitir activación con Enter
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      card.querySelector('a').click();
    }
  });
  
  // Efecto de foco para usuarios de teclado
  card.addEventListener('focus', () => {
    card.style.outline = '3px solid var(--accent)';
  });
  
  card.addEventListener('blur', () => {
    card.style.outline = 'none';
  });
});