package com.example.controller;

import com.example.model.Produto;
import com.example.service.ProdutoService;

public class ProdutoController {
    
    private final ProdutoService produtoService;
    
    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }
    
    public Produto cadastrarProduto(Produto produto) {
        // Validação de regras de negócio
        if (produto.getPreco() <= 0) {
            throw new IllegalArgumentException("Não é possível cadastrar um produto com preço negativo ou zero");
        }
        
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório");
        }
        
        return produtoService.salvar(produto);
    }
    
    public Produto buscarProduto(Long id) {
        Produto produto = produtoService.buscarPorId(id);
        if (produto == null) {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
        return produto;
    }
    
    public Produto atualizarEstoque(Long produtoId, int novaQuantidade) {
        if (novaQuantidade < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser negativa");
        }
        
        Produto produto = buscarProduto(produtoId);
        produto.setQuantidadeEstoque(novaQuantidade);
        
        return produtoService.salvar(produto);
    }
    
    public boolean deletarProduto(Long id) {
        try {
            // Verificar se o produto existe antes de deletar
            buscarProduto(id);
            produtoService.deletar(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}