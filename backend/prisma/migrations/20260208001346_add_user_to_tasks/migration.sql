-- Step 1: Add nullable userId columns first
ALTER TABLE `Task` ADD COLUMN `userId` INTEGER NULL;
ALTER TABLE `TaskHistory` ADD COLUMN `userId` INTEGER NULL;

-- Step 2: Create a default user for existing data (if no users exist)
INSERT INTO `User` (`email`, `password`, `name`, `createdAt`, `updatedAt`)
SELECT 'system@system.local', '$2a$10$placeholder', 'System User', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `User` LIMIT 1);

-- Step 3: Update existing tasks and history to use the first user
UPDATE `Task` SET `userId` = (SELECT `id` FROM `User` ORDER BY `id` LIMIT 1) WHERE `userId` IS NULL;
UPDATE `TaskHistory` SET `userId` = (SELECT `id` FROM `User` ORDER BY `id` LIMIT 1) WHERE `userId` IS NULL;

-- Step 4: Make userId NOT NULL after populating
ALTER TABLE `Task` MODIFY COLUMN `userId` INTEGER NOT NULL;
ALTER TABLE `TaskHistory` MODIFY COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Task_userId_idx` ON `Task`(`userId`);

-- CreateIndex
CREATE INDEX `TaskHistory_userId_idx` ON `TaskHistory`(`userId`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
