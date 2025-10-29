const auth0Script = document.createElement('script')

auth0Script.onload = () => {
	console.log('auth0Script Loaded');
	auth0.createAuth0Client({
		domain: "dev-0hg062dftmmwr5em.us.auth0.com",
		clientId: "Gr54npG45lJjwBtitl2P6bASh0VRIwq4",
		authorizationParams: {
			redirect_uri: window.location.origin + '/home?loggedin=true'
		}
	}).then(async (auth0Client) => {

		console.log('auth0Client Loaded')

		if (location.search.includes("state=") && 
			(location.search.includes("code=") || 
			location.search.includes("error="))) {
			console.log('handleRedirectCallback', window.location.pathname);
			await auth0Client.handleRedirectCallback();
			window.history.replaceState({}, document.title, window.location.pathname);
		}

		const isAuthenticated = await auth0Client.isAuthenticated();

		console.log('isAuthenticated', isAuthenticated);

		const authWrapper = document.createElement("div");
		const authWrapperStyle = document.createElement("style");
		authWrapperStyle.textContent = `
			#auth-wrapper {
				margin: 0 0 10px 0;
				min-height: 73px;
				margin-left: 10px;
			}
			@media (max-width: 768px) {
				#auth-wrapper {
					margin: 0;
					min-height: 0;
					margin-left: 0;
				}
			}
		`;
		document.head.appendChild(authWrapperStyle);
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

			if (window.location.pathname.includes('/home')) {
				const sitemap = await fetch('/sitemap-cloud.xml');
				const sitemapXml = await sitemap.text();
				const urls = [...sitemapXml.matchAll(/<loc>.*?(\/cloud\/[^\/]+\/)/g)].map(match => match[1]);
				window.location.href = urls[0];
				return
			}
			
			if (document.querySelector(".auth-parent")) {
				document.querySelector(".auth-parent").appendChild(authWrapper);
			} else {
				document.body.append(authWrapper);

				const style = document.createElement("style");
				style.textContent = `
					#auth-wrapper {
						position: absolute;
						top: 70px;
						right: 5px;
						background-color: white;
						padding: 10px;
						border-radius: 5px;
						box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
						z-index: 1000;
						min-height: 0;
					}
					@media (max-width: 768px) {
						#auth-wrapper {
							display: flex;
							flex-direction: row;
							gap: 10px;
						}
						#auth-wrapper button {
							height: 30px;
						}
						#auth-wrapper img {
							margin: 0;
						}
						#user-profile {
							height: 30px;
						}
					}
				`;
				document.head.appendChild(style);
			}

		} else {
			// If the user is not logged in and the current page is the home page, show the login button
			if (window.location.pathname.includes('/home')) {
				const loginButton = document.createElement("button");
				loginButton.id = "btn-login";
				loginButton.textContent = "Log in";

				authWrapper.style.display = "flex";
				authWrapper.style.justifyContent = "center";
				authWrapper.style.alignItems = "center";
				authWrapper.style.gap = "10px";
				authWrapper.style.marginTop = "20px";
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
				if (window.location.origin.indexOf('ngrok') !== -1) {
					window.location.href = '/home';
				} else {
					window.location.href = '/home/index.html';
				}
			}
		}
	});
}

auth0Script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';
document.head.appendChild(auth0Script);
