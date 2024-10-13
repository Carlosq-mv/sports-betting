package types

import (
	"time"

	"github.com/uptrace/bun"
)

type Message struct {
	bun.BaseModel `bun:"table:messages,alias:m"`

	Id        int64     `bun:"id,pk,autoincrement" json:"id"`
	ToId      int64     `bun:"to_id,notnull" json:"to_id"`         // Foreign Key to recipient (User)
	SenderId  int64     `bun:"sender_id,notnull" json:"sender_id"` // Foreign Key to sender (User)
	Content   string    `bun:"content,notnull" json:"content"`
	Timestamp time.Time `bun:"timestamp,notnull,default:current_timestamp" json:"timestamp"`
	IsRead    bool      `bun:"is_read,default:false" json:"is_read"`
	IsDeleted bool      `bun:"is_deleted,default:false" json:"is_deleted"`

	// Relationships
	Sender *User `bun:"rel:belongs-to,join:sender_id=id" json:"sender"` // Links SenderId to User.Id
	To     *User `bun:"rel:belongs-to,join:to_id=id" json:"to"`         // Links ToId to User.Id (Recipient)
}
