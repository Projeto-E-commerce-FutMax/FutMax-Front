# FutMax - E-commerce de Camisas de Futebol
## Versão Bootstrap CSS + JavaScript Vanilla

Este é o código completo do projeto FutMax convertido para Bootstrap 5 e JavaScript puro (vanilla).

## 📁 Estrutura de Arquivos

```
bootstrap-version/
├── index.html              # Página inicial
├── camisas.html           # Todas as camisas
├── exclusivo.html         # Camisetas raras
├── carrinho.html          # Carrinho de compras
├── checkout.html          # Finalização do pedido
├── login.html             # Login
├── cadastro.html          # Cadastro
├── perfil.html            # Perfil do usuário
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   ├── main.js            # JavaScript principal
│   ├── products.js        # Dados dos produtos
│   ├── cart.js            # Lógica do carrinho
│   └── auth.js            # Autenticação
└── README.md              # Este arquivo
```

## 🚀 Como Usar

### Opção 1: Servidor Local
1. Abra o terminal na pasta `bootstrap-version`
2. Execute um servidor HTTP simples:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (npx http-server)
   npx http-server -p 8000
   ```
3. Acesse http://localhost:8000 no navegador

### Opção 2: Abrir Diretamente
Basta abrir o arquivo `index.html` diretamente no navegador (duplo clique).

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilos personalizados
- **Bootstrap 5.3.2** - Framework CSS
- **Bootstrap Icons** - Ícones
- **JavaScript Vanilla** - Toda a lógica (sem frameworks)
- **LocalStorage** - Persistência de dados (carrinho, usuário, modo escuro)

## ⚡ Funcionalidades

### ✅ Implementadas
- ✓ Navegação entre páginas
- ✓ Catálogo de produtos
- ✓ Carrinho de compras (adicionar, remover, atualizar quantidade)
- ✓ Notificações toast
- ✓ Cálculo automático de subtotal e frete
- ✓ Modo escuro persistente
- ✓ Sistema de autenticação (simulado)
- ✓ Página de checkout completa
- ✓ Página de perfil do usuário
- ✓ Camisetas raras com design premium
- ✓ Responsivo para mobile, tablet e desktop
- ✓ Header e Footer reutilizáveis
- ✓ Persistência do carrinho no localStorage

### 🎯 Como Funciona

#### Carrinho de Compras
- Os produtos são armazenados no `localStorage`
- Ao adicionar um produto, o contador no ícone do carrinho é atualizado
- O total é calculado automaticamente (subtotal + frete de R$ 20,00)

#### Modo Escuro
- Alterna entre modo claro e escuro
- A preferência é salva no `localStorage`
- Todo o site adapta as cores automaticamente

#### Autenticação
- Sistema de login/cadastro simulado
- Dados do usuário salvos no `localStorage`
- Redirecionamento automático ao fazer login

## 🎨 Paleta de Cores

### Modo Claro
- **Primary:** #FF6B35 (Laranja vibrante)
- **Background:** #FAFAFA (Branco acinzentado)
- **Cards:** #FFFFFF (Branco)
- **Borders:** #E5E7EB (Cinza claro)

### Modo Escuro
- **Primary:** #ff7043 (Laranja ajustado)
- **Background:** #0f0f0f (Preto)
- **Cards:** #1a1a1a (Cinza muito escuro)
- **Borders:** #2a2a2a (Cinza escuro)

## 📝 Dados

### Produtos Normais
12 camisas de seleções e clubes com preços entre R$ 159,90 e R$ 239,90

### Produtos Raros
6 camisetas históricas (1970-1990) com:
- Preços de colecionador (R$ 1.399,90 a R$ 2.299,90)
- Informações de conservação
- Certificado de autenticidade
- Eventos históricos

## 🔧 Personalização

### Cores
Edite o arquivo `css/style.css` nas variáveis CSS:
```css
:root {
    --primary-color: #FF6B35;
    --primary-hover: #e55a2b;
    /* ... */
}
```

### Produtos
Edite o arquivo `js/products.js`:
```javascript
const products = [
    {
        id: 1,
        name: "Camisa Brasil",
        // ...
    }
];
```

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 991px
- **Desktop:** ≥ 992px

## 🌐 Navegação

### Páginas Principais
- **/** - Home com banner promocional e produtos em destaque
- **/camisas.html** - Catálogo completo de camisas
- **/exclusivo.html** - Camisetas raras de colecionador
- **/carrinho.html** - Carrinho de compras
- **/checkout.html** - Finalização do pedido
- **/perfil.html** - Perfil do usuário
- **/login.html** - Login
- **/cadastro.html** - Cadastro

## 💾 LocalStorage

O projeto usa localStorage para:
1. **cart** - Itens do carrinho
2. **user** - Dados do usuário logado
3. **darkMode** - Preferência de modo escuro

## 🎯 Próximos Passos (Opcional)

Para adicionar backend real:
1. Integrar com API REST (Node.js, PHP, etc.)
2. Conectar com banco de dados (MySQL, PostgreSQL, MongoDB)
3. Implementar autenticação JWT
4. Adicionar gateway de pagamento (Stripe, PagSeguro, Mercado Pago)
5. Sistema de envio de emails
6. Painel administrativo

## 📄 Licença

Este é um projeto de demonstração. Use como quiser!

## 👨‍💻 Desenvolvedor

Desenvolvido como conversão do projeto React + Tailwind para Bootstrap + JavaScript Vanilla.

---

**Divirta-se explorando o código! ⚽🎉**
