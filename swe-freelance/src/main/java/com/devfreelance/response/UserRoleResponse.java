package com.devfreelance.response;

public class UserRoleResponse {
	private Object user;
    private String role;

    public UserRoleResponse(Object user, String role) {
        this.user = user;
        this.role = role;
    }

    public Object getUser() {
        return user;
    }

    public String getRole() {
        return role;
    }
}
