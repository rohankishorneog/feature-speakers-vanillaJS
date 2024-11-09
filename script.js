const speakerData = {
  1: {
    name: "John Doe",
    role: "Cheif Marketing Officer",
    image: "assets/profile1.jpeg",
    company: "Acme Corp",
    description:
      "John Doe is a distinguished marketing executive with over 15 years of experience in building global brands. He has successfully led digital transformation initiatives at Fortune 500 companies and pioneered innovative marketing strategies that resulted in 300% growth in customer engagement. John is a regular speaker at MarketingWeek and has been featured in Forbes and Business Insider.",
  },
  2: {
    name: "Jane Smith",
    role: "Chief Engagement Officer",
    image: "assets/profile2.jpeg",
    company: "Tech Innovations",
    description:
      "Jane Smith is a renowned technology leader with a proven track record in scaling engineering teams and delivering cutting-edge solutions. She holds multiple patents in distributed systems and has been instrumental in developing Tech Innovations' flagship AI products. Jane previously led engineering teams at Google and Amazon, and she actively mentors women in tech through various initiatives.",
  },
  3: {
    name: "Bob Johnson",
    role: "Cheif Technical Developer",
    image: "assets/profile3.jpeg",
    company: "Pantheon",
    description:
      "Bob Johnson is a pioneer in artificial intelligence with a PhD from MIT. He has published over 30 papers in top-tier AI conferences and journals. His groundbreaking work in natural language processing has been adopted by leading tech companies worldwide. Bob leads a team of 50+ researchers and has been recognized with the prestigious Turing Award for his contributions to machine learning.",
  },
  4: {
    name: "Sarah Williams",
    role: "Chief Marketing Officer",
    image: "assets/profile4.jpeg",
    company: "Specbee",
    description:
      "Sarah Williams is a visionary technology leader with expertise in blockchain, Web3, and emerging technologies. She has successfully launched three tech startups and holds advisory positions at several blockchain foundations. Sarah's work on distributed systems has revolutionized supply chain management, and she frequently contributes to technology policy discussions at the World Economic Forum.",
  },
};

// Function to generate speaker cards
function generateSpeakerCards() {
  const track = document.querySelector(".slider__track");
  console.log(track);

  Object.entries(speakerData).forEach(([id, speaker]) => {
    const card = document.createElement("div");
    card.className = "slider__card";
    card.setAttribute("data-id", id);
    card.setAttribute("aria-label", `View details for ${speaker.name}`);
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <img
        src="${speaker.image}"
        alt="${speaker.name}"
        class="slider__card__image"
      />
      <h3 class="slider__card__name">${speaker.name}</h3>
      <h5 class="slider__card__role">${speaker.role}</h5>
      <p class="slider__card__company">${speaker.company}</p>
    `;

    card.addEventListener("click", () => openSpeakerDetails(id));

    track.appendChild(card);
  });
}

class Slider {
  constructor() {
    this.currentIndex = 0;
    this.track = document.querySelector(".slider__track");
    this.cards = Array.from(document.querySelectorAll(".slider__card"));
    this.prevBtn = document.querySelector(".slider-nav--prev");
    this.nextBtn = document.querySelector(".slider-nav--next");

    this.updateDimensions();

    this.init();

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
  }

  updateDimensions() {
    this.cardWidth = this.cards[0].offsetWidth;
    this.cardsPerView =
      window.innerWidth <= 768
        ? 1
        : window.innerWidth <= 1024
        ? 2
        : window.innerWidth <= 1440
        ? 3
        : 4;

    const gap = 20;
    this.totalWidth = this.cards.length * (this.cardWidth + gap) - gap;

    // Calculate maximum scroll position
    const viewportWidth = this.cardsPerView * (this.cardWidth + gap) - gap;
    this.maxScroll = Math.max(0, this.totalWidth - viewportWidth);

    // Update maxIndex based on actual scroll positions
    this.maxIndex = Math.ceil(this.maxScroll / (this.cardWidth + gap));
  }

  init() {
    this.updateButtons();

    this.prevBtn.addEventListener("click", () => this.slide("prev"));
    this.nextBtn.addEventListener("click", () => this.slide("next"));

    // Adding touch support
    let startX, currentX;
    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      this.track.style.transition = "none";
    });

    this.track.addEventListener("touchmove", (e) => {
      if (!startX) return;
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      const currentOffset = this.currentIndex * (this.cardWidth + 20);
      const newOffset = currentOffset + diff;

      if (newOffset >= 0 && newOffset <= this.maxScroll) {
        this.track.style.transform = `translateX(-${newOffset}px)`;
      }
    });

    this.track.addEventListener("touchend", (e) => {
      if (!startX || !currentX) return;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        // minimum swipe distance
        if (diff > 0 && this.currentIndex < this.maxIndex) {
          this.slide("next");
        } else if (diff < 0 && this.currentIndex > 0) {
          this.slide("prev");
        }
      } else {
        this.updateSliderPosition(true);
      }

      startX = null;
      currentX = null;
      this.track.style.transition = "";
    });
  }

  handleResize() {
    this.updateDimensions();

    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);

    this.updateSliderPosition(false);
    this.updateButtons();
  }

  slide(direction) {
    if (direction === "prev" && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === "next" && this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }

    this.updateSliderPosition(true);
    this.updateButtons();
  }

  updateSliderPosition(animate = true) {
    const gap = 20;
    const offset = this.currentIndex * (this.cardWidth + gap);

    if (!animate) {
      this.track.style.transition = "none";
    } else {
      this.track.style.transition = "transform 0.3s ease-out";
    }

    // Ensureing we don't scroll beyond the maximum scroll position
    const finalOffset = Math.min(offset, this.maxScroll);
    this.track.style.transform = `translateX(-${finalOffset}px)`;

    // Force reflow to ensure transition is applied
    if (!animate) {
      this.track.offsetHeight;
      this.track.style.transition = "";
    }
  }

  updateButtons() {
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

    this.prevBtn.style.visibility =
      this.currentIndex === 0 ? "hidden" : "visible";
    this.nextBtn.style.visibility =
      this.currentIndex >= this.maxIndex ? "hidden" : "visible";
  }
}

function openSpeakerDetails(speakerId) {
  const speakerDetails = document.getElementById("speakerDetails");
  const speaker = speakerData[speakerId];

  // Update speaker details content
  speakerDetails.querySelector(".speaker-details__image").src =
    document.querySelector(`[data-id="${speakerId}"] .slider__card__image`).src;
  speakerDetails.querySelector(".speaker-details__info__name").textContent =
    speaker.name;
  speakerDetails.querySelector(".speaker-details__info__role").textContent =
    speaker.role;
  speakerDetails.querySelector(".speaker-details__info__company").textContent =
    speaker.company;
  speakerDetails.querySelector(".speaker-details__description").textContent =
    speaker.description;

  speakerDetails.style.display = "block";
}

function closeSpeakerDetails() {
  const speakerDetails = document.getElementById("speakerDetails");
  speakerDetails.style.display = "none";
}

// Initialize slider and load the cards when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  generateSpeakerCards();
  const slider = new Slider();
});

// Event listeners for speaker cards
document.querySelectorAll(".slider__card").forEach((card) => {
  card.addEventListener("click", () => {
    const speakerId = card.getAttribute("data-id");
    openSpeakerDetails(speakerId);
  });
});
