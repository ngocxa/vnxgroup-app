package com.vnxgroup.app;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;

/** Cầu nối để trang web trong app gọi chức năng của điện thoại. */
public class Bridge {
    private final Context ctx;

    Bridge(Context c) {
        ctx = c.getApplicationContext();
    }

    @JavascriptInterface
    public boolean getReminder() {
        return Reminder.isOn(ctx);
    }

    @JavascriptInterface
    public void setReminder(boolean on) {
        Reminder.setOn(ctx, on);
    }

    @JavascriptInterface
    public void testReminder() {
        Reminder.show(ctx);
    }

    @JavascriptInterface
    public void share(String title, String url) {
        Intent send = new Intent(Intent.ACTION_SEND)
                .setType("text/plain")
                .putExtra(Intent.EXTRA_SUBJECT, title)
                .putExtra(Intent.EXTRA_TEXT, title + "\n" + url);
        Intent chooser = Intent.createChooser(send, "Chia sẻ bài viết");
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        ctx.startActivity(chooser);
    }
}
