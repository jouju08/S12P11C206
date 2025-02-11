package com.ssafy.backend.common;
/*
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 프로젝트 표준 응답상태 코드
 *  update
 *      1.
 * */
public interface ResponseCode {

    // HTTP Status 200
    String SUCCESS = "SU";

    // HTTP Status 400
    String VALIDATION_FAILED = "VF";
    String DUPLICATE_EMAIL = "DE";
    String DUPLICATE_NICKNAME = "DN";
    String DUPLICATE_ID = "DI";
    String DUPLICATE_TEL_NUNBER = "DT";
    String NOT_EXISTED_USER = "NU";
    String NOT_EXISTED_BOARD = "NB";
    String BAD_REQUEST = "BD";
    String NOT_FOUND = "NF";
    String NOT_FOUND_PAGE = "NP";

    // HTTP Status 401
    String SIGN_IN_FAIL = "SF";
    String AUTHROIZATION_FAILED = "AF";

    // HTTP Status 403
    String NO_PERMISSION = "NP";

    // HTTP Status 500
    String DATABASE_ERROR = "DBE";

    String SERVER_ERROR = "SER";

}
