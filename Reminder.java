package com.vnxgroup.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;

import java.util.Calendar;
import java.util.TimeZone;

/** Nhắc Giờ Kinh Tối lúc 19:35 (giờ Việt Nam) mỗi ngày. */
public class Reminder extends BroadcastReceiver {

    static final String CHANNEL = "gio_kinh_toi";
    static final String ACTION = "com.vnxgroup.app.REMIND";
    static final TimeZone VN = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
    static final String[] MYS = {"Năm Sự Mừng", "Năm Sự Vui", "Năm Sự Thương", "Năm Sự Mừng",
            "Năm Sự Sáng", "Năm Sự Thương", "Năm Sự Vui"};

    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (ACTION.equals(a) && isOn(context)) show(context);
        schedule(context);
    }

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("vnx", Context.MODE_PRIVATE);
    }

    static boolean isOn(Context c) {
        return prefs(c).getBoolean("remind", true);
    }

    static void setOn(Context c, boolean on) {
        prefs(c).edit().putBoolean("remind", on).apply();
        if (on) schedule(c); else cancel(c);
    }

    static PendingIntent alarmIntent(Context c) {
        Intent i = new Intent(c, Reminder.class).setAction(ACTION);
        return PendingIntent.getBroadcast(c, 100, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void schedule(Context c) {
        if (!isOn(c)) return;
        Calendar cal = Calendar.getInstance(VN);
        cal.set(Calendar.HOUR_OF_DAY, 19);
        cal.set(Calendar.MINUTE, 35);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        if (cal.getTimeInMillis() <= System.currentTimeMillis() + 5000) {
            cal.add(Calendar.DAY_OF_YEAR, 1);
        }
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), alarmIntent(c));
        }
    }

    static void cancel(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(alarmIntent(c));
    }

    @SuppressWarnings("deprecation")
    static void show(Context c) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Nhắc Giờ Kinh Tối",
                    NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Nhắc trước giờ kinh Mân Côi 19:45 mỗi tối");
            nm.createNotificationChannel(ch);
        }

        Intent open = new Intent(c, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPi = PendingIntent.getActivity(c, 101, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent yt = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/@vnxgroup/live"))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent ytPi = PendingIntent.getActivity(c, 102, yt,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        int dow = Calendar.getInstance(VN).get(Calendar.DAY_OF_WEEK) - 1; // 0 = Chúa Nhật
        Notification.Builder b = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(c, CHANNEL)
                : new Notification.Builder(c);
        b.setSmallIcon(R.drawable.ic_notify)
                .setColor(0xFFC2185B)
                .setContentTitle("🕯️ Còn 10 phút đến Giờ Kinh Tối")
                .setContentText("Hôm nay " + MYS[dow] + " – mời cả nhà cùng lần chuỗi lúc 19:45")
                .setAutoCancel(true)
                .setContentIntent(openPi)
                .addAction(0, "▶ Tham dự trên YouTube", ytPi);
        if (Build.VERSION.SDK_INT < 26) b.setPriority(Notification.PRIORITY_HIGH);
        nm.notify(1945, b.build());
    }
}
