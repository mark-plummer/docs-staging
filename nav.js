(function() {
	const navMenu = document.querySelector('.nav-menu');
	navMenu.addEventListener('click', (e) => {
		const target = e.target;
		if ((target.tagName === 'SPAN' && target.classList.contains('nav-text'))) {
			if (target.nextElementSibling && target.nextElementSibling.classList.contains('nav-list')) {
				e.preventDefault();
				target.nextElementSibling.classList.toggle('is-active');
				target.parentElement.classList.toggle('is-active');
			}
		}
	});

	document.querySelectorAll('.is-current-page').forEach(activeItem => {
		activeItem.classList.add('is-active');
		while (activeItem.parentElement && activeItem.parentElement.tagName !== 'NAV') {
			activeItem.parentElement.classList.add('is-active');
			activeItem = activeItem.parentElement;
		}
	});

	document.querySelector('.version-menu-toggle').addEventListener('click', (e) => {
		e.preventDefault();
		document.querySelector('.page-versions').classList.toggle('is-active');
	});

	document.body.addEventListener('click', (e) => {
		// Check if clicked element is descendant of .page-versions or .auth-wrapper
		if (e.target.closest('.page-versions') || e.target.closest('#auth-wrapper')) {
			return;
		}
		// Close .page-versions if it is open
		document.querySelector('.page-versions').classList.remove('is-active');
		// Close .auth-wrapper if it is open
		document.querySelector('#auth-wrapper-inner').classList.remove('is-active');
	});
})();