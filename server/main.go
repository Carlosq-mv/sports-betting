package main

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/carlosq-mv/moist-sports/handlers"
	"github.com/carlosq-mv/moist-sports/pkg/db"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := initEverything(); err != nil {
		log.Fatal(err)
	}

	// _, err := db.DB.NewCreateTable().
	// 	Model((*types.User)(nil)).
	// 	Exec(context.Background())
	// if err != nil {
	// 	panic(err)
	// }

	router := chi.NewMux()
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{fmt.Sprintf("http://%s", os.Getenv("ACCEPTED_URL"))},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
	router.Use(corsHandler.Handler)

	// routes
	router.Post("/api/signup", handlers.HandleSignup)
	router.Post("/api/login", handlers.HandleLogin)

	// routes that use jwt authentication
	router.Group(func(auth chi.Router) {
		auth.Use(handlers.JwtMiddleware)
		auth.Get("/api/current-user", handlers.GetUser)
		auth.Post("/api/logout", handlers.HandleLogout)

	})

	listenAddr := os.Getenv("LISTEN_ADDR")
	slog.Info("HTTP Server started", "listenAddr", listenAddr)
	http.ListenAndServe(listenAddr, router)
}

func initEverything() error {
	if err := godotenv.Load(); err != nil {
		return err
	}
	return db.Init()
}
