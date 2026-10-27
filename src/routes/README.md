# 🚀 KURIO / GreenMint — NFT Marketplace

Aplicação de Marketplace de NFTs desenvolvida para o desafio **`frontend-challenge`**, focada em fidelidade visual, alta performance, acessibilidade e experiência de utilização responsiva.

---

## 🛠️ Stack Tecnológica Obrigatória

| Responsabilidade | Tecnologia |
| :--- | :--- |
| **Interface** | React (com Tailwind CSS v4 e shadcn/ui) |
| **Linguagem** | TypeScript |
| **Roteamento** | TanStack Router |
| **Estado Remoto & Cache** | TanStack Query |
| **Cliente HTTP** | Axios |
| **Mocking de Dados & Rede** | MSW (Mock Service Worker) |
| **Ferramenta de Build** | Vite |

---

## 🎨 Funcionalidades & Destaques de Implementação

- **Fidelidade Visual ao Figma**: Tema escuro (`#140D0A` / `#FF9000`), tipografia monoespaçada e composição de elementos fiéis aos protótipos.
- **Responsividade Total**:
  - **Bottom Navigation Bar** fixa para ecrãs móveis (`< 768px`) com acesso rápido a *Início*, *Favoritos*, *Carrinho* e *Perfil*.
  - Catálogo adaptado em **2 colunas no mobile** e **3 colunas em desktop**.
- **Gestão de Imagens & Dados Mock**:
  - Imagens dos NFTs e avatares de utilizador gerados internamente via **SVG Data URIs**, garantindo carregamento instantâneo offline e sem dependência de ficheiros ou URLs externas quebradas.
- **Fluxo do Carrinho & Checkout**:
  - Aplicação e validação de cupons de desconto (`JUNGLE10` para 10% OFF e `JUNGLE20` para 20% OFF).
  - Gestão de quantidade, cálculo de totais em ETH e envio de pedido idempotente.
- **Rodapé & Newsletter**:
  - Inclui a **Brand Band** com contactos oficiais (`contato@email.com` e `+55 11 4002 8922`), medalhões de segurança, links de navegação e formulário de subscrição interativo.

---

## 🔑 Credenciais Fictícias para Testes

Para testar os fluxos privados e de checkout:

- **E-mail do Utilizador**: `satoshi@greenmint.io`
- **Carteira Principal**: `0x71C...39A2`
- **Senha**: Qualquer palavra-passe fictícia
- **Cupons Promocionais**:
  - `JUNGLE10`: 10% de desconto no total do carrinho
  - `JUNGLE20`: 20% de desconto no total do carrinho

---

## 💻 Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone [https://github.com/minottopaulo/greenmint-marketplace.git](https://github.com/minottopaulo/greenmint-marketplace.git)
cd greenmint-marketplace