package com.ssafy.backend.tale.service;

import com.ssafy.backend.db.entity.BaseTale;
import com.ssafy.backend.db.repository.BaseTaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BaseTaleService {

    private final BaseTaleRepository baseTaleRepository;

    public List<BaseTale> getList(){
        return baseTaleRepository.findAll();
    }

    public BaseTale getById(long id){
        return baseTaleRepository.findById(id).get();
    }
}
