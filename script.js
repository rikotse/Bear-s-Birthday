/*
  Cleaned & robust version of script.js
  - Wraps logic in DOMContentLoaded
  - Guards DOM queries (no errors if elements are missing)
  - Uses small helpers and constants
  - Keeps original behaviors (music toggle, floating hearts, reasons accordion,
    verses carousel, hearts mini-game, sparkles, wishes + reveal on scroll)
*/

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Small helpers
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ----------------------
  // Background music toggle
  // ----------------------
  const bgMusic = $("#bgMusic");
  const playBtn = $("#playBtn");

  if (bgMusic && playBtn) {
    playBtn.addEventListener("click", async () => {
      try {
        if (bgMusic.paused) {
          // Some browsers require a user gesture; handle promise
          await bgMusic.play();
          playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
          bgMusic.pause();
          playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
      } catch (err) {
        // Play may be blocked; keep UI consistent and log for debugging
        console.warn("Audio play/pause failed:", err);
      }
    });
  }

  // ----------------------
  // Floating hearts (hero)
  // ----------------------
  const floatingHeartsContainer = $("#floatingHearts");
  if (floatingHeartsContainer) {
    const HEART_COUNT = 15;
    for (let i = 0; i < HEART_COUNT; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";

      // Use percentages so layout/resizing doesn't produce NaN positions
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 4;

      heart.style.left = `${left}%`;
      heart.style.top = `${top}%`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.animationDuration = `${duration}s`;

      floatingHeartsContainer.appendChild(heart);
    }
  }

  // ----------------------
  // 26 Reasons (accordion)
  // ----------------------
  const reasonsContainer = $("#reasonsContainer");
  const reasons = [
    "Because you became my light during a very dark period of my life. 🌟",
    "Because you're my safe place. 🏠",
    "Because you challenge me to be better. 💫",
    "Because of your kind and caring heart. 💖",
    "Because you're incredibly handsome. 😍",
    "Because you're my biggest supporter. 📣",
    "Because you make me laugh with your wack jokes. 😹",
    "Because your presence on it's own is enough to comfort me when I'm feeling low. 🤗",
    "Because somehow you manage to get on my very last nerve and then still be able to make all that frustration melt away. 🥲",
    "Because you're so thoughtful and considerate (but only when you want to be...👀). 💭",
    "Because you're strong yet so gentle. 🦁",
    "Because you literally opened me up to a world adventure that I did not know existed. 🤯",
    "Because you were My First in so many ways. 🥹",
    "Because you're my man. 😁",
    "Because you handle the inner child in me with love. 😊",
    "Because you're the best listener. 👂",
    "Because you make me happy. 🙃",
    "Because you when I'm with you ordinary moments feel magical. ✨",
    "Because you're my answered prayer. 🙏",
    "Because you have the most beautiful soul. 💫",
    "Because you love me even though you've seen my ugly parts. 💕",
    "Because you're my favorite person to talk to. 💬",
    "Because you make me feel loved and protected when I'm with you. 💝",
    "Because you're an incredible leader. 👑",
    "Because you're the father of my children. 💑",
    "Because you're the love of my life. ❤️",
  ];

  if (reasonsContainer) {
    reasons.forEach((reasonText, index) => {
      const reasonCard = document.createElement("div");
      reasonCard.className = "reason-card";

      reasonCard.innerHTML = `
        <div class="reason-header">
          <span>Reason ${index + 1}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="reason-content">
          <p>${reasonText}</p>
        </div>
      `;

      // Toggle only when header is clicked (better UX)
      const header = reasonCard.querySelector(".reason-header");
      if (header) {
        header.addEventListener("click", () =>
          reasonCard.classList.toggle("active")
        );
      } else {
        reasonCard.addEventListener("click", () =>
          reasonCard.classList.toggle("active")
        );
      }

      reasonsContainer.appendChild(reasonCard);
    });
  }

  // ----------------------
  // Bible verses carousel
  // ----------------------
  const verses = $$(".verse");
  const dots = $$(".verse-dot");
  let currentVerse = 0;

  function showVerse(index) {
    if (!verses.length) return;
    // Normalize index
    index = ((index % verses.length) + verses.length) % verses.length;
    verses.forEach((v) => v.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    verses[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
    currentVerse = index;
  }

  if (dots.length) {
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.index);
        if (!Number.isNaN(idx)) showVerse(idx);
      });
    });
  }

  // Auto-advance if there are verses
  if (verses.length) {
    showVerse(0);
    setInterval(() => showVerse(currentVerse + 1), 5000);
  }

  // ----------------------
  // Hearts mini-game
  // ----------------------
  const gameContainer = $("#gameContainer");
  const counter = $("#counter");
  const unlockMessage = $("#unlockMessage");
  if (gameContainer && counter && unlockMessage) {
    const HEARTS_TOTAL = 26;
    let collected = 0;

    // Initialize counter text
    counter.textContent = `Hearts collected: ${collected} / ${HEARTS_TOTAL}`;

    for (let i = 0; i < HEARTS_TOTAL; i++) {
      const heart = document.createElement("div");
      heart.className = "game-heart";

      // Use percentages to avoid relying on offsetWidth/Height at load time
      const left = 5 + Math.random() * 90; // keep a margin
      const top = 5 + Math.random() * 90;
      heart.style.left = `${left}%`;
      heart.style.top = `${top}%`;

      heart.addEventListener("click", () => {
        if (heart.classList.contains("collected")) return;
        heart.classList.add("collected");
        collected += 1;
        counter.textContent = `Hearts collected: ${collected} / ${HEARTS_TOTAL}`;
        if (collected === HEARTS_TOTAL) {
          setTimeout(() => (unlockMessage.style.display = "block"), 500);
        }
      });

      gameContainer.appendChild(heart);
    }
  }

  // ----------------------
  // Sparkles animation
  // ----------------------
  const sparklesContainer = $("#sparklesContainer");
  if (sparklesContainer) {
    const SPARKLE_COUNT = 30;
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 2 + Math.random() * 3;
      sparkle.style.left = `${left}%`;
      sparkle.style.top = `${top}%`;
      sparkle.style.animationDelay = `${delay}s`;
      sparkle.style.animationDuration = `${duration}s`;
      sparklesContainer.appendChild(sparkle);
    }
  }

  // ----------------------
  // Wishes (cards + reveal on scroll)
  // ----------------------
  const wishes = [
    "I wish for your faith to grow stronger each day.",
    "I wish for you peace that surpasses understanding.",
    "I wish for you wisdom to lead with love.",
    "I wish for your heart to be filled with joy.",
    "I wish for you to always feel God's presence and hear His voice when He speaks.",
    "I wish for your dreams to flourish beyond anything you could have ever imagined.",
    "I wish for your health to be strong and enduring.",
    "I wish for your mind to be sharp, wise and creative.",
    "I wish for your spirit to be resilient in challenges.",
    "I wish for your laughter to echo through our home and every room you walk into.",
    "I wish for your kindness to touch many lives.",
    "I wish for your patience to bear many beautiful fruit.",
    "I wish for your generosity to be returned to you a hundredfold.",
    "I wish for your courage to face any obstacle that comes your way.",
    "I wish for your love to deepen with each passing year.",
    "I wish for your hope to never fade.",
    "I wish for your abundant success in all your endeavors.",
    "I wish for your friendships to be true, meaningful and lasting.",
    "I wish for your heart to always feel cherished.",
    "I wish for your soul to find rest in God's grace.",
    "I wish for your days to be filled with purpose and fulfillment.",
    "I wish for your nights to be peaceful and restorative.",
    "I wish for your voice to be heard, valued and respected.",
    "I wish for your presence to bring comfort to others (mostly me).",
    "I wish for your life to be a beautiful testimony.",
    "I wish for our love to grow stronger with each birthday.",
  ];

  const wishesContainer = $("#wishesContainer");
  if (wishesContainer) {
    wishes.forEach((wishText, idx) => {
      const wishCard = document.createElement("div");
      wishCard.className = "wish-card";
      wishCard.innerHTML = `
        <div class="wish-number">${idx + 1}</div>
        <p class="wish-text">${wishText}</p>
      `;
      wishesContainer.appendChild(wishCard);
    });
  }

  // Reveal on scroll (and initial cascade)
  const wishCards = $$(".wish-card");
  function checkVisibility() {
    if (!wishCards.length) return;
    const windowHeight = window.innerHeight;
    wishCards.forEach((card) => {
      const top = card.getBoundingClientRect().top;
      if (top < windowHeight - 100) card.classList.add("visible");
    });
  }

  checkVisibility();
  window.addEventListener("scroll", checkVisibility, { passive: true });

  // Cascading reveal for first few cards (works only if they exist)
  wishCards
    .slice(0, 6)
    .forEach((card, i) =>
      setTimeout(() => card.classList.add("visible"), 200 + i * 200)
    );
});
