package controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.model.Produto;
import com.example.service.ProdutoService;

@ExtendWith(MockitoExtension.class)
public class ProdutoControllerTest {

    @Mock
    private ProdutoService produtoService;

    @InjectMocks
    private ProdutoController produtoController;

    @Test
    void deveLancarExcecao_QuandoPrecoForNegativo() {
        // Arrange
        Produto produtoInvalido = new Produto(1L, "Celular", -100.0);
        
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            produtoController.cadastrarProduto(produtoInvalido);
        });
        
        assertTrue(exception.getMessage().contains("preço negativo"));
        
        // Verificamos que o serviço nunca foi chamado com um produto inválido
        verify(produtoService, never()).salvar(any());
    }
    
    @Test
    void deveAtualizarEstoque_ComQuantidadeValida() {
        // Arrange
        Long produtoId = 1L;
        int novaQuantidade = 50;
        Produto produtoExistente = new Produto(produtoId, "Celular", 1000.0);
        produtoExistente.setQuantidadeEstoque(10);
        
        when(produtoService.buscarPorId(produtoId)).thenReturn(produtoExistente);
        when(produtoService.salvar(any())).thenAnswer(invocation -> invocation.getArgument(0));
        
        // Act
        Produto resultado = produtoController.atualizarEstoque(produtoId, novaQuantidade);
        
        // Assert
        assertEquals(novaQuantidade, resultado.getQuantidadeEstoque());
        verify(produtoService).buscarPorId(produtoId);
        verify(produtoService).salvar(produtoExistente);
    }
}