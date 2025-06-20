package com.ssafy.backend.common.util;

import java.util.Random;

/**
 *  author : park byeongju
 *  date : 2025.02.17
 *  description : 랜덤 닉네임 제공을 위한 유틸
 *  update
 *      1.
 * */

public class ProfileInjector {
    String[] imgs = {
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/a.jpg",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/b.png",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/c.jpg",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/d.jpg",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/e.jpg",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/f.jpg",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/g.png",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/h.png",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/i.png",
            "https://myfairy-c206.s3.ap-northeast-2.amazonaws.com/default-user-profile/j.png"
    };
    private final String img;
    public ProfileInjector(){
        Random rand = new Random();
        this.img = imgs[rand.nextInt(imgs.length)];
    }

    public String getRandImg(){
        return img;
    }
}
