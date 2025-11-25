const API_BASE_URL = "https://youtube-music.f8team.dev/api";

//lấy ảnh
const getThumb = (item) => {
    if (item && Array.isArray(item) && item.length > 0) return item[0];
    if (typeof item === 'string') return item;
    return;
};

export const DetailPageHTML = () => `
    <div id="detail-page" class="p-8 pb-32 text-white flex flex-col md:flex-row gap-8 animate-fade-in">
        <div class="w-full md:w-[350px] flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left md:sticky md:top-24 h-fit">
            <div class="w-[280px] h-[280px] shadow-2xl mb-6">
                <img id="detail-thumb" class="w-full h-full object-cover rounded-lg">
            </div>
            <h1 id="detail-title" class="text-2xl md:text-3xl font-bold mb-2 text-white">Loading</h1>
            <p id="detail-desc" class="text-gray-400 text-sm mb-4 line-clamp-3"></p>
            <p id="detail-count" class="text-gray-400 text-sm font-bold"></p>
            
            <button class="mt-6 bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
                Play all
            </button>
        </div>

        <div class="flex-1 min-w-0">
             <table class="w-full text-left border-collapse">
                <tbody id="detail-tracks"></tbody>
             </table>
        </div>
    </div>
`;

export const initDetailLogic = async (param, type) => {
    const root = document.getElementById("detail-page");
    if (!root) return;

    // Tìm endpoint là album hay playlisr
    const endpoint = type === "album" ? `/albums/details/${param}` : `/playlists/details/${param}`;

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await res.json();
        let info = data.data || data;
        if (!info.title && data.album) {
            info = data.album;
        }

        //cột trái
        document.getElementById("detail-title").innerText = info.title || "Unknown Title";
        document.getElementById("detail-thumb").src = getThumb(info.thumbnails || info.thumbnail);
        
        const artistNames = Array.isArray(info.artists) ? info.artists.map(a => a.name).join(", ") : "Unknown Artist";
        document.getElementById("detail-desc").innerText = info.description || info.sortDescription || artistNames;

        //list songgs
        const tracks = info.songs || info.tracks || info.items || [];
        document.getElementById("detail-count").innerText = `${tracks.length} songs`;

        //cột phải
        const tracksContainer = document.getElementById("detail-tracks");
        if (tracks.length === 0) {
            tracksContainer.innerHTML = `<tr><td class="text-gray-500 p-4">Không có bài hát</td></tr>`;
        } else {
            tracksContainer.innerHTML = tracks.map((track, index) => {
                const thumb = getThumb(track.thumbnails || track.thumbnail);
                const artists = Array.isArray(track.artists) ? track.artists.map(a => a.name).join(", ") : "null";
                const id = track.id || track.encodeId;
                return `
                <tr class="group hover:bg-[#2a2a2a] rounded-md transition-colors cursor-pointer js-navigate-song" data-id="${id}">
                    <td class="p-3 text-gray-400 w-10 text-center rounded-l-md group-hover:text-white">
                        <span class="group-hover:hidden">${index + 1}</span>
                        <i class="fas fa-play text-white hidden group-hover:inline"></i>
                    </td>
                    <td class="p-3">
                        <div class="flex items-center gap-4">
                            <img src="${thumb}" class="w-10 h-10 rounded object-cover">
                            <div>
                                <h4 class="text-white font-medium text-sm line-clamp-1">${track.title}</h4>
                                <p class="text-gray-400 text-xs">${artists}</p>
                            </div>
                        </div>
                    </td>
                    <td class="p-3 text-gray-400 text-sm hidden md:table-cell rounded-r-md text-right">
                       ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}
                    </td>
                </tr>`;
            }).join("");

            //khi click vào bài hát nào bất kì
            document.querySelectorAll(".js-navigate-song").forEach(row => {
                row.onclick = (e) => {
                    e.preventDefault();
                    const songId = row.dataset.id;
                    
                    //sang trang SongDetail.js
                    window.history.pushState(
                        { page: "song", id: songId, tracks: tracks }, 
                        "", 
                        `?page=song&id=${songId}`
                    );
                    window.dispatchEvent(new Event("popstate"));
                };
            });
        }
    } catch (error) {
        console.error(error);
        root.innerHTML = `<p class="text-white">Lỗi tải dữ liệu</p>`;
    }
};