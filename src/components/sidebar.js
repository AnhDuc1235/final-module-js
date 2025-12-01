function Sidebar() {
    return `
    <div class="js-sidebar flex-col bg-black h-[calc(100vh-64px)] top-[64px] left-0 fixed z-[50] border-r border-[#333] transition-all duration-300">
        <div class="flex flex-col items-baseline gap-[20px] pl-[12px] pt-[20px]">
            <div id="sidebar-home" class="js-home w-[170px] flex flex-row items-center justify-start gap-[10px] border hover:bg-gray-800 pb-[10px] rounded-[10px] ml-[11px] cursor-pointer js-spa-home">
                <i class="fa-solid fa-house text-white text-2xl w-[40px]"></i>
                <a href="/" class="text-white text-[13px] pointer-events-none">Home</a>
            </div>
            
            <div id="sidebar-explore" class="js-explore w-[170px] flex flex-row items-center justify-start gap-[10px] border hover:bg-gray-800 pb-[10px] rounded-[10px] ml-[11px] cursor-pointer">
                <i class="fa-regular fa-compass text-white text-2xl w-[40px]"></i>
                <a href="#" class="text-white text-[13px]">Explore</a>
            </div>

            <div class="js-library w-[170px] flex flex-row items-center justify-start gap-[10px] border hover:bg-gray-800 pb-[10px] rounded-[10px] ml-[11px]">
                <i class="fa-regular fa-bookmark text-white text-2xl w-[40px]"></i>
                <a href="#" class="text-white text-[13px]">Library</a>
            </div>
            
            <div class="js-signin js-login-trigger w-[170px] flex flex-row items-center justify-start gap-[10px] border hover:bg-gray-800 pb-[10px] rounded-[10px] ml-[11px] cursor-pointer hidden">
                <i class="fa-solid fa-address-card text-white text-2xl w-[40px]"></i>
                <a href="#" class="text-white text-[13px] pointer-events-none">Sign in</a>
            </div>
            
            <div class="js-signin-full w-[230px] pt-[10px] pb-[10px] px-2 flex-col justify-center">
                <button class="js-login-trigger w-full bg-[#1d1d1d] text-white font-semibold py-2 rounded-full mb-3 text-sm hover:bg-[#333] transition">Sign in</button>
                <p class="text-gray-300 text-[13px] text-center">Sign in to create & share playlists, get personalized recommendations, and more.</p>
            </div>
        </div>
    </div>
    `;
}

export default Sidebar;

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".js-sidebar");
    const items = document.querySelectorAll(".js-home, .js-explore, .js-library, .js-signin");
    const signinFull = document.querySelector(".js-signin-full");
    const signinSmall = document.querySelector(".js-signin");
    let collapsed = false;
    
    document.addEventListener("click", (e) => {
        if (e.target.closest(".js-hamburger")) {
            collapsed = !collapsed;
            
            if (!collapsed) {
                sidebar.classList.remove("w-[100px]");
                if (signinFull) signinFull.classList.remove("hidden");
                if (signinSmall) signinSmall.classList.add("hidden");   //lỗi hiển thị: không ẩn/ hiện dù đã thêm được
                items.forEach(i => {
                    i.classList.remove("flex-col", "w-[60px]", "text-center", "justify-center", "items-center");
                    i.classList.add("flex-row", "w-[170px]", "justify-start", "ml-[11px]");
                    const textLink = i.querySelector("a");
                    if (textLink) textLink.classList.remove("hidden");
                });

            } else {
                sidebar.classList.add("w-[100px]"); 
                if (signinFull) signinFull.classList.add("hidden");
                if (signinSmall) signinSmall.classList.remove("hidden");
                items.forEach(i => {
                    i.classList.remove("flex-row", "w-[170px]", "justify-start", "ml-[11px]");
                    i.classList.add("flex-col", "w-[60px]", "text-center", "justify-center", "items-center");
                    const textLink = i.querySelector("a");
                    if (textLink) textLink.classList.add("hidden");
                });
            }
        }
    });

    const loginTriggers = document.querySelectorAll(".js-login-trigger");
    loginTriggers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const headerLoginBtn = document.querySelector(".js-open-auth-modal");
            if (headerLoginBtn) {
                console.log("Triggering Header Modal...");
                headerLoginBtn.click();
            } else {
                console.error("Không tìm thấy nút đăng nhập trên Header (.js-open-auth-modal)");
            }
        });
    });

    document.body.addEventListener("click", (e) => {
        const homeBtn = e.target.closest(".js-spa-home");
        if (homeBtn) {
            e.preventDefault();
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new Event("popstate"));
        }
    });
});
