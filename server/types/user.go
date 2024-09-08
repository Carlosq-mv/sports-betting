package types

import (
	"time"

	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel `bun:"table:users,alias:u"`

	Id        int64     `bun:"id,pk,autoincrement" json:"id"`
	Username  string    `bun:"username,unique,notnull" json:"username"`
	Email     string    `bun:"email,unique,notnull" json:"email"`
	Password  string    `bun:"password,notnull" json:"password"`
	LoggedIn  bool      `bun:"logged_in,notnull" json:"logged_in"`
	CreatedAt time.Time `bun:"created_at,notnull,default:current_timestamp" json:"created_at"`
	UpdatedAt time.Time `bun:"updated_at,notnull,default:current_timestamp" json:"updated_at"`
}
