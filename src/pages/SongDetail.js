import { renderPlayerBarHTML, audio, currentSongId } from "../components/Player";

const API_BASE_URL = "https://youtube-music.f8team.dev/api";

//format lại thời gian
function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export const SongDetailPageHTML = () => `
    <div id="song-detail-page" class="p-8 pb-32 text-white flex flex-col md:flex-row gap-8 animate-fade-in relative min-h-screen">
        <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left md:sticky md:top-24 h-fit">
            <div class="w-[280px] h-[280px] shadow-2xl mb-6">
                <img id="detail-thumb" src="" class="w-full h-full object-cover rounded-lg">
            </div>
            <h1 id="detail-title" class="text-2xl md:text-3xl font-bold mb-2">Loading</h1>
            <p id="detail-artist" class="text-gray-400 text-lg mb-4"></p>
        </div>

        <div class="flex-1 min-w-0">
             <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Danh sách bài hát/video</h3>
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
    const barThumb = document.getElementById("bar-thumb");
    const barTitle = document.getElementById("bar-title");
    const barArtist = document.getElementById("bar-artist");
    const playBtn = document.getElementById("bar-play-btn");
    const playIcon = playBtn.querySelector("i");
    const progressContainer = document.getElementById("bar-progress-container");
    const progressBar = document.getElementById("bar-progress-bar");
    const currentTimeEl = document.getElementById("bar-current-time");
    const durationEl = document.getElementById("bar-duration");

    let isDragging = false;

    const loadAndPlaySong = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/songs/details/${id}`);
            const data = await res.json();

            //cột trái
            const title = data.title;
            const artist = Array.isArray(data.artists) ? data.artists.join(", ") : "null";
            const thumb = data.thumbnails?.[0] || "https://via.placeholder.com/300";

            pageTitle.innerText = title;
            pageArtist.innerText = artist;
            pageThumb.src = thumb;

            barTitle.innerText = title;
            barArtist.innerText = artist;
            barThumb.src = thumb;

            //cột phải( danh sách)
            //lấy album tracks, nếu không có thì lấy playlist tracks
            let tracks = [];
            if (data.album && data.album.tracks) {
                tracks = data.album.tracks;
            } else if (data.playlists && data.playlists[0] && data.playlists[0].tracks) {
                tracks = data.playlists[0].tracks;
            }
            renderTracks(tracks, id);

            //phần audio
            if (audio.src !== data.audioUrl) {
                audio.src = data.audioUrl;
                try { await audio.play(); } catch(e) { console.error(e); }
            } else if (audio.paused) {
                audio.play();
            }
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
                <td class="p-3 text-gray-400 w-10 text-center rounded-l-md">
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
                const newId = row.dataset.id;
                
                //cập nhật URL
                window.history.pushState({ page: "song", id: newId }, "", `?page=song&id=${newId}`);
                
                //load bài mới
                loadAndPlaySong(newId);
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

    playBtn.onclick = () => {
        if (audio.paused) audio.play();
        else audio.pause();
        updatePlayIcon();
    };

    audio.onplay = updatePlayIcon;
    audio.onpause = updatePlayIcon;

    audio.ontimeupdate = () => {
        if (!isDragging) {
            const percent = (audio.currentTime / audio.duration) * 100 || 0;
            progressBar.style.width = `${percent}%`;
            currentTimeEl.innerText = formatTime(audio.currentTime);
            durationEl.innerText = formatTime(audio.duration);
        }
    };

    //tua nhạc
    progressContainer.onclick = (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    };

    await loadAndPlaySong(initialId);
};