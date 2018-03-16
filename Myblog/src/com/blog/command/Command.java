package com.blog.command;


import com.blog.service.Receiver;

public abstract class Command {
    protected Receiver receiver = null;

    public abstract void exectue();

    public String getResponseJson() {
        return receiver.getResponse();
    }
}
