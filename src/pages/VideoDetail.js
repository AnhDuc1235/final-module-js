import { renderPlayerBarHTML } from "../components/Player";

const API_BASE_URL = "https://youtube-music.f8team.dev/api";

let player = null;
let timeInterval = null;
let isDragging = false;
let isRepeat = false;
let relatedList = [];
let currentIndex = -1;

function loadYouTubeAPI() {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) return resolve();
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(tag);
    });
}

function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export const VideoDetailPageHTML = () => `
    <div id="video-detail-page" class="p-8 pb-32 text-white flex flex-col md:flex-row gap-8 animate-fade-in relative min-h-screen">
        <div class="w-full md:w-[60%] flex-shrink-0 flex flex-col h-fit">
            <div class="w-full aspect-video bg-black shadow-2xl mb-6 rounded-lg overflow-hidden border border-[#333]">
                <div id="video-embed" class="w-full h-full"></div>
            </div>
            
            <h1 id="video-title" class="text-2xl font-bold mb-2">Loading...</h1>
            <p id="video-desc" class="text-gray-400 text-sm mb-4"></p>
            
            <div class="flex gap-4 text-gray-400 text-sm">
                <span id="video-views"></span>
                <span id="video-likes"></span>
            </div>
        </div>

        <div class="flex-1 min-w-0">
             <p class="text-white mb-4 ml-3.5 text-2xl">Related Videos</p>
             <div>
                 <table class="w-full text-left border-collapse">
                    <tbody id="video-related-tracks"></tbody>
                 </table>
             </div>
        </div>

        ${renderPlayerBarHTML()}
    </div>
`;

export const initVideoDetailLogic = async (id) => {
    //cleanup player cũ
    if (player) {
        try { if (typeof player.destroy === 'function') player.destroy(); } catch (e) {}
        player = null;
    }
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
    }
    window.scrollTo(0, 0);

    //Sửa lỗi Back: Lắng nghe khi người dùng bấm Back trình duyệt
    window.onpopstate = (event) => {
        if (event.state && event.state.page === "video" && event.state.id) {
            initVideoDetailLogic(event.state.id);
        }
    };

    const titleEl = document.getElementById("video-title");
    const descEl = document.getElementById("video-desc");
    const listContainer = document.getElementById("video-related-tracks");
    const barTitle = document.getElementById("bar-title");
    const barArtist = document.getElementById("bar-artist");
    const barThumb = document.getElementById("bar-thumb");
    const progressBar = document.getElementById("bar-progress-bar");
    const progressDot = document.getElementById("bar-progress-dot");
    const currentTimeEl = document.getElementById("bar-current-time");
    const durationEl = document.getElementById("bar-duration");
    const playBtn = document.getElementById("bar-play-btn");
    const playIcon = playBtn ? playBtn.querySelector("i") : null;
    const progressContainer = document.getElementById("bar-progress-container");
    const nextBtn = document.getElementById("bar-next-btn");
    const prevBtn = document.getElementById("bar-prev-btn");
    const repeatBtn = document.getElementById("bar-repeat-btn");

    let embedContainer = document.getElementById('video-embed');
    if (!embedContainer) {
        const wrapper = document.querySelector('.aspect-video');
        if (wrapper) {
            wrapper.innerHTML = '<div id="video-embed" class="w-full h-full"></div>';
            embedContainer = document.getElementById('video-embed');
        }
    }
    if (!embedContainer) return;

    const uniquePlayerId = `yt-player-${Date.now()}`;
    embedContainer.id = uniquePlayerId;

    //load Data và initplayer
    try {
        const res = await fetch(`${API_BASE_URL}/videos/details/${id}`);
        const data = await res.json();
        
        relatedList = data.related || [];
        currentIndex = relatedList.findIndex(v => v.id === id);

        if(titleEl) titleEl.innerText = data.title;
        if(descEl) descEl.innerText = `Popularity: ${data.popularity}`;
        if(barTitle) barTitle.innerText = data.title;
        if(barArtist) barArtist.innerText = "YouTube Video";
        if(barThumb && data.thumbnails && data.thumbnails.length > 0) {
            barThumb.src = data.thumbnails[0];
        }
        if (listContainer) renderList(relatedList, id);

        await loadYouTubeAPI();
        
        player = new YT.Player(uniquePlayerId, {
            height: '100%',
            width: '100%',
            videoId: data.videoId,
            playerVars: { 
                'autoplay': 1, 
                'controls': 0, 
                'rel': 0, 
                'showinfo': 0,
                'enablejsapi': 1,
                // 'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

    } catch (error) {
        console.error("Lỗi tải video:", error);
    }
    
    //next 
    function handleNextVideo() {
        if (!relatedList || relatedList.length === 0) return;
        currentIndex = (currentIndex + 1) >= relatedList.length ? 0 : (currentIndex + 1);
        const nextId = relatedList[currentIndex].id;
        changeVideo(nextId);
    }
    //back
    function handlePrevVideo() {
        if (!relatedList || relatedList.length === 0) return;
        currentIndex = (currentIndex - 1) < 0 ? relatedList.length - 1 : (currentIndex - 1);
        const prevId = relatedList[currentIndex].id;
        changeVideo(prevId);
    }

    function changeVideo(newId) {
        if (!newId) return;
        window.history.pushState({ page: "video", id: newId }, "", `?page=video&id=${newId}`);
        initVideoDetailLogic(newId);
    }

    //render list
    function renderList(items, activeId) {
        listContainer.innerHTML = items.map((item, index) => `
            <tr class="group hover:bg-[#2a2a2a] rounded-md transition-colors cursor-pointer js-video-item ${item.id === activeId ? 'bg-[#2a2a2a]' : ''}" data-id="${item.id}">
                <td class="p-3 text-gray-400 w-10 text-center group-hover:text-white">${index + 1}</td>
                <td class="p-3 flex gap-4">
                    <img src="${item.thumbnails[0]}" class="w-24 h-14 rounded object-cover">
                    <div><h4 class="text-white font-medium text-sm line-clamp-2">${item.title}</h4></div>
                </td>
                <td class="p-3 text-gray-400 text-sm text-right hidden md:table-cell">${formatTime(item.duration)}</td>
            </tr>
        `).join("");

        listContainer.querySelectorAll(".js-video-item").forEach(row => {
            row.onclick = (e) => {
                e.preventDefault();
                changeVideo(row.dataset.id);
            };
        });
    }

    function onPlayerReady(event) {
        try {
            event.target.playVideo();
        } catch(e) { }
        startProgressLoop();
    }

    function onPlayerStateChange(event) {
        if (!playIcon) return;
        
        //pause
        if (event.data === 2) { 
            playIcon.className = "fas fa-play text-lg ml-1";
            startProgressLoop();
        } 
        //playing
        else if (event.data === 1) {
             playIcon.className = "fas fa-pause text-lg";
             startProgressLoop();
        }
        //ended (hết bài)
        else if (event.data === 0) {
            playIcon.className = "fas fa-play text-lg ml-1";
            if(isRepeat) {
                player.seekTo(0);
                player.playVideo();
            } else {
                handleNextVideo();
            }
        }
    }

    function startProgressLoop() {
        if (timeInterval) clearInterval(timeInterval);
        timeInterval = setInterval(() => {
            if (!player || typeof player.getCurrentTime !== 'function' || isDragging) return;
            try {
                const current = player.getCurrentTime();
                const total = player.getDuration();
                
                if (total > 0 && isFinite(total) && progressBar) {
                    const percent = (current / total) * 100;
                    progressBar.style.width = `${percent}%`;
                    
                    if (progressDot) {
                        progressDot.style.left = `${percent}%`;
                        progressDot.style.opacity = 1;
                    }

                    if(currentTimeEl) currentTimeEl.innerText = formatTime(current);
                    if(durationEl) durationEl.innerText = formatTime(total);
                }
            } catch(e) {}
        }, 500);
    }

    if(playBtn) {
        playBtn.onclick = () => {
            if(player && typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                state === 1 ? player.pauseVideo() : player.playVideo();
            }
        };
    }
    if(nextBtn) {
        nextBtn.onclick = handleNextVideo;
    }
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (relatedList && relatedList.length > 0) {
                handlePrevVideo();
            } else {
                window.history.back(); 
            }
        };
    }

    //lặp
    if(repeatBtn) {
        repeatBtn.style.color = isRepeat ? "#ef4444" : "";
        repeatBtn.onclick = () => {
            isRepeat = !isRepeat;
            repeatBtn.style.color = isRepeat ? "#ef4444" : "";
        };
    }
    
    if(progressContainer) {
        progressContainer.onclick = (e) => {
            if(!player || typeof player.getDuration !== 'function') return;
            const total = player.getDuration();
            if (total && isFinite(total)) {
                const rect = progressContainer.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                player.seekTo(percent * total, true);
            }
        }
    }
};
