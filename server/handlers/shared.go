package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/carlosq-mv/moist-sports/pkg/db"
	"github.com/carlosq-mv/moist-sports/types"
)

func getAuthenticatedUser(r *http.Request) *types.User {
	// retrieve the user from the context
	user, ok := r.Context().Value(userIDKey).(*types.User)
	if !ok {
		slog.Info("Failed to retrieve user from context", "user", ok)
		return nil
	}

	return user
}

func getUserById(id string) (*types.User, error) {
	// turn the string id into int64
	userId, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return nil, err
	}

	// look for user based on id
	var user types.User
	err = db.DB.NewSelect().Model(&user).Where("id = ?", userId).Scan(context.Background())
	if err != nil {
		return nil, err
	}
	return &user, nil
}
