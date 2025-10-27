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
})();