# 🔧 Resolução de Problemas - Envio de Emails

## ❌ Erro: "Erro ao enviar pedido de orçamento"

Se estás a receber este erro mesmo depois de configurar `RESEND_API_KEY`, segue estes passos:

---

## 🔍 PASSO 1: Verificar se Functions Está a Funcionar

### Testar Endpoint de Teste

1. Aceder a: `https://gtmoveltest.pages.dev/test`
2. Deverás ver:
   ```json
   {
     "success": true,
     "message": "✅ Cloudflare Pages Functions está a funcionar!"
   }
   ```

**✅ Se funcionar:** As Functions estão OK, o problema é com o Resend.
**❌ Se der 404:** A pasta `functions/` não está no deploy.

---

## 🔍 PASSO 2: Ver Logs em Tempo Real

1. Ir ao [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Workers & Pages** → Selecionar o projeto `gtmoveltest`
3. **Functions** → **Real-time Logs**
4. Testar o formulário novamente
5. **Ver o erro exato** nos logs

Os logs vão mostrar:
- ✅ Se a função foi chamada
- ❌ O erro específico (API Key inválida, erro do Resend, etc.)

---

## 🔍 PASSO 3: Testar API Key do Resend

### Opção A: Via Curl (Linha de Comandos)

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_TUA_API_KEY_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": ["gtmovel@live.com.pt"],
    "subject": "Teste",
    "html": "<p>Email de teste</p>"
  }'
```

**Substituir:** `re_TUA_API_KEY_AQUI` pela API Key real.

**Resposta esperada:**
```json
{
  "id": "abc123...",
  "from": "onboarding@resend.dev",
  "to": ["gtmovel@live.com.pt"],
  "created_at": "2026-01-15T..."
}
```

**Se der erro 401:** API Key está errada ou expirada.

### Opção B: Via Resend Dashboard

1. Ir a [resend.com/emails](https://resend.com/emails)
2. Verificar se há emails enviados recentemente
3. Ver se há erros nos logs

---

## 🔍 PASSO 4: Verificar Estrutura do Deploy

A estrutura no Cloudflare **DEVE** incluir:

```
Deploy/
├── index.html
├── assets/
├── functions/              ← IMPORTANTE!
│   ├── enviar-email.js     ← Esta função
│   └── test.js             ← Função de teste
├── contactos/
├── orcamentos/
└── (outras pastas...)
```

### Como Verificar:

1. No Cloudflare Dashboard, ir ao projeto
2. **Deployments** → Clicar no último deployment
3. Ver lista de ficheiros
4. **Procurar:** `functions/enviar-email.js`

**❌ Se não existir:** A pasta `functions/` não foi incluída no upload.

---

## 🔧 SOLUÇÕES por Tipo de Erro

### Erro 1: "404 - Not Found" em `/enviar-email`

**Causa:** Pasta `functions/` não está no deploy.

**Solução:**
1. Verificar que `functions/enviar-email.js` existe localmente
2. Se usaste Git:
   ```bash
   git add functions/
   git commit -m "Add functions folder"
   git push origin main
   ```
3. Se usaste upload manual:
   - Fazer upload novamente
   - **Certificar que incluis a pasta `functions/`**

---

### Erro 2: "RESEND_API_KEY não configurada"

**Causa:** Variável de ambiente não foi adicionada ou nome está errado.

**Solução:**
1. Ir a **Settings** → **Environment variables**
2. Verificar que existe: `RESEND_API_KEY` (nome exato, case-sensitive)
3. Clicar em **Edit** e verificar valor
4. Se mudaste algo, ir a **Deployments** → **Retry deployment**

---

### Erro 3: "Erro 401 do Resend - Unauthorized"

**Causa:** API Key inválida ou expirada.

**Solução:**
1. Ir a [resend.com/api-keys](https://resend.com/api-keys)
2. Verificar se a API Key ainda existe e está ativa
3. Se necessário, **criar nova API Key**:
   - Clicar em **"Create API Key"**
   - Nome: `GT Movel Production v2`
   - Permission: **Full Access**
   - Copiar a nova chave
4. Atualizar no Cloudflare:
   - Settings → Environment variables
   - Editar `RESEND_API_KEY`
   - Colar nova chave
   - **Save** e **Retry deployment**

---

### Erro 4: "Erro 429 - Too Many Requests"

**Causa:** Atingiste o limite de 3.000 emails/mês do plano gratuito.

**Solução:**
1. Ver dashboard do Resend: [resend.com/overview](https://resend.com/overview)
2. Verificar quota utilizada
3. Opções:
   - Esperar até próximo mês (reset automático)
   - Fazer upgrade para plano pago ($1/1000 emails)

---

### Erro 5: Emails não chegam (sem erro)

**Causa:** Emails podem estar a ir para spam.

**Solução:**
1. **Verificar pasta de spam/lixo** em `gtmovel@live.com.pt`
2. **Verificar domínio no Resend:**
   - Emails de `onboarding@resend.dev` podem ir para spam
   - Recomendo verificar domínio `gtmovel.com` no Resend (ver [CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md))
3. **Adicionar remetente aos contactos:**
   - Adicionar `onboarding@resend.dev` aos contactos do email

---

## 🧪 Teste Completo Passo-a-Passo

### 1. Testar Função de Teste
```
URL: https://gtmoveltest.pages.dev/test
Esperado: JSON com "success": true
```

### 2. Testar Endpoint de Email Diretamente

Usar **Postman**, **Insomnia** ou **curl**:

```bash
curl -X POST https://gtmoveltest.pages.dev/enviar-email \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@example.com",
    "telefone": "912345678",
    "assunto": "Teste",
    "mensagem": "Mensagem de teste",
    "tipo": "contacto"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Email enviado com sucesso!",
  "id": "..."
}
```

### 3. Testar no Browser

1. Abrir DevTools (F12)
2. Ir ao separador **Network**
3. Preencher e enviar formulário
4. Ver requisição POST para `/enviar-email`
5. Ver resposta (status code, JSON)

---

## 📊 Checklist de Verificação

Antes de pedir ajuda, verificar:

- [ ] API Key do Resend foi criada e copiada corretamente
- [ ] Variável `RESEND_API_KEY` existe no Cloudflare (nome exato)
- [ ] Fiz **Retry deployment** depois de adicionar variável
- [ ] Pasta `functions/` existe no deploy (ver Deployments)
- [ ] Endpoint `/test` funciona (retorna JSON)
- [ ] Vi os **Real-time Logs** no Cloudflare
- [ ] Testei API Key diretamente via curl/Postman
- [ ] Verifiquei quota de emails no Resend

---

## 🆘 Ainda Não Funciona?

Se seguiste todos os passos acima e ainda não funciona:

### 1. Exportar Logs

1. Ir a **Functions** → **Real-time Logs**
2. Testar formulário
3. **Copiar erro completo** dos logs
4. Guardar para análise

### 2. Verificar Configuração da Função

Verificar que o ficheiro `functions/enviar-email.js` tem exatamente:

```javascript
export async function onRequestPost(context) {
  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  // ...resto do código
}
```

**Importante:** Usar `context.env.RESEND_API_KEY` (não `process.env`)

### 3. Contactar Suporte

Se nada funciona:

**Cloudflare Support:**
- Dashboard → Help → Chat (canto inferior direito)
- Fornecer: ID do projeto, logs, erro específico

**Resend Support:**
- [resend.com/docs](https://resend.com/docs)
- Email: support@resend.com

---

## ✅ Solução Temporária: Fallback para FormSubmit

Enquanto resolves o Resend, podes usar FormSubmit temporariamente:

Editar `assets/js/contact.js`:

```javascript
// Linha 18
const FORM_METHOD = 'formsubmit'; // Mudar de 'cloudflare' para 'formsubmit'
```

Fazer commit e push. Os formulários funcionarão via FormSubmit (redirecciona para página de confirmação).

---

**Boa sorte com o troubleshooting!** 🔧

Qualquer dúvida, ver os logs do Cloudflare primeiro - eles dizem exatamente qual é o problema.
