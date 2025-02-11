package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.FriendRequest;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    //친구 신청한 사람, 신청 받은 사람 두명의 아이디로 이미 신청했는지 판별하기
    @Query("SELECT fr FROM FriendRequest fr WHERE fr.proposerId= :senderId AND fr.recipientId = :receiverId and fr.response='p'")
    Optional<FriendRequest> findBySenderIdAndReceiverId(@Param("senderId") Long senderId,
                                                        @Param("receiverId") Long receiverId);
    /*And fr.response='P'*/
    //받은 친구 신청 중 대기 상태의 요청만 받아오기
    @Query("select fr From FriendRequest  fr Where fr.recipientId=:receiverMemberId  And fr.response='P'")
    List<FriendRequest> findByReceiverMemberId(@Param("receiverMemberId") Long receiverMemberId);


    /*And fr.response='P'*/
    //보낸 친구 신청 중 대기 상태의 요청만 받아오기
    @Query("select fr From FriendRequest  fr Where fr.proposerId=:proposerId And fr.response='P'")
    List<FriendRequest> findByProposerId(@Param("proposerId") Long proposerId);

}
