package com.blog.command;

import com.blog.service.Receiver;

public class UpdateUserInfoCommand extends Command {

        public UpdateUserInfoCommand(Receiver receiver) {
            this.receiver = receiver;
        }

        @Override
        public void exectue() {
            receiver.UserInfoUpdate();
        }

}
