package utils

import (
	"context"
	"regexp"
	"strings"
	"unicode"

	"github.com/carlosq-mv/moist-sports/pkg/db"
	"github.com/carlosq-mv/moist-sports/types"
	"golang.org/x/crypto/bcrypt"
)

var emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,8}$`)

func HashPassword(p string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(p), 14)
	return string(bytes), err
}

func CheckPasswordHash(p, h string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(h), []byte(p))
	return err == nil
}

func ValidEmail(e string) bool {
	return emailRegex.MatchString(e)
}

func EmailExists(e string, ctx context.Context) bool {
	num, err := db.DB.NewSelect().Model((*types.User)(nil)).Where("email = ?", e).Limit(1).Count(ctx)
	if err != nil {
		return false
	}
	return num > 0
}

func UsernameExists(u string, ctx context.Context) bool {
	num, err := db.DB.NewSelect().Model((*types.User)(nil)).Where("username = ?", u).Limit(1).Count(ctx)
	if err != nil {
		return false
	}
	return num > 0
}

func ValidPassword(p string) (string, bool) {
	var (
		hasUpper     = false
		hasLower     = false
		hasNumber    = false
		hasSpecial   = false
		specialRunes = "!@#$%^&*"
	)

	if len(p) < 8 {
		return "Password must be at least 8 characters long", false
	}

	for _, char := range p {
		switch {
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsDigit(char):
			hasNumber = true
		case unicode.IsSymbol(char) || unicode.IsPunct(char) || strings.ContainsRune(specialRunes, char):
			hasSpecial = true
		}
	}

	if !hasUpper {
		return "Password must contain at least 1 uppercase character", false
	}
	if !hasLower {
		return "Password must contain at least 1 lowercase character", false
	}
	if !hasNumber {
		return "Password must contain at least 1 numeric character (0, 1, 2, ...)", false
	}
	if !hasSpecial {
		return "Password must contain at least 1 special character (@, ;, _, ...)", false
	}

	return "", true

}
