package types

import (
	"github.com/uptrace/bun"
)

type Friend struct {
	bun.BaseModel `bun:"table:friends,alias:f"`

	Id       int64 `bun:"id,pk,autoincrement" json:"id"`
	FriendId int64 `bun:"friend_id,notnull" json:"friend_id"` // Foreign Key to User (the recipient)

	// Relationships
	Friend *User `bun:"rel:belongs-to,join:friend_id=id" json:"friend"` // User who is being friended
}
