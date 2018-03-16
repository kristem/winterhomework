package com.blog.command;


import com.blog.service.Receiver;

public class LoginCommand extends Command {

    public LoginCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void exectue() {
        receiver.login();
    }

}
