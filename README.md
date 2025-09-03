<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Simulador de Entrevista

## Visão Geral

O **Simulador de Entrevista** é uma aplicação inteligente projetada para ajudar candidatos a se preparar para entrevistas de emprego. Atuando como um mentor virtual, ele faz perguntas e analisa a compatibilidade entre uma vaga de emprego e o currículo do usuário, oferecendo uma experiência de simulação completa e interativa.

## Projeto
https://github.com/user-attachments/assets/f0f81664-efac-451a-9e99-894c2d5f81fa

## Projeto Interativo no Google AI Studio
https://ai.studio/apps/drive/1vV_sHtovNeTVolc52tzx4rDv6wApoTdN

## Funcionalidades Principais

  * **Simulador Interativo**: Na aba `Simulador`, o usuário pode iniciar uma nova sessão. A aplicação, via integração com IA, faz perguntas relevantes com base nos dados fornecidos pelo usuário, como currículo e descrição da vaga, para uma prática personalizada.
  * **Histórico de Sessões**: A aba `Histórico` permite ao usuário revisar todas as simulações de entrevista que já realizou.
  * **Gerenciamento do Histórico**: O usuário tem controle total sobre seus dados. É possível **excluir** sessões individuais para remover práticas específicas ou **limpar todo o histórico** de uma vez para começar do zero.
  * **Navegação por Abas**: Uma interface intuitiva com botões de abas (`Simulador` e `Histórico`) permite alternar facilmente entre as duas visualizações sem recarregar a página, proporcionando uma experiência de usuário rápida e eficiente.
  * **Design Responsivo e Moderno**: Construído com Tailwind CSS, o layout da aplicação se adapta a diferentes tamanhos de tela (desktop, tablet, celular), garantindo usabilidade em qualquer dispositivo. O design escuro com gradientes torna a interface agradável e moderna.


### ⚙️ Executar Localmente

- **Pré-requisitos**: Node.js

Siga os passos abaixo para instalar e rodar o projeto em sua máquina local.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/MaduAraujo/Simulador-de-Entrevista
    cd Simulador-de-Entrevista
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```
    
3. Defina `GEMINI_API_KEY` em [.env.local](.env.local) para sua chave de API Gemini
   
4.  **Execute o app:**
    ```bash
    npm run dev
    # ou
    yarn dev
