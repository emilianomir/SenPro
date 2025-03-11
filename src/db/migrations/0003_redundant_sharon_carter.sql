CREATE TABLE `favorites` (
	`userEmail` text NOT NULL,
	`sAddress` text NOT NULL,
	PRIMARY KEY(`userEmail`, `sAddress`),
	FOREIGN KEY (`userEmail`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sAddress`) REFERENCES `services`(`address`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `history` (
	`userEmail` text NOT NULL,
	`sAddress` text NOT NULL,
	PRIMARY KEY(`userEmail`, `sAddress`),
	FOREIGN KEY (`userEmail`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sAddress`) REFERENCES `services`(`address`) ON UPDATE no action ON DELETE no action
);
