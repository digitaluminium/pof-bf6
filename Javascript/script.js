// ===== HUD CONNEXION =====
if (!sessionStorage.getItem('hudVu')) {
    sessionStorage.setItem('hudVu', 'true');

    const hudOverlay = document.getElementById('hudOverlay');
    const hudBox = document.getElementById('hudBox');
    const hudText = document.getElementById('hudText');
    const hudProgress = document.getElementById('hudProgress');

    document.querySelector('.hero-content').style.opacity = '0';

    const messages = [
        'ETABLISSEMENT LIAISON...',
        'VERIFICATION IDENTITE...',
        'ACCES AUTORISE',
        'CONNEXION OK',
        'BIENVENUE SOLDATS !'
    ];

    function ecrireTexte(texte, callback) {
        hudText.textContent = '';
        let i = 0;
        function lettre() {
            if (i < texte.length) {
                hudText.textContent += texte[i];
                i++;
                setTimeout(lettre, 50);
            } else if (callback) {
                setTimeout(callback, 400);
            }
        }
        lettre();
    }

    setTimeout(() => {
        hudBox.classList.add('visible');
        ecrireTexte(messages[0], () => {
            ecrireTexte(messages[1], () => {
                ecrireTexte(messages[2], () => {
                    hudProgress.style.width = '100%';
                    setTimeout(() => {
                        ecrireTexte(messages[3], () => {
                            ecrireTexte(messages[4], () => {
                                setTimeout(() => {
                                    hudOverlay.style.transition = 'opacity 0.8s ease';
                                    hudOverlay.style.opacity = '0';
                                    document.querySelector('.hero-content').style.transition = 'opacity 1s ease';
                                    document.querySelector('.hero-content').style.opacity = '1';
                                    setTimeout(() => {
                                        hudOverlay.style.display = 'none';
                                        lancerRadar();
                                    }, 800);
                                }, 600);
                            });
                        });
                    }, 2000);
                });
            });
        });
    }, 500);

} else {
    // Pas d'animation, on affiche directement
    const hudOverlay = document.getElementById('hudOverlay');
    if (hudOverlay) hudOverlay.style.display = 'none';
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        document.querySelectorAll('.logo, .clan-tag, .hero-subtitle, .btn-join').forEach(el => {
            if (el) el.classList.add('visible');
        });
        const titre = document.querySelector('.hero-title');
        if (titre) titre.style.opacity = '1';
    }
}

// ===== RADAR =====
function lancerRadar() {
    const radarCanvas = document.getElementById('radarCanvas');
    if (!radarCanvas) return;

    const radarCtx = radarCanvas.getContext('2d');
    const taille = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    radarCanvas.width = taille;
    radarCanvas.height = taille;
    const centre = taille / 2;
    const rayon = taille / 2 - 10;
    let angle = 0;

    function dessinerRadar() {
        radarCtx.clearRect(0, 0, taille, taille);
        for (let i = 1; i <= 4; i++) {
            radarCtx.beginPath();
            radarCtx.arc(centre, centre, rayon * (i / 4), 0, Math.PI * 2);
            radarCtx.strokeStyle = 'rgba(0, 255, 65, 0.5)';
            radarCtx.lineWidth = 1;
            radarCtx.stroke();
        }
        radarCtx.strokeStyle = 'rgba(0, 255, 65, 0.5)';
        radarCtx.lineWidth = 1;
        radarCtx.beginPath();
        radarCtx.moveTo(centre, 0);
        radarCtx.lineTo(centre, taille);
        radarCtx.stroke();
        radarCtx.beginPath();
        radarCtx.moveTo(0, centre);
        radarCtx.lineTo(taille, centre);
        radarCtx.stroke();
        radarCtx.beginPath();
        radarCtx.moveTo(centre, centre);
        radarCtx.arc(centre, centre, rayon, angle - 1.2, angle);
        radarCtx.closePath();
        radarCtx.fillStyle = 'rgba(0, 255, 65, 0.15)';
        radarCtx.fill();
        radarCtx.beginPath();
        radarCtx.moveTo(centre, centre);
        radarCtx.lineTo(
            centre + Math.cos(angle) * rayon,
            centre + Math.sin(angle) * rayon
        );
        radarCtx.strokeStyle = 'rgba(0, 255, 65, 0.9)';
        radarCtx.lineWidth = 2;
        radarCtx.stroke();
        angle += 0.03;
    }

    const elements = [
        { el: document.querySelector('.logo'), angleDeclenchement: Math.PI * 0.5, apparu: false },
        { el: document.querySelector('.clan-tag'), angleDeclenchement: Math.PI * 1.0, apparu: false },
        { el: document.querySelector('.hero-title'), angleDeclenchement: Math.PI * 1.5, apparu: false },
        { el: document.querySelector('.hero-subtitle'), angleDeclenchement: Math.PI * 2.0, apparu: false },
        { el: document.querySelector('.btn-join'), angleDeclenchement: Math.PI * 2.5, apparu: false },
    ];

    let radarInterval = setInterval(() => {
        dessinerRadar();
        elements.forEach(item => {
            if (!item.el) return;
            if (!item.apparu && angle >= item.angleDeclenchement) {
                item.apparu = true;
                if (item.el.classList.contains('hero-title')) {
                    const texte = item.el.dataset.texte || item.el.textContent;
                    item.el.dataset.texte = texte;
                    item.el.textContent = '';
                    item.el.style.opacity = '1';
                    let j = 0;
                    function ecrire() {
                        if (j < texte.length) {
                            item.el.textContent += texte[j];
                            j++;
                            setTimeout(ecrire, 80);
                        }
                    }
                    ecrire();
                } else {
                    item.el.classList.add('visible');
                }
            }
        });
        if (angle > Math.PI * 3) {
            clearInterval(radarInterval);
            radarCanvas.style.transition = 'opacity 2s ease';
            radarCanvas.style.opacity = '0.05';
        }
    }, 16);
}

// ===== ACTIVE NAV =====
const liens = document.querySelectorAll('.hud-btn');
const pageCourante = window.location.pathname.split('/').pop() || 'index.html';

liens.forEach(lien => {
    lien.classList.remove('active');
    const href = lien.getAttribute('href');
    if (!href) return;
    const nomHref = href.split('/').pop();
    if (nomHref === pageCourante) {
        lien.classList.add('active');
    }
});

// ===== HORLOGE MILITAIRE =====
function mettreAjourHorloge() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('hudClock').textContent = `${h}:${m}:${s}`;
}
setInterval(mettreAjourHorloge, 1000);
mettreAjourHorloge();

// ===== DISCORD WIDGET =====
const discordSection = document.getElementById('radarDiscord');
if (discordSection) {
    fetch('https://discord.com/api/guilds/1452236656362127497/widget.json')
        .then(res => res.json())
        .then(data => {
            const enLigne = data.presence_count || 0;
            document.getElementById('compteurEnLigne').textContent = enLigne;
            lancerRadarDiscord(enLigne);
        })
        .catch(() => {
            lancerRadarDiscord(0);
        });
}

function lancerRadarDiscord(enLigne) {
    const radarCanvas = document.getElementById('radarDiscord');
    if (!radarCanvas) return;

    const ctx = radarCanvas.getContext('2d');
    const cx = 200;
    const cy = 200;
    const rayon = 180;
    let angle = 0;

    const points = [];
    for (let i = 0; i < enLigne; i++) {
        const r = Math.random() * (rayon - 40) + 20;
        const a = Math.random() * Math.PI * 2;
        points.push({
            x: cx + Math.cos(a) * r,
            y: cy + Math.sin(a) * r,
            anglePoint: a < 0 ? a + Math.PI * 2 : a,
            intensite: 0
        });
    }

    function dessiner() {
        ctx.clearRect(0, 0, 400, 400);

        ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, rayon * (i / 4), 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.beginPath(); ctx.moveTo(cx, cy - rayon); ctx.lineTo(cx, cy + rayon); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - rayon, cy); ctx.lineTo(cx + rayon, cy); ctx.stroke();

        const angleNormalise = angle % (Math.PI * 2);

        points.forEach(p => {
            let diff = angleNormalise - p.anglePoint;
            if (diff < 0) diff += Math.PI * 2;
            if (diff < 0.1) {
                p.intensite = 1.0;
            } else {
                p.intensite *= 0.98;
            }
            if (p.intensite > 0.05) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 65, ${p.intensite})`;
                ctx.shadowBlur = 10 * p.intensite;
                ctx.shadowColor = '#00ff41';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, rayon, angle - 1.2, angle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 255, 65, 0.06)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * rayon, cy + Math.sin(angle) * rayon);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        angle += 0.008;
        requestAnimationFrame(dessiner);
    }

    dessiner();
}

// ===== BURGER MENU =====
const burgerBtn = document.getElementById('burgerBtn');
const burgerMenu = document.getElementById('burgerMenu');

if (burgerBtn && burgerMenu) {
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        burgerMenu.classList.toggle('open');
    });

    burgerMenu.querySelectorAll('.hud-btn').forEach(lien => {
        lien.addEventListener('click', () => {
            burgerBtn.classList.remove('open');
            burgerMenu.classList.remove('open');
        });
    });
}