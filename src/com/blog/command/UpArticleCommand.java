package com.blog.command;

import com.blog.service.Receiver;

public class UpArticleCommand extends Command{
    public UpArticleCommand(Receiver receiver){
        this.receiver = receiver;
    }

    @Override
    public void exectue() {
        receiver.upArticle();
    }
}
