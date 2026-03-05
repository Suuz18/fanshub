// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAqMtk4QNFwbOyhumNDyZ_46u9XxRWcKAg",
    authDomain: "hub-b85fd.firebaseapp.com",
    databaseURL: "https://hub-b85fd-default-rtdb.firebaseio.com",
    projectId: "hub-b85fd",
    storageBucket: "hub-b85fd.firebasestorage.app",
    messagingSenderId: "381608338529",
    appId: "1:381608338529:web:1577a5facef1cfd9b97620",
    measurementId: "G-JW1HQEVR5H"
};

// Inicialización de Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
const chatRef = database.ref('messages');

// --- CONFIGURACIÓN INICIAL ---
document.addEventListener('DOMContentLoaded', () => {
    renderSongs();
    renderBlog();
    if (window.lucide) lucide.createIcons();
});

let pts = 380;
let totalViews = 1348291;

// --- SISTEMA DE REPRODUCTOR ---
let playlist = [
    { file: 'ncn.mp4', title: 'Nadie Como Nosotros', artist: 'Dani B. x Jlexis' },
    { file: 'pdt.mp4', title: 'Pa Divino Tú', artist: 'Dani Barranco' },
    { file: 'celc.mp4', title: 'Cadena en la Cara', artist: 'Dani Barranco' },
    { file: 'clh.mp4', title: 'Como le hago', artist: 'Jlexis' }
];

let currentIndex = -1;
let isShuffle = false;
let isRepeat = false;
const videoPlayer = document.getElementById('main-video');

function renderSongs() {
    const list = document.getElementById('song-list');
    if(!list) return;
    
    list.innerHTML = playlist.map((s, i) => `
        <div onclick="playAt(${i})" class="glass p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition border border-white/5">
            <div>
                <p class="font-black italic text-xs uppercase tracking-tighter">${s.title}</p>
                <p class="text-[8px] text-zinc-500 uppercase font-bold">${s.artist}</p>
            </div>
            <i data-lucide="play-circle" class="text-pink-600 opacity-0 group-hover:opacity-100 transition w-5 h-5"></i>
        </div>`).join('');
    
    if (window.lucide) lucide.createIcons();
}

window.playAt = function(index) {
    currentIndex = index;
    const track = playlist[currentIndex];
    videoPlayer.src = track.file;
    videoPlayer.play();
    document.getElementById('current-song-title').innerText = track.title;
    document.getElementById('btn-play').innerHTML = '<i data-lucide="pause" class="w-6 text-white"></i>';
    lucide.createIcons();
}

window.togglePlay = function() {
    if(currentIndex === -1) { window.playAt(0); return; }
    if (videoPlayer.paused) {
        videoPlayer.play();
        document.getElementById('btn-play').innerHTML = '<i data-lucide="pause" class="w-6 text-white"></i>';
    } else {
        videoPlayer.pause();
        document.getElementById('btn-play').innerHTML = '<i data-lucide="play" class="w-6 text-white"></i>';
    }
    lucide.createIcons();
}

window.nextTrack = function() {
    let next = isShuffle ? Math.floor(Math.random() * playlist.length) : (currentIndex + 1) % playlist.length;
    window.playAt(next);
}

window.prevTrack = function() { 
    let prev = (currentIndex - 1 + playlist.length) % playlist.length;
    window.playAt(prev); 
}

window.toggleShuffle = function() { 
    isShuffle = !isShuffle; 
    document.getElementById('btn-shuffle').classList.toggle('text-pink-600', isShuffle); 
}

window.toggleRepeat = function() { 
    isRepeat = !isRepeat; 
    document.getElementById('btn-repeat').classList.toggle('text-pink-600', isRepeat); 
}

videoPlayer.onended = () => {
    if (isRepeat) videoPlayer.play();
    else window.nextTrack();
};

// --- SISTEMA DE BLOG ---
const blogPosts = [
    { id: 1, category: 'musica', title: 'DROP: 38/10 REMIX', content: 'Dani B. y Jlexis confirman la fecha del remix...', image: 'foto1.jpg', reactions: 124 },
    { id: 2, category: 'tour', title: 'SOLD OUT HUB', content: 'Récords de asistencia en el primer meet up...', image: 'foto2.jpg', reactions: 89 },
    { id: 3, category: 'musica', title: 'BEHIND THE SCENES', content: 'Contenido exclusivo del rodaje de NCN...', image: 'foto3.jpg', reactions: 210 }
];

function renderBlog(filter = 'all') {
    const container = document.getElementById('blog-container');
    if (!container) return;
    const filtered = filter === 'all' ? blogPosts : blogPosts.filter(p => p.category === filter);

    container.innerHTML = filtered.map(post => `
        <article class="blog-card glass rounded-[35px] overflow-hidden border border-white/5 flex flex-col">
            <div class="h-40 overflow-hidden relative">
                <span class="absolute top-3 left-3 z-10 category-tag px-3 py-1 rounded-full text-[7px] font-black uppercase italic">${post.category}</span>
                <img src="${post.image}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700">
            </div>
            <div class="p-6">
                <h3 class="font-title text-xs mb-2 italic uppercase">${post.title}</h3>
                <p class="text-[10px] text-zinc-400 italic mb-4 line-clamp-2">${post.content}</p>
                <div class="flex justify-between items-center pt-4 border-t border-white/5">
                    <button onclick="addReaction(${post.id}, this)" class="flex items-center gap-2 group transition-transform active:scale-125">
                        <span class="text-pink-600">🔥</span>
                        <span id="react-${post.id}" class="text-[9px] font-bold text-zinc-500">${post.reactions}</span>
                    </button>
                    <span class="text-[8px] font-black uppercase text-pink-600 cursor-pointer">Ver más</span>
                </div>
            </div>
        </article>
    `).join('');
}

window.addReaction = function(id, btn) {
    const post = blogPosts.find(p => p.id === id);
    if(post) {
        post.reactions++;
        document.getElementById(`react-${id}`).innerText = post.reactions;
        pts += 5;
        document.getElementById('score').innerText = `${pts} PTS`;
    }
}

window.filterBlog = function(cat) { renderBlog(cat); }

// --- COMUNIDAD: CHAT REAL (FIREBASE) ---
window.sendMessage = function() {
    const input = document.getElementById('chat-input');
    if (input && input.value.trim() !== "") {
        // Guardamos en la base de datos de Google
        chatRef.push({
            user: "Fan_" + Math.floor(Math.random() * 999),
            text: input.value,
            timestamp: Date.now()
        });

        input.value = "";
        pts += 15; // Más puntos por mensaje real
        document.getElementById('score').innerText = `${pts} PTS`;
    }
}

// Escuchar mensajes de Firebase y pintarlos en el muro
chatRef.on('child_added', (snapshot) => {
    const data = snapshot.val();
    const messageId = snapshot.key; // El ID único de Firebase
    const container = document.getElementById('chat-messages');
    if (!container) return;

    // Verificamos si el mensaje es nuestro
    const isMe = data.user === currentUsername;

    const messageHTML = `
        <div id="msg-${messageId}" class="flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-6 group animate-fade-in">
            <div class="flex items-center gap-2 mb-1">
                <span class="text-[8px] text-pink-500 uppercase font-black">${data.user}</span>
                ${isMe ? `
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onclick="editMessage('${messageId}')" class="text-[8px] text-zinc-500 hover:text-white uppercase">Editar</button>
                        <button onclick="deleteMessage('${messageId}')" class="text-[8px] text-red-500 hover:text-red-400 uppercase">Eliminar</button>
                    </div>
                ` : ''}
            </div>
            
            <div class="relative max-w-[85%]">
                <div id="text-${messageId}" class="${isMe ? 'bg-pink-600' : 'glass border border-white/10'} p-4 rounded-3xl ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-xl">
                    <p class="text-[11px] italic text-white">${data.text}</p>
                </div>
                
                <button onclick="reactToMessage('${messageId}')" class="absolute -bottom-2 -right-2 bg-zinc-900 border border-white/10 rounded-full w-6 h-6 flex items-center justify-center text-[10px] hover:scale-110 transition">
                    🔥 <span id="react-count-${messageId}" class="text-[8px] ml-1">${data.reactions || 0}</span>
                </button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', messageHTML);
    container.scrollTop = container.scrollHeight;
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'chat-input') {
        window.sendMessage();
    }
});

// ELIMINAR MENSAJE
window.deleteMessage = function(id) {
    if(confirm("¿Seguro que quieres eliminar este mensaje del movimiento?")) {
        database.ref('messages/' + id).remove();
        document.getElementById('msg-' + id).remove();
    }
}

// EDITAR MENSAJE
window.editMessage = function(id) {
    const newText = prompt("Edita tu huella:");
    if (newText && newText.trim() !== "") {
        database.ref('messages/' + id).update({
            text: newText + " (editado)"
        });
        // Actualizamos visualmente
        document.querySelector(`#text-${id} p`).innerText = newText + " (editado)";
    }
}

// REACCIONAR (🔥)
window.reactToMessage = function(id) {
    const ref = database.ref('messages/' + id + '/reactions');
    ref.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    });
    
    // Sumar puntos al que reacciona
    pts += 2;
    document.getElementById('score').innerText = `${pts} PTS`;
}

// Escuchar cambios en las reacciones en tiempo real
chatRef.on('child_changed', (snapshot) => {
    const data = snapshot.val();
    const id = snapshot.key;
    const reactEl = document.getElementById(`react-count-${id}`);
    const textEl = document.querySelector(`#text-${id} p`);
    
    if (reactEl) reactEl.innerText = data.reactions || 0;
    if (textEl) textEl.innerText = data.text;
});

// --- JUEGOS ---
window.openImpostor = function() {
    document.getElementById('arcade-menu').classList.add('hidden');
    document.getElementById('impostor-interface').classList.remove('hidden');
}

let gameState = { round: 1, impostor: null, word: '', currentTurn: 0, turnOrder: [] };
const gameWords = ["REMIX", "CONCIERTO", "ESTUDIO", "FANBASE", "PLATINO"];

window.initGame = function() {
    gameState.round = 1;
    gameState.impostor = Math.floor(Math.random() * 4);
    gameState.word = gameWords[Math.floor(Math.random() * gameWords.length)];
    let ids = [0,1,2,3];
    ids.sort(() => Math.random() - 0.5);
    gameState.turnOrder = ids;
    gameState.currentTurn = 0;
    
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('word-box').innerText = (gameState.impostor === 0) ? "ERES EL IMPOSTOR" : gameState.word;
    document.getElementById('game-chat').innerHTML = "<div>SISTEMA: ¡Partida iniciada!</div>";
}

// Estadísticas en vivo
setInterval(() => {
    const el = document.getElementById('live-views');
    if(el) {
        totalViews += Math.floor(Math.random() * 8) + 1;
        el.innerText = totalViews.toLocaleString();
    }
}, 2500);

// Variable global para el nombre
let currentUsername = localStorage.getItem('chat-username') || "";

// Al cargar la página, revisamos si ya tiene nombre
document.addEventListener('DOMContentLoaded', () => {
    if (currentUsername) {
        showChatInput();
    }
});

// Función para guardar el nombre
window.saveUsername = function() {
    const nameInput = document.getElementById('username-input');
    const name = nameInput.value.trim();
    
    if (name.length >= 3) {
        currentUsername = name;
        localStorage.setItem('chat-username', name);
        showChatInput();

        // BUSCAR PUNTOS PREVIOS EN FIREBASE
        database.ref('users/' + currentUsername).once('value', (snapshot) => {
            const data = snapshot.val();
            if (data && data.points) {
                pts = data.points; // Carga los puntos que ya tenía
                document.getElementById('score').innerText = `${pts} PTS`;
            } else {
                pts = 0; // Si es nuevo, empieza en 0
                addPoints(0); 
            }
        });
    } else {
        alert("El nombre debe tener al menos 3 caracteres.");
    }
}

// Intercambia la interfaz de login por la de chat
function showChatInput() {
    document.getElementById('chat-login').classList.add('hidden');
    document.getElementById('chat-input-area').classList.remove('hidden');
}

// MODIFICAMOS la función sendMessage que ya tenías para usar el nombre real
window.sendMessage = function() {
    const input = document.getElementById('chat-input');
    if (input && input.value.trim() !== "" && currentUsername !== "") {
        chatRef.push({
            user: currentUsername, // <--- Aquí ya no es Fan_Aleatorio
            text: input.value,
            timestamp: Date.now()
        });

        input.value = "";
        pts += 15;
        document.getElementById('score').innerText = `${pts} PTS`;

        // Nueva función para centralizar y guardar puntos
function addPoints(amount) {
    if (!currentUsername) return; // Si no hay usuario, no hay puntos
    pts += amount;
    document.getElementById('score').innerText = `${pts} PTS`;
    
    // Guardamos en Firebase bajo una carpeta de usuarios
    database.ref('users/' + currentUsername).update({
        points: pts
    });
}
    }
}

// --- LÓGICA DE GALERÍA DE FANS ---
// --- LÓGICA DE GALERÍA DE FANS (UGC) ---
const galleryRef = database.ref('gallery_ugc');

window.openUploadModal = function() {
    if (!currentUsername) return alert("Primero ponte un nombre en el chat.");
    document.getElementById('upload-modal').classList.remove('hidden');
}

window.closeUploadModal = function() {
    document.getElementById('upload-modal').classList.add('hidden');
}

window.submitToGallery = function() {
    const urlInput = document.getElementById('upload-url');
    const url = urlInput.value.trim();
    const cat = document.getElementById('upload-category').value;
    
    if(url) {
        galleryRef.push({
            user: currentUsername,
            url: url,
            category: cat,
            votes: 0,
            timestamp: Date.now()
        });
        urlInput.value = "";
        closeUploadModal();
        // Feedback visual
        if(window.addPoints) addPoints(50); 
    }
}

window.voteContent = function(id) {
    database.ref('gallery_ugc/' + id + '/votes').transaction(c => (c || 0) + 1);
}

// Función auxiliar para detectar y convertir links de TikTok a Embed
function getMediaHTML(url) {
    if (url.includes('tiktok.com')) {
        // Extrae el ID del video de TikTok
        const tiktokId = url.split('/video/')[1]?.split('?')[0];
        if (tiktokId) {
            return `<iframe src="https://www.tiktok.com/embed/v2/${tiktokId}" class="w-full h-full" frameborder="0" allow="fullscreen"></iframe>`;
        }
    }
    // Si no es TikTok, asume que es un link directo a video (MP4)
    return `
        <video src="${url}" class="w-full h-full object-cover" loop muted playsinline onmouseover="this.play()" onmouseout="this.pause()"></video>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
            <div class="bg-black/20 p-4 rounded-full backdrop-blur-sm">
                <span class="text-white text-xs font-black uppercase italic">Play</span>
            </div>
        </div>
    `;
}

// Escuchar y pintar la galería optimizada
galleryRef.on('value', (snapshot) => {
    const container = document.getElementById('gallery-grid');
    if(!container) return;
    const data = snapshot.val();
    
    if(!data) {
        container.innerHTML = "<p class='text-zinc-600 uppercase text-[10px] font-bold py-10'>Aún no hay videos. ¡Sube el primero!</p>";
        return;
    }

    container.innerHTML = Object.entries(data).reverse().map(([id, item]) => `
    <div class="min-w-[320px] md:min-w-[380px] snap-center glass rounded-[40px] overflow-hidden border border-white/5 flex flex-col group transition-all hover:border-pink-600/50 bg-zinc-900/40">
        <div class="relative h-[500px] bg-black">
            ${getMediaHTML(item.url)}
            <div class="absolute top-4 left-4 z-10">
                <span class="bg-pink-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase italic shadow-lg ring-1 ring-white/20">#${item.category}</span>
            </div>
        </div>
        <div class="p-6 flex justify-between items-center bg-[#111111]">
            <div>
                <p class="text-[11px] font-black uppercase italic text-pink-500 tracking-wider">@${item.user}</p>
            </div>
            <button onclick="voteContent('${id}')" class="flex items-center gap-2 bg-white/5 hover:bg-pink-600 px-4 py-2.5 rounded-2xl transition-all active:scale-125">
                <span class="text-xs">🔥</span>
                <span class="text-[11px] font-bold text-white">${item.votes || 0}</span>
            </button>
        </div>
    </div>
`).join('');

window.scrollGallery = function(direction) {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    // Calculamos cuánto desplazar (el ancho de una card + el gap)
    const cardWidth = container.querySelector('.snap-center').offsetWidth + 24; 
    
    container.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
};

});