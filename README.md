# Shopify Theme

Basic source from Shopify Theme Dawn, the goal is integration Shopify theme with React, just for Cart.
Replace current cart drawer with react components
- Components Cart
- Components Cart Items

Workspace Area:
- ./src/scripts/theme-main.js
- ./src/scripts/modules/react-cart.js

Don't hesitate to create another file this is just scope.
Create a new branch and pull request.

## Setup
1. Use Node v17
2. `npm install`
3. Get the credentials and theme Id from each stores
4. Install [Shopify Theme Kit](https://shopify.github.io/themekit/) or Shopify CLI to serve

*** Install all dependencies you need

## Development
1. Run
	```
	NODE_ENV=dev npm start
	```

2. In another terminal, run:
	```
	theme watch -c config/development.yml -e dev
	# or, to watch all environments
	theme watch -c config/development.yml --allenvs
	```
