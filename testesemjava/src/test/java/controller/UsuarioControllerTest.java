package controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.model.Usuario;
import com.example.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
public class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private Usuario usuarioTeste;

    @BeforeEach
    void setUp() {
        // Preparação de dados para o teste
        usuarioTeste = new Usuario(1L, "João Silva", "joao@exemplo.com");
    }

    @Test
    @DisplayName("Deve encontrar usuário por ID quando o usuário existe")
    void deveEncontrarUsuarioPorId_QuandoUsuarioExiste() {
        // Arrange (Preparação)
        when(usuarioService.buscarPorId(1L)).thenReturn(usuarioTeste);

        // Act (Execução)
        Usuario resultado = usuarioController.buscarUsuario(1L);

        // Assert (Verificação)
        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        assertEquals("joao@exemplo.com", resultado.getEmail());
        
        // Verificar que o método do serviço foi chamado corretamente
        verify(usuarioService).buscarPorId(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção quando buscar usuário que não existe")
    void deveLancarExcecao_QuandoUsuarioNaoExiste() {
        // Arrange
        when(usuarioService.buscarPorId(999L)).thenThrow(new RuntimeException("Usuário não encontrado"));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            usuarioController.buscarUsuario(999L);
        });

        assertEquals("Usuário não encontrado", exception.getMessage());
        verify(usuarioService).buscarPorId(999L);
    }

    @Test
    @DisplayName("Deve criar usuário com sucesso")
    void deveCriarUsuario_ComSucesso() {
        // Arrange
        when(usuarioService.salvar(any(Usuario.class))).thenReturn(usuarioTeste);

        // Act
        Usuario resultado = usuarioController.criarUsuario(usuarioTeste);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(usuarioService).salvar(usuarioTeste);
    }
}