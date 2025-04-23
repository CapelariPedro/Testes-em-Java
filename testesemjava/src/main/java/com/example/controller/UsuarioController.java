package com.example.controller;

import com.example.model.Usuario;
import com.example.service.UsuarioService;

public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    
    public Usuario buscarUsuario(Long id) {
        return usuarioService.buscarPorId(id);
    }
    
    public Usuario criarUsuario(Usuario usuario) {
        // Aqui poderíamos ter validações antes de salvar
        return usuarioService.salvar(usuario);
    }
    
    public Usuario atualizarUsuario(Long id, Usuario dadosAtualizados) {
        Usuario usuarioExistente = usuarioService.buscarPorId(id);
        if (usuarioExistente == null) {
            throw new RuntimeException("Usuário não encontrado para atualização");
        }
        
        // Atualiza apenas os campos fornecidos
        if (dadosAtualizados.getNome() != null) {
            usuarioExistente.setNome(dadosAtualizados.getNome());
        }
        if (dadosAtualizados.getEmail() != null) {
            usuarioExistente.setEmail(dadosAtualizados.getEmail());
        }
        
        return usuarioService.salvar(usuarioExistente);
    }
    
    public boolean deletarUsuario(Long id) {
        try {
            usuarioService.deletar(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
