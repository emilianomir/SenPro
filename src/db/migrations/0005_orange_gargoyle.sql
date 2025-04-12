CREATE TABLE `sessions` (
	`id` integer,
	`userEmail` text PRIMARY KEY NOT NULL,
	`expiresAt` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`userEmail`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
