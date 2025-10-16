const auth0Script = document.createElement('script')

auth0Script.onload = () => {
	console.log('auth0Script Loaded');
	auth0.createAuth0Client({
		domain: "dev-0hg062dftmmwr5em.us.auth0.com",
		clientId: "Gr54npG45lJjwBtitl2P6bASh0VRIwq4",
		authorizationParams: {
			redirect_uri: 'https://thoughtspotdocs.ngrok.io/cloud/10.12.0.cl/'
		}
	}).then(async (auth0Client) => {

		console.log('auth0Client Loaded')

		if (location.search.includes("state=") && 
			(location.search.includes("code=") || 
			location.search.includes("error="))) {
			console.log('handleRedirectCallback');
			await auth0Client.handleRedirectCallback();
			window.history.replaceState({}, document.title, "/");
		}

		const isAuthenticated = await auth0Client.isAuthenticated();

		console.log('isAuthenticated', isAuthenticated);

		const authWrapper = document.createElement("div");
		authWrapper.style.marginBottom = "10px";
		authWrapper.style.minHeight = "73px";
		authWrapper.style.marginLeft = "10px";
		authWrapper.id = "auth-wrapper";

		if (isAuthenticated) {
			document.body.style.display = "block";

			// User is logged in
			const user = await auth0Client.getUser();

			// Assumes an element with id "user-profile" in the DOM
			const profileElement = document.createElement("div");
			profileElement.id = "user-profile";
			authWrapper.appendChild(profileElement);

			profileElement.style.display = "block";
			profileElement.style.display = "flex";
			profileElement.style.alignItems = "center";
			profileElement.style.gap = "10px";
			profileElement.innerHTML = `
				<img style="width: 30px; height: auto;" src="${user.picture}" />
				<p>${user.name}</p>
			`;

			const logoutButton = document.createElement("button");
			logoutButton.id = "btn-logout";
			logoutButton.textContent = "Log out";
			authWrapper.appendChild(logoutButton);

			logoutButton.style.display = "block";
			logoutButton.addEventListener("click", (e) => {
				e.preventDefault();
				auth0Client.logout();
			});

			if (window.location.pathname.includes('/home/index.html')) {
				return window.location.href = '/cloud/10.12.0.cl/';
			}
			
			if (document.querySelector(".auth-parent")) {
				document.querySelector(".auth-parent").appendChild(authWrapper);
			} else {
				const sidebarContainer = document.querySelector("aside.nav")
				// prepend the authWrapper to the sidebarContainer
				sidebarContainer.prepend(authWrapper);
			}

		} else {
			// If the user is not logged in and the current page is the home page, show the login button
			if (window.location.pathname.includes('/home/index.html')) {
				const loginButton = document.createElement("button");
				loginButton.id = "btn-login";
				loginButton.textContent = "Log in";

				authWrapper.style.display = "flex";
				authWrapper.style.justifyContent = "center";
				authWrapper.style.alignItems = "center";
				authWrapper.style.gap = "10px";
				authWrapper.innerHTML = 'Get started ';
				authWrapper.appendChild(loginButton);

				loginButton.style.display = "block";

				loginButton.addEventListener("click", (e) => {
					e.preventDefault();
					auth0Client.loginWithRedirect();
				});

				document.querySelector(".auth-parent").appendChild(authWrapper);
				document.body.style.display = "block";
			} else {
				// If the user is not logged in and the current page is not the home page, redirect to the home page
				window.location.href = '/home/index.html';
			}
		}
	});
}

auth0Script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';
document.head.appendChild(auth0Script);
