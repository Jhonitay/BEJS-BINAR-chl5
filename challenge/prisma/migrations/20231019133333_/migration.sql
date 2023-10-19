/*
  Warnings:

  - A unique constraint covering the columns `[bank_account_number]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_number]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `bank_accounts_bank_account_number_key` ON `bank_accounts`(`bank_account_number`);

-- CreateIndex
CREATE UNIQUE INDEX `profile_identity_number_key` ON `profile`(`identity_number`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
