package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.Friend;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends CrudRepository<Friend, Long> {
}
