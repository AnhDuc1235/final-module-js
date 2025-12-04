import { renderPlayerBarHTML, audio } from "../components/Player";

const API_BASE_URL = "https://youtube-music.f8team.dev/api";

//format lại thời gian
function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export const SongDetailPageHTML = () => `
    <div id="song-detail-page" class="p-8 pb-32 text-white flex flex-col md:flex-row gap-8 relative min-h-screen">
        <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left md:sticky md:top-24 h-fit">
            <div class="w-[280px] h-[280px] shadow-2xl mb-6">
                <img id="detail-thumb" src="" class="w-full h-full object-cover rounded-lg">
            </div>
            <h1 id="detail-title" class="text-2xl md:text-3xl font-bold mb-2">Loading</h1>
            <p id="detail-artist" class="text-gray-400 text-lg mb-4"></p>
        </div>

        <div class="flex-1 min-w-0">
             <p class="text-white mb-4 text-2xl">video/song list</p>
             <table class="w-full text-left border-collapse">
                <tbody id="detail-tracks"></tbody>
             </table>
        </div>

        ${renderPlayerBarHTML()}
    </div>
`;

export const initSongDetailLogic = async (initialId) => {
    const pageThumb = document.getElementById("detail-thumb");
    const pageTitle = document.getElementById("detail-title");
    const pageArtist = document.getElementById("detail-artist");
    const listContainer = document.getElementById("detail-tracks");
    
    // Player Elements
    const barThumb = document.getElementById("bar-thumb");
    const barTitle = document.getElementById("bar-title");
    const barArtist = document.getElementById("bar-artist");
    const playBtn = document.getElementById("bar-play-btn");
    const playIcon = playBtn.querySelector("i");
    const progressContainer = document.getElementById("bar-progress-container");
    const progressBar = document.getElementById("bar-progress-bar");
    const progressDot = document.getElementById("bar-progress-dot");
    const currentTimeEl = document.getElementById("bar-current-time");
    const durationEl = document.getElementById("bar-duration");
    const nextBtn = document.getElementById("bar-next-btn");
    const prevBtn = document.getElementById("bar-prev-btn");
    const repeatBtn = document.getElementById("bar-repeat-btn");

    let isDragging = false;
    let playlist = [];
    let isRepeat = false;
    let currentId = initialId;

    //chuyển bài
    const changeSong = (id) => {
        if (!id) return;
        currentId = id;
        window.history.pushState({ page: "song", id: id }, "", `?page=song&id=${id}`);
        loadAndPlaySong(id);
    };

    const loadAndPlaySong = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/songs/details/${id}`);
            const data = await res.json();

            //cột trái
            const title = data.title;
            const artist = Array.isArray(data.artists) ? data.artists.join(", ") : "null"; //lưu ý
            const thumb = data.thumbnails?.[0];

            pageTitle.innerText = title;
            pageArtist.innerText = artist;
            pageThumb.src = thumb;

            barTitle.innerText = title;
            barArtist.innerText = artist;
            barThumb.src = thumb;

            //cột phải( danh sách)
            let tracks = [];
            if (data.album && data.album.tracks) {
                tracks = data.album.tracks;
            } else if (data.playlists && data.playlists[0] && data.playlists[0].tracks) {
                tracks = data.playlists[0].tracks;
            }
            
            if (tracks.length > 0) playlist = tracks;
            
            renderTracks(playlist, id);

            //phần audio
            if (audio.src !== data.audioUrl) {
                audio.src = data.audioUrl;
                try { 
                    await audio.play(); 
                } catch(e) { 
                    updatePlayIcon(); 
                }
            } else if (audio.paused) {
                try { await audio.play(); } catch(e) {}
            }
            
            // Giữ trạng thái repeat
            audio.loop = isRepeat;
            updatePlayIcon();

        } catch (error) {
            console.error("Lỗi load bài hát:", error);
        }
    };

    //list tracks
    const renderTracks = (tracks, activeId) => {
        if (!tracks || tracks.length === 0) return;
        
        listContainer.innerHTML = tracks.map((track, index) => {
            const isActive = track.id === activeId;
            const activeClass = isActive ? "bg-[#2a2a2a]" : "text-white";
            const thumb = track.thumbnails?.[0] || "";

            return `
            <tr class="group hover:bg-[#2a2a2a] rounded-md transition-colors cursor-pointer js-play-item ${isActive ? 'bg-[#2a2a2a]' : ''}" 
                data-id="${track.id}">
                <td class="p-3 text-gray-400 w-10 text-center rounded-l-md group-hover:text-white">
                    ${index + 1}
                </td>
                <td class="p-3">
                    <div class="flex items-center gap-4">
                        <img src="${thumb}" class="w-10 h-10 rounded object-cover">
                        <div>
                            <h4 class="${activeClass} font-medium text-sm line-clamp-1">${track.title}</h4>
                            <p class="text-gray-400 text-xs">${Array.isArray(track.artists) ? track.artists.join(", ") : ""}</p>
                        </div>
                    </div>
                </td>
                <td class="p-3 text-gray-400 text-sm hidden md:table-cell rounded-r-md text-right">
                   ${formatTime(track.duration)}
                </td>
            </tr>`;
        }).join("");

        document.querySelectorAll(".js-play-item").forEach(row => {
            row.onclick = (e) => {
                e.preventDefault();
                changeSong(row.dataset.id);
            };
        });
    };

    const updatePlayIcon = () => {
        if (audio.paused) {
            playIcon.classList.replace("fa-pause", "fa-play");
        } else {
            playIcon.classList.replace("fa-play", "fa-pause");
        }
    };

    //next
    const handleNext = () => {
        if (playlist.length === 0) return;
        let idx = playlist.findIndex(t => t.id === currentId);
        let nextIdx = idx + 1;
        if (nextIdx >= playlist.length) nextIdx = 0; //lặp về thằng đầu
        changeSong(playlist[nextIdx].id);
    };

    //back
    const handlePrev = () => {
        if (playlist.length === 0) return;
        let idx = playlist.findIndex(t => t.id === currentId);
        let prevIdx = idx - 1;
        if (prevIdx < 0) prevIdx = playlist.length - 1; //lặp veeg thằng cuối
        changeSong(playlist[prevIdx].id);
    };

    playBtn.onclick = () => {
        if (audio.paused) audio.play();
        else audio.pause();
        updatePlayIcon();
    };

    nextBtn.onclick = handleNext;
    prevBtn.onclick = handlePrev;

    repeatBtn.onclick = () => {
        isRepeat = !isRepeat;
        audio.loop = isRepeat;
        if (isRepeat) {
            repeatBtn.classList.remove("text-gray-400");
            repeatBtn.classList.add("text-red-500");
        } else {
            repeatBtn.classList.add("text-gray-400");
            repeatBtn.classList.remove("text-red-500");
        }
    };

    audio.onplay = updatePlayIcon;
    audio.onpause = updatePlayIcon;

    //auto next
    audio.onended = () => {
        if (!isRepeat) {
            handleNext();
        }
    };

    audio.ontimeupdate = () => {
        if (!isDragging && audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100 || 0;
            progressBar.style.width = `${percent}%`;
            
            if (progressDot) {
                progressDot.style.left = `${percent}%`; 
                progressDot.style.opacity = 1;
            }
            
            currentTimeEl.innerText = formatTime(audio.currentTime);
            durationEl.innerText = formatTime(audio.duration);
        }
    };

    //tua nhạc
    progressContainer.onclick = (e) => {
        if (audio.duration && isFinite(audio.duration)) {
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        }
    };

    await loadAndPlaySong(initialId);
};