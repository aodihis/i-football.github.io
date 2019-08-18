var webPush = require('web-push');
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cK1zM-6eeik:APA91bHJ88Sjy4XuB9i1iE7bcGt5Q5X7lqeQmPy4FHh_nYLadkB8Xmpi7chC7LXxuoWJNSaZyb4NGo--p0zd8D9y7IxMXsZxoFBx521Q5zJ6jFOz7QQW6BXu-sN2TLFeAHa7ALW71kOW",
    "keys": {
        "p256dh": "BO6gCD8MoDk264XOhvYhHcvnocpLRWFlo3maEeHEV8a4hPexmBzqVhEagJ7/DxwzvQnVCQiZQy02yvzAPmLt3/A=", 
        "auth": "eT64g+vkxsJfKLfUvAY9Hg=="
    }
};
var payload = 'Your Favorite team match will be started in a minute.';
var options = {
    gcmAPIKey: 'AAAAg1tR4tU:APA91bEkWdgJqfh9nLzRk4cEB73kplXdLqEgQnOBYF7py0B53jk_-oi2pCJvG6AMQ4eX9Ixgxww6ydW2lyXSDPT1ydRawsFb23HaDW7ZG8MHY3miGH4GjMBGPQEodexDyeV06bDPnWeU',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);


