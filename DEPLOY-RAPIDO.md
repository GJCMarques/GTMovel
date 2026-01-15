# 🚀 Deploy Rápido - Cloudflare Pages

## ⚠️ ERRO: "Missing entry-point to Worker script"

Se recebeste este erro, é porque o Cloudflare tentou fazer deploy como **Worker** em vez de **Pages**.

---

## ✅ SOLUÇÃO: Como Fazer Deploy Corretamente

### **Método 1: Via GitHub (RECOMENDADO)** ⭐

Este é o método mais fácil e profissional:

#### Passo 1: Fazer Push para o GitHub

```bash
# Na pasta do projeto, inicializar Git (se ainda não tiver)
git init
git add .
git commit -m "Initial commit - GT Móvel website"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU-USERNAME/GTMovel.git
git branch -M main
git push -u origin main
```

#### Passo 2: Conectar ao Cloudflare

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com/)
2. **Workers & Pages** → **Create Application**
3. Selecionar **"Pages"** → **"Connect to Git"**
4. Escolher **GitHub** e autorizar
5. Selecionar o repositório **GTMovel**
6. Configurar:
   - **Framework preset**: `None`
   - **Build command**: (deixar vazio)
   - **Build output directory**: `/`
7. **Save and Deploy**

✅ **Pronto!** Cada commit no GitHub fará deploy automático.

---

### **Método 2: Via Wrangler CLI (Comando Correto)**

Se preferires usar linha de comandos:

```bash
# Certifica-te que tens Wrangler instalado
npm install -g wrangler

# Login (se ainda não fizeste)
wrangler login

# Deploy CORRETO para Pages (não Workers!)
wrangler pages deploy . --project-name=gt-movel
```

⚠️ **IMPORTANTE:** O comando correto é `wrangler pages deploy` e **NÃO** `wrangler deploy`

---

### **Método 3: Upload Manual via Dashboard**

Se não quiseres usar Git:

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com/)
2. **Workers & Pages** → **Create Application**
3. Selecionar **"Pages"** → **"Upload assets"**
4. Dar nome: `gt-movel`
5. **Arrastar toda a pasta** do projeto para a zona de upload
   - ⚠️ Certifica-te que incluíste a pasta `functions/`
6. Clicar em **"Deploy site"**

**Nota:** Se deres erro ao arrastar, tenta:
- Comprimir a pasta num `.zip` primeiro
- Ou arrastar o conteúdo (não a pasta em si)

---

## 🔧 Ficheiros de Configuração Criados

Adicionei 2 ficheiros que ajudam o Cloudflare:

### 1. `wrangler.toml`
```toml
name = "gt-movel"
compatibility_date = "2026-01-15"
pages_build_output_dir = "."

[assets]
directory = "."
```

### 2. `_headers`
Define headers de segurança e cache para o site.

---

## 📦 Estrutura que o Cloudflare Espera

```
GTMovel/
├── index.html              ← Homepage
├── assets/                 ← CSS, JS, imagens
├── functions/              ← Serverless functions
│   └── enviar-email.js     ← Função de envio de emails
├── contactos/
├── orcamentos/
├── portfolio/
├── sobre/
├── instalacoes/
├── eletrodomesticos/
├── privacidade/
├── wrangler.toml          ← Config Cloudflare
├── sitemap.xml
└── robots.txt
```

---

## ✅ Verificar se Deploy Funcionou

Após o deploy, testar:

1. **Site está online?**
   - Aceder a `https://gt-movel.pages.dev`

2. **Formulário funciona?**
   - Testar `/contactos/`
   - Verificar consola do browser (F12)
   - Se der erro 404 em `/enviar-email`, a pasta `functions/` pode não ter sido incluída

3. **Ver logs:**
   - Dashboard Cloudflare → Projeto → **Functions** → **Real-time Logs**

---

## 🐛 Erros Comuns

### "Missing entry-point to Worker script"
**Causa:** Usaste `wrangler deploy` em vez de `wrangler pages deploy`

**Solução:** Usar comando correto:
```bash
wrangler pages deploy . --project-name=gt-movel
```

### "Função /enviar-email não encontrada (404)"
**Causa:** Pasta `functions/` não foi incluída no deploy

**Solução:**
- Se usaste Git: verificar que `functions/` está no commit
- Se usaste upload manual: arrastar novamente incluindo `functions/`

### "Build failed" no GitHub
**Causa:** Cloudflare tentou correr build command

**Solução:** Na configuração do projeto:
- **Build command**: (deixar vazio)
- **Build output directory**: `/`

---

## 💡 Recomendação Final

**Use o Método 1 (GitHub)** porque:
- ✅ Deploy automático em cada commit
- ✅ Historial de versões
- ✅ Rollback fácil se algo correr mal
- ✅ Colaboração em equipa
- ✅ Ambiente de preview para cada PR

---

## 📞 Precisa de Ajuda?

Se continuares com problemas:

1. Verificar logs no Cloudflare Dashboard
2. Verificar se `functions/enviar-email.js` existe no deploy
3. Verificar se variável `RESEND_API_KEY` está configurada
4. Contactar suporte Cloudflare (chat ao vivo)

---

**Boa sorte com o deploy!** 🚀
