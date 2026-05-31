/*
 * demo.js — mod de prezentare pentru înregistrări (screen recording).
 *
 * NU este necesar pentru invitațiile clienților — omite acest <script>
 * complet din pagina lor. Se activează doar cu ?demo=1 în URL; altfel iese
 * imediat fără să facă nimic.
 *
 * Ascultă evenimentele emise de main.js:
 *   - "invitation:intro-complete" → deschide plicul automat
 *   - "invitation:letter-opened"  → derulează scrisoarea cap-coadă
 *
 * Parametri URL:
 *   ?demo=1       activează modul demo
 *   &speed=30     durata (secunde) a auto-scroll-ului prin scrisoare (default 15)
 *   &rewind=1.5   durata (secunde) a derulării rapide înapoi sus (default 1.5)
 */
(function () {
    const params = new URLSearchParams(location.search);
    if (params.get("demo") !== "1") return;

    const scrollDuration = parseFloat(params.get("speed")) || 15;
    const rewindDuration = parseFloat(params.get("rewind")) || 1.5;

    document.addEventListener("invitation:intro-complete", () => {
        // Mică pauză după intro, apoi deschide plicul ca la un click real.
        gsap.delayedCall(1.2, () => {
            const seal = document.getElementById("plic-invitatie");
            if (seal) seal.click();
        });
    });

    document.addEventListener("invitation:letter-opened", () => {
        gsap.delayedCall(0.6, () => {
            ScrollTrigger.refresh();
            const smoother = ScrollSmoother.get();
            const setY = (y) =>
                smoother ? smoother.scrollTop(y) : window.scrollTo(0, y);
            const getY = () =>
                smoother ? smoother.scrollTop() : window.scrollY;

            const down = { y: getY() };
            gsap.to(down, {
                y: ScrollTrigger.maxScroll(window),
                duration: scrollDuration,
                delay: 1, // stă o secundă în partea de sus, apoi pleacă scroll-ul
                ease: "none",
                onUpdate: () => setY(down.y),
                onComplete: () => {
                    // Stă o secundă jos, apoi derulează rapid înapoi sus.
                    gsap.delayedCall(1, () => {
                        const up = { y: getY() };
                        gsap.to(up, {
                            y: 0,
                            duration: rewindDuration,
                            ease: "power2.inOut",
                            onUpdate: () => setY(up.y),
                        });
                    });
                },
            });
        });
    });
})();
