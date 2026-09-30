/**
 * ===================================================================
 * ДАБЕРКРИМИПУ 2.0 — ОСНОВНОЙ СЦЕНАРИЙ (MAIN.JS)
 * ===================================================================
 * 1. Конфигурация сервера ДаберКримипу 2.0
 * 2. Копирование IP / данных подключения с Toast-уведомлением
 * 3. Динамическая подгрузка скриншотов из /assets/images/gallery/
 * 4. Полноэкранный Lightbox (модальное окно)
 * 5. Аккордеоны и живой поиск для страницы "Правила"
 * 6. Мобильное бургер-меню
 */

// ===================================================================
// 1. КОНФИГУРАЦИЯ СЕРВЕРА «ДАБЕРКРИМИПУ 2.0»
// ===================================================================
const SERVER_CONFIG = {
  // Название проекта
  serverName: "ДаберКримипу 2.0",
  serverSeason: "Вторая версия • Перерождение",

  // Метод подключения и IP/комната
  connectionType: "Porthole (Steam)",
  serverIP: "Код Porthole в Telegram",

  // Версия игры и ядро
  serverVersion: "26.2 (Fabric)",

  // Ссылки на официальные сообщества
  discordUrl: "https://discord.gg/kkFQBQvndr",
  telegramUrl: "https://t.me/+4mJLfKfZxhpmYTU8",

  // Ссылка на Google Диск с модами, ресурспаками и текстовой инструкцией
  modpackDownloadUrl: "https://drive.google.com/file/d/18PqqBYFJ3Ffp7dJQg8Y49mitR_ToLpa6/view?usp=drive_link",

  // Ссылка на Porthole в Steam
  portholeSteamUrl: "https://store.steampowered.com/search/?term=Porthole",

  // Статичный онлайн для отображения
  defaultOnline: {
    current: 5,
    max: 20
  }
};

// ===================================================================
// 2. СПИСОК СКРИНШОТОВ ДЛЯ ГАЛЕРЕИ СЕРВЕРА
// ===================================================================
// Скриншоты лежат в папке /assets/images/gallery/
const GALLERY_ITEMS = [
  {
    id: 1,
    fileName: 'screenshot1.jpg',
    title: 'Закатный проспект',
    category: 'landscape',
    categoryName: 'Пейзажи',
    description: 'Живописная аллея и дорога в лучах заката с шейдерами нового мира ДаберКримипу 2.0.'
  },
  {
    id: 2,
    fileName: 'screenshot2.jpg',
    title: 'Горный аванпост и стоянка',
    category: 'builds',
    categoryName: 'Постройки',
    description: 'Уютная база среди отвесных скал и хвойного леса со стоянкой для транспорта.'
  },
  {
    id: 3,
    fileName: 'screenshot3.jpg',
    title: '«Убегайте, это ловушка!»',
    category: 'events',
    categoryName: 'Ивенты',
    description: 'Легендарный момент: штурм, засада с оружием и взрывы. Море веселья и эмоций!'
  },
  {
    id: 4,
    fileName: 'screenshot4.jpg',
    title: 'Генплан столицы с высоты птичьего полета',
    category: 'builds',
    categoryName: 'Постройки',
    description: 'Сферическая панорама котловины: разметка будущих районов, улиц и границ нового мегаполиса.'
  },
  {
    id: 5,
    fileName: 'screenshot5.jpg',
    title: 'Ночной микрорайон',
    category: 'builds',
    categoryName: 'Постройки',
    description: 'Уютные кирпичные дома, асфальтированные улицы и освещённые аллеи в тишине звёздной ночи.'
  },
  {
    id: 6,
    fileName: 'screenshot6.jpg',
    title: 'Прибрежная усадьба на рассвете',
    category: 'landscape',
    categoryName: 'Пейзажи',
    description: 'Живописный деревянный домик у воды с причалом в лучах утреннего солнца и чистой глади озера.'
  },
{
    id: 7,
    fileName: 'screenshot7.jpg',
    title: 'Выезд из города',
    category: 'memes',
    categoryName: 'Мемы',
    description: 'Солнечная дорога с дорожным знаком «Конец населённого пункта», а ну и ещё админ повесился.'
  },
  {
    id: 8,
    fileName: 'screenshot8.jpg',
    title: 'Подземный паркинг',
    category: 'memes',
    categoryName: 'Мемы',
    description: 'Тёмное подземное помещение со стенками из кирпича, разметкой парковочных мест и игроком uflyyy с киркой в руках ломающим хуй на парковке.'
  },
  {
    id: 9,
    fileName: 'screenshot9.jpg',
    title: 'Тюремная камера',
    category: 'builds',
    categoryName: 'Постройки',
    description: 'Камера с каменными стенами, раковиной, туалетом и решётчатой дверью, за которой видны зеки.'
  },
];

// ===================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ===================================================================

/**
 * Определяет корректный относительный путь к assets
 */
function getBasePath() {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/')) {
    return '../';
  }
  return './';
}

/**
 * Всплывающее уведомление (Toast)
 */
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  
  const icon = type === 'success' ? '✓' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${message}</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

/**
 * Копирование текста в буфер обмена
 */
async function copyToClipboard(text, successMessage = 'Скопировано в буфер обмена!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast(successMessage);
  } catch (err) {
    console.error('Ошибка при копировании:', err);
    showToast('Скопируйте вручную: ' + text);
  }
}

// ===================================================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initServerData();
  initCopyButtons();
  initRulesAccordion();
  initGallery();
});

// ===================================================================
// НАВБАР И СКРОЛЛ
// ===================================================================
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
      });
    });
  }
}

// ===================================================================
// ДАННЫЕ СЕРВЕРА
// ===================================================================
function initServerData() {
  document.querySelectorAll('.data-server-name').forEach(el => {
    el.textContent = SERVER_CONFIG.serverName;
  });

  document.querySelectorAll('.data-server-ip').forEach(el => {
    el.textContent = SERVER_CONFIG.serverIP;
  });

  document.querySelectorAll('.data-server-version').forEach(el => {
    el.textContent = SERVER_CONFIG.serverVersion;
  });

  document.querySelectorAll('.data-connection-type').forEach(el => {
    el.textContent = SERVER_CONFIG.connectionType;
  });

  // Обновление ссылок Discord и Telegram
  document.querySelectorAll('.js-discord-link').forEach(el => {
    el.setAttribute('href', SERVER_CONFIG.discordUrl);
  });

  document.querySelectorAll('.js-telegram-link').forEach(el => {
    el.setAttribute('href', SERVER_CONFIG.telegramUrl);
  });

  document.querySelectorAll('.js-modpack-link').forEach(el => {
    el.setAttribute('href', SERVER_CONFIG.modpackDownloadUrl);
  });

  const onlineCountEl = document.querySelector('.data-online-count');
  const maxOnlineEl = document.querySelector('.data-max-online');

  if (onlineCountEl && maxOnlineEl) {
    onlineCountEl.textContent = SERVER_CONFIG.defaultOnline.current;
    maxOnlineEl.textContent = SERVER_CONFIG.defaultOnline.max;
  }
}

// ===================================================================
// КНОПКИ КОПИРОВАНИЯ
// ===================================================================
function initCopyButtons() {
  const heroCopyBox = document.querySelector('.js-copy-ip-box');
  if (heroCopyBox) {
    heroCopyBox.addEventListener('click', () => {
      copyToClipboard(
        SERVER_CONFIG.telegramUrl,
        `Ссылка на Telegram скопирована! Код от Porthole и данные сервера — в закрепе Telegram канала!`
      );
    });
  }

  document.querySelectorAll('[data-copy-ip]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(
        SERVER_CONFIG.telegramUrl,
        `Ссылка на Telegram канал скопирована! Код Porthole находится в закрепе.`
      );
    });
  });
}

// ===================================================================
// АККОРДЕОН ПРАВИЛ И ПОИСК
// ===================================================================
function initRulesAccordion() {
  const accordionItems = document.querySelectorAll('.rule-accordion-item');
  const searchInput = document.querySelector('.rules-search-input');
  const categoryTabs = document.querySelectorAll('.category-tab');

  if (accordionItems.length === 0) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.rule-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      item.classList.toggle('active', !isActive);
    });
  });

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterRules();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterRules();
    });
  }

  function filterRules() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.category-tab.active');
    const selectedCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';

    accordionItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const text = item.textContent.toLowerCase();

      const matchesCategory = (selectedCategory === 'all' || itemCategory === selectedCategory);
      const matchesSearch = (!query || text.includes(query));

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
}

// ===================================================================
// ДИНАМИЧЕСКАЯ ГАЛЕРЕЯ И LIGHTBOX
// ===================================================================
let currentLightboxIndex = 0;
let currentVisibleImages = [];

function initGallery() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  const basePath = getBasePath();
  const galleryFolder = `${basePath}assets/images/gallery/`;

  currentVisibleImages = GALLERY_ITEMS.map((item, index) => ({
    ...item,
    id: index,
    fullSrc: `${galleryFolder}${item.fileName}`
  }));

  renderGallery(currentVisibleImages);
  setupGalleryFilters();
  setupLightbox();
}

function renderGallery(items) {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';

  if (items.length === 0) {
    galleryGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        В этой категории пока нет скриншотов.
      </div>
    `;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-index', index);

    card.innerHTML = `
      <img src="${item.fullSrc}" alt="${item.title}" class="gallery-thumb" loading="lazy" />
      <div class="gallery-overlay">
        <div class="gallery-meta">
          <span class="gallery-tag"># ${item.categoryName}</span>
          <h3 class="gallery-caption">${item.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">${item.description || ''}</p>
        </div>
      </div>
      <div class="gallery-zoom-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
        </svg>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(index);
    });

    galleryGrid.appendChild(card);
  });
}

function setupGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter .filter-btn');
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const basePath = getBasePath();
      const galleryFolder = `${basePath}assets/images/gallery/`;

      if (filter === 'all') {
        currentVisibleImages = GALLERY_ITEMS.map((item, index) => ({
          ...item,
          id: index,
          fullSrc: `${galleryFolder}${item.fileName}`
        }));
      } else {
        currentVisibleImages = GALLERY_ITEMS
          .filter(item => item.category === filter)
          .map((item, index) => ({
            ...item,
            id: index,
            fullSrc: `${galleryFolder}${item.fileName}`
          }));
      }

      renderGallery(currentVisibleImages);
    });
  });
}

function setupLightbox() {
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <button class="lightbox-btn-close" aria-label="Закрыть">&times;</button>
      <div class="lightbox-container">
        <button class="lightbox-nav-btn lightbox-btn-prev" aria-label="Предыдущий">&#10094;</button>
        <button class="lightbox-nav-btn lightbox-btn-next" aria-label="Следующий">&#10095;</button>
        <div class="lightbox-image-wrapper">
          <img src="" alt="" class="lightbox-image" />
        </div>
        <div class="lightbox-caption-bar">
          <div>
            <div class="lightbox-caption-title"></div>
            <div class="lightbox-caption-desc" style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;"></div>
          </div>
          <span class="lightbox-counter"></span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = modal.querySelector('.lightbox-btn-close');
  const prevBtn = modal.querySelector('.lightbox-btn-prev');
  const nextBtn = modal.querySelector('.lightbox-btn-next');

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => changeLightboxImage(-1));
  nextBtn?.addEventListener('click', () => changeLightboxImage(1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightboxImage(-1);
    if (e.key === 'ArrowRight') changeLightboxImage(1);
  });
}

function openLightbox(index) {
  const modal = document.querySelector('.lightbox-modal');
  if (!modal || currentVisibleImages.length === 0) return;

  currentLightboxIndex = index;
  updateLightboxContent();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
  if (currentVisibleImages.length === 0) return;

  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = currentVisibleImages.length - 1;
  } else if (currentLightboxIndex >= currentVisibleImages.length) {
    currentLightboxIndex = 0;
  }

  updateLightboxContent();
}

function updateLightboxContent() {
  const modal = document.querySelector('.lightbox-modal');
  if (!modal) return;

  const item = currentVisibleImages[currentLightboxIndex];
  if (!item) return;

  const img = modal.querySelector('.lightbox-image');
  const title = modal.querySelector('.lightbox-caption-title');
  const desc = modal.querySelector('.lightbox-caption-desc');
  const counter = modal.querySelector('.lightbox-counter');

  if (img) {
    img.src = item.fullSrc;
    img.alt = item.title;
  }
  if (title) {
    title.textContent = item.title;
  }
  if (desc) {
    desc.textContent = item.description || '';
  }
  if (counter) {
    counter.textContent = `${currentLightboxIndex + 1} / ${currentVisibleImages.length}`;
  }
}
