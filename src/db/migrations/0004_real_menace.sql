PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_history` (
	`userEmail` text NOT NULL,
	`sAddress` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	PRIMARY KEY(`userEmail`, `sAddress`, `created_at`),
	FOREIGN KEY (`userEmail`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_history`("userEmail", "sAddress", "created_at") SELECT "userEmail", "sAddress", "created_at" FROM `history`;--> statement-breakpoint
DROP TABLE `history`;--> statement-breakpoint
ALTER TABLE `__new_history` RENAME TO `history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;