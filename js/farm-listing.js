/**
 * CHEDI – Farm Listing Page (CSA category → 10 farms)
 */
(function () {
  'use strict';

  var FARM_CATEGORIES = {
    'farm-1': {
      id: 'farm-1',
      name: 'Farm 1',
      crop: 'Mullai',
      village: 'Periyakulam',
      district: 'Theni',
      tagline: 'Fresh crops. Direct from farm to your table.',
      banner: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=85',
      bannerLabel: 'Community Supported Agriculture'
    },
    'farm-2': {
      id: 'farm-2',
      name: 'Farm 2',
      crop: 'Kurinji',
      village: 'Kodaikanal',
      district: 'Dindigul',
      tagline: 'Hill-grown produce from the Western Ghats.',
      banner: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&q=85',
      bannerLabel: 'Kurinji Hill Farms'
    },
    'farm-3': {
      id: 'farm-3',
      name: 'Farm 3',
      crop: 'Neithal',
      village: 'Mudukulathur',
      district: 'Ramanathapuram',
      tagline: 'Coastal farms rooted in Tamil tradition.',
      banner: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=85',
      bannerLabel: 'Neithal Coastal Agriculture'
    },
    'farm-4': {
      id: 'farm-4',
      name: 'Farm 4',
      crop: 'Marudam',
      village: 'Natham',
      district: 'Dindigul',
      tagline: 'Fertile plains cultivated for generations.',
      banner: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1400&q=85',
      bannerLabel: 'Marudam Plains Farming'
    }
  };

  var LISTING_TEMPLATES = {
    'farm-1': [
      { name: 'Mullai Meadow Farm', village: 'Periyakulam', district: 'Theni', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/images/72991.jpg', available: true },
      { name: 'Periyakulam Greens', village: 'Bodi', district: 'Theni', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_1kwlgf1kwlgf1kwl.png' },
      { name: 'Theni Valley Harvest', village: 'Theni', district: 'Theni', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
      { name: 'Marutha Nadu Farm', village: 'Uthamapalayam', district: 'Theni', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80' },
      { name: 'Vaigai River Fields', village: 'Cumbum', district: 'Theni', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80' },
      { name: 'Silver Hills Organic', village: 'Chinnamanur', district: 'Theni', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_gcem5xgcem5xgcem.png' },
      { name: 'Chinnamanur Greens', village: 'Chinnamanur', district: 'Theni', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/1356.jpg' },
      { name: 'Bodinayakanur Fields', village: 'Bodinayakanur', district: 'Theni', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80' },
      { name: 'Uthamapalayam Farm', village: 'Uthamapalayam', district: 'Theni', image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&q=80' },
      { name: 'Cumbum Valley Plot', village: 'Cumbum', district: 'Theni', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' }
    ],
    'farm-2': [
      { name: 'Kurinji Heights Farm', village: 'Kodaikanal', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80' },
      { name: 'Kodaikanal Bloom Fields', village: 'Kodaikanal', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
      { name: 'Palani Hills Greens', village: 'Palani', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80' },
      { name: 'Mannavanur Meadows', village: 'Mannavanur', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80' },
      { name: 'Poombarai Valley Farm', village: 'Poombarai', district: 'Dindigul', image:'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/2148248872.jpg' },
      { name: 'Berijam Lake Fields', village: 'Berijam', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80' },
      { name: 'Vattakanal Organic', village: 'Vattakanal', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
      { name: 'Guna Caves Plot', village: 'Poombarai', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
      { name: 'Shenbaganur Hills Farm', village: 'Shenbaganur', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
      { name: "Dolphin's Nose Fields", village: 'Kodaikanal', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80' }
    ],
    'farm-3': [
      { name: 'Neithal Coastal Farm', village: 'Mudukulathur', district: 'Ramanathapuram', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80' },
      { name: 'Mandapam Shore Fields', village: 'Mandapam', district: 'Ramanathapuram', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_2j19m82j19m82j19.png' },
      { name: 'Rameswaram Greens', village: 'Rameswaram', district: 'Ramanathapuram', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80' },
      { name: 'Mudukulathur Organic', village: 'Mudukulathur', district: 'Ramanathapuram', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_9337ai9337ai9337.png' },
      { name: 'Devipattinam Farm', village: 'Devipattinam', district: 'Ramanathapuram', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80' },
      { name: 'Thondi Coastal Plot', village: 'Thondi', district: 'Ramanathapuram', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
      { name: 'Kilakarai Fields', village: 'Kilakarai', district: 'Ramanathapuram', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_dlpxzpdlpxzpdlpx.png' },
      { name: 'Pamban Island Farm', village: 'Pamban', district: 'Ramanathapuram', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_te2c66te2c66te2c.png' },
      { name: 'Karaikudi Neithal', village: 'Karaikudi', district: 'Sivaganga', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80' },
      { name: 'Chidambaram Coastal', village: 'Chidambaram', district: 'Cuddalore', image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&q=80' }
    ],
    'farm-4': [
      { name: 'Marudam Plains Farm', village: 'Natham', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80' },
      { name: 'Natham Valley Fields', village: 'Natham', district: 'Dindigul', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_s691d0s691d0s691.png' },
      { name: 'Athoor Organic Plot', village: 'Athoor', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80' },
      { name: 'Oddanchatram Greens', village: 'Oddanchatram', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' },
      { name: 'Vedasandur Farm', village: 'Vedasandur', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80' },
      { name: 'Sirumalai Hills Fields', village: 'Sirumalai', district: 'Dindigul', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_lyfkk9lyfkk9lyfk.png' },
      { name: 'Kodaikanal Road Farm', village: 'Batlagundu', district: 'Dindigul', image: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_2j19m82j19m82j19.png' },
      { name: 'Reddiarchatram Plot', village: 'Reddiarchatram', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80' },
      { name: 'Sembatti Meadows', village: 'Sembatti', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&q=80' },
      { name: 'Thadikombu Valley Farm', village: 'Thadikombu', district: 'Dindigul', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80' }
    ]
  };

  var DEFAULT_FARM_LOCATION = {
    village: 'Panavayal',
    district: 'Sivaganga',
    state: 'Tamil Nadu'
  };

  var PLOT_STATS = [
    { total: 70, booked: 11, available: 59 },
    { total: 40, booked: 28, available: 12 },
    { total: 60, booked: 41, available: 19 },
    { total: 45, booked: 30, available: 15 },
    { total: 55, booked: 38, available: 17 },
    { total: 35, booked: 22, available: 13 },
    { total: 48, booked: 31, available: 17 },
    { total: 42, booked: 27, available: 15 },
    { total: 52, booked: 35, available: 17 },
    { total: 38, booked: 24, available: 14 }
  ];

  var FARM_PROJECTS = {};
  var state = { categoryId: null };

  function buildFarmProjects() {
    Object.keys(LISTING_TEMPLATES).forEach(function (categoryId) {
      var category = FARM_CATEGORIES[categoryId];
      var templates = LISTING_TEMPLATES[categoryId];

      templates.forEach(function (tpl, index) {
        var id = categoryId + '-' + String(index + 1).padStart(2, '0');
        var stats = PLOT_STATS[index];

        var isAvailable = tpl.available === true || (tpl.available !== false && index === 0);

        FARM_PROJECTS[id] = {
          id: id,
          categoryId: categoryId,
          name: tpl.name,
          crop: category.crop,
          village: DEFAULT_FARM_LOCATION.village,
          district: DEFAULT_FARM_LOCATION.district,
          state: DEFAULT_FARM_LOCATION.state,
          status: isAvailable ? 'Available' : 'Coming Soon',
          available: isAvailable,
          image: tpl.image,
          totalPlots: stats.total,
          bookedPlots: stats.booked,
          availablePlots: stats.available,
          plotArea: 600,
          annualReturnPerPlot: 120000
        };
      });
    });
  }

  buildFarmProjects();

  function $(id) {
    return document.getElementById(id);
  }

  function navigateToPage(pageId) {
    if (window.Components && window.Components.showPage) {
      Components.showPage(pageId);
      return;
    }
    document.querySelectorAll('[id^="page-"]').forEach(function (p) {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    var page = document.getElementById('page-' + pageId);
    if (page) {
      page.classList.add('active');
      page.style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderCategoryHeader(category) {
    var tag = $('fl-section-tag');
    var title = $('fl-section-title');
    var sub = $('fl-section-sub');
    var count = $('fl-section-count');
    var bannerImg = $('fl-banner-img');
    var bannerLabel = $('fl-banner-label');
    var bannerTagline = $('fl-banner-tagline');

    if (tag) tag.textContent = category.name + ' · CSA';
    if (title) title.textContent = category.name + ' Farms';
    if (sub) {
      sub.textContent = 'Explore ' + category.crop + ' farms across ' + category.district + ' — select a farm to view available plots and reserve.';
    }
    if (count) count.textContent = '10';
    if (bannerImg) {
      bannerImg.src = category.banner;
      bannerImg.alt = category.name + ' banner';
    }
    if (bannerLabel) bannerLabel.textContent = category.bannerLabel;
    if (bannerTagline) bannerTagline.textContent = category.tagline;
  }

  function renderFarmCards(categoryId) {
    var grid = $('fl-cards-grid');
    if (!grid) return;

    var category = FARM_CATEGORIES[categoryId];
    var farms = Object.keys(FARM_PROJECTS)
      .filter(function (id) { return FARM_PROJECTS[id].categoryId === categoryId; })
      .map(function (id) { return FARM_PROJECTS[id]; });

    grid.innerHTML = farms.map(function (farm, index) {
      var isAvailable = farm.available;
      var cardClass = 'fl-card ' + (isAvailable ? 'fl-card--available' : 'fl-card--coming-soon');
      var cardAttrs = isAvailable
        ? 'role="link" tabindex="0"'
        : 'aria-disabled="true"';

      return (
        '<div class="' + cardClass + '" data-farm-id="' + farm.id + '" data-available="' + isAvailable + '" ' + cardAttrs + ' style="animation-delay:' + (index * 0.06) + 's">' +
          '<div class="fl-card-img">' +
            '<img src="' + farm.image + '" alt="' + farm.name + '" loading="lazy">' +
            '<span class="fl-card-badge">CSA</span>' +
            (isAvailable
              ? '<span class="fl-card-status fl-card-status--available">Available</span>'
              : '<div class="fl-card-coming-soon-overlay" aria-hidden="true"><span class="fl-card-coming-soon-ribbon">Coming Soon</span></div>') +
          '</div>' +
          '<div class="fl-card-body">' +
            '<div class="fl-card-name">' + farm.name + '</div>' +
            '<div class="fl-card-divider"></div>' +
            '<div class="fl-card-meta">' +
              '<div class="fl-card-meta-row"><div class="fl-card-meta-dot"></div><strong>Village</strong> ' + farm.village + '</div>' +
              '<div class="fl-card-meta-row"><div class="fl-card-meta-dot"></div><strong>District</strong> ' + farm.district + '</div>' +
              '<div class="fl-card-meta-row"><div class="fl-card-meta-dot"></div><strong>State</strong> ' + farm.state + '</div>' +
            '</div>' +
            '<div class="fl-card-footer">' +
              '<button type="button" class="fl-btn-view" data-farm-id="' + farm.id + '"' + (isAvailable ? '' : ' disabled aria-disabled="true"') + '>View Details <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    grid.querySelectorAll('.fl-card--available').forEach(function (card) {
      var farmId = card.getAttribute('data-farm-id');
      card.addEventListener('click', function (e) {
        if (e.target.closest('.fl-btn-view')) return;
        openFarmProject(farmId, categoryId);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFarmProject(farmId, categoryId);
        }
      });
    });

    grid.querySelectorAll('.fl-card--available .fl-btn-view[data-farm-id]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openFarmProject(btn.getAttribute('data-farm-id'), categoryId);
      });
    });

    requestAnimationFrame(function () {
      grid.querySelectorAll('.fl-card').forEach(function (card) {
        card.classList.add('fl-card-visible');
      });
    });
  }

  function openFarmProject(farmId, categoryId) {
    if (window.ProjectDetails && window.ProjectDetails.openProjectDetails) {
      window.ProjectDetails.openProjectDetails(farmId, categoryId || state.categoryId);
    }
  }

  function loadFarmListing(categoryId) {
    var category = FARM_CATEGORIES[categoryId];
    if (!category) {
      categoryId = 'farm-1';
      category = FARM_CATEGORIES['farm-1'];
    }

    state.categoryId = categoryId;
    navigateToPage('farm-listing');
    renderCategoryHeader(category);
    renderFarmCards(categoryId);
  }

  function openFarmListing(categoryId) {
    var active = document.querySelector('.page.active') || document.querySelector('[id^="page-"][style*="block"]');
    var prev = active ? active.id.replace('page-', '') : 'projects';

    loadFarmListing(categoryId);

    history.replaceState({ page: prev }, '', window.location.pathname);
    history.pushState({ page: 'farm-listing', categoryId: categoryId }, '', '/farm-listing/' + categoryId);
  }

  function initEvents() {
    var back = $('fl-back-btn');
    if (back) {
      back.addEventListener('click', function () {
        navigateToPage('projects');
        history.pushState({ page: 'projects' }, '', '/');
      });
    }

    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'CHEDI_OPEN_FARM_LISTING') return;
      openFarmListing(e.data.categoryId || 'farm-1');
    });
  }

  function getRoutePath() {
    var stored = sessionStorage.getItem('__chedi_path');
    return stored || window.location.pathname;
  }

  function handleInitialRoute() {
    var stored = sessionStorage.getItem('__chedi_path');
    var path = getRoutePath();
    var match = path.match(/^\/farm-listing\/([\w-]+)$/);
    if (match) {
      if (stored) sessionStorage.removeItem('__chedi_path');
      loadFarmListing(match[1]);
      history.replaceState({ page: 'farm-listing', categoryId: match[1] }, '', path);
    }
  }

  function init() {
    initEvents();
    handleInitialRoute();
  }

  window.FarmListing = {
    openFarmListing: openFarmListing,
    loadFarmListing: loadFarmListing,
    FARM_CATEGORIES: FARM_CATEGORIES,
    FARM_PROJECTS: FARM_PROJECTS,
    getCategory: function (categoryId) { return FARM_CATEGORIES[categoryId]; }
  };

  window.openFarmListing = openFarmListing;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
