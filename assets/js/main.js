const mobileDevices = /Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(
    navigator.userAgent,
);
const INTRO_TARGETS = [
    "#intro-title",
    "#intro-date",
    "#plic-wrapper",
    "#intro-tagline",
    "#countdown",
    "#buchet-img",
    "#hearts",
];

let smoother = null;

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    gsap.set(INTRO_TARGETS, { autoAlpha: 0 });

    window.addEventListener("load", () => {
        smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 2,
            smoothTouch: mobileDevices ? 0.1 : 2,
            effects: false,
        });

        initLazyImagesRefresh();
        initEnvelope();
        initHearts();
        initCountdown();
        const introTl = initIntro();
        ScrollTrigger.refresh();

        if (introTl) {
            introTl.eventCallback("onComplete", () => {
                document.dispatchEvent(new Event("invitation:intro-complete"));
            });

            // Demo (?demo=1): primele 1.2s ecranul rămâne gol (doar fundalul,
            // nici măcar inimioarele) — toată animația de intro e pe pauză, ca
            // să poți pune un text curat peste la editarea video-ului.
            if (new URLSearchParams(location.search).get("demo") === "1") {
                introTl.pause(0);
                gsap.delayedCall(1.2, () => introTl.play());
            }
        }
    });
});

function initIntro() {
    const title = document.getElementById("intro-title");
    const dateEl = document.getElementById("intro-date");
    const taglineEl = document.getElementById("intro-tagline");
    if (!title) return;

    const splitTitle = new SplitText(title, {
        type: "words,chars",
        wordsClass: "intro-word",
    });
    const splitDate = dateEl
        ? new SplitText(dateEl, { type: "chars" })
        : { chars: [] };
    const splitTagline = taglineEl
        ? new SplitText(taglineEl, { type: "words" })
        : { words: [] };

    gsap.set(splitTitle.chars, { x: 80, opacity: 0 });
    gsap.set(splitDate.chars, { yPercent: 110, opacity: 0 });
    gsap.set(splitTagline.words, { y: 20, opacity: 0 });
    gsap.set("#plic-wrapper", { y: 80, scale: 0.7 });
    gsap.set("#click-plic", { autoAlpha: 0, y: 10 });
    gsap.set("#trandafir-img", { autoAlpha: 0, scale: 0, rotate: -90 });
    gsap.set(".countdown-item", { opacity: 0, y: 30 });
    gsap.set("#buchet-img", { x: -120, y: 120, rotate: -20, scale: 0.6 });

    gsap.set(
        [
            "#intro-title",
            "#intro-date",
            "#intro-tagline",
            "#countdown",
            "#buchet-img",
        ],
        { autoAlpha: 1 },
    );

    const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
    });

    tl.to("#hearts", { autoAlpha: 1, duration: 1, ease: "power1.out" }, 0)
        .to(
            splitTitle.chars,
            {
                x: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.035,
                ease: "power3.out",
            },
            0.1,
        )
        .to(
            splitDate.chars,
            {
                yPercent: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.03,
                ease: "power3.out",
            },
            "-=0.45",
        )
        .to(
            "#plic-wrapper",
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "expo.out",
            },
            "-=0.35",
        )
        .to(
            "#trandafir-img",
            {
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                duration: 0.5,
                ease: "back.out(1.7)",
            },
            "-=0.4",
        )
        .to(
            "#click-plic",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.35,
            },
            "-=0.3",
        )
        .to(
            splitTagline.words,
            {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.05,
            },
            "-=0.3",
        )
        .to(
            ".countdown-item",
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: "power2.out",
            },
            "-=0.25",
        )
        .to(
            "#buchet-img",
            {
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                duration: 0.9,
                ease: "expo.out",
            },
            "-=0.8",
        );

    return tl;
}

function initEnvelope() {
    const seal = document.getElementById("plic-invitatie");
    if (!seal) return;

    seal.addEventListener("click", openEnvelope, { once: true });
}

function openEnvelope() {
    const heroFadeTargets = [
        "#intro-title",
        "#intro-date",
        "#intro-tagline",
        "#countdown",
        "#trandafir-img",
        "#buchet-img",
    ];

    const fakeEl = document.querySelector(".letter-fake");
    const fakeContent = fakeEl
        ? fakeEl.querySelectorAll(".letter-ornament, p")
        : [];
    const overlayEl = document.querySelector(".letter-overlay");

    const tl = gsap
        .timeline()
        .to("#click-plic", {
            opacity: 0,
            duration: 0.4,
        })
        .to(
            ".cover",
            {
                rotationX: 180,
                ease: "none",
                duration: 0.8,
            },
            "<",
        )
        .set(".cover", { zIndex: 2 })
        .to(
            heroFadeTargets,
            {
                autoAlpha: 0,
                y: -20,
                duration: 0.7,
                ease: "power2.in",
                stagger: 0.04,
            },
            "-=0.5",
        )
        .set(fakeEl, { yPercent: 0, y: 0 })
        .to(
            fakeEl,
            {
                y: () => {
                    const r = fakeEl.getBoundingClientRect();
                    return -r.top + 20;
                },
                duration: 1.1,
                ease: "power2.inOut",
                immediateRender: false,
            },
            "+=0.1",
        )
        .to(
            fakeContent,
            {
                opacity: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: "power1.out",
            },
            "-=0.7",
        )
        .add(() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            overlayEl.style.width = vw + "px";
            overlayEl.style.height = vh + "px";

            const r = fakeEl.getBoundingClientRect();
            const sx = r.width / vw;
            const sy = r.height / vh;
            const tx = r.left + r.width / 2 - vw / 2;
            const ty = r.top + r.height / 2 - vh / 2;

            gsap.set(overlayEl, {
                autoAlpha: 1,
                scaleX: sx,
                scaleY: sy,
                x: tx,
                y: ty,
                borderRadius: 3,
            });
            const overlayGreeting = overlayEl.querySelector(".overlay-greeting");
            if (overlayGreeting) {
                gsap.set(overlayGreeting, {
                    xPercent: -50,
                    yPercent: -50,
                    scaleX: 1 / sx,
                    scaleY: 1 / sy,
                });
            }

            gsap.timeline()
                .to(fakeEl, { autoAlpha: 0, duration: 0.2 }, 0)
                .to(
                    overlayEl,
                    {
                        scaleX: 1,
                        scaleY: 1,
                        x: 0,
                        y: 0,
                        borderRadius: 0,
                        duration: 0.9,
                        ease: "power3.inOut",
                    },
                    0,
                )
                .to(
                    overlayGreeting,
                    {
                        scaleX: 1,
                        scaleY: 1,
                        duration: 0.9,
                        ease: "power3.inOut",
                    },
                    0,
                )
                .add(() => {
                    gsap.set("#letter", { display: "block" });
                    gsap.set(".letter-inner", { autoAlpha: 0 });
                    gsap.set(".i-scene-wrapper", { display: "none" });
                    if (smoother) {
                        smoother.scrollTo(0, false);
                    }
                    initLetterAnimations();
                    ScrollTrigger.refresh();
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => ScrollTrigger.refresh());
                    }
                    setTimeout(() => ScrollTrigger.refresh(), 600);
                })
                .to(".letter-inner", {
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: "power2.out",
                })
                .to(
                    overlayEl,
                    {
                        autoAlpha: 0,
                        duration: 0.5,
                    },
                    "<",
                )
                .set(overlayEl, { display: "none" })
                .add(() => {
                    document.dispatchEvent(
                        new Event("invitation:letter-opened"),
                    );
                });
        });

    return tl;
}

function initLetterAnimations() {
    const letter = document.getElementById("letter");
    if (!letter) return;

    setupIntroSequence();
    setupRestSections();
    initTimelineAnimation();

    function makeReveal(parent, tl, defaults = {}) {
        return (sel, opts = {}) => {
            const els = parent.querySelectorAll(sel);
            if (!els.length) return;
            const { position, ...vars } = { ...defaults, ...opts };
            tl.from(
                els,
                {
                    y: 24,
                    opacity: 0,
                    duration: 0.55,
                    ease: "power3.out",
                    stagger: 0.08,
                    ...vars,
                },
                position,
            );
        };
    }

    function splitChars(el, tl, vars, position) {
        if (!el || el.dataset.split) return;
        el.dataset.split = "1";
        const split = new SplitText(el, { type: "words,chars" });
        tl.from(split.chars, vars, position);
    }

    function setupIntroSequence() {
        const greeting = letter.querySelector(".letter-greeting-section");
        if (!greeting) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: greeting,
                start: "top 90%",
                toggleActions: "play none none reverse",
            },
        });
        const reveal = makeReveal(letter, tl);

        reveal(".letter-greeting-section .letter-ornament", {
            y: 10,
            duration: 0.25,
            position: 0,
        });
        splitChars(
            letter.querySelector(".letter-greeting"),
            tl,
            {
                x: 30,
                opacity: 0,
                duration: 0.25,
                stagger: 0.012,
                ease: "power3.out",
            },
            0.1,
        );
        reveal(".letter-greeting-section .ink-body", { duration: 0.3, position: 0.3 });
        reveal(".parents-section .section-title", { duration: 0.25, position: 0.4 });
        reveal(".parents-section .parents-card", { duration: 0.3, stagger: 0.08, position: 0.5 });
        reveal(".parents-section .parents-divider span", {
            y: 0,
            scale: 0,
            duration: 0.3,
            ease: "back.out(2.2)",
            position: 0.55,
        });
        reveal(".godparents-section .section-title", { duration: 0.25, position: 0.6 });
        reveal(".godparents-section .godparents-names", { duration: 0.3, position: 0.65 });
        reveal(".quote-section .quote-icon", {
            y: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "back.out(2)",
            position: 0.7,
        });
        reveal(".quote-section .letter-quote", { duration: 0.3, position: 0.7 });
    }

    function setupRestSections() {
        const selector = [
            ".events-section",
            ".countdown-section",
            ".map-section",
            ".dress-code-section",
            ".rsvp-section",
            ".signature-section",
        ].join(", ");
        letter.querySelectorAll(selector).forEach(setupSection);
    }

    function setupSection(section) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 95%",
                toggleActions: "play none none none",
            },
        });
        const reveal = makeReveal(section, tl, {
            position: ">-0.1",
            duration: 0.3,
            stagger: 0.05,
        });

        if (section.classList.contains("events-section")) {
            reveal(".section-title", { duration: 0.25, position: 0 });
        } else if (section.classList.contains("countdown-section")) {
            reveal(".countdown-date", { duration: 0.3, position: 0 });
            reveal(".section-title", { duration: 0.25 });
            reveal(".countdown-item", { y: 16, duration: 0.3, stagger: 0.05 });
        } else if (section.classList.contains("map-section")) {
            reveal(".section-title", { duration: 0.25, position: 0 });
            reveal(".map-place", { duration: 0.3 });
            reveal(".map-address", { duration: 0.3 });
            reveal(".map-frame", { duration: 0.4 });
        } else if (section.classList.contains("dress-code-section")) {
            reveal(".section-title", { duration: 0.25, position: 0 });
            reveal(".ink-body", { duration: 0.3 });
            reveal(".dress-palette span", {
                y: 10,
                scale: 0.4,
                duration: 0.3,
                ease: "back.out(2)",
                stagger: 0.04,
            });
        } else if (section.classList.contains("rsvp-section")) {
            reveal(".section-title", { duration: 0.25, position: 0 });
            reveal(".ink-body", { duration: 0.3 });
            reveal(".rsvp-button", {
                y: 14,
                scale: 0.92,
                duration: 0.35,
                ease: "back.out(1.6)",
            });
        } else if (section.classList.contains("signature-section")) {
            reveal(".letter-ornament", { y: 10, duration: 0.25, position: 0 });
            splitChars(
                section.querySelector(".letter-signature"),
                tl,
                {
                    x: 30,
                    opacity: 0,
                    duration: 0.25,
                    stagger: 0.015,
                    ease: "power3.out",
                },
                ">-0.05",
            );
            reveal(".letter-date", { duration: 0.3 });
        }
    }

    function initTimelineAnimation() {
        const timeline = document.querySelector("#letter .timeline");
        if (!timeline) return;
        const line = timeline.querySelector(".timeline-line");
        const items = gsap.utils.toArray(timeline.querySelectorAll(".timeline-item"));
        if (!items.length) return;

        gsap.set(line, { scaleY: 0 });
        items.forEach((item) => {
            gsap.set(item, { y: 24, opacity: 0 });
            gsap.set(item.querySelector(".timeline-node"), {
                scale: 0,
                opacity: 0,
            });
            const ring = item.querySelector(".timeline-node-ring");
            if (ring) gsap.set(ring, { scale: 0.6, opacity: 0 });
        });

        gsap.to(line, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: items[0],
                start: "top 95%",
                endTrigger: items[items.length - 1],
                end: "bottom 75%",
                scrub: true,
            },
        });

        items.forEach((item) => {
            const node = item.querySelector(".timeline-node");
            const ring = item.querySelector(".timeline-node-ring");
            const itemTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
            });
            itemTl
                .to(item, {
                    y: 0,
                    opacity: 1,
                    duration: 0.35,
                    ease: "power3.out",
                })
                .to(
                    node,
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: "back.out(2.2)",
                    },
                    "-=0.15",
                );
            if (ring) {
                itemTl
                    .to(
                        ring,
                        {
                            scale: 1.4,
                            opacity: 0.7,
                            duration: 0.4,
                            ease: "power2.out",
                        },
                        "-=0.25",
                    )
                    .to(
                        ring,
                        {
                            opacity: 0,
                            duration: 0.3,
                            ease: "power2.out",
                        },
                        "-=0.2",
                    );
            }
        });
    }

}

function initHearts() {
    const canvas = document.getElementById("hearts");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const COLORS = [
        "#7a2435",
        "#a85565",
        "#c97a8e",
        "#d9a3ad",
        "#b08589",
        "#e8c4ca",
    ];
    const COUNT = mobileDevices ? 22 : 45;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let petals = [];
    let rafId = null;
    let last = performance.now();

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    const SPARKLE_COLORS = ["#f7e6b8", "#fff4d6", "#ead9a8", "#ffffff"];

    function makeParticle(fromTop = false) {
        const type = Math.random() < 0.35 ? "heart" : "sparkle";
        const isSparkle = type === "sparkle";
        const size = isSparkle ? rand(4, 10) : rand(10, 22);
        const palette = isSparkle ? SPARKLE_COLORS : COLORS;
        return {
            type,
            x: rand(0, width),
            y: fromTop ? rand(-height, 0) : rand(0, height),
            size,
            color: palette[Math.floor(Math.random() * palette.length)],
            speedY: isSparkle ? rand(20, 45) : rand(20, 50),
            drift: rand(10, 30),
            driftPhase: rand(0, Math.PI * 2),
            driftFreq: rand(0.5, 1.2),
            baseRotation: isSparkle ? rand(0, Math.PI / 4) : rand(-0.3, 0.3),
            swayAmp: rand(0.15, 0.35),
            swayPhase: rand(0, Math.PI * 2),
            swayFreq: rand(0.6, 1.4),
            rotation: 0,
            opacity: isSparkle ? rand(0.4, 0.8) : rand(0.08, 0.22),
            twinklePhase: rand(0, Math.PI * 2),
            twinkleFreq: rand(1.5, 3),
        };
    }

    function spawn() {
        petals = [];
        for (let i = 0; i < COUNT; i++) petals.push(makeParticle(false));
    }

    function drawHeart(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        const s = p.size;

        const grad = ctx.createRadialGradient(
            -s * 0.25, -s * 0.3, 0,
            0, 0, s
        );
        grad.addColorStop(0, shade(p.color, 40));
        grad.addColorStop(0.55, p.color);
        grad.addColorStop(1, shade(p.color, -30));

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.85);
        ctx.bezierCurveTo(
            -s * 1.1, s * 0.15,
            -s * 0.9, -s * 0.75,
            0, -s * 0.25
        );
        ctx.bezierCurveTo(
            s * 0.9, -s * 0.75,
            s * 1.1, s * 0.15,
            0, s * 0.85
        );
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function drawSparkle(p) {
        const twinkle = 0.75 + 0.25 * Math.sin(p.twinklePhase);
        const alpha = p.opacity * twinkle;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;

        const s = p.size;
        const long = s * 1.6;
        const short = s * 0.25;

        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2);
        glow.addColorStop(0, p.color);
        glow.addColorStop(0.4, p.color + "00");
        glow.addColorStop(1, p.color + "00");
        ctx.globalAlpha = alpha * 0.35;
        ctx.fillStyle = glow;
        ctx.fillRect(-s * 2, -s * 2, s * 4, s * 4);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -long);
        ctx.quadraticCurveTo(short, 0, long, 0);
        ctx.quadraticCurveTo(short, 0, 0, long);
        ctx.quadraticCurveTo(-short, 0, -long, 0);
        ctx.quadraticCurveTo(-short, 0, 0, -long);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function shade(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + percent));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
        const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
        return `rgb(${r}, ${g}, ${b})`;
    }

    function tick(now) {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        ctx.clearRect(0, 0, width, height);

        for (const p of petals) {
            p.y += p.speedY * dt;
            p.driftPhase += p.driftFreq * dt;
            p.x += Math.sin(p.driftPhase) * p.drift * dt;
            p.swayPhase += p.swayFreq * dt;
            p.rotation = p.baseRotation + Math.sin(p.swayPhase) * p.swayAmp;
            if (p.type === "sparkle") {
                p.twinklePhase += p.twinkleFreq * dt;
            }

            if (p.y - p.size > height) {
                Object.assign(p, makeParticle(true));
                p.y = -p.size;
            }
            if (p.x < -p.size) p.x = width + p.size;
            if (p.x > width + p.size) p.x = -p.size;

            if (p.type === "sparkle") drawSparkle(p);
            else drawHeart(p);
        }

        rafId = requestAnimationFrame(tick);
    }

    function start() {
        if (rafId) cancelAnimationFrame(rafId);
        last = performance.now();
        rafId = requestAnimationFrame(tick);
    }

    resize();
    spawn();
    start();

    let lastWidth = width;
    let resizeTimer = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const widthChanged = Math.abs(window.innerWidth - lastWidth) > 4;
            resize();
            if (widthChanged) {
                lastWidth = width;
                spawn();
            }
        }, 150);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!rafId) {
            start();
        }
    });
}

function initCountdown() {
    const units = [
        { key: "days", label: "Zile", ms: 1000 * 60 * 60 * 24 },
        { key: "hours", label: "Ore", ms: 1000 * 60 * 60 },
        { key: "minutes", label: "Minute", ms: 1000 * 60 },
        { key: "seconds", label: "Secunde", ms: 1000 },
    ];

    document.querySelectorAll("[data-targetdate]").forEach((element) => {
        const target = new Date(element.dataset.targetdate);
        if (isNaN(target.getTime())) return;

        element.innerHTML = units
            .map(
                (u) => `
                <div class="countdown-item">
                    <span class="countdown-value" data-key="${u.key}">00</span>
                    <span class="countdown-label">${u.label}</span>
                </div>
            `,
            )
            .join("");

        const refs = {};
        units.forEach((u) => {
            refs[u.key] = element.querySelector(`[data-key="${u.key}"]`);
        });

        function update() {
            const diff = target - new Date();
            if (diff <= 0) {
                units.forEach((u) => (refs[u.key].textContent = "00"));
                clearInterval(intervalId);
                return;
            }
            let remaining = diff;
            units.forEach((u) => {
                const value = Math.floor(remaining / u.ms);
                remaining -= value * u.ms;
                refs[u.key].textContent = String(value).padStart(2, "0");
            });
        }

        update();
        const intervalId = setInterval(update, 1000);
    });
}

function initLazyImagesRefresh() {
    const lazyImgs = document.querySelectorAll("img[loading='lazy']");
    if (!lazyImgs.length) return;
    let loaded = 0;
    const check = () => {
        if (++loaded === lazyImgs.length) ScrollTrigger.refresh();
    };
    lazyImgs.forEach((img) => {
        if (img.complete) check();
        else {
            img.addEventListener("load", check, { once: true });
            img.addEventListener("error", check, { once: true });
        }
    });
}
