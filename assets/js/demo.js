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
 *   &speed=30     durata (secunde) a auto-scroll-ului prin scrisoare (default 26)
 */
(function () {
    const params = new URLSearchParams(location.search);
    if (params.get("demo") !== "1") return;

    const scrollDuration = parseFloat(params.get("speed")) || 26;

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
            const proxy = { y: smoother ? smoother.scrollTop() : window.scrollY };
            gsap.to(proxy, {
                y: ScrollTrigger.maxScroll(window),
                duration: scrollDuration,
                ease: "none",
                onUpdate: () => {
                    if (smoother) smoother.scrollTop(proxy.y);
                    else window.scrollTo(0, proxy.y);
                },
            });
        });
    });
})();
