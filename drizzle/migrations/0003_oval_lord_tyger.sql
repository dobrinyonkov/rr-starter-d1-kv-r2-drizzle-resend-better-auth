ALTER TABLE `users` ADD `is_pro` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_customer_id` text;--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_subscription_id` text;