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
    <div id="sticky-player-bar" class="fixed bottom-0 left-0 right-0 h-[80px] bg-[#212121] border-t border-[#333] flex items-center px-4 z-[99]">
        
        <div id="bar-progress-container" class="absolute top-0 left-0 w-full h-1 bg-gray-600 cursor-pointer group">
            <div id="bar-progress-bar" class="absolute top-0 left-0 h-full bg-red-600 w-0"></div>
            <div id="bar-progress-dot" class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style="left: 0%"></div>
        </div>

        <div class="w-[30%] flex items-center gap-4 pl-2">
            <div class="flex items-center gap-4">
                <button id="bar-prev-btn" class="text-gray-400 hover:text-white"><i class="fas fa-step-backward text-xl"></i></button>
                <button id="bar-play-btn" class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform text-black">
                    <i class="fas fa-play text-lg ml-1"></i> 
                </button>
                <button id="bar-next-btn" class="text-gray-400 hover:text-white"><i class="fas fa-step-forward text-xl"></i></button>
            </div>
            
            <div class="flex items-center gap-1 text-xs text-gray-400 font-medium ml-2">
                <span id="bar-current-time">0:00</span>
                <span>/</span>
                <span id="bar-duration">0:00</span>
            </div>
        </div>

        <div class="flex-1 flex items-center justify-center gap-3 overflow-hidden px-4">
            <img id="bar-thumb" class="w-14 h-14 rounded object-cover shadow-lg flex-shrink-0">
            <div class="overflow-hidden flex flex-col justify-center">
                <h3 id="bar-title" class="text-white font-bold text-sm truncate">Loading...</h3>
                <p id="bar-artist" class="text-gray-400 text-xs truncate">...</p>
            </div>
        </div>

        <div class="w-[30%] flex justify-end gap-6 text-gray-400 items-center pr-2">
             <i id="bar-repeat-btn" class="fas fa-repeat hover:text-white cursor-pointer" title="Lặp lại"></i>
             <i class="fas fa-volume-up hover:text-white cursor-pointer"></i>
        </div>

    </div>
    `;
};