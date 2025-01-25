package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Friend;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends CrudRepository<Friend, Long> {
    //친구 찾기
    @Query("SELECT f.memberToId FROM Friend f WHERE f.memberToId=:id")
    List<Long> findFriendById(Long id);


}
