CREATE TABLE `addresses` (
	`user_email` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_email` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `services` (
	`address` text PRIMARY KEY NOT NULL,
	`info` text DEFAULT '[]' NOT NULL
);
