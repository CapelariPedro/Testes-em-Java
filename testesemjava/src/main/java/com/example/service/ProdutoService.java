package main.java.com.example.service;

import java.util.List;
import java.util.Optional;

import com.example.model.Produto;
import com.example.repository.ProdutoRepository;

/**
 * Classe de serviço responsável por implementar a lógica de negócio
 * relacionada a produtos. Atua como intermediária entre o Controller
 * e o Repository.
 */
public class ProdutoService {
    
    private final ProdutoRepository produtoRepository;
    
    /**
     * Construtor com injeção de dependência do repositório.
     * 
     * @param produtoRepository Repositório de produtos a ser utilizado
     */
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }
    
    /**
     * Busca um produto pelo seu ID.
     * 
     * @param id O ID do produto a ser buscado
     * @return O produto encontrado
     * @throws RuntimeException se o produto não for encontrado
     */
    public Produto buscarPorId(Long id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isEmpty()) {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
        return produto.get();
    }
    
    /**
     * Busca todos os produtos disponíveis.
     * 
     * @return Lista de todos os produtos
     */
    public List<Produto> buscarTodos() {
        return produtoRepository.findAll();
    }
    
    /**
     * Busca produtos por uma faixa de preço.
     * 
     * @param precoMinimo O preço mínimo
     * @param precoMaximo O preço máximo
     * @return Lista de produtos dentro da faixa de preço especificada
     */
    public List<Produto> buscarPorFaixaDePreco(double precoMinimo, double precoMaximo) {
        return produtoRepository.findByPrecoBetween(precoMinimo, precoMaximo);
    }
    
    /**
     * Busca produtos que estão com pouco estoque (abaixo do limiar especificado).
     * 
     * @param limiteMinimoEstoque O limite mínimo de estoque
     * @return Lista de produtos com estoque abaixo do limite
     */
    public List<Produto> buscarProdutosComPoucoEstoque(int limiteMinimoEstoque) {
        return produtoRepository.findByQuantidadeEstoqueLessThan(limiteMinimoEstoque);
    }
    
    /**
     * Salva um produto no sistema. Pode ser usado tanto para criar quanto para atualizar.
     * 
     * @param produto O produto a ser salvo
     * @return O produto salvo, possivelmente com um ID atribuído (em caso de criação)
     * @throws IllegalArgumentException se houver violação nas regras de negócio
     */
    public Produto salvar(Produto produto) {
        // Validações de negócio
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório");
        }
        
        if (produto.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
        
        if (produto.getQuantidadeEstoque() < 0) {
            throw new IllegalArgumentException("Quantidade em estoque não pode ser negativa");
        }
        
        return produtoRepository.save(produto);
    }
    
    /**
     * Remove um produto do sistema pelo seu ID.
     * 
     * @param id O ID do produto a ser removido
     * @throws RuntimeException se o produto não for encontrado
     */
    public void deletar(Long id) {
        // Verifica se o produto existe antes de deletar
        buscarPorId(id);
        produtoRepository.deleteById(id);
    }
    
    /**
     * Atualiza o estoque de um produto.
     * 
     * @param id O ID do produto a ter o estoque atualizado
     * @param quantidadeAdicional A quantidade a ser adicionada ao estoque (pode ser negativa para remoção)
     * @return O produto após a atualização do estoque
     * @throws RuntimeException se o produto não for encontrado
     * @throws IllegalArgumentException se a operação resultar em estoque negativo
     */
    public Produto atualizarEstoque(Long id, int quantidadeAdicional) {
        Produto produto = buscarPorId(id);
        
        int novoEstoque = produto.getQuantidadeEstoque() + quantidadeAdicional;
        if (novoEstoque < 0) {
            throw new IllegalArgumentException("Operação resultaria em estoque negativo. Estoque atual: " + 
                                               produto.getQuantidadeEstoque());
        }
        
        produto.setQuantidadeEstoque(novoEstoque);
        return produtoRepository.save(produto);
    }
    
    /**
     * Atualiza o preço de um produto.
     * 
     * @param id O ID do produto a ter o preço atualizado
     * @param novoPreco O novo preço do produto
     * @return O produto após a atualização do preço
     * @throws RuntimeException se o produto não for encontrado
     * @throws IllegalArgumentException se o novo preço for inválido
     */
    public Produto atualizarPreco(Long id, double novoPreco) {
        if (novoPreco <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
        
        Produto produto = buscarPorId(id);
        produto.setPreco(novoPreco);
        
        return produtoRepository.save(produto);
    }
}
