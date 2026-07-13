const body = document.querySelector("#notification");

export const createNotification = (isError, message) => {
  const div = document.createElement("div");
  
  // Animacionn
  const baseAnimation = "transform translate-y-[-15px] opacity-0 transition-all duration-300 ease-out mb-3 ml-auto w-full max-w-[360px]";

  if (isError) {
    div.className = `${baseAnimation} flex items-center gap-4 p-5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-[#141416] text-[#e4e4e7] border border-red-500/30`;
    
    div.innerHTML = `
      <div class="flex items-center justify-center rounded-full w-10 h-10 shrink-0 font-bold bg-red-500/10 text-red-500">
        ⚠️
      </div>
      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-xs font-bold uppercase tracking-widest text-red-500">
          Error
        </span>
        <p class="text-sm font-medium mt-0.5 leading-snug text-zinc-300 break-words">${message}</p>
      </div>
    `;
  } else {
    div.className = `${baseAnimation} flex items-center gap-4 p-5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-[#141416] text-[#e4e4e7] border border-emerald-500/30`;
    
    div.innerHTML = `
      <div class="flex items-center justify-center rounded-full w-10 h-10 shrink-0 font-bold bg-emerald-500/10 text-emerald-400">
        ✓
      </div>
      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Éxito
        </span>
        <p class="text-sm font-medium mt-0.5 leading-snug text-zinc-300 break-words">${message}</p>
      </div>
    `;
  }

  body.append(div);

  // Forzamos la animación de entrada
  setTimeout(() => {
    div.classList.remove("translate-y-[-15px]", "opacity-0");
    div.classList.add("translate-y-0", "opacity-100");
  }, 10);
};