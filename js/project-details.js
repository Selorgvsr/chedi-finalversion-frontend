/**
 * CHEDI – Farm Project Details & Plot Reservation Flow
 */
(function () {
  'use strict';

  function getFarmProjects() {
    return (window.FarmListing && window.FarmListing.FARM_PROJECTS) || {};
  }

  var PLOT_PLANS = [
    { plots: 1, label: '1 Plot' },
    { plots: 2, label: '2 Plots' },
    { plots: 3, label: '3 Plots' }
  ];

  var state = {
    farmId: null,
    farm: null,
    categoryId: null,
    selectedPlan: null,
    booking: null
  };

  function formatINR(amount) {
    return '\u20B9' + amount.toLocaleString('en-IN');
  }

  function $(id) {
    return document.getElementById(id);
  }

  function formatPlotCountText(plotCount, areaEach) {
    if (plotCount === 1) {
      return '1 plot of ' + areaEach + ' sq ft';
    }
    return plotCount + ' plots of ' + areaEach + ' sq ft each';
  }

  function getPlanDetails(farm, plotCount) {
    var totalArea = farm.plotArea * plotCount;
    var annualReturn = farm.annualReturnPerPlot * plotCount;
    return {
      plots: plotCount,
      label: plotCount + (plotCount === 1 ? ' Plot' : ' Plots'),
      areaEach: farm.plotArea,
      totalArea: totalArea,
      annualReturn: annualReturn
    };
  }

  function getProjectName() {
    if (!state.categoryId || !window.FarmListing) return 'CHEDI Farm';
    var cat = window.FarmListing.getCategory(state.categoryId);
    return cat ? cat.name : 'CHEDI Farm';
  }

  function buildReservationPayload() {
    return {
      fullName: $('pd-name').value.trim(),
      mobile: $('pd-mobile').value.trim(),
      email: $('pd-email').value.trim(),
      address: $('pd-address').value.trim(),
      city: $('pd-city').value.trim(),
      state: $('pd-state').value.trim(),
      pin: $('pd-pin').value.trim(),
      farmId: state.farmId,
      farmName: state.farm.name,
      projectName: getProjectName(),
      plots: state.selectedPlan.plots,
      selectedPlan: state.selectedPlan.label,
      plotArea: state.selectedPlan.areaEach,
      totalArea: state.selectedPlan.totalArea,
      annualReturn: state.selectedPlan.annualReturn
    };
  }

  var API_FIELD_MAP = {
    fullName: 'pd-name',
    mobile: 'pd-mobile',
    email: 'pd-email',
    address: 'pd-address',
    city: 'pd-city',
    state: 'pd-state',
    pin: 'pd-pin'
  };

  function applyServerErrors(errors) {
    if (!errors || !errors.length) return;
    errors.forEach(function (err) {
      var fieldId = API_FIELD_MAP[err.field];
      if (fieldId) setFieldError(fieldId, err.message);
    });
  }

  function setFormFeedback(message, isError) {
    var feedback = $('pd-form-feedback');
    if (!feedback) return;
    feedback.style.color = isError ? '#c0392b' : '#2d6a4f';
    feedback.textContent = message || '';
  }

  function resetSubmitButton(btn) {
    if (!btn) return;
    btn.classList.remove('loading');
    btn.textContent = 'Reserve My Farm Plot';
    updateSubmitState();
  }

  function validateMobile(value) {
    return /^[6-9]\d{9}$/.test(value.replace(/\s/g, ''));
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePin(value) {
    return /^\d{6}$/.test(value);
  }

  function setFieldError(fieldId, message) {
    var input = $(fieldId);
    var err = $('pd-err-' + fieldId.replace('pd-', ''));
    if (input) input.classList.toggle('pd-invalid', !!message);
    if (err) err.textContent = message || '';
  }

  function clearFormErrors() {
    ['pd-name', 'pd-mobile', 'pd-email', 'pd-address', 'pd-city', 'pd-pin'].forEach(function (id) {
      setFieldError(id, '');
    });
    var feedback = $('pd-form-feedback');
    if (feedback) feedback.textContent = '';
  }

  function renderHero(farm) {
    var img = $('pd-hero-img');
    if (img) {
      img.src = farm.image;
      img.alt = farm.name + ' – ' + farm.crop;
    }

    var title = $('pd-hero-name');
    if (title) title.textContent = farm.name;

    var crop = $('pd-hero-crop');
    if (crop) crop.innerHTML = '<strong>Crop:</strong> ' + farm.crop;

    var location = $('pd-hero-location');
    if (location) location.innerHTML = '<strong>Location:</strong> ' + farm.village + ', ' + farm.district;

    var status = $('pd-status-badge');
    if (status) status.textContent = farm.status;

    var total = $('pd-stat-total');
    var booked = $('pd-stat-booked');
    var available = $('pd-stat-available');
    if (total) total.textContent = farm.totalPlots;
    if (booked) booked.textContent = farm.bookedPlots;
    if (available) available.textContent = farm.availablePlots;
  }

  function renderPlanCards(farm) {
    var grid = $('pd-plans-grid');
    if (!grid) return;

    grid.innerHTML = PLOT_PLANS.map(function (plan, index) {
      var details = getPlanDetails(farm, plan.plots);
      var selected = state.selectedPlan && state.selectedPlan.plots === plan.plots;
      return (
        '<div class="pd-plan-card' + (selected ? ' selected' : '') + '" data-plots="' + plan.plots + '" role="button" tabindex="0" aria-pressed="' + selected + '">' +
          '<div class="pd-plan-title">' + plan.label + '</div>' +
          '<div class="pd-plan-detail"><strong>Area:</strong> ' + details.areaEach + ' Sq Ft' + (plan.plots > 1 ? ' each' : '') + '</div>' +
          '<div class="pd-plan-return">' + formatINR(details.annualReturn) + '</div>' +
          '<div class="pd-plan-detail">Annual Return</div>' +
          '<button type="button" class="pd-plan-btn">Select Plan</button>' +
        '</div>'
      );
    }).join('');

    grid.querySelectorAll('.pd-plan-card').forEach(function (card) {
      card.addEventListener('click', function () {
        selectPlan(parseInt(card.getAttribute('data-plots'), 10));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectPlan(parseInt(card.getAttribute('data-plots'), 10));
        }
      });
    });
  }

  function scrollToReservation() {
    requestAnimationFrame(function () {
      var summary = $('pd-summary-section');
      if (summary) {
        summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function selectPlan(plotCount) {
    if (!state.farm) return;
    state.selectedPlan = getPlanDetails(state.farm, plotCount);
    renderPlanCards(state.farm);
    updateSummary();
    updateFormPlotSummary();
    scrollToReservation();
  }

  function updateSummary() {
    if (!state.farm || !state.selectedPlan) {
      var empty = $('pd-summary-empty');
      var card = $('pd-summary-card');
      if (empty) empty.style.display = 'block';
      if (card) card.style.display = 'none';
      return;
    }

    var empty = $('pd-summary-empty');
    var card = $('pd-summary-card');
    if (empty) empty.style.display = 'none';
    if (card) card.style.display = 'grid';

    var plan = state.selectedPlan;
    var farm = state.farm;

    setText('pd-sum-plan', plan.label);
    setText('pd-sum-plots', formatPlotCountText(plan.plots, plan.areaEach));
    setText('pd-sum-return', formatINR(plan.annualReturn));
    setText('pd-sum-project', farm.name);
    setText('pd-sum-location', farm.village + ', ' + farm.district);
  }

  function updateFormPlotSummary() {
    var wrap = $('pd-plot-summary');
    if (!wrap) return;

    if (!state.selectedPlan) {
      wrap.innerHTML = '<p style="color:var(--text-light);font-size:14px;">Select a plan above to see plot details.</p>';
      return;
    }

    var plan = state.selectedPlan;
    var rows = '<div class="pd-plot-summary-title">Selected Plan: ' + plan.label + '</div>';

    for (var i = 1; i <= plan.plots; i++) {
      rows += '<div class="pd-plot-summary-row"><span>Plot ' + i + ' Area</span><span>' + plan.areaEach + ' Sq Ft</span></div>';
    }

    rows += '<div class="pd-plot-summary-row"><span>Annual Return</span><span>' + formatINR(plan.annualReturn) + '</span></div>';

    wrap.innerHTML = rows;
  }

  function setText(id, value) {
    var el = $(id);
    if (el) el.textContent = value;
  }

  function resetForm() {
    var form = $('pd-reserve-form');
    if (form) form.reset();
    var agree = $('pd-agree');
    if (agree) agree.checked = false;
    clearFormErrors();
    updateSubmitState();
  }

  function resetSuccessView() {
    var main = $('pd-main-flow');
    var success = $('pd-success-screen');
    if (main) main.classList.remove('hidden');
    if (success) success.classList.remove('visible');
    state.booking = null;
  }

  function updateSubmitState() {
    var btn = $('pd-submit-btn');
    var agree = $('pd-agree');
    if (!btn) return;
    btn.disabled = !(state.selectedPlan && agree && agree.checked);
  }

  function validateForm() {
    clearFormErrors();
    var valid = true;

    var name = $('pd-name').value.trim();
    var mobile = $('pd-mobile').value.trim();
    var email = $('pd-email').value.trim();
    var address = $('pd-address').value.trim();
    var city = $('pd-city').value.trim();
    var pin = $('pd-pin').value.trim();
    var agree = $('pd-agree').checked;

    if (!name) { setFieldError('pd-name', 'Full name is required.'); valid = false; }
    if (!mobile) { setFieldError('pd-mobile', 'Mobile number is required.'); valid = false; }
    else if (!validateMobile(mobile)) { setFieldError('pd-mobile', 'Enter a valid 10-digit mobile number.'); valid = false; }
    if (!email) { setFieldError('pd-email', 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { setFieldError('pd-email', 'Enter a valid email address.'); valid = false; }
    if (!address) { setFieldError('pd-address', 'Address is required.'); valid = false; }
    if (!city) { setFieldError('pd-city', 'City is required.'); valid = false; }
    if (!pin) { setFieldError('pd-pin', 'PIN code is required.'); valid = false; }
    else if (!validatePin(pin)) { setFieldError('pd-pin', 'Enter a valid 6-digit PIN code.'); valid = false; }
    if (!state.selectedPlan) {
      var feedback = $('pd-form-feedback');
      if (feedback) {
        feedback.style.color = '#c0392b';
        feedback.textContent = 'Please select a plot plan before submitting.';
      }
      valid = false;
    }
    if (!agree) {
      var feedbackAgree = $('pd-form-feedback');
      if (feedbackAgree && valid) {
        feedbackAgree.style.color = '#c0392b';
        feedbackAgree.textContent = 'Please agree to the Terms & Conditions.';
      }
      valid = false;
    }

    return valid;
  }

  function scrollToSuccess() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var success = $('pd-success-screen');
        if (success) {
          success.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function showSuccess(booking) {
    var main = $('pd-main-flow');
    var success = $('pd-success-screen');
    if (main) main.classList.add('hidden');
    if (success) success.classList.add('visible');

    setText('pd-success-booking-id', booking.id);
    setText('pd-success-project', booking.projectName);
    setText('pd-success-plots', String(booking.plots));
    setText('pd-success-area', booking.areaEach + ' Sq Ft each');
    setText('pd-success-return', formatINR(booking.annualReturn));
    setText('pd-success-name', booking.customerName);
    setText('pd-success-date', booking.date);

    scrollToSuccess();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    var btn = $('pd-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('loading');
      btn.textContent = 'Processing…';
    }
    setFormFeedback('', false);

    fetch('/api/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildReservationPayload())
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.data.success) {
          var booking = {
            id: result.data.bookingId,
            projectName: state.farm.name,
            plots: state.selectedPlan.plots,
            areaEach: state.selectedPlan.areaEach,
            totalArea: state.selectedPlan.totalArea,
            annualReturn: state.selectedPlan.annualReturn,
            customerName: $('pd-name').value.trim(),
            date: result.data.reservationDate
          };

          state.booking = booking;
          showSuccess(booking);
          return;
        }

        applyServerErrors(result.data.errors);

        var errMsg = result.data.errors
          ? result.data.errors.map(function (err) { return err.message; }).join(' ')
          : result.data.message;

        setFormFeedback(errMsg || 'Something went wrong. Please try again.', true);

        var reserveSection = $('pd-reserve-section');
        if (reserveSection) {
          reserveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      .catch(function () {
        setFormFeedback('Could not reach the server. Please try again later.', true);
      })
      .finally(function () {
        resetSubmitButton(btn);
      });
  }

  function downloadReceipt() {
    if (!state.booking) return;
    var b = state.booking;
    var text = [
      'CHEDI – Farm Plot Reservation Receipt',
      '=====================================',
      'Booking ID: ' + b.id,
      'Project: ' + b.projectName,
      'Plots: ' + b.plots,
      'Area: ' + b.areaEach + ' Sq Ft each',
      'Total Area: ' + b.totalArea + ' Sq Ft',
      'Annual Return: ' + formatINR(b.annualReturn),
      'Customer: ' + b.customerName,
      'Date: ' + b.date,
      '',
      'Thank you for choosing CHEDI Longevity.'
    ].join('\n');

    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = b.id + '-receipt.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadFarm(farmId, resetSelection) {
    var projects = getFarmProjects();
    var farm = projects[farmId];
    if (!farm) {
      var fallbackId = Object.keys(projects)[0];
      farm = projects[fallbackId];
      farmId = fallbackId;
    }

    state.farmId = farmId;
    state.farm = farm;
    state.categoryId = farm.categoryId || null;
    updateBackButton();

    if (resetSelection !== false) {
      state.selectedPlan = null;
      resetForm();
      resetSuccessView();
    }

    renderHero(farm);
    renderPlanCards(farm);
    updateSummary();
    updateFormPlotSummary();
    updateSubmitState();
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

  function updateBackButton() {
    var back = $('pd-back-btn');
    if (!back) return;
    if (state.categoryId) {
      back.textContent = '← Back to Farm Listing';
      back.setAttribute('aria-label', 'Back to Farm Listing');
    } else {
      back.textContent = '← Back to Projects';
      back.setAttribute('aria-label', 'Back to Projects');
    }
  }

  function openProjectDetails(farmId, categoryId) {
    var active = document.querySelector('.page.active') || document.querySelector('[id^="page-"][style*="block"]');
    var prev = active ? active.id.replace('page-', '') : 'projects';
    var projects = getFarmProjects();
    var farm = projects[farmId];
    var resolvedCategory = categoryId || (farm && farm.categoryId) || null;

    navigateToPage('project-details');
    loadFarm(farmId, true);
    if (resolvedCategory) state.categoryId = resolvedCategory;

    history.replaceState({ page: prev, categoryId: resolvedCategory }, '', window.location.pathname);
    history.pushState(
      { page: 'project-details', farmId: farmId, categoryId: resolvedCategory },
      '',
      '/project-details/' + farmId
    );
  }

  function scrollToReserve() {
    var el = $('pd-reserve-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getHeaderScrollOffset() {
    var header = document.getElementById('main-header');
    return header ? header.getBoundingClientRect().height + 16 : 88;
  }

  function scrollToChoosePlot() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var el = $('pd-choose-plot-section');
        if (!el) return;
        var offset = getHeaderScrollOffset();
        var top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    });
  }

  function openChoosePlot() {
    openProjectDetails('farm-1-01', 'farm-1');
    scrollToChoosePlot();
    if (typeof window.closeMobileNav === 'function') {
      window.closeMobileNav();
    }
  }

  function initEvents() {
    var back = $('pd-back-btn');
    if (back) {
      back.addEventListener('click', function () {
        if (state.categoryId && window.FarmListing) {
          FarmListing.openFarmListing(state.categoryId);
        } else {
          navigateToPage('projects');
          history.pushState({ page: 'projects' }, '', '/');
        }
      });
    }

    var form = $('pd-reserve-form');
    if (form) form.addEventListener('submit', handleSubmit);

    var agree = $('pd-agree');
    if (agree) agree.addEventListener('change', updateSubmitState);

    var downloadBtn = $('pd-download-receipt');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadReceipt);

    var viewBtn = $('pd-view-reservation');
    if (viewBtn) {
      viewBtn.addEventListener('click', scrollToSuccess);
    }

    var bookNow = $('pd-final-book-btn');
    if (bookNow) bookNow.addEventListener('click', scrollToReserve);

    window.addEventListener('message', function (e) {
      if (!e.data) return;
      if (e.data.type === 'CHEDI_OPEN_PROJECT') {
        openProjectDetails(e.data.farmId, e.data.categoryId);
      }
    });
  }

  function handleInitialRoute() {
    var stored = sessionStorage.getItem('__chedi_path');
    var path = stored || window.location.pathname;
    var match = path.match(/^\/project-details\/([\w-]+)$/);
    if (match) {
      if (stored) sessionStorage.removeItem('__chedi_path');
      navigateToPage('project-details');
      loadFarm(match[1], true);
      history.replaceState(
        { page: 'project-details', farmId: match[1], categoryId: state.categoryId },
        '',
        path
      );
    }
  }

  function init() {
    initEvents();
    handleInitialRoute();
  }

  window.ProjectDetails = {
    loadFarm: loadFarm,
    openProjectDetails: openProjectDetails,
    openChoosePlot: openChoosePlot,
    scrollToChoosePlot: scrollToChoosePlot,
    getFarmProjects: getFarmProjects
  };

  window.openProjectDetails = openProjectDetails;
  window.openChoosePlot = openChoosePlot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
