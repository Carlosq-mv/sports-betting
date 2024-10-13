package handlers

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/carlosq-mv/moist-sports/pkg/db"
	"github.com/carlosq-mv/moist-sports/pkg/utils"
	"github.com/carlosq-mv/moist-sports/types"
)

func HandleSignup(w http.ResponseWriter, r *http.Request) {
	var user types.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		slog.Error("invalid request payload", "url", r.URL.Path)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// check that all inputs are not empty
	if user.Password == "" || user.Username == "" || user.Email == "" {
		slog.Error("fill all input fields", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"empty": "Please fill all input fields",
		})
		// http.Error(w, "Please fill all input fields", http.StatusBadRequest)
		return
	}

	// check if it is a valid password
	//	- 8 characters long
	//	- 1 uppercase letter
	// 	- 1 lowercase letter
	// 	- 1 numeric character
	// 	- 1 special character
	msg, ok := utils.ValidPassword(user.Password)
	if !ok {
		slog.Error("not a valid password", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"password": msg,
		})
		// http.Error(w, msg, http.StatusBadRequest)
		return
	}

	// check if it is a valid email format
	if !utils.ValidEmail(user.Email) {
		slog.Error("not a valid email", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"email": "Please enter a valid email",
		})
		// http.Error(w, "Please enter a valid email", http.StatusBadRequest)
		return
	}

	// check if email is already in use
	if utils.EmailExists(user.Email, context.Background()) {
		slog.Error("email already exsists", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"email": "Email already exsists. Please try again with unique email",
		})
		// http.Error(w, "Email already exsists. Please try again with unique email", http.StatusBadRequest)
		return
	}

	// check if username is already in use
	if utils.UsernameExists(user.Username, context.Background()) {
		slog.Error("username already exsists", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"username": "Username already exsists. Please try again with unique username",
		})
		// http.Error(w, "Username already exsists. Please try again with unique username", http.StatusBadRequest)
		return
	}

	// hash the password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		slog.Error("error hashing password", "url", r.URL.Path)
		http.Error(w, "Error hashing password", http.StatusBadRequest)
		return
	}

	// store hashed password for user
	user.Password = hashedPassword

	res, err := db.DB.NewInsert().Model(&user).Exec(context.Background())
	if err != nil {
		slog.Error("error adding user to database", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"account_err": "Can not create account at this moment",
		})
		// http.Error(w, "Error adding user to databse", http.StatusBadRequest)
		return
	}

	slog.Info("success creating user", "res", res)

	// send json response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"success": "new user created",
	})
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	var user types.User

	// NOTE: this will embed the user variable with the value being inputted by the user
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		slog.Error("invalid request payload", "url", r.URL.Path)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// get the user input password
	password := user.Password

	if user.Username == "" || user.Password == "" {
		slog.Error("empty fields", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"empty": "Please fill all input fields",
		})
		// http.Error(w, "Please make sure all input fields are filled.", http.StatusBadRequest)
		return
	}

	// check if the username exsits
	// NOTE: this will embed the user variable with the user in the actual database if there is a match
	err := db.DB.NewSelect().Model(&user).Where("username = ?", user.Username).Scan(context.Background())
	if err != nil {
		slog.Error("error finding user", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"username": "That is not a correct username",
		})
		// http.Error(w, "Error finding user", http.StatusBadRequest)
		return
	}

	// NOTE: user.password contains the hash
	// check if the password is corrected based on the username
	if !utils.CheckPasswordHash(password, user.Password) {
		slog.Error("password is not correct", "url", r.URL.Path)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"password": "Password is not correct please try again",
		})
		// http.Error(w, "Password is not correct please try again", http.StatusBadRequest)
		return
	}

	// create the jwt token
	jwt, err := utils.CreateToken(&user)
	if err != nil {
		slog.Error("error creating jwt token", "url", r.URL.Path)
	}

	// update the user as logged in
	user.LoggedIn = true
	_, err = db.DB.NewUpdate().Model(&user).Where("id = ?", user.Id).Exec(context.Background())
	if err != nil {
		slog.Error("error updating logged in status for user", "user", user.Username)
		http.Error(w, "error loggin in user", http.StatusBadGateway)
		return
	}

	// TODO: store in a cookie instead
	cookie := http.Cookie{
		Name:     "jwt",
		Value:    jwt,
		Expires:  time.Now().Add(time.Hour * 24),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}
	http.SetCookie(w, &cookie)

	slog.Info("success logging user in", "user status", user.LoggedIn)

	// send json response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{
		"token": "success",
	})
}

func HandleLogout(w http.ResponseWriter, r *http.Request) {
	// get the current user
	user := getAuthenticatedUser(r)

	// update the user as logged out
	user.LoggedIn = false
	_, err := db.DB.NewUpdate().Model(user).Where("id = ?", user.Id).Exec(context.Background())
	if err != nil {
		slog.Error("error updating logged out status for user", "user", user.Username)
		http.Error(w, "error logging out user", http.StatusBadGateway)
		return
	}

	slog.Info("success logging out user", "user status", user.LoggedIn)

	// clear the cookie that has jwt token
	cookie := http.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
	}

	http.SetCookie(w, &cookie)

	// send json response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)

	json.NewEncoder(w).Encode(map[string]bool{
		"log_out": user.LoggedIn,
	})
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	user := getAuthenticatedUser(r)
	if user == nil {
		slog.Info("error getting user", "user", user)
		http.Error(w, "Error getting authenticated user", http.StatusBadRequest)
		return
	}

	slog.Info("succcess getting current user", "user", user.Id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
