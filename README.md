<p align="center">
  <img src="./docs/imgs/icon_app.png" width="200" />
</p>
  <p align="center">Projeto de portfólio para o envio de mensagens</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descrição

Esta é uma API desenvolvida como parte do meu portfolio. O objetivo principal é permitir o envio de mensagens de texto e imagens por meio de uma interface de programação de aplicativos (API).

## Endpoints
- [**v1/users/code** *(post)*:](./docs/user-send-code.md "**v1/users/code** *(post)*:") Realiza o envio do código de validação para o usuário
- [**v1/users/valid** *(get)*:](./docs/user-valid-code.md "**v1/users/valid** *(get)*:") Realiza a verificação do código de validação para realizar a liberação do acesso.
- [**v1/handshake** *(post)*:](./docs/handshake.md "**v1/handshake** *(post)*:") Recebe a chave de decriptografia dos dados enviado via body

## Tecnologias utilizadas

A API foi desenvolvida usando as seguintes tecnologias:
-  Nest.js:  Utilizado para criar as rotas da API;
- MongoDB: Utilizado para armazenar as informações do usuário;
- JSON Web Tokens (JWT): Utilizado para autenticar os usuários e proteger as rotas da API.

## Autor

- Author - [Raphael Maracaipe](https://www.linkedin.com/in/raphaelmaracaipe)
