package com.ssafy.backend.common;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

/*
 *  author : park byeongju
 *  date : 2025.01.20
 *  description : AWS S3 파일 IO 서비스
 *  update
 *      1.
 * */

@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;
    private final String filePrefix = "https://${aws.s3.bucket}.s3.ap-northeast-2.amazonaws.com/";
    @Value("${aws.s3.bucket}")
    private String bucketName;

    /*
    * 파일 업로드 전략
    * UUID + 시간값 + .확장자
    * */

    // S3 파일 업로드
    public String uploadFile(MultipartFile file) {
        String filenameExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();

        // UUID + 시간값 + .확장자
        String fileName = uuid + System.currentTimeMillis() + "." +filenameExtension;
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectResponse response = s3Client.putObject(putObjectRequest,
                    software.amazon.awssdk.core.sync.RequestBody.fromInputStream(inputStream, file.getSize()));

            if (response.sdkHttpResponse().isSuccessful()) {
                return filePrefix+fileName;
            } else {
                throw new RuntimeException("파일 업로드 실패");
            }
        } catch (IOException e) {
            throw new RuntimeException("파일 IO 에러");
        }
    }

    // S3 파일 삭제
    public void deleteFile(String fileUrl) {
        // S3에서의 파일 경로 추출 (filePrefix 이후의 경로만 사용)
        String fileKey = fileUrl.split("/")[3];

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();
        try{
            s3Client.deleteObject(deleteObjectRequest);
        } catch (AwsServiceException e) {
            System.err.println("파일 삭제 실패");
            throw new RuntimeException("파일 삭제 실패");
        }
    }

    /*
     * 파일 업데이트 메서드
     * 기존 파일을 삭제하고 새로운 파일을 업로드
     */
    public String updateFile(String existingFileUrl, MultipartFile newFile) throws IOException {
        // 기존 파일 삭제
        deleteFile(existingFileUrl);

        // 새 파일 업로드
        return uploadFile(newFile);
    }
}
