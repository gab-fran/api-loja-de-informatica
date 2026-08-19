class Produto {
    private id_produto: number = 0;
    private id_categoria: number;
    private codigo: string;
    private nome: string;
    private descricao: string;
    private preco_unitario: number;
    private quantidade_disponivel: number;
    private quantidade_minima: number
    private ativo: boolean;
    private data_cadastro: Date;

    constructor(
        _id_categoria: number,
        _codigo: string, _nome: string,
        _descricao: string,
        _preco_unitario: number,
        _quantidade_disponivel: number, 
        _quantidade_minima: number,
        _ativo: boolean,
        _data_cadastro: Date
    )
        {
        this.id_categoria = _id_categoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao;
        this.preco_unitario = _preco_unitario;
        this.quantidade_disponivel = _quantidade_disponivel;
        this.quantidade_minima = _quantidade_minima;
        this.ativo = _ativo;
        this.data_cadastro = _data_cadastro;
    }

    // ==================== GETTERS E SETTERS ====================

    public getId(): number {
        return this.id_produto;
    }

    public setId(_id_produto: number): void {
        this.id_produto = _id_produto;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }

    public setIdCategoria(_id_categoria: number): void {
        this.id_categoria = _id_categoria;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(_codigo: string): void {
        this.codigo = _codigo;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public setDescricao(_descricao: string): void {
        this.descricao = _descricao;
    }

    public getPrecoUnitario(): number {
        return this.preco_unitario;
    }

    public setPrecoUnitario(_preco_unitario: number): void {
        this.preco_unitario = _preco_unitario;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidade_disponivel;
    }

    public setQuantidadeDisponivel(_quantidade_disponivel: number): void {
        this.quantidade_disponivel = _quantidade_disponivel;
    }

    public getQuantidadeMinima(): number {
        return this.quantidade_minima;
    }

    public setQuantidadeMinima(_quantidade_minima: number): void {
        this.quantidade_minima = _quantidade_minima;
    }

    public isAtivo(): boolean {
        return this.ativo;
    }

    public setAtivo(_ativo: boolean): void {
        this.ativo = _ativo;
    }

    public getDataCadastro(): Date {
        return this.data_cadastro;
    }

    public setDataCadastro(_data_cadastro: Date): void {
        this.data_cadastro = _data_cadastro;
    }
}
