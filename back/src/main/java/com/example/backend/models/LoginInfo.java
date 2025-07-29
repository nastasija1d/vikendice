package com.example.backend.models;

public class LoginInfo {
    private String username;
    private String lozinka;

    public LoginInfo() {}

    public LoginInfo(String username, String lozinka) {
        this.username = username;
        this.lozinka = lozinka;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLozinka() {
        return lozinka;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

}
