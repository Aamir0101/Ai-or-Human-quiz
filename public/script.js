const questions = [
  {
    image:   'https://imaginewithrashid.com/wp-content/uploads/2023/12/21-prompts-to-generate-landscape-images-using-Ai.webp',
    answer:  'ai',
    caption: 'Oil painting — Vienna, 1890s'
  },
  {
    image:   'https://static.getimg.ai/media/67ee45d94bff9cef228cb4e4_img-ApM33oHjm0KCnmuDvzN0h-600x600.webp',
    answer:  'ai',
    caption: 'Digital render, 2023'
  },
  {
    image:   'https://insider.si.edu/wp-content/uploads/2017/04/87500673_7cec21f38a_b-630x473.jpg',
    answer:  'human',
    caption: 'Acrylic on canvas, contemporary'
  },
  {
    image:   'https://static.boredpanda.com/blog/wp-content/uploads/2023/02/Screenshot-2023-01-24-34902-PM-63e32447168d1-png__700.jpg',
    answer:  'ai',
    caption: 'Diffusion model output, 2024'
  },
  {
    image:   'https://preview.redd.it/ai-generated-food-is-my-new-favorite-thing-v0-53wmktyon5ua1.jpg?width=1024&format=pjpg&auto=webp&s=726f985faf237c3f676d827527d0eab3d2c2ffe1',
    answer:  'ai',
    caption: 'Watercolour landscape, 2018'
  },
  {
    image:   'https://www.lancasterconservancy.org/wp-content/uploads/2023/08/Indigo-Bunting-9438.jpg',
    answer:  'human',
    caption: 'Generative model, 2023'
  },
  {
    image:   'https://images.squarespace-cdn.com/content/v1/57e49a19414fb5b5169a9161/1489529893849-QXB64WGP4I7F9J74G4W0/%28TR%29HeroMFBlack_MG_1168MDF%281244%29FINAL_WEB.jpg',
    answer:  'human',
    caption: 'Street photography, NYC'
  },
  {
    image:   'https://www.evoindia.com/evoindia/2020-03/ec4f9ec9-b313-4952-a502-143f0202cfc5/Koenigsegg_Jesko_Absolut_3.jpg',
    answer:  'human',
    caption: 'Text-to-image synthesis, 2024'
  },
  {
    image:   'https://scontent.fdel27-4.fna.fbcdn.net/v/t39.30808-6/517174805_10231172070992904_321281493019339991_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e06c5d&_nc_ohc=VGkDxDFGLs0Q7kNvwHQ4JdC&_nc_oc=Adq8cFFVatzrs4cwW8Y-IsJDK9365yNq4BbK2DE7KerVnk496elLz1Jnvq-prAuaDbc&_nc_zt=23&_nc_ht=scontent.fdel27-4.fna&_nc_gid=R1pwBuP-mMO2XuWZFjqpdA&oh=00_Af1AFdbdG-zjerCusJBsCsLFb_6e1WPkTqOJu9hKcRD_gw&oe=69F0F9A8',
    answer:  'ai',
    caption: 'Charcoal illustration, 2015'
  },
  {
    image:   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg/500px-Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg',
    answer:  'human',
    caption: 'Neural style transfer, 2023'
  }
];

// /* ── Shuffle (Fisher-Yates) ── */
// function shuffle(arr) {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

/* ── State ── */
// let shuffledQuestions = [];
let currentIndex = 0;
let score        = 0;
let answered     = false;

/* ── DOM refs (populated after DOMContentLoaded) ── */
let quizSection, resultsSection;
let quizImage, qCounter, progressFill, scorePill;
let btnHuman, btnAI;
let resultsScoreBig, resultsLabel;

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  quizSection    = document.getElementById('quiz-section');
  resultsSection = document.getElementById('results-section');
  quizImage      = document.getElementById('quiz-image');
  qCounter       = document.getElementById('q-counter');
  progressFill   = document.getElementById('progress-fill');
  scorePill      = document.getElementById('score-pill');
  btnHuman       = document.getElementById('btn-human');
  btnAI          = document.getElementById('btn-ai');
  resultsScoreBig = document.getElementById('results-score-big');
  resultsLabel   = document.getElementById('results-label');

  // Wire up buttons
  btnHuman.addEventListener('click', () => handleAnswer('human'));
  btnAI.addEventListener('click',    () => handleAnswer('ai'));

  // Restart button (results screen)
  document.getElementById('btn-restart')?.addEventListener('click', restartQuiz);

  // shuffledQuestions = shuffle(questions);
  loadQuestion(0);
});

/* ─────────────────────────────────────────────
   LOAD QUESTION
───────────────────────────────────────────── */
function loadQuestion(index) {
  // const q = shuffledQuestions[index];
  answered = false;

  // Reset button states
  [btnHuman, btnAI].forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'incorrect');
  });

  // Update counter
  qCounter.innerHTML = `Question <strong>${index + 1}</strong> / ${shuffledQuestions.length}`;

  // Update progress bar
  const pct = (index / shuffledQuestions.length) * 100;
  progressFill.style.width = `${pct}%`;

  // Update score
  scorePill.innerHTML = `Score <strong>${score}</strong>`;

  // Fade out → swap image → fade in
  quizImage.classList.add('loading');
  const img = new Image();
  img.onload = () => {
    quizImage.src = q.image;
    quizImage.alt = q.caption || 'Quiz image';
    setTimeout(() => quizImage.classList.remove('loading'), 50);
  };
  img.onerror = () => {
    quizImage.src = `https://picsum.photos/seed/${index + 10}/800/600`;
    setTimeout(() => quizImage.classList.remove('loading'), 50);
  };
  img.src = q.image;
}

/* ─────────────────────────────────────────────
   HANDLE ANSWER
───────────────────────────────────────────── */
function handleAnswer(choice) {
  if (answered) return;
  answered = true;

  const correct = shuffledQuestions[currentIndex].answer;
  const isRight = choice === correct;

  if (isRight) score++;

  // Visual feedback on clicked button
  const clickedBtn = choice === 'human' ? btnHuman : btnAI;
  clickedBtn.classList.add(isRight ? 'correct' : 'incorrect');

  // If wrong, also show which was right
  if (!isRight) {
    const rightBtn = correct === 'human' ? btnHuman : btnAI;
    rightBtn.classList.add('correct');
  }

  // Disable both buttons
  btnHuman.disabled = true;
  btnAI.disabled    = true;

  // Advance after 1.4 s
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < shuffledQuestions.length) {
      loadQuestion(currentIndex);
    } else {
      showResults();
    }
  }, 1400);
}

/* ─────────────────────────────────────────────
   SHOW RESULTS
───────────────────────────────────────────── */
function showResults() {
  // Complete progress bar
  progressFill.style.width = '100%';

  quizSection.style.display    = 'none';
  resultsSection.style.display = 'flex';
  resultsSection.classList.add('show');

  // Score display
  resultsScoreBig.textContent = `${score}/${shuffledQuestions.length}`;

  // Flavour label
  const pct = (score / shuffledQuestions.length) * 100;
  let label = '';
  if (pct === 100)      label = "Perfect score! You can't be fooled. 🧠";
  else if (pct >= 80)   label = "Sharp eye — nearly flawless.";
  else if (pct >= 60)   label = "Not bad, but AI is getting sneaky.";
  else if (pct >= 40)   label = "The machines had you second-guessing.";
  else                  label = "The AI won this round. Study up!";

  resultsLabel.textContent = label;

  // Update results emoji
  const emoji = document.getElementById('results-emoji');
  if (emoji) emoji.textContent = pct >= 70 ? '🏆' : pct >= 40 ? '🤔' : '🤖';
}

/* ─────────────────────────────────────────────
   RESTART
───────────────────────────────────────────── */
function restartQuiz() {
  currentIndex = 0;
  score        = 0;

  resultsSection.style.display = 'none';
  resultsSection.classList.remove('show');
  quizSection.style.display    = 'flex';

  shuffledQuestions = shuffle(questions);
  loadQuestion(0);
}
