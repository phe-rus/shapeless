CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `Post_name_idx` ON `posts` (`name`);