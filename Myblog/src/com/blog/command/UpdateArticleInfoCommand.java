package com.blog.command;

import com.blog.service.Receiver;

public class UpdateArticleInfoCommand extends Command {

    public UpdateArticleInfoCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void exectue() {
        receiver.ArticleInfoUpdate();
    }

}

