package utils

import (
	"context"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
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
func Is21YearsOld(s string) (bool, error) {
	intDates, err := validDate(s)
	if err != nil {
		return false, err
	}

	now := time.Now().Format("2006-01-02")
	date, err := time.Parse("2006-01-02", now)
	if err != nil {
		return false, err
	}

	year, month, day := date.Date()

	age := year - intDates[0]
	if int(month) < intDates[1] || (int(month) == intDates[1] && day < intDates[2]) {
		age--
	}

	if age < 21 {
		return false, fmt.Errorf("You must be at least 21 years old to register.")
	}

	return true, nil
}

// take in the user input birthday
// helper function for Is21YearsOld function
func validDate(date string) ([]int, error) {
	x := strings.Split(date, "-")
	if len(x) != 3 {
		return nil, fmt.Errorf("Invalid date format. Please use yyyy-mm-dd.")
	}

	year, err := strconv.Atoi(x[0])
	if err != nil || year < 1900 || year > 2400 || len(x[0]) != 4 {
		return nil, fmt.Errorf("Invalid year: '%d'. Enter a valid year in 'yyyy' format", year)
	}

	month, err := strconv.Atoi(x[1])
	if err != nil || month < 1 || month > 12 || len(x[1]) != 2 {
		return nil, fmt.Errorf("Invalid month: '%d'. Enter a month between 01 and 12", month)
	}

	day, err := strconv.Atoi(x[2])
	if err != nil || day < 1 || day > 31 || len(x[2]) != 2 {
		return nil, fmt.Errorf("Invalid day: '%d'. Enter a day between 01 and 31.", day)
	}

	switch month {
	case 2:
		if day > 29 {
			return nil, fmt.Errorf("Month: %d, does not have more than 29 days", month)
		}
	case 4, 6, 9, 11:
		if day > 30 {
			return nil, fmt.Errorf("Month: %d, does not have more than 30 days", month)
		}
	default:
		if day > 31 {
			return nil, fmt.Errorf("Month: %d, does not have more than 31 days", month)
		}
	}
	return []int{year, month, day}, nil
}
