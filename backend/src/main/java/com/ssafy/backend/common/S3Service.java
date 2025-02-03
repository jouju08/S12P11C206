package com.ssafy.backend.common;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

/*
 *  author : park byeongju
 *  date : 2025.01.20
 *  description : AWS S3 파일 IO 서비스
 *  update
 *      1. filePrefix : S3 버킷 URL (https://버킷명.s3.ap-northeast-2.amazonaws.com/)으로 제대로 작동하도록 수정
 * */

@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;
    @Value("${AWS_S3_BUCKET}")
    private String bucketName;

    private String filePrefix;

    @PostConstruct
    public void init() {
        filePrefix = "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/";
    }

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

    public byte[] getFileAsBytes(String fileUrl) {
        String fileKey = fileUrl.replace(filePrefix, "");

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        try (ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int length;
            while ((length = s3Object.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }

            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("파일 다운로드 실패", e);
        }
    }

    public MultipartFile getFileAsMultipartFile(String fileUrl, String contentType) {
        byte[] fileBytes = getFileAsBytes(fileUrl);
        String fileKey = fileUrl.replace(filePrefix, "");
        String fileName = fileKey.substring(fileKey.lastIndexOf("/") + 1);

        return new CustomMultipartFile(fileBytes, fileName, contentType);
    }
}
