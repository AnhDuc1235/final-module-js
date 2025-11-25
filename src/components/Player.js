export let audio = new Audio();
export let currentSongId = null;

//reset nhạc (dùng khi thoát trang)
export const stopMusic = () => {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        currentSongId = null;
    }
};

//thanh player
export const renderPlayerBarHTML = () => {
    return `
    <div id="sticky-player-bar" class="fixed bottom-0 left-0 right-0 h-[80px] bg-[#212121] border-t border-[#333] flex items-center px-4 z-[99] animate-slide-up">
        <div class="w-[30%] flex items-center gap-4">
            <img id="bar-thumb" class="w-14 h-14 rounded object-cover shadow-lg">
            <div class="overflow-hidden">
                <h3 id="bar-title" class="text-white font-bold text-sm truncate">Loading...</h3>
                <p id="bar-artist" class="text-gray-400 text-xs truncate">...</p>
            </div>
        </div>

        <div class="flex-1 flex flex-col items-center max-w-[600px] mx-auto">
            <div class="flex items-center gap-6 mb-1">
                <button class="text-gray-400 hover:text-white"><i class="fas fa-step-backward text-xl"></i></button>
                <button id="bar-play-btn" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform text-black">
                    <i class="fas fa-play text-lg ml-1"></i> 
                </button>
                <button class="text-gray-400 hover:text-white"><i class="fas fa-step-forward text-xl"></i></button>
            </div>
            <div class="w-full flex items-center gap-3">
                <span id="bar-current-time" class="text-xs text-gray-400 w-10 text-right">0:00</span>
                <div id="bar-progress-container" class="flex-1 h-1 bg-gray-600 rounded cursor-pointer relative group">
                    <div id="bar-progress-bar" class="absolute top-0 left-0 h-full bg-red-600 rounded w-0"></div>
                    <div id="bar-progress-dot" class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style="left: 0%"></div>
                </div>
                <span id="bar-duration" class="text-xs text-gray-400 w-10">0:00</span>
            </div>
        </div>

        <div class="w-[30%] flex justify-end gap-4 text-gray-400 items-center">
             <i class="fas fa-volume-up hover:text-white cursor-pointer"></i>
        </div>
    </div>
    `;
};