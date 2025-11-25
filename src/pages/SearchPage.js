import Header from "../components/Header.js";
import Sidebar from "../components/sidebar.js";

//chuyển đổi giây sang phút:giây
const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const SearchPage = async (user) => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('q');
    let mainContent = '';
    if (!keyword) {
        mainContent = `<div class="text-white text-center mt-20 text-lg">Cần nhập keyword để search</div>`;
    } else {
        try {
            //API
            const response = await fetch(`https://youtube-music.f8team.dev/api/search?q=${encodeURIComponent(keyword)}`);
            const data = await response.json();
            const songs = data.results || data.data?.results || [];

            if (songs.length === 0) {
                mainContent = `<div class="text-white text-center mt-20 text-lg">Không tìm thấy bài "${keyword}"</div>`;
            } else {
                const songsHtml = songs.map(song => {
                    const img = song.thumbnails ? song.thumbnails[0] : 'https://via.placeholder.com/50';
                    const name = song.title || 'Không tên';
                    const artist = song.artists && song.artists.length > 0 ? song.artists[0].name : song.subtitle || '';
                    const time = formatTime(song.duration);

                    return `
                        <div class="flex items-center justify-between pb-3 hover:bg-[#FFFFFF1A] rounded-md cursor-pointer group border-b border-[#FFFFFF0D]">
                            <div class="flex items-center flex-1 overflow-hidden">
                                <div class="relative w-[50px] h-[50px] mr-4 rounded-md overflow-hidden flex-shrink-0">
                                    <img src="${img}" class="w-full h-full">
                                </div>
                                
                                <div class="flex flex-col overflow-hidden">
                                    <h3 class="text-white text-sm font-medium truncate">${name}</h3>
                                    <div class="text-gray-400 text-xs mt-1 flex items-baseline gap-2 truncate">
                                        <span class="text-[10px] uppercase">${song.type || 'Song'}</span>
                                        <span>${artist}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 mr-2">
                                <span class="text-gray-400 text-sm">${time}</span>
                            </div>
                        </div>
                    `;
                }).join('');

                //tiêu đề + danh sách
                mainContent = `
                    <div class="mb-6">
                        <h2 class="text-white text-2xl font-bold">Kết quả: "${keyword}"</h2>
                        <p class="text-gray-400 text-sm">Tìm thấy ${songs.length} kết quả</p>
                    </div>
                    <div class="flex flex-col pb-20 gap-1">
                        ${songsHtml}
                    </div>
                `;
            }
        } catch (error) {
            console.error(error);
            mainContent = `<div class="text-red-500 text-center mt-20">Lỗi</div>`;
        }
    }

    //giao diện
    return `
    <div class="flex h-screen bg-black overflow-hidden">
        <div class="w-[240px] border-[#333]">
            ${Sidebar()}
        </div>

        <div class="flex-1 flex flex-col w-full relative">
            ${Header(user)}
            
            <div class="flex-1 overflow-y-auto px-6 pt-[20px]">
                <div class="max-w-[1200px] mx-auto">
                    ${mainContent}
                </div>
            </div>
        </div>
    </div>
    `;
};

export default SearchPage;