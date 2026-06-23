// 通信が発生したときに動く処理
self.addEventListener('fetch', function(event) {
    // 自分のサイト以外の通信（YouTubeやニコニコ動画など）は、何もせずそのままインターネットから読み込ませる
    const url = new URL(event.request.url);
    if (!url.origin.includes(location.origin)) {
        return; // ここで処理を終了して通信を通す
    }

    // 自分のサイトのファイル（HTMLなど）はそのまま通常通り読み込む
    event.respondWith(
        fetch(event.request)
    );
});
