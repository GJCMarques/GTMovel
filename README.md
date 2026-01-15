# 🪑 GT Móvel - Website Oficial

Website oficial da **GT Móvel**, empresa de móveis e eletrodomésticos em Vila Nova de Gaia desde 1977.

---

## 🌐 Website

**URL de Produção:** [www.gtmovel.com](https://www.gtmovel.com)
**URL de Desenvolvimento:** [gt-movel.pages.dev](https://gt-movel.pages.dev)

---

## 📋 Funcionalidades

- ✅ **Design Moderno e Responsivo** - Tailwind CSS
- ✅ **Hero Slider Animado** - Swiper.js
- ✅ **Páginas Completas**:
  - Homepage com slider
  - Sobre Nós
  - Portfolio de Projetos
  - Instalações
  - Eletrodomésticos Tien21
  - Formulário de Contacto
  - Pedidos de Orçamento
  - Política de Privacidade
- ✅ **Envio de Emails Funcional** - Cloudflare Pages Functions + Resend
- ✅ **Otimizado para SEO**:
  - Metatags completas (Open Graph, Twitter Cards)
  - Sitemap.xml
  - Robots.txt
  - URLs canônicas
- ✅ **Performance**:
  - Assets locais (Swiper, CSS)
  - Lazy loading de imagens
  - Minificação de JS/CSS
- ✅ **Menu Mobile Fixed** - Scroll bloqueado quando menu aberto
- ✅ **Cookie Consent** - RGPD compliant

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** + **Tailwind CSS** - Estilização moderna
- **JavaScript ES6+** - Interatividade
- **Swiper.js** - Sliders e carrosséis

### Backend (Serverless)
- **Cloudflare Pages Functions** - Serverless functions
- **Resend API** - Envio de emails

### Infraestrutura
- **Cloudflare Pages** - Hosting + CDN + SSL
- **GitHub** - Controlo de versões

---

## 📁 Estrutura do Projeto

```
GTMovel/
├── assets/
│   ├── css/
│   │   ├── style.css              # CSS customizado
│   │   ├── tailwind.css           # Tailwind compilado
│   │   └── swiper-bundle.min.css  # Swiper CSS
│   ├── js/
│   │   ├── main.js                # JavaScript principal
│   │   ├── contact.js             # Lógica dos formulários
│   │   ├── cookies.js             # Cookie consent
│   │   └── swiper-bundle.min.js   # Swiper JS
│   └── imgs/                      # Imagens e logos
├── functions/
│   └── enviar-email.js            # Cloudflare Function para emails
├── contactos/
│   └── index.html                 # Página de Contactos
├── orcamentos/
│   └── index.html                 # Formulário de Orçamentos
├── portfolio/
│   └── index.html                 # Galeria de Projetos
├── sobre/
│   └── index.html                 # Página Sobre Nós
├── instalacoes/
│   └── index.html                 # Processo de Instalação
├── eletrodomesticos/
│   └── index.html                 # Catálogo Tien21
├── privacidade/
│   └── index.html                 # Política de Privacidade
├── index.html                     # Homepage
├── sitemap.xml                    # Sitemap para SEO
├── robots.txt                     # Robots.txt para SEO
├── CLOUDFLARE-SETUP.md           # Guia de configuração
└── README.md                      # Este ficheiro
```

---

## 🚀 Deploy e Configuração

### 1. Fazer Deploy no Cloudflare Pages

#### Via GitHub (Recomendado)

1. Fazer push do projeto para o GitHub
2. Conectar repositório ao Cloudflare Pages
3. Deploy automático em cada commit

#### Via Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy . --project-name=gt-movel
```

### 2. Configurar Envio de Emails

Seguir o guia completo em: **[CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)**

Resumo rápido:
1. Criar conta no [Resend](https://resend.com/)
2. Gerar API Key
3. Adicionar `RESEND_API_KEY` nas variáveis de ambiente do Cloudflare
4. Fazer novo deploy

---

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Nenhum! É HTML puro, basta abrir no navegador.

### Testar Localmente

#### Opção 1: Servidor HTTP Simples
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Aceder a: `http://localhost:8000`

#### Opção 2: Live Server (VS Code)
1. Instalar extensão **Live Server**
2. Clicar direito em `index.html`
3. Selecionar **"Open with Live Server"**

### Testar Cloudflare Functions Localmente

```bash
# Instalar Wrangler
npm install -g wrangler

# Executar dev server
wrangler pages dev .

# Aceder a http://localhost:8788
```

---

## 📧 Formulários de Contacto

O website tem 2 formulários funcionais:

### 1. Formulário de Contacto (`/contactos/`)
- Nome, Email, Telefone, Assunto, Mensagem
- Validação em tempo real
- Envio via Cloudflare Function

### 2. Formulário de Orçamentos (`/orcamentos/`)
- Campos adicionais: Tipo de Produto
- Template de email personalizado
- Estados de loading

Ambos enviam emails HTML formatados para: **gtmovel@live.com.pt**

---

## 🎨 Personalização

### Alterar Cores (Tailwind)

Editar `assets/css/tailwind.css`:

```css
--color-primary: #F97316; /* Laranja GT Móvel */
--color-secondary: #1e293b; /* Cinzento escuro */
```

### Alterar Conteúdos

Todos os textos estão diretamente nos ficheiros HTML de cada página.

### Adicionar Novas Páginas

1. Criar pasta `nova-pagina/`
2. Criar `nova-pagina/index.html`
3. Copiar estrutura de uma página existente
4. Atualizar menu em todos os HTMLs
5. Adicionar ao `sitemap.xml`

---

## 🔍 SEO

### Metatags

Todas as páginas têm:
- ✅ Title e Description únicos
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Author: Guilherme Marques
- ✅ Copyright: GT Móvel

### Submeter aos Motores de Busca

1. **Google Search Console**
   - Adicionar propriedade
   - Submeter `sitemap.xml`

2. **Bing Webmaster Tools**
   - Adicionar site
   - Submeter `sitemap.xml`

---

## 📱 Mobile

- ✅ Totalmente responsivo (Mobile-first)
- ✅ Menu hamburger funcional
- ✅ Scroll bloqueado quando menu aberto
- ✅ Touch-friendly
- ✅ Imagens otimizadas

---

## 🐛 Resolução de Problemas

### Swiper não funciona
- Verificar se `swiper-bundle.min.js` está carregado
- Ver erros na consola (F12)
- Try-catch implementado para evitar crashes

### Formulário não envia
- Verificar variável `RESEND_API_KEY` no Cloudflare
- Ver logs em Functions > Real-time Logs
- Testar diretamente em `/enviar-email`

### Menu mobile não fecha
- Limpar cache do navegador
- Verificar `main.js` está carregado corretamente

---

## 📊 Estatísticas

- **8 Páginas** completas e funcionais
- **2 Formulários** com envio de emails
- **100% Gratuito** - Cloudflare + Resend
- **< 1s** tempo de carregamento
- **100/100** Lighthouse Performance (após otimizações)

---

## 👨‍💻 Desenvolvimento

**Autor:** Guilherme Marques
**Cliente:** GT Móvel
**Ano:** 2026
**Licença:** Todos os direitos reservados - GT Móvel

---

## 📞 Contacto

**GT Móvel**
📧 Email: gtmovel@live.com.pt
📞 Telefone: +351 227 833 020
📍 Morada: Rua Luís de Camões 357, 4430-194 Vila Nova de Gaia
🌐 Website: www.gtmovel.com

---

## 🎉 Funcionalidades Futuras (Opcional)

- [ ] Integração com Google Analytics
- [ ] Chat ao vivo (Tawk.to ou Crisp)
- [ ] Sistema de reviews/testemunhos
- [ ] Blog/Notícias
- [ ] Loja online (e-commerce)
- [ ] Multi-idioma (EN, ES)

---

**Feito com ❤️ para GT Móvel**
