function Sidebar() {
    return `
    <div class="js-sidebar flex-col bg-black h-screen top-0 left-0 sticky z-50 border-r border-[#333]">
        <div class="flex mb-[30px] pt-[19px] pl-[30px] pr-[30px]">
            <button class="js-hamburger w-[50px] h-[24px]">
                <img src="./public/hamburger.png" alt="" />
            </button>
            <a href="/" class="js-spa-home">
                <img src="./public/youtube-music-seeklogo.png" alt="" class="w-[100px]">
            </a>
        </div>
        <div class="flex flex-col gap-[20px] pl-[12px]">
            <div id="sidebar-home" class="js-home w-[170px] flex flex-row items-center justify-start gap-[20px] border hover:bg-gray-600 p-[10px] rounded-[10px] ml-[11px] cursor-pointer js-spa-home">
                <a href="/" class="text-white pointer-events-none">ok</a>
                <a href="/" class="text-white text-[13px] pointer-events-none">Home</a>
            </div>
            
            <div id="sidebar-explore" class="js-explore w-[170px] flex flex-row items-center justify-start gap-[20px] border hover:bg-gray-600 p-[10px] rounded-[10px] ml-[11px] cursor-pointer">
                <a href="#" class="text-white">ok</a>
                <a href="#" class="text-white text-[13px]">Explore</a>
            </div>

             <div class="js-library w-[170px] flex flex-row items-center justify-start gap-[20px] border hover:bg-gray-600 p-[10px] rounded-[10px] ml-[11px]">
                <a href="#" class="text-white">ok</a>
                <a href="#" class="text-white text-[13px]">Library</a>
            </div>
            
            <div class="js-signin w-[170px] flex flex-row items-center justify-start gap-[20px] border hover:bg-gray-600 p-[10px] rounded-[10px] ml-[11px]">
                <a href="#" class="text-white">ok</a>
                <a href="#" class="text-white text-[13px]">Sign in</a>
            </div>
            
            <div class="js-signin-full w-[230px] pt-[10px] pb-[10px] px-2">
                 <button class="w-full bg-[#1d1d1d] text-white font-semibold py-2 rounded-full mb-3 text-sm">Sign in</button>
            </div>
        </div>
    </div>
    `;
}

export default Sidebar;

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.js-sidebar');
    let collapsed = false;
    document.addEventListener('click', (e) => {
        if (e.target.closest('.js-hamburger')) {
            collapsed = !collapsed;
            const items = document.querySelectorAll('.js-home, .js-explore, .js-library, .js-signin');
            const signinFull = document.querySelector('.js-signin-full');
            
            if(!collapsed) {
                if(signinFull) signinFull.classList.remove('hidden');
                items.forEach(i => {
                    i.classList.remove('flex-col', 'w-[60px]', 'text-center');
                    i.classList.add('flex-row', 'w-[170px]', 'justify-start', 'ml-[11px]');
                });
            } else {
                if(signinFull) signinFull.classList.add('hidden');
                items.forEach(i => {
                     i.classList.remove('flex-row', 'w-[170px]', 'justify-start', 'ml-[11px]');
                     i.classList.add('flex-col', 'w-[60px]', 'text-center');
                });
            }
        }
    });

    document.body.addEventListener('click', (e) => {
        const homeBtn = e.target.closest('.js-spa-home');
        
        if (homeBtn) {
            e.preventDefault();
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new Event("popstate"));
        }
    });
});