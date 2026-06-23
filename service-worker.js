const CACHE_NAME = 'pwa-cache-v2'; // バージョンをv2に上げて更新を強制
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時に自分の基本ファイルだけをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // 新しいサービスワーカーをすぐに有効化
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 古いキャッシュ（v1）を削除
          }
        })
      );
    })
  );
});

// 通信の制御
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ⚠️ YouTube、ニコニコ動画、Myinstants などの外部通信はキャッシュせず、インターネットから直接読み込む
  if (!url.origin.includes(location.origin)) {
    return; // 何もしない（そのまま通信を通す）
  }

  // 自分のサイトのファイル（HTMLなど）だけキャッシュ対応する
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
