DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS movimentacao CASCADE;

CREATE TABLE IF NOT EXISTS categoria (
id_categoria INTEGER GENERATED ALWAYS AS IDENTITY,
nome_categoria VARCHAR(255) NOT NULL UNIQUE,

CONSTRAINT pk_categoria
	PRIMARY KEY (id_categoria)
);

CREATE TABLE IF NOT EXISTS produto (
id_produto INTEGER GENERATED ALWAYS AS IDENTITY,
codigo_produto INTEGER NOT NULL UNIQUE,
nome_produto VARCHAR(100) NOT NULL,
descricao VARCHAR(255) NOT NULL,
id_categoria INTEGER NOT NULL,
preco_unitario NUMERIC(10, 2) NOT NULL,
quantidade_disponivel INTEGER NOT NULL,
quantidade_minima INTEGER NOT NULL,
status BOOLEAN NOT NULL DEFAULT TRUE,

CONSTRAINT pk_produto
	PRIMARY KEY (id_produto),

CONSTRAINT fk_categoria
	FOREIGN KEY (id_categoria) 
	REFERENCES categoria(id_categoria),

CONSTRAINT ck_quantidade_disponivel
        CHECK (quantidade_disponivel >= 0),

CONSTRAINT ck_quantidade_minima
        CHECK (quantidade_minima > 0),

CONSTRAINT ck_preco
        CHECK (preco_unitario > 0)
);

CREATE TABLE IF NOT EXISTS movimentacao (
id_movimentacao INTEGER GENERATED ALWAYS AS IDENTITY,
id_produto INTEGER NOT NULL,
tipo_movimentacao VARCHAR(50) NOT NULL,
motivo_retirada VARCHAR(50),
quantidade_movimentada INTEGER NOT NULL,
data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
observacao VARCHAR(255),
preco_unitario NUMERIC(10, 2),
valor_total NUMERIC(10, 2) GENERATED ALWAYS AS (preco_unitario * quantidade_movimentada),
movimentacao_vinculada INTEGER,

CONSTRAINT pk_movimentacao
	PRIMARY KEY (id_movimentacao),

CONSTRAINT fk_produto
	FOREIGN KEY (id_produto) 
	REFERENCES produto(id_produto),

CONSTRAINT fk_movimentacao
	FOREIGN KEY (movimentacao_vinculada) 
	REFERENCES movimentacao(id_movimentacao),

CONSTRAINT ck_tipo_movimentacao
	CHECK((tipo_movimentacao IN ('Entrada', 'Retirada', 'Correção'))),

CONSTRAINT ck_motivo_retirada CHECK (
    tipo_movimentacao <> 'Retirada' OR (
        motivo_retirada IS NOT NULL AND 
        motivo_retirada IN ('Uso interno', 'Perda', 'Roubo', 'Produto danificado', 'Correção')
    )
),

CONSTRAINT ck_quantidade_movimentada
        CHECK (quantidade_movimentada > 0),

CONSTRAINT ck_preco_unitario
        CHECK (preco_unitario > 0),

CONSTRAINT ck_movimentacao_vinculada CHECK (
    motivo_retirada <> 'Correção' 
	OR movimentacao_vinculada IS NOT NULL )

);

SELECT preco_unitario * quantidade_disponivel FROM produto;
