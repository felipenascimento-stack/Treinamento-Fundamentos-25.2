// Itens da Loja Secreta
// Aquino, se você está lendo isso, DOTA2 >>> LOL (omegalul)
const produtos = [
  { id: 1, nome: "Perseverança", efeitos: "+6,5 de regeneração de vida, +2,25 de regeneração de mana.", lore: "“Uma gema que concede coragem ao portador.”", preco: 1700 },
  { id: 2, nome: "Amplificador Espiritual", efeitos: "+425 de vida, +425 de mana.", lore: "“Uma pedra pulsante que amplifica a energia vital e espiritual do herói.”", preco: 3200 },
  { id: 3, nome: "Fragmento Lunar", efeitos: "+200 de velocidade de ataque, pode ser consumido para conceder visão noturna adicional e bônus permanente de velocidade de ataque.", lore: "“Um fragmento banhado pela luz da lua, irradiando poder e serenidade.”", preco: 4000 },
  { id: 4, nome: "Orbe de Lótus", efeitos: "+10 de armadura, +6,5 de regeneração de vida, +250 de mana, +4 de regeneração de mana.\nAtivo: Echo Shell — reflete magias direcionadas por 6 segundos.", lore: "“A joia em seu centro ainda reflete a pálida imagem de seu criador.”", preco: 4000 },
  { id: 5, nome: "Pedra de Sangue", efeitos: "+500 de vida, +500 de mana, +3 de regeneração de mana, +30% de roubo de vida mágico.\nAtivo: Bloodpact — multiplica o roubo de vida mágico em 2,5× por 6 segundos.", lore: "“A cor rubi brilhante da Bloodstone é inconfundível no campo de batalha, símbolo de vitalidade e espírito infinitos.”", preco: 4900 },
  { id: 6, nome: "Olho de Skadi", efeitos: "+25 em todos os atributos, ataques reduzem velocidade de movimento e ataque, e diminuem cura e regeneração em 40%.", lore: "“Artefato extremamente raro, guardado pelos dragões azuis.”", preco: 5500 },
  { id: 7, nome: "Foice de Vyse", efeitos: "+30 de inteligência, +8,5 de regeneração de mana.\nAtivo: Hex — transforma o inimigo em criatura indefesa por 2,8 segundos.", lore: "“A relíquia mais guardada entre o culto de Vyse, cobiçada por todos os magos.”", preco: 5700 },
  { id: 8, nome: "Núcleo Octarina", efeitos: "+625 de vida, +625 de mana, +6 de regeneração de mana, 25% de redução de tempo de recarga em habilidades e itens.", lore: "“No âmago da feitiçaria estão espectros que apenas os mais dotados percebem.”", preco: 5900 },
  { id: 9, nome: "Rapieira Divina", efeitos: "+350 de dano de ataque.\nCai no chão ao morrer e pode ser pega por qualquer jogador.", lore: "“A lendária lâmina que decide o destino de batalhas — poder absoluto, ao preço da própria vida.”", preco: 6000 }
];

let inventario = [];
let usuarioLogado = null;

// Elementos
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const userDisplay = document.getElementById('user-display');

// Verificar o login ao carregar
window.onload = () => {
  const savedUser = localStorage.getItem('usuario');
  if (savedUser) {
    usuarioLogado = savedUser;
    inventario = JSON.parse(localStorage.getItem('inventario') || '[]');
    mostrarApp();
    atualizar();
  }
};

// Login
function login() {
  const username = document.getElementById('username').value.trim();
  if (username) {
    usuarioLogado = username;
    localStorage.setItem('usuario', username);
    mostrarApp();
    atualizar();
  }
}

function mostrarApp() {
  loginScreen.style.display = 'none';
  mainApp.style.display = 'block';
  userDisplay.textContent = usuarioLogado;
}

// Logout
function logout() {
  usuarioLogado = null;
  localStorage.removeItem('usuario');
  localStorage.removeItem('inventario');
  inventario = [];
  mainApp.style.display = 'none';
  loginScreen.style.display = 'flex';
}

// Funções existentes (adicionar, remover, etc.)
const container = document.getElementById('products-container');
const countEl = document.getElementById('inventory-count');
const itemsEl = document.getElementById('inventory-items');
const totalEl = document.getElementById('inventory-total');
const panel = document.getElementById('inventory-panel');

function renderizarProdutos(filtrados = produtos) {
  if (!container) return;
  container.innerHTML = '';
  filtrados.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h3>${p.nome}</h3>
      <div class="effects">${p.efeitos.replace(/\n/g, '<br>')}</div>
      <div class="lore">${p.lore}</div>
      <div class="price">${p.preco.toLocaleString('pt-BR')} moedas</div>
      <div class="buttons">
        <button class="add-btn" onclick="adicionar(${p.id})">Adicionar</button>
        <button class="remove-btn" onclick="remover(${p.id})">Remover</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function adicionar(id) {
  const p = produtos.find(x => x.id === id);
  const existente = inventario.find(x => x.id === id);
  if (existente) existente.quantidade++;
  else inventario.push({...p, quantidade: 1});
  salvar();
  atualizar();
}

function remover(id) {
  const existente = inventario.find(x => x.id === id);
  if (existente) {
    if (existente.quantidade > 1) existente.quantidade--;
    else inventario = inventario.filter(x => x.id !== id);
    salvar();
    atualizar();
  }
}

function salvar() {
  if (usuarioLogado) {
    localStorage.setItem('inventario', JSON.stringify(inventario));
  }
}

function atualizar() {
  if (!usuarioLogado) return;
  
  const totalItens = inventario.reduce((s, x) => s + x.quantidade, 0);
  const totalMoedas = inventario.reduce((s, x) => s + (x.preco * x.quantidade), 0);
  
  if (countEl) countEl.textContent = totalItens;
  if (totalEl) totalEl.textContent = totalMoedas.toLocaleString('pt-BR');
  
  if (itemsEl) {
    itemsEl.innerHTML = inventario.length ? 
      inventario.map(x => 
        `<li>${x.nome} ×${x.quantidade} – ${(x.preco * x.quantidade).toLocaleString('pt-BR')} moedas</li>`
      ).join('') : 
      '<li>Inventário vazio</li>';
  }
  
  renderizarProdutos();
}

function toggleInventory() {
  if (panel) {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  }
}

function clearInventory() {
  inventario = [];
  salvar();
  atualizar();
  if (panel) panel.style.display = 'none';
}

function filterProducts() {
  const termo = document.getElementById('search')?.value.toLowerCase() || '';
  const filtrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(termo) || 
    p.efeitos.toLowerCase().includes(termo) ||
    p.lore.toLowerCase().includes(termo)
  );
  renderizarProdutos(filtrados);
}

// Simulações de API
function simularCompra() {
  if (!confirm("Simular compra de todos os itens no inventário?")) return;
  alert("✅ Compra realizada com sucesso!\nItens adicionados ao seu herói.");
}

function simularVenda() {
  if (inventario.length === 0) {
    alert("❌ Seu inventário está vazio!");
    return;
  }
  if (!confirm("Vender todos os itens do inventário?")) return;
  
  const total = inventario.reduce((s, x) => s + (x.preco * x.quantidade), 0);
  inventario = [];
  salvar();
  atualizar();
  alert(`✅ Itens vendidos com sucesso!\nVocê recebeu ${total.toLocaleString('pt-BR')} moedas.`);
}

// Fechar inventário ao clicar fora
document.addEventListener('click', e => {
  if (panel && !e.target.closest('.inventory') && !e.target.closest('.inventory-panel')) {
    panel.style.display = 'none';
  }
});// Código JS aqui!
