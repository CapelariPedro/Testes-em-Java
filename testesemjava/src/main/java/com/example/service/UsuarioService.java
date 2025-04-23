package main.java.com.example.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.model.Usuario;
import com.example.repository.UsuarioRepository;

/**
 * Classe de serviço que implementa a lógica de negócio para operações relacionadas a usuários.
 * Esta camada fica entre os Controllers e os Repositories, encapsulando regras de negócio
 * e transformações de dados.
 */
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    /**
     * Construtor que recebe o repositório de usuários como dependência.
     * Isso facilita a implementação de testes unitários por meio de injeção de dependência.
     */
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    /**
     * Busca um usuário pelo seu ID.
     * 
     * @param id O ID do usuário a ser buscado
     * @return O usuário encontrado
     * @throws RuntimeException se o usuário não for encontrado
     */
    public Usuario buscarPorId(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        return usuario.get();
    }
    
    /**
     * Busca todos os usuários cadastrados.
     * 
     * @return Lista de todos os usuários
     */
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }
    
    /**
     * Busca usuários pelo nome ou parte do nome.
     * 
     * @param nome Nome ou parte do nome a ser buscado
     * @return Lista de usuários que correspondem ao critério de busca
     */
    public List<Usuario> buscarPorNome(String nome) {
        return usuarioRepository.findByNomeContaining(nome);
    }
    
    /**
     * Salva um usuário no sistema. Pode ser usado tanto para criar quanto para atualizar.
     * 
     * @param usuario O usuário a ser salvo
     * @return O usuário salvo, possivelmente com um ID atribuído (em caso de criação)
     * @throws IllegalArgumentException se o email já estiver sendo usado por outro usuário
     */
    public Usuario salvar(Usuario usuario) {
        // Validações de negócio
        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        
        if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        
        // Se não for novo usuário, verificar se existe
        if (usuario.getId() != null) {
            // Verifica se o usuário existe
            buscarPorId(usuario.getId());
        } else {
            // Verifica se o email já está em uso
            if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email já está sendo usado");
            }
        }
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Remove um usuário do sistema pelo seu ID.
     * 
     * @param id O ID do usuário a ser removido
     * @throws RuntimeException se o usuário não for encontrado
     */
    public void deletar(Long id) {
        // Verifica se o usuário existe antes de deletar
        buscarPorId(id);
        usuarioRepository.deleteById(id);
    }
    
    /**
     * Atualiza parcialmente um usuário (somente os campos fornecidos).
     * 
     * @param id O ID do usuário a ser atualizado
     * @param camposAtualizados Mapa contendo os campos a serem atualizados
     * @return O usuário após a atualização
     * @throws RuntimeException se o usuário não for encontrado
     */
    public Usuario atualizarParcial(Long id, Map<String, Object> camposAtualizados) {
        Usuario usuario = buscarPorId(id);
        
        if (camposAtualizados.containsKey("nome")) {
            usuario.setNome((String) camposAtualizados.get("nome"));
        }
        
        if (camposAtualizados.containsKey("email")) {
            String novoEmail = (String) camposAtualizados.get("email");
            // Verificar se o novo email já não está em uso por outro usuário
            Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(novoEmail);
            if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(id)) {
                throw new IllegalArgumentException("Email já está sendo usado por outro usuário");
            }
            usuario.setEmail(novoEmail);
        }
        
        return usuarioRepository.save(usuario);
    }
}