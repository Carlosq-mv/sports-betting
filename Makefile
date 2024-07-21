air:
	@cd server && air

dev:
	@cd client && npm run dev

css:
	@cd client && npx tailwindcss -i ./src/index.css -o ./src/output.css --watch