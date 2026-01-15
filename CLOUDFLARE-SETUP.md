# 📧 Guia de Configuração - Cloudflare Pages + Resend

Este documento explica como configurar o sistema de envio de emails para os formulários de contacto e orçamentos do website GT Móvel usando **Cloudflare Pages Functions** + **Resend**.

---

## 🎯 Visão Geral

O website usa uma função serverless (Cloudflare Pages Function) para processar formulários e enviar emails através do **Resend**. Esta solução é:

- ✅ **100% Gratuita** - Cloudflare Pages Functions + Resend (3.000 emails/mês grátis)
- ✅ **Profissional** - Emails HTML bonitos e sem redirecionamentos
- ✅ **Segura** - API Keys protegidas como variáveis de ambiente
- ✅ **Rápida** - Serverless, sem servidores para gerir

---

## 📋 Pré-requisitos

1. Conta no [Cloudflare](https://dash.cloudflare.com/) (gratuita)
2. Conta no [Resend](https://resend.com/) (gratuita)
3. Domínio configurado no Cloudflare (opcional, mas recomendado)

---

## 🚀 Passo 1: Criar Conta no Resend

### 1.1 Registar no Resend

1. Aceder a [resend.com](https://resend.com/)
2. Clicar em **"Sign Up"**
3. Criar conta com email ou GitHub

### 1.2 Gerar API Key

1. No dashboard do Resend, ir a **"API Keys"**
2. Clicar em **"Create API Key"**
3. Dar um nome (ex: `GT Movel Production`)
4. Selecionar **"Full Access"**
5. Clicar em **"Create"**
6. ⚠️ **COPIAR E GUARDAR A API KEY** - só aparece uma vez!

```
Exemplo de API Key:
re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 1.3 Verificar Domínio (Opcional mas Recomendado)

Para enviar emails de `noreply@gtmovel.com` em vez de `onboarding@resend.dev`:

1. No Resend, ir a **"Domains"**
2. Clicar em **"Add Domain"**
3. Inserir `gtmovel.com`
4. Seguir instruções para adicionar registos DNS no Cloudflare:
   - **MX**: `feedback-smtp.us-east-1.amazonses.com`
   - **TXT** (SPF): `v=spf1 include:amazonses.com ~all`
   - **CNAME** (DKIM): Valores fornecidos pelo Resend

5. Aguardar verificação (pode demorar até 24h)

**Nota:** Mesmo sem domínio verificado, os emails funcionam (vêm de `onboarding@resend.dev`)

---

## 🔧 Passo 2: Publicar no Cloudflare Pages

### 2.1 Fazer Deploy do Projeto

#### ⭐ Opção A: Via GitHub (RECOMENDADO)

Esta é a forma mais fácil e permite deploys automáticos:

1. Fazer push do código para o GitHub:
   ```bash
   git add .
   git commit -m "Initial commit - GT Móvel website"
   git push origin main
   ```

2. Ir a [dash.cloudflare.com](https://dash.cloudflare.com/)
3. Clicar em **"Workers & Pages"**
4. Clicar em **"Create Application"** > **"Pages"** > **"Connect to Git"**
5. Autorizar acesso ao GitHub
6. Selecionar o repositório `GTMovel`
7. Configurar:
   - **Project name**: `gt-movel` (ou outro nome)
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: (deixar vazio)
   - **Build output directory**: `/` (raiz do projeto)
8. Clicar em **"Save and Deploy"**

✅ Cada novo commit no GitHub fará deploy automático!

---

#### Opção B: Via Wrangler CLI (Linha de Comandos)

Para quem prefere usar a linha de comandos:

```bash
# 1. Instalar Wrangler globalmente
npm install -g wrangler

# 2. Fazer login no Cloudflare
wrangler login

# 3. Deploy do projeto (CORRETO para Pages)
wrangler pages deploy . --project-name=gt-movel

# OU deploy com nome específico
wrangler pages deploy . --project-name=gt-movel --branch=main
```

**⚠️ IMPORTANTE:** Use `wrangler pages deploy` e NÃO `wrangler deploy` (que é para Workers, não Pages)

---

#### Opção C: Via Dashboard - Upload Direto (Sem Git)

Se não quiseres usar Git:

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Clicar em **"Workers & Pages"**
3. Clicar em **"Create Application"** > **"Pages"** > **"Upload assets"**
4. **Dar nome ao projeto**: `gt-movel`
5. **Arrastar toda a pasta do projeto** (incluindo `functions/`)
6. Clicar em **"Deploy site"**

⚠️ **Nota:** Com esta opção, cada atualização precisa de ser feita manualmente. Recomendo usar Git (Opção A).

---

### 2.2 Aguardar Deploy

O Cloudflare vai fazer o deploy automático. Quando terminar, terás um URL como:

```
https://gt-movel.pages.dev
```

✅ O site está online! As Pages Functions também estarão disponíveis em `/enviar-email`

---

## 🔐 Passo 3: Configurar Variável de Ambiente

### 3.1 Adicionar API Key do Resend

1. No dashboard Cloudflare, ir a **"Workers & Pages"**
2. Selecionar o projeto `gt-movel`
3. Ir ao separador **"Settings"**
4. Clicar em **"Environment variables"**
5. Na secção **"Production"**, clicar em **"Add variable"**
6. Configurar:
   - **Variable name**: `RESEND_API_KEY`
   - **Value**: (colar a API Key copiada do Resend)
   - **Type**: `Secret` (recomendado) ou `Text`
7. Clicar em **"Save"**

### 3.2 Fazer Novo Deploy

Após adicionar a variável, é necessário fazer um novo deploy:

1. Ir ao separador **"Deployments"**
2. Clicar nos **"..."** do último deployment
3. Clicar em **"Retry deployment"**

Ou simplesmente fazer um novo commit no Git (se estiver ligado).

---

## ✅ Passo 4: Testar o Sistema

### 4.1 Testar Formulário de Contacto

1. Aceder a `https://seu-dominio.pages.dev/contactos/`
2. Preencher o formulário
3. Clicar em **"Enviar Mensagem"**
4. Verificar se aparece a mensagem de sucesso
5. Verificar se o email chegou a `gtmovel@live.com.pt`

### 4.2 Testar Formulário de Orçamentos

1. Aceder a `https://seu-dominio.pages.dev/orcamentos/`
2. Preencher o formulário
3. Clicar em **"Pedir Orçamento"**
4. Verificar se aparece a mensagem de sucesso
5. Verificar se o email chegou a `gtmovel@live.com.pt`

### 4.3 Verificar Logs (Se houver erros)

1. No Cloudflare Dashboard, ir ao projeto
2. Clicar em **"Functions"** > **"Real-time Logs"**
3. Ver erros em tempo real

---

## 🔄 Passo 5: Configurar Domínio Personalizado (Opcional)

### 5.1 Adicionar Domínio ao Cloudflare Pages

1. No projeto Cloudflare Pages, ir a **"Custom domains"**
2. Clicar em **"Set up a custom domain"**
3. Inserir `www.gtmovel.com`
4. Clicar em **"Continue"**
5. O Cloudflare configura automaticamente os registos DNS

### 5.2 Atualizar Email "From" no Resend

Se verificaste o domínio no Resend, atualizar o ficheiro `functions/enviar-email.js`:

```javascript
// Linha ~280
from: 'GT Móvel <noreply@gtmovel.com>', // ✅ Email personalizado
// em vez de
from: 'GT Móvel Website <onboarding@resend.dev>', // ❌ Email genérico
```

Fazer commit e push para o Git, ou fazer novo deploy.

---

## 🎨 Personalizar Emails

### Alterar Email de Destino

Editar `functions/enviar-email.js` linha ~282:

```javascript
to: ['gtmovel@live.com.pt'], // Alterar para o teu email
```

### Alterar Template HTML

Os templates HTML estão em `functions/enviar-email.js`:
- **Orçamentos**: linha ~78
- **Contactos**: linha ~190

Podes personalizar cores, logo, texto, etc.

---

## 🐛 Resolução de Problemas

### Erro: "RESEND_API_KEY não configurada"

**Causa:** Variável de ambiente não foi adicionada ou deploy não foi feito.

**Solução:**
1. Verificar se a variável existe em Settings > Environment variables
2. Fazer novo deploy (Retry deployment)

### Erro: "Email inválido"

**Causa:** Email fornecido no formulário não é válido.

**Solução:** Validação automática, mostrar mensagem clara ao utilizador.

### Erro 500: "Erro ao enviar email"

**Causa:** API Key do Resend inválida ou expirada.

**Solução:**
1. Verificar API Key no Resend
2. Gerar nova API Key
3. Atualizar variável de ambiente no Cloudflare
4. Fazer novo deploy

### Emails não chegam

**Possíveis causas:**
1. **Spam/Lixo** - Verificar pasta de spam
2. **Domínio não verificado** - Emails de `onboarding@resend.dev` podem ir para spam
3. **Limite atingido** - Resend tem limite de 3.000 emails/mês no plano gratuito

**Solução:** Verificar domínio no Resend para melhorar deliverability.

---

## 📊 Limites e Custos

### Cloudflare Pages Functions
- ✅ **100.000 requisições/dia** - Grátis
- ✅ **Ilimitado** tráfego/bandwidth
- ✅ **Sem limites** de projetos

### Resend
- ✅ **3.000 emails/mês** - Grátis
- ✅ **1 domínio verificado** - Grátis
- ⚠️ Acima de 3.000: $1/1.000 emails

---

## 📞 Suporte

Para questões sobre:
- **Cloudflare**: [Cloudflare Support](https://support.cloudflare.com/)
- **Resend**: [Resend Docs](https://resend.com/docs)
- **Código**: Contactar o desenvolvedor

---

## ✨ Resumo Rápido

1. ✅ Criar conta no Resend → Gerar API Key
2. ✅ Fazer deploy no Cloudflare Pages
3. ✅ Adicionar `RESEND_API_KEY` nas variáveis de ambiente
4. ✅ Fazer novo deploy
5. ✅ Testar formulários
6. 🎉 **Pronto!**

---

**Desenvolvido para GT Móvel**
_© 2026 - Todos os direitos reservados_
