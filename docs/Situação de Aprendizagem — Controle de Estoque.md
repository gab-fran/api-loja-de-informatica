# Situação de Aprendizagem — Controle de Estoque de uma Loja de Informática

## Contextualização

A **InfoTech Informática** é uma pequena loja que comercializa produtos como teclados, mouses, monitores, cabos, fontes, memórias, unidades SSD e outros componentes de informática.

Atualmente, as entradas e retiradas de produtos são anotadas manualmente em uma planilha. Entretanto, nem todas as movimentações são registradas no momento em que acontecem. Como consequência, a quantidade indicada na planilha frequentemente é diferente da quantidade disponível nas prateleiras.

Essa falta de controle já provocou situações nas quais um funcionário confirmou a venda de um produto que não estava mais disponível. Também existem dificuldades para descobrir quais produtos precisam ser repostos e para consultar o histórico de entradas e retiradas.

## Situação-problema

A loja precisa de um sistema para controlar seu estoque. O sistema deverá registrar os produtos e todas as movimentações que alterem suas quantidades.

Cada produto deverá possuir um código único, nome, descrição, categoria, preço de venda, quantidade disponível e quantidade mínima recomendada. Produtos diferentes não poderão utilizar o mesmo código.

Quando a loja receber mercadorias de um fornecedor, o funcionário deverá registrar uma movimentação de entrada, informando o produto, a quantidade recebida e a data. Após a confirmação, a quantidade deverá ser adicionada ao estoque.

As retiradas poderão ocorrer por venda, uso interno, perda ou produto danificado. Antes de confirmar qualquer retirada, o sistema deverá consultar a quantidade disponível e verificar se existe estoque suficiente. Uma retirada somente poderá ser registrada quando a quantidade solicitada for menor ou igual à quantidade disponível.

Caso não exista estoque suficiente, a operação deverá ser impedida e o funcionário deverá ser informado sobre a quantidade disponível. Em nenhuma situação o saldo de um produto poderá ficar negativo.

Quando uma retirada for confirmada, a quantidade deverá ser subtraída automaticamente do estoque. No caso de uma venda, também deverão ser registrados o preço unitário praticado e o valor total do item vendido.

Toda movimentação deverá registrar o tipo da operação, o produto, a quantidade, a data e uma observação que identifique seu motivo. Depois de confirmada, uma movimentação não poderá ser apagada ou alterada diretamente, pois isso comprometeria o histórico do estoque.

Se uma movimentação tiver sido registrada incorretamente, o funcionário deverá realizar uma movimentação de correção, mantendo tanto o registro original quanto a correção no histórico.

O sistema deverá identificar os produtos cuja quantidade disponível seja menor ou igual à quantidade mínima recomendada. Essa informação será utilizada pelos responsáveis para planejar novas compras.

Os funcionários também deverão conseguir consultar a posição atual do estoque e o histórico de movimentações. A consulta do histórico poderá ser filtrada por produto, tipo de movimentação e período.

A empresa deseja conhecer o valor financeiro dos produtos armazenados. Para isso, o sistema deverá apresentar o valor de cada item em estoque, calculado pela multiplicação da quantidade disponível pelo preço unitário, e o valor total de todo o estoque.

Produtos que já possuam movimentações não poderão ser excluídos definitivamente. Quando deixarem de ser comercializados, deverão ser desativados, permanecendo disponíveis no histórico, mas sem permitir novas movimentações.

## Desafio

A equipe deverá analisar a situação-problema e desenvolver uma solução para controlar o estoque da loja de informática.

As necessidades da empresa foram apresentadas em formato de texto. Antes de iniciar o desenvolvimento, a equipe deverá interpretar a situação e extrair:

- as regras que determinam o funcionamento do negócio;
- as funcionalidades que deverão ser oferecidas pelo sistema;
- os dados que precisarão ser armazenados;
- os relacionamentos existentes entre esses dados.

O sistema desenvolvido deverá manter a integridade das informações e, principalmente, garantir que nenhuma retirada seja realizada sem a verificação prévia da quantidade disponível.Entregas do projeto

## Desafio:

Descreva em detalhes o passo a passo técnico e operacional para ir do estágio atual do projeto até a entrega da aplicação em produção e pronta para uso.