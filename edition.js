(() => {
    const editions = {
        spring: {
            name: '春日篇',
            line: '陪你走过寒冬，也陪你拥抱春风',
            caption: '春日限定',
            alt: '穿浅色裙子的女孩站在花田前的木框里',
            largeWidth: 1280,
        },
        summer: {
            name: '夏日篇',
            line: '把山间的风，也收进我们的夏天',
            caption: '见山',
            alt: '女孩站在湘西的观景台上，背后是群山',
            largeWidth: 1279,
        },
        autumn: {
            name: '秋日篇',
            line: '风起的时候，想起和你一起走过的路',
            caption: '红衣苗服女孩',
            alt: '女孩穿着红色苗服，站在灯火映照的古城街景前',
            largeWidth: 1280,
        },
        winter: {
            name: '冬日篇',
            line: '雪落得很轻，和你走过的那一刻很暖',
            caption: '郑大的雪',
            alt: '女孩站在郑州大学覆雪的林间小路旁',
            largeWidth: 1024,
        },
    };
    const storageKey = 'memory-edition-season';
    const seasonalMonths = [
        'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
        'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter',
    ];
    const beijingMonth = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        month: 'numeric',
    });
    const root = document.documentElement;
    let choice = 'auto';

    try {
        const savedChoice = localStorage.getItem(storageKey);
        if (Object.hasOwn(editions, savedChoice)) choice = savedChoice;
    } catch {
        // The chooser still works in this page when browser storage is unavailable.
    }

    function applyTheme() {
        const season = choice === 'auto'
            ? seasonalMonths[Number(beijingMonth.format(new Date())) - 1]
            : choice;
        root.dataset.season = season;
        return season;
    }

    applyTheme();

    function setupEditions() {
        const chooser = document.getElementById('season-choice');
        const name = document.getElementById('season-name');
        const line = document.getElementById('season-line');
        const photo = document.getElementById('edition-photo');
        const credit = document.getElementById('edition-credit');
        let displayedSeason;

        function renderEdition() {
            const season = applyTheme();
            if (season === displayedSeason) return;
            displayedSeason = season;

            const edition = editions[season];
            const smallPhoto = `images/editions/${season}-640.webp`;
            const largePhoto = `images/editions/${season}-1280.webp`;
            name.textContent = edition.name;
            line.textContent = edition.line;
            credit.textContent = edition.caption;
            photo.alt = edition.alt;
            photo.sizes = season === 'autumn'
                ? '(max-width: 760px) calc(146vw - 80px), (max-width: 1296px) 68vw, 910px'
                : '(max-width: 760px) calc(100vw - 48px), (max-width: 1296px) 48vw, 624px';
            photo.srcset = `${smallPhoto} 640w, ${largePhoto} ${edition.largeWidth}w`;
            photo.src = smallPhoto;
        }

        chooser.value = choice;
        chooser.addEventListener('change', () => {
            choice = chooser.value;
            try {
                localStorage.setItem(storageKey, choice);
            } catch {
                // Keep the current choice for this page even if it cannot be persisted.
            }
            renderEdition();
        });
        window.addEventListener('pageshow', renderEdition);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) renderEdition();
        });
        renderEdition();
    }

    function setupPlayer() {
        const playlist = [
            { title: 'Perfect', file: 'music/perfect.mp3' },
            { title: '吹梦到西洲', file: 'music/chuimeng.mp3' },
            { title: '美', file: 'music/mei.mp3' },
        ];
        const audio = document.getElementById('background-music');
        const toggle = document.getElementById('music-toggle');
        const next = document.getElementById('music-next');
        const track = document.getElementById('music-track');
        const message = document.getElementById('music-message');
        let selectedTrack = 0;
        let loadedTrack = -1;
        let playRequest = 0;

        function syncPlayer() {
            const playing = !audio.paused && !audio.ended;
            toggle.setAttribute('aria-pressed', String(playing));
            toggle.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
        }

        function showError() {
            audio.pause();
            syncPlayer();
            message.textContent = '这首歌暂时无法播放，可以重试或切换下一首。';
        }

        function playSelectedTrack() {
            const request = ++playRequest;
            message.textContent = '';
            if (loadedTrack !== selectedTrack) {
                audio.src = playlist[selectedTrack].file;
                loadedTrack = selectedTrack;
            }
            audio.play().catch((error) => {
                if (request === playRequest && error.name !== 'AbortError') showError();
            });
        }

        function advanceTrack(shouldPlay) {
            playRequest++;
            selectedTrack = (selectedTrack + 1) % playlist.length;
            loadedTrack = -1;
            track.textContent = playlist[selectedTrack].title;
            message.textContent = '';
            if (shouldPlay) playSelectedTrack();
        }

        toggle.addEventListener('click', () => {
            if (audio.paused || audio.ended) {
                playSelectedTrack();
            } else {
                playRequest++;
                audio.pause();
            }
        });
        next.addEventListener('click', () => advanceTrack(!audio.paused && !audio.ended));
        audio.addEventListener('ended', () => advanceTrack(true));
        audio.addEventListener('play', syncPlayer);
        audio.addEventListener('pause', syncPlayer);
        audio.addEventListener('error', () => {
            if (loadedTrack !== selectedTrack) return;
            loadedTrack = -1;
            showError();
        });
        track.textContent = playlist[selectedTrack].title;
        syncPlayer();
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupEditions();
        setupPlayer();
    });
})();
