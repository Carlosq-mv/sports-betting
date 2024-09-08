package handlers

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/carlosq-mv/moist-sports/pkg/utils"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDKey contextKey = "userID"

func JwtMiddleware(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		// get the cookie
		jwtToken, err := r.Cookie("jwt")
		if err != nil {
			http.Error(w, "cookie not presnt", http.StatusInternalServerError)
			slog.Error("cookie not present", "url", r.URL.Path)
			return
		}

		// get value of cookie that has jwt token
		tokenStr := jwtToken.Value

		// get the jwt token
		token, err := jwt.ParseWithClaims(tokenStr, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
			return utils.SecretKey, nil
		})
		if err != nil {
			http.Error(w, "unathenticeted", http.StatusBadRequest)
			slog.Error("unathenticeted", "url", r.URL.Path)
			return
		}

		// get issuer from the token
		id, err := token.Claims.GetIssuer()
		if err != nil {
			slog.Error("Jwt issuer not present", "url", r.URL.Path)
			http.Error(w, "Jwt issuer not present", http.StatusBadRequest)
			return
		}

		// get the actual user object now
		user, err := getUserById(id)
		if err != nil {
			slog.Error("error getting the user via id", "err", err.Error())
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// inject the user into the context
		ctx := context.WithValue(r.Context(), userIDKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
	return http.HandlerFunc(fn)
}
