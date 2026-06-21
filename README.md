# 🛒 playVisionSiteVendas

> Projeto de e-commerce desenvolvido com **Next.js 15** e **TypeScript**, com interface moderna baseada em componentes acessíveis, animações suaves e integração com serviços externos para autenticação, pagamentos e inteligência artificial.

## 🚀 Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| Next.js 15 | Framework React com SSR, rotas e build otimizado |
| React 19 | Biblioteca para construção da interface |
| TypeScript | Tipagem estática e maior segurança no código |
| Tailwind CSS + shadcn/ui | Estilização e componentes prontos e acessíveis |
| Radix UI + Lucide | Componentes acessíveis e ícones |
| Firebase | Autenticação e banco de dados em tempo real |
| Genkit + Google GenAI | Inteligência artificial generativa |
| React Hook Form + Zod | Formulários controlados e validação |
| Zustand | Gerenciamento de estado global |
| Recharts | Gráficos e relatórios |
| Framer Motion | Animações e transições da interface |

## 📁 Estrutura do projeto

A estrutura principal é organizada da seguinte forma:

```text
src/
├── app/                # Rotas e páginas do Next.js App Router
│   ├── about/         # Página sobre a loja
│   ├── account/       # Área do usuário
│   ├── cart/          # Carrinho de compras
│   ├── catalog/       # Catálogo de produtos
│   ├── checkout/      # Finalização de compra
│   ├── contact/       # Contato com suporte
│   ├── faq/           # Perguntas frequentes
│   ├── product/       # Detalhes de produto
│   ├── returns/       # Trocas e devoluções
│   ├── shipping/      # Informações de entrega
│   ├── layout.tsx     # Layout raiz
│   ├── page.tsx       # Página inicial
│   └── globals.css    # Estilos globais
├── components/        # Componentes compartilhados
├── lib/               # Funções auxiliares e utilitários
├── services/          # Integrações externas (Firebase, APIs)
├── store/             # Estados globais com Zustand
└── hooks/             # Hooks customizados
```

## ⚠️ Alerta de segurança

> **Importante:** o arquivo `.env` do projeto contém credenciais e já está presente no histórico do repositório.

- Se essas credenciais forem de produção, **rotacione-as imediatamente**.
- Remova o arquivo do histórico com `git rm --cached .env` e adicione ao `.gitignore` antes de versionar novamente.
- Use um gerenciador de segredos para deploy em produção (ex.: variáveis de ambiente da Vercel).

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm
- Git

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/ConeBill/playVisionSiteVendas.git

# 2. Acesse a pasta do projeto
cd playVisionSiteVendas

# 3. Instale as dependências
npm install

# 4. (Opcional) Crie um arquivo .env com suas variáveis
cp .env.example .env

# 5. Rode o servidor de desenvolvimento
npm run dev
```

O site ficará disponível em `http://localhost:3000`.

## 📜 Scripts disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Desenvolvimento | `npm run dev` | Inicia o servidor Next.js em modo dev |
| Build | `npm run build` | Gera a versão otimizada para produção |
| Start | `npm run start` | Inicia o servidor em produção |
| Lint | `npm run lint` | Verifica regras de código |
| Typecheck | `npm run typecheck` | Verifica erros de tipo TypeScript |

## 🚀 Deploy na Vercel

Esse projeto está preparado para ser hospedado na Vercel.

### Passo a passo

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub.
2. Clique em **Add New Project**.
3. Selecione o repositório `playVisionSiteVendas`.
4. Na etapa **Build and Output Settings**:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (padrão Next.js)
5. Adicione as variáveis de ambiente necessárias na seção **Environment Variables**.
6. Clique em **Deploy**.

> ⚠️ A Vercel já define `NODE_ENV=production` automaticamente durante o build. Não é necessário prefixar o comando de build com essa variável no `package.json`.

## 🔧 Correção recomendada para build cross-platform

Atualmente, o `package.json` define o build como:

```json
"build": "NODE_ENV=production next build"
```

Essa sintaxe funciona apenas em shells Linux/macOS e causa erro no Windows. Para corrigir:

**Opção 1 — Forma mais simples (recomendada):**

```json
"build": "next build"
```

A Vercel e o próprio Next.js já definem `NODE_ENV=production` nas builds de produção.

**Opção 2 — Cross-platform:**

```json
"build": "cross-env NODE_ENV=production next build"
```

Depois instale `cross-env` nas dependências de desenvolvimento:

```bash
npm install --save-dev cross-env
```

## 📌 Observações

- Este projeto usa **Tailwind CSS 3.4** e **PostCSS 8**.
- Os componentes seguem o padrão do **shadcn/ui**, com componentes em `src/components`.
- A estilização global fica em `src/app/globals.css`.
- O Firebase já está configurado como dependência; basta cadastrar as credenciais nas variáveis de ambiente.

## 🤝 Contribuição

Contribuições são bem-vindas! Siga o fluxo:

1. Fork o projeto
2. Crie uma branch: `git checkout -b minha-melhoria`
3. Commit: `git commit -m "feat: minha melhoria"`
4. Push: `git push origin minha-melhoria`
5. Abra um Pull Request
