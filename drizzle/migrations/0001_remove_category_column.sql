-- Drop category column from notes table
-- SQLite doesn't support DROP COLUMN directly, so we recreate the table

CREATE TABLE `notes_new` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

INSERT INTO `notes_new` (`id`, `title`, `content`, `user_id`, `created_at`, `updated_at`)
SELECT `id`, `title`, `content`, `user_id`, `created_at`, `updated_at` FROM `notes`;

DROP TABLE `notes`;

ALTER TABLE `notes_new` RENAME TO `notes`;
