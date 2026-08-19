class Categoria {
    private id_categoria: number = 0;
    private nome: string;

    constructor(_nome: string) {
        this.nome = _nome;
    }

    // ==================== GETTERS E SETTERS ====================

    public setId(_id_categoria: number): void {
        this.id_categoria = _id_categoria;
    }

    public getId(): number {
        return this.id_categoria;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================

}