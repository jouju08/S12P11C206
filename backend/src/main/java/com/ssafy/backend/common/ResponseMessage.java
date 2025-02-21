package com.ssafy.backend.common;
/**
 *  author : park byeongju
 *  date : 2025.01.19
 *  description : 프로젝트 표준 응답상태 메세지
 *  update
 *      1.
 * */
public interface ResponseMessage {

    // HTTP Status 200
    String SUCCESS = "Success.";

    // HTTP Status 400
    String VALIDATION_FAILED = "Validation failed";
    String DUPLICATE_EMAIL = "Duplicate email";
    String DUPLICATE_NICKNAME = "Duplicate nickname";
    String DUPLICATE_ID = "Duplicate ID";
    String DUPLICATE_TEL_NUNBER = "Duplicate tel number";
    String NOT_EXISTED_USER = "This user does not exist.";
    String NOT_EXISTED_BOARD = "This board does not exist.";
    String BAD_REQUEST = "Bad request";
    String NOT_FOUND = "Not found";
    String NOT_FOUND_PAGE = "Not found page";


    // HTTP Status 401
    String SIGN_IN_FAIL = "Login information mismatch";
    String AUTHROIZATION_FAILED = "Authorization failed";

    // HTTP Status 403
    String NO_PERMISSION = "Do not have permission.";

    // HTTP Status 500
    String DATABASE_ERROR = "Database error";

    String SERVER_ERROR = "Server error";

}
