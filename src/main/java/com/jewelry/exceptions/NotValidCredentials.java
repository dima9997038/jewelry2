package com.jewelry.exceptions;

import lombok.Data;

import java.util.Date;
@Data
public class NotValidCredentials {
    private Integer status;
    private String message;
    private Date timeStamp;

    public NotValidCredentials(Integer status, String message) {
        this.status = status;
        this.message = message;
        this.timeStamp = new Date();
    }
}
