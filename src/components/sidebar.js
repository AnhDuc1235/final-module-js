function Sidebar() {
    return `
    <div class="js-sidebar hidden md:flex flex-col bg-black h-[calc(100vh-64px)] top-[64px] left-0 fixed z-[99] border-r border-[#333]">
        <div class="flex flex-col items-baseline gap-[20px] pt-[20px]">

            <div id="sidebar-home" class="js-home w-[170px] flex flex-row items-center justify-start gap-[10px] hover:bg-gray-800 rounded-[8px] cursor-pointer js-spa-home py-[10px]">
                <i class="fa-solid fa-house text-white text-2xl w-[40px]"></i>
                <a href="/" class="text-white text-[13px] pointer-events-none">Home</a>
            </div>
            
            <div id="sidebar-explore" class="js-explore w-[170px] flex flex-row items-center justify-start gap-[10px] hover:bg-gray-800 rounded-[8px] cursor-pointer py-[10px]">
                <i class="fa-regular fa-compass text-white text-2xl w-[40px]"></i>
                <a href="#" class="text-white text-[13px]">Explore</a>
            </div>

            <div class="js-library w-[170px] flex flex-row items-center justify-start gap-[10px] hover:bg-gray-800 rounded-[8px] cursor-pointer py-[10px]">
                <i class="fa-regular fa-bookmark text-white text-2xl w-[40px]"></i>
                <a href="#" class="text-white text-[13px]">Library</a>
            </div>
            
            <div class="js-signin js-login-trigger w-[170px] flex flex-row items-center justify-start gap-[10px] hover:bg-gray-800 rounded-[8px] cursor-pointer py-[10px]">
                <i class="fa-regular fa-user text-white text-2xl w-[40px]"></i>
                <a href="#" class="text-white text-[13px] pointer-events-none">Sign in</a>
            </div>

            <div class="js-signin-full w-[150px] pt-[10px] pl-[22px] pb-[10px] flex-col justify-center">
                <button class="js-login-trigger w-full bg-[#1d1d1d] text-white font-semibold py-2 rounded-full mb-3text-sm hover:bg-[#333] cursor-pointer">Sign in</button>
                <p class="text-gray-300 text-[11px] text-center">Sign in to create & share playlists, get personalized recommendations, and more.</p>
            </div>
        </div>
    </div>`;
}

export default Sidebar;

document.addEventListener("click", (e) => {
    const signinBtn = e.target.closest(".js-signin");
    const signinFullBtn = e.target.closest(".js-signin-full");
    if (signinBtn || signinFullBtn) {
        const openBtn = document.querySelector(".js-open-auth-modal");
        if (openBtn) openBtn.click();
    }
    const toggleBtn = e.target.closest(".js-hamburger");
    const sidebar = document.querySelector(".js-sidebar");
    if (toggleBtn && sidebar) {
        sidebar.classList.toggle("hidden");
    }
});
