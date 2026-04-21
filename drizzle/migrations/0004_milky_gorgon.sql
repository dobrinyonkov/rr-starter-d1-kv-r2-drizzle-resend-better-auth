ALTER TABLE `users` ADD `stripe_period_end` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_cancel_at_period_end` integer DEFAULT false NOT NULL;