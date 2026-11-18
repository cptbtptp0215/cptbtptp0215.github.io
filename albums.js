const albumData = {
    'meet': [
        {src: 'images/album_meet/photo1.jpg', desc: '暖冬壁炉'},
        {src: 'images/album_meet/photo2.jpg', desc: '爱的拼图'},
        {src: 'images/album_meet/photo3.jpg', desc: '洁白牙齿'},
        {src: 'images/album_meet/photo4.jpg', desc: '财神到'},
        {src: 'images/album_meet/photo5.jpg', desc: '26第一顿饭'}
    ],
    'daily': [
        {src: 'images/album_daily/photo2.jpg', desc: '1个月'},
        {src: 'images/album_daily/photo3.jpg', desc: '1个月'},
        {src: 'images/album_daily/photo4.jpg', desc: '1个月'},
        {src: 'images/album_daily/photo5.jpg', desc: '兔兔'},
        {src: 'images/album_daily/photo6.jpg', desc: '鸽鸽'},
        {src: 'images/album_daily/photo7.jpg', desc: '小心动'},
        {src: 'images/album_daily/photo8.jpg', desc: '雪夜'},
        {src: 'images/album_daily/photo9.jpg', desc: '逛街街'},
        {src: 'images/album_daily/photo10.jpg', desc: '跨年夜'},
        {src: 'images/album_daily/photo11.jpg', desc: '郑大的雪'},
        {src: 'images/album_daily/photo12.jpg', desc: '地铁对镜拍'},
        {src: 'images/album_daily/photo13.jpg', desc: '绿茶餐厅'},
        {src: 'images/album_daily/photo14.jpg', desc: '书店甜妹'}
    ],
    'travel': [
        {src: 'images/album_travel/photo1.jpg', desc: '银基动物王国'}
    ],
    'xiangxi': [
        {src: 'images/album_xiangxi/photo1.jpg', desc: '张家界合照1'},
        {src: 'images/album_xiangxi/photo2.jpg', desc: '张家界合照2'},
        {src: 'images/album_xiangxi/photo3.jpg', desc: '光影'},
        {src: 'images/album_xiangxi/photo4.jpg', desc: '吸氧ing'},
        {src: 'images/album_xiangxi/photo5.jpg', desc: '见山'},
        {src: 'images/album_xiangxi/photo6.jpg', desc: '指山'},
        {src: 'images/album_xiangxi/photo7.jpg', desc: 'relax'},
        {src: 'images/album_xiangxi/photo8.jpg', desc: '吸氧ing'},
        {src: 'images/album_xiangxi/photo9.jpg', desc: '吸氧ing'},
        {src: 'images/album_xiangxi/photo10.jpg', desc: '黄石寨1'},
        {src: 'images/album_xiangxi/photo11.jpg', desc: '黄石寨2'},
        {src: 'images/album_xiangxi/photo12.jpg', desc: '黄石寨3'},
        {src: 'images/album_xiangxi/photo13.jpg', desc: '黄石寨4'},
        {src: 'images/album_xiangxi/photo14.jpg', desc: '凤凰美食'},
        {src: 'images/album_xiangxi/photo15.jpg', desc: '荣葵'},
        {src: 'images/album_xiangxi/photo16.jpg', desc: '红衣苗服女孩'},
        {src: 'images/album_xiangxi/photo17.jpg', desc: '苗服男孩'},
        {src: 'images/album_xiangxi/photo18.jpg', desc: '苗服女孩美美哒'},
        {src: 'images/album_xiangxi/photo19.jpg', desc: '蓝衣苗服女孩'}
    ],
    'spring': [
        {src: 'images/album_spring/photo1.jpg', desc: '高铁站的黄玫瑰'},
        {src: 'images/album_spring/photo2.jpg', desc: '99天纪念礼物'},
        {src: 'images/album_spring/photo3.jpg', desc: '100天粉色花海'},
        {src: 'images/album_spring/photo4.jpg', desc: '樱华少女'},
        {src: 'images/album_spring/photo5.jpg', desc: '郑大樱花园'},
        {src: 'images/album_spring/photo6.jpg', desc: '樱花树下的定格'},
        {src: 'images/album_spring/photo7.jpg', desc: '绿博园寻春'},
        {src: 'images/album_spring/photo8.jpg', desc: '仙气的碎花裙'}
    ]
};

const albumDialog = document.getElementById('album-dialog');
const albumDialogTitle = document.getElementById('album-dialog-title');
const albumClose = document.getElementById('album-close');
const albumGrid = document.getElementById('album-grid');
const albumViewer = document.getElementById('album-viewer');
const albumBack = document.getElementById('album-back');
const albumPrev = document.getElementById('album-prev');
const albumNext = document.getElementById('album-next');
const albumPhoto = document.getElementById('album-photo');
const albumCaption = document.getElementById('album-caption');
const albumCount = document.getElementById('album-count');

const unavailablePhoto = document.createElement('p');
unavailablePhoto.className = 'image-unavailable';
unavailablePhoto.textContent = '照片暂时无法显示';
unavailablePhoto.hidden = true;
albumPhoto.after(unavailablePhoto);
albumCount.setAttribute('aria-live', 'polite');
albumCount.setAttribute('aria-atomic', 'true');

let opener;
let photos = [];
let photoIndex = 0;
let activeThumbnail;
let dialogScrollTop = 0;
let gridScrollTop = 0;

function createThumbnail(photo, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'album-thumbnail';
    button.addEventListener('click', () => openPhoto(index, button));

    const media = document.createElement('span');
    media.className = 'album-thumbnail-media';
    const image = document.createElement('img');
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    let triedOriginal = false;
    image.addEventListener('error', () => {
        if (!triedOriginal) {
            triedOriginal = true;
            image.src = photo.src;
            return;
        }

        const unavailable = document.createElement('span');
        unavailable.className = 'image-unavailable';
        unavailable.textContent = '照片暂时无法显示';
        image.replaceWith(unavailable);
    });
    image.src = photo.src.replace(/^images\//, 'images/thumbs/').replace(/\.jpg$/, '.webp');
    media.append(image);

    const caption = document.createElement('span');
    caption.className = 'album-thumbnail-caption';
    caption.textContent = photo.desc;
    button.append(media, caption);
    return button;
}

function openAlbum(button) {
    const key = button.dataset.album;
    if (!Object.hasOwn(albumData, key) || albumDialog.open) return;

    opener = button;
    photos = albumData[key];
    albumDialogTitle.textContent = button.dataset.albumTitle || button.textContent.trim();
    albumGrid.replaceChildren(...photos.map(createThumbnail));
    albumGrid.hidden = false;
    albumViewer.hidden = true;
    albumDialog.showModal();
    albumDialog.scrollTop = 0;
    albumGrid.scrollTop = 0;
    albumClose.focus({ preventScroll: true });
}

function showPhoto(index) {
    photoIndex = index;
    const photo = photos[photoIndex];
    unavailablePhoto.hidden = true;
    albumPhoto.hidden = false;
    albumPhoto.alt = photo.desc;
    albumPhoto.src = photo.src;
    albumCaption.textContent = photo.desc;
    albumCount.textContent = `${photoIndex + 1} / ${photos.length}`;
}

function openPhoto(index, button) {
    activeThumbnail = button;
    dialogScrollTop = albumDialog.scrollTop;
    gridScrollTop = albumGrid.scrollTop;
    albumGrid.hidden = true;
    albumViewer.hidden = false;
    albumDialog.scrollTop = 0;
    albumViewer.scrollTop = 0;
    albumPrev.disabled = photos.length < 2;
    albumNext.disabled = photos.length < 2;
    showPhoto(index);
    albumBack.focus({ preventScroll: true });
}

function changePhoto(offset) {
    if (albumViewer.hidden || photos.length < 2) return;
    showPhoto((photoIndex + offset + photos.length) % photos.length);
}

document.querySelectorAll('button[data-album]').forEach(button => {
    button.addEventListener('click', () => openAlbum(button));
});

albumClose.addEventListener('click', () => albumDialog.close());
albumBack.addEventListener('click', () => {
    albumViewer.hidden = true;
    albumGrid.hidden = false;
    albumDialog.scrollTop = dialogScrollTop;
    albumGrid.scrollTop = gridScrollTop;
    activeThumbnail.focus({ preventScroll: true });
});
albumPrev.addEventListener('click', () => changePhoto(-1));
albumNext.addEventListener('click', () => changePhoto(1));

albumDialog.addEventListener('keydown', event => {
    if (albumViewer.hidden || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
});

albumPhoto.addEventListener('error', () => {
    if (!albumPhoto.hasAttribute('src')) return;
    albumPhoto.hidden = true;
    unavailablePhoto.hidden = false;
});

albumDialog.addEventListener('close', () => {
    if (albumDialog.open) return;

    albumGrid.replaceChildren();
    albumPhoto.removeAttribute('src');
    opener?.focus({ preventScroll: true });
    opener = undefined;
    activeThumbnail = undefined;
    photos = [];
});
