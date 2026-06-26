const FALLBACK_CATEGORY_IMAGE = '/img/hero-stationery.jpg';

function loadCategoryCards(products) {
  const pick = (categoryName) => {
    const normalized = categoryName.toLowerCase();
    const matched = products
      .filter(p => (p.category || '').toLowerCase() === normalized)
      .flatMap(p => (p.images || []).filter((img) => typeof img === 'string' && img.trim().length > 0));
    const images = matched.length
      ? matched.slice(0, 4)
      : Array.from({ length: 4 }, () => FALLBACK_CATEGORY_IMAGE);
    return {
      id: normalized,
      name: categoryName,
      href: `/catalog?category=${normalized}`,
      images,
    };
  };

  return [pick('Escolares'), pick('Presentes')];
}

function run(label, products) {
  console.log(`\n=== ${label} ===`);
  console.log('Input products:', JSON.stringify(products, null, 2));
  console.log('Result:', JSON.stringify(loadCategoryCards(products), null, 2));
}

run('Cenário 1: API com fotos válidas em ambas categorias', [
  { category: 'Escolares', images: ['https://exemplo.com/a.jpg', 'https://exemplo.com/b.jpg'] },
  { category: 'Presentes', images: ['https://exemplo.com/c.jpg'] },
]);

run('Cenário 2: API sem fotos (arrays vazios)', [
  { category: 'Escolares', images: [] },
  { category: 'Presentes', images: [] },
]);

run('Cenário 3: API com fotos inválidas (nulls, undefined, strings vazias)', [
  { category: 'Escolares', images: [null, undefined, '', '   ', 'https://exemplo.com/x.jpg'] },
  { category: 'Presentes', images: [null] },
]);

run('Cenário 4: API mista — uma categoria vazia, outra com fotos', [
  { category: 'Escolares', images: [] },
  { category: 'Presentes', images: ['https://exemplo.com/y.jpg', 'https://exemplo.com/z.jpg'] },
]);

run('Cenário 5: Sem produtos', []);
