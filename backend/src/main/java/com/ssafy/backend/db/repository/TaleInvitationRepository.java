package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.TaleInvitation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaleInvitationRepository extends CrudRepository<TaleInvitation, Long> {
}
