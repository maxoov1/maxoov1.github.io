const getStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia();
        return stream;
    } catch (err) {
        console.error("error", err);
    }
};

const createVideo = stream => {
    let video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;

    let videos = document.querySelector('div.videos');
    videos.append(video);

    return video;
};

const form  = document.querySelector('form');
const input = document.querySelector('form > input');

let stream, video;

const allowStreaming = document.querySelector('button.allow');
allowStreaming.addEventListener('click', async () => {
    stream = await getStream();
    video  = createVideo(stream);
});

let peer = new Peer();

peer.on('open', async id => {
    console.log(id);
});

peer.on('call', call => {
    call.answer(stream);

    call.on('stream', userStream => {
        const userVideo = createVideo(userStream);
    });
});

form.addEventListener('submit', async e => {
    e.preventDefault();

    if (input.value == "") {
        return;
    }

    let call = peer.call(input.value, stream);

    call.on('stream', userStream => {
        const userVideo = createVideo(userStream);
    });
});