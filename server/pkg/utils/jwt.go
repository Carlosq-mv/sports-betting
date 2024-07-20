package utils

import (
	"os"
	"strconv"
	"time"

	"github.com/carlosq-mv/moist-sports/types"
	"github.com/golang-jwt/jwt/v5"
)

var SecretKey = []byte(os.Getenv("SECRET_KEY"))

func CreateToken(u *types.User) (string, error) {
	// create a new token with users username and email. Issuer is the users id and expires in 24 hours
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": u.Username,
		"email":    u.Email,
		"iss":      strconv.FormatUint(uint64(u.Id), 10),
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
