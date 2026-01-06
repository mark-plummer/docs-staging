const auth0Script = document.createElement('script')
console.log('auth0_handler.js loaded');

auth0Script.onload = () => {
	console.log('auth0Script Loaded');
	auth0.createAuth0Client({
		domain: "dev-0hg062dftmmwr5em.us.auth0.com",
		clientId: "Gr54npG45lJjwBtitl2P6bASh0VRIwq4",
		authorizationParams: {
			redirect_uri: window.location.origin + '/home?loggedin=true'
		},
		cacheLocation: 'localstorage',
		useRefreshTokens: true
	}).then(async (auth0Client) => {

		if (location.search.includes("state=") && 
			(location.search.includes("code=") || 
			location.search.includes("error="))) {
			console.log('handleRedirectCallback', window.location.pathname);
			await auth0Client.handleRedirectCallback();
			window.history.replaceState({}, document.title, window.location.pathname);
		}

		const isAuthenticated = await auth0Client.isAuthenticated();

		const authWrapper = document.createElement("div");
		const authWrapperStyle = document.createElement("style");

		document.head.appendChild(authWrapperStyle);
		authWrapper.id = "auth-wrapper";


		if (isAuthenticated) {
			document.body.style.display = "block";

			// User is logged in
			const user = await auth0Client.getUser();

			// Assumes an element with id "user-profile" in the DOM
			const profileElement = document.createElement("div");
			profileElement.id = "user-profile";

			profileElement.style.display = "block";
			profileElement.style.display = "flex";
			profileElement.style.alignItems = "center";
			profileElement.style.gap = "10px";
			profileElement.innerHTML = `
				<img style="width: 30px; height: auto;" src="${user.picture}" />
				<p>${user.name}</p>
			`;

			const authWrapperInner = document.createElement("div");
			authWrapperInner.id = "auth-wrapper-inner";
			authWrapper.appendChild(authWrapperInner);

			const logoutToggleButton = document.createElement("button");
			logoutToggleButton.id = "toggle-logout";
			authWrapperInner.appendChild(logoutToggleButton);
			logoutToggleButton.appendChild(profileElement);

			logoutToggleButton.addEventListener("click", (e) => {
				e.preventDefault();
				authWrapperInner.classList.toggle('is-active');
			});

			const logoutButton = document.createElement("button");
			logoutButton.id = "btn-logout";
			logoutButton.textContent = "Log out";
			authWrapperInner.appendChild(logoutButton);

			logoutButton.addEventListener("click", (e) => {
				e.preventDefault();
				auth0Client.logout();
			});

			if (window.location.pathname.includes('/home')) {
				const sitemap = await fetch('/sitemap-cloud.xml');
				const sitemapXml = await sitemap.text();
				const urls = [...sitemapXml.matchAll(/<loc>.*?(\/cloud\/[^\/]+\/)/g)].map(match => match[1]);
				console.log('redirecting to', urls[0]);
				window.location.href = urls[0];
				return
			}
			
			if (document.querySelector(".auth-parent")) {
				document.querySelector(".auth-parent").appendChild(authWrapper);
			} else {
				const toolbar = document.querySelector('main .toolbar')
				toolbar.appendChild(authWrapper);
				
				// body.classList.add('has-body-auth-wrapper');
				// document.body.append(authWrapper);

				const style = document.createElement("style");
				style.textContent = `

					.toolbar #auth-wrapper button#toggle-logout {
						color: inherit;
						border: none;
						outline: none;
						line-height: inherit;
						padding: 5px 1.5rem 5px 5px;
						position: relative;
						z-index: 3;
						background: url(/_/img/chevron.svg) no-repeat;
						background-position: right .5rem top 50%;
						background-size: auto .75em;
					}

					.toolbar #auth-wrapper p, img {
						margin: 0!important;
					}

					.toolbar #auth-wrapper-inner {
						position: relative;
						padding: 1px;
						height: 42px;
					}

					.toolbar #auth-wrapper-inner.is-active {
						display: flex;
						min-width: 100%;
						top: 14px;
						flex-direction: column;
						background: -webkit-gradient(linear, left top, left bottom, from(#f0f0f0), to(#f0f0f0)) no-repeat;
						background: linear-gradient(180deg, #f0f0f0 0, #f0f0f0) no-repeat;
						border-radius: 5px;
						border: 1px solid #c8c8c8;
						white-space: nowrap;
						padding: 0;
						height: 70px;
						-webkit-box-shadow: 0 28px 45px rgba(0, 0, 0, .2);
						box-shadow: 0 28px 45px rgba(0, 0, 0, .2);
					}

					.toolbar #auth-wrapper-inner.is-active #btn-logout {
						display: block;
					}

					.toolbar #auth-wrapper button#btn-logout {
						display: none;
						position: absolute;
						bottom: 4px;
						left: 4px;
						width: calc(100% - 8px);
					}

					.toolbar #auth-wrapper {
					}

					body > #auth-wrapper {
						position: absolute;
						top: 120px;
						right: 23px;
						background-color: white;
						padding: 10px;
						border-radius: 5px;
						box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
						z-index: 1;
						min-height: 0;
					}
					@media (max-width: 768px) {
						body.has-body-auth-wrapper main.article {
							margin-top: 70px;
						}
						body > #auth-wrapper {
							display: flex;
							flex-direction: row;
							gap: 10px;
							top: 70px;
						}
						body > #auth-wrapper button {
							height: 30px;
						}
						body > #auth-wrapper img {
							margin: 0;
						}
						body > #auth-wrapper #user-profile {
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
				authWrapper.appendChild(loginButton);

				loginButton.style.display = "block";

				loginButton.addEventListener("click", (e) => {
					e.preventDefault();
					auth0Client.loginWithRedirect();
				});

				document.querySelector(".auth-parent").appendChild(authWrapper);
				document.body.style.display = "block";
			} else {
				if (navigator.userAgent.indexOf('Algolia Crawler') !== -1) {

				} else {
					// If the user is not logged in and the current page is not the home page, redirect to the home page
					if (window.location.origin.indexOf('ngrok') !== -1) {
						window.location.href = '/home';
					} else {
						window.location.href = '/home/index.html';
					}
				}
			}
		}
	});
}

auth0Script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';
document.head.appendChild(auth0Script);
