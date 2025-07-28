let breaches = [];

function renderBreaches(filter = "") {
  const list = document.getElementById('breachList');
  list.innerHTML = '';

  const filtered = filter
    ? breaches.filter(b => b.tag === filter)
    : breaches;

  filtered.forEach((breach, index) => {
    const div = document.createElement('div');
    div.className = 'breach-card';

    div.innerHTML = `
      <h3>${breach.tag}</h3>
      <p><strong>Category:</strong> ${breach.category}</p>
      <p><strong>Aliases:</strong> ${breach.aliases.join(', ')}</p>
      <button onclick="editBreach(${index})">Edit</button>
      <button onclick="deleteBreach(${index})">Delete</button>
    `;

    list.appendChild(div);
  });
}

function populateFilter() {
  const filter = document.getElementById('breachFilter');
  filter.innerHTML = '<option value="">-- All Breaches --</option>';

  const tags = [...new Set(breaches.map(b => b.tag))];
  tags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    filter.appendChild(opt);
  });
}

function editBreach(index) {
  const b = breaches[index];
  document.getElementById('breachCategory').value = b.category;
  document.getElementById('breachTag').value = b.tag;
  document.getElementById('breachAliases').value = b.aliases.join(', ');
}

function deleteBreach(index) {
  breaches.splice(index, 1);
  renderBreaches(document.getElementById('breachFilter').value);
  populateFilter();
}

document.getElementById('addBreach').onclick = () => {
  const category = document.getElementById('breachCategory').value.trim();
  const tag = document.getElementById('breachTag').value.trim();
  const aliases = document.getElementById('breachAliases').value.split(',').map(s => s.trim());

  const existingIndex = breaches.findIndex(b => b.tag === tag);
  if (existingIndex >= 0) {
    breaches[existingIndex] = { category, tag, aliases };
  } else {
    breaches.push({ category, tag, aliases });
  }

  renderBreaches(document.getElementById('breachFilter').value);
  populateFilter();

  // Clear inputs
  document.getElementById('breachCategory').value = '';
  document.getElementById('breachTag').value = '';
  document.getElementById('breachAliases').value = '';
};

document.getElementById('breachFilter').onchange = (e) => {
  renderBreaches(e.target.value);
};

fetch('data/breaches/breaches.json')
  .then(res => res.json())
  .then(data => {
    breaches = data;
    renderBreaches();
    populateFilter();
  });
