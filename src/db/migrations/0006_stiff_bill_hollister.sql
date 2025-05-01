CREATE TABLE `datasession` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userEmail` text,
	`expiresAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`info` text DEFAULT '[]' NOT NULL,
	`userResponses` text DEFAULT '[]' NOT NULL,
	FOREIGN KEY (`userEmail`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
